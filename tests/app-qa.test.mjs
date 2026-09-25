// Real application + engine in a DOM double: not a browser or device test.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { GameEngine, WIDTH, HEIGHT, ABILITIES } from '../src/engine.js';
import { STORY } from '../src/story-data.js';
import { paintGame, strokeRay } from '../src/render.js';
import { Effects } from '../src/fx.js';
import { isDash } from '../src/game/config.js';
import { artFrame } from '../src/art-layout.js';
const source = fs
  .readFileSync(new URL('../src/app.js', import.meta.url), 'utf8')
  .replace(/^import .*;\r?\n/gm, '');
function harness({ saved = null, blockedStorage = false } = {}) {
  const nodes = new Map(),
    elements = [],
    timers = [],
    events = {},
    storage = new Map(saved ? [['storybook-dream-save-v1', JSON.stringify(saved)]] : []);
  class Element {
    constructor(tag = 'div', attrs = '') {
      this.tagName = tag.toUpperCase();
      this.dataset = {};
      this.style = {};
      this.listeners = {};
      this.attrs = attrs;
      this.textContent = '';
      this.active = true;
      this.children = [];
      for (const m of attrs.matchAll(/data-([\w-]+)="([^"]*)"/g)) this.dataset[m[1]] = m[2];
      this.id = attrs.match(/\bid="([^"]*)"/)?.[1];
      this.className = attrs.match(/\bclass="([^"]*)"/)?.[1] || '';
      this.disabled = /\sdisabled(?:\s|$)/.test(attrs);
      if (this.id) nodes.set(this.id, this);
      elements.push(this);
      this.classList = {
        toggle: (name, on) => {
          const cls = new Set(this.className.split(' '));
          on ? cls.add(name) : cls.delete(name);
          this.className = [...cls].join(' ');
        },
      };
    }
    set innerHTML(html) {
      for (const e of this.children) e.remove();
      this.children = [];
      this.html = html;
      for (const m of html.matchAll(/<([\w-]+)([^>]*)>/g)) this.children.push(new Element(m[1], m[2]));
    }
    get innerHTML() {
      return this.html || '';
    }
    addEventListener(type, fn) {
      this.listeners[type] = fn;
    }
    getContext() {
      return (this.context ??= new Proxy(
        {},
        {
          get: (target, key) => target[key] ?? (() => {}),
          set: (target, key, value) => {
            target[key] = value;
            return true;
          },
        },
      ));
    }
    append(e) {
      this.children.push(e);
    }
    focus() {}
    setPointerCapture() {}
    scrollIntoView() {}
    setAttribute(name, value) {
      this[name] = value;
    }
    remove() {
      this.active = false;
      for (const e of this.children) e.remove();
      if (this.id && nodes.get(this.id) === this) nodes.delete(this.id);
    }
    click() {
      if (!this.disabled) {
        this.onclick?.();
        this.listeners.click?.({ target: this, detail: 0 });
      }
    }
    querySelector(selector) {
      return this.children.find(e => e.active && e.tagName === selector.toUpperCase()) || null;
    }
  }
  const root = new Element('div', ' id="app"');
  const query = selector =>
    selector.startsWith('#')
      ? nodes.get(selector.slice(1)) || null
      : elements.find(e => e.active && e.className.split(' ').includes(selector.slice(1))) || null;
  const document = {
    getElementById: id => nodes.get(id) || null,
    querySelectorAll: selector => {
      const attr = selector.match(/^\[data-([\w-]+)\]$/)?.[1];
      return attr ? elements.filter(e => e.active && Object.hasOwn(e.dataset, attr)) : [];
    },
    querySelector: query,
    createElement: tag => new Element(tag),
    addEventListener(type, fn) {
      events[type] = fn;
    },
    hidden: false,
  };
  class Audio {
    unlock() {}
    setMuted() {}
    setVolume() {}
    play() {}
    effect() {}
    pause() {}
    resume() {}
    setIntensity() {}
  }
  const window = {
    addEventListener(type, fn) {
      events[type] = fn;
    },
  };
  const context = vm.createContext({
    GameEngine,
    WIDTH,
    HEIGHT,
    ABILITIES,
    STORY,
    paintGame,
    Effects,
    isDash,
    strokeRay,
    artFrame,
    ART: {},
    STORY_ART: {},
    Image: class {},
    AudioDirector: Audio,
    document,
    window,
    localStorage: {
      getItem: k => {
        if (blockedStorage) throw Error('disabled');
        return storage.get(k) || null;
      },
      setItem: (k, v) => {
        if (blockedStorage) throw Error('disabled');
        storage.set(k, v);
      },
    },
    performance: { now: () => 1000 },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
    setTimeout: fn => timers.push(fn),
    URL,
    Blob,
    console,
    confirm: () => true,
  });
  vm.runInContext(
    source +
      '\nwindow.QA={map,startStage,opening,ending,cleanSave,persist,keydown,keyup,showOptions,strokeRay,render,state:()=>({save,screen,engine,storageOK,paused}),html:()=>app.innerHTML};',
    context,
  );
  const event = (code, extra = {}) => ({
    code,
    key: code,
    repeat: false,
    preventDefault() {},
    target: { tagName: 'BODY' },
    ...extra,
  });
  return {
    api: window.QA,
    nodes,
    storage,
    timers,
    root,
    elements,
    events,
    document,
    press: (code, extra) => window.QA.keydown(event(code, extra)),
    release: code => window.QA.keyup(event(code)),
    flush: () => {
      while (timers.length) timers.shift()();
    },
  };
}
const complete = (h, stage) => {
  h.api.startStage(stage);
  const g = h.api.state().engine;
  // Capture event flow with a fully investigated field; geometry is covered by engine tests.
  g.cells.fill(1);
  g.enemies = [];
  g.checkWin();
  h.flush();
};

