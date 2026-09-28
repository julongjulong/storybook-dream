// Time of day, helpers with clear jobs, and heart pieces.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, WIDTH } from '../src/engine.js';
import { DAYLIGHT, HEART_PIECES } from '../src/game/config.js';
import { STORY } from '../src/story-data.js';

const make = (index, extra = {}) => {
  const events = [];
  const g = new GameEngine({ stage: STORY.worlds[index - 1], onEvent: e => events.push(e), ...extra });
  g.events = events;
  return g;
};
const helpers = g => g.enemies.filter(e => !e.boss);
const run = (g, seconds, dt = 1 / 60) => {
  for (let t = 0; t < seconds - 1e-9; t += dt) g.step(dt);
};

test('noon at two minutes brings one more helper, with a warning half a minute before', () => {
  const g = make(5);
  const before = helpers(g).length;
  g.elapsed = DAYLIGHT.noon - DAYLIGHT.warning - 0.05;
  run(g, 0.1);
  assert.ok(g.events.some(e => e.type === 'daylight-soon' && e.phase === 'noon'));
  assert.equal(helpers(g).length, before);
  g.elapsed = DAYLIGHT.noon - 0.05;
  run(g, 0.1);
  assert.equal(g.daylightPhase(), 'noon');
  assert.equal(helpers(g).length, before + 1);
  assert.equal(g.events.filter(e => e.type === 'daylight' && e.phase === 'noon').length, 1);
});

test('night at four minutes brings a paper boat and a faster boss that rests less', () => {
  const g = make(5);
  g.elapsed = DAYLIGHT.noon + 1;
  const dayRest = g.profile.rest;
  const before = helpers(g).length;
  g.elapsed = DAYLIGHT.night - 0.05;
  run(g, 0.1);
  assert.equal(g.daylightPhase(), 'night');
  const newcomer = helpers(g).at(-1);
  assert.equal(helpers(g).length, before + 1);
  assert.equal(newcomer.behavior, 'chaser');
  const boss = g.enemies.find(e => e.boss);
  g.attackClock = 99;
  g.bossState.phase = 'roam';
  run(g, 0.2);
  assert.ok(Math.abs(Math.hypot(boss.vx, boss.vy) - g.profile.bossSpeed * DAYLIGHT.nightBossSpeed) < 1e-6);
  assert.equal(g.nightScale(DAYLIGHT.nightRest), DAYLIGHT.nightRest);
  assert.ok(dayRest > 0);
});

test('newcomers appear on open ground away from the rabbit, and never beyond the helper limit', () => {
  const g = make(12);
  for (let i = 0; i < 10; i++) g.spawnHelper('rush_wander');
  assert.ok(g.enemies.length <= DAYLIGHT.maxEnemies);
  for (const h of helpers(g)) {
    assert.ok(!g.blocked(h.x, h.y));
  }
});

test('the tutorial and the final chapter get no helpers, only the passing of time', () => {
  const g = make(1);
  g.elapsed = DAYLIGHT.night - 0.05;
  run(g, 0.1);
  assert.equal(helpers(g).length, 0);
  assert.ok(g.events.some(e => e.type === 'daylight' && e.phase === 'night'));
});

test('a checkpoint after noon keeps its helpers and does not bring another', () => {
  const g = make(6);
  g.elapsed = DAYLIGHT.noon + 5;
  g.spawnHelper('rush_wander');
  const count = g.enemies.length;
  const r = new GameEngine({ stage: STORY.worlds[5], snapshot: g.snapshot() });
  r.onEvent = () => {};
  run(r, 1);
  assert.equal(r.enemies.length, count);
  assert.equal(r.daylightPhase(), 'noon');
});

test('a dust bunny charges straight at a rabbit that is out drawing after its red flash', () => {
  const g = make(5);
  g.enemies = g.enemies.filter(e => e.behavior === 'rush_wander').slice(0, 1);
  const bunny = g.enemies[0];
  Object.assign(bunny, { x: 40, y: 30, vx: 0, vy: -4 });
  g.setDrawHeld(true);
  for (let i = 0; i < 6; i++) g.move(0, 1);
  bunny.intent = { phase: 'warmup', remaining: 0.01, angle: 0 };
  g.advanceIntent(bunny, 0.02);
  assert.equal(bunny.intent.phase, 'rush');
  const v = g.visualPlayer,
    toward = Math.atan2(v.y + 0.5 - bunny.y, v.x + 0.5 - bunny.x);
  assert.ok(Math.abs(Math.atan2(bunny.vy, bunny.vx) - toward) < 1e-6);
  // On safe ground it just speeds up in its old direction.
  const calm = make(5);
  const c = calm.enemies.find(e => e.behavior === 'rush_wander');
  Object.assign(c, { vx: 0, vy: -4 });
  c.intent = { phase: 'warmup', remaining: 0.01, angle: 0 };
  calm.advanceIntent(c, 0.02);
  assert.deepEqual([c.vx, c.vy], [0, -4]);
});

test('a paper boat heads for where the rabbit is going, not where it is', () => {
  const g = make(4);
  const boat = g.enemies.find(e => e.behavior === 'chaser');
  g.enemies = [boat];
  g.setDrawHeld(true);
  g.player = { x: 30, y: 1 };
  g.anchor = { ...g.player };
  for (let i = 0; i < 4; i++) g.move(0, 1);
  g.setDirection(1, 0);
  Object.assign(boat, { x: 50, y: 20, vx: 0, vy: 1 });
  for (let i = 0; i < 200; i++) g.steerChaser(boat, 1 / 60);
  const heading = Math.atan2(boat.vy, boat.vx),
    v = g.visualPlayer,
    lead = Math.atan2(v.y + 0.5 - boat.y, v.x + 0.5 + 4 - boat.x);
  assert.ok(Math.abs(heading - lead) < 0.05);
});

test('trapping helpers leaves heart pieces; three mend a heart, or wait as a spare', () => {
  const g = make(5);
  g.lives = 2;
  g.heartPieces = HEART_PIECES - 1;
  const bunny = g.enemies.find(e => !e.boss);
  bunny.x = 4.5;
  bunny.y = 4.5;
  g.enemies = [g.enemies.find(e => e.boss), bunny];
  g.setDrawHeld(true);
  g.player = { x: 8, y: 1 };
  g.anchor = { ...g.player };
  for (let i = 0; i < 7; i++) g.move(0, 1);
  for (let i = 0; i < 7; i++) g.move(-1, 0);
  assert.ok(g.events.some(e => e.type === 'heartpiece'));
  assert.equal(g.lives, 3);
  assert.equal(g.heartPieces, 0);
  assert.ok(g.events.some(e => e.type === 'heal'));
  // Full hearts: pieces wait, then soak up the next hit.
  const s = make(5);
  s.heartPieces = HEART_PIECES;
  s.setDrawHeld(true);
  s.move(0, 1);
  s.grace = 0;
  s.damage('boss');
  assert.equal(s.lives, 3);
  assert.equal(s.heartPieces, 0);
  assert.equal(s.snapshot().heartPieces, 0);
  assert.ok(WIDTH > 0);
});
