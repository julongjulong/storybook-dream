import { WIDTH, HEIGHT } from './config.js';

// Rabbit movement on the grid, drawing the trail, and picking up walking stars.
// Mixed into GameEngine.prototype; `this` is the engine.
export const playerMethods = {
  setDirection(x, y, { immediate = false } = {}) {
    if (this.lost) {
      this.direction = { x: 0, y: 0 };
      this.accumulator = 0;
      this.pendingInitialStep = false;
      return;
    }
    const next = {
      x: Number.isFinite(x) ? Math.sign(x) : 0,
      y: x ? 0 : Number.isFinite(y) ? Math.sign(y) : 0,
    };
    const changed = next.x !== this.direction.x || next.y !== this.direction.y;
    if (!next.x && !next.y) {
      this.accumulator = 0;
      this.pendingInitialStep = false;
    } else if (immediate && changed) {
      // A complete key tap can happen between animation frames. Commit its first cell
      // once, while visualQueue still animates that cell at the normal walking speed.
      this.move(next.x, next.y);
      this.accumulator = 0;
      this.pendingInitialStep = false;
    } else if (!this.direction.x && !this.direction.y) this.pendingInitialStep = true;
    this.direction = next;
  },
  setDrawHeld(held) {
    const next = !this.lost && !!held;
    if (next && !this.drawHeld && (this.direction.x || this.direction.y)) this.pendingInitialStep = true;
    this.drawHeld = next;
    if (!next && this.trail.length) this.accumulator = 0;
  },
  canMove(dx, dy) {
    if (this.won || this.lost || (!dx && !dy) || Math.abs(dx) + Math.abs(dy) !== 1) return false;
    const x = this.player.x + dx,
      y = this.player.y + dy;
    if (x < 1 || y < 1 || x >= WIDTH - 1 || y >= HEIGHT - 1) return false;
    const previous = this.trail.length >= 2 ? this.trail[this.trail.length - 2] : this.anchor;
    if (this.trail.length && x === previous.x && y === previous.y) return true;
    if (this.trail.some(p => p.x === x && p.y === y)) return false;
    if (this.trail.length && !this.drawHeld) return false;
    return this.drawHeld || this.isSafe(x, y);
  },
  updateVisual(dt) {
    let distance = dt * this.speed;
    while (this.visualQueue.length && distance > 0) {
      const next = this.visualQueue[0],
        dx = next.x - this.visualPlayer.x,
        dy = next.y - this.visualPlayer.y,
        length = Math.hypot(dx, dy);
      if (length <= distance + 1e-8) {
        this.visualPlayer = { ...next };
        this.visualQueue.shift();
        distance -= length;
      } else {
        this.visualPlayer.x += (dx / length) * distance;
        this.visualPlayer.y += (dy / length) * distance;
        distance = 0;
      }
    }
  },
  syncVisual() {
    this.visualPlayer = { ...this.player };
    this.visualQueue = [];
    this.accumulator = 0;
    this.pendingInitialStep = false;
  },
  move(dx, dy) {
    if (!this.canMove(dx, dy)) return false;
    const x = this.player.x + dx,
      y = this.player.y + dy,
      previous = this.trail.length >= 2 ? this.trail[this.trail.length - 2] : this.anchor,
      reversing = this.trail.length && x === previous.x && y === previous.y;
    this.player = { x, y };
    this.visualQueue.push({ ...this.player });
    if (reversing) {
      this.trail.pop();
      return true;
    }
    if (this.isSafe(x, y)) {
      this.anchor = { x, y };
      if (this.trail.length) this.capture();
    } else this.trail.push({ x, y });
    this.collectNearby();
    return true;
  },
  collectNearby() {
    if (this.lost) return;
    this.pickups = this.pickups.filter(p => {
      if (Math.hypot(p.x - this.player.x, p.y - this.player.y) < 1.5 || this.isSafe(p.x, p.y)) {
        const before = this.speed;
        this.speedLevel = Math.min(3, this.speedLevel + 1);
        this.onEvent({
          type: 'pickup',
          speedLevel: this.speedLevel,
          speed: this.speed,
          gain: this.speed - before,
          message:
            this.speed > before
              ? `걸음 별 ${this.speedLevel}/3! 발걸음이 더 빨라졌어요!`
              : '걸음 별 3/3! 가장 빠른 발걸음이에요!',
        });
        return false;
      }
      return true;
    });
  },
};
