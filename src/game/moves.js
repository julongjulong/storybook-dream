import { PATTERN_SPECS, WIDTH, HEIGHT, SHOT_MAX_LIFE } from './config.js';

// Signature moves: one per case, each tied to the boss's prop.
// tell(engine, boss, aim) returns what the tell shows: straight rays, curved paths
// (lists of points) and circle spots. fire(engine, tell, boss) makes it happen.
// Every hit a move can make is inside something its tell draws.

const ray = (engine, x, y, angle, max) => ({ angle, length: Math.min(max, engine.rayLength(x, y, angle)) });

// Where a swerving shot will go: it curls for curveFor seconds, then flies straight to a wall.
function curvedPath(engine, x, y, angle, speed, curve, curveFor) {
  const points = [{ x, y }];
  let vx = Math.cos(angle) * speed,
    vy = Math.sin(angle) * speed;
  for (let t = 0; t < SHOT_MAX_LIFE; t += 0.05) {
    const turn = t < curveFor ? curve * 0.05 : 0,
      c = Math.cos(turn),
      s = Math.sin(turn);
    [vx, vy] = [vx * c - vy * s, vx * s + vy * c];
    x += vx * 0.05;
    y += vy * 0.05;
    if (engine.blocked(x, y)) break;
    points.push({ x, y });
  }
  return points;
}
// An arc drawn around the boss to show which way something turns.
const arc = (x, y, radius, from, to) =>
  Array.from({ length: 13 }, (_, i) => {
    const a = from + ((to - from) * i) / 12;
    return { x: x + Math.cos(a) * radius, y: y + Math.sin(a) * radius };
  });
// Spots on open ground near a point, one of them right on it.
function spotsNear(engine, cx, cy, count, spread) {
  const spots = [];
  for (let tries = 0; spots.length < count && tries < count * 12; tries++) {
    const first = tries === 0,
      x = first ? cx : cx + (engine.rng() * 2 - 1) * spread,
      y = first ? cy : cy + (engine.rng() * 2 - 1) * spread;
    if (x < 3 || y < 3 || x > WIDTH - 3 || y > HEIGHT - 3 || engine.blocked(x, y)) continue;
    if (spots.some(s => Math.hypot(s.x - x, s.y - y) < 2.5)) continue;
    spots.push({ x, y });
  }
  return spots;
}

