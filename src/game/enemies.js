import { velocity } from './config.js';

// Wandering minions and the boss body movement.
// Mixed into GameEngine.prototype; `this` is the engine.
export const enemiesMethods = {
  advanceIntent(enemy, dt) {
    if (enemy.boss || !enemy.intent) return 1;
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
  advanceEnemies(dt, factor) {
    for (const enemy of this.enemies) {
      if (this.lost) return;
      let movement = factor * (factor > 0 ? this.advanceIntent(enemy, dt * factor) : 0);
      if (enemy.boss) {
        if (
          this.bossState.phase === 'warning' ||
          (this.bossState.phase === 'attack' && !enemy.dashing) ||
          this.bossState.phase === 'recover'
        )
          movement = 0;
        else if (enemy.dashing && dt * factor > 0)
          movement *= Math.min(1, Math.max(0, this.bossState.remaining) / (dt * factor));
        else if (this.stageNumber === 2) {
          const angle = Math.atan2(enemy.vy, enemy.vx) + Math.sin(this.elapsed * 1.4) * dt * factor * 0.55;
          Object.assign(enemy, velocity(Math.cos(angle), Math.sin(angle), this.profile.bossSpeed));
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
          this.endDash();
          this.beginRecovery();
          break;
        }
        if (this.blocked(enemy.x + dx, enemy.y)) enemy.vx *= -1;
        else enemy.x += dx;
        if (this.blocked(enemy.x, enemy.y + dy)) enemy.vy *= -1;
        else enemy.y += dy;
        if (this.touchesTrail(enemy.x, enemy.y, enemy.boss ? 1.2 : 0.72)) this.damage();
      }
    }
  },
};
