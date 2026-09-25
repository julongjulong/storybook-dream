import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, WIDTH, HEIGHT, ABILITIES, BOSS_PROFILES } from '../src/engine.js';
const make = (options = {}) => {
  const game = new GameEngine({ stage: { id: 'race' }, ...options });
  game.setDrawHeld(true);
  return game;
};
function cut(g, x) {
  g.player = { x, y: 1 };
  g.anchor = { ...g.player };
  for (let y = 2; y <= HEIGHT - 2; y++) g.move(0, 1);
}

test('first scene starts slow, with a safe border and no cleared interior', () => {
  const g = make();
  assert.equal(g.speed, 7);
  assert.equal(g.progress, 0);
  assert.equal(g.target, 0.42);
  assert.equal(g.enemies.length, 1);
  assert.ok(g.isSafe(12, 1));
});
test('a smaller enclosed region captures the boss inside instead of protecting boss territory', () => {
  const events = [];
  const g = make({ onEvent: e => events.push(e) });
  g.enemies = [
    { id: 0, x: 9, y: 20, vx: 1, vy: 1, boss: true },
    { id: 1, x: 50, y: 30, vx: 1, vy: 1, boss: false },
  ];
  cut(g, 20);
  assert.ok(g.isSafe(9, 20));
  assert.ok(!g.isSafe(50, 30));
  assert.equal(g.enemies.length, 1);
  assert.equal(g.enemies[0].id, 1);
  assert.ok(events.some(e => e.type === 'capture' && e.bossCaught));
  assert.equal(g.won, false);
});
test('capturing every enemy still requires the area target and story clue', () => {
  const g = make();
  g.enemies[0].x = 8;
  g.enemies[0].y = 20;
  cut(g, 12);
  assert.ok(g.progress < g.target);
  assert.equal(g.enemies.length, 0);
  assert.equal(g.won, false);
});
test('the larger side stays open regardless of which side contains a boss', () => {
  const g = make();
  cut(g, 60);
  assert.equal(g.isSafe(65, 20), true);
  assert.equal(g.isSafe(20, 20), false);
});
test('a concave three-leg cut closes and fills the connected small side', () => {
  const g = make();
  g.player = { x: 12, y: 1 };
  g.anchor = { ...g.player };
  for (let n = 0; n < 10; n++) g.move(0, 1);
  for (let n = 0; n < 18; n++) g.move(1, 0);
  for (let n = 0; n < 10; n++) g.move(0, -1);
  assert.ok(g.isSafe(20, 7));
  assert.ok(!g.isSafe(20, 30));
  assert.equal(g.trail.length, 0);
});
test('backtracking cancels the latest trail cell without injury', () => {
  const g = make();
  g.move(0, 1);
  g.move(0, 1);
  assert.equal(g.trail.length, 2);
  g.move(0, -1);
  assert.equal(g.trail.length, 1);
  g.move(0, -1);
  assert.equal(g.trail.length, 0);
  assert.deepEqual(g.player, g.anchor);
});
test('crossing an existing trail waits rather than losing progress', () => {
  const g = make();
  g.move(0, 1);
  g.move(0, 1);
  g.move(1, 0);
  g.move(0, -1);
  const before = { ...g.player };
  g.move(-1, 0);
  assert.deepEqual(g.player, before);
  assert.equal(g.trail.length, 4);
});
test('damage erases only the active trail and preserves previously claimed land', () => {
  const g = make();
  cut(g, 12);
  const before = Array.from(g.cells);
  g.move(1, 0);
  g.move(0, -1);
  g.grace = 0;
  assert.ok(g.trail.length);
  g.damage();
  assert.equal(g.trail.length, 0);
  assert.deepEqual(Array.from(g.cells), before);
  assert.deepEqual(g.player, g.anchor);
  assert.equal(g.grace, 4);
});
test('safe land and post-hit grace are immune', () => {
  const g = make();
  const start = { ...g.player };
  g.grace = 0;
  g.damage();
  assert.deepEqual(g.player, start);
  g.move(0, 1);
  g.grace = 2;
  g.damage();
  assert.equal(g.trail.length, 1);
});
test('shell slows walking and shields exactly three separate hits', () => {
  const g = make({ ability: 'shell' });
  assert.ok(g.useAbility());
  assert.equal(g.shield, 3);
  assert.ok(Math.abs(g.speed - 4.9) < 1e-9);
  g.move(0, 1);
  for (let i = 0; i < 3; i++) {
    g.grace = 0;
    g.damage();
  }
  assert.equal(g.shield, 0);
  assert.equal(g.shell, false);
  assert.equal(g.trail.length, 1);
  g.grace = 0;
  g.damage();
  assert.equal(g.trail.length, 0);
});
test('stars are gradual and capped without the retired slipper boost', () => {
  const g = make({ ability: 'slippers' });
  g.pickups = [{ x: 12, y: 2 }];
  g.move(0, 1);
  assert.equal(g.speed, 8.8);
  g.speedLevel = 3;
  assert.equal(g.useAbility(), false);
  assert.equal(g.speed, 12.4);
});
test('retired gifts cannot be granted through caller or checkpoint names', () => {
  for (const id of ['slippers', 'brick', 'seed', 'apple']) {
    const g = make({ ability: id, unlockedAbilities: [id] });
    assert.equal(g.charges, 0);
    assert.equal(g.useAbility(id), false);
    assert.equal(g.energy, 3);
  }
});
test('freeze pauses enemy movement and the attack countdown together', () => {
  const g = make({ stage: { id: 'sleeping' }, clearedCount: 6, ability: 'clock' });
  g.useAbility();
  const pos = { x: g.enemies[0].x, y: g.enemies[0].y };
  const attack = g.attackClock;
  for (let n = 0; n < 20; n++) g.step(0.1);
  assert.equal(g.attackClock, attack);
  assert.deepEqual({ x: g.enemies[0].x, y: g.enemies[0].y }, pos);
});
test('the tutorial never shoots after a long idle wait', () => {
  const g = make();
  for (let n = 0; n < 1000; n++) g.step(0.1);
  assert.equal(g.bullets.length, 0);
});
test('snapshot resumes from safe anchor without saving unfinished trail', () => {
  const g = make();
  cut(g, 12);
  g.move(1, 0);
  g.move(0, -1);
  const snap = g.snapshot();
  const restored = make({ snapshot: snap });
  assert.equal(restored.trail.length, 0);
  assert.ok(restored.isSafe(restored.player.x, restored.player.y));
  assert.deepEqual(restored.cells, g.cells);
});
test('bad snapshots cannot put an enemy inside claimed land', () => {
  const original = make();
  const snap = original.snapshot();
  snap.enemies[0].x = 1;
  snap.enemies[0].y = 1;
  const g = make({ snapshot: snap });
  assert.equal(g.enemies[0].x, 51);
});
test('snapshot retains its gentle original difficulty after other chapters are completed', () => {
  const g = make({ stage: { id: 'pigs' }, clearedCount: 2 });
  const restored = make({ stage: { id: 'pigs' }, clearedCount: 7, snapshot: g.snapshot() });
  assert.equal(restored.level, 2);
  assert.equal(restored.target, g.target);
});
test('out of bounds directions cannot leave the safe frame', () => {
  const g = make();
  for (let n = 0; n < 200; n++) g.move(-1, 0);
  assert.equal(g.player.x, 1);
  for (let n = 0; n < 200; n++) g.move(0, -1);
  assert.equal(g.player.y, 1);
});
test('imported counters are normalized to whole numbers', () => {
  const initial = make({ ability: 'shell' });
  const snap = initial.snapshot();
  snap.availableCharges.shell = 1.5;
  snap.shield = 2.5;
  snap.speedLevel = 1.5;
  const restored = make({ ability: 'shell', snapshot: snap });
  assert.equal(restored.charges, 1);
  assert.equal(restored.shield, 2);
  assert.equal(restored.speedLevel, 1);
  restored.abilityCooldown = 0;
  restored.useAbility();
  assert.equal(restored.charges, 0);
});

