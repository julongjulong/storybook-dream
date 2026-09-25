import { PATTERN_SPECS, MAX_BULLETS, PATTERN_NAMES, FOLLOW_UP_WARNING, isDash, velocity } from './config.js';

// Boss behaviour (v5): roam and hunt → tell → attack (one move or a combo) → short break.
// Mixed into GameEngine.prototype; `this` is the engine.
//
// The boss keeps moving through most of its cycle: slowly while winding up a tell,
// at half speed while its shots fly, and gently during its break. Only a charge
// stands still to aim. Which move comes next depends on what the rabbit is doing.
const MAX_CRUMBS = 12;
const TURN_RATE = 1.8; // radians per second the boss can turn while roaming
const PHASE_SPEED = { roam: 1, warning: 0.25, attack: 0.5, recover: 0.45 };
const key = move => [].concat(move).join('+');

export const bossMethods = {
  // Weighted pick: avoid repeating, charge at a rabbit that is out drawing, spray when it hides.
  chooseMove() {
    const options = this.plan.moves.map(move => ({ move, weight: 1 }));
    if (this.bossState.enraged) options.push(...this.plan.late.map(move => ({ move, weight: 1.6 })));
    if (!options.length) return null;
    const exposed = this.isExposed();
    for (const o of options) {
      const first = [].concat(o.move)[0];
      if (key(o.move) === this.lastMove) o.weight *= 0.25;
      if (exposed && isDash(first)) o.weight *= 2;
      if (exposed && first === 'aimed') o.weight *= 1.5;
      if (!exposed && ['spread', 'ring', 'beam'].includes(first)) o.weight *= 1.4;
    }
    let roll = this.rng() * options.reduce((sum, o) => sum + o.weight, 0);
    for (const o of options) if ((roll -= o.weight) <= 0) return o.move;
    return options.at(-1).move;
  },
  // Kept for the developer overlay and tests: the pattern the boss would open with now.
  nextPattern() {
    const move = this.chooseMove();
    return move ? [].concat(move)[0] : null;
  },
  beginWarning(pattern = null, { followUp = false } = {}) {
    const boss = this.enemies.find(e => e.boss);
    if (!boss) return;
    if (!pattern) {
      const move = this.chooseMove();
      if (!move) return;
      this.lastMove = key(move);
      [pattern, ...this.bossState.queue] = [].concat(move);
    } else if (!followUp) this.bossState.queue = []; // a single forced move (tests, overlay)
    const spec = PATTERN_SPECS[pattern],
      angle = Math.atan2(this.player.y + 0.5 - boss.y, this.player.x + 0.5 - boss.x),
      enraged = this.bossState.enraged,
      count = pattern === 'ring' ? (enraged ? 7 : 5) : pattern === 'spread' ? (enraged ? 5 : 3) : 1;
    // A ring always leaves a 90-degree opening centred on where the rabbit stood.
    const angles =
      pattern === 'ring'
        ? Array.from({ length: count }, (_, i) => angle + Math.PI / 4 + (i * Math.PI * 1.5) / (count - 1))
        : pattern === 'spread'
          ? Array.from({ length: count }, (_, i) => angle + (i - (count - 1) / 2) * 0.3)
          : [angle];
    const duration = followUp ? FOLLOW_UP_WARNING : this.profile.warning;
    const crossBeam = pattern === 'beam' && this.stageNumber >= 7,
      axes = crossBeam
        ? [this.attackIndex % 2 ? Math.PI / 4 : 0, (this.attackIndex % 2 ? Math.PI / 4 : 0) + Math.PI / 2]
        : [angle];
    this.telegraphs = axes.map(axis => {
      const shotAngles = pattern === 'beam' ? (crossBeam ? [axis, axis + Math.PI] : [axis]) : angles;
      const rays = shotAngles.map(a => ({
        angle: a,
        length: Math.min(
          this.rayLength(boss.x, boss.y, a),
          isDash(pattern) ? spec.range : spec.speed ? spec.speed * spec.life : 100,
        ),
      }));
      return {
        type: pattern,
        x: boss.x,
        y: boss.y,
        angle: axis,
        angles: shotAngles,
        rays,
        length: rays[0].length,
        width: pattern === 'beam' ? spec.width : 1,
        hitWidth: pattern === 'beam' ? spec.width + 0.8 : isDash(pattern) ? 2.4 : 1.3,
        remaining: duration,
        duration,
        ...(pattern === 'ring' ? { gapAngle: angle, gapWidth: Math.PI / 2 } : {}),
      };
    });
    Object.assign(this.bossState, {
      phase: 'warning',
      pattern,
      name: PATTERN_NAMES[pattern],
      remaining: duration,
    });
    this.warning = duration;
    this.onEvent({
      type: 'warning',
      pattern,
      followUp,
      name: this.bossState.name,
      message: followUp
        ? '한 번 더 와요!'
        : isDash(pattern)
          ? '길 표시를 보고 비켜 서요!'
          : pattern === 'beam'
            ? '반짝 선이 나올 자리를 보여 줘요!'
            : pattern === 'ring'
              ? '방울 고리의 열린 틈을 찾아요!'
              : '방울이 나올 방향을 먼저 보여 줘요!',
    });
  },
  advanceBoss(dt) {
    if (!Number.isFinite(dt) || dt <= 0 || this.lost) return;
    if (!this.enemies.some(e => e.boss)) {
      this.clearBoss();
      return;
    }
    if (!this.plan.moves.length && !this.plan.late.length) return;
    const state = this.bossState;
    if (state.phase === 'roam') {
      this.attackClock -= dt;
      state.remaining = this.attackClock;
      if (this.attackClock <= 0) this.beginWarning();
    } else if (state.phase === 'warning') {
      state.remaining = Math.max(0, state.remaining - dt);
      this.warning = state.remaining;
      for (const t of this.telegraphs) t.remaining = this.warning;
      if (state.remaining <= 1e-8) this.firePattern();
    } else {
      state.remaining -= dt;
      if (state.phase === 'attack' && state.remaining > 1e-8) {
        for (const wave of this.attackWaves) wave.remaining -= dt;
        const due = this.attackWaves.filter(w => w.remaining <= 1e-8);
        this.attackWaves = this.attackWaves.filter(w => w.remaining > 1e-8);
        for (const wave of due) this.emitWave(wave);
      }
      if (state.remaining <= 1e-8) {
        if (state.phase === 'attack') this.finishAttack();
        else {
          state.phase = 'roam';
          state.pattern = null;
          state.name = this.profile.name;
          // Vary the calm between moves a little so the rhythm is not a metronome.
          this.attackClock = this.profile.rest * (0.8 + this.rng() * 0.4);
          state.remaining = this.attackClock;
        }
      }
    }
  },
  // Boss body movement for the current phase; called from advanceEnemies.
  bossPace() {
    const state = this.bossState;
    if (state.phase === 'warning' && isDash(state.pattern)) return 0; // standing still to aim
    return (PHASE_SPEED[state.phase] ?? 1) * (state.enraged ? 1.12 : 1) * this.assistScale(0.05);
  },
  steerBoss(boss, dt) {
    if (boss.dashing || dt <= 0) return;
    const heading = Math.atan2(boss.vy, boss.vx);
    // Wander: a slow sway. Hunt: lean toward the rabbit while it is out on the field.
    let target = heading + Math.sin(this.elapsed * 0.9 + boss.id) * 0.5;
    if (this.plan.hunt > 0 && this.isExposed()) {
      const v = this.visualPlayer,
        toward = Math.atan2(v.y + 0.5 - boss.y, v.x + 0.5 - boss.x),
        diff = Math.atan2(Math.sin(toward - target), Math.cos(toward - target));
      target += diff * this.plan.hunt;
    }
    const turn = Math.atan2(Math.sin(target - heading), Math.cos(target - heading)),
      limit = TURN_RATE * dt,
      next = heading + Math.max(-limit, Math.min(limit, turn));
    Object.assign(boss, velocity(Math.cos(next), Math.sin(next), this.profile.bossSpeed));
  },
  firePattern() {
    const boss = this.enemies.find(e => e.boss),
      warning = this.telegraphs[0],
      tells = this.telegraphs;
    if (!boss || !warning) {
      this.cancelAttack();
      return;
    }
    const pattern = this.bossState.pattern,
      spec = PATTERN_SPECS[pattern],
      firstTutorialSpread = this.stageNumber === 2 || (this.stageNumber === 3 && this.attackIndex === 0);
    this.warning = 0;
    this.telegraphs = [];
    this.attackWaves = [];
    this.attackIndex++;
    this.bossState.phase = 'attack';
    this.bossState.remaining = spec.duration;
    if (pattern === 'beam')
      for (const tell of tells)
        for (const ray of tell.rays || [{ angle: tell.angle, length: tell.length }])
          this.beams.push({
            x: tell.x,
            y: tell.y,
            angle: ray.angle,
            length: Math.min(ray.length, this.rayLength(tell.x, tell.y, ray.angle)),
            width: spec.width,
            life: spec.duration,
          });
    else if (isDash(pattern)) {
      boss.dashBase = { vx: boss.vx, vy: boss.vy };
      boss.vx = Math.cos(warning.angle) * spec.speed;
      boss.vy = Math.sin(warning.angle) * spec.speed;
      boss.dashing = true;
      boss.crumbTrip = 0;
    } else {
      const wave = { pattern, x: warning.x, y: warning.y, angles: [...warning.angles] };
      this.emitWave(wave);
      for (let i = 1; i < (firstTutorialSpread ? 1 : spec.waves); i++)
        this.attackWaves.push({ ...wave, angles: [...wave.angles], remaining: i * spec.waveDelay });
    }
    this.onEvent({ type: 'attack', pattern, name: this.bossState.name });
  },
  emitWave(wave) {
    const spec = PATTERN_SPECS[wave.pattern];
    if (!spec?.speed || this.blocked(wave.x, wave.y)) return;
    const speed = spec.speed * this.assistScale(0.1);
    for (const angle of wave.angles) {
      if (this.bullets.filter(b => b.kind !== 'crumb').length >= MAX_BULLETS) break;
      this.bullets.push({
        x: wave.x,
        y: wave.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: Math.min(spec.life, this.rayLength(wave.x, wave.y, angle) / speed),
        kind: wave.pattern,
      });
    }
    this.onEvent({ type: 'volley', pattern: wave.pattern });
  },
  // A rolling charge drops crumbs that sit on the field for a few seconds.
  dropCrumbs(boss, distance) {
    const spec = PATTERN_SPECS[this.bossState.pattern];
    if (!boss.dashing || !spec?.crumbEvery) return;
    boss.crumbTrip = (boss.crumbTrip || 0) + distance;
    while (boss.crumbTrip >= spec.crumbEvery) {
      boss.crumbTrip -= spec.crumbEvery;
      const crumbs = this.bullets.filter(b => b.kind === 'crumb');
      if (crumbs.length >= MAX_CRUMBS) this.bullets.splice(this.bullets.indexOf(crumbs[0]), 1);
      this.bullets.push({ x: boss.x, y: boss.y, vx: 0, vy: 0, life: spec.crumbLife, kind: 'crumb' });
    }
  },
  // After one hit of a move: chain the next hit of a combo, or take a break.
  finishAttack() {
    this.endDash();
    if (this.bossState.queue?.length) {
      this.bullets = this.bullets.filter(b => b.kind === 'crumb');
      this.beams = [];
      this.attackWaves = [];
      this.beginWarning(this.bossState.queue.shift(), { followUp: true });
    } else this.beginRecovery();
  },
  beginRecovery() {
    this.endDash();
    this.bullets = this.bullets.filter(b => b.kind === 'crumb'); // crumbs linger on their own timer
    this.beams = [];
    this.telegraphs = [];
    this.attackWaves = [];
    this.warning = 0;
    this.bossState.queue = [];
    this.bossState.phase = 'recover';
    this.bossState.remaining = this.profile.recovery;
    this.onEvent({
      type: 'recovery',
      pattern: this.bossState.pattern,
      message: '지금이에요! 쉬는 틈에 그림을 밝혀요.',
    });
  },
  endDash() {
    for (const enemy of this.enemies)
      if (enemy.dashing) {
        if (enemy.dashBase) {
          enemy.vx = enemy.dashBase.vx;
          enemy.vy = enemy.dashBase.vy;
        }
        delete enemy.dashBase;
        delete enemy.crumbTrip;
        enemy.dashing = false;
      }
  },
  cancelAttack() {
    this.endDash();
    this.telegraphs = [];
    this.beams = [];
    this.bullets = [];
    this.attackWaves = [];
    this.warning = 0;
    this.bossState.queue = [];
    this.bossState.phase = 'recover';
    this.bossState.remaining = this.profile.recovery;
    this.bossState.pattern = null;
    this.attackClock = this.profile.rest;
  },
  clearBoss() {
    if (this.bossState.phase !== 'cleared') this.cancelAttack();
    Object.assign(this.bossState, {
      phase: 'cleared',
      pattern: null,
      name: this.profile.name,
      remaining: 0,
      enraged: false,
    });
  },
};