test('Enter/Space로 오프닝을 한 장씩 넘기며 키 반복은 장면을 건너뛰지 않는다', () => {
  const h = harness();
  h.press('Enter');
  assert.equal(h.api.state().screen, 'opening');
  assert.match(h.api.html(), /1 \/ 3/);
  h.press('Space');
  assert.match(h.api.html(), /2 \/ 3/);
  h.press('Space', { repeat: true });
  assert.match(h.api.html(), /2 \/ 3/);
  h.press('Enter');
  assert.match(h.api.html(), /3 \/ 3/);
  h.press('Enter');
  assert.equal(h.api.state().screen, 'map');
  assert.equal(h.api.state().save.introSeen, true);
});
test('첫 완료 뒤 나머지 열한 장이 열리고 지도 방향키와 Enter로 자유 선택한다', () => {
  const h = harness();
  h.api.map();
  assert.equal(h.elements.filter(e => e.active && e.dataset.world && e.disabled).length, 11);
  complete(h, STORY.worlds[0]);
  h.press('Escape');
  assert.equal(h.api.state().screen, 'map');
  assert.equal(h.elements.filter(e => e.active && e.dataset.world && e.disabled).length, 0);
  h.press('ArrowDown');
  h.press('Enter');
  assert.equal(h.api.state().screen, 'intro');
  assert.match(h.api.html(), /콩나무/);
  h.press('Escape');
  assert.equal(h.api.state().engine.stage.id, 'beans');
  assert.deepEqual(h.api.state().engine.unlockedAbilities, []);
});
test('12장 단서 발견→해결 2컷과 세 사건마다 선물 1컷→엔딩 후 네 선물을 가져간다', () => {
  const h = harness();
  for (const stage of STORY.worlds) {
    complete(h, stage);
    const count = stage.index % 3 === 0 ? 3 : 2;
    assert.equal(h.api.state().screen, 'victory');
    assert.ok(h.api.html().includes(`1 / ${count}`));
    for (let page = 1; page <= count; page++) h.press('Enter');
  }
  assert.equal(h.api.state().screen, 'ending');
  assert.equal(h.api.state().save.cleared.length, 12);
  h.press('Escape');
  assert.equal(h.api.state().save.endingSeen, true);
  h.api.startStage(STORY.worlds[7]);
  assert.equal(h.api.state().engine.unlockedAbilities.length, 4);
  h.press('Digit1');
  assert.equal(h.api.state().engine.shield, 3);
  assert.equal(h.api.state().engine.energy, 2);
  for (let i = 0; i < 8; i++) h.api.state().engine.step(0.1);
  h.press('Numpad4');
  assert.equal(h.api.state().engine.availableCharges.clock, 0);
  assert.equal(h.api.state().engine.energy, 1);
  h.press('Digit8');
  assert.equal(h.api.state().engine.energy, 1);
});
test('Space held만 선을 긋고 해제·방향키 동시입력·쉬기·blur 뒤 held가 남지 않는다', () => {
  const h = harness();
  h.api.startStage(STORY.worlds[0]);
  const g = h.api.state().engine;
  h.press('ArrowDown');
  g.step(0.3);
  assert.equal(g.trail.length, 0);
  h.press('Space');
  g.step(0.1);
  g.step(0.1);
  assert.equal(g.trail.length, 1);
  h.release('Space');
  // Releasing Space finishes the step already under way, then stops.
  for (let i = 0; i < 30; i++) g.step(0.05);
  const before = g.trail.length;
  assert.ok(before <= 2);
  g.step(0.3);
  assert.equal(g.trail.length, before);
  h.press('ArrowRight');
  h.release('ArrowRight');
  assert.deepEqual(g.direction, { x: 0, y: 1 });
  h.press('Space');
  h.press('Escape');
  assert.equal(h.api.state().paused, true);
  assert.equal(g.drawHeld, false);
  assert.deepEqual(g.direction, { x: 0, y: 0 });
  h.press('Enter');
  assert.equal(h.api.state().paused, false);
  h.press('Space');
  h.events.blur();
  assert.equal(g.drawHeld, false);
  assert.equal(h.api.state().paused, true);
});
test('지도 M와 이어하기 C는 땅을 보존하고 안전 출발점·그리기 꺼짐으로 재개한다', () => {
  const h = harness();
  h.api.startStage(STORY.worlds[0]);
  const g = h.api.state().engine;
  g.cells[5 * WIDTH + 5] = 1;
  h.press('Space');
  h.press('ArrowDown');
  g.step(0.1);
  h.press('KeyM');
  assert.equal(h.api.state().screen, 'map');
  assert.equal(h.api.state().save.current.player.y, 1);
  h.press('KeyC');
  const r = h.api.state().engine;
  assert.equal(r.isSafe(5, 5), true);
  assert.equal(r.player.y, 1);
  assert.equal(r.trail.length, 0);
  assert.equal(r.drawHeld, false);
});
test('보호자 창에서는 이야기 Enter가 뒤쪽 화면을 조작하지 않는다', () => {
  const h = harness();
  h.api.opening();
  h.nodes.get('parents').click();
  h.press('Enter');
  assert.equal(h.api.state().screen, 'opening');
  assert.match(h.api.html(), /1 \/ 3/);
  h.press('Escape');
  assert.equal(h.document.querySelector('.overlay'), null);
  h.press('Enter');
  assert.match(h.api.html(), /2 \/ 3/);
});
test('모바일 그리기 토글과 짧은 터치가 연결되고 취소 입력은 한 칸 더 가지 않는다', () => {
  const h = harness();
  h.api.startStage(STORY.worlds[0]);
  const g = h.api.state().engine,
    down = h.elements.filter(e => e.active && e.dataset.dir === '0,1').at(-1);
  const settle = () => {
    for (let i = 0; i < 20; i++) g.step(0.05);
  };
  const tap = () => {
    down.listeners.pointerdown({ preventDefault() {}, pointerId: 1 });
    down.listeners.pointerup();
    settle();
  };
  tap();
  assert.equal(g.player.y, 1);
  h.nodes.get('draw-mode').click();
  tap();
  assert.equal(g.player.y, 2);
  down.listeners.click({ detail: 1 });
  settle();
  assert.equal(g.player.y, 2);
  down.listeners.pointerdown({ preventDefault() {}, pointerId: 1 });
  down.listeners.pointercancel();
  settle();
  assert.equal(g.player.y, 2);
  h.nodes.get('draw-mode').click();
  assert.equal(g.drawHeld, false);
  tap();
  assert.equal(g.player.y, 2);
});
test('자동 저장을 불러오고 보호자 설정에서 백업 파일을 저장하며 자동저장 불가를 표시한다', () => {
  const saved = { version: 1, updatedAt: 100, cleared: ['race'], introSeen: true };
  const h = harness({ saved });
  assert.deepEqual(Array.from(h.api.state().save.cleared), ['race']);
  h.api.map();
  h.api.showOptions();
  h.nodes.get('save-full').click();
  assert.match(h.nodes.get('option-notice').textContent, /백업 파일을 저장했어요/);
  const blocked = harness({ saved, blockedStorage: true });
  blocked.api.map();
  assert.equal(blocked.api.state().storageOK, false);
  assert.match(blocked.api.html(), /자동 저장/);
});
test('옛 저장의 미획득 능력은 제거하고 획득 목록으로만 인벤토리를 구성한다', () => {
  const h = harness();
  const s = new GameEngine({ stage: STORY.worlds[0], ability: 'clock' }).snapshot();
  const cleaned = h.api.cleanSave({
    version: 1,
    cleared: ['race', 'duck', 'pigs'],
    equipped: 'clock',
    current: s,
  });
  assert.equal(cleaned.equipped, null);
  assert.equal(cleaned.current.ability, null);
  assert.deepEqual(Array.from(cleaned.current.unlockedAbilities), ['shell']);
});

