import { PATTERN_SPECS, MAX_BULLETS, PATTERN_NAMES } from './config.js';

// Boss attack cycle: roam, telegraph, attack, recover.
// Mixed into GameEngine.prototype; `this` is the engine.
export const bossMethods = {
  nextPattern() {
    return this.profile.patterns[this.attackIndex % this.profile.patterns.length] || null;
  },
  beginWarning() {
    const boss = this.enemies.find(e => e.boss);
    if (!boss || !this.profile.patterns.length) return;
    const pattern = this.nextPattern(),
      angle = Math.atan2(this.player.y + 0.5 - boss.y, this.player.x + 0.5 - boss.x),
      count =
        pattern === 'ring'
          ? this.bossState.enraged
            ? 7
            : 5
          : pattern === 'spread'
            ? this.bossState.enraged
              ? 5
              : 3
            : 1;
    // Leave a 90-degree opening centred on the locked player direction, even in the later phase.
    const angles =
      pattern === 'ring'
        ? Array.from({ length: count }, (_, i) => angle + Math.PI / 4 + (i * Math.PI * 1.5) / (count - 1))
        : pattern === 'spread'
          ? Array.from({ length: count }, (_, i) => angle + (i - (count - 1) / 2) * 0.3)
          : [angle];
    const duration = this.profile.warning;
    const axes =
      pattern === 'beam' && this.stageNumber >= 7
        ? [this.attackIndex % 2 ? Math.PI / 4 : 0, (this.attackIndex % 2 ? Math.PI / 4 : 0) + Math.PI / 2]
        : [angle];
    this.telegraphs = axes.map(axis => {
      const shotAngles =
          pattern === 'beam' ? (this.stageNumber >= 7 ? [axis, axis + Math.PI] : [axis]) : angles,
        spec = PATTERN_SPECS[pattern];
      const rays = shotAngles.map(a => ({
        angle: a,
        length: Math.min(
          this.rayLength(boss.x, boss.y, a),
          pattern === 'dash' ? spec.range : spec.speed ? spec.speed * spec.life : 100,
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
        hitWidth: pattern === 'beam' ? spec.width + 0.8 : pattern === 'dash' ? 2.4 : 1.3,
        remaining: duration,
        duration,
        ...(pattern === 'ring' ? { gapAngle: angle, gapWidth: Math.PI / 2 } : {}),
      };
    });
    this.bossState = {
      phase: 'warning',
      pattern,
      name: PATTERN_NAMES[pattern],
      remaining: duration,
      enraged: this.bossState.enraged,
    };
    this.warning = duration;
    this.onEvent({
      type: 'warning',
      pattern,
      name: this.bossState.name,
      message:
        pattern === 'dash'
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
    if (!this.profile.patterns.length) return;
    if (this.bossState.phase === 'roam') {
      this.attackClock -= dt;
      this.bossState.remaining = this.attackClock;
      if (this.attackClock <= 0) this.beginWarning();
    } else if (this.bossState.phase === 'warning') {
      this.bossState.remaining = Math.max(0, this.bossState.remaining - dt);
      this.warning = this.bossState.remaining;
      for (const t of this.telegraphs) t.remaining = this.warning;
      if (this.bossState.remaining <= 1e-8) this.firePattern();
    } else {
      this.bossState.remaining -= dt;
      if (this.bossState.phase === 'attack' && this.bossState.remaining > 1e-8) {
        for (const wave of this.attackWaves) wave.remaining -= dt;
        const due = this.attackWaves.filter(w => w.remaining <= 1e-8);
        this.attackWaves = this.attackWaves.filter(w => w.remaining > 1e-8);
        for (const wave of due) this.emitWave(wave);
      }
      if (this.bossState.remaining <= 1e-8) {
        if (this.bossState.phase === 'attack') this.beginRecovery();
        else {
          this.bossState.phase = 'roam';
          this.bossState.pattern = null;
          this.bossState.name = this.profile.name;
          this.attackClock = this.profile.rest;
          this.bossState.remaining = this.attackClock;
        }
      }
    }
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
    else if (pattern === 'dash') {
      boss.dashBase = { vx: boss.vx, vy: boss.vy };
      boss.vx = Math.cos(warning.angle) * 12;
      boss.vy = Math.sin(warning.angle) * 12;
      boss.dashing = true;
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
    for (const angle of wave.angles) {
      if (this.bullets.length >= MAX_BULLETS) break;
      this.bullets.push({
        x: wave.x,
        y: wave.y,
        vx: Math.cos(angle) * spec.speed,
        vy: Math.sin(angle) * spec.speed,
        life: Math.min(spec.life, this.rayLength(wave.x, wave.y, angle) / spec.speed),
        kind: wave.pattern,
      });
    }
    this.onEvent({ type: 'volley', pattern: wave.pattern });
  },
  beginRecovery() {
    this.endDash();
    this.bullets = [];
    this.beams = [];
    this.telegraphs = [];
    this.attackWaves = [];
    this.warning = 0;
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
