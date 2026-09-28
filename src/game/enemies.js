import { FUSE, FUSE_FROM, FINALE_ID, velocity } from './config.js';

// Wandering minions, the line-chasing helper, the fuse, and the boss body movement.
// Mixed into GameEngine.prototype; `this` is the engine.
export const enemiesMethods = {
  advanceIntent(enemy, dt) {
    if (enemy.boss || !enemy.intent || enemy.behavior === 'chaser') return 1;
    const intent = enemy.intent;
    intent.remaining -= dt;
    if (intent.phase === 'roam' && intent.remaining <= 0) {
      if (this.bossState.phase === 'warning') {
        intent.remaining = 0.35;
        return 1;
      }
      intent.phase = 'warmup';
      intent.remaining = 0.9;
      this.onEvent({
        type: 'minion-warning',
        enemyId: enemy.id,
        message: '꼬마 친구가 빨개지면 곧 빨라져요!',
      });
    } else if (intent.phase === 'warmup' && intent.remaining <= 0) {
      intent.phase = 'rush';
      intent.remaining = 1.5;
    } else if (intent.phase === 'rush' && intent.remaining <= 0) {
      intent.phase = 'roam';
      intent.remaining = 4 + (enemy.id % 3) * 0.6;
    }
    return intent.phase === 'rush' ? 1.7 : 1;
  },
  // Chaser: drifts toward the rabbit while it is out drawing, quicker if the rabbit stops.
  steerChaser(enemy, dt) {
    if (dt <= 0) return 0;
    const heading = Math.atan2(enemy.vy, enemy.vx);
    let target = heading + Math.sin(this.elapsed * 1.3 + enemy.id) * 0.6;
    if (this.isExposed()) {
      const v = this.visualPlayer;
      target = Math.atan2(v.y + 0.5 - enemy.y, v.x + 0.5 - enemy.x);
    }
    const turn = Math.atan2(Math.sin(target - heading), Math.cos(target - heading)),
      limit = 2.5 * dt,
      next = heading + Math.max(-limit, Math.min(limit, turn));
    Object.assign(enemy, velocity(Math.cos(next), Math.sin(next), this.profile.minionSpeed));
    return this.isExposed() && !this.glide ? 1.1 : 0.7;
  },
  // Fuse: stand still out on a line too long and a spark runs along it from the anchor.
  // Walking again puts it out; reaching the rabbit costs a heart.
  advanceFuse(dt, realDt) {
    if (this.stageNumber < FUSE_FROM || this.stage.id === FINALE_ID || !this.trail.length || this.glide) {
      this.standing = 0;
      this.fuse = null;
      return;
    }
    this.standing += realDt;
    if (!this.fuse) {
      if (this.standing >= FUSE.wait) {
        this.fuse = { at: 0 };
        this.onEvent({ type: 'fuse', message: '불씨가 선을 타고 와요! 움직여요!' });
      }
      return;
    }
    this.fuse.at += FUSE.speed * dt;
    if (this.fuse.at >= this.trail.length) {
      this.fuse = null;
      this.standing = 0;
      this.damage('fuse');
    }
  },
  // Where the fuse is now, for drawing: a point along anchor → line cells.
  fusePoint() {
    if (!this.fuse) return null;
    const points = [this.anchor, ...this.trail],
      i = Math.min(points.length - 2, Math.floor(this.fuse.at)),
      t = this.fuse.at - i,
      a = points[i],
      b = points[i + 1] || a;
    return { x: a.x + (b.x - a.x) * t + 0.5, y: a.y + (b.y - a.y) * t + 0.5 };
  },
  advanceEnemies(dt, factor) {
    for (const enemy of this.enemies) {
      if (this.lost) return;
      let movement = factor * (factor > 0 ? this.advanceIntent(enemy, dt * factor) : 0);
      if (enemy.behavior === 'chaser') movement *= this.steerChaser(enemy, dt * factor);
      if (enemy.boss) {
        // A charge runs only for its attack time; otherwise the boss walks at its phase pace.
        if (enemy.dashing && dt * factor > 0)
          movement *= Math.min(1, Math.max(0, this.bossState.remaining) / (dt * factor));
        else {
          this.steerBoss(enemy, dt * factor);
          movement *= this.bossPace();
        }
      }
      const substeps = Math.max(
        1,
        Math.ceil((Math.max(Math.abs(enemy.vx), Math.abs(enemy.vy)) * dt * movement) / 0.18),
      );
      for (let n = 0; n < substeps; n++) {
        if (this.lost) return;
        const dx = (enemy.vx * dt * movement) / substeps,
          dy = (enemy.vy * dt * movement) / substeps;
        if (
          enemy.dashing &&
          (this.blocked(enemy.x + dx, enemy.y) ||
            this.blocked(enemy.x, enemy.y + dy) ||
            this.blocked(enemy.x + dx, enemy.y + dy))
        ) {
          this.finishAttack();
          break;
        }
        const fromX = enemy.x,
          fromY = enemy.y;
        if (this.blocked(enemy.x + dx, enemy.y)) enemy.vx *= -1;
        else enemy.x += dx;
        if (this.blocked(enemy.x, enemy.y + dy)) enemy.vy *= -1;
        else enemy.y += dy;
        if (enemy.boss) this.dropCrumbs(enemy, Math.hypot(enemy.x - fromX, enemy.y - fromY));
        if (this.touchesTrail(enemy.x, enemy.y, enemy.boss ? 1.2 : 0.72))
          this.damage(enemy.boss ? 'boss' : 'minion');
      }
    }
  },
};
