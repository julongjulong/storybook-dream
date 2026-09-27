// Turns AI-made sprite pictures into small game sprites with a transparent background.
//   in:  assets/v5-source/{sprites,stickers}/<name>.png   (any size, paper or white background)
//   out: assets/v5/{sprites,stickers}/<name>.png          (256 × 256, transparent, centred)
// Run: node scripts/prepare-sprites.mjs   (plain Node, no packages)
import fs from 'node:fs';
import zlib from 'node:zlib';

const SIZE = 256;
const NEAR = 14; // colour distance still counted as pure background
const FAR = 46; // beyond this a pixel is fully the character (between: soft edge, e.g. a glow)
const root = new URL('../', import.meta.url);

// ---- PNG read / write (8-bit RGB or RGBA, non-interlaced) ----
function readPng(buffer) {
  const w = buffer.readUInt32BE(16),
    h = buffer.readUInt32BE(20),
    depth = buffer[24],
    type = buffer[25],
    interlace = buffer[28];
  if (depth !== 8 || ![2, 6].includes(type) || interlace)
    throw new Error('need 8-bit RGB/RGBA non-interlaced PNG');
  const channels = type === 6 ? 4 : 3,
    idat = [];
  for (let i = 8; i < buffer.length;) {
    const len = buffer.readUInt32BE(i),
      kind = buffer.toString('ascii', i + 4, i + 8);
    if (kind === 'IDAT') idat.push(buffer.subarray(i + 8, i + 8 + len));
    i += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat)),
    stride = w * channels,
    rgba = new Uint8Array(w * h * 4);
  let prev = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const filter = raw[y * (stride + 1)],
      line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1)),
      cur = new Uint8Array(stride);
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0,
        b = prev[x],
        c = x >= channels ? prev[x - channels] : 0,
        p = a + b - c,
        pa = Math.abs(p - a),
        pb = Math.abs(p - b),
        pc = Math.abs(p - c);
      const pred =
        filter === 0
          ? 0
          : filter === 1
            ? a
            : filter === 2
              ? b
              : filter === 3
                ? (a + b) >> 1
                : pa <= pb && pa <= pc
                  ? a
                  : pb <= pc
                    ? b
                    : c;
      cur[x] = (line[x] + pred) & 255;
    }
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      rgba[o] = cur[x * channels];
      rgba[o + 1] = cur[x * channels + 1];
      rgba[o + 2] = cur[x * channels + 2];
      rgba[o + 3] = channels === 4 ? cur[x * channels + 3] : 255;
    }
    prev = cur;
  }
  return { w, h, rgba };
}
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = buf => {
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
function writePng({ w, h, rgba }) {
  const chunk = (kind, data) => {
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    out.write(kind, 4, 'ascii');
    data.copy(out, 8);
    out.writeUInt32BE(crc(out.subarray(4, 8 + data.length)), 8 + data.length);
    return out;
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(w, 0);
  header.writeUInt32BE(h, 4);
  header[8] = 8;
  header[9] = 6;
  const raw = Buffer.alloc(h * (w * 4 + 1));
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- background removal ----
function cutOut({ w, h, rgba }) {
  // Background colour: median of the outer ring of pixels.
  const ring = [];
  for (let x = 0; x < w; x += 4) ring.push((0 * w + x) * 4, ((h - 1) * w + x) * 4);
  for (let y = 0; y < h; y += 4) ring.push((y * w + 0) * 4, (y * w + w - 1) * 4);
  const median = k => ring.map(o => rgba[o + k]).sort((a, b) => a - b)[ring.length >> 1];
  const bg = [median(0), median(1), median(2)];
  const dist = i => Math.hypot(rgba[i * 4] - bg[0], rgba[i * 4 + 1] - bg[1], rgba[i * 4 + 2] - bg[2]);
  // Flood from the border through background-like pixels only.
  const reached = new Uint8Array(w * h),
    queue = [];
  const push = i => {
    if (!reached[i] && dist(i) < FAR) {
      reached[i] = 1;
      queue.push(i);
    }
  };
  for (let x = 0; x < w; x++) (push(x), push((h - 1) * w + x));
  for (let y = 0; y < h; y++) (push(y * w), push(y * w + w - 1));
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q],
      x = i % w,
      y = (i / w) | 0;
    if (x > 0) push(i - 1);
    if (x < w - 1) push(i + 1);
    if (y > 0) push(i - w);
    if (y < h - 1) push(i + w);
  }
  const alpha = new Float32Array(w * h).fill(1);
  for (let i = 0; i < w * h; i++)
    if (reached[i]) alpha[i] = Math.min(1, Math.max(0, (dist(i) - NEAR) / (FAR - NEAR)));
  // Keep the character (the biggest piece) and whatever sits right around it, like the red
  // helper's little spikes. Pieces far away, such as a painted frame, are removed.
  const seen = new Uint8Array(w * h),
    parts = [];
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || alpha[start] < 0.03) continue;
    const part = { pixels: [start], minX: w, minY: h, maxX: 0, maxY: 0, strongest: 0 };
    seen[start] = 1;
    for (let q = 0; q < part.pixels.length; q++) {
      const i = part.pixels[q],
        x = i % w,
        y = (i / w) | 0;
      part.strongest = Math.max(part.strongest, alpha[i]);
      part.minX = Math.min(part.minX, x);
      part.maxX = Math.max(part.maxX, x);
      part.minY = Math.min(part.minY, y);
      part.maxY = Math.max(part.maxY, y);
      for (const n of [
        x > 0 ? i - 1 : -1,
        x < w - 1 ? i + 1 : -1,
        y > 0 ? i - w : -1,
        y < h - 1 ? i + w : -1,
      ])
        if (n >= 0 && !seen[n] && alpha[n] >= 0.03) {
          seen[n] = 1;
          part.pixels.push(n);
        }
    }
    parts.push(part);
  }
  const main = parts.reduce((best, p) => (p.pixels.length > best.pixels.length ? p : best), parts[0]);
  const grow = Math.max(main.maxX - main.minX, main.maxY - main.minY) * 0.2,
    near = p =>
      p.maxX >= main.minX - grow &&
      p.minX <= main.maxX + grow &&
      p.maxY >= main.minY - grow &&
      p.minY <= main.maxY + grow;
  // A frame surrounds the character, so its box contains the main piece's box: drop those too.
  const encloses = p =>
    p !== main && p.minX < main.minX && p.minY < main.minY && p.maxX > main.maxX && p.maxY > main.maxY;
  // Real ink is solid; faint specks are just paper grain.
  for (const p of parts)
    if (!near(p) || encloses(p) || p.strongest < 0.9) for (const i of p.pixels) alpha[i] = 0;
  // Un-mix the paper colour from soft edge pixels so no pale halo remains.
  for (let i = 0; i < w * h; i++) {
    const a = alpha[i];
    rgba[i * 4 + 3] = Math.round(a * 255);
    if (a > 0 && a < 1)
      for (let k = 0; k < 3; k++)
        rgba[i * 4 + k] = Math.max(0, Math.min(255, Math.round((rgba[i * 4 + k] - bg[k] * (1 - a)) / a)));
  }
  return { w, h, rgba };
}

