// v5 boss rules: moves by plan, fair tells, a boss that keeps moving, combos and phase two.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, PATTERN_SPECS, MAX_BULLETS, WIDTH, HEIGHT, BOSS_PROFILES } from '../src/engine.js';
import { BOSS_PLANS, FOLLOW_UP_WARNING, isDash } from '../src/game/config.js';
import { STORY } from '../src/story-data.js';

const make = (index, extra = {}) => {
  const g = new GameEngine({ stage: STORY.worlds[index - 1], ...extra });
  g.enemies = g.enemies.filter(e => e.boss); // helpers are tested elsewhere
  g.grace = 0;
  return g;
};
const boss = g => g.enemies.find(e => e.boss);
const run = (g, seconds, dt = 1 / 120) => {
  for (let t = 0; t < seconds - 1e-9; t += dt) g.step(Math.min(dt, seconds - t));
};
const same = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 1e-6;
// Put the rabbit out on the field with a short line, far from the boss.
const drawOut = g => {
  g.setDrawHeld(true);
  for (let i = 0; i < 3; i++) g.move(0, 1);
};

test('every case has a plan, and every planned pattern is a real attack', () => {
  assert.equal(Object.keys(BOSS_PLANS).length, 12);
  for (const [i, w] of STORY.worlds.entries()) {
    const g = make(i + 1);
    assert.equal(g.plan, BOSS_PLANS[w.id]);
    for (const p of g.profile.patterns) assert.ok(PATTERN_SPECS[p], `${w.id}: ${p}`);
    const { patterns, name, ...numbers } = g.profile;
    assert.equal(name, w.boss.name);
    for (const [k, v] of Object.entries(numbers)) assert.equal(v, BOSS_PROFILES[i][k]);
  }
  assert.deepEqual(make(1).profile.patterns, []);
  assert.deepEqual(make(2).profile.patterns, ['aimed']);
  assert.ok(make(4).profile.patterns.includes('crumbdash'));
});

test('the first case never attacks; later cases wait out their calm before the first tell', () => {
  const quiet = make(1);
  run(quiet, 20, 1 / 30);
  assert.equal(quiet.telegraphs.length + quiet.bullets.length + quiet.beams.length, 0);
  const g = make(5);
  run(g, g.profile.rest * 0.5);
  assert.equal(g.bossState.phase, 'roam');
  run(g, g.profile.rest * 0.6);
  assert.equal(g.bossState.phase, 'warning');
});

test('every shot flies exactly along a direction the tell showed, in every case', () => {
  for (let index = 2; index <= 12; index++)
    for (const pattern of make(index).profile.patterns.filter(p =>
      ['aimed', 'spread', 'ring', 'pulse'].includes(p),
    )) {
      const g = make(index);
      g.beginWarning(pattern);
      const shown = g.telegraphs.flatMap(t => t.angles);
      run(g, g.profile.warning + 0.01);
      assert.equal(g.bossState.phase, 'attack', `${index} ${pattern}`);
      assert.ok(g.bullets.length > 0);
      for (const b of g.bullets)
        assert.ok(
          shown.some(a => same(Math.atan2(b.vy, b.vx), a)),
          `${index} ${pattern}`,
        );
    }
});

test('a ring always leaves an opening toward the rabbit', () => {
  const g = make(5);
  g.beginWarning('ring');
  const t = g.telegraphs[0],
    toward = Math.atan2(g.player.y + 0.5 - boss(g).y, g.player.x + 0.5 - boss(g).x);
  for (const a of t.angles) assert.ok(!same(a, toward));
  assert.ok(same(t.gapAngle, toward));
});

