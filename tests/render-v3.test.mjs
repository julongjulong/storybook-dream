import test from 'node:test';
import assert from 'node:assert/strict';
import { paintGame } from '../src/render.js';
import { GameEngine } from '../src/engine.js';
import { STORY } from '../src/story-data.js';

function surface(width, height) {
  const lines = [],
    arcs = [],
    context = {
      lineTo(x, y) {
        assert.ok(Number.isFinite(x) && Number.isFinite(y));
        lines.push({ x, y, color: this.strokeStyle, dashed: !!this.dash?.length });
      },
      setLineDash(dash) {
        this.dash = dash;
      },
      arc(x, y, r) {
        assert.ok(Number.isFinite(x) && Number.isFinite(y) && r >= 0);
        arcs.push({ x, y, r });
      },
    };
  const ctx = new Proxy(context, {
    get: (target, key) => (key in target ? target[key] : () => {}),
    set: (target, key, value) => {
      target[key] = value;
      return true;
    },
  });
  return {
    canvas: { width: 864, height: 576, clientWidth: width, clientHeight: height, getContext: () => ctx },
    lines,
    arcs,
  };
}

test('wide and portrait arenas resize the drawing buffer and keep circles round with finite coordinates', () => {
  for (const [width, height] of [
    [1600, 760],
    [390, 630],
    [830, 235],
  ]) {
    const s = surface(width, height),
      g = new GameEngine({ stage: STORY.worlds[0] });
    paintGame(s.canvas, g, STORY.worlds[0], null, [], 100);
    assert.equal(s.canvas.width, width);
    assert.equal(s.canvas.height, height);
    assert.ok(s.arcs.length > 0);
  }
});

test('a discovered illustration stays entirely visible in wide and portrait arenas without adjacent comic panels', () => {
  const img = { width: 1254, height: 1254 },
    frame = { x: 0.51, y: 0.34, width: 0.48, height: 0.32 };
  for (const [width, height] of [
    [1600, 760],
    [390, 630],
    [830, 235],
  ]) {
    const s = surface(width, height),
      ctx = s.canvas.getContext('2d'),
      calls = [];
    ctx.drawImage = (...args) => calls.push(args);
    const stage = STORY.worlds[0],
      g = new GameEngine({ stage });
    paintGame(s.canvas, g, stage, { image: img, frame }, [], 100);
    assert.equal(calls.length, 1);
    const [actual, sx, sy, sw, sh, dx, dy, dw, dh] = calls[0];
    assert.equal(actual, img);
    assert.equal(sx, img.width * frame.x);
    assert.equal(sy, img.height * frame.y);
    assert.equal(sw, img.width * frame.width);
    assert.equal(sh, img.height * frame.height);
    assert.ok(dx >= -1e-8 && dy >= -1e-8 && dx + dw <= width + 1e-8 && dy + dh <= height + 1e-8);
    assert.ok(Math.abs(dw / dh - sw / sh) < 1e-8, 'preserves picture proportions');
    assert.ok(Math.abs(dw - width) < 1e-8 || Math.abs(dh - height) < 1e-8, 'fills at least one axis');
  }
});
