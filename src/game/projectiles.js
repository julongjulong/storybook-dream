// Bullets and beams fired by the boss.
// Mixed into GameEngine.prototype; `this` is the engine.
//
// A bullet may also carry (all optional):
//   r        hit radius in cells (default 0.65)
//   curve    turn rate in radians per second, for leaves and notes that swerve
//   splitAt  age in seconds when it splits into splitCount pieces spread by splitSpread
//   popAt    age when a resting grape pops into popCount seeds
//   armAt    age before which it cannot hurt (a drop still falling)
// A beam may carry spin (radians per second) to sweep like a lighthouse.
const DEFAULT_RADIUS = 0.65;

export const projectilesMethods = {
  advanceProjectiles(dt, factor) {
    if (this.lost) return;
    const spawned = [];
    this.bullets = this.bullets.filter(b => {
      if (this.lost) return true;
      const travelDt = Math.min(dt * factor, b.life),
        substeps = Math.max(1, Math.ceil((Math.max(Math.abs(b.vx), Math.abs(b.vy)) * travelDt) / 0.18));
      if (dt * factor > 0) b.age = (b.age || 0) + dt * factor;
      if (b.curve && travelDt > 0) {
        const turn = b.curve * travelDt,
          c = Math.cos(turn),
          s = Math.sin(turn);
        [b.vx, b.vy] = [b.vx * c - b.vy * s, b.vx * s + b.vy * c];
      }
      const armed = !(b.armAt > b.age);
      for (let n = 0; n < substeps; n++) {
        b.x += (b.vx * travelDt) / substeps;
        b.y += (b.vy * travelDt) / substeps;
        if (this.blocked(b.x, b.y)) return false;
        if (armed && this.touchesTrail(b.x, b.y, b.r ?? DEFAULT_RADIUS)) {
          this.damage(b.kind === 'crumb' ? 'crumb' : 'shot');
          return false;
        }
      }
      if (b.splitAt && b.age >= b.splitAt) {
        spawned.push(
          ...this.fan(
            b,
            b.splitCount || 3,
            b.splitSpread || 0.45,
            Math.atan2(b.vy, b.vx),
            Math.hypot(b.vx, b.vy),
            b.life,
            'split',
          ),
        );
        return false;
      }
      if (b.popAt && b.age >= b.popAt) {
        spawned.push(
          ...this.fan(
            b,
            b.popCount || 4,
            (Math.PI * 2) / (b.popCount || 4),
            Math.PI / 4,
            b.popSpeed || 7,
            b.popLife || 1.2,
            'seed',
            true,
          ),
        );
        return false;
      }
      b.life -= dt * factor;
      return b.life > 0;
    });
    this.bullets.push(...spawned);
    this.beams = this.beams.filter(b => {
      if (this.lost) return true;
      if (this.blocked(b.x, b.y)) return false;
      if (b.spin) {
        b.angle += b.spin * dt * factor;
        b.length = Math.min(b.maxLength ?? 100, this.rayLength(b.x, b.y, b.angle));
      } else b.length = Math.min(b.length, this.rayLength(b.x, b.y, b.angle));
      if (factor > 0 && this.beamTouches(b)) this.damage('beam');
      b.life -= dt * factor;
      return b.life > 0;
    });
  },
  // Pieces flying out from one point: a split shot, or seeds from a popping grape.
  fan(from, count, step, base, speed, life, kind, around = false) {
    const pieces = [];
    for (let i = 0; i < count; i++) {
      const angle = around ? base + i * step : base + (i - (count - 1) / 2) * step;
      pieces.push({
        x: from.x,
        y: from.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        kind,
      });
    }
    return pieces;
  },
  beamTouches(b) {
    const hit = (x, y) => {
      const dx = x - b.x,
        dy = y - b.y,
        along = dx * Math.cos(b.angle) + dy * Math.sin(b.angle),
        across = Math.abs(-dx * Math.sin(b.angle) + dy * Math.cos(b.angle));
      return along >= 0 && along <= b.length && across < b.width * 0.5 + 0.4;
    };
    if (this.trail.some(p => hit(p.x + 0.5, p.y + 0.5))) return true;
    const v = this.visualPlayer;
    return this.isExposed() && hit(v.x + 0.5, v.y + 0.5);
  },
};
