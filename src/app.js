import { GameEngine, WIDTH, HEIGHT, ABILITIES } from './engine.js';
import { isDash } from './game/config.js';
import { paintGame } from './render.js';
import { STORY } from './story-data.js';
import { ART, STORY_ART, BOARDS } from './art.js';
import { artFrame } from './art-layout.js';
import { AudioDirector } from './audio.js';
import { Effects } from './fx.js';
import { STICKERS } from './game/rewards.js';
import './debug.js';
import './gamepad.js';

const IMAGES_KEY = 'storybook-dream-images-v1';
const app = document.getElementById('app'),
  audio = new AudioDirector(),
  fx = new Effects(audio),
  KEY = 'storybook-dream-save-v1';
const worlds = STORY.worlds,
  ids = worlds.map(w => w.id),
  items = STORY.items,
  abilityIds = items.map(item => item.id);
const esc = s =>
  String(s ?? '').replace(
    /[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
const fresh = () => ({
  version: 1,
  updatedAt: 0,
  cleared: [],
  equipped: null,
  muted: false,
  volume: 0.3,
  introSeen: false,
  endingSeen: false,
  current: null,
  stars: {}, // case id → [solved, no heart lost, well past the target]
  stickers: [], // case ids whose hidden sticker was found
  finaleCleared: false, // the last chapter, 또롱's nest
});
let storageOK = true,
  notice = '',
  customImages = {},
  screen = 'home',
  engine = null,
  currentStage = null,
  paused = false,
  frame = 0,
  last = 0;
let mapIndex = 0,
  storyNext = null,
  storyBack = null,
  storySkip = null,
  toastText = '',
  toastUntil = 0,
  cachedImage = null,
  touchDraw = false,
  speedFlashUntil = 0;
const heldKeys = new Set();
const finale = STORY.finale;
// A case on the map, or the final chapter.
const stageById = id => worlds.find(w => w.id === id) || (id === finale.id ? finale : null);
const allSolved = () => save.cleared.length === worlds.length;
// Use a page's own picture when it has been drawn, otherwise a stand-in that exists.
const pageArt = (page, fallback) => ({ ...page, artId: STORY_ART[page.artId] ? page.artId : fallback });
// Gifts arrive by the number of solved cases, in any order.
function earnedFrom(cleared) {
  return items.filter(item => cleared.length >= item.requiredCount).map(item => item.id);
}
function earnedAbilities() {
  return earnedFrom(save.cleared);
}
function itemProgress(item) {
  return Math.min(item.requiredCount, save.cleared.length);
}
const starText = id => {
  const got = save.stars[id] || [];
  return [0, 1, 2].map(i => (got[i] ? '★' : '☆')).join('');
};
function itemCards() {
  return items
    .map(
      item =>
        `<div class="inventory-card ${itemProgress(item) === item.requiredCount ? 'earned' : 'locked'}"><kbd>${item.key}</kbd><span>${ABILITIES[item.id].icon}</span><strong>${esc(item.name)}</strong><small>${itemProgress(item) === item.requiredCount ? esc(item.short) : `사건 ${item.requiredCount}개 해결하면 · ${itemProgress(item)}/${item.requiredCount}`}</small></div>`,
    )
    .join('');
}
function powerButtons() {
  return items
    .map(
      item =>
        `<button class="power" data-power="${item.id}" title="${esc(item.description)}"><kbd>${item.key}</kbd><span class="power-icon">${ABILITIES[item.id].icon}</span><strong>${esc(item.name)}</strong><small id="charge-${item.id}"></small></button>`,
    )
    .join('');
}
function cleanSave(raw) {
  if (!raw || raw.version !== 1 || !Array.isArray(raw.cleared) || raw.cleared.length > worlds.length)
    throw Error('알맞은 동화 저장 자료가 아니에요.');
  const cleared = [...new Set(raw.cleared.filter(id => ids.includes(id)))],
    earned = earnedFrom(cleared);
  const current =
    raw.current &&
    (ids.includes(raw.current.stageId) || raw.current.stageId === finale.id) &&
    Array.isArray(raw.current.cells) &&
    raw.current.cells.length === WIDTH * HEIGHT
      ? {
          ...raw.current,
          ability: earned.includes(raw.current.ability) ? raw.current.ability : null,
          unlockedAbilities: earned,
        }
      : null;
  if (
    current &&
    !Number.isFinite(current.energy) &&
    raw.current.engineVersion !== 2 &&
    raw.current.engineVersion !== 3 &&
    raw.current.engineVersion !== 4 &&
    raw.current.engineVersion !== 5 &&
    raw.current.engineVersion !== 6
  ) {
    const oldId = raw.current.ability,
      oldCap = ['clock', 'apple'].includes(oldId) ? 1 : 2,
      oldKnown = ['shell', 'slippers', 'feather', 'brick', 'lantern', 'seed', 'clock', 'apple'].includes(
        oldId,
      );
    current.energy =
      oldKnown && Number.isFinite(raw.current.charges)
        ? 3 - (oldCap - Math.max(0, Math.min(oldCap, Math.floor(raw.current.charges))))
        : 3;
  }
  return {
    ...fresh(),
    updatedAt: Number.isFinite(raw.updatedAt) ? raw.updatedAt : 0,
    cleared,
    equipped: earned.includes(raw.equipped) ? raw.equipped : null,
    muted: !!raw.muted,
    volume: Number.isFinite(raw.volume) ? Math.max(0, Math.min(1, raw.volume)) : 0.3,
    introSeen: !!raw.introSeen,
    endingSeen: !!raw.endingSeen,
    current,
    stars: Object.fromEntries(
      ids
        .filter(id => Array.isArray(raw.stars?.[id]))
        .map(id => [id, [0, 1, 2].map(i => !!raw.stars[id][i])]),
    ),
    stickers: Array.isArray(raw.stickers) ? [...new Set(raw.stickers.filter(id => ids.includes(id)))] : [],
    finaleCleared: !!raw.finaleCleared,
  };
}
function cleanImages(raw) {
  const images = {};
  for (const id of ids) {
    const data = raw?.[id];
    if (typeof data === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(data)) images[id] = data;
  }
  return images;
}
let save = fresh();
try {
  const raw = localStorage.getItem(KEY);
  if (raw) save = cleanSave(JSON.parse(raw));
  customImages = cleanImages(JSON.parse(localStorage.getItem(IMAGES_KEY) || '{}'));
} catch {
  storageOK = false;
  notice = '자동 저장을 사용할 수 없어요. 보호자 설정에서 백업 파일을 저장해 주세요.';
}
function persistImages() {
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(customImages));
    return true;
  } catch {
    return false;
  }
}
audio.setMuted(save.muted);
audio.setVolume(save.volume);
function persist() {
  save.updatedAt = Date.now();
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
    storageOK = true;
    notice = '진행을 저장했어요.';
  } catch {
    storageOK = false;
    notice = '자동 저장을 사용할 수 없어요. 보호자 설정에서 백업 파일을 저장해 주세요.';
  }
}
function art(id) {
  return customImages[id] || STORY_ART[id] || ART[id] || '';
}
function picture(id, cls = '') {
  const uri = art(id),
    frame = customImages[id] ? null : artFrame(id),
    label = esc(worlds.find(w => id === w.id || id.startsWith(w.id + '-'))?.title || '동화 속 한 장면');
  if (!uri) return '<div class="empty-art">사건을 조사하러 한 걸음</div>';
  if (!frame) return `<img class="${cls}" src="${uri}" alt="${label}">`;
  return `<span class="picture-frame ${cls}" role="img" aria-label="${label}" data-art="${esc(id)}" style="--panel-ratio:${frame.aspect}"><img src="${uri}" alt="" aria-hidden="true" style="width:${100 / frame.width}%;height:${100 / frame.height}%;left:${(-frame.x / frame.width) * 100}%;top:${(-frame.y / frame.height) * 100}%"></span>`;
}
function shell(content) {
  app.innerHTML = `<main class="app-shell"><header class="topbar"><div class="brand">☾ ${esc(STORY.title)}</div><div class="actions"><button class="small" id="sound">${save.muted ? '소리 켜기' : '소리 끄기'}</button><button class="small" id="parents">보호자 설정</button></div></header>${content}</main>`;
  document.getElementById('sound').onclick = () => {
    void audio.unlock();
    save.muted = !save.muted;
    audio.setMuted(save.muted);
    persist();
    document.getElementById('sound').textContent = save.muted ? '소리 켜기' : '소리 끄기';
  };
  document.getElementById('parents').onclick = showOptions;
}
// Space (or the touch toggle) turns line drawing on and off, with a small sound each way.
function setDraw(held) {
  if (!engine) return;
  const before = engine.drawHeld;
  engine.setDrawHeld(held);
  if (engine.drawHeld !== before) audio.effect(engine.drawHeld ? 'draw-on' : 'draw-off');
}
function clearInput() {
  heldKeys.clear();
  touchDraw = false;
  engine?.setDirection(0, 0);
  engine?.setDrawHeld(false);
}
function stopGame() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (engine && !engine.won) {
    save.current = engine.snapshot();
    persist();
  }
  clearInput();
  engine = null;
  currentStage = null;
  paused = false;
  fx.reset();
}
function home() {
  stopGame();
  screen = 'home';
  audio.play('dream');
  shell(
    `<section class="hero"><div class="hero-copy"><div class="eyebrow">어젯밤, 책 속에서 일어난 일</div><h1>${esc(STORY.title)}</h1><p>등껍질을 잃고 주저앉은 거북이, 문이 안 열리는 커다란 오리?<br>토끼 탐정이 되어 열두 사건의 비밀을 밝혀주세요.</p><div class="actions"><button class="primary" id="start">${save.introSeen ? '동화책 펼치기' : '꿈속으로 출발'} <kbd>Enter</kbd></button>${save.current ? '<button id="continue">하던 이야기 이어서 <kbd>C</kbd></button>' : ''}</div><p class="footer-note">방향키로 걷고, 스페이스를 누른 채 그림을 되찾아요.</p></div><div class="book-art">${picture('opening-bedroom')}<div class="caption">잃어버린 단서를 찾는, 우리 가족 탐정단</div></div></section>`,
  );
  document.getElementById('start').onclick = () => {
    void audio.unlock();
    save.introSeen ? map() : opening();
  };
  document.getElementById('continue')?.addEventListener('click', () => {
    void audio.unlock();
    startStage(stageById(save.current.stageId), true);
  });
}
function storyPages(
  pages,
  { id = 'race', label = '꿈속 이야기', onDone, skipText = '건너뛰기', finishText = '모험 시작' } = {},
) {
  let page = 0;
  const draw = () => {
    const line = typeof pages[page] === 'string' ? { speaker: '나', text: pages[page] } : pages[page];
    shell(
      `<section class="storybook"><div class="story-heading"><div><div class="eyebrow">${esc(label)}</div><h1>${esc(line.caption || '책장을 넘기면')}</h1></div><span class="page-count">${page + 1} / ${pages.length}</span></div><div class="comic-panel" data-emotion="${esc(line.emotion || 'wonder')}">${picture(line.artId || id)}<div class="panel-vignette"></div><div class="speech"><span class="speaker">${esc(line.speaker)}</span><p>${esc(line.text)}</p></div></div><div class="story-footer"><div class="page-dots">${pages.map((_, i) => `<span class="${i === page ? 'active' : ''}"></span>`).join('')}</div><div class="actions"><button id="prev" ${page === 0 ? 'disabled' : ''}>← 이전</button><button class="primary" id="next">${page === pages.length - 1 ? finishText : '다음 장면'} <kbd>Enter / Space</kbd></button><button class="small" id="skip">${esc(skipText)} <kbd>Esc</kbd></button></div></div></section>`,
    );
    document.getElementById('next').onclick = storyNext;
    document.getElementById('prev').onclick = storyBack;
    document.getElementById('skip').onclick = storySkip;
  };
  storyNext = () => {
    void audio.unlock();
    audio.effect('page');
    if (++page >= pages.length) {
      storyNext = storyBack = storySkip = null;
      onDone();
    } else draw();
  };
  storyBack = () => {
    if (page > 0) {
      page--;
      audio.effect('page');
      draw();
    }
  };
  storySkip = () => {
    storyNext = storyBack = storySkip = null;
    onDone();
  };
  draw();
}
function opening() {
  screen = 'opening';
  audio.play('dream');
  storyPages(STORY.opening, {
    id: 'opening-bedroom',
    label: '프롤로그 · 어젯밤의 동화책',
    finishText: '동화책 열기',
    onDone: () => {
      save.introSeen = true;
      persist();
      map();
    },
  });
}
function map() {
  stopGame();
  screen = 'map';
  audio.play('dream');
  const tutorialDone = save.cleared.includes('race');
  if (!tutorialDone) mapIndex = 0;
  shell(
    `<section class="map-intro"><div><div class="eyebrow">나의 동화책 · ${save.cleared.length} / ${worlds.length}</div><h1>${esc(STORY.mapTitle)}</h1><p>${tutorialDone ? '어떤 사건을 조사할까요? 토끼 탐정의 다음 사건을 골라요.' : '첫 장은 토끼와 거북이. 걷기와 선 긋기를 함께 배워요.'}</p></div>${save.current ? '<button id="resume">하던 이야기 <kbd>C</kbd></button>' : ''}</section><section class="map-grid">${worlds.map((w, i) => `<button class="world-card ${i === mapIndex ? 'keyboard-selected' : ''}" data-world="${w.id}" aria-current="${i === mapIndex ? 'true' : 'false'}" ${!tutorialDone && i > 0 ? 'disabled' : ''}>${picture(customImages[w.id] ? w.id : w.id + '-before')}${save.cleared.includes(w.id) ? `<span class="done">${starText(w.id)}${save.stickers.includes(w.id) ? ' ' + STICKERS[w.id] : ''}</span>` : ''}<div class="card-copy"><span class="badge">${i === 0 ? '첫 모험 · 튜토리얼' : `${i + 1}번째 모험${i >= 1 ? ' · 보스 패턴' : ''}`}</span><h3>${esc(w.title)}</h3><p>${esc(w.subtitle)}</p></div></button>`).join('')}</section><section class="satchel"><h3>나의 선물 가방 <span class="muted">받은 선물은 모두 가져가요</span></h3><div class="inventory-grid">${itemCards()}</div><div class="sticker-book" aria-label="스티커 수첩">${worlds.map(w => `<span class="${save.stickers.includes(w.id) ? 'found' : ''}" title="${esc(w.title)}">${save.stickers.includes(w.id) ? STICKERS[w.id] : '?'}</span>`).join('')}<small>스티커 ${save.stickers.length}/${worlds.length}</small></div><p class="muted">장면마다 도움 별 세 개. 사건을 2·4·7·10개 해결하면 선물을 받아요. 숫자 1~4로 써요. 판마다 별 세 개(해결 · 하트 지키기 · 목표보다 훨씬 더 밝히기)와 숨은 스티커가 있어요.</p></section><div class="bottom-options"><button id="opening">오프닝 다시 보기</button>${allSolved() ? `<button id="finale" class="${save.finaleCleared ? '' : 'primary'}">${save.finaleCleared ? '마지막 장 다시 보기' : '마지막 장으로 🪶'}</button>` : ''}${save.finaleCleared ? '<button id="ending">아침의 동화책</button>' : ''}</div><p class="notice">${esc(storageOK ? '진행은 자동 저장돼요. 다른 PC로 옮길 때는 보호자 설정에서 백업 파일을 저장하세요.' : notice)}</p>`,
  );
  document.querySelectorAll('[data-world]').forEach(
    b =>
      (b.onclick = () => {
        mapIndex = ids.indexOf(b.dataset.world);
        stageIntro(worlds[mapIndex]);
      }),
  );
  document
    .getElementById('resume')
    ?.addEventListener('click', () => startStage(stageById(save.current.stageId), true));
  document.getElementById('opening').onclick = opening;
  document.getElementById('ending')?.addEventListener('click', ending);
  document.getElementById('finale')?.addEventListener('click', finaleIntro);
}
function selectMap(delta) {
  const limit = save.cleared.includes('race') ? worlds.length - 1 : 0;
  mapIndex = Math.max(0, Math.min(limit, mapIndex + delta));
  document.querySelectorAll('[data-world]').forEach((b, i) => {
    b.classList.toggle('keyboard-selected', i === mapIndex);
    b.setAttribute('aria-current', i === mapIndex ? 'true' : 'false');
    if (i === mapIndex) b.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
}
function finaleIntro() {
  clearInput();
  screen = 'intro';
  audio.play('dream');
  storyPages(
    finale.intro.map((p, i) => pageArt(p, i < 2 ? 'opening-dream' : 'ending-morning')),
    {
      id: 'opening-dream',
      label: '마지막 장 · 또롱의 둥지',
      onDone: () => startStage(finale),
      skipText: '바로 시작',
      finishText: '둥지를 밝히러 출발',
    },
  );
}
function stageIntro(stage) {
  clearInput();
  screen = 'intro';
  audio.play('dream');
  storyPages(stage.intro, {
    id: stage.id + '-twist',
    label: `${stage.index}번째 모험 · ${stage.title}`,
    onDone: () => startStage(stage),
    skipText: '바로 시작',
    finishText: '그림 되찾으러 출발',
  });
}
function startStage(stage, resume = false) {
  if (!stage) return;
  stopGame();
  screen = 'game';
  currentStage = stage;
  paused = false;
  void audio.unlock();
  audio.play(stage.id === finale.id ? 'dream' : stage.index >= 3 ? 'boss' : 'play');
  audio.setIntensity?.(0);
  engine = new GameEngine({
    stage,
    clearedCount: save.cleared.length,
    unlockedAbilities: earnedAbilities(),
    ability: resume && save.current ? save.current.ability : save.equipped,
    snapshot: resume ? save.current : null,
    onEvent: gameEvent,
  });
  cachedImage = null;
  const img = new Image();
  img.onload = () => {
    if (currentStage?.id === stage.id)
      cachedImage = {
        image: img,
        frame: customImages[stage.id] || BOARDS[stage.id] ? null : artFrame(stage.id),
      };
  };
  img.src = customImages[stage.id] || BOARDS[stage.id] || art(stage.id);
  app.innerHTML = `<main class="game-shell immersive ${stage.index === 1 ? 'is-tutorial' : ''}">
 <header class="game-top"><div><div class="game-title">${esc(stage.title)}</div><div class="game-subtitle">${esc(stage.boss.name)}</div></div><div class="actions"><button id="fullscreen" title="전체 화면 F">전체 화면</button><button id="pause" title="잠깐 쉬기 Esc">쉬기</button><button id="to-map" title="동화책 M">동화책</button></div></header>
 <div class="game-stats"><div class="progress-wrap"><span id="progress-label">그림 0%</span><div class="progress"><div class="progress-fill" id="progress-fill"></div></div><span>목표 ${Math.round(engine.target * 100)}%</span></div><span id="lives" class="lives" role="status" aria-label="남은 하트 3개">♥♥♥</span><span id="speed-label">걸음 ☆☆☆</span></div>
 <div class="battle-status"><span class="clue-status" id="clue-status">단서 미발견</span><div class="boss-banner" id="boss-banner"></div></div>
 <div class="canvas-wrap"><canvas id="game" width="864" height="576" aria-label="동화 그림을 되찾는 땅따먹기 게임"></canvas><div class="game-toast" id="toast"></div>
 <div class="touch-controls"><div class="dpad" aria-label="이동 버튼"><button class="up" data-dir="0,-1" aria-label="위로">↑</button><button class="left" data-dir="-1,0" aria-label="왼쪽으로">←</button><button class="down" data-dir="0,1" aria-label="아래로">↓</button><button class="right" data-dir="1,0" aria-label="오른쪽으로">→</button></div><button id="draw-mode" class="draw-button" aria-pressed="false" title="터치 선 긋기 켜기 / 끄기">선 긋기</button></div></div>
 <div class="tutorial-hint" id="hint" ${stage.index === 1 ? '' : 'hidden'}>${stage.index === 1 ? 'Space + 방향키로 조사 · ? 단서를 감싸 연결! 하트 3개 · 선물 1~4' : ''}</div>
 <section class="power-tray"><div class="power-title"><span id="energy">도움 별 ★★★</span><span id="ability-status"></span></div><div class="power-grid">${powerButtons()}</div></section></main>`;
  document.getElementById('fullscreen').onclick = toggleFullscreen;
  document.getElementById('pause').onclick = pauseGame;
  document.getElementById('to-map').onclick = map;
  document.getElementById('draw-mode').onclick = () => {
    if (!paused) {
      touchDraw = !touchDraw;
      setDraw(touchDraw || heldKeys.has('Space'));
    }
  };
  document
    .querySelectorAll('[data-power]')
    .forEach(b => (b.onclick = () => activateAbility(b.dataset.power)));
  document.querySelectorAll('[data-dir]').forEach(button => {
    const direction = button.dataset.dir.split(',').map(Number);
    const canMove = () =>
      engine && !paused && !engine.won && !engine.lost && !document.querySelector('.overlay');
    // A press always walks at least one whole cell, even a very short tap.
    const tapStep = () => {
      engine.setDirection(...direction, { immediate: true });
      engine.setDirection(0, 0);
    };
    button.addEventListener('pointerdown', e => {
      e.preventDefault();
      if (!canMove()) return;
      button.setPointerCapture(e.pointerId);
      engine.setDirection(...direction, { immediate: true });
    });
    for (const type of ['pointerup', 'lostpointercapture'])
      button.addEventListener(type, () => engine?.setDirection(0, 0));
    // The system took the touch (e.g. a scroll): drop the press, including its one-cell tap.
    button.addEventListener('pointercancel', () => engine?.setDirection(0, 0, { cancel: true }));
    button.addEventListener('click', e => {
      if (e.detail === 0 && canMove()) tapStep();
    });
  });
  toastUntil = 0;
  toastText = '';
  last = performance.now();
  frame = requestAnimationFrame(tick);
  save.current = engine.snapshot();
  persist();
  render(last);
  if (engine.lost) showDefeat();
}
function activateAbility(id) {
  if (!engine || paused || engine.won || engine.lost) return;
  void audio.unlock();
  if (!engine.useAbility(id))
    showToast(
      earnedAbilities().includes(id)
        ? '도움 별과 남은 횟수를 확인해 주세요. 잠깐 기다린 뒤 다시 써요.'
        : '같은 묶음의 세 사건을 해결하면 받는 선물이에요.',
      2,
    );
}
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else showToast('브라우저의 전체 화면 기능을 사용해 주세요.', 3);
  } catch {
    showToast('브라우저에서 전체 화면을 열 수 없어요.', 3);
  }
}
function showToast(text, seconds = 3) {
  toastText = text;
  toastUntil = performance.now() + seconds * 1000;
}
function gameEvent(event) {
  fx.onEvent(event, engine);
  if (event.type === 'lose') {
    showDefeat();
    return;
  }
  if (event.type === 'hit') {
    clearInput();
    save.current = engine.snapshot();
    persist();
  }
  if (event.type === 'win') {
    audio.effect('win');
    const stage = currentStage,
      before = earnedAbilities();
    if (stage.id === finale.id) {
      save.finaleCleared = true;
      save.current = null;
      persist();
      setTimeout(() => {
        if (currentStage?.id === stage.id && engine?.won) victory(stage);
      }, 1100);
      return;
    }
    save.cleared = [...new Set([...save.cleared, stage.id])];
    // Keep the best of each star across attempts.
    const had = save.stars[stage.id] || [];
    save.stars[stage.id] = [0, 1, 2].map(i => !!had[i] || !!event.stars?.[i]);
    if (engine.stickerFound && !save.stickers.includes(stage.id)) save.stickers.push(stage.id);
    const gifts = items.filter(item => earnedAbilities().includes(item.id) && !before.includes(item.id));
    save.current = null;
    persist();
    setTimeout(() => {
      if (currentStage?.id === stage.id && engine?.won) victory(stage, gifts);
    }, 1100);
    return;
  }
  if (event.type === 'capture') {
    save.current = engine.snapshot();
    persist();
    document.getElementById('hint').textContent = event.bossCaught
      ? '보스를 가뒀어요! 남은 단서를 찾아요.'
      : event.caught
        ? '장난꾸러기가 제자리로 돌아갔어요!'
        : '한 조각 더 찾았어요. 다음 길도 생각해 봐요.';
  } else if (['warning', 'dash', 'beam', 'hit', 'pickup', 'ability', 'block'].includes(event.type))
    audio.effect(event.type === 'block' ? 'ability' : event.type);
  if (event.type === 'attack')
    audio.effect(event.pattern === 'beam' ? 'beam' : isDash(event.pattern) ? 'dash' : 'warning');
  if (event.type === 'clue') {
    save.current = engine.snapshot();
    persist();
  }
  if (event.type === 'pickup') {
    speedFlashUntil = performance.now() + 1600;
  }
  if (event.message && !['capture', 'clue', 'pickup', 'sticker'].includes(event.type)) {
    if (['warning', 'recovery', 'minion-warning'].includes(event.type)) {
      const hint = document.getElementById('hint');
      if (hint) hint.textContent = event.message;
      toastUntil = 0;
    } else showToast(event.message);
  }
}
// Rules advance in fixed 1/120 s steps so play feels the same at 60 Hz, 144 Hz or a hitching frame.
const STEP = 1 / 120,
  MAX_STEPS = 12;
