import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, PATTERN_SPECS, MAX_BULLETS, ABILITIES, PLAYER_SPEEDS } from '../src/engine.js';
const ids = ['race', 'duck', 'pigs', 'redhood', 'beans', 'ant', 'lion', 'fox', 'wind', 'ax', 'piper', 'troy'];
const game = (index = 3, options = {}) =>
  new GameEngine({ stage: { id: ids[index - 1], index }, ...options });
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
const tick = (g, seconds) => {
  for (let i = 0; i < Math.round(seconds * 100); i++) g.step(0.01);
};
const attack = (g, index = 0) => {
  g.attackIndex = index;
  g.beginWarning();
  const tells = structuredClone(g.telegraphs);
  g.firePattern();
  return tells;
};

test('third chapter introduces one spread before timed double spreads with identical angles', () => {
  const g = game(3);
  attack(g);
  assert.equal(g.bullets.length, 3);
  assert.equal(g.attackWaves.length, 0);
  g.beginRecovery();
  const tells = attack(g, 1);
  assert.equal(g.attackWaves.length, 1);
  assert.equal(g.bullets.length, 3);
  g.player = { x: 68, y: 1 };
  g.advanceBoss(0.74);
  assert.equal(g.bullets.length, 3);
  g.advanceBoss(0.01);
  assert.equal(g.bullets.length, 6);
  for (let i = 0; i < 6; i++) {
    const b = g.bullets[i],
      a = tells[0].angles[i % 3];
    near(b.vx, Math.cos(a) * 11.8);
    near(b.vy, Math.sin(a) * 11.8);
  }
});
test('aimed volley fires three paced shots at the originally shown direction', () => {
  const g = game(4),
    t = attack(g, 1)[0];
  assert.equal(g.bullets.length, 1);
  g.player = { x: 70, y: 40 };
  g.advanceBoss(0.45);
  assert.equal(g.bullets.length, 2);
  g.advanceBoss(0.45);
  assert.equal(g.bullets.length, 3);
  assert.equal(g.attackWaves.length, 0);
  for (const b of g.bullets) {
    near(Math.hypot(b.vx, b.vy), 14.2);
    near(b.vx, Math.cos(t.angle) * 14.2);
  }
});
test('two ring pulses preserve the same ninety degree exit even in their dense phase', () => {
  const g = game(8);
  g.bossState.enraged = true;
  const t = attack(g)[0];
  assert.equal(g.bullets.length, 7);
  g.advanceBoss(0.9);
  assert.equal(g.bullets.length, 14);
  for (const b of g.bullets) {
    near(Math.hypot(b.vx, b.vy), 10.5);
    const delta = Math.atan2(
      Math.sin(Math.atan2(b.vy, b.vx) - t.gapAngle),
      Math.cos(Math.atan2(b.vy, b.vx) - t.gapAngle),
    );
    assert.ok(Math.abs(delta) >= Math.PI / 4 - 1e-8);
  }
});
test('bullet ceiling applies across queued waves and extra emissions', () => {
  const g = game(8);
  g.bossState.enraged = true;
  attack(g);
  g.advanceBoss(0.9);
  const extra = { pattern: 'aimed', x: 50, y: 30, angles: [0] };
  for (let i = 0; i < 20; i++) g.emitWave(extra);
  assert.equal(g.bullets.length, MAX_BULLETS);
});
test('each arm of a cross beam stops at its own claimed wall', () => {
  const g = game(7),
    boss = g.enemies[0];
  boss.x = 40.5;
  boss.y = 20.5;
  for (let y = 2; y < 46; y++) g.cells[g.index(45, y)] = 1;
  const tells = attack(g, 2),
    right = g.beams.find(b => b.angle === 0);
  assert.ok(right.length <= 4.5);
  assert.ok(g.beams.find(b => b.angle === Math.PI).length > 30);
  assert.equal(right.length, tells[0].rays[0].length);
});
test('freeze preserves queued volley timing and does not fire a burst on unfreeze', () => {
  const g = game(4, { unlockedAbilities: ['clock'] });
  attack(g, 1);
  const waves = structuredClone(g.attackWaves),
    bullets = structuredClone(g.bullets);
  g.useAbility('clock');
  tick(g, 4.9);
  assert.deepEqual(g.attackWaves, waves);
  assert.deepEqual(g.bullets, bullets);
  tick(g, 0.2);
  assert.equal(g.bullets.length, 1);
  assert.equal(g.attackWaves.length, 2);
  tick(g, 0.4);
  assert.equal(g.bullets.length, 2);
  assert.equal(g.attackWaves.length, 1);
});
test('large or invalid animation timestamps cannot fast-forward an entire volley', () => {
  const g = game(4);
  attack(g, 1);
  for (const dt of [0, NaN, Infinity, -1]) g.step(dt);
  assert.equal(g.attackWaves[0].remaining, 0.45);
  g.step(90);
  near(g.attackWaves[0].remaining, 0.35);
  assert.equal(g.bullets.length, 1);
});
test('recovery, lantern and capture cancellation remove queued waves as well as visible shots', () => {
  for (const cancel of [g => g.beginRecovery(), g => g.cancelAttack(), g => g.useAbility('lantern')]) {
    const g = game(8, { unlockedAbilities: ['lantern'] });
    attack(g);
    assert.equal(g.attackWaves.length, 1);
    cancel(g);
    assert.equal(g.attackWaves.length, 0);
    assert.equal(g.bullets.length, 0);
    g.advanceBoss(1);
    assert.equal(g.bullets.length, 0);
  }
});
test('v2.1 checkpoints preserve earned territory and stars but discard obsolete attacks and boosts', () => {
  const g = game(8, { unlockedAbilities: ['shell', 'clock'] });
  attack(g);
  const s = g.snapshot();
  s.engineVersion = 3;
  s.cells[8 * 72 + 8] = 1;
  s.speedLevel = 2;
  s.boost = 8;
  s.slow = 5;
  s.availableCharges.slippers = 2;
  s.unlockedAbilities.push('slippers');
  s.ability = 'slippers';
  const r = game(8, { unlockedAbilities: ['shell', 'clock', 'slippers'], snapshot: s });
  assert.equal(r.cells[8 * 72 + 8], 1);
  assert.equal(r.speedLevel, 2);
  assert.equal(r.speed, PLAYER_SPEEDS[2]);
  assert.equal(r.boost, 0);
  assert.equal(r.slow, 0);
  assert.equal(r.bossState.phase, 'roam');
  assert.equal(r.attackWaves.length, 0);
  assert.equal(r.bullets.length, 0);
  assert.deepEqual(r.unlockedAbilities, ['shell', 'clock']);
});
test('malformed queued shots cannot grant new patterns or nonfinite delays', () => {
  const g = game(4);
  attack(g, 1);
  for (const wave of [
    null,
    { pattern: 'ring', x: 40, y: 30, angles: [0], remaining: 0.3 },
    { pattern: 'aimed', x: 40, y: 30, angles: [Infinity], remaining: 0.3 },
    { pattern: 'aimed', x: 40, y: 30, angles: [0], remaining: Infinity },
  ]) {
    const s = g.snapshot();
    s.attackWaves = [wave];
    const r = game(4, { snapshot: s });
    assert.equal(r.attackWaves.length, 0);
    assert.doesNotThrow(() => r.step(0.1));
  }
});
test('only four reusable gifts remain and speed growth is exclusively earned from map stars', () => {
  assert.deepEqual(Object.keys(ABILITIES), ['shell', 'feather', 'lantern', 'clock']);
  const g = game(8, { unlockedAbilities: Object.keys(ABILITIES) });
  assert.deepEqual(g.availableCharges, { shell: 2, feather: 2, lantern: 2, clock: 1 });
  g.boost = 9;
  assert.equal(g.speed, PLAYER_SPEEDS[0]);
});
test('legacy single-gift saves preserve spent energy even when that gift was retired', () => {
  for (const id of ['shell', 'slippers', 'feather', 'brick', 'lantern', 'seed', 'clock', 'apple'])
    for (const charges of [0, 1]) {
      const s = game(8).snapshot();
      s.engineVersion = 1;
      s.ability = id;
      s.charges = charges;
      delete s.availableCharges;
      delete s.energy;
      const r = game(8, { snapshot: s, unlockedAbilities: Object.keys(ABILITIES) }),
        cap = ['clock', 'apple'].includes(id) ? 1 : 2;
      assert.equal(r.energy, 3 - cap + charges, id);
      if (Object.hasOwn(ABILITIES, id)) assert.equal(r.availableCharges[id], charges, id);
      else assert.equal(r.useAbility(id), false, id);
    }
});
test('explicit sanitized energy takes precedence in any checkpoint version and remains bounded', () => {
  for (const version of [undefined, 1, 2, 3, 4])
    for (const [energy, expected] of [
      [0, 0],
      [1, 1],
      [-4, 0],
      [6, 3],
      [1.8, 1],
    ]) {
      const s = game(8).snapshot();
      s.engineVersion = version;
      s.energy = energy;
      s.ability = 'shell';
      s.charges = 2;
      delete s.availableCharges;
      const r = game(8, { snapshot: s, unlockedAbilities: ['shell'] });
      assert.equal(r.energy, expected);
      assert.equal(r.availableCharges.shell, 2);
    }
});
