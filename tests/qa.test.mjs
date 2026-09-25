import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, WIDTH, HEIGHT, ABILITIES, PLAYER_SPEEDS } from '../src/engine.js';
import { STORY } from '../src/story-data.js';

const create = (options = {}) => {
  const g = new GameEngine({ stage: { id: 'cinderella', index: 2 }, clearedCount: 1, ...options });
  g.setDrawHeld(true);
  return g;
};
const advance = (g, seconds) => {
  for (let i = 0; i < Math.round(seconds * 100); i++) g.step(0.01);
};
const walk = (g, dx, dy, n) => {
  for (let i = 0; i < n; i++) g.move(dx, dy);
};
const enemy = (id, x, y, boss = false) => ({ id, x, y, vx: 0, vy: 0, boss });

test('직선으로 작은 영역에 가둔 보스와 작은 적은 함께 사라지고 큰 영역 적은 남는다', () => {
  const g = create();
  g.target = 0.99;
  g.player = { x: 20, y: 1 };
  g.anchor = { ...g.player };
  g.enemies = [enemy(0, 8, 22, true), enemy(1, 12, 30), enemy(2, 50, 30)];
  walk(g, 0, 1, 45);
  assert.equal(g.isSafe(8, 22), true);
  assert.equal(g.isSafe(50, 30), false);
  assert.deepEqual(
    g.enemies.map(e => e.id),
    [2],
  );
  assert.equal(g.won, false);
});

test('ㄱ자 연결로 작은 모서리를 포획해도 바깥 보스는 남는다', () => {
  const g = create();
  g.target = 0.99;
  g.player = { x: 15, y: 1 };
  g.anchor = { ...g.player };
  g.enemies = [enemy(0, 50, 30, true), enemy(1, 7, 8)];
  walk(g, 0, 1, 12);
  walk(g, -1, 0, 14);
  assert.equal(g.isSafe(7, 8), true);
  assert.equal(g.isSafe(50, 30), false);
  assert.deepEqual(
    g.enemies.map(e => e.id),
    [0],
  );
});

test('보스만 작은 영역에 가둬도 점유율과 단서까지 완성해야 한다', () => {
  const g = create({ stage: { id: 'race' } });
  g.player = { x: 15, y: 1 };
  g.anchor = { ...g.player };
  g.enemies = [enemy(0, 7, 8, true)];
  walk(g, 0, 1, 12);
  walk(g, -1, 0, 14);
  assert.equal(g.enemies.length, 0);
  assert.equal(g.won, false);
});

test('선 되짚기는 한 칸씩 지우고 시작점까지 안전하게 돌아간다', () => {
  const g = create();
  walk(g, 0, 1, 5);
  assert.equal(g.trail.length, 5);
  walk(g, 0, -1, 5);
  assert.equal(g.trail.length, 0);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  assert.equal(g.progress, 0);
});

test('자기 선의 중간을 가로지르려 하면 기다리고 영토를 잘못 채우지 않는다', () => {
  const g = create();
  walk(g, 0, 1, 6);
  walk(g, 1, 0, 4);
  walk(g, 0, -1, 3);
  walk(g, -1, 0, 3);
  const before = { ...g.player },
    count = g.trail.length;
  g.move(-1, 0);
  assert.deepEqual(g.player, before);
  assert.equal(g.trail.length, count);
  assert.equal(g.progress, 0);
});

test('피격은 현재 선만 없애고 확보 영역과 속도 아이템을 보존한다', () => {
  const g = create();
  g.cells[g.index(10, 10)] = 1;
  g.speedLevel = 2;
  walk(g, 0, 1, 5);
  g.grace = 0;
  g.damage();
  assert.equal(g.trail.length, 0);
  assert.deepEqual(g.player, g.anchor);
  assert.equal(g.isSafe(10, 10), true);
  assert.equal(g.speedLevel, 2);
  assert.ok(g.grace > 0);
});

test('안전지대에서는 피격이나 방패 소모가 없다', () => {
  const g = create({ ability: 'shell' });
  g.useAbility();
  g.grace = 0;
  g.damage();
  assert.equal(g.shield, 3);
});

test('등껍질은 세 번 방어하고 그 뒤 정상 속도와 재시작 규칙으로 돌아간다', () => {
  const g = create({ ability: 'shell' });
  assert.equal(g.useAbility(), true);
  assert.ok(Math.abs(g.speed - PLAYER_SPEEDS[0] * 0.7) < 1e-9);
  walk(g, 0, 1, 3);
  for (let i = 2; i >= 0; i--) {
    g.grace = 0;
    g.damage();
    assert.equal(g.shield, i);
    assert.ok(g.trail.length > 0);
  }
  assert.equal(g.shell, false);
  assert.equal(g.speed, PLAYER_SPEEDS[0]);
  g.grace = 0;
  g.damage();
  assert.equal(g.trail.length, 0);
});