let stepBank = 0;
function tick(now) {
  if (!engine) return;
  const dt = Math.min(0.1, Math.max(0, (now - last) / 1000));
  last = now;
  if (!paused) {
    fx.update(dt);
    stepBank = Math.min(stepBank + dt * fx.timeScale, STEP * MAX_STEPS);
    while (stepBank >= STEP && engine) {
      engine.step(STEP);
      stepBank -= STEP;
    }
  }
  render(now);
  frame = requestAnimationFrame(tick);
}
// The HUD is plain DOM; write a value only when it changes to keep frames free of layout work.
const hudCache = new WeakMap();
function put(node, key, value) {
  if (!node) return;
  let seen = hudCache.get(node);
  if (!seen) hudCache.set(node, (seen = {}));
  if (seen[key] === value) return;
  seen[key] = value;
  if (key.startsWith('data-')) node.dataset[key.slice(5)] = value;
  else if (key.startsWith('class:')) node.classList.toggle(key.slice(6), value);
  else if (key.startsWith('aria-')) node.setAttribute(key, value);
  else if (key === 'width' || key === 'opacity') node.style[key] = value;
  else node[key] = value;
}
function render(now) {
  const canvas = document.getElementById('game');
  if (!canvas || !engine) return;
  const $ = id => document.getElementById(id);
  const visual = paintGame(canvas, engine, currentStage, cachedImage, fx, now, stepBank / STEP);
  put($('progress-label'), 'textContent', `그림 ${Math.round(engine.progress * 100)}%`);
  put($('progress-fill'), 'width', `${Math.min(100, (engine.progress / engine.target) * 100)}%`);
  const lives = $('lives');
  put(lives, 'textContent', '♥'.repeat(engine.lives) + '♡'.repeat(3 - engine.lives));
  put(lives, 'aria-label', `남은 하트 ${engine.lives}개`);
  put(lives, 'data-remaining', String(engine.lives));
  put(lives, 'class:bump', fx.heartBump > 0);
  const speedLabel = $('speed-label');
  put(
    speedLabel,
    'textContent',
    `걸음 ${'★'.repeat(engine.speedLevel)}${'☆'.repeat(3 - engine.speedLevel)}${engine.shell ? ' · 방패' : ''}`,
  );
  put(speedLabel, 'title', `현재 걸음 ${engine.speed.toFixed(1)} · 별을 모으면 더 빨라져요`);
  put(speedLabel, 'class:speed-up', now < speedFlashUntil);
  const clueStatus = $('clue-status');
  put(
    clueStatus,
    'textContent',
    engine.clueFound ? `찾았다! ${currentStage.clue?.name || '사건의 단서'}` : '? 숨은 단서를 찾아요',
  );
  put(clueStatus, 'data-found', String(!!engine.clueFound));
  const state = engine.bossState || {},
    banner = $('boss-banner');
  put(
    banner,
    'textContent',
    state.phase === 'cleared'
      ? '보스를 가뒀어요. 남은 조사를 마쳐요.'
      : state.phase === 'warning'
        ? `예고 · ${state.name || '보스가 준비해요'} · ${Math.ceil(state.remaining)}초`
        : state.phase === 'attack'
          ? `${state.name || '보스의 특기'}!`
          : state.phase === 'recover'
            ? `지금 그려요! 쉬는 틈 ${Math.ceil(state.remaining)}초`
            : state.enraged
              ? '그림이 돌아오고 있어요. 예고를 살펴봐요.'
              : '',
  );
  put(banner, 'data-phase', state.phase || '');
  audio.setIntensity?.(state.enraged ? 1 : engine.progress > 0.25 ? 0.45 : 0);
  const energy = Math.max(0, engine.energy || 0);
  put($('energy'), 'textContent', '도움 별 ' + '★'.repeat(energy) + '☆'.repeat(Math.max(0, 3 - energy)));
  put(
    $('ability-status'),
    'textContent',
    engine.shield ? `방패 ${engine.shield}회` : engine.freeze > 0 ? '잠깐 멈춤' : '',
  );
  const earned = earnedAbilities();
  for (const button of document.querySelectorAll('[data-power]')) {
    const id = button.dataset.power,
      owned = earned.includes(id),
      count = engine.availableCharges?.[id] || 0;
    put(
      button,
      'disabled',
      !owned || count === 0 || energy <= 0 || engine.won || engine.lost || engine.abilityCooldown > 0,
    );
    put($('charge-' + id), 'textContent', owned ? `${count}회 남음` : '아직 잠김');
  }
  const draw = $('draw-mode');
  put(draw, 'class:active', !!engine.drawHeld);
  put(draw, 'aria-pressed', String(!!engine.drawHeld));
  const toast = $('toast'),
    showing = now < toastUntil;
  put(toast, 'opacity', showing ? '1' : '0');
  put(toast, 'textContent', showing ? toastText : '');
  // Debug readouts for tests and the developer overlay.
  put(canvas, 'data-player', `${engine.player.x},${engine.player.y}`);
  put(canvas, 'data-visual', `${visual.x.toFixed(2)},${visual.y.toFixed(2)}`);
  put(canvas, 'data-trail', String(engine.trail.length));
  put(canvas, 'data-drawing', String(!!engine.drawHeld));
  put(canvas, 'data-energy', String(engine.energy));
  put(canvas, 'data-pattern', state.pattern || '');
  put(canvas, 'data-speed', engine.speed.toFixed(1));
  put(canvas, 'data-speedLevel', String(engine.speedLevel));
  put(canvas, 'data-phase', state.phase || '');
  put(canvas, 'data-clueFound', String(!!engine.clueFound));
  put(canvas, 'data-lives', String(engine.lives));
  put(canvas, 'data-lost', String(!!engine.lost));
}
function retryStage() {
  if (!engine?.lost || !currentStage) return;
  const stage = currentStage;
  closeModal();
  startStage(stage);
}
function showDefeat() {
  if (!engine?.lost || document.getElementById('retry-stage')) return;
  paused = true;
  clearInput();
  save.current = engine.snapshot();
  persist();
  audio.pause();
  render(performance.now());
  modal(
    `<div class="defeat-hearts" aria-hidden="true">♡ ♡ ♡</div><h2>다시 도전해 볼까요?</h2><p>하트 세 개를 모두 썼어요.<br><strong>${esc(currentStage.title)}</strong>을 처음부터 다시 조사해요.</p><p class="muted">이번 판의 땅과 걸음 별은 처음으로 돌아가요.<br>다른 사건의 완료 기록과 받은 선물은 남아요.</p><div class="actions"><button class="primary" id="retry-stage">다시 도전 <kbd>Enter</kbd></button><button id="defeat-map">동화책으로 <kbd>Esc / M</kbd></button></div>`,
    () => {
      document.getElementById('retry-stage').onclick = retryStage;
      document.getElementById('defeat-map').onclick = () => {
        closeModal();
        map();
      };
    },
  );
}
function pauseGame() {
  if (!engine || engine.won || engine.lost || paused) return;
  paused = true;
  clearInput();
  save.current = engine.snapshot();
  persist();
  audio.pause();
  modal(
    `<h2>조금 쉬어 갈까요?</h2><p>${storageOK ? '밝힌 그림을 저장했어요.' : esc(notice)}</p><div class="actions"><button class="primary" id="resume-play">계속 하기 <kbd>Enter / Esc</kbd></button><button id="pause-map">동화책으로 <kbd>M</kbd></button></div>`,
    () => {
      document.getElementById('resume-play').onclick = resumeGame;
      document.getElementById('pause-map').onclick = () => {
        closeModal();
        map();
      };
    },
  );
}
function resumeGame() {
  if (engine?.lost) return;
  closeModal();
  paused = false;
  clearInput();
  last = performance.now();
  audio.resume();
}
function victory(stage, gifts = []) {
  stopGame();
  screen = 'victory';
  audio.play('celebrate');
  const isFinale = stage.id === finale.id;
  const pages = [
    ...(isFinale ? stage.win.map(p => pageArt(p, 'ending-morning')) : stage.win),
    // 또롱's trace: one more step toward the last page.
    ...(stage.trace ? [pageArt(stage.trace, stage.id + '-wink')] : []),
    ...gifts.map(item => ({
      speaker: '책갈피 반짝이',
      text: `사건을 ${item.requiredCount}개나 해결했어! ${item.name}을 선물할게. ${item.description}`,
      caption: `새 선물 · ${item.key}번 ${item.name}`,
      artId: stage.id,
      emotion: 'gift',
    })),
  ];
  storyPages(pages, {
    id: stage.id,
    label: isFinale
      ? '마지막 장 · 끝까지 읽은 밤'
      : `복원 완료 · ${stage.title} · ${starText(stage.id)} · ${save.cleared.length}/${worlds.length}`,
    finishText:
      isFinale || save.finaleCleared
        ? allSolved()
          ? '아침의 동화책'
          : '다음 동화 고르기'
        : allSolved()
          ? '마지막 장으로'
          : '다음 동화 고르기',
    skipText: '동화책으로',
    onDone: () =>
      isFinale ? ending() : !allSolved() ? map() : save.finaleCleared ? ending() : finaleIntro(),
  });
}
function ending() {
  screen = 'ending';
  audio.play('morning');
  storyPages(STORY.ending, {
    id: 'ending-morning',
    label: '에필로그 · 우리가 되찾은 아침',
    finishText: '동화책으로',
    skipText: '동화책으로',
    onDone: () => {
      save.endingSeen = true;
      persist();
      map();
    },
  });
}
function modal(html, bind) {
  const d = document.createElement('div');
  d.className = 'overlay';
  d.innerHTML = `<section class="modal" role="dialog" aria-modal="true">${html}</section>`;
  app.append(d);
  bind?.();
  d.querySelector('button')?.focus();
}
function closeModal() {
  document.querySelector('.overlay')?.remove();
}
// One backup file carries progress and family pictures to another PC.
function exportGame() {
  if (engine && !engine.won) save.current = engine.snapshot();
  persist();
  download('storybook-save.json', JSON.stringify({ save, customImages }), 'application/json');
  const node = document.getElementById('option-notice');
  if (node) node.textContent = '백업 파일을 저장했어요. 다운로드 폴더를 확인해 주세요.';
}
function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function showOptions() {
  modal(
    `<h2>보호자 설정</h2><label class="volume-control">음량 <input id="volume" type="range" min="0" max="100" value="${Math.round(save.volume * 100)}"></label><div class="actions"><button id="save-full">백업 파일 저장</button><label class="file-label">백업 불러오기<input id="import-save" type="file" accept=".json,application/json"></label></div><h3 style="margin-top:25px">우리 가족 그림으로 바꾸기</h3><p>복원할 배경 그림을 바꿔요. 그림은 기기 안에서 처리돼요.</p><select id="image-stage" aria-label="배경을 바꿀 동화">${worlds.map(w => `<option value="${w.id}">${esc(w.title)}</option>`).join('')}</select><label class="file-label">그림 고르기<input id="image-file" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="notice" id="option-notice"></p><div class="actions"><button class="primary" id="close-options">완료 <kbd>Esc</kbd></button><button id="reset">처음부터 새로</button></div>`,
    () => {
      document.getElementById('close-options').onclick = () => {
        closeModal();
        if (screen === 'map') map();
        else if (screen === 'home') home();
      };
      document.getElementById('volume').oninput = e => {
        void audio.unlock();
        save.volume = Number(e.target.value) / 100;
        audio.setVolume(save.volume);
        persist();
      };
      document.getElementById('save-full').onclick = exportGame;
      document.getElementById('import-save').onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          if (file.size > 12 * 1024 * 1024) throw Error('저장 자료가 너무 커요.');
          const pack = JSON.parse(await file.text());
          // Older backups hold only the save; newer ones also carry family pictures.
          const next = cleanSave(pack.save || pack);
          stopGame();
          save = next;
          if (pack.customImages) {
            customImages = cleanImages(pack.customImages);
            persistImages();
          }
          persist();
          audio.setMuted(save.muted);
          audio.setVolume(save.volume);
          closeModal();
          map();
        } catch (error) {
          document.getElementById('option-notice').textContent = error.message;
        }
      };
      document.getElementById('image-file').onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;
        const note = document.getElementById('option-notice');
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 15 * 1024 * 1024) {
          note.textContent = '15MB 이하 PNG/JPG/WebP 그림을 골라 주세요.';
          return;
        }
        try {
          const bitmap = await createImageBitmap(file),
            c = document.createElement('canvas');
          c.width = 1080;
          c.height = 720;
          const ctx = c.getContext('2d');
          ctx.fillStyle = '#f8eedf';
          ctx.fillRect(0, 0, c.width, c.height);
          const scale = Math.min(c.width / bitmap.width, c.height / bitmap.height);
          ctx.drawImage(
            bitmap,
            (c.width - bitmap.width * scale) / 2,
            (c.height - bitmap.height * scale) / 2,
            bitmap.width * scale,
            bitmap.height * scale,
          );
          bitmap.close();
          customImages[document.getElementById('image-stage').value] = c.toDataURL('image/jpeg', 0.88);
          note.textContent = persistImages()
            ? '그림을 바꿨어요. 다음에 켜도 그대로예요.'
            : '그림을 바꿨지만 저장 공간이 부족해요. 백업 파일을 저장해 주세요.';
        } catch {
          note.textContent = '그림을 읽지 못했어요. 다른 그림을 골라 주세요.';
        }
      };
      document.getElementById('reset').onclick = () => {
        if (confirm('현재 진행과 선물을 지우고 새로 시작할까요?')) {
          stopGame();
          save = fresh();
          persist();
          closeModal();
          home();
        }
      };
    },
  );
}
const directions = {
  ArrowUp: [0, -1],
  KeyW: [0, -1],
  ArrowDown: [0, 1],
  KeyS: [0, 1],
  ArrowLeft: [-1, 0],
  KeyA: [-1, 0],
  ArrowRight: [1, 0],
  KeyD: [1, 0],
};
function updateDirection(immediate = false) {
  const key = [...heldKeys].reverse().find(k => directions[k]);
  engine?.setDirection(...(key ? directions[key] : [0, 0]), { immediate });
}
function keydown(e) {
  if (e.ctrlKey || e.altKey || e.metaKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target?.tagName || '')) return;
  const code = e.code || { Enter: 'Enter', ' ': 'Space', Escape: 'Escape' }[e.key] || e.key;
  if (document.querySelector('.overlay')) {
    if (screen === 'game' && engine?.lost) {
      if (code === 'Enter') {
        e.preventDefault();
        if (!e.repeat) retryStage();
      } else if (code === 'Escape' || code === 'KeyM') {
        e.preventDefault();
        closeModal();
        map();
      }
    } else if (screen === 'game' && paused) {
      if (code === 'Enter' || code === 'Escape') {
        e.preventDefault();
        if (!e.repeat) resumeGame();
      } else if (code === 'KeyM') {
        e.preventDefault();
        closeModal();
        map();
      }
    } else if (code === 'Escape') {
      e.preventDefault();
      document.getElementById('close-options')?.click();
    }
    return;
  }
  if (screen === 'game' && engine) {
    if (directions[code]) {
      e.preventDefault();
      heldKeys.add(code);
      updateDirection(!e.repeat);
      return;
    }
    if (code === 'Space') {
      e.preventDefault();
      if (!e.repeat) {
        heldKeys.add('Space');
        setDraw(true);
      }
      return;
    }
    if (e.repeat) return;
    if (/^(Digit|Numpad)[1-4]$/.test(code)) {
      e.preventDefault();
      activateAbility(abilityIds[Number(code.at(-1)) - 1]);
    } else if (code === 'Escape') {
      e.preventDefault();
      pauseGame();
    } else if (code === 'KeyM') {
      e.preventDefault();
      map();
    } else if (code === 'KeyF') {
      e.preventDefault();
      void toggleFullscreen();
    }
    return;
  }
  if (e.repeat) return;
  if (storyNext && ['opening', 'intro', 'victory', 'ending'].includes(screen)) {
    if (code === 'Enter' || code === 'Space') {
      e.preventDefault();
      storyNext();
    } else if (code === 'Escape') {
      e.preventDefault();
      storySkip?.();
    } else if (code === 'ArrowLeft') {
      e.preventDefault();
      storyBack?.();
    }
    return;
  }
  if (screen === 'home' && (code === 'Enter' || code === 'Space' || code === 'KeyC')) {
    e.preventDefault();
    document.getElementById(code === 'KeyC' ? 'continue' : 'start')?.click();
  } else if (screen === 'map') {
    const cols = (window.innerWidth || 1200) <= 850 ? 2 : 4;
    const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cols, ArrowDown: cols }[code];
    if (delta) {
      e.preventDefault();
      selectMap(delta);
    } else if (code === 'Enter' || code === 'Space') {
      e.preventDefault();
      void audio.unlock();
      stageIntro(worlds[mapIndex]);
    } else if (code === 'KeyC') {
      e.preventDefault();
      document.getElementById('resume')?.click();
    }
  }
}
function keyup(e) {
  const code = e.code || e.key;
  heldKeys.delete(code);
  if (code === 'Space') {
    setDraw(touchDraw);
    if (screen === 'game') e.preventDefault();
  }
  if (directions[code]) {
    updateDirection();
    if (screen === 'game') e.preventDefault();
  }
}
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
window.addEventListener('blur', () => {
  clearInput();
  if (screen === 'game' && engine && !paused && !engine.won) pauseGame();
});
window.addEventListener('pagehide', () => {
  if (engine && !engine.won) {
    save.current = engine.snapshot();
    persist();
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInput();
    if (screen === 'game' && engine && !paused && !engine.won) pauseGame();
  }
});
// Read-only handle for the developer overlay (src/debug.js, dev builds only).
window.storybookDebug = {
  get engine() {
    return engine;
  },
  get stage() {
    return currentStage;
  },
};
home();
