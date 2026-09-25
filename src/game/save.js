import {
  WIDTH,
  velocity,
  clamp,
  integer,
  validPoint,
  HEIGHT,
  finite,
  capFor,
  minionBehavior,
} from './config.js';

// Checkpoint snapshot and validated restore, including older save formats.
// Mixed into GameEngine.prototype; `this` is the engine.
export const saveMethods = {
  snapshot() {
    return {
      engineVersion: 6,
      stickerFound: this.stickerFound,
      heartsLost: this.heartsLost,
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
    const MAX_ENEMY_SPEED = 14;
    if (
      !Array.isArray(s.enemies) ||
      s.enemies.length > 5 ||
      s.enemies.filter(e => e?.boss).length > 1 ||
      !s.enemies.every(
        e =>
          validPoint(e) &&
          !s.cells[Math.floor(e.y) * WIDTH + Math.floor(e.x)] &&
          Number.isFinite(e.vx) &&
          Math.abs(e.vx) <= MAX_ENEMY_SPEED &&
          Number.isFinite(e.vy) &&
          Math.abs(e.vy) <= MAX_ENEMY_SPEED,
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
    this.stickerFound = !!this.sticker && this.isSafe(this.sticker.x, this.sticker.y);
    this.heartsLost = integer(s.heartsLost, 3 - integer(s.lives, 3, 0, 3), 0, 3);
    this.lives = s.engineVersion === 6 ? integer(s.lives, 3, 0, 3) : 3;
    this.lost = s.engineVersion === 6 && (this.lives === 0 || s.lost === true);
    if (this.lost) this.lives = 0;
    this.enemies = s.enemies.map(e => {
      const id = integer(e.id, e.boss ? 0 : 1, 0, 4),
        boss = !!e.boss,
        speed = boss ? this.profile.bossSpeed : this.profile.minionSpeed;
      // A checkpoint taken mid-dash walks on at normal speed in the direction it had before.
      const heading = e.dashing && e.dashBase ? e.dashBase : e;
      const behavior = boss ? 'wander' : minionBehavior(this.stageNumber, id);
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
      return {
        id,
        x: e.x,
        y: e.y,
        ...velocity(heading.vx, heading.vy, speed),
        boss,
        dashing: false,
        behavior,
        intent,
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
    // The boss always resumes calmly: a fresh roam before its next move, nothing in the air.
    this.telegraphs = [];
    this.beams = [];
    this.bullets = [];
    this.attackWaves = [];
    this.warning = 0;
    this.bossState = { ...this.bossState, phase: 'roam', pattern: null, queue: [], name: this.profile.name };
    this.attackClock = this.profile.rest;
    this.bossState.remaining = this.attackClock;
    this.attackIndex = integer(s.attackIndex, 0, 0, 100000);
    this.bossState.enraged = this.stageNumber >= 3 && this.progress >= 0.5;
    if (!this.enemies.some(e => e.boss)) this.clearBoss();
    return true;
  },
};