test('안전한 땅에 바로 막힌 길이 0인 빛줄기를 화면에 길게 그리지 않는다', () => {
  const h = harness(),
    ends = [];
  const ctx = {
    setLineDash() {},
    beginPath() {},
    moveTo() {},
    lineTo: (x, y) => ends.push([x, y]),
    stroke() {},
  };
  h.api.strokeRay(ctx, { x: 10, y: 10, angle: 0, length: 0, width: 1 }, '#fff');
  assert.deepEqual(ends, [[120, 120]]);
});

test('별 획득 뒤 실제 HUD 단계와 속도 표시가 바뀌고 공격 예고·추적 소졸이 렌더된다', () => {
  const h = harness();
  h.api.startStage(STORY.worlds[3]);
  const g = h.api.state().engine;
  h.api.render(1000);
  assert.equal(h.nodes.get('speed-label').textContent, '걸음 ☆☆☆');
  const before = g.speed;
  g.player = { x: 15, y: 9 };
  g.collectNearby();
  h.api.render(1000);
  assert.ok(g.speed > before);
  assert.equal(h.nodes.get('speed-label').textContent, '걸음 ★☆☆');
  assert.match(h.nodes.get('speed-label').className, /speed-up/);
  g.player = { x: 12, y: 1 };
  g.beginWarning();
  h.api.render(1000);
  assert.match(h.nodes.get('boss-banner').textContent, /예고/);
  const minion = g.enemies.find(e => !e.boss);
  minion.behavior = 'rush_wander';
  minion.intent = { phase: 'warmup', remaining: 0.9, angle: 0 };
  assert.doesNotThrow(() => h.api.render(1100));
  assert.equal(h.nodes.get('game').dataset.speed, g.speed.toFixed(1));
});