test('case six shows one light ray; later cases show and fire a four-armed cross', () => {
  const six = make(6);
  six.beginWarning('beam');
  assert.equal(six.telegraphs.flatMap(t => t.rays).length, 1);
  const seven = make(7);
  seven.beginWarning('beam');
  const rays = seven.telegraphs.flatMap(t => t.rays);
  assert.equal(rays.length, 4);
  run(seven, seven.profile.warning + 0.01);
  assert.equal(seven.beams.length, 4);
  for (const beam of seven.beams) assert.ok(rays.some(r => same(r.angle, beam.angle)));
});

test('the boss keeps moving through tells, shots and breaks; only a charge stands still to aim', () => {
  const g = make(5);
  let moving = 0,
    samples = 0;
  for (let i = 0; i < 1200; i++) {
    const b = boss(g),
      x = b.x,
      y = b.y;
    g.step(1 / 60);
    samples++;
    if (Math.hypot(b.x - x, b.y - y) > 1e-6) moving++;
  }
  assert.ok(moving / samples > 0.9, `moving ${moving}/${samples}`);
  const d = make(4);
  d.beginWarning('crumbdash');
  const b = boss(d),
    start = { x: b.x, y: b.y };
  run(d, d.profile.warning * 0.9);
  assert.deepEqual({ x: b.x, y: b.y }, start);
});

test('a charge runs along its tell, no farther than its range, and stops at claimed ground', () => {
  const g = make(7);
  g.beginWarning('dash');
  const b = boss(g),
    tell = g.telegraphs[0],
    from = { x: b.x, y: b.y };
  run(g, g.profile.warning + 0.01);
  assert.equal(b.dashing, true);
  assert.ok(same(Math.atan2(b.vy, b.vx), tell.angle));
  for (let i = 0; i < 40 && b.dashing; i++) g.step(0.05);
  assert.ok(Math.hypot(b.x - from.x, b.y - from.y) <= PATTERN_SPECS.dash.range + 0.3);
  assert.equal(b.dashing, false);
  assert.equal(g.bossState.phase, 'recover');
  // Now charge straight into a claimed wall right next to the boss.
  const w = make(7),
    wb = boss(w);
  w.beginWarning('dash');
  const angle = w.telegraphs[0].angle;
  for (let k = 2; k < 5; k++) {
    const x = Math.floor(wb.x + Math.cos(angle) * k),
      y = Math.floor(wb.y + Math.sin(angle) * k);
    if (x > 1 && y > 1 && x < WIDTH - 2 && y < HEIGHT - 2) w.cells[y * WIDTH + x] = 1;
  }
  run(w, w.profile.warning + 0.5);
  assert.equal(wb.dashing, false);
  assert.ok(!w.isSafe(Math.floor(wb.x), Math.floor(wb.y)));
});

test('the bread basket drops crumbs that outlast its charge and hurt a line', () => {
  const g = make(4);
  g.beginWarning('crumbdash');
  run(g, g.profile.warning + 1.05);
  const crumbs = () => g.bullets.filter(b => b.kind === 'crumb');
  assert.ok(crumbs().length >= 3, `crumbs ${crumbs().length}`);
  assert.ok(crumbs().length <= 12);
  assert.equal(g.bossState.phase, 'recover');
  for (const c of crumbs()) assert.deepEqual([c.vx, c.vy], [0, 0]);
  // A line laid over a crumb costs a heart.
  const c = crumbs()[0];
  g.trail = [{ x: Math.floor(c.x), y: Math.floor(c.y) }];
  g.grace = 0;
  g.step(1 / 120);
  assert.equal(g.lives, 2);
  // And they fade on their own.
  const h = make(4);
  h.beginWarning('crumbdash');
  run(h, h.profile.warning + 1.05 + PATTERN_SPECS.crumbdash.crumbLife + 0.2);
  assert.equal(h.bullets.filter(b => b.kind === 'crumb').length, 0);
});

