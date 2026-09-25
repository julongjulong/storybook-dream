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
export const PATTERN_NAMES = {
  spread: '부채 방울',
  aimed: '한곳 조준 방울',
  ring: '열린 방울 고리',
  dash: '한번 쭉 달리기',
  beam: '반짝 빛줄기',
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
export const TARGETS = [0.42, 0.52, 0.58, 0.62, 0.65, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8];
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
export const sameAngle = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < 1e-7;
export const validPatternAngles = (pattern, angles, base) => {
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
