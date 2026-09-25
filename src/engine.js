export const WIDTH = 72,
  HEIGHT = 48;
export const ABILITIES = {
  shell: { icon: '🛡️', name: '거북이 보호막' },
  feather: { icon: '🍃', name: '깃털 바람' },
  lantern: { icon: '🏮', name: '숲길 등불' },
  clock: { icon: '⏰', name: '꿈꾸는 시계' },
};
export const BOSS_PROFILES = [
  {
    name: '데굴데굴 자전거 바퀴',
    patterns: [],
    rest: 10,
    bossSpeed: 3.5,
    minionSpeed: 0,
    minionCount: 0,
    warning: 2.4,
    recovery: 3.5,
  },
  {
    name: '뒤뚱뒤뚱 물갈퀴 장화',
    patterns: ['aimed'],
    rest: 3.23,
    bossSpeed: 6.16,
    minionSpeed: 4.1,
    minionCount: 1,
    warning: 2.2,
    recovery: 2.38,
  },
  {
    name: '벽돌집 설계 소동',
    patterns: ['spread'],
    rest: 3.06,
    bossSpeed: 6.93,
    minionSpeed: 4.8,
    minionCount: 2,
    warning: 2.1,
    recovery: 2.29,
  },
  {
    name: '할머니 집 열쇠 달리기',
    patterns: ['dash', 'aimed'],
    rest: 2.89,
    bossSpeed: 7.7,
    minionSpeed: 5.2,
    minionCount: 2,
    warning: 2,
    recovery: 2.21,
  },
  {
    name: '콩나무 종 방울',
    patterns: ['ring', 'aimed'],
    rest: 2.72,
    bossSpeed: 8.03,
    minionSpeed: 5.5,
    minionCount: 2,
    warning: 1.9,
    recovery: 2.13,
  },
  {
    name: '개미 창고 빛줄기',
    patterns: ['beam', 'spread'],
    rest: 2.55,
    bossSpeed: 8.58,
    minionSpeed: 5.8,
    minionCount: 3,
    warning: 1.9,
    recovery: 2.04,
  },
  {
    name: '생쥐 가위 구조 작전',
    patterns: ['aimed', 'dash', 'beam'],
    rest: 2.46,
    bossSpeed: 9.02,
    minionSpeed: 6,
    minionCount: 3,
    warning: 1.8,
    recovery: 1.95,
  },
  {
    name: '포도밭 사다리 빛놀이',
    patterns: ['ring', 'beam', 'spread'],
    rest: 2.38,
    bossSpeed: 9.35,
    minionSpeed: 6.2,
    minionCount: 3,
    warning: 1.8,
    recovery: 1.87,
  },
  {
    name: '바람의 모자 끈',
    patterns: ['spread', 'dash', 'ring'],
    rest: 2.29,
    bossSpeed: 9.68,
    minionSpeed: 6.4,
    minionCount: 3,
    warning: 1.8,
    recovery: 1.87,
  },
  {
    name: '쇠도끼 반짝 물결',
    patterns: ['aimed', 'beam', 'ring'],
    rest: 2.21,
    bossSpeed: 9.9,
    minionSpeed: 6.5,
    minionCount: 4,
    warning: 1.7,
    recovery: 1.78,
  },
  {
    name: '피리 마개 행진',
    patterns: ['ring', 'spread', 'aimed', 'dash'],
    rest: 2.13,
    bossSpeed: 10.12,
    minionSpeed: 6.6,
    minionCount: 4,
    warning: 1.7,
    recovery: 1.78,
  },
  {
    name: '트로이 오리 문지기',
    patterns: ['beam', 'ring', 'dash', 'spread'],
    rest: 2.04,
    bossSpeed: 10.34,
    minionSpeed: 6.8,
    minionCount: 4,
    warning: 1.6,
    recovery: 1.7,
  },
];
export const PLAYER_SPEEDS = [7, 8.8, 10.6, 12.4];
export const PATTERN_SPECS = {
  spread: { speed: 11.8, life: 3.2, duration: 3.6, waves: 2, waveDelay: 0.75 },
  aimed: { speed: 14.2, life: 3.2, duration: 3.6, waves: 3, waveDelay: 0.45 },
  ring: { speed: 10.5, life: 3.2, duration: 3.6, waves: 2, waveDelay: 0.9 },
  beam: { duration: 1.4, width: 1.25 },
  dash: { duration: 1, speed: 12, range: 12 },
};
export const MAX_BULLETS = 14;
const PATTERN_NAMES = {
  spread: '부채 방울',
  aimed: '한곳 조준 방울',
  ring: '열린 방울 고리',
  dash: '한번 쭉 달리기',
  beam: '반짝 빛줄기',
};
const velocity = (x, y, speed) => {
  const length = Math.hypot(x, y);
  return length ? { vx: (x / length) * speed, vy: (y / length) * speed } : { vx: speed, vy: 0 };
};
export const STAGE_IDS = [
  'race',
  'duck',
  'pigs',
  'redhood',
  'beans',
  'ant',
  'lion',
  'fox',
  'wind',
  'ax',
  'piper',
  'troy',
];
export const TARGETS = [0.42, 0.52, 0.58, 0.62, 0.65, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8];
const IDS = STAGE_IDS;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  finite = (v, f) => (Number.isFinite(v) ? v : f);
const integer = (v, f, a, b) => clamp(Math.floor(finite(v, f)), a, b),
  capFor = id => (id === 'clock' ? 1 : 2);