test('기본 걸음은 첫 단계 속도이며 별은 최대 세 개다', () => {
  const g = create();
  assert.equal(g.speed, PLAYER_SPEEDS[0]);
  g.setDirection(1, 0);
  for (let i = 0; i < 10; i++) g.step(0.1);
  // One second of walking, minus the short start-up ramp.
  assert.ok(g.player.x >= 12 + Math.floor(g.speed * 0.9) && g.player.x <= 12 + Math.ceil(g.speed));
  g.player = { x: g.pickups[0].x, y: g.pickups[0].y };
  g.collectNearby();
  assert.equal(g.speedLevel, 1);
  assert.equal(g.speed, PLAYER_SPEEDS[1]);
  for (let i = 0; i < 8; i++) {
    g.pickups = [{ ...g.player, type: 'speed' }];
    g.collectNearby();
  }
  assert.equal(g.speedLevel, 3);
});

test('별 세 개는 가장 빠른 단계이며 폐기된 구두로 더 빨라지지 않는다', () => {
  const g = create({ ability: 'slippers' });
  g.speedLevel = 3;
  assert.equal(g.useAbility(), false);
  assert.equal(g.speed, PLAYER_SPEEDS[3]);
});

test('깃털은 가까운 작은 적만 되돌리고 보스와 먼 적은 남긴다', () => {
  const g = create({ ability: 'feather' });
  g.enemies = [enemy(0, 14, 6, true), enemy(1, 14, 6), enemy(2, 65, 40)];
  g.useAbility();
  assert.deepEqual(
    g.enemies.map(e => e.id),
    [0, 2],
  );
});

test('등불과 시계는 규정된 정지 지속 시간을 준다', () => {
  for (const [ability, field, expected] of [
    ['lantern', 'freeze', 3],
    ['clock', 'freeze', 5],
  ]) {
    const g = create({ ability });
    g.useAbility();
    assert.equal(g[field], expected, ability);
  }
});

test('정지 능력은 이동뿐 아니라 보스의 다음 공격도 멈춘다', () => {
  const g = create({ stage: { id: 'duck', index: 3 }, ability: 'clock' });
  g.attackClock = 0.05;
  g.useAbility();
  g.step(0.1);
  assert.equal(g.bullets.length, 0);
  assert.equal(g.attackClock, 0.05);
});

test('삭제된 사과와 구두는 능력 목록과 저장된 인벤토리에서 제외된다', () => {
  const g = create({ unlockedAbilities: ['apple', 'slippers', 'shell'] });
  assert.deepEqual(g.unlockedAbilities, ['shell']);
  assert.equal(g.useAbility('apple'), false);
});

test('일반 능력은 두 번, 시계는 한 번이며 완료 후 사용할 수 없다', () => {
  for (const ability of Object.keys(ABILITIES)) {
    const g = create({ ability });
    assert.equal(g.useAbility(), true);
    advance(g, 0.8);
    assert.equal(g.useAbility(), ability !== 'clock');
    advance(g, 0.8);
    assert.equal(g.useAbility(), false);
    const won = create({ ability });
    won.won = true;
    assert.equal(won.useAbility(), false);
  }
});

test('그리기를 누르지 않으면 안전지대 밖에 나갈 수 없고 선 중 해제 시 되짚기만 된다', () => {
  const g = create();
  g.setDrawHeld(false);
  assert.equal(g.move(0, 1), false);
  assert.deepEqual(g.player, { x: 12, y: 1 });
  assert.equal(g.move(1, 0), true);
  g.setDrawHeld(true);
  walk(g, 0, 1, 3);
  g.setDrawHeld(false);
  const before = { ...g.player };
  assert.equal(g.move(1, 0), false);
  assert.deepEqual(g.player, before);
  assert.equal(g.move(0, -1), true);
  assert.equal(g.trail.length, 2);
  g.setDrawHeld(true);
  assert.equal(g.move(1, 0), true);
});

test('화면 좌표는 칸 사이를 미끄러지고 멈추면 다음 칸 중심에 정확히 선다', () => {
  const g = create();
  g.setDirection(1, 0);
  g.step(0.05);
  assert.equal(g.player.x, 12);
  assert.ok(g.visualPlayer.x > 12 && g.visualPlayer.x < 13);
  g.setDirection(0, 0);
  advance(g, 0.3);
  assert.equal(g.player.x, 13);
  assert.deepEqual(g.visualPlayer, g.player);
});