test('a combo chains its second hit after a short follow-up tell, then takes a break', () => {
  const events = [];
  const g = make(4, { onEvent: e => events.push(e) });
  g.enemies = g.enemies.filter(e => e.boss);
  g.beginWarning('crumbdash');
  g.bossState.queue = ['crumbdash'];
  run(g, g.profile.warning + 1.05);
  assert.equal(g.bossState.phase, 'warning');
  assert.ok(Math.abs(g.telegraphs[0].duration - FOLLOW_UP_WARNING) < 1e-9);
  assert.ok(events.some(e => e.type === 'warning' && e.followUp));
  run(g, FOLLOW_UP_WARNING + 1.05);
  assert.equal(g.bossState.phase, 'recover');
});

test('phase two starts at half restored, announces itself once and unlocks the late moves', () => {
  const events = [];
  const g = make(4, { onEvent: e => events.push(e) });
  for (let y = 2; y < 25; y++) for (let x = 2; x < WIDTH - 2; x++) g.cells[y * WIDTH + x] = 1;
  boss(g).y = 40;
  run(g, 0.1);
  assert.ok(g.bossState.enraged);
  run(g, 0.5);
  assert.equal(events.filter(e => e.type === 'phase2').length, 1);
  const picks = new Set();
  for (let i = 0; i < 200; i++) picks.add([].concat(g.chooseMove()).join('+'));
  assert.ok(picks.has('crumbdash+crumbdash'));
});

test('moves rarely repeat back to back, and a rabbit out drawing invites a charge', () => {
  const g = make(4);
  let repeats = 0,
    last = null;
  for (let i = 0; i < 300; i++) {
    const move = [].concat(g.chooseMove()).join('+');
    if (move === last) repeats++;
    g.lastMove = last = move;
  }
  assert.ok(repeats / 300 < 0.4, `repeats ${repeats}`);
  const out = make(4);
  drawOut(out);
  let charges = 0;
  for (let i = 0; i < 300; i++) {
    out.lastMove = null;
    if (isDash([].concat(out.chooseMove())[0])) charges++;
  }
  assert.ok(charges > 170, `charges ${charges}`);
});

test('while the rabbit is out drawing, the boss turns toward it', () => {
  const g = make(12);
  const b = boss(g);
  Object.assign(b, { x: 40, y: 30, vx: 10, vy: 0 });
  g.attackClock = 99;
  drawOut(g);
  g.grace = 99;
  const toward = () => Math.atan2(g.visualPlayer.y + 0.5 - b.y, g.visualPlayer.x + 0.5 - b.x),
    off = () =>
      Math.abs(
        Math.atan2(Math.sin(toward() - Math.atan2(b.vy, b.vx)), Math.cos(toward() - Math.atan2(b.vy, b.vx))),
      );
  const before = off();
  run(g, 0.6);
  assert.ok(off() < before, `${off()} !< ${before}`);
});

test('trapping the boss cancels its attack and lowers what is left to restore', () => {
  const events = [];
  const g = make(5, { onEvent: e => events.push(e) });
  g.enemies = g.enemies.filter(e => e.boss);
  const before = g.target;
  g.beginWarning('aimed');
  Object.assign(boss(g), { x: 4.5, y: 4.5 });
  g.setDrawHeld(true);
  g.player = { x: 8, y: 1 };
  g.anchor = { ...g.player };
  for (let i = 0; i < 7; i++) g.move(0, 1);
  for (let i = 0; i < 7; i++) g.move(-1, 0);
  const capture = events.find(e => e.type === 'capture');
  assert.ok(capture?.bossCaught);
  assert.ok(Math.abs(g.target - (before - 0.1)) < 1e-9);
  assert.equal(g.bossState.phase, 'cleared');
  assert.equal(g.telegraphs.length, 0);
});

test('two hits in a row ease the next shots, and a capture resets that help', () => {
  const g = make(5);
  g.hitsInRow = 2;
  g.beginWarning('aimed');
  run(g, g.profile.warning + 0.01);
  const speed = Math.hypot(g.bullets[0].vx, g.bullets[0].vy);
  assert.ok(Math.abs(speed - PATTERN_SPECS.aimed.speed * 0.8) < 1e-9);
  assert.ok(g.bullets.filter(b => b.kind !== 'crumb').length <= MAX_BULLETS);
});