export const SIGNATURE = {
  // Brick pinwheel: a stream that turns through a wide arc, twice as many streams in phase two.
  sprinkler: {
    tell(engine, boss, aim) {
      const spec = PATTERN_SPECS.sprinkler,
        start = aim - spec.arc / 2,
        streams = engine.bossState.enraged ? [0, Math.PI] : [0];
      const rays = [],
        paths = [];
      for (const offset of streams) {
        for (let i = 0; i <= 6; i++)
          rays.push(ray(engine, boss.x, boss.y, start + offset + (spec.arc * i) / 6, 100));
        paths.push(arc(boss.x, boss.y, 3, start + offset, start + offset + spec.arc));
      }
      return { rays, paths, start, streams };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.sprinkler,
        shots = Math.round(spec.sweepTime / spec.interval);
      for (let i = 0; i <= shots; i++)
        engine.attackWaves.push({
          pattern: 'sprinkler',
          x: tell.x,
          y: tell.y,
          angles: tell.streams.map(o => tell.start + o + (spec.arc * i) / shots),
          remaining: i * spec.interval + 1e-6,
        });
    },
  },
  // Rain cloud: circles show where drops will land; each splash hurts only for a moment.
  rain: {
    tell(engine) {
      const spec = PATTERN_SPECS.rain,
        v = engine.visualPlayer;
      return {
        rays: [],
        spots: spotsNear(
          engine,
          v.x + 0.5,
          v.y + 0.5,
          engine.bossState.enraged ? spec.count + 2 : spec.count,
          6,
        ).map(s => ({ ...s, r: spec.radius })),
      };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.rain;
      for (const s of tell.spots)
        engine.bullets.push({ x: s.x, y: s.y, vx: 0, vy: 0, r: spec.radius, life: spec.life, kind: 'drop' });
    },
  },
  // Knot ball: a shot that splits in three partway, shown as a forked path.
  split: {
    tell(engine, boss, aim) {
      const spec = PATTERN_SPECS.split,
        reach = spec.speed * spec.splitAt,
        fork = { x: boss.x + Math.cos(aim) * reach, y: boss.y + Math.sin(aim) * reach };
      const rest = 100;
      const paths = [[{ x: boss.x, y: boss.y }, fork]];
      for (let i = -1; i <= 1; i++) {
        const a = aim + i * spec.spread,
          r = ray(engine, fork.x, fork.y, a, rest);
        paths.push([fork, { x: fork.x + Math.cos(a) * r.length, y: fork.y + Math.sin(a) * r.length }]);
      }
      return { rays: [], paths, angles: [aim] };
    },
    fire(engine, tell) {
      engine.emitWave({ pattern: 'split', x: tell.x, y: tell.y, angles: tell.angles });
    },
  },
  // Grape bunch: grapes land on the marked spots, sit, then pop into four seeds.
  grapes: {
    tell(engine) {
      const spec = PATTERN_SPECS.grapes,
        v = engine.visualPlayer;
      const spots = spotsNear(
        engine,
        v.x + 0.5,
        v.y + 0.5,
        engine.bossState.enraged ? spec.count + 2 : spec.count,
        7,
      );
      const paths = spots.flatMap(s =>
        [0, 1, 2, 3].map(i => {
          const a = Math.PI / 4 + (i * Math.PI) / 2,
            r = ray(engine, s.x, s.y, a, 100);
          return [s, { x: s.x + Math.cos(a) * r.length, y: s.y + Math.sin(a) * r.length }];
        }),
      );
      return { rays: [], spots: spots.map(s => ({ ...s, r: 0.9 })), paths };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.grapes;
      for (const s of tell.spots)
        engine.bullets.push({
          x: s.x,
          y: s.y,
          vx: 0,
          vy: 0,
          r: 0.7,
          life: spec.popAt + 0.5,
          kind: 'grape',
          popAt: spec.popAt,
          popCount: 4,
          popSpeed: spec.seedSpeed,
        });
    },
  },
  // Wind cloud: a fan of leaves that curl as they fly; the tell draws each curl.
  gust: {
    tell(engine, boss, aim) {
      const spec = PATTERN_SPECS.gust,
        count = engine.bossState.enraged ? 7 : 5;
      const leaves = Array.from({ length: count }, (_, i) => ({
        angle: aim + (i - (count - 1) / 2) * 0.32,
        curve: (i % 2 ? -1 : 1) * spec.curve,
      }));
      return {
        rays: [],
        leaves,
        paths: leaves.map(l =>
          curvedPath(engine, boss.x, boss.y, l.angle, spec.speed, l.curve, spec.curveFor),
        ),
      };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.gust;
      for (const l of tell.leaves)
        engine.bullets.push({
          x: tell.x,
          y: tell.y,
          vx: Math.cos(l.angle) * spec.speed * engine.assistScale(0.1),
          vy: Math.sin(l.angle) * spec.speed * engine.assistScale(0.1),
          curve: l.curve,
          curveFor: spec.curveFor,
          life: SHOT_MAX_LIFE,
          kind: engine.plan.skin || 'leaf',
        });
    },
  },
  // Pond turntable: a light beam that sweeps across the rabbit's side; two opposite beams in phase two.
  sweep: {
    tell(engine, boss, aim) {
      const spec = PATTERN_SPECS.sweep,
        start = aim - spec.arc / 2,
        beams = engine.bossState.enraged ? [0, Math.PI] : [0];
      const rays = [],
        paths = [];
      for (const o of beams) {
        rays.push(
          ray(engine, boss.x, boss.y, start + o, 100),
          ray(engine, boss.x, boss.y, start + o + spec.arc, 100),
        );
        paths.push(arc(boss.x, boss.y, 4, start + o, start + o + spec.arc));
      }
      // The whole wedge the light will pass over, shaded so the danger area is plain to see.
      const wedges = beams.map(o => ({
        from: start + o,
        to: start + o + spec.arc,
        radius: Math.min(...rays.map(r => r.length)),
      }));
      return { rays, paths, start, beams, wedges };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.sweep;
      for (const o of tell.beams)
        engine.beams.push({
          x: tell.x,
          y: tell.y,
          angle: tell.start + o,
          spin: spec.arc / spec.duration,
          length: engine.rayLength(tell.x, tell.y, tell.start + o),
          width: spec.width,
          life: spec.duration,
        });
    },
  },
  // Marching drum: notes on the beat, each swaying the other way, like a snake.
  notes: {
    tell(engine, boss, aim) {
      const spec = PATTERN_SPECS.notes;
      return {
        rays: [],
        angles: [aim],
        paths: [1, -1].map(side =>
          curvedPath(engine, boss.x, boss.y, aim - side * 0.35, spec.speed, side * spec.curve, spec.curveFor),
        ),
      };
    },
    fire(engine, tell) {
      const spec = PATTERN_SPECS.notes;
      for (let i = 0; i < spec.waves; i++)
        engine.attackWaves.push({
          pattern: 'notes',
          x: tell.x,
          y: tell.y,
          angles: tell.angles,
          side: i % 2 ? -1 : 1,
          remaining: i * spec.waveDelay + 1e-6,
        });
    },
  },
  // Wooden duck: its door opens and helpers come out onto the marked spots.
  summon: {
    tell(engine, boss) {
      const room = Math.max(0, 5 - engine.enemies.length);
      return {
        rays: [],
        spots: spotsNear(engine, boss.x, boss.y, Math.min(2, room), 4).map(s => ({ ...s, r: 1 })),
      };
    },
    fire(engine, tell) {
      for (const s of tell.spots) {
        if (engine.enemies.length >= 5) break;
        const id = [1, 2, 3, 4].find(n => !engine.enemies.some(e => e.id === n));
        const a = engine.rng() * Math.PI * 2;
        engine.enemies.push({
          id,
          x: s.x,
          y: s.y,
          vx: Math.cos(a) * engine.profile.minionSpeed,
          vy: Math.sin(a) * engine.profile.minionSpeed,
          boss: false,
          behavior: 'rush_wander',
          intent: { phase: 'warmup', remaining: 0.9, angle: a },
        });
      }
    },
  },
};