test('세 사건을 역순 완료해도 세 번째 완료에서만 선물을 주고 재완료는 중복 지급하지 않는다', () => {
  const h = harness();
  complete(h, STORY.worlds[5]);
  assert.ok(h.api.html().includes('1 / 2'));
  h.press('Escape');
  complete(h, STORY.worlds[4]);
  assert.ok(h.api.html().includes('1 / 2'));
  h.press('Escape');
  complete(h, STORY.worlds[3]);
  assert.ok(h.api.html().includes('1 / 3'));
  h.press('Enter');
  h.press('Enter');
  assert.match(h.api.html(), /새 선물 · 2번 깃털 바람/);
  h.press('Escape');
  h.api.startStage(STORY.worlds[2]);
  assert.deepEqual(h.api.state().engine.unlockedAbilities, ['feather']);
  assert.equal(h.elements.filter(e => e.active && e.dataset.power).length, 4);
  complete(h, STORY.worlds[2]);
  assert.ok(h.api.html().includes('1 / 2'));
});

test('조작 설명은 첫 장만 표시하고 후반 화면은 숨기며 제거된 숫자키는 아이템을 사용하지 않는다', () => {
  const h = harness({ saved: { version: 1, updatedAt: 1, cleared: STORY.worlds.map(w => w.id) } });
  h.api.startStage(STORY.worlds[0]);
  assert.ok(!h.nodes.get('hint').attrs.includes('hidden'));
  h.api.startStage(STORY.worlds[7]);
  assert.ok(h.nodes.get('hint').attrs.includes('hidden'));
  assert.equal(h.elements.filter(e => e.active && e.dataset.power).length, 4);
  for (const key of ['Digit5', 'Digit6', 'Digit7', 'Digit8']) h.press(key);
  assert.equal(h.api.state().engine.energy, 3);
  h.press('Digit3');
  assert.equal(h.api.state().engine.freeze, 3);
  assert.equal(h.api.state().engine.energy, 2);
});

