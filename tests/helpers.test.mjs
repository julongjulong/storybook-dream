// v5 helpers: the line chaser (case 4+) and the fuse (case 6+).
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine } from '../src/engine.js';
import { FUSE } from '../src/game/config.js';
import { STORY } from '../src/story-data.js';

const make = index => {
  const g = new GameEngine({ stage: STORY.worlds[index - 1] });
  g.attackClock = 999; // keep the boss quiet
  g.grace = 0;
  return g;
};
const run = (g, seconds, dt = 1 / 120) => {
  for (let t = 0; t < seconds - 1e-9; t += dt) g.step(dt);
};
// Walk out 4 cells with Space held, then stop.
const standOut = g => {
  g.setDrawHeld(true);
  for (let i = 0; i < 4; i++) g.move(0, 1);
  g.setDirection(0, 0);
};

test('from case 4 the first helper chases; earlier cases only have flashing helpers', () => {
  assert.ok(
    make(3)
      .enemies.filter(e => !e.boss)
      .every(e => e.behavior === 'rush_wander'),
  );
  const four = make(4).enemies.filter(e => !e.boss);
  assert.equal(four.find(e => e.id === 1).behavior, 'chaser');
  assert.ok(four.some(e => e.behavior === 'rush_wander'));
});

test('the chaser closes in on a rabbit that is out drawing', () => {
  const g = make(4);
  g.enemies = g.enemies.filter(e => e.behavior === 'chaser');
  const c = g.enemies[0];
  Object.assign(c, { x: 40, y: 30 });
  standOut(g);
  g.grace = 99;
  const dist = () => Math.hypot(c.x - (g.visualPlayer.x + 0.5), c.y - (g.visualPlayer.y + 0.5));
  const before = dist();
  run(g, 1.5);
  assert.ok(dist() < before - 5, `${dist()} vs ${before}`);
});

test('a checkpoint keeps the chaser a chaser', () => {
  const g = make(5);
  const r = new GameEngine({ stage: STORY.worlds[4], snapshot: g.snapshot() });
  assert.equal(r.enemies.find(e => e.id === 1).behavior, 'chaser');
});

test('no fuse before case 6', () => {
  const g = make(5);
  g.enemies = g.enemies.filter(e => e.boss);
  standOut(g);
  run(g, FUSE.wait + 3);
  assert.equal(g.fuse, null);
  assert.equal(g.lives, 3);
});

test('standing still on a line lights a fuse that runs to the rabbit and costs a heart', () => {
  const events = [];
  const g = make(6);
  g.onEvent = e => events.push(e);
  g.enemies = g.enemies.filter(e => e.boss);
  Object.assign(g.enemies[0], { x: 60, y: 40 });
  standOut(g);
  run(g, FUSE.wait - 0.1);
  assert.equal(g.fuse, null);
  run(g, 0.2);
  assert.ok(g.fuse);
  assert.ok(events.some(e => e.type === 'fuse'));
  run(g, g.trail.length / FUSE.speed + 0.2);
  assert.equal(g.lives, 2);
  assert.equal(g.trail.length, 0);
});

test('walking again puts the fuse out', () => {
  const g = make(6);
  g.enemies = g.enemies.filter(e => e.boss);
  Object.assign(g.enemies[0], { x: 60, y: 40 });
  standOut(g);
  run(g, FUSE.wait + 0.3);
  assert.ok(g.fuse);
  g.setDirection(0, 1);
  run(g, 0.05);
  assert.equal(g.fuse, null);
  assert.equal(g.lives, 3);
});
