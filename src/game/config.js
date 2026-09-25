// Tunable numbers and small shared helpers for the game rules.
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
    recovery: 2.45,
  },
  {
    name: '뒤뚱뒤뚱 물갈퀴 장화',
    patterns: ['aimed'],
    rest: 3.23,
    bossSpeed: 6.16,
    minionSpeed: 4.1,
    minionCount: 1,
    warning: 1.4,
    recovery: 1.67,
  },
  {
    name: '벽돌집 설계 소동',
    patterns: ['spread'],
    rest: 3.06,
    bossSpeed: 6.93,
    minionSpeed: 4.8,
    minionCount: 2,
    warning: 1.25,
    recovery: 1.6,
  },
  {
    name: '할머니 집 열쇠 달리기',
    patterns: ['dash', 'aimed'],
    rest: 2.89,
    bossSpeed: 7.7,
    minionSpeed: 5.2,
    minionCount: 2,
    warning: 1.2,
    recovery: 1.55,
  },
  {
    name: '콩나무 종 방울',
    patterns: ['ring', 'aimed'],
    rest: 2.72,
    bossSpeed: 8.03,
    minionSpeed: 5.5,
    minionCount: 2,
    warning: 1.15,
    recovery: 1.49,
  },
  {
    name: '개미 창고 빛줄기',
    patterns: ['beam', 'spread'],
    rest: 2.55,
    bossSpeed: 8.58,
    minionSpeed: 5.8,
    minionCount: 3,
    warning: 1.1,
    recovery: 1.43,
  },
  {
    name: '생쥐 가위 구조 작전',
    patterns: ['aimed', 'dash', 'beam'],
    rest: 2.46,
    bossSpeed: 9.02,
    minionSpeed: 6,
    minionCount: 3,
    warning: 1.05,
    recovery: 1.37,
  },
  {
    name: '포도밭 사다리 빛놀이',
    patterns: ['ring', 'beam', 'spread'],
    rest: 2.38,
    bossSpeed: 9.35,
    minionSpeed: 6.2,
    minionCount: 3,
    warning: 1,
    recovery: 1.31,
  },
  {
    name: '바람의 모자 끈',
    patterns: ['spread', 'dash', 'ring'],
    rest: 2.29,
    bossSpeed: 9.68,
    minionSpeed: 6.4,
    minionCount: 3,
    warning: 1,
    recovery: 1.31,
  },
  {
    name: '쇠도끼 반짝 물결',
    patterns: ['aimed', 'beam', 'ring'],
    rest: 2.21,
    bossSpeed: 9.9,
    minionSpeed: 6.5,
    minionCount: 4,
    warning: 0.95,
    recovery: 1.25,
  },
  {
    name: '피리 마개 행진',
    patterns: ['ring', 'spread', 'aimed', 'dash'],
    rest: 2.13,
    bossSpeed: 10.12,
    minionSpeed: 6.6,
    minionCount: 4,
    warning: 0.95,
    recovery: 1.25,
  },
  {
    name: '트로이 오리 문지기',
    patterns: ['beam', 'ring', 'dash', 'spread'],
    rest: 2.04,
    bossSpeed: 10.34,
    minionSpeed: 6.8,
    minionCount: 4,
    warning: 0.9,
    recovery: 1.19,
  },
  {
    name: '흩날리는 깃털',
    patterns: [],
    rest: 3.2,
    bossSpeed: 4.5,
    minionSpeed: 0,
    minionCount: 0,
    warning: 1.4,
    recovery: 2,
  },
];
export const PLAYER_SPEEDS = [8.5, 10, 11.5, 13];
export const PATTERN_SPECS = {
  spread: { speed: 11.8, life: 3.2, duration: 3.6, waves: 2, waveDelay: 0.75 },
  aimed: { speed: 14.2, life: 3.2, duration: 3.6, waves: 3, waveDelay: 0.45 },
  ring: { speed: 10.5, life: 3.2, duration: 3.6, waves: 2, waveDelay: 0.9 },
  beam: { duration: 1.4, width: 1.25 },
  dash: { duration: 1, speed: 12, range: 12 },
  crumbdash: { duration: 1, speed: 12, range: 12, crumbEvery: 1.5, crumbLife: 2.5 },
  // v5 signature moves (see src/game/moves.js)
  sprinkler: { speed: 9, life: 3.2, duration: 2.2, arc: 3.4, sweepTime: 1.6, interval: 0.13 },
  rain: { duration: 0.6, count: 4, radius: 1.6, life: 0.45 },
  pulse: { speed: 9.5, life: 3.2, duration: 2.4, waves: 3, waveDelay: 0.45 },
  split: { speed: 11, life: 3, duration: 2.2, waves: 2, waveDelay: 0.8, splitAt: 0.55, spread: 0.45 },
  grapes: { duration: 1.8, count: 4, popAt: 1.1, seedSpeed: 7, seedLife: 1.2 },
  gust: { speed: 7.5, life: 3.5, duration: 3, curve: 0.7 },
  sweep: { duration: 1.6, width: 1.1, arc: 1.75 },
  notes: { speed: 9, life: 3, duration: 2.2, waves: 5, waveDelay: 0.22, curve: 1.1 },
  summon: { duration: 0.8 },
};
export const MAX_BULLETS = 24;
export const PATTERN_NAMES = {
  spread: '부채 방울',
  aimed: '한곳 조준 방울',
  ring: '열린 방울 고리',
  dash: '한번 쭉 달리기',
  beam: '반짝 빛줄기',
  crumbdash: '빵가루 데굴 돌진',
  sprinkler: '빙글빙글 벽돌 물줄기',
  rain: '톡톡 빗방울',
  pulse: '둥둥 북소리 고리',
  split: '매듭 풀리는 방울',
  grapes: '톡 터지는 포도알',
  gust: '살랑 나뭇잎 바람',
  sweep: '빙그르 빛 돌림판',
  notes: '꼬불꼬불 음표 행진',
  summon: '문 열고 나온 친구들',
};
export const velocity = (x, y, speed) => {
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
// The 13th entry is the final chapter (또롱의 둥지).
export const TARGETS = [0.42, 0.52, 0.58, 0.62, 0.65, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8, 0.6];
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v)),
  finite = (v, f) => (Number.isFinite(v) ? v : f);