test('같은 경로를 50Hz와 100Hz로 진행해도 최종 격자 위치가 한 칸 이상 벌어지지 않는다', () => {
  const a = create(),
    b = create();
  a.setDirection(1, 0);
  b.setDirection(1, 0);
  for (let i = 0; i < 100; i++) a.step(0.01);
  for (let i = 0; i < 50; i++) b.step(0.02);
  assert.ok(Math.abs(a.player.x - b.player.x) <= 1);
  assert.ok(Math.abs(a.visualPlayer.x - b.visualPlayer.x) < 0.25);
});

test('스테이지 난이도는 완료 순서와 저장된 옛 level에 무관하게 42%에서 80%로 증가한다', () => {
  const targets = [0.42, 0.52, 0.58, 0.62, 0.65, 0.68, 0.7, 0.72, 0.74, 0.76, 0.78, 0.8];
  for (const [i, stage] of STORY.worlds.entries()) {
    const a = create({ stage, clearedCount: 0 }),
      b = create({ stage, clearedCount: 7 });
    assert.equal(a.target, targets[i]);
    assert.equal(b.target, targets[i]);
    const s = a.snapshot();
    s.level = 7 - i;
    assert.equal(create({ stage, snapshot: s }).target, targets[i]);
  }
});

test('두 번째 장부터 공격은 스테이지 예고 시간과 회복 단계를 거치며 튜토리얼은 공격하지 않는다', () => {
  for (const stage of STORY.worlds) {
    const g = create({ stage });
    g.attackClock = 0;
    g.step(0.01);
    if (stage.index < 2) {
      advance(g, 20);
      assert.equal(g.telegraphs.length, 0);
      assert.equal(g.bullets.length, 0);
      continue;
    }
    assert.equal(g.bossState.phase, 'warning');
    assert.ok(g.telegraphs.length >= 1);
    advance(g, g.profile.warning - 0.1);
    assert.equal(g.bossState.phase, 'warning');
    advance(g, 0.11);
    assert.equal(g.bossState.phase, 'attack');
    advance(g, g.bossState.remaining + 0.02);
    assert.equal(g.bossState.phase, 'recover');
  }
});

test('획득한 모든 선물은 직접 선택하지만 공용 에너지와 재사용 대기시간을 함께 지킨다', () => {
  const g = create({ unlockedAbilities: Object.keys(ABILITIES) });
  assert.equal(g.energy, 3);
  assert.equal(g.useAbility('shell'), true);
  const charges = g.availableCharges.feather;
  assert.equal(g.useAbility('feather'), false);
  assert.equal(g.availableCharges.feather, charges);
  advance(g, 0.8);
  assert.equal(g.useAbility('feather'), true);
  advance(g, 0.8);
  assert.equal(g.useAbility('clock'), true);
  advance(g, 0.8);
  assert.equal(g.energy, 0);
  assert.equal(g.useAbility('slippers'), false);
  assert.equal(g.useAbility('unknown'), false);
});

test('정지 중 다시 정지 능력을 써도 에너지·시계 1회 한도를 우회하지 못한다', () => {
  const g = create({ stage: STORY.worlds[6], unlockedAbilities: ['clock', 'lantern'] });
  g.useAbility('clock');
  advance(g, 0.8);
  assert.equal(g.useAbility('lantern'), true);
  advance(g, 0.8);
  assert.equal(g.useAbility('clock'), false);
  assert.equal(g.useAbility('lantern'), true);
  advance(g, 0.8);
  assert.equal(g.useAbility('lantern'), false);
  assert.equal(g.energy, 0);
});

test('v1 체크포인트의 장착 능력·남은 횟수는 v2 공용 에너지에 호환된다', () => {
  const legacy = create({ ability: 'shell' }).snapshot();
  delete legacy.engineVersion;
  delete legacy.availableCharges;
  delete legacy.energy;
  legacy.ability = 'shell';
  legacy.charges = 1;
  legacy.level = 7;
  const r = create({ unlockedAbilities: ['shell', 'feather'], snapshot: legacy });
  assert.equal(r.availableCharges.shell, 1);
  assert.equal(r.availableCharges.feather, 2);
  assert.equal(r.energy, 2);
  assert.equal(r.level, 1);
});

test('새 체크포인트는 버프·공용 에너지·횟수와 안전한 그리기 해제 상태를 보존한다', () => {
  const g = create({ unlockedAbilities: ['shell', 'clock', 'feather'] });
  g.useAbility('clock');
  advance(g, 0.8);
  g.useAbility('feather');
  const r = create({ unlockedAbilities: ['shell', 'clock', 'feather'], snapshot: g.snapshot() });
  r.setDrawHeld(false);
  assert.equal(r.energy, 1);
  assert.equal(r.availableCharges.clock, 0);
  assert.equal(r.boost, 0);
  assert.ok(r.freeze > 4);
  assert.equal(r.drawHeld, false);
});