test('실제 피격 하트가 즉시 저장되고 0개에서 재도전하면 해당 판만 초기화한다', () => {
  const saved = { version: 1, cleared: ['race', 'duck', 'pigs'], introSeen: true };
  const h = harness({ saved });
  h.api.startStage(STORY.worlds[3]);
  const g = h.api.state().engine;
  g.cells[10 * WIDTH + 10] = 1;
  g.speedLevel = 2;
  g.energy = 1;
  g.availableCharges.shell = 1;
  for (let n = 0; n < 3; n++) {
    g.grace = 0;
    g.trail = [{ x: 12, y: 2 }];
    g.player = { x: 12, y: 2 };
    g.damage();
    h.api.render(1000);
    assert.equal(g.lives, 2 - n);
    assert.equal(h.api.state().save.current.lives, 2 - n);
    assert.equal(h.nodes.get('lives').textContent, '♥'.repeat(2 - n) + '♡'.repeat(n + 1));
  }
  assert.equal(g.lost, true);
  assert.equal(h.api.state().paused, true);
  assert.ok(h.nodes.get('retry-stage'));
  assert.equal(h.nodes.get('charge-shell') !== undefined, true);
  h.press('Enter', { repeat: true });
  assert.equal(h.api.state().engine, g);
  h.press('Space');
  assert.equal(h.api.state().engine, g);
  h.press('Enter');
  const fresh = h.api.state().engine;
  assert.notEqual(fresh, g);
  assert.equal(fresh.stage.id, 'redhood');
  assert.equal(fresh.lives, 3);
  assert.equal(fresh.lost, false);
  assert.equal(fresh.isSafe(10, 10), false);
  assert.equal(fresh.speedLevel, 0);
  assert.equal(fresh.energy, 3);
  assert.equal(fresh.availableCharges.shell, 2);
  assert.deepEqual(Array.from(h.api.state().save.cleared), ['race', 'duck', 'pigs']);
  assert.equal(h.document.querySelector('.overlay'), null);
  assert.equal(h.api.state().paused, false);
});

test('하트와 실패 상태가 새로고침·지도·이어하기에서 보존되며 Esc로 실패한 판을 재개하지 않는다', () => {
  const h = harness();
  h.api.startStage(STORY.worlds[0]);
  const g = h.api.state().engine;
  g.grace = 0;
  g.trail = [{ x: 12, y: 2 }];
  g.damage();
  const resumed = harness({ saved: JSON.parse(h.storage.get('storybook-dream-save-v1')) });
  resumed.press('KeyC');
  assert.equal(resumed.api.state().engine.lives, 2);
  for (let i = 0; i < 2; i++) {
    const r = resumed.api.state().engine;
    r.grace = 0;
    r.trail = [{ x: 12, y: 2 }];
    r.damage();
  }
  const lost = harness({ saved: JSON.parse(resumed.storage.get('storybook-dream-save-v1')) });
  lost.press('KeyC');
  assert.equal(lost.api.state().engine.lives, 0);
  assert.ok(lost.nodes.get('retry-stage'));
  assert.equal(lost.api.state().paused, true);
  lost.press('Escape');
  assert.equal(lost.api.state().screen, 'map');
  lost.press('KeyC');
  assert.equal(lost.api.state().engine.lost, true);
  assert.ok(lost.nodes.get('retry-stage'));
  lost.nodes.get('retry-stage').click();
  assert.equal(lost.api.state().engine.lives, 3);
});

test('방패가 막은 공격은 하트와 선을 보존하고 이후 실제 피격만 하트를 쓴다', () => {
  const h = harness({ saved: { version: 1, cleared: ['race', 'duck', 'pigs'], introSeen: true } });
  h.api.startStage(STORY.worlds[3]);
  const g = h.api.state().engine;
  h.press('Digit1');
  g.grace = 0;
  g.trail = [{ x: 12, y: 2 }];
  g.damage();
  h.api.render(1000);
  assert.equal(g.lives, 3);
  assert.equal(g.shield, 2);
  assert.equal(g.trail.length, 1);
  assert.equal(h.nodes.get('lives').textContent, '♥♥♥');
  g.shield = 0;
  g.grace = 0;
  g.damage();
  assert.equal(g.lives, 2);
  assert.equal(g.trail.length, 0);
});
