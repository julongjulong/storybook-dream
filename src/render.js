import { WIDTH, HEIGHT, PATTERN_SPECS } from './engine.js';
import { isDash } from './game/config.js';

export function strokeRay(ctx, ray, color, dashed = false, scale = { x: 12, y: 12 }) {
  const length = Number.isFinite(ray.length) ? ray.length : 90,
    unit = Math.min(scale.x, scale.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, (ray.width || 0.4) * unit);
  ctx.setLineDash(dashed ? [unit * 0.65, unit * 0.5] : []);
  ctx.beginPath();
  ctx.moveTo(ray.x * scale.x, ray.y * scale.y);
  ctx.lineTo(
    (ray.x + Math.cos(ray.angle) * length) * scale.x,
    (ray.y + Math.sin(ray.angle) * length) * scale.y,
  );
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw the corridor in world coordinates, so non-square viewports transform its
// width as well as its centre line. A scalar screen lineWidth was misleading.
export function dangerRay(ctx, ray, color, scale) {
  const half = ray.width / 2,
    nx = -Math.sin(ray.angle) * half,
    ny = Math.cos(ray.angle) * half;
  const ex = ray.x + Math.cos(ray.angle) * ray.length,
    ey = ray.y + Math.sin(ray.angle) * ray.length;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo((ray.x + nx) * scale.x, (ray.y + ny) * scale.y);
  ctx.lineTo((ex + nx) * scale.x, (ey + ny) * scale.y);
  ctx.lineTo((ex - nx) * scale.x, (ey - ny) * scale.y);
  ctx.lineTo((ray.x - nx) * scale.x, (ray.y - ny) * scale.y);
  ctx.closePath();
  ctx.fill();
  if (ray.rounded)
    for (const [x, y] of [
      [ray.x, ray.y],
      [ex, ey],
    ]) {
      ctx.beginPath();
      ctx.ellipse(x * scale.x, y * scale.y, half * scale.x, half * scale.y, 0, 0, Math.PI * 2);
      ctx.fill();
    }
}

// pose: facing (1 right, -1 left), hop (0..1 through a step), lean (tiptoe while drawing).
function rabbit(ctx, x, y, u, drawing, { facing = 1, hop = 0, lean = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y - Math.sin(hop * Math.PI) * u * 0.22);
  ctx.rotate(lean * facing * 0.16);
  // Squash a little at each landing, stretch mid-hop.
  const stretch = 1 + Math.sin(hop * Math.PI) * 0.06 - (hop > 0.85 ? (hop - 0.85) * 0.5 : 0);
  ctx.scale(u * facing * (2 - stretch), u * stretch);
  ctx.strokeStyle = '#78534d';
  ctx.lineWidth = 0.11;
  const ellipse = (x, y, rx, ry, rotation, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  ellipse(-0.37, -0.95, 0.25, 0.72, -0.2, '#d9a678');
  ellipse(0.37, -0.95, 0.25, 0.72, 0.2, '#d9a678');
  ellipse(-0.37, -1, 0.11, 0.44, -0.2, '#f1b9ac');
  ellipse(0.37, -1, 0.11, 0.44, 0.2, '#f1b9ac');
  ellipse(0, 0, 0.79, 0.72, 0, drawing ? '#f5c886' : '#d9a678');
  ellipse(0, 0.27, 0.53, 0.35, 0, '#fff0d7');
  ctx.fillStyle = '#284d50';
  ctx.beginPath();
  ctx.moveTo(-0.5, 0.64);
  ctx.lineTo(0.56, 0.64);
  ctx.lineTo(0.87, 1.03);
  ctx.lineTo(0.05, 0.79);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#423330';
  for (const dx of [-0.27, 0.27]) {
    ctx.beginPath();
    ctx.arc(dx, -0.06, 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#be7e76';
  ctx.beginPath();
  ctx.arc(0, 0.19, 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function bossIcon(ctx, symbol, x, y, r, now) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(r / 24, r / 24);
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#73597e';
  const circle = (x, y, r, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  const box = (x, y, w, h, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.fill();
    ctx.stroke();
  };
  if (symbol === 'feather') {
    // A black-and-white magpie feather, gently rocking.
    ctx.rotate(Math.sin(now / 600) * 0.3 - 0.6);
    ctx.fillStyle = '#2f3440';
    ctx.beginPath();
    ctx.ellipse(0, -4, 9, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f5f3ee';
    ctx.beginPath();
    ctx.ellipse(3, 6, 5, 12, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 26);
    ctx.lineTo(0, -26);
    ctx.stroke();
  } else if (symbol === 'leafball') {
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.fillStyle = i % 2 ? '#cfab66' : '#9fb36b';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 9, Math.sin(a) * 9, 17, 9, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (symbol === 'bubble') {
    circle(0, 0, 21, '#8cc7dc');
    circle(-16, 13, 8, '#b6e2e9');
    circle(16, -14, 7, '#c7e9ed');
    circle(-7, -8, 5, '#eefbfa');
  } else if (symbol === 'acorn') {
    circle(0, 5, 18, '#ca9661');
    box(-22, -13, 44, 15, '#8d7650');
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(5, -26);
    ctx.stroke();
  } else if (symbol === 'knot') {
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#cda777';
    for (const dx of [-10, 10]) {
      ctx.beginPath();
      ctx.ellipse(dx, 0, 12, 18, dx * 0.02, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-22, 18);
    ctx.lineTo(22, -18);
    ctx.stroke();
  } else if (symbol === 'grapes') {
    for (const [x, y] of [
      [-12, -12],
      [9, -12],
      [-19, 3],
      [0, 3],
      [19, 3],
      [-9, 17],
      [10, 17],
      [0, 29],
    ])
      circle(x, y, 9, '#b69bce');
    ctx.strokeStyle = '#8da779';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(8, -30);
    ctx.stroke();
  } else if (symbol === 'wind') {
    ctx.strokeStyle = '#b5d6e5';
    ctx.lineWidth = 5;
    for (const y of [-13, 0, 13]) {
      ctx.beginPath();
      ctx.moveTo(-23, y);
      ctx.bezierCurveTo(24, y - 15, 28, y + 18, 4, y + 9);
      ctx.stroke();
    }
  } else if (symbol === 'pond') {
    ctx.fillStyle = '#92bccf';
    ctx.beginPath();
    ctx.ellipse(0, 5, 25, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#d7eff0';
    for (const r of [10, 18]) {
      ctx.beginPath();
      ctx.ellipse(0, 5, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (symbol === 'drum') {
    box(-23, -12, 46, 35, '#d29883');
    ctx.fillStyle = '#ffe7c0';
    ctx.beginPath();
    ctx.ellipse(0, -12, 23, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, 1);
    ctx.lineTo(-5, 22);
    ctx.lineTo(5, 1);
    ctx.lineTo(15, 22);
    ctx.stroke();
  } else if (symbol === 'woodduck') {
    ctx.fillStyle = '#dcb377';
    ctx.beginPath();
    ctx.ellipse(-4, 8, 24, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    circle(12, -13, 14, '#e4bf80');
    box(22, -12, 12, 7, '#cf9268');
    circle(15, -17, 2, '#473b49');
    circle(-16, 25, 5, '#936e53');
    circle(12, 25, 5, '#936e53');
    ctx.beginPath();
    ctx.moveTo(-17, 7);
    ctx.lineTo(7, 7);
    ctx.moveTo(-19, 15);
    ctx.lineTo(7, 15);
    ctx.stroke();
  } else if (symbol === 'wheel' || symbol === 'ribbon') {
    ctx.save();
    ctx.rotate(now / 500);
    circle(0, 0, 22, '#656079');
    circle(0, 0, 17, '#c9dfdf');
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 17, Math.sin(a) * 17);
      ctx.stroke();
    }
    circle(0, 0, 4, '#f4c482');
    ctx.restore();
  } else if (symbol === 'pumpkin') {
    ctx.fillStyle = '#eea268';
    ctx.beginPath();
    ctx.ellipse(0, -2, 23, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    box(-7, -11, 14, 22, '#ffe7ad');
    circle(-15, 18, 6, '#ceaa77');
    circle(15, 18, 6, '#ceaa77');
    ctx.strokeStyle = '#70956c';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.quadraticCurveTo(9, -33, 13, -23);
    ctx.stroke();
  } else if (symbol === 'barbell') {
    box(-20, -4, 40, 8, '#87ac82');
    box(-25, -15, 12, 30, '#9bc8b5');
    box(13, -15, 12, 30, '#9bc8b5');
  } else if (symbol === 'brick') {
    box(-22, 1, 24, 16, '#ec91ac');
    box(1, 1, 24, 16, '#f4b2c4');
    box(-12, -15, 25, 16, '#f9c0d2');
  } else if (symbol === 'basket') {
    ctx.beginPath();
    ctx.arc(0, -5, 15, Math.PI, Math.PI * 2);
    ctx.stroke();
    box(-23, -7, 46, 28, '#d6ad78');
    box(-25, -10, 50, 9, '#f2cac3');
    for (let i = -16; i < 20; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 2);
      ctx.lineTo(i, 18);
      ctx.stroke();
    }
  } else if (symbol === 'wateringcan') {
    circle(16, 0, 11, '#bae0df');
    box(-18, -14, 30, 32, '#97ccdf');
    ctx.fillStyle = '#97ccdf';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-32, -15);
    ctx.lineTo(-34, -8);
    ctx.lineTo(-18, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    box(-7, -21, 13, 7, '#bae0df');
  } else if (symbol === 'pillow') {
    box(-25, -17, 50, 34, '#d4c1e6');
    circle(0, 0, 13, '#fff2d6');
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 0);
    ctx.lineTo(7, 3);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#f1ce8a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 21, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b9deea';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(5, -13);
    ctx.moveTo(-4, 3);
    ctx.lineTo(9, -6);
    ctx.stroke();
  }
  ctx.restore();
}

// alpha (0..1): how far the screen is between the previous rule step and the latest one.
let fogLayer = null;
function revealLayer(effects) {
  if (typeof OffscreenCanvas !== 'function') return null;
  fogLayer ??= new OffscreenCanvas(WIDTH, HEIGHT);
  const layerCtx = fogLayer.getContext('2d'),
    image = layerCtx.createImageData(WIDTH, HEIGHT);
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    image.data[i * 4] = 9;
    image.data[i * 4 + 1] = 15;
    image.data[i * 4 + 2] = 29;
    image.data[i * 4 + 3] = Math.round(effects.fogOf(i) * 251);
  }
  layerCtx.putImageData(image, 0, 0);
  return fogLayer;
}

// fx: the Effects instance from fx.js (tests may pass [] for none).
// sprites: loaded images by name (sprites/<name>.png); anything missing falls back to drawn shapes.
export function paintGame(canvas, engine, stage, art, fx, now, alpha = 1, sprites = {}) {
  const effects = fx && !Array.isArray(fx) ? fx : null;
  const blend = (cur, prev) =>
    Number.isFinite(prev) && Math.abs(cur - prev) < 2 ? prev + (cur - prev) * alpha : cur;
  const width = Math.max(1, Math.round(canvas.clientWidth || 864)),
    height = Math.max(1, Math.round(canvas.clientHeight || 576));
  const dpr = Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sx = width / WIDTH,
    sy = height / HEIGHT,
    u = Math.min(sx, sy),
    scale = { x: sx, y: sy };
  const dot = (x, y, r, fill, stroke = null) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, u * 0.14);
      ctx.stroke();
    }
  };
  // Draw a sprite centred at (x, y), size in pixels. Returns false when that picture is not loaded.
  const sprite = (name, x, y, size, { turn = 0, flip = false } = {}) => {
    const img = sprites[name];
    if (!img) return false;
    ctx.save();
    ctx.translate(x, y);
    if (turn) ctx.rotate(turn);
    if (flip) ctx.scale(-1, 1);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
    return true;
  };
  ctx.fillStyle = '#ceded4';
  ctx.fillRect(0, 0, width, height);
  if (effects) {
    const cam = effects.camera(width, height, sx, sy);
    ctx.translate(cam.cx + cam.x, cam.cy + cam.y);
    ctx.scale(cam.scale, cam.scale);
    ctx.translate(-cam.cx, -cam.cy);
  }
  if (art) {
    const img = art.image || art,
      f = art.frame || { x: 0, y: 0, width: 1, height: 1 },
      sw = img.width * f.width,
      sh = img.height * f.height,
      z = Math.min(width / sw, height / sh);
    ctx.fillStyle = '#ddd3bd';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(
      img,
      img.width * f.x,
      img.height * f.y,
      sw,
      sh,
      (width - sw * z) / 2,
      (height - sh * z) / 2,
      sw * z,
      sh * z,
    );
  }
  if (!engine.won) {
    ctx.fillStyle = 'rgba(9,15,29,.985)';
    ctx.beginPath();
    for (let y = 0; y < HEIGHT; y++) {
      let begin = -1;
      for (let x = 0; x <= WIDTH; x++) {
        if (x < WIDTH && !engine.cells[y * WIDTH + x]) {
          if (begin < 0) begin = x;
        } else if (begin >= 0) {
          ctx.rect(begin * sx, y * sy, (x - begin) * sx, sy + 0.3);
          begin = -1;
        }
      }
    }
    ctx.fill();
    // Newly captured cells keep some fog for a moment while the reveal washes across.
    // One pixel per cell, scaled up smoothly: a soft wash with no seams between cells.
    const layer = effects?.revealing ? revealLayer(effects) : null;
    if (layer) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(layer, 0, 0, WIDTH * sx, HEIGHT * sy);
    }
    // A soft warm rim where light meets the dark makes the claimed shape easy to read.
    const edge = (x1, y1, x2, y2) => {
      ctx.moveTo(x1 * sx, y1 * sy);
      ctx.lineTo(x2 * sx, y2 * sy);
    };
    ctx.beginPath();
    for (let y = 2; y < HEIGHT - 2; y++)
      for (let x = 2; x < WIDTH - 2; x++) {
        const i = y * WIDTH + x;
        if (engine.cells[i]) continue;
        if (engine.cells[i - 1]) edge(x, y, x, y + 1);
        if (engine.cells[i + 1]) edge(x + 1, y, x + 1, y + 1);
        if (engine.cells[i - WIDTH]) edge(x, y, x + 1, y);
        if (engine.cells[i + WIDTH]) edge(x, y + 1, x + 1, y + 1);
      }
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ffe9a033';
    ctx.lineWidth = Math.max(2, u * 0.55);
    ctx.stroke();
    ctx.strokeStyle = '#fff4c8aa';
    ctx.lineWidth = Math.max(1, u * 0.12);
    ctx.stroke();
  }
  ctx.strokeStyle = '#fff9';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1.5 * sx, 1.5 * sy, (WIDTH - 3) * sx, (HEIGHT - 3) * sy);
  if (stage.index === 1 && engine.progress < 0.015) {
    ctx.strokeStyle = '#ffedbba0';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 8]);
    ctx.beginPath();
    ctx.moveTo(12.5 * sx, 1.5 * sy);
    ctx.lineTo(12.5 * sx, (engine.clue.y + 4.5) * sy);
    ctx.lineTo((engine.clue.x + 5.5) * sx, (engine.clue.y + 4.5) * sy);
    ctx.lineTo((engine.clue.x + 5.5) * sx, 1.5 * sy);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(2 * sx, 2 * sy, (WIDTH - 4) * sx, (HEIGHT - 4) * sy);
  ctx.clip();
  for (const t of engine.telegraphs) {
    const spec = PATTERN_SPECS[t.type],
      range = spec?.speed && spec?.life ? spec.speed * spec.life : 100;
    const rays =
      t.rays ||
      (t.angles || [t.angle]).map(angle => ({
        angle,
        length: Math.min(isDash(t.type) ? 12 : range, engine.rayLength(t.x, t.y, angle)),
      }));
    for (const ray of rays) {
      const live = { ...t, ...ray, length: Math.min(ray.length, engine.rayLength(t.x, t.y, ray.angle)) };
      dangerRay(
        ctx,
        {
          ...live,
          rounded: t.type !== 'beam',
          width: t.hitWidth || (t.type === 'beam' ? 2.05 : isDash(t.type) ? 2.4 : 1.3),
        },
        '#ffcf6d25',
        scale,
      );
      strokeRay(ctx, { ...live, width: 0.16 }, '#ffde9bd9', true, scale);
    }
    // Curved or forked paths: a soft band with a dashed centre line.
    for (const path of t.paths || []) {
      if (path.length < 2) continue;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      path.forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo'](p.x * sx, p.y * sy));
      ctx.strokeStyle = '#ffcf6d25';
      ctx.lineWidth = u * 1.3;
      ctx.stroke();
      ctx.strokeStyle = '#ffde9bd9';
      ctx.lineWidth = Math.max(1.5, u * 0.16);
      ctx.setLineDash([u * 0.65, u * 0.5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (const w of t.wedges || []) {
      ctx.fillStyle = '#ffcf6d1c';
      ctx.beginPath();
      ctx.moveTo(t.x * sx, t.y * sy);
      for (let i = 0; i <= 16; i++) {
        const a = w.from + ((w.to - w.from) * i) / 16;
        ctx.lineTo((t.x + Math.cos(a) * w.radius) * sx, (t.y + Math.sin(a) * w.radius) * sy);
      }
      ctx.closePath();
      ctx.fill();
    }
    // Circles where something will land; the inner ring closes in as the moment nears.
    for (const spot of t.spots || []) {
      const left = t.duration ? Math.max(0, t.remaining / t.duration) : 0;
      ctx.fillStyle = '#ffcf6d2e';
      ctx.beginPath();
      ctx.ellipse(spot.x * sx, spot.y * sy, spot.r * sx, spot.r * sy, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffde9bd9';
      ctx.lineWidth = Math.max(1.5, u * 0.14);
      ctx.setLineDash([u * 0.5, u * 0.4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(spot.x * sx, spot.y * sy, spot.r * sx * left, spot.r * sy * left, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    if (Number.isFinite(t.gapAngle)) {
      ctx.strokeStyle = '#9fe8cacc';
      ctx.lineWidth = u * 0.35;
      ctx.beginPath();
      ctx.ellipse(
        t.x * sx,
        t.y * sy,
        3 * sx,
        3 * sy,
        0,
        t.gapAngle - t.gapWidth / 2,
        t.gapAngle + t.gapWidth / 2,
      );
      ctx.stroke();
      strokeRay(
        ctx,
        {
          ...t,
          angle: t.gapAngle,
          length: Math.min(10, engine.rayLength(t.x, t.y, t.gapAngle)),
          width: 0.35,
        },
        '#a3ebd4a0',
        true,
        scale,
      );
    }
  }
  for (const beam of engine.beams) {
    dangerRay(ctx, { ...beam, width: beam.width + 0.8 }, '#f9bdc344', scale);
    dangerRay(ctx, beam, '#edb7ddd9', scale);
    strokeRay(ctx, { ...beam, width: 0.23 }, '#fff5db', false, scale);
  }
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  // A ring that keeps widening and fading, so goals are easy to spot in the dark.
  const beacon = (x, y, radius, color, phase) => {
    const t = (((now / 1400 + phase) % 1) + 1) % 1;
    ctx.globalAlpha = 0.55 * (1 - t);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(1.5, u * 0.18);
    ctx.beginPath();
    ctx.arc(x, y, radius * (1 + t * 1.6), 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  for (const p of engine.pickups) {
    const x = (p.x + 0.5) * sx,
      y = (p.y + 0.5) * sy;
    beacon(x, y, u * 0.9, '#ffeb9e', p.x / 7);
    dot(x, y, u * (0.9 + 0.1 * Math.sin(now / 300 + p.x)), '#ffeb9e');
    ctx.fillStyle = '#a6782f';
    ctx.font = `${Math.max(10, u * 1.35)}px sans-serif`;
    ctx.fillText('✦', x, y);
  }
  // The hidden sticker: a faint twinkle in the dark every few seconds, its picture once found.
  if (engine.sticker) {
    const k = engine.sticker,
      kx = (k.x + 0.5) * sx,
      ky = (k.y + 0.5) * sy;
    if (engine.stickerFound) {
      if (!sprite(`sticker-${engine.stage.id}`, kx, ky, u * 2.6)) {
        ctx.font = `${Math.max(14, u * 1.8)}px sans-serif`;
        ctx.fillText(k.icon, kx, ky);
      }
    } else {
      const glint = Math.max(0, Math.sin(now / 700 + k.x) - 0.85) / 0.15;
      if (glint > 0) dot(kx, ky, u * 0.35 * glint, `rgba(255,244,200,${(0.5 * glint).toFixed(2)})`);
    }
  }
  if (engine.clue) {
    const c = engine.clue,
      cx = (c.x + 0.5) * sx,
      cy = (c.y + 0.5) * sy;
    if (!engine.clueFound) {
      beacon(cx, cy, u * 1.5, '#b6e6d7', 0);
      beacon(cx, cy, u * 1.5, '#b6e6d7', 0.5);
    }
    dot(cx, cy, u * 1.5, engine.clueFound ? '#b9e3bc' : '#1c3542', '#b6e6d7');
    ctx.fillStyle = engine.clueFound ? '#305c3e' : '#d5f6e9';
    ctx.font = `bold ${Math.max(13, u * 1.6)}px sans-serif`;
    ctx.fillText(engine.clueFound ? '✓' : '?', cx, cy);
  }
  const current = engine.visualPlayer || engine.player,
    prev = engine.prevVisual,
    visual = { x: blend(current.x, prev?.x), y: blend(current.y, prev?.y) },
    px = (visual.x + 0.5) * sx,
    py = (visual.y + 0.5) * sy;
  if (engine.trail.length || engine.isExposed?.()) {
    // Bright while Space is held; a paler dashed line means "stopped, you can only walk back".
    ctx.strokeStyle = engine.drawHeld ? '#ffe994' : '#e9dcb7';
    ctx.lineWidth = Math.max(2, u * (engine.drawHeld ? 0.4 : 0.3));
    ctx.setLineDash(engine.drawHeld ? [] : [u * 0.5, u * 0.35]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo((engine.anchor.x + 0.5) * sx, (engine.anchor.y + 0.5) * sy);
    // While stepping back along the line, the last cell is already being rewound.
    const cells = engine.glide?.reverse ? engine.trail.slice(0, -1) : engine.trail;
    for (const p of cells) ctx.lineTo((p.x + 0.5) * sx, (p.y + 0.5) * sy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Fuse: a flickering spark running along the line toward the rabbit.
  const spark = engine.fusePoint?.();
  if (spark) {
    const flicker = 0.8 + 0.2 * Math.sin(now / 40);
    dot(spark.x * sx, spark.y * sy, u * 1.1 * flicker, '#ff9b4a55');
    if (!sprite('minion-fuse', spark.x * sx, spark.y * sy, u * 2.2 * flicker))
      dot(spark.x * sx, spark.y * sy, u * 0.5 * flicker, '#ffd08a', '#fff');
  }
  if (effects?.rewind) {
    const { line, life, max } = effects.rewind,
      keep = Math.max(1, Math.ceil((line.length - 1) * (life / max)));
    ctx.strokeStyle = `rgba(255,150,150,${(0.3 + 0.6 * (life / max)).toFixed(2)})`;
    ctx.lineWidth = Math.max(2, u * 0.35);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    line
      .slice(0, keep + 1)
      .forEach((p, i) => ctx[i ? 'lineTo' : 'moveTo']((p.x + 0.5) * sx, (p.y + 0.5) * sy));
    ctx.stroke();
  }
  for (const e of engine.enemies) {
    const x = blend(e.x, engine.prevPos?.get(e)?.x) * sx,
      y = blend(e.y, engine.prevPos?.get(e)?.y) * sy;
    if (e.boss) {
      const state = engine.bossState || {};
      // Tell with the body: squash down and puff up as the move gets closer, with a warm glow.
      const windup =
          state.phase === 'warning' && state.remaining > 0
            ? 1 - state.remaining / (engine.telegraphs[0]?.duration || 1)
            : 0,
        squash = windup ? Math.sin(windup * Math.PI * (2 + windup * 6)) * 0.08 * windup : 0,
        phase2 = !!state.enraged;
      if (windup)
        dot(x, y, u * (2.7 + windup * 1.2), `rgba(255,214,120,${(0.15 + 0.35 * windup).toFixed(2)})`);
      if (phase2) dot(x, y, u * 3.1, 'rgba(255,150,140,0.18)');
      dot(x, y, u * 2.7, engine.freeze > 0 ? '#a5dbe655' : '#fff0e533');
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1 + squash + windup * 0.12, 1 - squash - windup * 0.1);
      // Boss picture for its state: tell → windup, attack → attack, phase two → phase2, else idle.
      const look =
          state.phase === 'warning'
            ? 'windup'
            : state.phase === 'attack'
              ? 'attack'
              : phase2
                ? 'phase2'
                : 'idle',
        name = `boss-${stage.id}-`,
        pick = sprites[name + look]
          ? name + look
          : phase2 && sprites[name + 'phase2']
            ? name + 'phase2'
            : name + 'idle';
      if (!sprite(pick, 0, 0, u * 6 * (phase2 ? 1.08 : 1), { flip: look === 'attack' && e.vx < 0 }))
        bossIcon(ctx, stage.boss.symbol, 0, 0, u * 2.25 * (phase2 ? 1.08 : 1), now);
      ctx.restore();
    } else if (e.behavior === 'chaser' && sprites['minion-chaser']) {
      // Paper boat picture faces right; mirror it when sailing left.
      if (engine.freeze > 0) dot(x, y, u * 1.3, '#a5dbe688');
      sprite('minion-chaser', x, y, u * 2.6, { flip: e.vx < 0 });
    } else if (e.behavior === 'chaser') {
      // Paper boat: a little arrow that shows where it is heading.
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(e.vy, e.vx));
      ctx.fillStyle = engine.freeze > 0 ? '#a5dbe6' : '#f3efe2';
      ctx.strokeStyle = '#6b7c93';
      ctx.lineWidth = Math.max(1, u * 0.14);
      ctx.beginPath();
      ctx.moveTo(u * 1.1, 0);
      ctx.lineTo(-u * 0.8, -u * 0.7);
      ctx.lineTo(-u * 0.45, 0);
      ctx.lineTo(-u * 0.8, u * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#482f3b';
      ctx.beginPath();
      ctx.arc(u * 0.2, 0, u * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      const warming = e.intent?.phase === 'warmup',
        rushing = e.intent?.phase === 'rush',
        red = rushing || (warming && Math.sin(now / 70) > 0),
        color = engine.freeze > 0 ? '#a5dbe6' : red ? '#f16364' : '#b2cfda';
      if (rushing) {
        const speed = Math.hypot(e.vx, e.vy) || 1;
        for (let k = 1; k <= 3; k++)
          dot(
            x - (e.vx / speed) * u * k * 0.7,
            y - (e.vy / speed) * u * k * 0.7,
            u * (0.65 - k * 0.12),
            '#ee656530',
          );
      }
      if (engine.freeze > 0) dot(x, y, u * 1.15, '#a5dbe688');
      if (!sprite(red ? 'minion-wander-red' : 'minion-wander', x, y, u * 2.4)) {
        dot(x, y, u * 0.95, color, '#fff9');
        ctx.fillStyle = '#482f3b';
        ctx.font = `bold ${Math.max(10, u * 1.2)}px sans-serif`;
        ctx.fillText(red ? '!' : '•', x, y);
      }
      if (warming) {
        ctx.strokeStyle = '#ffb9a3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, u * 1.35, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
  for (const b of engine.bullets) {
    const x = blend(b.x, engine.prevPos?.get(b)?.x) * sx,
      y = blend(b.y, engine.prevPos?.get(b)?.y) * sy;
    if (b.kind === 'crumb') {
      // Bread crumbs lie still and fade out in their last second.
      ctx.globalAlpha = Math.min(1, b.life);
      if (!sprite('shot-crumb', x, y, u * 1.15)) {
        dot(x, y, u * 0.45, '#d9a45b', '#7a4f2a');
        dot(x - u * 0.12, y - u * 0.12, u * 0.12, '#f6d9a8');
      }
      ctx.globalAlpha = 1;
      continue;
    }
    if (b.kind === 'drop') {
      // A splash: a ring spreading over the hit circle.
      const t = 1 - b.life / 0.45;
      ctx.strokeStyle = '#9ed8f0';
      ctx.lineWidth = Math.max(2, u * 0.25);
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        (b.r || 1) * sx * (0.4 + 0.6 * t),
        (b.r || 1) * sy * (0.4 + 0.6 * t),
        0,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      // The drop itself lands and shrinks into the splash.
      if (!sprite('shot-raindrop', x, y, u * 1.6 * Math.max(0.2, 1 - t))) dot(x, y, u * 0.5, '#bfe6f5');
      continue;
    }
    if (b.kind === 'grape') {
      // Grapes blink faster just before they pop.
      const soon = b.popAt - (b.age || 0) < 0.4 && Math.sin(now / 45) > 0;
      if (!sprite('shot-grape', x, y, u * (soon ? 1.9 : 1.6))) {
        dot(x, y, u * 0.75, soon ? '#e0b6ff' : '#9b6fc2', '#fff');
        dot(x - u * 0.2, y - u * 0.22, u * 0.18, '#fffd');
      }
      continue;
    }
    if (
      b.kind === 'leaf' &&
      sprite('shot-leaf', x, y, u * 1.5, { turn: Math.atan2(b.vy, b.vx) + Math.PI / 2 })
    )
      continue;
    if (b.kind === 'leaf' || b.kind === 'feather') {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.atan2(b.vy, b.vx));
      ctx.fillStyle = b.kind === 'feather' ? '#2f3440' : '#9fd18b';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = Math.max(1, u * 0.1);
      ctx.beginPath();
      ctx.ellipse(0, 0, u * 0.7, u * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      continue;
    }
    if (b.kind === 'notes' && sprite('shot-note', x, y, u * 1.4)) continue;
    if (b.kind === 'notes') {
      dot(x, y, u * 0.5, '#f7c6d9', '#fff');
      ctx.fillStyle = '#6b3b57';
      ctx.font = `bold ${Math.max(10, u * 1.1)}px sans-serif`;
      ctx.fillText('♪', x, y);
      continue;
    }
    const colors = {
      ring: '#f4d398',
      pulse: '#f4d398',
      aimed: '#d7b2eb',
      sprinkler: '#f4a3b5',
      split: '#cda777',
      seed: '#c7a6e6',
    };
    if (b.kind === 'seed' ? sprite('shot-grape', x, y, u * 0.9) : sprite('shot-bubble', x, y, u * 1.3))
      continue;
    dot(x, y, u * (b.kind === 'seed' ? 0.38 : 0.5), colors[b.kind] || '#a9dbe8', '#fff');
    dot(x - u * 0.12, y - u * 0.14, u * 0.13, '#fffd');
  }
  for (const p of effects?.sparks || []) {
    ctx.globalAlpha = Math.max(0, p.life / p.max);
    dot(p.x * sx, p.y * sy, u * (0.12 + 0.2 * (p.life / p.max)), p.color);
  }
  ctx.globalAlpha = 1;
  if (engine.isExposed?.() && !engine.glide) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 160);
    ctx.strokeStyle = `rgba(255,110,110,${(0.45 + 0.45 * pulse).toFixed(2)})`;
    ctx.lineWidth = Math.max(2, u * 0.22);
    ctx.beginPath();
    ctx.arc(px, py, u * (1.35 + 0.2 * pulse), 0, Math.PI * 2);
    ctx.stroke();
  }
  if (engine.shield > 0 || engine.grace > 0) {
    ctx.strokeStyle = engine.shield ? '#9ce6d8' : '#fff7b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, u * 1.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  rabbit(ctx, px, py, Math.max(3, u * 0.85), engine.drawHeld, {
    facing: engine.facing || 1,
    hop: engine.glide ? engine.glide.t : 0,
    lean: engine.drawHeld ? 1 : 0,
  });
  for (const p of effects?.popups || []) {
    const t = p.life / p.max,
      grow = t > 0.85 ? 1 + (t - 0.85) * 3 : 1;
    ctx.globalAlpha = Math.min(1, t * 2.5);
    ctx.font = `900 ${Math.round(Math.max(14, u * 1.6 * p.size * grow))}px sans-serif`;
    ctx.lineWidth = Math.max(3, u * 0.35);
    ctx.strokeStyle = '#2b2233cc';
    ctx.strokeText(p.text, p.x * sx, p.y * sy);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x * sx, p.y * sy);
  }
  ctx.globalAlpha = 1;
  return visual;
}
