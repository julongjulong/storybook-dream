import { WIDTH, HEIGHT, DAYLIGHT, minionBehavior, velocity } from './config.js';

// Time pressure for a case: morning → noon (2 min, one more helper) → night (4 min, another
// helper, a faster boss with shorter breaks). Never a game over; the day just gets harder.
// Mixed into GameEngine.prototype; `this` is the engine.
export const daylightMethods = {
  // 'morning' | 'noon' | 'night', from the case's own play time.
  daylightPhase() {
    return this.elapsed >= DAYLIGHT.night ? 'night' : this.elapsed >= DAYLIGHT.noon ? 'noon' : 'morning';
  },
  // Seconds until the next change, or null at night.
  daylightLeft() {
    if (this.elapsed < DAYLIGHT.noon) return DAYLIGHT.noon - this.elapsed;
    if (this.elapsed < DAYLIGHT.night) return DAYLIGHT.night - this.elapsed;
    return null;
  },
  // Boss movement and break length at night.
  nightScale(forNight, otherwise = 1) {
    return this.elapsed >= DAYLIGHT.night ? forNight : otherwise;
  },
  advanceDaylight(before) {
    for (const [phase, at] of [
      ['noon', DAYLIGHT.noon],
      ['night', DAYLIGHT.night],
    ]) {
      const warnAt = at - DAYLIGHT.warning;
      if (before < warnAt && this.elapsed >= warnAt)
        this.onEvent({
          type: 'daylight-soon',
          phase,
          message:
            phase === 'noon' ? '곧 정오예요! 꼬마 친구가 하나 더 나와요.' : '곧 밤이 돼요! 서둘러 밝혀요.',
        });
      if (before < at && this.elapsed >= at) {
        const spawned = this.spawnHelper(phase === 'night' ? 'chaser' : 'rush_wander');
        this.onEvent({
          type: 'daylight',
          phase,
          spawned,
          message:
            phase === 'noon'
              ? '정오예요! 꼬마 친구가 하나 더 나왔어요.'
              : '밤이 됐어요! 보스가 더 빨라지고 꼬마 친구가 또 나왔어요.',
        });
      }
    }
  },
  // A new helper appears on open ground, well away from the rabbit.
  spawnHelper(kind) {
    if (this.enemies.length >= DAYLIGHT.maxEnemies || !this.profile.minionSpeed) return null;
    const v = this.visualPlayer;
    for (let tries = 0; tries < 60; tries++) {
      const x = 4 + this.rng() * (WIDTH - 8),
        y = 4 + this.rng() * (HEIGHT - 8);
      if (this.blocked(x, y) || Math.hypot(x - v.x, y - v.y) < 15) continue;
      const id = [1, 2, 3, 4, 5, 6].find(n => !this.enemies.some(e => e.id === n));
      const behavior =
          kind === 'chaser' && minionBehavior(this.stageNumber, 1) === 'chaser' ? 'chaser' : 'rush_wander',
        angle = this.rng() * Math.PI * 2;
      const helper = {
        id,
        x,
        y,
        ...velocity(Math.cos(angle), Math.sin(angle), this.profile.minionSpeed),
        boss: false,
        behavior,
        intent: { phase: 'roam', remaining: 2, angle },
      };
      this.enemies.push(helper);
      return { x, y, behavior };
    }
    return null;
  },
};
