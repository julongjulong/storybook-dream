import {
  WIDTH,
  PATTERN_SPECS,
  MAX_BULLETS,
  PATTERN_NAMES,
  velocity,
  clamp,
  integer,
  validPoint,
  sameAngle,
  validPatternAngles,
  HEIGHT,
  finite,
  capFor,
} from './config.js';

// Checkpoint snapshot and validated restore, including older save formats.
// Mixed into GameEngine.prototype; `this` is the engine.
export const saveMethods = {
  snapshot() {
    return {
      engineVersion: 6,
      balanceVersion: '4.1',
      lives: this.lives,
      lost: this.lost,
      clueFound: this.clueFound,
      stageId: this.stage.id,
      cells: Array.from(this.cells),
      player: { ...(this.isSafe(this.player.x, this.player.y) ? this.player : this.anchor) },
      enemies: this.enemies.map(e => ({
        ...e,
        intent: e.intent ? { ...e.intent } : undefined,
        dashBase: e.dashBase ? { ...e.dashBase } : undefined,
      })),
      pickups: this.pickups.map(p => ({ ...p })),
      speedLevel: this.speedLevel,
      ability: this.ability,
      charges: this.charges,
      unlockedAbilities: [...this.unlockedAbilities],
      availableCharges: { ...this.availableCharges },
      energy: this.energy,
      abilityCooldown: this.abilityCooldown,
      shield: this.shield,
      shell: this.shell,
      grace: this.grace,
      freeze: this.freeze,
      slow: this.slow,
      boost: this.boost,
      elapsed: this.elapsed,
      level: this.level,
      bossState: { ...this.bossState },
      attackClock: this.attackClock,
      attackIndex: this.attackIndex,
      attackWaves: this.attackWaves.map(w => ({ ...w, angles: [...w.angles] })),
      telegraphs: this.telegraphs.map(t => ({
        ...t,
        angles: [...t.angles],
        rays: t.rays?.map(r => ({ ...r })),
      })),
      beams: this.beams.map(b => ({ ...b })),
      bullets: this.bullets.map(b => ({ ...b })),
    };
  },
  restore(s) {
    if (
      !s ||
      s.stageId !== this.stage.id ||
      !Array.isArray(s.cells) ||
      s.cells.length !== WIDTH * HEIGHT ||
      !s.cells.every(c => c === 0 || c === 1)
    )
      return false;
    if (
      !s.player ||
      !Number.isInteger(s.player.x) ||
      !Number.isInteger(s.player.y) ||
      s.player.x < 1 ||
      s.player.x >= WIDTH - 1 ||
      s.player.y < 1 ||
      s.player.y >= HEIGHT - 1
    )
      return false;
    const boundaryValid = s.cells.every((c, i) => {
      const x = i % WIDTH,
        y = Math.floor(i / WIDTH);
      return x < 2 || y < 2 || x >= WIDTH - 2 || y >= HEIGHT - 2 ? c === 1 : true;
    });
    if (!boundaryValid || s.cells[s.player.y * WIDTH + s.player.x] !== 1) return false;
    const validDash = e =>
      s.engineVersion >= 2 &&
      s.bossState?.phase === 'attack' &&
      s.bossState?.pattern === 'dash' &&
      this.profile.patterns.includes('dash') &&
      e.boss &&
      e.dashing &&
      e.dashBase &&
      Number.isFinite(e.dashBase.vx) &&
      Math.abs(e.dashBase.vx) <= 11 &&
      Number.isFinite(e.dashBase.vy) &&
      Math.abs(e.dashBase.vy) <= 11;
    if (
      !Array.isArray(s.enemies) ||
      s.enemies.length > 5 ||
      s.enemies.filter(e => e?.boss).length > 1 ||
      !s.enemies.every(
        e =>
          validPoint(e) &&
          !s.cells[Math.floor(e.y) * WIDTH + Math.floor(e.x)] &&
          Number.isFinite(e.vx) &&
          Math.abs(e.vx) <= (validDash(e) ? 12 : 11) &&
          Number.isFinite(e.vy) &&
          Math.abs(e.vy) <= (validDash(e) ? 12 : 11),
      )
    )
      return false;
    this.cells = Uint8Array.from(s.cells);
    this.cellsVersion++;
    this.player = { ...s.player };
    this.anchor = { ...s.player };
    this.syncVisual();
    this.drawHeld = false;
    this.clueFound = this.isSafe(this.clue.x, this.clue.y);
    this.lives = s.engineVersion === 6 ? integer(s.lives, 3, 0, 3) : 3;
    this.lost = s.engineVersion === 6 && (this.lives === 0 || s.lost === true);
    if (this.lost) this.lives = 0;
    this.enemies = s.enemies.map(e => {
      const id = integer(e.id, e.boss ? 0 : 1, 0, 4),
        boss = !!e.boss,
        dashing = s.engineVersion === 6 && !!validDash(e),
        speed = boss ? this.profile.bossSpeed : this.profile.minionSpeed;
      const behavior = boss ? 'wander' : 'rush_wander';
      const allowed = ['roam', 'warmup', 'rush'];
      const phase = s.engineVersion === 6 && allowed.includes(e.intent?.phase) ? e.intent.phase : 'roam';
      const intent = boss
        ? undefined
        : {
            phase,
            remaining: clamp(
              finite(e.intent?.remaining, 3),
              0,
              phase === 'warmup' ? 0.9 : phase === 'rush' ? 1.5 : 6,
            ),
            angle: finite(e.intent?.angle, Math.atan2(e.vy, e.vx)),
            length: this.profile.minionSpeed * 1.25 * 1.1,
          };
      const base = e.dashing && validDash(e) ? e.dashBase : e;
      return {
        id,
        x: e.x,
        y: e.y,
        ...velocity(dashing ? e.vx : base.vx, dashing ? e.vy : base.vy, dashing ? 12 : speed),
        boss,
        dashing,
        behavior,
        intent,
        dashBase: dashing ? velocity(base.vx, base.vy, speed) : undefined,
      };
    });
    this.speedLevel = integer(s.speedLevel, 0, 0, 3);
    this.shield = integer(s.shield, 0, 0, 3);
    this.shell = !!s.shell && this.shield > 0;
    this.elapsed = Math.max(0, finite(s.elapsed, 0));
    for (const key of ['freeze', 'grace', 'abilityCooldown'])
      this[key] = clamp(finite(s[key], key === 'grace' ? 3 : 0), 0, key === 'abilityCooldown' ? 0.7 : 5);
    this.boost = 0;
    this.slow = 0;
    // Earned inventory comes from the caller, never from untrusted checkpoint ability names.
    if (this.unlockedAbilities.includes(s.ability)) this.lastAbility = s.ability;
    if (s.engineVersion >= 2 && s.availableCharges && typeof s.availableCharges === 'object') {
      for (const id of this.unlockedAbilities)
        this.availableCharges[id] = integer(s.availableCharges[id], capFor(id), 0, capFor(id));
    } else if (this.unlockedAbilities.includes(s.ability))
      this.availableCharges[s.ability] = integer(s.charges, capFor(s.ability), 0, capFor(s.ability));
    // Retired v1 gifts still carry spent energy; migrating their name must not refund it.
    if (Number.isFinite(s.energy)) this.energy = integer(s.energy, 3, 0, 3);
    else if (
      ['shell', 'slippers', 'feather', 'brick', 'lantern', 'seed', 'clock', 'apple'].includes(s.ability)
    ) {
      const legacyCap = ['clock', 'apple'].includes(s.ability) ? 1 : 2;
      this.energy = 3 - (legacyCap - integer(s.charges, legacyCap, 0, legacyCap));
    }
    if (
      Array.isArray(s.pickups) &&
      s.pickups.length <= 3 &&
      s.pickups.every(p => p && Number.isInteger(p.x) && Number.isInteger(p.y) && validPoint(p))
    )
      this.pickups = s.pickups.map(p => ({ x: p.x, y: p.y, type: 'speed' }));
    const phases = ['roam', 'warning', 'attack', 'recover', 'cleared'];
    if (
      s.engineVersion === 6 &&
      s.bossState &&
      phases.includes(s.bossState.phase) &&
      (s.bossState.phase !== 'cleared' || !this.enemies.some(e => e.boss)) &&
      (!s.bossState.pattern || this.profile.patterns.includes(s.bossState.pattern))
    ) {
      const duration =
        s.bossState.phase === 'warning'
          ? this.profile.warning
          : s.bossState.phase === 'recover'
            ? this.profile.recovery
            : s.bossState.phase === 'attack'
              ? PATTERN_SPECS[s.bossState.pattern]?.duration || 3.6
              : this.profile.rest;
      this.bossState = {
        phase: s.bossState.phase,
        pattern: s.bossState.pattern || null,
        name: PATTERN_NAMES[s.bossState.pattern] || this.profile.name,
        remaining: clamp(finite(s.bossState.remaining, duration), 0, duration),
        enraged: this.stageNumber >= 3 && this.progress >= 0.5,
      };
      this.attackClock = clamp(finite(s.attackClock, this.profile.rest), 0, this.profile.rest);
      this.attackIndex = integer(s.attackIndex, 0, 0, 100000);
      const validAngles = a => Array.isArray(a) && a.length > 0 && a.length <= 7 && a.every(Number.isFinite);
      const phase = this.bossState.phase;
      if (
        phase === 'warning' &&
        Array.isArray(s.telegraphs) &&
        s.telegraphs.length <= (this.stageNumber >= 7 ? 2 : 1)
      )
        this.telegraphs = s.telegraphs
          .filter(
            t =>
              validPoint(t) &&
              t.type === this.bossState.pattern &&
              this.profile.patterns.includes(t.type) &&
              Number.isFinite(t.angle) &&
              validAngles(t.angles),
          )
          .map(t => {
            const spec = PATTERN_SPECS[t.type],
              rays = t.angles.map(angle => ({
                angle,
                length: Math.min(
                  this.rayLength(t.x, t.y, angle),
                  t.type === 'dash' ? spec.range : spec.speed ? spec.speed * spec.life : 100,
                ),
              }));
            return {
              type: t.type,
              x: t.x,
              y: t.y,
              angle: t.angle,
              angles: [...t.angles],
              rays,
              length: rays[0].length,
              width: t.type === 'beam' ? 1.25 : 1,
              hitWidth: t.type === 'beam' ? 2.05 : t.type === 'dash' ? 2.4 : 1.3,
              remaining: this.bossState.remaining,
              duration: this.profile.warning,
              ...(t.type === 'ring' ? { gapAngle: t.angle, gapWidth: Math.PI / 2 } : {}),
            };
          });
      if (phase === 'attack' && Array.isArray(s.bullets) && s.bullets.length <= MAX_BULLETS)
        this.bullets = s.bullets
          .filter(
            b =>
              validPoint(b) &&
              !this.blocked(b.x, b.y) &&
              ['ring', 'spread', 'aimed'].includes(b.kind) &&
              Number.isFinite(b.vx) &&
              Math.abs(b.vx) <= 14.2 &&
              Number.isFinite(b.vy) &&
              Math.abs(b.vy) <= 14.2 &&
              Math.hypot(b.vx, b.vy) <= 14.2 + 1e-8,
          )
          .map(b => ({
            x: b.x,
            y: b.y,
            vx: b.vx,
            vy: b.vy,
            life: clamp(finite(b.life, 0), 0, PATTERN_SPECS[b.kind].life),
            kind: b.kind,
          }));
      if (
        phase === 'attack' &&
        this.bossState.pattern === 'beam' &&
        Array.isArray(s.beams) &&
        s.beams.length <= (this.stageNumber >= 7 ? 4 : 1)
      )
        this.beams = s.beams
          .filter(b => validPoint(b) && !this.blocked(b.x, b.y) && Number.isFinite(b.angle))
          .map(b => ({
            x: b.x,
            y: b.y,
            angle: b.angle,
            length: Math.min(clamp(finite(b.length, 0), 0, 100), this.rayLength(b.x, b.y, b.angle)),
            width: 1.25,
            life: clamp(finite(b.life, 0), 0, PATTERN_SPECS.beam.duration),
          }));
      if (phase === 'attack' && Array.isArray(s.attackWaves) && s.attackWaves.length <= 2)
        this.attackWaves = s.attackWaves
          .filter(
            w =>
              validPoint(w) &&
              !this.blocked(w.x, w.y) &&
              w.pattern === this.bossState.pattern &&
              ['ring', 'spread', 'aimed'].includes(w.pattern) &&
              validAngles(w.angles) &&
              Number.isFinite(w.remaining) &&
              w.remaining > 0 &&
              w.remaining <= PATTERN_SPECS[w.pattern].waveDelay * (PATTERN_SPECS[w.pattern].waves - 1),
          )
          .map(w => ({ pattern: w.pattern, x: w.x, y: w.y, angles: [...w.angles], remaining: w.remaining }));
      this.warning = this.bossState.phase === 'warning' ? this.bossState.remaining : 0;
      if (this.bossState.phase === 'warning') {
        const boss = this.enemies.find(e => e.boss),
          cross = this.bossState.pattern === 'beam' && this.stageNumber >= 7,
          axis = this.attackIndex % 2 ? Math.PI / 4 : 0;
        const validTells =
          this.telegraphs.length === (cross ? 2 : 1) &&
          this.telegraphs.every(
            (t, i) =>
              boss &&
              Math.abs(t.x - boss.x) < 1e-7 &&
              Math.abs(t.y - boss.y) < 1e-7 &&
              (cross
                ? t.angles.length === 2 &&
                  sameAngle(t.angle, axis + (i * Math.PI) / 2) &&
                  sameAngle(t.angles[0], t.angle) &&
                  sameAngle(t.angles[1], t.angle + Math.PI)
                : validPatternAngles(t.type, t.angles, t.angle)),
          );
        if (!validTells) this.cancelAttack();
      }
      if (this.bossState.phase === 'recover' || this.bossState.phase === 'roam') {
        this.bullets = [];
        this.beams = [];
        this.telegraphs = [];
        this.endDash();
      }
    } else this.endDash();
    if (!this.enemies.some(e => e.boss)) this.clearBoss();
    return true;
  },
};
