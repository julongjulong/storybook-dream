import test from 'node:test';
import assert from 'node:assert/strict';
import { STORY } from '../src/story-data.js';

test('그림 동화는 오프닝 3컷, 각 장 이상증상·조사·진입 3컷과 복원 2컷, 엔딩 2컷이다', () => {
  assert.equal(STORY.opening.length, 3);
  assert.equal(STORY.ending.length, 2);
  assert.deepEqual(
    STORY.opening.map(p => p.artId),
    ['opening-bedroom', 'opening-bedroom', 'opening-dream'],
  );
  assert.deepEqual(
    STORY.ending.map(p => p.artId),
    ['ending-morning', 'ending-morning'],
  );
  for (const [i, w] of STORY.worlds.entries()) {
    assert.equal(w.index, i + 1);
    assert.equal(w.intro.length, 3);
    assert.equal(w.win.length, 2);
    assert.deepEqual(
      w.intro.map(p => p.artId),
      ['before', 'twist', 'challenge'].map(beat => `${w.id}-${beat}`),
    );
    assert.deepEqual(
      w.win.map(p => p.artId),
      [`${w.id}-solved`, `${w.id}-wink`],
    );
    assert.ok(w.clue.name && w.clue.x >= 2 && w.clue.y >= 2);
  }
});

test('네 선물은 세 사건씩 모두 완료하고 등껍질 수사는 발견과 윙크로 이어진다', () => {
  assert.deepEqual(
    STORY.items.map(i => i.id),
    ['shell', 'feather', 'lantern', 'clock'],
  );
  assert.deepEqual(
    STORY.items.flatMap(i => i.requiredStages),
    STORY.worlds.map(w => w.id),
  );
  for (const w of STORY.worlds) assert.equal(w.reward, undefined);
  const race = STORY.worlds[0];
  assert.equal(STORY.worlds.length, 12);
  assert.match(JSON.stringify(race.intro), /등껍질/);
  assert.match(JSON.stringify(race.win), /윙크/);
  assert.equal(race.boss.symbol, 'leafball');
  assert.ok(!JSON.stringify(STORY).match(/신데렐라|백설공주|잠자는.*공주/));
  assert.ok(!JSON.stringify(STORY).includes('피자'));
});

test('모든 그림 컷에는 짧은 대사·화자·캡션·감정이 들어 있어 빈 이야기 페이지가 없다', () => {
  const panels = [...STORY.opening, ...STORY.worlds.flatMap(w => [...w.intro, ...w.win]), ...STORY.ending];
  for (const p of panels) {
    for (const key of ['text', 'speaker', 'caption', 'emotion', 'artId'])
      assert.ok(typeof p[key] === 'string' && p[key].trim(), `${p.artId}: ${key}`);
    assert.ok(p.text.length <= 140, `${p.artId}: 대사 ${p.text.length}자`);
    assert.ok(p.caption.length <= 50, `${p.artId}: 캡션 ${p.caption.length}자`);
  }
});