const validPoint = p =>
  p &&
  Number.isFinite(p.x) &&
  Number.isFinite(p.y) &&
  p.x >= 2 &&
  p.x < WIDTH - 2 &&
  p.y >= 2 &&
  p.y < HEIGHT - 2;
const sameAngle = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 1e-7;
const validPatternAngles = (pattern, angles, base) => {
  if (!Array.isArray(angles) || !angles.length || !angles.every(Number.isFinite) || !Number.isFinite(base))
    return false;
  if (pattern === 'spread')
    return (
      [3, 5].includes(angles.length) &&
      angles.every((a, i) => sameAngle(a, base + (i - (angles.length - 1) / 2) * 0.3))
    );
  if (pattern === 'ring')
    return (
      [5, 7].includes(angles.length) &&
      angles.every((a, i) => sameAngle(a, base + Math.PI / 4 + (i * Math.PI * 1.5) / (angles.length - 1)))
    );
  return angles.length === 1 && sameAngle(angles[0], base);
};
export class GameEngine {
  constructor({
    stage,
    clearedCount = 0,
    onEvent = () => {},
    snapshot = null,
    ability = null,
    unlockedAbilities = null,
  }) {
    this.stage = stage;
    this.onEvent = onEvent;
    this.width = WIDTH;
    this.height = HEIGHT;
    this.stageNumber = integer(stage.index, IDS.indexOf(stage.id) + 1 || 1, 1, BOSS_PROFILES.length);
    this.level = this.stageNumber - 1;
    this.target = TARGETS[this.level];
    this.profile = { ...BOSS_PROFILES[this.level], name: stage.boss?.name || BOSS_PROFILES[this.level].name };
    this.clue = validPoint(stage.clue)
      ? {
          name: String(stage.clue.name || '이야기 단서'),
          x: Math.floor(stage.clue.x),
          y: Math.floor(stage.clue.y),
        }
      : { name: '이야기 단서', x: 36, y: 24 };
    this.clueFound = false;
    this.cells = new Uint8Array(WIDTH * HEIGHT);
    for (let y = 0; y < HEIGHT; y++)
      for (let x = 0; x < WIDTH; x++)
        if (x < 2 || y < 2 || x >= WIDTH - 2 || y >= HEIGHT - 2) this.cells[y * WIDTH + x] = 1;
    this.player = { x: 12, y: 1 };
    this.visualPlayer = { ...this.player };
    this.visualQueue = [];
    this.anchor = { ...this.player };
    this.trail = [];
    this.direction = { x: 0, y: 0 };
    this.drawHeld = false;
    this.accumulator = 0;
    this.pendingInitialStep = false;
    this.elapsed = 0;
    this.grace = 3;
    this.freeze = 0;
    this.slow = 0;
    this.boost = 0;
    this.speedLevel = 0;
    this.shield = 0;
    this.shell = false;
    this.unlockedAbilities = [
      ...new Set(
        (Array.isArray(unlockedAbilities) ? unlockedAbilities : ability ? [ability] : []).filter(id =>
          Object.hasOwn(ABILITIES, id),
        ),
      ),
    ];
    this.lastAbility = this.unlockedAbilities.includes(ability) ? ability : this.unlockedAbilities[0] || null;
    this.availableCharges = Object.fromEntries(this.unlockedAbilities.map(id => [id, capFor(id)]));
    this.energy = 3;
    this.abilityCooldown = 0;
    this.won = false;
    this.lost = false;
    this.lives = 3;
    this.enemies = [];
    this.bullets = [];
    this.beams = [];
    this.telegraphs = [];
    this.attackWaves = [];
    this.pickups = [];
    this.attackClock = this.profile.rest;
    this.warning = 0;
    this.attackIndex = 0;
    this.bossState = {
      phase: 'roam',
      pattern: null,
      name: this.profile.name,
      remaining: this.attackClock,
      enraged: false,
    };
    this.enemies.push({
      id: 0,
      x: 51,
      y: 33,
      ...velocity(1, 0.74, this.profile.bossSpeed),
      boss: true,
      dashing: false,
      behavior: 'wander',
    });
    for (let i = 0; i < this.profile.minionCount; i++)
      this.enemies.push({
        id: i + 1,
        x: 24 + i * 11,
        y: 19 + i * 4,
        ...velocity(-1, 0.8, this.profile.minionSpeed),
        boss: false,
        behavior: 'rush_wander',
        intent: { phase: 'roam', remaining: 3 + i * 0.8, angle: 0 },
      });
    this.pickups = [
      { x: 15, y: 9, type: 'speed' },
      { x: 36, y: 17, type: 'speed' },
      { x: 55, y: 28, type: 'speed' },
    ];
    this.initialOpen = (WIDTH - 4) * (HEIGHT - 4);
    this.restore(snapshot);
  }
  index(x, y) {
    return y * WIDTH + x;
  }
  isSafe(x, y) {
    return x >= 0 && y >= 0 && x < WIDTH && y < HEIGHT && this.cells[this.index(x, y)] === 1;
  }
  get progress() {
    let open = 0;
    for (const c of this.cells) if (!c) open++;
    return 1 - open / this.initialOpen;
  }
  get speed() {
    return PLAYER_SPEEDS[this.speedLevel] * (this.shell ? 0.7 : 1);
  }
  get ability() {
    return this.lastAbility;
  }
  get charges() {
    return this.availableCharges[this.ability] || 0;
  }
  set charges(value) {
    if (this.ability) this.availableCharges[this.ability] = integer(value, 0, 0, capFor(this.ability));
  }
  setDirection(x, y, { immediate = false } = {}) {
    if (this.lost) {
      this.direction = { x: 0, y: 0 };
      this.accumulator = 0;
      this.pendingInitialStep = false;
      return;
    }
    const next = {
      x: Number.isFinite(x) ? Math.sign(x) : 0,
      y: x ? 0 : Number.isFinite(y) ? Math.sign(y) : 0,
    };
    const changed = next.x !== this.direction.x || next.y !== this.direction.y;
    if (!next.x && !next.y) {
      this.accumulator = 0;
      this.pendingInitialStep = false;
    } else if (immediate && changed) {
      // A complete key tap can happen between animation frames. Commit its first cell
      // once, while visualQueue still animates that cell at the normal walking speed.
      this.move(next.x, next.y);
      this.accumulator = 0;
      this.pendingInitialStep = false;
    } else if (!this.direction.x && !this.direction.y) this.pendingInitialStep = true;
    this.direction = next;
  }
  setDrawHeld(held) {
    const next = !this.lost && !!held;
    if (next && !this.drawHeld && (this.direction.x || this.direction.y)) this.pendingInitialStep = true;
    this.drawHeld = next;
    if (!next && this.trail.length) this.accumulator = 0;
  }
  canMove(dx, dy) {
    if (this.won || this.lost || (!dx && !dy) || Math.abs(dx) + Math.abs(dy) !== 1) return false;
    const x = this.player.x + dx,
      y = this.player.y + dy;
    if (x < 1 || y < 1 || x >= WIDTH - 1 || y >= HEIGHT - 1) return false;
    const previous = this.trail.length >= 2 ? this.trail[this.trail.length - 2] : this.anchor;
    if (this.trail.length && x === previous.x && y === previous.y) return true;
    if (this.trail.some(p => p.x === x && p.y === y)) return false;
    if (this.trail.length && !this.drawHeld) return false;
    return this.drawHeld || this.isSafe(x, y);
  }
  step(dt) {
    dt = clamp(finite(dt, 0), 0, 0.1);
    if (dt <= 0 || this.lost) return;
    if (this.won) {
      this.updateVisual(dt);
      return;
    }
    this.elapsed += dt;
    const factor = this.freeze > 0 ? 0 : this.slow > 0 ? 0.4 : 1;
    for (const key of ['grace', 'freeze', 'slow', 'boost', 'abilityCooldown'])
      this[key] = Math.max(0, this[key] - dt);
    if (this.canMove(this.direction.x, this.direction.y)) {
      if (this.pendingInitialStep) {
        this.pendingInitialStep = false;
        this.move(this.direction.x, this.direction.y);
        this.accumulator = 0;
      } else this.accumulator += dt * this.speed;
      while (this.accumulator >= 1 - 1e-9 && !this.won) {
        this.accumulator = Math.max(0, this.accumulator - 1);
        if (!this.move(this.direction.x, this.direction.y)) {
          this.accumulator = 0;
          break;
        }
      }
    } else {
      this.accumulator = 0;
      this.pendingInitialStep = false;
    }
    this.updateVisual(dt);
    if (this.won) return;
    this.bossState.enraged = this.stageNumber >= 3 && this.progress >= 0.5;
    this.advanceEnemies(dt, factor);
    if (this.lost) return;
    this.advanceBoss(dt * factor);
    this.advanceProjectiles(dt, factor);
  }
  updateVisual(dt) {
    let distance = dt * this.speed;
    while (this.visualQueue.length && distance > 0) {
      const next = this.visualQueue[0],
        dx = next.x - this.visualPlayer.x,
        dy = next.y - this.visualPlayer.y,
        length = Math.hypot(dx, dy);
      if (length <= distance + 1e-8) {
        this.visualPlayer = { ...next };
        this.visualQueue.shift();
        distance -= length;
      } else {
        this.visualPlayer.x += (dx / length) * distance;
        this.visualPlayer.y += (dy / length) * distance;
        distance = 0;
      }
    }
  }
  syncVisual() {
    this.visualPlayer = { ...this.player };
    this.visualQueue = [];
    this.accumulator = 0;
    this.pendingInitialStep = false;
  }
  blocked(x, y) {
    return x < 2 || y < 2 || x >= WIDTH - 2 || y >= HEIGHT - 2 || this.isSafe(Math.floor(x), Math.floor(y));
  }
  touchesTrail(x, y, r) {
    return this.trail.some(p => Math.hypot(p.x + 0.5 - x, p.y + 0.5 - y) < r);
  }
  advanceIntent(enemy, dt) {
    if (enemy.boss || !enemy.intent) return 1;
    const intent = enemy.intent;
    intent.remaining -= dt;
    if (intent.phase === 'roam' && intent.remaining <= 0) {
      if (this.bossState.phase === 'warning') {
        intent.remaining = 0.35;
        return 1;
      }
      intent.phase = 'warmup';
      intent.remaining = 0.9;
      this.onEvent({
        type: 'minion-warning',
        enemyId: enemy.id,
        message: '꼬마 친구가 빨개지면 곧 빨라져요!',
      });
    } else if (intent.phase === 'warmup' && intent.remaining <= 0) {
      intent.phase = 'rush';
      intent.remaining = 1.5;
    } else if (intent.phase === 'rush' && intent.remaining <= 0) {
      intent.phase = 'roam';
      intent.remaining = 4 + (enemy.id % 3) * 0.6;
    }
    return intent.phase === 'rush' ? 1.7 : 1;
  }
  advanceEnemies(dt, factor) {
    for (const enemy of this.enemies) {
      if (this.lost) return;
      let movement = factor * (factor > 0 ? this.advanceIntent(enemy, dt * factor) : 0);
      if (enemy.boss) {
        if (
          this.bossState.phase === 'warning' ||
          (this.bossState.phase === 'attack' && !enemy.dashing) ||
          this.bossState.phase === 'recover'
        )
          movement = 0;
        else if (enemy.dashing && dt * factor > 0)
          movement *= Math.min(1, Math.max(0, this.bossState.remaining) / (dt * factor));
        else if (this.stageNumber === 2) {
          const angle = Math.atan2(enemy.vy, enemy.vx) + Math.sin(this.elapsed * 1.4) * dt * factor * 0.55;
          Object.assign(enemy, velocity(Math.cos(angle), Math.sin(angle), this.profile.bossSpeed));
        }
      }
      const substeps = Math.max(
        1,
        Math.ceil((Math.max(Math.abs(enemy.vx), Math.abs(enemy.vy)) * dt * movement) / 0.18),
      );
      for (let n = 0; n < substeps; n++) {
        if (this.lost) return;
        const dx = (enemy.vx * dt * movement) / substeps,
          dy = (enemy.vy * dt * movement) / substeps;
        if (
          enemy.dashing &&
          (this.blocked(enemy.x + dx, enemy.y) ||
            this.blocked(enemy.x, enemy.y + dy) ||
            this.blocked(enemy.x + dx, enemy.y + dy))
        ) {
          this.endDash();
          this.beginRecovery();
          break;
        }
        if (this.blocked(enemy.x + dx, enemy.y)) enemy.vx *= -1;
        else enemy.x += dx;
        if (this.blocked(enemy.x, enemy.y + dy)) enemy.vy *= -1;
        else enemy.y += dy;
        if (this.touchesTrail(enemy.x, enemy.y, enemy.boss ? 1.2 : 0.72)) this.damage();
      }
    }
  }
  nextPattern() {
    return this.profile.patterns[this.attackIndex % this.profile.patterns.length] || null;
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
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
  }
  clearBoss() {
    if (this.bossState.phase !== 'cleared') this.cancelAttack();
    Object.assign(this.bossState, {
      phase: 'cleared',
      pattern: null,
      name: this.profile.name,
      remaining: 0,
      enraged: false,
    });
  }
  rayLength(x, y, angle) {
    const dx = Math.cos(angle),
      dy = Math.sin(angle);
    for (let length = 0.25; length < 100; length += 0.25)
      if (this.blocked(x + dx * length, y + dy * length)) return Math.max(0, length - 0.25);
    return 100;
  }
  advanceProjectiles(dt, factor) {
    if (this.lost) return;
    this.bullets = this.bullets.filter(b => {
      if (this.lost) return true;
      const travelDt = Math.min(dt * factor, b.life),
        substeps = Math.max(1, Math.ceil((Math.max(Math.abs(b.vx), Math.abs(b.vy)) * travelDt) / 0.18));
      for (let n = 0; n < substeps; n++) {
        b.x += (b.vx * travelDt) / substeps;
        b.y += (b.vy * travelDt) / substeps;
        if (this.blocked(b.x, b.y)) return false;
        if (this.touchesTrail(b.x, b.y, 0.65)) {
          this.damage();
          return false;
        }
      }
      b.life -= dt * factor;
      return b.life > 0;
    });
    this.beams = this.beams.filter(b => {
      if (this.lost) return true;
      if (this.blocked(b.x, b.y)) return false;
      b.length = Math.min(b.length, this.rayLength(b.x, b.y, b.angle));
      if (factor > 0)
        for (const p of this.trail) {
          const dx = p.x + 0.5 - b.x,
            dy = p.y + 0.5 - b.y,
            along = dx * Math.cos(b.angle) + dy * Math.sin(b.angle),
            across = Math.abs(-dx * Math.sin(b.angle) + dy * Math.cos(b.angle));
          if (along >= 0 && along <= b.length && across < b.width * 0.5 + 0.4) {
            this.damage();
            break;
          }
        }
      b.life -= dt * factor;
      return b.life > 0;
    });
  }
  move(dx, dy) {
    if (!this.canMove(dx, dy)) return false;
    const x = this.player.x + dx,
      y = this.player.y + dy,
      previous = this.trail.length >= 2 ? this.trail[this.trail.length - 2] : this.anchor,
      reversing = this.trail.length && x === previous.x && y === previous.y;
    this.player = { x, y };
    this.visualQueue.push({ ...this.player });
    if (reversing) {
      this.trail.pop();
      return true;
    }
    if (this.isSafe(x, y)) {
      this.anchor = { x, y };
      if (this.trail.length) this.capture();
    } else this.trail.push({ x, y });
    this.collectNearby();
    return true;
  }
  collectNearby() {
    if (this.lost) return;
    this.pickups = this.pickups.filter(p => {
      if (Math.hypot(p.x - this.player.x, p.y - this.player.y) < 1.5 || this.isSafe(p.x, p.y)) {
        const before = this.speed;
        this.speedLevel = Math.min(3, this.speedLevel + 1);
        this.onEvent({
          type: 'pickup',
          speedLevel: this.speedLevel,
          speed: this.speed,
          gain: this.speed - before,
          message:
            this.speed > before
              ? `걸음 별 ${this.speedLevel}/3! 발걸음이 더 빨라졌어요!`
              : '걸음 별 3/3! 가장 빠른 발걸음이에요!',
        });
        return false;
      }
      return true;
    });
  }
  capture() {
    if (this.lost) return;
    const before = this.progress;
    for (const p of this.trail) this.cells[this.index(p.x, p.y)] = 1;
    this.trail = [];
    const seen = new Uint8Array(this.cells.length),
      regions = [];
    for (let i = 0; i < this.cells.length; i++) {
      if (this.cells[i] || seen[i]) continue;
      const region = [],
        queue = [i];
      seen[i] = 1;
      for (let q = 0; q < queue.length; q++) {
        const at = queue[q];
        region.push(at);
        const x = at % WIDTH,
          y = Math.floor(at / WIDTH);
        for (const next of [
          x > 0 ? at - 1 : -1,
          x < WIDTH - 1 ? at + 1 : -1,
          y > 0 ? at - WIDTH : -1,
          y < HEIGHT - 1 ? at + WIDTH : -1,
        ])
          if (next >= 0 && !seen[next] && !this.cells[next]) {
            seen[next] = 1;
            queue.push(next);
          }
      }
      regions.push(region);
    }
    // Keep only the largest component; any enemies in the small captured side disappear.
    regions.sort((a, b) => b.length - a.length);
    for (let r = 1; r < regions.length; r++) for (const i of regions[r]) this.cells[i] = 1;
    const caught = this.enemies.filter(e => this.isSafe(Math.floor(e.x), Math.floor(e.y)));
    this.enemies = this.enemies.filter(e => !this.isSafe(Math.floor(e.x), Math.floor(e.y)));
    this.bullets = this.bullets.filter(e => !this.isSafe(Math.floor(e.x), Math.floor(e.y)));
    if (caught.some(e => e.boss)) this.clearBoss();
    this.collectNearby();
    this.grace = 1.4;
    this.onEvent({
      type: 'capture',
      gain: this.progress - before,
      caught: caught.length,
      caughtPositions: caught.map(e => ({ x: e.x, y: e.y, boss: !!e.boss })),
      bossCaught: caught.some(e => e.boss),
      message: caught.length ? '꼬임 친구를 감쌌어요! 이야기가 돌아와요.' : '잘했어요! 그림이 더 환해졌어요.',
    });
    this.checkWin();
  }
  checkClue() {
    if (this.lost) return this.clueFound;
    if (!this.clueFound && this.isSafe(this.clue.x, this.clue.y)) {
      this.clueFound = true;
      this.onEvent({ type: 'clue', clue: { ...this.clue }, message: this.clue.name + '을 찾았어요!' });
    }
    return this.clueFound;
  }
  checkWin() {
    if (this.lost) return;
    this.checkClue();
    if (!this.won && this.progress >= this.target && this.clueFound) {
      this.won = true;
      this.setDirection(0, 0);
      this.onEvent({ type: 'win' });
    }
  }
  damage() {
    if (this.won || this.lost || this.grace > 0 || !this.trail.length) return false;
    if (this.shield > 0) {
      this.shield--;
      this.grace = 2.8;
      if (!this.shield) this.shell = false;
      this.onEvent({ type: 'block', lives: this.lives, message: '든든한 방패가 지켜 줬어요!' });
      return true;
    }
    this.lives = Math.max(0, this.lives - 1);
    this.lost = this.lives === 0;
    this.trail = [];
    this.player = { ...this.anchor };
    this.setDirection(0, 0);
    if (this.lost) this.setDrawHeld(false);
    this.syncVisual();
    this.grace = this.lost ? 0 : 4;
    this.onEvent({
      type: 'hit',
      lives: this.lives,
      terminal: this.lost,
      message: this.lost
        ? '하트를 모두 썼어요. 다시 도전해 볼까요?'
        : '하트 하나가 줄었어요. 밝힌 그림은 그대로예요!',
    });
    if (this.lost)
      this.onEvent({ type: 'lose', lives: 0, message: '이번 도전은 여기까지! 다시 도전해 볼까요?' });
    return true;
  }
  useAbility(id = this.ability) {
    if (
      !this.unlockedAbilities.includes(id) ||
      this.availableCharges[id] <= 0 ||
      this.energy <= 0 ||
      this.abilityCooldown > 0 ||
      this.won ||
      this.lost
    )
      return false;
    this.lastAbility = id;
    this.availableCharges[id]--;
    this.energy--;
    this.abilityCooldown = 0.7;
    let caughtPositions = [];
    switch (id) {
      case 'shell':
        this.shield = 3;
        this.shell = true;
        break;
      case 'feather': {
        const near = this.enemies.filter(
          e => !e.boss && Math.hypot(e.x - this.player.x, e.y - this.player.y) < 22,
        );
        caughtPositions = near.map(e => ({ x: e.x, y: e.y, boss: false }));
        this.enemies = this.enemies.filter(e => !near.includes(e));
        this.bullets = this.bullets.filter(b =>
          Math.hypot(b.x - this.player.x, b.y - this.player.y) < 22 ? false : true,
        );
        this.grace = Math.max(this.grace, 2);
        break;
      }
      case 'lantern':
        this.cancelAttack();
        this.freeze = Math.max(this.freeze, 3);
        break;
      case 'clock':
        this.freeze = 5;
        break;
    }
    this.onEvent({
      type: 'ability',
      ability: id,
      caughtPositions,
      message: `${ABILITIES[id].name}의 도움을 받았어요!`,
    });
    this.checkWin();
    return true;
  }
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
  }
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
  }
}
