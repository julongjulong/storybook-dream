import { WIDTH, HEIGHT } from './config.js';

// Reasons to play a case again: walking stars placed per case, a hidden sticker,
// and a three-star rating (cleared / no heart lost / 15 points past the target).
// Mixed into GameEngine.prototype; `this` is the engine.
export const BONUS_MARGIN = 0.15;
export const STICKERS = {
  race: '🐢',
  duck: '🥾',
  pigs: '🧱',
  redhood: '🍞',
  beans: '🔔',
  ant: '🌾',
  lion: '🐭',
  fox: '🍇',
  wind: '🎩',
  ax: '🪓',
  piper: '🎵',
  troy: '🦆',
};

export const rewardsMethods = {
  // One star in each third of the board, never on top of the clue.
  placeStars() {
    const stars = [];
    for (let third = 0; third < 3; third++) {
      for (let tries = 0; tries < 40; tries++) {
        const x = 6 + third * 21 + Math.floor(this.rng() * 17),
          y = 6 + Math.floor(this.rng() * (HEIGHT - 12));
        if (Math.hypot(x - this.clue.x, y - this.clue.y) < 7) continue;
        stars.push({ x, y, type: 'speed' });
        break;
      }
    }
    return stars;
  },
  // A sticker hides away from the clue, somewhere a curious player will only reach by exploring.
  placeSticker() {
    for (let tries = 0; tries < 80; tries++) {
      const x = 5 + Math.floor(this.rng() * (WIDTH - 10)),
        y = 5 + Math.floor(this.rng() * (HEIGHT - 10));
      if (Math.hypot(x - this.clue.x, y - this.clue.y) < 12) continue;
      if (this.pickups.some(p => Math.hypot(p.x - x, p.y - y) < 5)) continue;
      return { x, y, icon: STICKERS[this.stage.id] || '⭐' };
    }
    return null;
  },
  checkSticker() {
    const s = this.sticker;
    if (!s || this.stickerFound || !this.isSafe(s.x, s.y)) return;
    this.stickerFound = true;
    this.onEvent({ type: 'sticker', sticker: { ...s }, message: `숨은 스티커 ${s.icon}를 찾았어요!` });
  },
  // Stars for this attempt, given when the case is solved.
  starsEarned() {
    return [true, this.heartsLost === 0, this.progress >= this.target + BONUS_MARGIN];
  },
};
