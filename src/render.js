import { WIDTH, HEIGHT, PATTERN_SPECS } from './engine.js';

export function strokeRay(ctx, ray, color, dashed = false, scale = { x: 12, y: 12 }) {
  const length = Number.isFinite(ray.length) ? ray.length : 90,
    unit = Math.min(scale.x, scale.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, (ray.width || 0.4) * unit);
  ctx.setLineDash(dashed ? [unit * 0.65, unit * 0.5] : []);
  ctx.beginPath();
  ctx.moveTo(ray.x * scale.x, ray.y * scale.y);
  ctx.lineTo(
    (ray.x + Math.cos(ray.angle) * length) * scale.x,
    (ray.y + Math.sin(ray.angle) * length) * scale.y,
  );
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw the corridor in world coordinates, so non-square viewports transform its
// width as well as its centre line. A scalar screen lineWidth was misleading.
export function dangerRay(ctx, ray, color, scale) {
  const half = ray.width / 2,
    nx = -Math.sin(ray.angle) * half,
    ny = Math.cos(ray.angle) * half;
  const ex = ray.x + Math.cos(ray.angle) * ray.length,
    ey = ray.y + Math.sin(ray.angle) * ray.length;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo((ray.x + nx) * scale.x, (ray.y + ny) * scale.y);
  ctx.lineTo((ex + nx) * scale.x, (ey + ny) * scale.y);
  ctx.lineTo((ex - nx) * scale.x, (ey - ny) * scale.y);
  ctx.lineTo((ray.x - nx) * scale.x, (ray.y - ny) * scale.y);
  ctx.closePath();
  ctx.fill();
  if (ray.rounded)
    for (const [x, y] of [
      [ray.x, ray.y],
      [ex, ey],
    ]) {
      ctx.beginPath();
      ctx.ellipse(x * scale.x, y * scale.y, half * scale.x, half * scale.y, 0, 0, Math.PI * 2);
      ctx.fill();
    }
}

// pose: facing (1 right, -1 left), hop (0..1 through a step), lean (tiptoe while drawing).
function rabbit(ctx, x, y, u, drawing, { facing = 1, hop = 0, lean = 0 } = {}) {
  ctx.save();
  ctx.translate(x, y - Math.sin(hop * Math.PI) * u * 0.22);
  ctx.rotate(lean * facing * 0.16);
  // Squash a little at each landing, stretch mid-hop.
  const stretch = 1 + Math.sin(hop * Math.PI) * 0.06 - (hop > 0.85 ? (hop - 0.85) * 0.5 : 0);
  ctx.scale(u * facing * (2 - stretch), u * stretch);
  ctx.strokeStyle = '#78534d';
  ctx.lineWidth = 0.11;
  const ellipse = (x, y, rx, ry, rotation, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  ellipse(-0.37, -0.95, 0.25, 0.72, -0.2, '#d9a678');
  ellipse(0.37, -0.95, 0.25, 0.72, 0.2, '#d9a678');
  ellipse(-0.37, -1, 0.11, 0.44, -0.2, '#f1b9ac');
  ellipse(0.37, -1, 0.11, 0.44, 0.2, '#f1b9ac');
  ellipse(0, 0, 0.79, 0.72, 0, drawing ? '#f5c886' : '#d9a678');
  ellipse(0, 0.27, 0.53, 0.35, 0, '#fff0d7');
  ctx.fillStyle = '#284d50';
  ctx.beginPath();
  ctx.moveTo(-0.5, 0.64);
  ctx.lineTo(0.56, 0.64);
  ctx.lineTo(0.87, 1.03);
  ctx.lineTo(0.05, 0.79);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#423330';
  for (const dx of [-0.27, 0.27]) {
    ctx.beginPath();
    ctx.arc(dx, -0.06, 0.09, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#be7e76';
  ctx.beginPath();
  ctx.arc(0, 0.19, 0.09, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function bossIcon(ctx, symbol, x, y, r, now) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(r / 24, r / 24);
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#73597e';
  const circle = (x, y, r, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  };
  const box = (x, y, w, h, fill) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 5);
    ctx.fill();
    ctx.stroke();
  };
  if (symbol === 'leafball') {
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5;
      ctx.fillStyle = i % 2 ? '#cfab66' : '#9fb36b';
      ctx.beginPath();
      ctx.ellipse(Math.cos(a) * 9, Math.sin(a) * 9, 17, 9, a, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (symbol === 'bubble') {
    circle(0, 0, 21, '#8cc7dc');
    circle(-16, 13, 8, '#b6e2e9');
    circle(16, -14, 7, '#c7e9ed');
    circle(-7, -8, 5, '#eefbfa');
  } else if (symbol === 'acorn') {
    circle(0, 5, 18, '#ca9661');
    box(-22, -13, 44, 15, '#8d7650');
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(5, -26);
    ctx.stroke();
  } else if (symbol === 'knot') {
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#cda777';
    for (const dx of [-10, 10]) {
      ctx.beginPath();
      ctx.ellipse(dx, 0, 12, 18, dx * 0.02, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-22, 18);
    ctx.lineTo(22, -18);
    ctx.stroke();
  } else if (symbol === 'grapes') {
    for (const [x, y] of [
      [-12, -12],
      [9, -12],
      [-19, 3],
      [0, 3],
      [19, 3],
      [-9, 17],
      [10, 17],
      [0, 29],
    ])
      circle(x, y, 9, '#b69bce');
    ctx.strokeStyle = '#8da779';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(8, -30);
    ctx.stroke();
  } else if (symbol === 'wind') {
    ctx.strokeStyle = '#b5d6e5';
    ctx.lineWidth = 5;
    for (const y of [-13, 0, 13]) {
      ctx.beginPath();
      ctx.moveTo(-23, y);
      ctx.bezierCurveTo(24, y - 15, 28, y + 18, 4, y + 9);
      ctx.stroke();
    }
  } else if (symbol === 'pond') {
    ctx.fillStyle = '#92bccf';
    ctx.beginPath();
    ctx.ellipse(0, 5, 25, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#d7eff0';
    for (const r of [10, 18]) {
      ctx.beginPath();
      ctx.ellipse(0, 5, r, r * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (symbol === 'drum') {
    box(-23, -12, 46, 35, '#d29883');
    ctx.fillStyle = '#ffe7c0';
    ctx.beginPath();
    ctx.ellipse(0, -12, 23, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-15, 1);
    ctx.lineTo(-5, 22);
    ctx.lineTo(5, 1);
    ctx.lineTo(15, 22);
    ctx.stroke();
  } else if (symbol === 'woodduck') {
    ctx.fillStyle = '#dcb377';
    ctx.beginPath();
    ctx.ellipse(-4, 8, 24, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    circle(12, -13, 14, '#e4bf80');
    box(22, -12, 12, 7, '#cf9268');
    circle(15, -17, 2, '#473b49');
    circle(-16, 25, 5, '#936e53');
    circle(12, 25, 5, '#936e53');
    ctx.beginPath();
    ctx.moveTo(-17, 7);
    ctx.lineTo(7, 7);
    ctx.moveTo(-19, 15);
    ctx.lineTo(7, 15);
    ctx.stroke();
  } else if (symbol === 'wheel' || symbol === 'ribbon') {
    ctx.save();
    ctx.rotate(now / 500);
    circle(0, 0, 22, '#656079');
    circle(0, 0, 17, '#c9dfdf');
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * 17, Math.sin(a) * 17);
      ctx.stroke();
    }
    circle(0, 0, 4, '#f4c482');
    ctx.restore();
  } else if (symbol === 'pumpkin') {
    ctx.fillStyle = '#eea268';
    ctx.beginPath();
    ctx.ellipse(0, -2, 23, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    box(-7, -11, 14, 22, '#ffe7ad');
    circle(-15, 18, 6, '#ceaa77');
    circle(15, 18, 6, '#ceaa77');
    ctx.strokeStyle = '#70956c';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.quadraticCurveTo(9, -33, 13, -23);
    ctx.stroke();
  } else if (symbol === 'barbell') {
    box(-20, -4, 40, 8, '#87ac82');
    box(-25, -15, 12, 30, '#9bc8b5');
    box(13, -15, 12, 30, '#9bc8b5');
  } else if (symbol === 'brick') {
    box(-22, 1, 24, 16, '#ec91ac');
    box(1, 1, 24, 16, '#f4b2c4');
    box(-12, -15, 25, 16, '#f9c0d2');
  } else if (symbol === 'basket') {
    ctx.beginPath();
    ctx.arc(0, -5, 15, Math.PI, Math.PI * 2);
    ctx.stroke();
    box(-23, -7, 46, 28, '#d6ad78');
    box(-25, -10, 50, 9, '#f2cac3');
    for (let i = -16; i < 20; i += 8) {
      ctx.beginPath();
      ctx.moveTo(i, 2);
      ctx.lineTo(i, 18);
      ctx.stroke();
    }
  } else if (symbol === 'wateringcan') {
    circle(16, 0, 11, '#bae0df');
    box(-18, -14, 30, 32, '#97ccdf');
    ctx.fillStyle = '#97ccdf';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-32, -15);
    ctx.lineTo(-34, -8);
    ctx.lineTo(-18, 13);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    box(-7, -21, 13, 7, '#bae0df');
  } else if (symbol === 'pillow') {
    box(-25, -17, 50, 34, '#d4c1e6');
    circle(0, 0, 13, '#fff2d6');
    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.lineTo(0, 0);
    ctx.lineTo(7, 3);
    ctx.stroke();
  } else {
    ctx.fillStyle = '#f1ce8a';
    ctx.beginPath();
    ctx.ellipse(0, 0, 21, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#b9deea';
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-8, -4);
    ctx.lineTo(5, -13);
    ctx.moveTo(-4, 3);
    ctx.lineTo(9, -6);
    ctx.stroke();
  }
  ctx.restore();
}

// alpha (0..1): how far the screen is between the previous rule step and the latest one.
export function paintGame(canvas, engine, stage, art, particles, now, alpha = 1) {
  const blend = (cur, prev) =>
    Number.isFinite(prev) && Math.abs(cur - prev) < 2 ? prev + (cur - prev) * alpha : cur;
  const width = Math.max(1, Math.round(canvas.clientWidth || 864)),
    height = Math.max(1, Math.round(canvas.clientHeight || 576));
  const dpr = Math.min(2, typeof devicePixelRatio === 'number' ? devicePixelRatio : 1);
  if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sx = width / WIDTH,
    sy = height / HEIGHT,
    u = Math.min(sx, sy),
    scale = { x: sx, y: sy };
  const dot = (x, y, r, fill, stroke = null) => {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = Math.max(1, u * 0.14);
      ctx.stroke();
    }
  };
  ctx.fillStyle = '#ceded4';
  ctx.fillRect(0, 0, width, height);
  if (art) {
    const img = art.image || art,
      f = art.frame || { x: 0, y: 0, width: 1, height: 1 },
      sw = img.width * f.width,
      sh = img.height * f.height,
      z = Math.min(width / sw, height / sh);
    ctx.fillStyle = '#ddd3bd';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(
      img,
      img.width * f.x,
      img.height * f.y,
      sw,
      sh,
      (width - sw * z) / 2,
      (height - sh * z) / 2,
      sw * z,
      sh * z,
    );
  }
  if (!engine.won) {
    ctx.fillStyle = 'rgba(9,15,29,.985)';
    ctx.beginPath();
    for (let y = 0; y < HEIGHT; y++) {
      let begin = -1;
      for (let x = 0; x <= WIDTH; x++) {
        if (x < WIDTH && !engine.cells[y * WIDTH + x]) {
          if (begin < 0) begin = x;
        } else if (begin >= 0) {
          ctx.rect(begin * sx, y * sy, (x - begin) * sx, sy + 0.3);
          begin = -1;
        }
      }
    }
    ctx.fill();
  }
  ctx.strokeStyle = '#fff9';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(1.5 * sx, 1.5 * sy, (WIDTH - 3) * sx, (HEIGHT - 3) * sy);
  if (stage.index === 1 && engine.progress < 0.015) {
    ctx.strokeStyle = '#ffedbba0';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 8]);
    ctx.beginPath();
    ctx.moveTo(12.5 * sx, 1.5 * sy);
    ctx.lineTo(12.5 * sx, (engine.clue.y + 4.5) * sy);
    ctx.lineTo((engine.clue.x + 5.5) * sx, (engine.clue.y + 4.5) * sy);
    ctx.lineTo((engine.clue.x + 5.5) * sx, 1.5 * sy);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(2 * sx, 2 * sy, (WIDTH - 4) * sx, (HEIGHT - 4) * sy);
  ctx.clip();
  for (const t of engine.telegraphs) {
    const spec = PATTERN_SPECS[t.type],
      range = spec?.speed && spec?.life ? spec.speed * spec.life : 100;
    const rays =
      t.rays ||
      (t.angles || [t.angle]).map(angle => ({
        angle,
        length: Math.min(t.type === 'dash' ? 12 : range, engine.rayLength(t.x, t.y, angle)),
      }));
    for (const ray of rays) {
      const live = { ...t, ...ray, length: Math.min(ray.length, engine.rayLength(t.x, t.y, ray.angle)) };
      dangerRay(
        ctx,
        {
          ...live,
          rounded: t.type !== 'beam',
          width: t.hitWidth || (t.type === 'beam' ? 2.05 : t.type === 'dash' ? 2.4 : 1.3),
        },
        '#ffcf6d25',
        scale,
      );
      strokeRay(ctx, { ...live, width: 0.16 }, '#ffde9bd9', true, scale);
    }
    if (Number.isFinite(t.gapAngle)) {
      ctx.strokeStyle = '#9fe8cacc';
      ctx.lineWidth = u * 0.35;
      ctx.beginPath();
      ctx.ellipse(
        t.x * sx,
        t.y * sy,
        3 * sx,
        3 * sy,
        0,
        t.gapAngle - t.gapWidth / 2,
        t.gapAngle + t.gapWidth / 2,
      );
      ctx.stroke();
      strokeRay(
        ctx,
        {
          ...t,
          angle: t.gapAngle,
          length: Math.min(10, engine.rayLength(t.x, t.y, t.gapAngle)),
          width: 0.35,
        },
        '#a3ebd4a0',
        true,
        scale,
      );
    }
  }
  for (const beam of engine.beams) {
    dangerRay(ctx, { ...beam, width: beam.width + 0.8 }, '#f9bdc344', scale);
    dangerRay(ctx, beam, '#edb7ddd9', scale);
    strokeRay(ctx, { ...beam, width: 0.23 }, '#fff5db', false, scale);
  }
  ctx.restore();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (const p of engine.pickups) {
    const x = (p.x + 0.5) * sx,
      y = (p.y + 0.5) * sy;
    dot(x, y, u * (0.9 + 0.1 * Math.sin(now / 300 + p.x)), '#ffeb9e');
    ctx.fillStyle = '#a6782f';
    ctx.font = `${Math.max(10, u * 1.35)}px sans-serif`;
    ctx.fillText('✦', x, y);
  }
  if (engine.clue) {
    const c = engine.clue,
      cx = (c.x + 0.5) * sx,
      cy = (c.y + 0.5) * sy;
    dot(cx, cy, u * 1.5, engine.clueFound ? '#b9e3bc' : '#1c3542', '#b6e6d7');
    ctx.fillStyle = engine.clueFound ? '#305c3e' : '#d5f6e9';
    ctx.font = `bold ${Math.max(13, u * 1.6)}px sans-serif`;
    ctx.fillText(engine.clueFound ? '✓' : '?', cx, cy);
  }
  const current = engine.visualPlayer || engine.player,
    prev = engine.prevVisual,
    visual = { x: blend(current.x, prev?.x), y: blend(current.y, prev?.y) },
    px = (visual.x + 0.5) * sx,
    py = (visual.y + 0.5) * sy;
  if (engine.trail.length || engine.isExposed?.()) {
    // Bright while Space is held; a paler dashed line means "stopped, you can only walk back".
    ctx.strokeStyle = engine.drawHeld ? '#ffe994' : '#e9dcb7';
    ctx.lineWidth = Math.max(2, u * (engine.drawHeld ? 0.4 : 0.3));
    ctx.setLineDash(engine.drawHeld ? [] : [u * 0.5, u * 0.35]);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo((engine.anchor.x + 0.5) * sx, (engine.anchor.y + 0.5) * sy);
    // While stepping back along the line, the last cell is already being rewound.
    const cells = engine.glide?.reverse ? engine.trail.slice(0, -1) : engine.trail;
    for (const p of cells) ctx.lineTo((p.x + 0.5) * sx, (p.y + 0.5) * sy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  for (const e of engine.enemies) {
    const x = blend(e.x, engine.prevPos?.get(e)?.x) * sx,
      y = blend(e.y, engine.prevPos?.get(e)?.y) * sy;
    if (e.boss) {
      dot(x, y, u * 2.7, engine.freeze > 0 ? '#a5dbe655' : '#fff0e533');
      bossIcon(ctx, stage.boss.symbol, x, y, u * 2.25, now);
    } else {
      const warming = e.intent?.phase === 'warmup',
        rushing = e.intent?.phase === 'rush',
        red = rushing || (warming && Math.sin(now / 70) > 0),
        color = engine.freeze > 0 ? '#a5dbe6' : red ? '#f16364' : '#b2cfda';
      if (rushing) {
        const speed = Math.hypot(e.vx, e.vy) || 1;
        for (let k = 1; k <= 3; k++)
          dot(
            x - (e.vx / speed) * u * k * 0.7,
            y - (e.vy / speed) * u * k * 0.7,
            u * (0.65 - k * 0.12),
            '#ee656530',
          );
      }
      dot(x, y, u * 0.95, color, '#fff9');
      ctx.fillStyle = '#482f3b';
      ctx.font = `bold ${Math.max(10, u * 1.2)}px sans-serif`;
      ctx.fillText(red ? '!' : '•', x, y);
      if (warming) {
        ctx.strokeStyle = '#ffb9a3';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, u * 1.35, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }
  for (const b of engine.bullets) {
    const x = blend(b.x, engine.prevPos?.get(b)?.x) * sx,
      y = blend(b.y, engine.prevPos?.get(b)?.y) * sy;
    dot(x, y, u * 0.5, b.kind === 'ring' ? '#f4d398' : b.kind === 'aimed' ? '#d7b2eb' : '#a9dbe8', '#fff');
    dot(x - u * 0.12, y - u * 0.14, u * 0.13, '#fffd');
  }
  for (const p of particles) {
    ctx.globalAlpha = p.life / p.max;
    dot((p.x / 12) * sx, (p.y / 12) * sy, u * 0.25, p.color);
  }
  ctx.globalAlpha = 1;
  if (engine.shield > 0 || engine.grace > 0) {
    ctx.strokeStyle = engine.shield ? '#9ce6d8' : '#fff7b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, u * 1.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  rabbit(ctx, px, py, Math.max(3, u * 0.85), engine.drawHeld, {
    facing: engine.facing || 1,
    hop: engine.glide ? engine.glide.t : 0,
    lean: engine.drawHeld ? 1 : 0,
  });
  return visual;
}
