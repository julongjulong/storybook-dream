// v5 replay reasons: stars placed per case, a hidden sticker, and a three-star rating.
import test from 'node:test';
import assert from 'node:assert/strict';
import { GameEngine, WIDTH } from '../src/engine.js';
import { STICKERS, BONUS_MARGIN } from '../src/game/rewards.js';
import { STORY } from '../src/story-data.js';

const make = (index, extra = {}) => new GameEngine({ stage: STORY.worlds[index - 1], ...extra });

test('each case places its three walking stars differently, one per third, away from the clue', () => {
  const layouts = new Set();
  for (let i = 1; i <= 12; i++) {
    const g = make(i);
    assert.equal(g.pickups.length, 3);
    g.pickups.forEach((p, third) => {
      assert.ok(p.x >= 6 + third * 21 && p.x < 6 + third * 21 + 17);
      assert.ok(Math.hypot(p.x - g.clue.x, p.y - g.clue.y) >= 7);
      assert.equal(g.isSafe(p.x, p.y), false);
    });
    layouts.add(JSON.stringify(g.pickups));
    // The same case always lays out the same way.
    assert.deepEqual(make(i).pickups, g.pickups);
  }
  assert.ok(layouts.size >= 10);
});

test('every case hides one sticker away from the clue, found by restoring its spot', () => {
  for (let i = 1; i <= 12; i++) {
    const events = [];
    const g = make(i, { onEvent: e => events.push(e) });
    assert.ok(g.sticker, `case ${i}`);
    assert.equal(g.sticker.icon, STICKERS[g.stage.id]);
    assert.ok(Math.hypot(g.sticker.x - g.clue.x, g.sticker.y - g.clue.y) >= 12);
    g.cells[g.sticker.y * WIDTH + g.sticker.x] = 1;
    g.checkSticker();
    g.checkSticker();
    assert.equal(g.stickerFound, true);
    assert.equal(events.filter(e => e.type === 'sticker').length, 1);
  }
});

test('the rating: solved, no heart lost, and restoring well past the target', () => {
  const g = make(4);
  assert.deepEqual(g.starsEarned(), [true, true, false]);
  g.heartsLost = 1;
  for (let y = 2; y < 46; y++) for (let x = 2; x < WIDTH - 2; x++) g.cells[y * WIDTH + x] = y < 40 ? 1 : 0;
  assert.ok(g.progress >= g.target + BONUS_MARGIN);
  assert.deepEqual(g.starsEarned(), [true, false, true]);
});

test('hearts lost and a found sticker survive a checkpoint', () => {
  const g = make(6);
  g.heartsLost = 2;
  g.lives = 1;
  g.cells[g.sticker.y * WIDTH + g.sticker.x] = 1;
  g.checkSticker();
  const r = new GameEngine({ stage: STORY.worlds[5], snapshot: g.snapshot() });
  assert.equal(r.heartsLost, 2);
  assert.equal(r.stickerFound, true);
});

test('winning reports the stars and whether the sticker was found', () => {
  const events = [];
  const g = make(2, { onEvent: e => events.push(e) });
  g.cells.fill(1);
  g.enemies = [];
  g.checkWin();
  const win = events.find(e => e.type === 'win');
  assert.deepEqual(win.stars, [true, true, true]);
  assert.equal(win.sticker, true);
});
