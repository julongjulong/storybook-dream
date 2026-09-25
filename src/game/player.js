import { WIDTH, HEIGHT } from './config.js';

// Rabbit movement on the grid, drawing the trail, and picking up walking stars.
// Mixed into GameEngine.prototype; `this` is the engine.
//
// The rabbit glides from cell centre to cell centre. `player` is the last cell it reached
// (the cell the rules use); `glide` is the step in progress. What the player sees
// (`visualPlayer`) is exactly where hits are judged, so there is no catch-up lag.
// A step, once started, always finishes: a quick tap moves one whole cell, and a
// direction pressed mid-step is taken at the next cell centre.
const RAMP = 0.08; // seconds from standstill to full walking pace

export const playerMethods = {
  setDirection(x, y, { immediate = false, cancel = false } = {}) {
    if (this.lost || cancel) {
      this.direction = { x: 0, y: 0 };
      this.tap = null;
      return;
    }
    const next = {
      x: Number.isFinite(x) ? Math.sign(x) : 0,
      y: x ? 0 : Number.isFinite(y) ? Math.sign(y) : 0,
    };
    const changed = next.x !== this.direction.x || next.y !== this.direction.y;
    // A tap can press and release between two frames; remember it so it still moves one cell.
    if (immediate && changed && (next.x || next.y)) this.tap = next;
    this.direction = next;
  },
  setDrawHeld(held) {
    this.drawHeld = !this.lost && !!held;
  },
  canMove(dx, dy) {
    if (this.won || this.lost || (!dx && !dy) || Math.abs(dx) + Math.abs(dy) !== 1) return false;
    const x = this.player.x + dx,
      y = this.player.y + dy;
    if (x < 1 || y < 1 || x >= WIDTH - 1 || y >= HEIGHT - 1) return false;
    if (this.isReverse(dx, dy)) return true;
    if (this.trail.some(p => p.x === x && p.y === y)) return false;
    if (this.trail.length && !this.drawHeld) return false;
    return this.drawHeld || this.isSafe(x, y);
  },
  isReverse(dx, dy) {
    const previous = this.trail.length >= 2 ? this.trail[this.trail.length - 2] : this.anchor;
    return !!this.trail.length && this.player.x + dx === previous.x && this.player.y + dy === previous.y;
  },
  // True while the rabbit is visibly outside safe ground, including the first step out.
  isExposed() {
    if (this.trail.length) return true;
    const g = this.glide;
    return !!g && !this.isSafe(this.player.x + g.dx, this.player.y + g.dy);
  },
  advancePlayer(dt) {
    if (!this.glide) {
      const want = this.tap || this.direction;
      if (this.canMove(want.x, want.y)) this.startGlide(want.x, want.y, 0);
      this.tap = null;
    }
    const g = this.glide;
    if (!g) {
      this.pace = 0;
      return;
    }
    this.pace = Math.min(this.speed, this.pace + (this.speed * dt) / RAMP);
    g.t += dt * this.pace;
    while (this.glide && this.glide.t >= 1 && !this.won && !this.lost) {
      const { dx, dy, t } = this.glide;
      this.glide = null;
      this.commitCell(dx, dy);
      if (this.won || this.lost) break;
      // Keep walking if a direction is still held (this is also the turn buffer).
      const want = this.direction;
      if (this.canMove(want.x, want.y)) this.startGlide(want.x, want.y, t - 1);
      else this.pace = 0;
    }
    this.updateVisual();
  },
  startGlide(dx, dy, t) {
    this.glide = { dx, dy, t, reverse: this.isReverse(dx, dy) };
    if (dx) this.facing = dx;
    this.drawingStep = !this.glide.reverse && (this.drawHeld || this.trail.length > 0);
  },
  updateVisual() {
    const g = this.glide;
    this.visualPlayer = g
      ? { x: this.player.x + g.dx * g.t, y: this.player.y + g.dy * g.t }
      : { x: this.player.x, y: this.player.y };
  },
  syncVisual() {
    this.glide = null;
    this.tap = null;
    this.pace = 0;
    this.updateVisual();
  },
  // Instant one-cell move for rules and tests; normal play glides through advancePlayer.
  move(dx, dy) {
    if (!this.canMove(dx, dy)) return false;
    this.glide = null;
    this.commitCell(dx, dy);
    this.updateVisual();
    return true;
  },
  commitCell(dx, dy) {
    const x = this.player.x + dx,
      y = this.player.y + dy,
      reversing = this.isReverse(dx, dy);
    this.player = { x, y };
    if (reversing) {
      this.trail.pop();
      return;
    }
    if (this.isSafe(x, y)) {
      this.anchor = { x, y };
      if (this.trail.length) this.capture();
    } else this.trail.push({ x, y });
    this.collectNearby();
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