test('Space gates only drawing, and releasing it permits retreat but no forward extension', () => {
  const g = new GameEngine({ stage: { id: 'race', index: 1 } });
  assert.equal(g.drawHeld, false);
  assert.equal(g.move(1, 0), true);
  assert.equal(g.move(0, 1), false);
  assert.equal(g.trail.length, 0);
  g.setDrawHeld(true);
  assert.equal(g.move(0, 1), true);
  assert.equal(g.move(0, 1), true);
  g.setDrawHeld(false);
  assert.equal(g.move(1, 0), false);
  assert.equal(g.move(0, 1), false);
  assert.equal(g.move(0, -1), true);
  assert.equal(g.trail.length, 1);
  assert.equal(g.move(0, -1), true);
  assert.equal(g.trail.length, 0);
  assert.equal(g.move(-1, 0), true);
});
test('logical cell movement is rendered through fractional positions at 60 frames per second', () => {
  const g = make();
  g.setDirection(1, 0);
  g.step(1 / 60);
  assert.equal(g.player.x, 13);
  assert.ok(g.visualPlayer.x > 12 && g.visualPlayer.x < 13);
  g.setDirection(0, 0);
  let previous = g.visualPlayer.x;
  for (let i = 0; i < 8; i++) {
    g.step(1 / 60);
    assert.ok(g.visualPlayer.x >= previous);
    assert.ok(g.visualPlayer.x - previous <= 7 / 60 + 1e-8);
    previous = g.visualPlayer.x;
  }
  assert.ok(Math.abs(g.visualPlayer.x - 13) < 1e-8);
});
test('interpolation follows orthogonal corners without diagonal shortcuts', () => {
  const g = make();
  g.move(0, 1);
  g.move(1, 0);
  g.updateVisual(0.5 / g.speed);
  assert.equal(g.visualPlayer.x, 12);
  assert.equal(g.visualPlayer.y, 1.5);
  g.updateVisual(1 / g.speed);
  assert.equal(g.visualPlayer.y, 2);
  assert.equal(g.visualPlayer.x, 12.5);
});
test('idle time cannot accumulate a burst of movement, and damage synchronizes both positions', () => {
  const g = make();
  for (let n = 0; n < 100; n++) g.step(0.1);
  assert.equal(g.accumulator, 0);
  g.setDirection(0, 1);
  g.step(0.016);
  assert.equal(g.player.y, 2);
  assert.ok(g.visualPlayer.y < 2);
  g.grace = 0;
  g.damage();
  assert.deepEqual(g.player, g.visualPlayer);
  assert.equal(g.visualQueue.length, 0);
  assert.equal(g.accumulator, 0);
});
test('stage order fixes difficulty regardless of completed-book count and stale legacy level', () => {
  const targets = [0.42, 0.52, 0.58, 0.62, 0.65, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8];
  for (let i = 1; i <= 12; i++) {
    const g = make({ stage: { id: 'custom', index: i }, clearedCount: 8 - i });
    assert.equal(g.target, targets[i - 1]);
    assert.equal(g.level, i - 1);
  }
  const s = make({ stage: { id: 'duck', index: 3 } }).snapshot();
  s.level = 7;
  const restored = make({ stage: { id: 'duck', index: 3 }, clearedCount: 7, snapshot: s });
  assert.equal(restored.target, 0.58);
  assert.equal(restored.level, 2);
});
test('all earned gifts are usable with shared energy, independent limits, and an anti-double-tap cooldown', () => {
  const g = make({ unlockedAbilities: Object.keys(ABILITIES) });
  assert.equal(g.energy, 3);
  assert.equal(g.availableCharges.clock, 1);
  assert.equal(g.availableCharges.shell, 2);
  assert.equal(g.useAbility('shell'), true);
  assert.equal(g.useAbility('feather'), false);
  assert.equal(g.energy, 2);
  for (let n = 0; n < 8; n++) g.step(0.1);
  assert.equal(g.useAbility('feather'), true);
  assert.ok(g.grace >= 2);
  assert.equal(g.shield, 3);
  for (let n = 0; n < 8; n++) g.step(0.1);
  assert.equal(g.useAbility('clock'), true);
  assert.equal(g.energy, 0);
  assert.equal(g.availableCharges.clock, 0);
  for (let n = 0; n < 8; n++) g.step(0.1);
  assert.equal(g.useAbility('lantern'), false);
  assert.equal(g.availableCharges.lantern, 2);
});
test('individual ability limit stays effective even with energy left', () => {
  const g = make({ unlockedAbilities: ['shell', 'clock'] });
  g.useAbility('clock');
  for (let n = 0; n < 8; n++) g.step(0.1);
  assert.equal(g.useAbility('clock'), false);
  assert.equal(g.energy, 2);
  assert.equal(g.useAbility('shell'), true);
  for (let n = 0; n < 8; n++) g.step(0.1);
  assert.equal(g.useAbility('shell'), true);
  assert.equal(g.availableCharges.shell, 0);
});
test('feather removes nearby bullets and small enemies but preserves the boss and distant threats', () => {
  const g = make({ unlockedAbilities: ['feather'] });
  g.enemies = [
    { id: 0, x: 14, y: 6, vx: 0, vy: 0, boss: true },
    { id: 1, x: 14, y: 6, vx: 0, vy: 0, boss: false },
    { id: 2, x: 65, y: 40, vx: 0, vy: 0, boss: false },
  ];
  g.bullets = [
    { x: 14, y: 6, vx: 1, vy: 1, life: 4 },
    { x: 65, y: 40, vx: 1, vy: 1, life: 4 },
  ];
  assert.ok(g.useAbility('feather'));
  assert.deepEqual(
    g.enemies.map(e => e.id),
    [0, 2],
  );
  assert.equal(g.bullets.length, 1);
  assert.equal(g.bullets[0].x, 65);
});
test('lantern cancels a visible attack warning and creates a safe recovery window', () => {
  const g = make({ stage: { id: 'beans', index: 6 }, unlockedAbilities: ['lantern'] });
  g.beginWarning();
  assert.equal(g.bossState.phase, 'warning');
  assert.equal(g.telegraphs[0].type, 'beam');
  g.useAbility('lantern');
  assert.equal(g.telegraphs.length, 0);
  assert.equal(g.beams.length, 0);
  assert.equal(g.bossState.phase, 'recover');
  assert.equal(g.freeze, 3);
  for (let n = 0; n < 20; n++) g.step(0.1);
  assert.equal(g.beams.length, 0);
  assert.equal(g.bossState.remaining, g.profile.recovery);
});
test('every shooting pattern shows its fixed direction for the stage warning duration before firing', () => {
  for (const index of [3, 4, 5, 6, 7, 8]) {
    const g = make({ stage: { id: 'custom', index } });
    g.beginWarning();
    const before = structuredClone(g.telegraphs[0]);
    g.player = { x: 60, y: 1 };
    g.advanceBoss(g.profile.warning - 0.1);
    assert.equal(g.bossState.phase, 'warning');
    assert.equal(g.bullets.length, 0);
    assert.equal(g.beams.length, 0);
    assert.equal(g.enemies[0].dashing, false);
    assert.equal(g.telegraphs[0].angle, before.angle);
    g.advanceBoss(0.1);
    assert.equal(g.bossState.phase, 'attack');
    assert.equal(g.telegraphs.length, 0);
    assert.ok(g.bullets.length || g.beams.length || g.enemies[0].dashing);
  }
});
test('each later story has a distinct cycle and all shots respect the fourteen-bullet ceiling', () => {
  const cycles = BOSS_PROFILES.slice(2).map(p => p.patterns.join(','));
  assert.equal(new Set(cycles).size, 10);
  const g = make({ stage: { id: 'snowwhite', index: 8 } });
  g.bossState.enraged = true;
  g.bullets = Array.from({ length: 6 }, () => ({ x: 40, y: 30, vx: 1, vy: 1, life: 5 }));
  g.beginWarning();
  assert.equal(g.telegraphs[0].angles.length, 7);
  g.advanceBoss(g.profile.warning);
  assert.equal(g.bullets.length, 13);
  g.advanceBoss(0.9);
  assert.equal(g.bullets.length, 14);
});
test('dash finishes in recovery and restores the original roaming velocity', () => {
  const g = make({ stage: { id: 'pigs', index: 4 } });
  const boss = g.enemies[0],
    before = { vx: boss.vx, vy: boss.vy };
  g.beginWarning();
  g.advanceBoss(g.profile.warning);
  assert.equal(boss.dashing, true);
  assert.ok(Math.hypot(boss.vx, boss.vy) > 10);
  g.advanceBoss(1);
  assert.equal(boss.dashing, false);
  assert.equal(g.bossState.phase, 'recover');
  assert.deepEqual({ vx: boss.vx, vy: boss.vy }, before);
  assert.ok(g.bossState.remaining >= 2);
});
test('half-restored later stages enter a stronger phase while tutorials never do', () => {
  for (const index of [1, 3]) {
    const g = make({ stage: { id: 'custom', index } });
    for (let y = 2; y < 24; y++) for (let x = 2; x < 70; x++) g.cells[g.index(x, y)] = 1;
    g.enemies = g.enemies.filter(e => e.boss);
    g.step(0.016);
    assert.equal(g.bossState.enraged, index === 3);
  }
});
test('projectile substeps catch a narrow trail and beam rays stop at safe territory', () => {
  const g = make({ stage: { id: 'beans', index: 6 } });
  for (let n = 0; n < 8; n++) g.move(0, 1);
  g.grace = 0;
  g.bullets = [{ x: 8, y: 6.5, vx: 90, vy: 0, life: 4 }];
  g.advanceProjectiles(0.1, 1);
  assert.equal(g.trail.length, 0);
  assert.deepEqual(g.player, g.anchor);
  for (let y = 2; y < 46; y++) g.cells[g.index(30, y)] = 1;
  assert.ok(g.rayLength(20, 20, 0) < 10);
});
test('capturing a boss returns effect positions and clears pending attacks', () => {
  const events = [],
    g = make({ stage: { id: 'beans', index: 6 }, onEvent: e => events.push(e) });
  g.enemies = [
    { id: 0, x: 8, y: 20, vx: 1, vy: 1, boss: true },
    { id: 1, x: 50, y: 30, vx: 1, vy: 1, boss: false },
  ];
  g.beginWarning();
  cut(g, 12);
  const event = events.find(e => e.type === 'capture');
  assert.deepEqual(event.caughtPositions, [{ x: 8, y: 20, boss: true }]);
  assert.equal(g.telegraphs.length, 0);
  assert.equal(g.beams.length, 0);
});
test('current snapshots preserve buffs, cooldown, warning, energy, and each gift usage', () => {
  const gifts = ['shell', 'feather', 'lantern'],
    g = make({ stage: { id: 'beans', index: 6 }, unlockedAbilities: gifts });
  g.useAbility('shell');
  for (let n = 0; n < 8; n++) g.step(0.1);
  g.useAbility('feather');
  g.beginWarning();
  g.advanceBoss(0.8);
  const s = g.snapshot(),
    r = new GameEngine({ stage: { id: 'beans', index: 6 }, unlockedAbilities: gifts, snapshot: s });
  assert.equal(r.energy, 1);
  assert.equal(r.availableCharges.shell, 1);
  assert.equal(r.availableCharges.feather, 1);
  assert.equal(r.availableCharges.lantern, 2);
  assert.equal(r.boost, 0);
  assert.equal(r.abilityCooldown, 0.7);
  assert.equal(r.shield, 3);
  assert.equal(r.bossState.phase, 'warning');
  assert.ok(Math.abs(r.telegraphs[0].remaining - (g.profile.warning - 0.8)) < 1e-9);
  assert.equal(r.drawHeld, false);
  assert.deepEqual(r.player, r.visualPlayer);
});
test('old single-gift checkpoints migrate without granting unearned gifts or losing new earned gifts', () => {
  const g = make({ ability: 'shell' });
  const old = g.snapshot();
  delete old.engineVersion;
  delete old.availableCharges;
  delete old.energy;
  old.ability = 'shell';
  old.charges = 1;
  old.unlockedAbilities = ['clock', 'apple'];
  const r = make({ snapshot: old, unlockedAbilities: ['shell', 'feather'] });
  assert.deepEqual(r.unlockedAbilities, ['shell', 'feather']);
  assert.equal(r.availableCharges.shell, 1);
  assert.equal(r.availableCharges.feather, 2);
  assert.equal(r.energy, 2);
  assert.equal(r.useAbility('clock'), false);
});
test('zero and invalid time steps cannot consume pending movement or change the world', () => {
  const g = make();
  g.setDirection(1, 0);
  const before = g.snapshot();
  for (const dt of [0, -1, NaN, Infinity]) g.step(dt);
  assert.deepEqual(g.snapshot(), before);
  assert.equal(g.player.x, 12);
  g.step(0.016);
  assert.equal(g.player.x, 13);
});
test('corrupt dash snapshots cannot turn a roaming boss into a permanently fast projectile', () => {
  const g = make({ stage: { id: 'pigs', index: 4 } }),
    bad = g.snapshot();
  bad.enemies[0].dashing = true;
  bad.enemies[0].vx = 10.5;
  bad.enemies[0].vy = 0;
  delete bad.enemies[0].dashBase;
  const r = make({ stage: { id: 'pigs', index: 4 }, snapshot: bad });
  assert.equal(r.enemies[0].dashing, false);
  assert.ok(Math.hypot(r.enemies[0].vx, r.enemies[0].vy) <= r.profile.bossSpeed + 1e-8);
  g.beginWarning();
  g.advanceBoss(g.profile.warning);
  const valid = g.snapshot(),
    resumed = make({ stage: { id: 'pigs', index: 4 }, snapshot: valid });
  assert.equal(resumed.enemies[0].dashing, true);
  resumed.advanceBoss(1);
  assert.equal(resumed.enemies[0].dashing, false);
  assert.ok(Math.hypot(resumed.enemies[0].vx, resumed.enemies[0].vy) <= resumed.profile.bossSpeed + 1e-8);
});
test('malformed optional pickup data cannot crash checkpoint restore', () => {
  const s = make().snapshot();
  s.pickups = [null];
  assert.doesNotThrow(() => make({ snapshot: s }));
  assert.equal(make({ snapshot: s }).pickups.length, 3);
});
test('a keyboard tap completed between frames commits one legal cell with smooth visual movement', () => {
  const g = make();
  g.setDirection(0, 1, { immediate: true });
  g.setDirection(0, 0);
  assert.equal(g.player.y, 2);
  assert.equal(g.trail.length, 1);
  assert.equal(g.visualPlayer.y, 1);
  assert.equal(g.pendingInitialStep, false);
  g.step(0.5 / g.speed);
  assert.equal(g.player.y, 2);
  assert.equal(g.visualPlayer.y, 1.5);
  g.step(0.5 / g.speed);
  assert.equal(g.visualPlayer.y, 2);
});
test('keyboard immediate input respects the draw gate and repeated held input cannot add steps', () => {
  const g = new GameEngine({ stage: { id: 'race', index: 1 } });
  g.setDirection(0, 1, { immediate: true });
  g.setDirection(0, 0);
  assert.equal(g.player.y, 1);
  g.setDirection(1, 0, { immediate: true });
  assert.equal(g.player.x, 13);
  for (let i = 0; i < 20; i++) g.setDirection(1, 0, { immediate: true });
  assert.equal(g.player.x, 13);
  assert.equal(g.visualQueue.length, 1);
});
test('a new keyboard direction gets one prompt step without duplicating the next frame', () => {
  const g = make();
  g.setDirection(0, 1, { immediate: true });
  g.setDirection(1, 0, { immediate: true });
  assert.deepEqual(g.player, { x: 13, y: 2 });
  g.step(0.016);
  assert.deepEqual(g.player, { x: 13, y: 2 });
  assert.equal(g.pendingInitialStep, false);
  assert.equal(g.trail.length, 2);
});
test('stopping and then holding an immediate direction keeps the normal seven-cell-per-second rate', () => {
  const g = make();
  g.setDirection(1, 0, { immediate: true });
  g.setDirection(0, 0);
  for (let n = 0; n < 30; n++) g.step(0.1);
  assert.equal(g.player.x, 13);
  g.setDirection(1, 0, { immediate: true });
  assert.equal(g.player.x, 14);
  for (let n = 0; n < 10; n++) {
    for (let repeat = 0; repeat < 3; repeat++) g.setDirection(1, 0, { immediate: true });
    g.step(0.1);
  }
  assert.equal(g.player.x, 21);
  assert.ok(Math.abs(g.accumulator) < 1e-9);
  assert.ok(g.visualQueue.length <= 1);
});