// ---- crop to the character, pad, and shrink to SIZE × SIZE (area average, premultiplied) ----
function fit({ w, h, rgba }) {
  let minX = w,
    minY = h,
    maxX = -1,
    maxY = -1;
  // Ignore the outer band where a painted frame may linger.
  const band = Math.round(Math.min(w, h) * 0.08);
  for (let y = band; y < h - band; y++)
    for (let x = band; x < w - band; x++)
      if (rgba[(y * w + x) * 4 + 3] > 40) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  const side = Math.round(Math.max(maxX - minX + 1, maxY - minY + 1) * 1.08),
    cx = (minX + maxX + 1) / 2,
    cy = (minY + maxY + 1) / 2,
    scale = side / SIZE,
    out = new Uint8Array(SIZE * SIZE * 4);
  for (let oy = 0; oy < SIZE; oy++)
    for (let ox = 0; ox < SIZE; ox++) {
      const x0 = cx - side / 2 + ox * scale,
        y0 = cy - side / 2 + oy * scale;
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        n = 0;
      for (let y = Math.floor(y0); y < Math.ceil(y0 + scale); y++)
        for (let x = Math.floor(x0); x < Math.ceil(x0 + scale); x++) {
          n++;
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const o = (y * w + x) * 4,
            al = rgba[o + 3] / 255;
          r += rgba[o] * al;
          g += rgba[o + 1] * al;
          b += rgba[o + 2] * al;
          a += al;
        }
      const o = (oy * SIZE + ox) * 4;
      if (a > 0) {
        out[o] = Math.round(r / a);
        out[o + 1] = Math.round(g / a);
        out[o + 2] = Math.round(b / a);
      }
      out[o + 3] = Math.round((a / n) * 255);
    }
  return { w: SIZE, h: SIZE, rgba: out };
}

for (const folder of ['sprites', 'stickers']) {
  const inDir = new URL(`assets/v5-source/${folder}/`, root),
    outDir = new URL(`assets/v5/${folder}/`, root);
  if (!fs.existsSync(inDir)) continue;
  fs.mkdirSync(outDir, { recursive: true });
  for (const name of fs.readdirSync(inDir).filter(n => n.toLowerCase().endsWith('.png'))) {
    const sprite = fit(cutOut(readPng(fs.readFileSync(new URL(name, inDir)))));
    fs.writeFileSync(new URL(name, outDir), writePng(sprite));
    console.log(`${folder}/${name}`);
  }
}