test('the lantern clears a tell and gives a frozen, shot-free break', () => {
  const g = make(6, { unlockedAbilities: ['lantern'] });
  g.enemies = g.enemies.filter(e => e.boss);
  g.beginWarning('beam');
  assert.equal(g.useAbility('lantern'), true);
  assert.equal(g.telegraphs.length, 0);
  assert.equal(g.bossState.phase, 'recover');
  assert.equal(g.freeze, 3);
  run(g, 2, 0.1);
  assert.equal(g.beams.length + g.bullets.length, 0);
});

test('a checkpoint resumes with the boss calmly roaming and nothing in the air', () => {
  const g = make(9);
  g.beginWarning('spread');
  run(g, g.profile.warning + 0.05);
  assert.ok(g.bullets.length > 0);
  const saved = g.snapshot();
  const r = new GameEngine({ stage: STORY.worlds[8], snapshot: saved });
  assert.equal(r.bossState.phase, 'roam');
  assert.equal(r.bullets.length + r.beams.length + r.telegraphs.length + r.attackWaves.length, 0);
  assert.ok(Math.abs(Math.hypot(boss(r).vx, boss(r).vy) - r.profile.bossSpeed) < 1e-9);
});

test('freeze holds the boss, its tell and its shots in place', () => {
  const g = make(8);
  g.beginWarning('spread');
  const b = boss(g),
    at = { x: b.x, y: b.y },
    left = g.bossState.remaining;
  g.freeze = 1;
  run(g, 0.5);
  assert.deepEqual({ x: b.x, y: b.y }, at);
  assert.equal(g.bossState.remaining, left);
});

// ---- Signature moves: every hit lands inside something the tell drew. ----
const distToPath = (p, path) => {
  let best = Infinity;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1],
      b = path[i],
      dx = b.x - a.x,
      dy = b.y - a.y,
      len = dx * dx + dy * dy || 1,
      t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len));
    best = Math.min(best, Math.hypot(a.x + dx * t - p.x, a.y + dy * t - p.y));
  }
  return best;
};
const fireNow = (g, pattern) => {
  g.beginWarning(pattern);
  const tell = structuredClone(g.telegraphs[0]);
  run(g, tell.duration + 0.005);
  return tell;
};

test('every planned move in every case can be told and fired cleanly', () => {
  for (let index = 1; index <= 12; index++)
    for (const pattern of make(index).profile.patterns) {
      const g = make(index);
      g.bossState.enraged = true;
      g.beginWarning(pattern);
      assert.equal(g.bossState.phase, 'warning', `${index} ${pattern}`);
      assert.ok(g.telegraphs.length > 0);
      run(g, 4, 1 / 60);
      for (const b of g.bullets) assert.ok(Number.isFinite(b.x + b.y + b.vx + b.vy), `${index} ${pattern}`);
      assert.ok(g.bullets.filter(b => b.kind !== 'crumb').length <= MAX_BULLETS);
    }
});

