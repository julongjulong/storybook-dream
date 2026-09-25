import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, STAGE_IDS, BOSS_PROFILES, PATTERN_SPECS } from '../src/engine.js';
const make = (index = 3, options = {}) =>
  new GameEngine({
    stage: { id: STAGE_IDS[index - 1], index, clue: { x: 36, y: 24, name: '단서' } },
    ...options,
  });
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const expose = g => {
  g.setDrawHeld(true);
  g.move(0, 1);
  g.grace = 0;
};
const lose = g => {
  for (let i = 0; i < 3; i++) {
    expose(g);
    g.damage();
  }
};

test('v4.1 exact attack speeds rise about a quarter while every warning duration stays unchanged', () => {
  assert.equal(PATTERN_SPECS.spread.speed, 11.8);
  assert.equal(PATTERN_SPECS.aimed.speed, 14.2);
  assert.equal(PATTERN_SPECS.ring.speed, 10.5);
  const oldBoss = [3.5, 5.6, 6.3, 7, 7.3, 7.8, 8.2, 8.5, 8.8, 9, 9.2, 9.4],
    warnings = [2.4, 2.2, 2.1, 2, 1.9, 1.9, 1.8, 1.8, 1.8, 1.7, 1.7, 1.6],
    rests = [10, 3.8, 3.6, 3.4, 3.2, 3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4],
    recovery = [3.5, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1, 2];
  for (let i = 0; i < 12; i++) {
    const p = BOSS_PROFILES[i];
    near(p.bossSpeed, i ? Number((oldBoss[i] * 1.1).toFixed(2)) : oldBoss[i]);
    near(p.warning, warnings[i]);
    near(p.rest, i ? Number((rests[i] * 0.85).toFixed(2)) : rests[i]);
    near(p.recovery, i ? Number((recovery[i] * 0.85).toFixed(2)) : recovery[i]);
  }
});
test('three unshielded hits consume three hearts, retain acquired territory and emit one terminal loss', () => {
  const events = [],
    g = make(3, { onEvent: e => events.push(e) });
  g.cells[g.index(5, 8)] = 1;
  g.speedLevel = 2;
  for (let i = 2; i >= 0; i--) {
    expose(g);
    assert.equal(g.damage(), true);
    assert.equal(g.lives, i);
    assert.equal(g.lost, i === 0);
    assert.equal(g.trail.length, 0);
    assert.deepEqual(g.player, g.anchor);
    assert.equal(g.cells[g.index(5, 8)], 1);
    assert.equal(g.speedLevel, 2);
  }
  assert.equal(events.filter(e => e.type === 'hit').length, 3);
  assert.equal(events.filter(e => e.type === 'lose').length, 1);
  assert.deepEqual(
    events.slice(-2).map(e => e.type),
    ['hit', 'lose'],
  );
  assert.equal(events.at(-2).terminal, true);
  assert.equal(g.damage(), false);
});
test('safe ground, hit grace, and all three shield blocks do not consume hearts', () => {
  const g = make(3, { unlockedAbilities: ['shell'] });
  g.grace = 0;
  assert.equal(g.damage(), false);
  g.useAbility('shell');
  expose(g);
  for (let i = 0; i < 3; i++) {
    g.grace = 0;
    assert.equal(g.damage(), true);
    assert.equal(g.lives, 3);
  }
  assert.equal(g.shield, 0);
  assert.equal(g.damage(), false);
  assert.equal(g.lives, 3);
  g.grace = 0;
  g.damage();
  assert.equal(g.lives, 2);
});
test('lost state freezes the world, refuses all input and gifts, and cannot turn into a win', () => {
  const g = make(3, { unlockedAbilities: ['shell', 'clock'] });
  lose(g);
  const before = g.snapshot();
  g.step(0.1);
  g.setDirection(1, 0, { immediate: true });
  g.setDrawHeld(true);
  assert.equal(g.move(1, 0), false);
  assert.equal(g.useAbility('shell'), false);
  assert.equal(g.useAbility('clock'), false);
  g.checkWin();
  assert.deepEqual(g.snapshot(), before);
  assert.equal(g.drawHeld, false);
  assert.deepEqual(g.direction, { x: 0, y: 0 });
  g.cells.fill(1);
  g.checkWin();
  assert.equal(g.won, false);
});
test('a fatal enemy collision ends the frame before other enemies or the boss timer advance', () => {
  const g = make(3);
  g.lives = 1;
  expose(g);
  g.enemies[0].x = 12.5;
  g.enemies[0].y = 2.5;
  g.enemies[0].vx = 0;
  g.enemies[0].vy = 0;
  const helper = { ...g.enemies[1] },
    clock = g.attackClock;
  g.step(0.01);
  assert.equal(g.lost, true);
  assert.equal(g.lives, 0);
  assert.equal(g.enemies[1].x, helper.x);
  assert.equal(g.enemies[1].y, helper.y);
  assert.equal(g.attackClock, clock);
});
test('fatal projectile damage stops remaining projectiles in the same frame and never repeats loss', () => {
  const events = [],
    g = make(3, { onEvent: e => events.push(e) });
  g.lives = 1;
  expose(g);
  g.bullets = [
    { x: 12.4, y: 2.5, vx: 5, vy: 0, life: 1, kind: 'aimed' },
    { x: 30, y: 20, vx: 14.2, vy: 0, life: 1, kind: 'aimed' },
  ];
  g.advanceProjectiles(0.1, 1);
  assert.equal(g.lost, true);
  assert.equal(g.bullets.length, 1);
  assert.equal(g.bullets[0].x, 30);
  const before = g.snapshot();
  g.advanceProjectiles(0.1, 1);
  assert.deepEqual(g.snapshot(), before);
  assert.equal(events.filter(e => e.type === 'lose').length, 1);
});
test('latest checkpoint preserves remaining hearts and zero hearts remain terminal after refresh', () => {
  const g = make(3);
  expose(g);
  g.damage();
  let s = g.snapshot(),
    r = make(3, { snapshot: s });
  assert.equal(s.engineVersion, 6);
  assert.equal(s.balanceVersion, '4.1');
  assert.equal(r.lives, 2);
  assert.equal(r.lost, false);
  lose(r);
  s = r.snapshot();
  const events = [];
  r = make(3, { snapshot: s, onEvent: e => events.push(e) });
  assert.equal(r.lives, 0);
  assert.equal(r.lost, true);
  assert.equal(events.length, 0);
  r.step(10);
  assert.equal(r.lives, 0);
  assert.equal(r.move(1, 0), false);
});
test('terminal checkpoint flag and normalized zero hearts agree even in inconsistent input', () => {
  for (const [lives, lost, expected] of [
    [0, false, 0],
    [3, true, 0],
    [-1, false, 0],
    [8, false, 3],
    [1.9, false, 1],
    [NaN, false, 3],
  ]) {
    const s = make(3).snapshot();
    s.lives = lives;
    s.lost = lost;
    const r = make(3, { snapshot: s });
    assert.equal(r.lives, expected);
    assert.equal(r.lost, expected === 0);
  }
});
test('older checkpoints get three hearts but retain land, stars and energy while attacks reset', () => {
  for (const version of [undefined, 1, 2, 3, 4, 5]) {
    const g = make(3, { unlockedAbilities: ['shell'] });
    g.beginWarning();
    g.cells[g.index(5, 8)] = 1;
    g.speedLevel = 2;
    const s = g.snapshot();
    s.engineVersion = version;
    s.lives = 0;
    s.lost = true;
    s.energy = 1;
    const r = make(3, { snapshot: s, unlockedAbilities: ['shell'] });
    assert.equal(r.lives, 3);
    assert.equal(r.lost, false);
    assert.equal(r.speedLevel, 2);
    assert.equal(r.energy, 1);
    assert.equal(r.cells[g.index(5, 8)], 1);
    assert.equal(r.bossState.phase, 'roam');
    assert.equal(r.telegraphs.length, 0);
  }
});
test('a current high-speed aimed volley keeps its exact velocity, rays, and remaining delays on resume', () => {
  const g = make(4);
  g.attackIndex = 1;
  g.beginWarning();
  let r = make(4, { snapshot: g.snapshot() });
  assert.deepEqual(r.telegraphs, g.telegraphs);
  r.firePattern();
  r.advanceBoss(0.2);
  const s = r.snapshot(),
    again = make(4, { snapshot: s });
  assert.deepEqual(again.bullets, r.bullets);
  assert.deepEqual(again.attackWaves, r.attackWaves);
  near(Math.hypot(again.bullets[0].vx, again.bullets[0].vy), 14.2);
});
test('new fastest boss velocity and valid dash base remain restorable', () => {
  const g = make(12);
  let r = make(12, { snapshot: g.snapshot() });
  near(Math.hypot(r.enemies[0].vx, r.enemies[0].vy), 10.34);
  g.attackIndex = 2;
  g.beginWarning();
  g.firePattern();
  r = make(12, { snapshot: g.snapshot() });
  assert.equal(r.enemies[0].dashing, true);
  r.advanceBoss(1);
  near(Math.hypot(r.enemies[0].vx, r.enemies[0].vy), 10.34);
});
test('damaged terminal save with illegal board coordinates is rejected atomically', () => {
  const g = make(3);
  lose(g);
  const s = g.snapshot();
  s.player.x = -1;
  s.speedLevel = 2;
  const r = make(3, { snapshot: s });
  assert.equal(r.lives, 3);
  assert.equal(r.lost, false);
  assert.equal(r.speedLevel, 0);
  assert.deepEqual(r.player, { x: 12, y: 1 });
});
