// Independent v4 QA: engine state, real story data, and renderer geometry.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GameEngine,
  BOSS_PROFILES,
  PATTERN_SPECS,
  MAX_BULLETS,
  STAGE_IDS,
  WIDTH,
  HEIGHT,
} from '../src/engine.js';
import { dangerRay, paintGame } from '../src/render.js';
import { STORY } from '../src/story-data.js';
const make = (index = 12, extra = {}) => new GameEngine({ stage: STORY.worlds[index - 1], ...extra });
const near = (a, b, e = 1e-7) => assert.ok(Math.abs(a - b) <= e, `${a} differs from ${b}`);
const frames = (g, seconds, dt = 1 / 60) => {
  for (let t = 0; t < seconds - 1e-9; t += dt) g.step(Math.min(dt, seconds - t));
};
function warn(g, pattern) {
  g.attackIndex = g.profile.patterns.indexOf(pattern);
  g.beginWarning();
  return structuredClone(g.telegraphs);
}

test('v4 independent: twelve actual story stages select their own distinct difficulty profiles', () => {
  assert.equal(STORY.worlds.length, 12);
  assert.deepEqual(
    STAGE_IDS,
    STORY.worlds.map(w => w.id),
  );
  assert.equal(BOSS_PROFILES.length, 12);
  for (const [i, w] of STORY.worlds.entries()) {
    const g = make(i + 1);
    assert.equal(g.stageNumber, i + 1);
    assert.equal(g.profile.name, w.boss.name);
    const { name: actualName, ...actualProfile } = g.profile,
      { name: baseName, ...baseProfile } = BOSS_PROFILES[i];
    assert.deepEqual(actualProfile, baseProfile);
    assert.equal(g.enemies.length, g.profile.minionCount + 1);
    assert.deepEqual(g.clue, w.clue);
    assert.ok(!g.clueFound && !g.won);
  }
  assert.equal(make(1).profile.patterns.length, 0);
  assert.deepEqual(make(2).profile.patterns, ['aimed']);
  assert.ok(make(12).profile.bossSpeed > make(2).profile.bossSpeed);
});
test('v4 independent: every projectile pattern in all twelve stages fires along every advertised ray', () => {
  for (let index = 2; index <= 12; index++)
    for (const pattern of make(index).profile.patterns.filter(p => ['aimed', 'spread', 'ring'].includes(p))) {
      const g = make(index),
        t = warn(g, pattern)[0],
        spec = PATTERN_SPECS[pattern];
      assert.equal(t.rays.length, t.angles.length);
      for (let i = 0; i < t.rays.length; i++) {
        near(t.rays[i].angle, t.angles[i]);
        near(t.rays[i].length, Math.min(g.rayLength(t.x, t.y, t.angles[i]), spec.speed * spec.life));
      }
      g.player = { x: 70, y: 45 };
      g.firePattern();
      assert.equal(g.bullets.length, t.rays.length);
      for (let i = 0; i < g.bullets.length; i++) {
        const b = g.bullets[i];
        near(b.x, t.x);
        near(b.y, t.y);
        near(Math.hypot(b.vx, b.vy), spec.speed);
        near(b.vx, Math.cos(t.rays[i].angle) * spec.speed);
        near(b.life * spec.speed, t.rays[i].length);
      }
    }
});
test('v4 independent: every beam stage preserves all warning arms through save and activation', () => {
  for (let index = 1; index <= 12; index++) {
    const g = make(index);
    if (!g.profile.patterns.includes('beam')) continue;
    const tells = warn(g, 'beam');
    const r = make(index, { snapshot: g.snapshot() });
    assert.deepEqual(r.telegraphs, g.telegraphs);
    r.firePattern();
    const rays = tells.flatMap(t => t.rays.map(ray => ({ x: t.x, y: t.y, ...ray })));
    assert.equal(r.beams.length, rays.length);
    assert.equal(rays.length, index >= 7 ? 4 : 1);
    for (let i = 0; i < rays.length; i++)
      for (const key of ['x', 'y', 'angle', 'length']) near(r.beams[i][key], rays[i][key]);
  }
});
for (const dt of [0.1, 1 / 60])
  test(`v4 independent: full multi-wave attacks finish cleanly at ${dt} second frames`, () => {
    for (const pattern of ['aimed', 'spread', 'ring']) {
      let emitted = 0;
      const g = make(12, {
        onEvent: e => {
          if (e.type === 'volley') emitted++;
        },
      });
      // Stage 12 omits aimed; use its earlier actual stage instead.
      const q =
        pattern === 'aimed'
          ? make(11, {
              onEvent: e => {
                if (e.type === 'volley') emitted++;
              },
            })
          : g;
      q.bossState.enraged = true;
      warn(q, pattern);
      q.firePattern();
      for (let elapsed = 0; elapsed < 3.7; elapsed += dt) {
        q.step(dt);
        assert.ok(q.bullets.length <= MAX_BULLETS);
      }
      assert.equal(emitted, PATTERN_SPECS[pattern].waves);
      assert.equal(q.bossState.phase, 'recover');
      assert.equal(q.attackWaves.length, 0);
      assert.equal(q.bullets.length, 0);
    }
  });
