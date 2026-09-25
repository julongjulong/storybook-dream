// v5 game-feel effects react to engine events on real time.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, WIDTH } from '../src/engine.js';
import { Effects } from '../src/fx.js';

const sounds = [];
const audio = { effect: (name, options) => sounds.push({ name, ...options }) };

function captureOnce() {
  const events = [];
  const g = new GameEngine({ stage: { id: 'pigs', index: 3 }, onEvent: e => events.push(e) });
  g.enemies = [];
  g.setDrawHeld(true);
  // A straight cut from the top border to the bottom one claims the narrow left strip.
  while (g.trail.length || g.player.y === 1) if (!g.move(0, 1)) break;
  return { g, capture: events.find(e => e.type === 'capture') };
}

test('a capture reports the line and every newly claimed cell', () => {
  const { g, capture } = captureOnce();
  assert.ok(capture.line.length >= 6);
  assert.ok(capture.claimed.length > capture.line.length);
  for (const i of capture.claimed) assert.equal(g.cells[i], 1);
  assert.ok(g.cellsVersion > 0);
});

test('fog lifts from the closed line outward, then clears completely', () => {
  const { capture } = captureOnce();
  const fx = new Effects(audio);
  fx.onEvent(capture);
  const near = capture.line[2].y * WIDTH + capture.line[2].x,
    far = capture.claimed.reduce((a, b) => (b % WIDTH < a % WIDTH ? b : a));
  fx.update(0.05);
  assert.ok(fx.fogOf(near) < fx.fogOf(far));
  for (let i = 0; i < 20; i++) fx.update(0.05);
  assert.equal(fx.revealing, false);
  assert.equal(fx.fogOf(far), 0);
});

test('a capture shows its share of the board and sounds brighter when bigger', () => {
  sounds.length = 0;
  const fx = new Effects(audio);
  fx.onEvent({ type: 'capture', gain: 0.03, line: [], claimed: [5 * WIDTH + 5] });
  fx.onEvent({ type: 'capture', gain: 0.2, line: [], claimed: [5 * WIDTH + 5] });
  assert.deepEqual(
    fx.popups.map(p => p.text),
    ['+3%', '+20%', '와!'],
  );
  assert.equal(sounds[0].name, 'capture');
  assert.equal(sounds[1].name, 'capture-big');
  assert.ok(fx.shake > 0 && fx.zoom);
});

test('a hit freezes the rules briefly, shakes, and rewinds the lost line', () => {
  const fx = new Effects(audio);
  fx.onEvent({
    type: 'hit',
    line: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
    ],
  });
  assert.equal(fx.timeScale, 0);
  assert.ok(fx.rewind && fx.heartBump > 0);
  fx.update(0.2);
  assert.equal(fx.timeScale, 1);
  fx.update(0.3);
  assert.equal(fx.rewind, null);
});

test('finding the clue slows time, zooms toward it and names it', () => {
  const fx = new Effects(audio);
  fx.onEvent({ type: 'clue', clue: { name: '할머니 집 열쇠', x: 34, y: 25 } });
  assert.ok(fx.timeScale > 0 && fx.timeScale < 1);
  assert.equal(fx.zoom.x, 34.5);
  assert.match(fx.popups[0].text, /할머니 집 열쇠 발견!/);
  fx.update(1.2);
  assert.equal(fx.timeScale, 1);
  assert.equal(fx.zoom, null);
});
