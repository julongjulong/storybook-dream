import test from 'node:test';
import assert from 'node:assert/strict';
import { warnV4, V4_PATTERNS } from './v4-patterns.mjs';
import { GameEngine, STAGE_IDS, BOSS_PROFILES, TARGETS, PATTERN_SPECS } from '../src/engine.js';
const make = (index = 3, extra = {}) =>
  new GameEngine({
    stage: { id: STAGE_IDS[index - 1], index, clue: { x: 36, y: 24, name: '비밀 단서' } },
    ...extra,
  });
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const elapsed = (g, t) => {
  for (let i = 0; i < Math.round(t * 100); i++) g.step(0.01);
};

test('all twelve stage IDs resolve their own rising difficulty without an eight-stage clamp', () => {
  assert.equal(STAGE_IDS.length, 12);
  assert.equal(BOSS_PROFILES.length, 12);
  for (let i = 0; i < 12; i++) {
    const g = new GameEngine({ stage: { id: STAGE_IDS[i] } });
    assert.equal(g.stageNumber, i + 1);
    assert.equal(g.target, TARGETS[i]);
    if (i > 0) {
      assert.ok(g.profile.bossSpeed > BOSS_PROFILES[i - 1].bossSpeed);
      assert.ok(g.profile.minionSpeed > BOSS_PROFILES[i - 1].minionSpeed);
    }
  }
  assert.equal(make(12).enemies.length, 5);
  assert.equal(make(12).profile.bossSpeed, 10.34);
});
test('only first chapter has no boss shots, and second chapter teaches one aimed shot', () => {
  const tutorial = make(1);
  elapsed(tutorial, 60);
  assert.equal(tutorial.bullets.length, 0);
  assert.equal(tutorial.attackWaves.length, 0);
  const second = make(2);
  warnV4(second);
  assert.equal(second.telegraphs.length, 1);
  second.firePattern();
  assert.equal(second.bullets.length, 1);
  assert.equal(second.attackWaves.length, 0);
});
test('every displayed projectile ray matches a real shot direction and its lifetime-limited range', () => {
  for (let index = 2; index <= 12; index++)
    for (let p = 0; p < V4_PATTERNS[index].length; p++) {
      const g = make(index);
      g.attackIndex = p;
      warnV4(g);
      const tells = structuredClone(g.telegraphs),
        pattern = g.bossState.pattern,
        spec = PATTERN_SPECS[pattern];
      for (const t of tells) {
        assert.deepEqual(
          t.rays.map(r => r.angle),
          t.angles,
        );
        for (const r of t.rays)
          near(
            r.length,
            Math.min(
              g.rayLength(t.x, t.y, r.angle),
              pattern === 'dash' ? spec.range : spec.speed ? spec.speed * spec.life : 100,
            ),
          );
      }
      g.firePattern();
      if (['spread', 'ring', 'aimed'].includes(pattern)) {
        assert.equal(g.bullets.length, tells[0].rays.length);
        for (let i = 0; i < g.bullets.length; i++) {
          const b = g.bullets[i],
            r = tells[0].rays[i];
          near(
            Math.atan2(
              Math.sin(Math.atan2(b.vy, b.vx) - r.angle),
              Math.cos(Math.atan2(b.vy, b.vx) - r.angle),
            ),
            0,
          );
          near(b.life * spec.speed, r.length);
        }
      }
    }
});
test('last projectile frame cannot travel beyond the predicted endpoint', () => {
  const g = make(3);
  warnV4(g);
  const ray = g.telegraphs[0].rays[0],
    origin = { ...g.telegraphs[0] };
  g.firePattern();
  const shot = g.bullets[0];
  g.bullets = [shot];
  while (g.bullets.length) g.advanceProjectiles(0.1, 1);
  const travelled = Math.hypot(shot.x - origin.x, shot.y - origin.y);
  assert.ok(travelled <= ray.length + 1e-7);
});
test('helpers flash for .9 seconds then roam at 1.7 times base speed for 1.5 seconds without shooting', () => {
  const g = make(6),
    e = g.enemies[1];
  g.enemies = [e];
  e.intent.remaining = 0;
  g.advanceIntent(e, 0.01);
  assert.equal(e.intent.phase, 'warmup');
  assert.equal(g.advanceIntent(e, 0.89), 1);
  assert.equal(e.intent.phase, 'warmup');
  assert.equal(g.advanceIntent(e, 0.02), 1.7);
  assert.equal(e.intent.phase, 'rush');
  assert.equal(g.advanceIntent(e, 1.49), 1.7);
  assert.equal(g.advanceIntent(e, 0.02), 1);
  assert.equal(e.intent.phase, 'roam');
  assert.equal(g.bullets.length, 0);
  assert.equal(g.beams.length, 0);
  assert.equal(g.telegraphs.length, 0);
});
test('rushing helper bounces from safe land and has no aimed or locked line', () => {
  const g = make(6),
    e = g.enemies[1];
  e.x = 69.9;
  e.y = 20;
  e.vx = g.profile.minionSpeed;
  e.vy = 0;
  e.intent = { phase: 'rush', remaining: 1.4 };
  g.advanceEnemies(0.1, 1);
  assert.ok(e.vx < 0);
  assert.equal(e.intent.phase, 'rush');
  assert.ok(e.x < 70);
  assert.equal(g.telegraphs.length, 0);
});
test('clock freezes helper color timers and movement together', () => {
  const g = make(6, { unlockedAbilities: ['clock'] }),
    e = g.enemies[1];
  e.intent = { phase: 'warmup', remaining: 0.5 };
  g.useAbility('clock');
  const before = structuredClone(e);
  elapsed(g, 1);
  assert.deepEqual(e, before);
});
test('capturing a clue emits once and requires the target area before victory', () => {
  const events = [],
    g = make(3, { onEvent: e => events.push(e) });
  g.cells[g.index(36, 24)] = 1;
  g.checkWin();
  assert.equal(g.clueFound, true);
  assert.equal(g.won, false);
  g.checkWin();
  assert.equal(events.filter(e => e.type === 'clue').length, 1);
  g.cells.fill(1);
  g.checkWin();
  assert.equal(g.won, true);
  assert.equal(events.filter(e => e.type === 'win').length, 1);
});
test('area target and all enemies captured are insufficient without the hidden clue', () => {
  const g = make(3);
  g.cells.fill(1);
  g.cells[g.index(36, 24)] = 0;
  g.enemies = [];
  g.checkWin();
  assert.ok(g.progress > g.target);
  assert.equal(g.clueFound, false);
  assert.equal(g.won, false);
  g.cells[g.index(36, 24)] = 1;
  g.checkWin();
  assert.equal(g.won, true);
});
test('zero-enemy unfinished checkpoint retains the land, stars and clue search', () => {
  const g = make(3);
  g.enemies = [];
  g.cells[g.index(5, 8)] = 1;
  g.speedLevel = 2;
  const r = make(3, { snapshot: g.snapshot() });
  assert.equal(r.enemies.length, 0);
  assert.equal(r.cells[g.index(5, 8)], 1);
  assert.equal(r.speedLevel, 2);
  assert.equal(r.clueFound, false);
  assert.equal(r.won, false);
});
test('clue discovery is derived from saved cells, never a forged checkpoint flag', () => {
  const g = make(3),
    s = g.snapshot();
  s.clueFound = true;
  let r = make(3, { snapshot: s });
  assert.equal(r.clueFound, false);
  s.clueFound = false;
  s.cells[g.index(36, 24)] = 1;
  r = make(3, { snapshot: s });
  assert.equal(r.clueFound, true);
});
test('v3 and v4 checkpoints discard stale attack rays while retaining restoration work', () => {
  for (const version of [3, 4]) {
    const g = make(3);
    warnV4(g);
    const s = g.snapshot();
    s.engineVersion = version;
    s.cells[g.index(5, 8)] = 1;
    s.speedLevel = 2;
    s.telegraphs[0].rays = [{ angle: 999, length: 999 }];
    const r = make(3, { snapshot: s });
    assert.equal(r.cells[g.index(5, 8)], 1);
    assert.equal(r.speedLevel, 2);
    assert.equal(r.bossState.phase, 'roam');
    assert.equal(r.telegraphs.length, 0);
  }
});
test('modern rushing-helper checkpoint preserves its phase while old helper behaviors migrate to roaming', () => {
  const g = make(6);
  g.enemies[1].intent = { phase: 'rush', remaining: 0.8, angle: 0 };
  const s = g.snapshot(),
    r = make(6, { snapshot: s });
  assert.equal(r.enemies[1].intent.phase, 'rush');
  near(r.enemies[1].intent.remaining, 0.8);
  s.engineVersion = 4;
  s.enemies[1].behavior = 'peek_chase';
  s.enemies[1].intent.phase = 'chase';
  const old = make(6, { snapshot: s });
  assert.equal(old.enemies[1].behavior, 'rush_wander');
  assert.equal(old.enemies[1].intent.phase, 'roam');
});
test('captured boss stays cleared without restarting a false recovery timer while helpers remain', () => {
  const g = make(5);
  warnV4(g);
  g.firePattern();
  g.enemies = g.enemies.filter(e => !e.boss);
  g.clearBoss();
  assert.equal(g.bossState.phase, 'cleared');
  assert.equal(g.bullets.length, 0);
  assert.equal(g.attackWaves.length, 0);
  let cancelled = 0;
  const cancel = g.cancelAttack.bind(g);
  g.cancelAttack = () => {
    cancelled++;
    cancel();
  };
  elapsed(g, 12);
  assert.equal(cancelled, 0);
  assert.equal(g.bossState.phase, 'cleared');
  assert.equal(g.bossState.remaining, 0);
  assert.equal(g.bossState.enraged, false);
  assert.equal(g.won, false);
  const r = make(5, { snapshot: g.snapshot() });
  assert.equal(r.bossState.phase, 'cleared');
  assert.equal(r.bossState.remaining, 0);
  assert.ok(r.enemies.length > 0);
  assert.equal(
    r.enemies.some(e => e.boss),
    false,
  );
});
test('zero-enemy and legacy boss-free saves enter the cleared phase without claiming the unfinished clue', () => {
  for (const version of [3, 4, 5]) {
    const g = make(3),
      s = g.snapshot();
    s.engineVersion = version;
    s.enemies = [];
    s.bossState.phase = 'recover';
    s.bossState.remaining = 2;
    const r = make(3, { snapshot: s });
    assert.equal(r.bossState.phase, 'cleared');
    assert.equal(r.bossState.remaining, 0);
    assert.equal(r.clueFound, false);
    assert.equal(r.won, false);
  }
});
test('story boss names take precedence without mutating the shared balance profile', () => {
  const before = BOSS_PROFILES[0].name,
    g = make(1, { stage: { id: 'race', index: 1, boss: { name: '데굴데굴 낙엽 뭉치' } } });
  assert.equal(g.profile.name, '데굴데굴 낙엽 뭉치');
  assert.equal(g.bossState.name, g.profile.name);
  assert.equal(BOSS_PROFILES[0].name, before);
  const r = make(1, { stage: g.stage, snapshot: g.snapshot() });
  assert.equal(r.bossState.name, g.profile.name);
});
