// Gamepad support: buttons and sticks become the same key events the keyboard sends,
// so every screen (story pages, map, play) works with a controller unchanged.
//   D-pad / left stick  arrows          A  Space (draw, next page, choose)
//   B / Start           Escape (pause)  X Y LB RB  gifts 1-4
const BUTTONS = { 0: 'Space', 1: 'Escape', 9: 'Escape', 2: 'Digit1', 3: 'Digit2', 4: 'Digit3', 5: 'Digit4' };
const DPAD = { 12: 'ArrowUp', 13: 'ArrowDown', 14: 'ArrowLeft', 15: 'ArrowRight' };
const DEAD_ZONE = 0.5;

const held = new Set();
const send = (type, code) =>
  window.dispatchEvent(new KeyboardEvent(type, { code, key: code === 'Space' ? ' ' : code, bubbles: true }));

function pressedCodes(pad) {
  const codes = new Set();
  for (const [index, code] of Object.entries({ ...BUTTONS, ...DPAD }))
    if (pad.buttons[index]?.pressed) codes.add(code);
  const [x = 0, y = 0] = pad.axes;
  // Only the stronger stick axis counts, like a four-way d-pad.
  if (Math.max(Math.abs(x), Math.abs(y)) > DEAD_ZONE)
    codes.add(
      Math.abs(x) > Math.abs(y) ? (x > 0 ? 'ArrowRight' : 'ArrowLeft') : y > 0 ? 'ArrowDown' : 'ArrowUp',
    );
  return codes;
}

let polling = false;
function poll() {
  const pads = [...(navigator.getGamepads?.() || [])].filter(Boolean);
  const now = new Set();
  for (const pad of pads) for (const code of pressedCodes(pad)) now.add(code);
  for (const code of held) if (!now.has(code)) send('keyup', code);
  for (const code of now) if (!held.has(code)) send('keydown', code);
  held.clear();
  for (const code of now) held.add(code);
  if (pads.length) requestAnimationFrame(poll);
  else polling = false;
}

window.addEventListener('gamepadconnected', () => {
  if (polling) return;
  polling = true;
  requestAnimationFrame(poll);
});
