// Developer overlay, loaded only by `npm run dev`.
// F3: FPS, engine phase and hit areas. With the overlay on:
//   G  toggles invulnerability, N forces the boss's next attack, W wins the case.
import { WIDTH, HEIGHT } from './engine.js';

if (import.meta.env.DEV) {
  let on = false,
    god = false,
    last = performance.now(),
    fps = 60;
  const layer = document.createElement('canvas');
  layer.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;display:none';
  document.body.append(layer);

  window.addEventListener('keydown', e => {
    const engine = window.storybookDebug?.engine;
    if (e.code === 'F3') {
      e.preventDefault();
      on = !on;
      layer.style.display = on ? 'block' : 'none';
    }
    if (!on || !engine) return;
    if (e.code === 'KeyG') {
      god = !god;
    } else if (e.code === 'KeyN' && engine.bossState.phase === 'roam') engine.beginWarning();
    else if (e.code === 'KeyW') {
      engine.cells.fill(1);
      engine.enemies = [];
      engine.checkWin();
    }
  });

  const frame = now => {
    fps = fps * 0.9 + (1000 / Math.max(1, now - last)) * 0.1;
    last = now;
    const engine = window.storybookDebug?.engine,
      game = document.getElementById('game');
    if (on && engine && game) {
      if (god) engine.grace = Math.max(engine.grace, 0.2);
      const r = game.getBoundingClientRect(),
        dpr = devicePixelRatio || 1;
      Object.assign(layer.style, {
        left: r.left + 'px',
        top: r.top + 'px',
        width: r.width + 'px',
        height: r.height + 'px',
      });
      layer.width = Math.round(r.width * dpr);
      layer.height = Math.round(r.height * dpr);
      const ctx = layer.getContext('2d'),
        sx = r.width / WIDTH,
        sy = r.height / HEIGHT;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const ring = (x, y, radius, color) => {
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.ellipse(x * sx, y * sy, radius * sx, radius * sy, 0, 0, Math.PI * 2);
        ctx.stroke();
      };
      ctx.lineWidth = 1;
      for (const p of engine.trail) ring(p.x + 0.5, p.y + 0.5, 0.5, '#0f0');
      for (const e of engine.enemies) ring(e.x, e.y, e.boss ? 1.2 : 0.72, '#f0f');
      for (const b of engine.bullets) ring(b.x, b.y, 0.65, '#f00');
      ring(engine.player.x + 0.5, engine.player.y + 0.5, 0.5, '#0ff');
      const s = engine.bossState;
      const lines = [
        `${fps.toFixed(0)} fps`,
        `boss ${s.phase} ${s.pattern || ''} ${Number(s.remaining || 0).toFixed(1)}s`,
        `progress ${(engine.progress * 100).toFixed(1)}% / ${(engine.target * 100).toFixed(0)}%`,
        `bullets ${engine.bullets.length}  trail ${engine.trail.length}  speed ${engine.speed.toFixed(1)}`,
        `${god ? 'GOD ' : ''}G god · N attack · W win`,
      ];
      ctx.font = '12px monospace';
      ctx.fillStyle = '#000a';
      ctx.fillRect(4, 4, 290, lines.length * 15 + 6);
      ctx.fillStyle = '#fff';
      lines.forEach((line, i) => ctx.fillText(line, 10, 18 + i * 15));
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
