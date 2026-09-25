export function jpegSize(bytes) {
  if (bytes[0] !== 255 || bytes[1] !== 216) throw Error('Not a JPEG');
  const starts = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  for (let at = 2; at < bytes.length;) {
    if (bytes[at++] !== 255) throw Error('Invalid JPEG marker');
    while (bytes[at] === 255) at++;
    const marker = bytes[at++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = bytes.readUInt16BE(at);
    if (length < 2 || at + length > bytes.length) throw Error('Invalid JPEG length');
    if (starts.has(marker)) return { height: bytes.readUInt16BE(at + 3), width: bytes.readUInt16BE(at + 5) };
    at += length;
  }
  throw Error('JPEG dimensions unavailable');
}
