// GameEngine: one case board. Rule groups live in src/game/ and are mixed into the class.
import {
  WIDTH,
  ABILITIES,
  BOSS_PROFILES,
  PLAYER_SPEEDS,
  velocity,
  TARGETS,
  clamp,
  integer,
  validPoint,
  HEIGHT,
  finite,
  STAGE_IDS,
  capFor,
} from './game/config.js';
import { playerMethods } from './game/player.js';
import { enemiesMethods } from './game/enemies.js';
import { bossMethods } from './game/boss.js';
import { projectilesMethods } from './game/projectiles.js';
import { saveMethods } from './game/save.js';

export {
  WIDTH,
  HEIGHT,
  ABILITIES,
  BOSS_PROFILES,
  PLAYER_SPEEDS,
  PATTERN_SPECS,
  MAX_BULLETS,
  STAGE_IDS,
  TARGETS,
} from './game/config.js';

const IDS = STAGE_IDS;

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
    this.glide = null;
    this.tap = null;
    this.pace = 0;
    this.facing = 1;
    this.drawingStep = false;
    this.anchor = { ...this.player };
    this.trail = [];
    this.direction = { x: 0, y: 0 };
    this.drawHeld = false;
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
  step(dt) {
    dt = clamp(finite(dt, 0), 0, 0.1);
    if (dt <= 0 || this.lost) return;
    this.rememberPositions();
    if (this.won) return;
    this.elapsed += dt;
    const factor = this.freeze > 0 ? 0 : this.slow > 0 ? 0.4 : 1;
    for (const key of ['grace', 'freeze', 'slow', 'boost', 'abilityCooldown'])
      this[key] = Math.max(0, this[key] - dt);
    this.advancePlayer(dt);
    if (this.won) return;
    this.bossState.enraged = this.stageNumber >= 3 && this.progress >= 0.5;
    this.advanceEnemies(dt, factor);
    if (this.lost) return;
    this.advanceBoss(dt * factor);
    this.advanceProjectiles(dt, factor);
  }
  blocked(x, y) {
    return x < 2 || y < 2 || x >= WIDTH - 2 || y >= HEIGHT - 2 || this.isSafe(Math.floor(x), Math.floor(y));
  }
  // The trail is its cells plus the rabbit itself while it is out on unclaimed ground.
  touchesTrail(x, y, r) {
    if (this.trail.some(p => Math.hypot(p.x + 0.5 - x, p.y + 0.5 - y) < r)) return true;
    const v = this.visualPlayer;
    return this.isExposed() && Math.hypot(v.x + 0.5 - x, v.y + 0.5 - y) < r;
  }
  // Positions at the start of a rule step, so drawing can blend smoothly between steps.
  // Kept outside the objects so saves and comparisons never see them.
  rememberPositions() {
    this.prevVisual = { ...this.visualPlayer };
    this.prevPos ??= new WeakMap();
    for (const o of this.enemies) this.prevPos.set(o, { x: o.x, y: o.y });
    for (const o of this.bullets) this.prevPos.set(o, { x: o.x, y: o.y });
  }
  rayLength(x, y, angle) {
    const dx = Math.cos(angle),
      dy = Math.sin(angle);
    for (let length = 0.25; length < 100; length += 0.25)
      if (this.blocked(x + dx * length, y + dy * length)) return Math.max(0, length - 0.25);
    return 100;
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
    if (this.won || this.lost || this.grace > 0 || !this.isExposed()) return false;
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
}
Object.assign(
  GameEngine.prototype,
  playerMethods,
  enemiesMethods,
  bossMethods,
  projectilesMethods,
  saveMethods,
);
