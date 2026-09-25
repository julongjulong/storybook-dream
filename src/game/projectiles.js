// Bullets and beams fired by the boss.
// Mixed into GameEngine.prototype; `this` is the engine.
export const projectilesMethods = {
  advanceProjectiles(dt, factor) {
    if (this.lost) return;
    this.bullets = this.bullets.filter(b => {
      if (this.lost) return true;
      const travelDt = Math.min(dt * factor, b.life),
        substeps = Math.max(1, Math.ceil((Math.max(Math.abs(b.vx), Math.abs(b.vy)) * travelDt) / 0.18));
      for (let n = 0; n < substeps; n++) {
        b.x += (b.vx * travelDt) / substeps;
        b.y += (b.vy * travelDt) / substeps;
        if (this.blocked(b.x, b.y)) return false;
        if (this.touchesTrail(b.x, b.y, 0.65)) {
          this.damage();
          return false;
        }
      }
      b.life -= dt * factor;
      return b.life > 0;
    });
    this.beams = this.beams.filter(b => {
      if (this.lost) return true;
      if (this.blocked(b.x, b.y)) return false;
      b.length = Math.min(b.length, this.rayLength(b.x, b.y, b.angle));
      if (factor > 0)
        for (const p of this.trail) {
          const dx = p.x + 0.5 - b.x,
            dy = p.y + 0.5 - b.y,
            along = dx * Math.cos(b.angle) + dy * Math.sin(b.angle),
            across = Math.abs(-dx * Math.sin(b.angle) + dy * Math.cos(b.angle));
          if (along >= 0 && along <= b.length && across < b.width * 0.5 + 0.4) {
            this.damage();
            break;
          }
        }
      b.life -= dt * factor;
      return b.life > 0;
    });
  },
};