test('v4 independent: second-stage battle introduction emits one shot even after later cycles', () => {
  for (const count of [0, 1, 5]) {
    const g = make(2);
    g.attackIndex = count;
    g.beginWarning();
    g.firePattern();
    assert.equal(g.bullets.length, 1);
    assert.equal(g.attackWaves.length, 0);
  }
});
test('v4 independent: minion warmup becomes faster movement without aiming or spawning bullets', () => {
  const g = make(10);
  g.enemies = g.enemies.filter(e => !e.boss).slice(0, 1);
  const e = g.enemies[0];
  e.x = 30;
  e.y = 25;
  e.vx = 4;
  e.vy = 0;
  e.intent = { phase: 'roam', remaining: 0.01, angle: 0 };
  g.player = { x: 1, y: 1 };
  g.advanceEnemies(0.02, 1);
  assert.equal(e.intent.phase, 'warmup');
  const before = e.x;
  g.advanceEnemies(0.4, 1);
  near(e.x - before, 1.6);
  g.player = { x: 70, y: 45 };
  g.advanceEnemies(0.6, 1);
  assert.equal(e.intent.phase, 'rush');
  assert.equal(e.vx, 4);
  assert.equal(e.vy, 0);
  const rushing = e.x;
  g.advanceEnemies(0.1, 1);
  near(e.x - rushing, 0.68);
  assert.equal(g.bullets.length, 0);
  assert.equal(g.attackWaves.length, 0);
  g.advanceEnemies(1.5, 1);
  assert.equal(e.intent.phase, 'roam');
  assert.equal(g.bullets.length, 0);
});
test('v4 independent: frozen minion neither advances its red warmup nor its movement', () => {
  const g = make(12),
    e = g.enemies.find(e => !e.boss);
  e.intent = { phase: 'warmup', remaining: 0.4, angle: 0 };
  const before = structuredClone(e);
  g.advanceEnemies(0.1, 0);
  assert.deepEqual(e, before);
  const r = make(12, { snapshot: g.snapshot() }),
    restored = r.enemies.find(e => !e.boss);
  assert.equal(restored.intent.phase, 'warmup');
  near(restored.intent.remaining, 0.4);
});
test('v4 independent: completion requires the real clue tile, including when no enemies remain', () => {
  for (let index = 1; index <= 12; index++) {
    const g = make(index);
    g.cells.fill(1);
    g.cells[g.index(g.clue.x, g.clue.y)] = 0;
    g.enemies = [];
    g.checkWin();
    assert.ok(g.progress >= g.target);
    assert.equal(g.clueFound, false);
    assert.equal(g.won, false);
    g.cells[g.index(g.clue.x, g.clue.y)] = 1;
    g.checkWin();
    assert.equal(g.clueFound, true);
    assert.equal(g.won, true);
  }
});
test('v4 independent: finding only the clue does not skip the territory objective or repeat discovery', () => {
  const events = [],
    g = make(3, { onEvent: e => events.push(e.type) });
  g.cells[g.index(g.clue.x, g.clue.y)] = 1;
  g.checkWin();
  g.checkWin();
  assert.equal(g.clueFound, true);
  assert.equal(g.won, false);
  assert.equal(events.filter(e => e === 'clue').length, 1);
  assert.equal(events.filter(e => e === 'win').length, 0);
});
test('v4 independent: zero-enemy checkpoint restores territory, energy and an unfinished investigation', () => {
  const g = make(12, { unlockedAbilities: ['shell'] });
  g.cells[10 * WIDTH + 10] = 1;
  g.speedLevel = 2;
  g.energy = 1;
  g.availableCharges.shell = 0;
  g.enemies = [];
  const r = make(12, { unlockedAbilities: ['shell'], snapshot: g.snapshot() });
  assert.equal(r.enemies.length, 0);
  assert.ok(r.isSafe(10, 10));
  assert.equal(r.energy, 1);
  assert.equal(r.availableCharges.shell, 0);
  assert.equal(r.speedLevel, 2);
  assert.equal(r.clueFound, false);
  assert.equal(r.won, false);
  assert.doesNotThrow(() => frames(r, 0.4));
});
test('v4 independent: a forged discovery flag cannot override the tile and a lost flag cannot hide a found tile', () => {
  const g = make(8),
    s = g.snapshot();
  s.clueFound = true;
  assert.equal(make(8, { snapshot: s }).clueFound, false);
  s.clueFound = false;
  s.cells[g.index(g.clue.x, g.clue.y)] = 1;
  assert.equal(make(8, { snapshot: s }).clueFound, true);
});
test('v4 independent: legacy engine versions retain earned territory and spending without reviving removed gifts', () => {
  for (const version of [1, 2, 3, 4]) {
    const g = make(3, { unlockedAbilities: ['shell', 'feather'] }),
      s = g.snapshot();
    s.engineVersion = version;
    s.cells[8 * WIDTH + 8] = 1;
    s.speedLevel = 3;
    s.energy = 1;
    s.availableCharges = { shell: 0, feather: 1, slippers: 2 };
    s.ability = 'slippers';
    s.charges = 1;
    s.boost = 8;
    s.slow = 5;
    const r = make(3, { unlockedAbilities: ['shell', 'feather'], snapshot: s });
    assert.ok(r.isSafe(8, 8));
    assert.equal(r.energy, 1);
    assert.equal(r.speedLevel, 3);
    assert.equal(r.boost, 0);
    assert.equal(r.slow, 0);
    assert.equal(r.useAbility('slippers'), false);
    assert.equal(r.bossState.phase, 'roam');
    if (version >= 2) assert.deepEqual(r.availableCharges, { shell: 0, feather: 1 });
  }
});
test('v4 independent: circular contact matches corridor half-width and excludes square-only corner hits', () => {
  const g = make();
  g.trail = [{ x: 30, y: 20 }];
  assert.equal(g.touchesTrail(31.1, 21.1, 0.65), false);
  assert.equal(g.touchesTrail(31.1, 20.5, 0.65), true);
  assert.equal(g.touchesTrail(31.65, 21.65, 1.2), false);
  assert.equal(g.touchesTrail(31.65, 20.5, 1.2), true);
  for (const pattern of ['spread', 'dash', 'beam']) {
    const t = warn(g, pattern)[0];
    near(t.hitWidth, pattern === 'spread' ? 1.3 : pattern === 'dash' ? 2.4 : 2.05);
  }
});
test('v4 independent: danger corridor polygon keeps collision width on an anisotropic viewport', () => {
  const points = [],
    ctx = {
      beginPath() {},
      moveTo: (...p) => points.push(p),
      lineTo: (...p) => points.push(p),
      closePath() {},
      fill() {},
    };
  const ray = { x: 20, y: 18, angle: Math.PI / 4, length: 12, width: 2.05 };
  const scale = { x: 18, y: 8 };
  dangerRay(ctx, ray, 'red', scale);
  assert.equal(points.length, 4);
  const world = points.map(([x, y]) => ({ x: x / scale.x, y: y / scale.y }));
  for (const p of world) {
    const across = -(p.x - ray.x) * Math.sin(ray.angle) + (p.y - ray.y) * Math.cos(ray.angle);
    near(Math.abs(across), ray.width / 2);
  }
  near(Math.hypot(world[1].x - world[0].x, world[1].y - world[0].y), ray.length);
});
test('v4 independent: rounded warning ends preserve the circular collision radius on a stretched viewport', () => {
  const ellipses = [],
    ctx = {
      beginPath() {},
      moveTo() {},
      lineTo() {},
      closePath() {},
      fill() {},
      ellipse: (...p) => ellipses.push(p),
    },
    scale = { x: 18, y: 8 };
  const ray = { x: 30, y: 20.5, angle: Math.PI / 4, length: 12, width: 1.3, rounded: true };
  dangerRay(ctx, ray, 'gold', scale);
  assert.equal(ellipses.length, 2);
  const endpoints = [
    [ray.x, ray.y],
    [ray.x + Math.cos(ray.angle) * ray.length, ray.y + Math.sin(ray.angle) * ray.length],
  ];
  for (let i = 0; i < 2; i++) {
    near(ellipses[i][0] / scale.x, endpoints[i][0]);
    near(ellipses[i][1] / scale.y, endpoints[i][1]);
    near(ellipses[i][2] / scale.x, 0.65);
    near(ellipses[i][3] / scale.y, 0.65);
  }
  ellipses.length = 0;
  dangerRay(ctx, { ...ray, width: 2.05, rounded: false }, 'pink', scale);
  assert.equal(ellipses.length, 0);
});
test('v4 independent: real painter gives projectile and dash warnings round ends but leaves beam ends flat', () => {
  for (const pattern of ['aimed', 'dash', 'beam']) {
    const g = make(7),
      t = warn(g, pattern)[0],
      ellipses = [];
    const ctx = new Proxy(
      { ellipse: (...args) => ellipses.push(args) },
      {
        get: (target, key) => target[key] ?? (() => {}),
        set: (target, key, value) => {
          target[key] = value;
          return true;
        },
      },
    );
    const canvas = { clientWidth: 864, clientHeight: 576, getContext: () => ctx };
    paintGame(canvas, g, g.stage, null, [], 1000);
    const atOrigin = ellipses.filter(
      p =>
        Math.abs(p[0] - t.x * 12) < 1e-7 &&
        Math.abs(p[1] - t.y * 12) < 1e-7 &&
        Math.abs(p[2] - t.hitWidth * 6) < 1e-7 &&
        Math.abs(p[3] - t.hitWidth * 6) < 1e-7,
    );
    assert.equal(atOrigin.length, pattern === 'beam' ? 0 : 1);
  }
});
test('v4 independent: a hit just beyond a projectile centre endpoint is now inside its rendered round cap', () => {
  const g = make(11);
  g.enemies[0].x = 66.16 - PATTERN_SPECS.aimed.speed * PATTERN_SPECS.aimed.life;
  g.enemies[0].y = 20.5;
  g.player = { x: 70, y: 20 };
  const t = warn(g, 'aimed')[0],
    ray = t.rays[0],
    end = t.x + ray.length;
  assert.ok(66.5 > end && 66.5 < end + t.hitWidth / 2);
  const ellipses = [],
    ctx = {
      beginPath() {},
      moveTo() {},
      lineTo() {},
      closePath() {},
      fill() {},
      ellipse: (...p) => ellipses.push(p),
    };
  dangerRay(ctx, { ...t, ...ray, width: t.hitWidth, rounded: true }, 'gold', { x: 1, y: 1 });
  const cap = ellipses[1];
  assert.ok(Math.hypot((66.5 - cap[0]) / cap[2], (20.5 - cap[1]) / cap[3]) < 1);
  g.firePattern();
  g.bullets = g.bullets.slice(0, 1);
  g.trail = [{ x: 66, y: 20 }];
  g.grace = 0;
  let hit = false;
  g.onEvent = e => {
    if (e.type === 'hit') hit = true;
  };
  for (let i = 0; i < 200 && !hit; i++) g.advanceProjectiles(1 / 60, 1);
  assert.equal(hit, true);
});
test('v4 independent: every case has a causal discovery story and a three-case gift group', () => {
  assert.equal(STORY.worlds.length, 12);
  assert.equal(STORY.items.length, 4);
  assert.deepEqual(
    STORY.items.flatMap(i => i.requiredStages),
    STAGE_IDS,
  );
  for (const [i, w] of STORY.worlds.entries()) {
    assert.equal(w.intro.length, 3);
    assert.equal(w.win.length, 2);
    assert.deepEqual(
      w.intro.map(p => p.artId),
      ['before', 'twist', 'challenge'].map(x => `${w.id}-${x}`),
    );
    assert.deepEqual(
      w.win.map(p => p.artId),
      [`${w.id}-solved`, `${w.id}-wink`],
    );
    assert.ok(w.clue.name);
    assert.ok(w.clue.x > 2 && w.clue.x < WIDTH - 2 && w.clue.y > 2 && w.clue.y < HEIGHT - 2);
    assert.equal(w.pairIndex, Math.floor(i / 3));
    assert.match(w.intro.map(p => p.speaker + ' ' + p.text).join(' '), /토끼/);
  }
  for (const item of STORY.items) assert.equal(item.requiredStages.length, 3);
  const visible = JSON.stringify([
    STORY.opening,
    STORY.ending,
    ...STORY.worlds.map(w => [w.title, w.intro, w.win]),
  ]);
  assert.doesNotMatch(visible, /공주|신데렐라|피자|자전거/);
  assert.match(STORY.worlds[0].intro[0].text, /경주 안 할래/);
  assert.match(STORY.worlds[0].win[1].text, /꾸벅.*거북이.*도착.*윙크/);
});

