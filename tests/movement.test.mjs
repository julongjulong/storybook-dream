// v5 movement: the rabbit glides cell to cell, and what you see is where hits land.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, PLAYER_SPEEDS } from '../src/engine.js';

const create = () => {
  const g = new GameEngine({ stage: { id: 'pigs', index: 3 } });
  g.enemies = [];
  g.profile = { ...g.profile, patterns: [] };
  g.grace = 0;
  return g;
};
const run = (g, seconds, dt = 1 / 120) => {
  for (let i = 0; i < Math.round(seconds / dt); i++) g.step(dt);
};

test('holding a direction walks at the stage speed after a short start-up', () => {
  const g = create();
  g.setDirection(1, 0);
  run(g, 1);
  const walked = g.player.x - 12;
  assert.ok(
    walked >= Math.floor(PLAYER_SPEEDS[0] * 0.9) && walked <= Math.ceil(PLAYER_SPEEDS[0]),
    `walked ${walked}`,
  );
});

test('the visible rabbit sits between its last cell and the next one, never ahead of the rules', () => {
  const g = create();
  g.setDirection(1, 0);
  for (let i = 0; i < 40; i++) {
    g.step(1 / 120);
    const v = g.visualPlayer;
    assert.equal(v.y, g.player.y);
    assert.ok(v.x >= g.player.x && v.x < g.player.x + 1);
  }
});

test('a tap between two frames walks exactly one cell and stops on its centre', () => {
  const g = create();
  g.setDirection(1, 0, { immediate: true });
  g.setDirection(0, 0);
  run(g, 1);
  assert.deepEqual(g.player, { x: 13, y: 1 });
  assert.deepEqual(g.visualPlayer, g.player);
  assert.equal(g.glide, null);
});

test('a step once started finishes even if the key is released halfway', () => {
  const g = create();
  g.setDirection(1, 0);
  run(g, 0.2);
  const x = g.player.x;
  assert.ok(g.glide);
  g.setDirection(0, 0);
  run(g, 0.5);
  assert.equal(g.player.x, x + 1);
  assert.deepEqual(g.visualPlayer, g.player);
});

test('a turn pressed mid-step is taken at the next cell centre without overshooting', () => {
  const g = create();
  g.setDrawHeld(true);
  g.setDirection(0, 1);
  run(g, 0.5);
  const x = g.player.x,
    y = g.player.y;
  assert.ok(g.glide && g.glide.dy === 1);
  g.setDirection(1, 0);
  run(g, 0.3);
  // The step under way finished downward; everything after went right.
  assert.equal(
    g.trail.some(p => p.x === x && p.y === y + 1),
    true,
  );
  assert.equal(
    g.trail.some(p => p.x === x && p.y === y + 2),
    false,
  );
  assert.ok(g.player.x > x);
});

test('without Space the rabbit cannot leave safe ground; with it the trail follows', () => {
  const g = create();
  g.setDirection(0, 1);
  run(g, 0.5);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  g.setDrawHeld(true);
  run(g, 0.5);
  assert.ok(g.trail.length >= 3);
});

test('after releasing Space out on the field the rabbit can only walk back along its line', () => {
  const g = create();
  g.setDrawHeld(true);
  g.setDirection(0, 1);
  run(g, 0.5);
  g.setDrawHeld(false);
  g.setDirection(0, 0);
  run(g, 0.3);
  const length = g.trail.length;
  g.setDirection(1, 0);
  run(g, 0.3);
  assert.equal(g.trail.length, length);
  g.setDirection(0, -1);
  run(g, 0.2);
  assert.ok(g.trail.length < length);
});

test('the very first step off safe ground can already be hit', () => {
  const g = create();
  g.setDrawHeld(true);
  g.setDirection(0, 1);
  g.step(1 / 120);
  g.step(1 / 120);
  assert.equal(g.trail.length, 0);
  assert.equal(g.isExposed(), true);
  const v = g.visualPlayer;
  assert.equal(g.touchesTrail(v.x + 0.5, v.y + 0.5, 0.6), true);
  assert.equal(g.damage(), true);
  assert.equal(g.lives, 2);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  assert.deepEqual(g.visualPlayer, g.player);
});

test('walking into a wall or waiting builds up no burst of steps', () => {
  const g = create();
  g.setDirection(0, -1);
  run(g, 2);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  g.setDirection(1, 0);
  g.step(0.1);
  assert.ok(g.player.x <= 13);
});

test('zero, negative and invalid time steps change nothing', () => {
  const g = create();
  g.setDirection(1, 0);
  for (const dt of [0, -1, NaN, Infinity]) g.step(dt);
  assert.deepEqual(g.visualPlayer, { x: 12, y: 1 });
  assert.equal(g.elapsed, 0);
});

test('different frame rates end within one cell of each other', () => {
  const a = create(),
    b = create();
  a.setDirection(1, 0);
  b.setDirection(1, 0);
  run(a, 1, 1 / 120);
  run(b, 1, 1 / 30);
  assert.ok(Math.abs(a.player.x - b.player.x) <= 1);
});

test('the rabbit faces the way it last walked sideways', () => {
  const g = create();
  g.setDirection(-1, 0);
  run(g, 0.3);
  assert.equal(g.facing, -1);
  g.setDirection(0, 0);
  run(g, 0.3);
  assert.equal(g.facing, -1);
});

test('letting go of Space during the first step off safe ground slides the rabbit back home', () => {
  const g = create();
  g.setDrawHeld(true);
  g.setDirection(0, 1);
  run(g, 0.05);
  assert.ok(g.glide && g.visualPlayer.y > 1);
  g.setDrawHeld(false);
  g.setDirection(0, 0);
  run(g, 0.5);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  assert.deepEqual(g.visualPlayer, g.player);
  assert.equal(g.trail.length, 0);
  assert.equal(g.isExposed(), false);
});

test('a hit says what touched the line', () => {
  const events = [];
  const g = create();
  g.onEvent = e => events.push(e);
  g.setDrawHeld(true);
  g.move(0, 1);
  g.grace = 0;
  g.damage('boss');
  assert.equal(events.find(e => e.type === 'hit').by, 'boss');
});