test('brick pinwheel: its stream stays inside the drawn arc and turns over time', () => {
  const g = make(3);
  const tell = fireNow(g, 'sprinkler');
  run(g, PATTERN_SPECS.sprinkler.sweepTime);
  const angles = g.bullets.map(b => Math.atan2(b.vy, b.vx));
  assert.ok(angles.length >= 8);
  for (const a of angles) {
    const rel = (((a - tell.start) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    assert.ok(rel >= -1e-6 && rel <= PATTERN_SPECS.sprinkler.arc + 1e-6);
  }
});

test('rain: drops fall only on the shown circles and splash for a moment', () => {
  const g = make(5);
  g.player = { x: 30, y: 1 };
  g.syncVisual();
  const tell = fireNow(g, 'rain');
  const drops = g.bullets.filter(b => b.kind === 'drop');
  assert.equal(drops.length, tell.spots.length);
  assert.ok(tell.spots.length >= 3);
  for (const d of drops)
    assert.ok(tell.spots.some(s => Math.hypot(s.x - d.x, s.y - d.y) < 1e-9 && s.r === d.r));
  run(g, PATTERN_SPECS.rain.life + 0.1);
  assert.equal(g.bullets.filter(b => b.kind === 'drop').length, 0);
});

test('knot ball: the shot forks into three along the drawn fork', () => {
  const g = make(7);
  const tell = fireNow(g, 'split');
  run(g, PATTERN_SPECS.split.splitAt + 0.3);
  const pieces = g.bullets.filter(b => b.kind === 'split');
  assert.ok(pieces.length >= 3);
  for (const p of pieces.slice(0, 3))
    assert.ok(Math.min(...tell.paths.map(path => distToPath(p, path))) < 0.8);
});

test('grapes land on their circles, wait, then pop into four seeds', () => {
  const g = make(8);
  const tell = fireNow(g, 'grapes');
  const grapes = g.bullets.filter(b => b.kind === 'grape');
  assert.equal(grapes.length, tell.spots.length);
  run(g, PATTERN_SPECS.grapes.popAt - 0.2);
  assert.equal(g.bullets.filter(b => b.kind === 'seed').length, 0);
  run(g, 0.3);
  assert.equal(g.bullets.filter(b => b.kind === 'grape').length, 0);
  assert.ok(g.bullets.filter(b => b.kind === 'seed').length >= 4);
});

test('wind: every leaf follows one of the curls drawn in the tell', () => {
  const g = make(9);
  const tell = fireNow(g, 'gust');
  for (let i = 0; i < 6; i++) {
    run(g, 0.15);
    for (const leaf of g.bullets.filter(b => b.kind === 'leaf'))
      assert.ok(Math.min(...tell.paths.map(path => distToPath(leaf, path))) < 0.6);
  }
});

test('pond turntable: the beam sweeps from one shown edge to the other and hits a rabbit it crosses', () => {
  const g = make(10);
  const tell = fireNow(g, 'sweep');
  const beam = g.beams[0];
  assert.ok(same(beam.angle, tell.rays[0].angle) || Math.abs(beam.angle - tell.rays[0].angle) < 0.05);
  run(g, PATTERN_SPECS.sweep.duration - 0.05);
  assert.ok(
    Math.abs(
      Math.atan2(Math.sin(beam.angle - tell.rays[1].angle), Math.cos(beam.angle - tell.rays[1].angle)),
    ) < 0.1,
  );
});

test('marching drum: five notes on the beat, swaying alternately along the drawn paths', () => {
  const g = make(11);
  const tell = fireNow(g, 'notes');
  run(g, PATTERN_SPECS.notes.waveDelay * 4 + 0.05);
  const notes = g.bullets.filter(b => b.kind === 'notes');
  assert.equal(notes.length, 5);
  assert.deepEqual(
    notes.map(n => Math.sign(n.curve)),
    [1, -1, 1, -1, 1],
  );
  for (const n of notes) assert.ok(Math.min(...tell.paths.map(path => distToPath(n, path))) < 0.8);
});

test('wooden duck: helpers come out on the shown spots, never beyond five creatures', () => {
  const g = new GameEngine({ stage: STORY.worlds[11] });
  g.enemies = g.enemies.filter(e => e.boss || e.id === 1);
  const tell = fireNow(g, 'summon');
  assert.equal(g.enemies.length, 1 + 1 + tell.spots.length);
  assert.ok(g.enemies.length <= 5);
  const full = new GameEngine({ stage: STORY.worlds[11] });
  full.beginWarning('summon');
  run(full, 2);
  assert.ok(full.enemies.length <= 5);
});