test('비정상 시간·방향 입력이 들어와도 플레이어와 화면 위치는 유한한 좌표를 유지한다', () => {
  const g = create();
  for (const v of [NaN, Infinity, -Infinity, undefined, null, -3]) {
    g.setDirection(v, v);
    g.step(v);
  }
  for (const p of [g.player, g.visualPlayer]) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
  assert.ok(Number.isFinite(g.elapsed));
});

test('빛줄기는 현재 선에 닿으면 피해를 주고 이미 확보한 땅을 뚫지 못한다', () => {
  const setup = () => {
    const g = create({ stage: STORY.worlds[5] });
    g.grace = 0;
    g.trail = [{ x: 15, y: 10 }];
    g.player = { x: 15, y: 10 };
    g.beams = [{ x: 5.5, y: 10.5, angle: 0, length: 50, width: 1.25, life: 1 }];
    return g;
  };
  const exposed = setup();
  exposed.advanceProjectiles(0.1, 1);
  assert.equal(exposed.trail.length, 0);
  assert.deepEqual(exposed.player, exposed.anchor);
  const protectedGame = setup();
  protectedGame.cells[10 * WIDTH + 10] = 1;
  protectedGame.advanceProjectiles(0.1, 1);
  assert.equal(protectedGame.trail.length, 1);
  assert.ok(protectedGame.beams[0].length < 5);
});

test('손상된 추가 공격 자료의 null·무한 좌표·비정상 속도는 재개 상태에 남지 않는다', () => {
  const g = create({ stage: STORY.worlds[5] });
  const s = g.snapshot();
  s.bossState.phase = 'warning';
  s.bossState.pattern = 'beam';
  s.telegraphs = [null];
  s.beams = [{ x: Infinity, y: 5, angle: NaN }];
  s.bullets = [null, { x: 5, y: 5, vx: Infinity, vy: 0 }];
  const r = create({ stage: STORY.worlds[5], snapshot: s });
  assert.equal(r.telegraphs.length, 0);
  assert.equal(r.beams.length, 0);
  assert.equal(r.bullets.length, 0);
  assert.notEqual(r.bossState.phase, 'warning');
  advance(r, 0.5);
  assert.ok(Number.isFinite(r.enemies[0].x));
});

test('진행 중 저장은 아직 닫지 않은 선을 포함하지 않고 안전 출발점을 저장한다', () => {
  const g = create();
  walk(g, 0, 1, 7);
  const s = g.snapshot();
  assert.deepEqual(s.player, { x: 12, y: 1 });
  const r = create({ snapshot: s });
  assert.deepEqual(r.player, s.player);
  assert.equal(r.trail.length, 0);
  assert.equal(r.progress, g.progress);
});

test('잘못된 크기/경계/플레이어/적 좌표 저장은 원자적으로 거부한다', () => {
  const valid = create().snapshot();
  for (const corrupt of [
    s => s.cells.pop(),
    s => (s.cells[0] = 0),
    s => (s.player.x = 5.5),
    s => (s.player.y = 15),
    s => (s.enemies[0].x = Infinity),
    s => (s.enemies[0].vx = 500),
  ]) {
    const bad = structuredClone(valid);
    bad.speedLevel = 3;
    corrupt(bad);
    const r = create({ snapshot: bad });
    assert.equal(r.speedLevel, 0);
    assert.deepEqual(r.player, { x: 12, y: 1 });
    assert.equal(r.progress, 0);
  }
});

test('이미 내 땅인 칸에 적이 들어 있는 손상 저장은 거부한다', () => {
  const bad = create().snapshot();
  bad.cells[Math.floor(bad.enemies[0].y) * WIDTH + Math.floor(bad.enemies[0].x)] = 1;
  bad.speedLevel = 2;
  const r = create({ snapshot: bad });
  assert.equal(r.speedLevel, 0);
  assert.equal(r.progress, 0);
});

test('유효한 체크포인트는 확보 영역과 아이템·보호 횟수를 복원한다', () => {
  const g = create({ ability: 'shell' });
  g.cells[g.index(7, 8)] = 1;
  g.speedLevel = 2;
  g.useAbility();
  g.shield = 2;
  const r = create({ ability: 'shell', snapshot: g.snapshot() });
  assert.equal(r.isSafe(7, 8), true);
  assert.equal(r.speedLevel, 2);
  assert.equal(r.shield, 2);
  assert.equal(r.shell, true);
  assert.equal(r.charges, 1);
});

test('엔진은 네 가지 선물만 노출하고 모든 동화를 지원한다', () => {
  assert.deepEqual(Object.keys(ABILITIES), ['shell', 'feather', 'lantern', 'clock']);
  assert.equal(STORY.worlds.length, 12);
  for (const stage of STORY.worlds) assert.ok(create({ stage }).profile);
});