export const integer = (v, f, a, b) => clamp(Math.floor(finite(v, f)), a, b),
  capFor = id => (id === 'clock' ? 1 : 2);
export const validPoint = p =>
  p &&
  Number.isFinite(p.x) &&
  Number.isFinite(p.y) &&
  p.x >= 2 &&
  p.x < WIDTH - 2 &&
  p.y >= 2 &&
  p.y < HEIGHT - 2;

// Dash-type patterns: the boss itself charges along the tell.
export const isDash = pattern => pattern === 'dash' || pattern === 'crumbdash';

// v5 boss plans per case. moves: what the boss may choose at any time.
// late: extra moves from 50% restored (phase 2). A list is a combo, chained with a short follow-up tell.
// hunt (0..1): how strongly the boss steers toward the rabbit while it is out drawing.
// names / skin (optional): rename a move for this boss, or draw its leaves as something else.
export const BOSS_PLANS = {
  race: { hunt: 0.35, moves: [], late: [] },
  duck: { hunt: 0.3, moves: ['aimed'], late: [] },
  pigs: { hunt: 0.4, moves: ['spread', 'sprinkler'], late: [['sprinkler', 'sprinkler']] },
  redhood: { hunt: 0.7, moves: ['crumbdash', 'aimed'], late: [['crumbdash', 'crumbdash']] },
  beans: { hunt: 0.5, moves: ['rain', 'aimed'], late: [['rain', 'rain']] },
  ant: { hunt: 0.5, moves: ['pulse', 'spread', 'beam'], late: [['pulse', 'beam']] },
  lion: { hunt: 0.6, moves: ['split', 'dash', 'beam'], late: [['dash', 'split']] },
  fox: { hunt: 0.55, moves: ['grapes', 'spread', 'beam'], late: [['grapes', 'ring']] },
  wind: { hunt: 0.6, moves: ['gust', 'dash', 'ring'], late: [['gust', 'gust']] },
  ax: { hunt: 0.55, moves: ['sweep', 'aimed', 'ring'], late: [['sweep', 'aimed']] },
  piper: { hunt: 0.65, moves: ['notes', 'ring', 'dash'], late: [['notes', 'notes']] },
  // Final chapter: only drifting feathers, no charge and no fuse.
  nest: { hunt: 0.2, moves: ['gust'], late: [], names: { gust: '팔랑 깃털 바람' }, skin: 'feather' },
  troy: {
    hunt: 0.7,
    moves: ['dash', 'ring', 'summon', 'split'],
    late: [
      ['summon', 'dash'],
      ['sweep', 'notes'],
    ],
  },
};
// New helpers: a chaser from case 4 (helper #1 follows the rabbit's line),
// and from case 6 a fuse that runs along a line the rabbit has stopped on.
export const CHASER_FROM = 4;
export const FUSE_FROM = 6;
export const FINALE_ID = 'nest';
export const FUSE = { wait: 1.2, speed: 4 }; // seconds standing still before it lights; cells per second
export const minionBehavior = (stageNumber, id) =>
  stageNumber >= CHASER_FROM && id === 1 ? 'chaser' : 'rush_wander';
export const FOLLOW_UP_WARNING = 0.55; // seconds of tell for the second hit of a combo
export const PHASE_TWO = 0.5; // share restored when the boss enters phase 2

// Small seeded random source, so a case plays the same way for the same inputs.
export const makeRng = seed => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
