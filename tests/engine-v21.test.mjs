import test from 'node:test';
import assert from 'node:assert/strict';
import { warnV4 } from './v4-patterns.mjs';
import { GameEngine, BOSS_PROFILES, PLAYER_SPEEDS } from '../src/engine.js';
const ids = ['race', 'duck', 'pigs', 'redhood', 'beans', 'ant', 'lion', 'fox', 'wind', 'ax', 'piper', 'troy'];
const game = (index = 3, extra = {}) => new GameEngine({ stage: { id: ids[index - 1], index }, ...extra });
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const tick = (g, seconds) => {
  for (let n = 0; n < Math.round(seconds * 100); n++) g.step(0.01);
};

test('v2.1 star progression gives four visibly distinct speeds independent from retired boosts', () => {
  const events = [],
    g = game(3, { ability: 'shell', onEvent: e => events.push(e) });
  near(g.speed, PLAYER_SPEEDS[0]);
  for (let i = 1; i <= 3; i++) {
    g.pickups = [{ x: 12, y: 2, type: 'speed' }];
    g.collectNearby();
    near(g.speed, PLAYER_SPEEDS[i]);
    assert.equal(events.at(-1).speedLevel, i);
    near(events.at(-1).gain, PLAYER_SPEEDS[i] - PLAYER_SPEEDS[i - 1]);
  }
  g.boost = 8;
  near(g.speed, PLAYER_SPEEDS[3]);
  g.useAbility('shell');
  near(g.speed, PLAYER_SPEEDS[3] * 0.7);
});

test('all enemies have normalized stage velocities and the intended helper counts', () => {
  for (let index = 1; index <= 8; index++) {
    const g = game(index),
      p = BOSS_PROFILES[index - 1];
    assert.equal(g.enemies.length, p.minionCount + 1);
    for (const e of g.enemies) near(Math.hypot(e.vx, e.vy), e.boss ? p.bossSpeed : p.minionSpeed);
  }
});

test('ring warning and emitted shots leave a real ninety-degree exit around their locked target', () => {
  const g = game(5);
  warnV4(g);
  const t = structuredClone(g.telegraphs[0]);
  g.player = { x: 1, y: 1 };
  g.advanceBoss(g.profile.warning);
  assert.equal(g.bullets.length, t.angles.length);
  for (let n = 0; n < g.bullets.length; n++) {
    const b = g.bullets[n];
    near(Math.cos(t.angles[n]), b.vx / Math.hypot(b.vx, b.vy));
    const delta = Math.atan2(Math.sin(t.angles[n] - t.gapAngle), Math.cos(t.angles[n] - t.gapAngle));
    assert.ok(Math.abs(delta) >= Math.PI / 4 - 1e-8);
  }
});

test('rushing helpers flash before accelerating and do not acquire an aimed chase', () => {
  const g = game(4),
    e = g.enemies[1];
  g.attackClock = 100;
  e.intent.remaining = 0;
  const speed = Math.hypot(e.vx, e.vy);
  g.advanceIntent(e, 0.01);
  assert.equal(e.intent.phase, 'warmup');
  g.advanceIntent(e, 0.8);
  assert.equal(e.intent.phase, 'warmup');
  assert.equal(g.advanceIntent(e, 0.11), 1.7);
  assert.equal(e.intent.phase, 'rush');
  near(Math.hypot(e.vx, e.vy), speed);
  warnV4(g);
  assert.equal(e.intent.phase, 'rush');
  assert.equal(g.telegraphs.length, 1);
});

test('freeze preserves helper tells as well as the boss tell', () => {
  const g = game(4, { ability: 'clock' }),
    e = g.enemies[1];
  g.trail = [{ x: 12, y: 2 }];
  e.intent.remaining = 0;
  g.advanceEnemies(0.01, 1);
  const before = structuredClone(e);
  g.useAbility('clock');
  tick(g, 1);
  assert.deepEqual(e, before);
});

test('recovery and cancellation remove every old hazard before the next attack begins', () => {
  const g = game(6);
  g.attackIndex = 1;
  warnV4(g);
  g.firePattern();
  assert.ok(g.bullets.length);
  g.advanceBoss(3.61);
  assert.equal(g.bullets.length, 0);
  assert.equal(g.bossState.phase, 'recover');
  g.attackIndex = 0;
  warnV4(g);
  g.firePattern();
  assert.equal(g.beams.length, 1);
  g.cancelAttack();
  assert.equal(g.beams.length, 0);
  assert.equal(g.telegraphs.length, 0);
});

test('legacy version two checkpoints retain collection and abilities while normalizing enemy speed', () => {
  const g = game(8, { unlockedAbilities: ['shell', 'feather'] });
  g.speedLevel = 2;
  g.useAbility('shell');
  const s = g.snapshot();
  s.engineVersion = 2;
  s.enemies.forEach(e => {
    e.vx = 0.5;
    e.vy = 0.25;
  });
  const r = game(8, { unlockedAbilities: ['shell', 'feather'], snapshot: s });
  assert.equal(r.energy, 2);
  assert.equal(r.availableCharges.shell, 1);
  assert.equal(r.speedLevel, 2);
  assert.equal(r.shield, 3);
  near(Math.hypot(r.enemies[0].vx, r.enemies[0].vy), 9.35);
  assert.equal(r.bossState.phase, 'roam');
});