const exposeTrail = g => {
  g.player = { x: 12, y: 3 };
  g.anchor = { x: 12, y: 1 };
  g.trail = [
    { x: 12, y: 2 },
    { x: 12, y: 3 },
  ];
  g.grace = 0;
};
test('v4.1 independent: three unprotected contacts consume three hearts and issue one loss', () => {
  const events = [],
    g = make(6, { onEvent: e => events.push(e) });
  assert.equal(g.lives, 3);
  assert.equal(g.lost, false);
  g.cells[8 * WIDTH + 8] = 1;
  g.speedLevel = 2;
  const cells = Array.from(g.cells);
  for (const remaining of [2, 1, 0]) {
    exposeTrail(g);
    assert.equal(g.damage(), true);
    assert.equal(g.lives, remaining);
    assert.deepEqual(Array.from(g.cells), cells);
    assert.equal(g.speedLevel, 2);
  }
  assert.equal(g.lost, true);
  assert.equal(g.won, false);
  assert.equal(events.filter(e => e.type === 'lose').length, 1);
  assert.equal(g.damage(), false);
  assert.equal(g.lives, 0);
});
test('v4.1 independent: safety, invulnerability and all three shield blocks protect hearts', () => {
  const g = make(4, { unlockedAbilities: ['shell'] });
  assert.equal(g.damage(), false);
  assert.equal(g.lives, 3);
  exposeTrail(g);
  g.grace = 1;
  assert.equal(g.damage(), false);
  assert.equal(g.lives, 3);
  g.grace = 0;
  assert.equal(g.useAbility('shell'), true);
  for (const shield of [2, 1, 0]) {
    exposeTrail(g);
    assert.equal(g.damage(), true);
    assert.equal(g.shield, shield);
    assert.equal(g.lives, 3);
    assert.equal(g.lost, false);
  }
  assert.equal(g.shell, false);
  exposeTrail(g);
  g.damage();
  assert.equal(g.lives, 2);
  // The next contact in the same invulnerability period cannot consume another heart.
  g.trail = [{ x: 12, y: 2 }];
  assert.equal(g.damage(), false);
  assert.equal(g.lives, 2);
});
test('v4.1 independent: fatal projectile frame freezes remaining shots and all delayed volleys', () => {
  const g = make(7);
  g.lives = 1;
  exposeTrail(g);
  g.enemies = [];
  g.bossState = { phase: 'attack', pattern: 'aimed', name: 'test', remaining: 2, enraged: false };
  g.bullets = [
    { x: 12.5, y: 3.5, vx: 0, vy: 1, life: 2, kind: 'aimed' },
    { x: 50, y: 30, vx: 1, vy: 0, life: 2, kind: 'aimed' },
  ];
  g.attackWaves = [{ pattern: 'aimed', x: 50, y: 30, angles: [0], remaining: 0.2 }];
  g.advanceProjectiles(1 / 60, 1);
  assert.equal(g.lost, true);
  assert.equal(g.lives, 0);
  assert.equal(g.bullets.length, 1);
  assert.equal(g.bullets[0].x, 50);
  assert.equal(g.bullets[0].life, 2);
  const frozen = g.snapshot();
  g.advanceProjectiles(1, 1);
  g.advanceBoss(1);
  frames(g, 1);
  assert.deepEqual(g.snapshot(), frozen);
});
test('v4.1 independent: a lost game cannot move, use a gift, advance time or later win', () => {
  const g = make(8, { unlockedAbilities: ['shell', 'clock'] });
  g.lives = 1;
  exposeTrail(g);
  g.damage();
  const before = g.snapshot(),
    elapsed = g.elapsed;
  g.setDrawHeld(true);
  g.setDirection(1, 0, { immediate: true });
  frames(g, 1);
  assert.equal(g.elapsed, elapsed);
  assert.deepEqual(g.player, before.player);
  assert.equal(g.useAbility('clock'), false);
  assert.equal(g.energy, before.energy);
  assert.equal(g.move(1, 0), false);
  g.cells.fill(1);
  g.checkWin();
  assert.equal(g.won, false);
  assert.equal(g.lost, true);
});
test('v4.1 independent: one-heart and lost checkpoints retain their state through repeated reloads', () => {
  for (const fatal of [false, true]) {
    const g = make(12, { unlockedAbilities: ['shell'] });
    g.energy = 1;
    g.availableCharges.shell = 0;
    g.cells[10 * WIDTH + 10] = 1;
    for (let i = 0; i < (fatal ? 3 : 2); i++) {
      exposeTrail(g);
      g.damage();
    }
    let checkpoint = g.snapshot();
    for (let i = 0; i < 3; i++) {
      const r = make(12, { unlockedAbilities: ['shell'], snapshot: checkpoint });
      assert.equal(r.lives, fatal ? 0 : 1);
      assert.equal(r.lost, fatal);
      assert.equal(r.energy, 1);
      assert.equal(r.availableCharges.shell, 0);
      assert.ok(r.isSafe(10, 10));
      checkpoint = r.snapshot();
    }
  }
});
test('v4.1 independent: old checkpoints without a heart field receive three hearts without refunding gifts', () => {
  for (const version of [1, 2, 3, 4, 5]) {
    const s = make(8).snapshot();
    s.engineVersion = version;
    s.energy = 1;
    s.availableCharges = { shell: 0 };
    s.speedLevel = 2;
    delete s.lives;
    delete s.lost;
    const r = make(8, { unlockedAbilities: ['shell'], snapshot: s });
    assert.equal(r.lives, 3);
    assert.equal(r.lost, false);
    assert.equal(r.energy, 1);
    assert.equal(r.speedLevel, 2);
    if (version >= 2) assert.equal(r.availableCharges.shell, 0);
  }
});
test('v4.1 independent: a genuinely new attempt starts healthy without mutating the failed checkpoint', () => {
  const failed = make(3);
  failed.lives = 1;
  exposeTrail(failed);
  failed.damage();
  const s = failed.snapshot(),
    copy = structuredClone(s);
  const fresh = make(3, { unlockedAbilities: ['shell'] });
  assert.equal(fresh.lives, 3);
  assert.equal(fresh.lost, false);
  assert.equal(fresh.speedLevel, 0);
  assert.equal(fresh.progress, 0);
  assert.deepEqual(s, copy);
});
test('v4.1 independent: agreed faster attacks keep tutorial timing and only shorten later boss breaks', () => {
  const previousSpeeds = [3.5, 5.6, 6.3, 7, 7.3, 7.8, 8.2, 8.5, 8.8, 9, 9.2, 9.4],
    previousRest = [10, 3.8, 3.6, 3.4, 3.2, 3, 2.9, 2.8, 2.7, 2.6, 2.5, 2.4],
    previousRecovery = [3.5, 2.8, 2.7, 2.6, 2.5, 2.4, 2.3, 2.2, 2.2, 2.1, 2.1, 2];
  for (let i = 0; i < 12; i++) {
    const g = make(i + 1),
      rounding = i === 0 ? 1e-7 : 0.00500001;
    near(g.profile.bossSpeed, i === 0 ? previousSpeeds[i] : previousSpeeds[i] * 1.1, rounding);
    near(g.profile.rest, i === 0 ? previousRest[i] : previousRest[i] * 0.85, rounding);
    near(g.profile.recovery, i === 0 ? previousRecovery[i] : previousRecovery[i] * 0.85, rounding);
    near(Math.hypot(g.enemies[0].vx, g.enemies[0].vy), g.profile.bossSpeed);
  }
  near(PATTERN_SPECS.spread.speed, 11.8);
  near(PATTERN_SPECS.aimed.speed, 14.2);
  near(PATTERN_SPECS.ring.speed, 10.5);
  assert.equal(MAX_BULLETS, 14);
});
test('v4.1 independent: a zero-heart checkpoint cannot be revived by clearing its lost flag', () => {
  const s = make(8).snapshot();
  s.lives = 0;
  s.lost = false;
  const r = make(8, { snapshot: s });
  assert.equal(r.lost, true);
  assert.equal(r.lives, 0);
  assert.equal(r.move(1, 0), false);
  s.lives = 3;
  s.lost = true;
  const marked = make(8, { snapshot: s });
  assert.equal(marked.lost, true);
  assert.equal(marked.lives, 0);
});
test('v4.1 independent: the faster aimed shot cannot tunnel across a trail in a long allowed frame', () => {
  const g = make(11);
  exposeTrail(g);
  const start = 11.79,
    target = 12.5,
    dt = 0.1,
    speed = PATTERN_SPECS.aimed.speed;
  assert.ok(target - start > 0.65 && start + speed * dt - target > 0.65);
  g.bullets = [{ x: start, y: 3.5, vx: speed, vy: 0, life: 2, kind: 'aimed' }];
  g.advanceProjectiles(dt, 1);
  assert.equal(g.lives, 2);
  assert.equal(g.bullets.length, 0);
  assert.equal(g.trail.length, 0);
  assert.equal(g.lost, false);
});
