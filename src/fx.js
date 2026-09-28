import { WIDTH, HEIGHT } from './engine.js';

// Game-feel effects: they react to engine events and run on real time, never on rule time,
// so a hit-stop or slow motion here can pause the rules without the effects freezing too.
// All positions are in board cells.
const REVEAL_SPREAD = 0.35, // seconds for a capture to wash from the line to its far edge
  REVEAL_FADE = 0.15; // seconds each cell takes to lose its fog
const BIG_CAPTURE = 0.1; // share of the board that counts as a big capture

export class Effects {
  constructor(audio) {
    this.audio = audio;
    this.reset();
  }
  reset() {
    this.clock = 0;
    this.revealAt = new Float32Array(WIDTH * HEIGHT).fill(-1);
    this.revealUntil = 0;
    this.rewind = null;
    this.popups = [];
    this.sparks = [];
    this.shake = 0;
    this.hitstop = 0;
    this.slowmo = 0;
    this.zoom = null;
    this.heartBump = 0;
  }
  // Multiplier for rule time: 0 during a hit-stop, slow while a clue is revealed.
  get timeScale() {
    return this.hitstop > 0 ? 0 : this.slowmo > 0 ? 0.3 : 1;
  }
  get revealing() {
    return this.clock < this.revealUntil;
  }
  // Extra fog (0..1) still covering a newly captured cell.
  fogOf(i) {
    const at = this.revealAt[i];
    if (at < 0) return 0;
    return 1 - Math.min(1, Math.max(0, (this.clock - at) / REVEAL_FADE));
  }

  onEvent(event, engine) {
    const sfx = (name, options) => this.audio?.effect(name, options);
    if (event.type === 'capture') {
      this.startReveal(event.line || [], event.claimed || []);
      const gain = event.gain || 0,
        centre = centroid(event.claimed || []);
      if (gain > 0.001 && centre)
        this.popup(`+${Math.max(1, Math.round(gain * 100))}%`, centre.x, centre.y, 1 + gain * 4);
      if (gain >= BIG_CAPTURE) {
        sfx('capture-big');
        this.shake = Math.max(this.shake, 0.35);
        if (centre) {
          this.popup('와!', centre.x, centre.y - 4.5, 2.2, '#fff3b0');
          this.zoom = { x: centre.x, y: centre.y, amount: 0.05, life: 0.45, max: 0.45 };
        }
      } else sfx('capture', { pitch: Math.min(7, Math.round(gain * 60)) });
      for (const p of event.line || [])
        if (Math.random() < 0.35) this.burst(p.x + 0.5, p.y + 0.5, 2, '#ffe994', 3);
      for (const e of event.caughtPositions || []) {
        this.burst(e.x, e.y, e.boss ? 24 : 12, e.boss ? '#ffe595' : '#c3eac7', e.boss ? 9 : 6);
        if (e.boss) this.popup('잡았다!', e.x, e.y - 2, 2, '#ffe595');
      }
      if (event.caught) sfx('catch');
    } else if (event.type === 'hit') {
      this.hitstop = 0.12;
      this.shake = Math.max(this.shake, 0.28);
      this.heartBump = 0.5;
      if (event.line?.length > 1) this.rewind = { line: event.line, life: 0.4, max: 0.4 };
      const head = event.line?.at(-1);
      if (head) {
        this.burst(head.x + 0.5, head.y + 0.5, 10, '#ff9d9d', 5);
        const why = {
          boss: '보스가 선에 닿았어요!',
          minion: '꼬마가 선에 닿았어요!',
          shot: '방울이 선에 닿았어요!',
          crumb: '빵가루를 밟았어요!',
          beam: '빛줄기에 닿았어요!',
          fuse: '불씨가 따라왔어요!',
        }[event.by];
        if (why) this.popup(why, head.x + 0.5, head.y - 1.5, 1.3, '#ffc2c2', 1.6);
      }
    } else if (event.type === 'block') {
      this.hitstop = 0.06;
      const v = engine?.visualPlayer;
      if (v) this.burst(v.x + 0.5, v.y + 0.5, 10, '#9ce6d8', 5);
    } else if (event.type === 'clue') {
      const c = event.clue;
      this.slowmo = 0.7;
      this.zoom = { x: c.x + 0.5, y: c.y + 0.5, amount: 0.16, life: 1.1, max: 1.1 };
      this.popup(`${c.name} 발견!`, c.x + 0.5, c.y - 1.5, 2.4, '#d6ffe9', 2.2);
      this.burst(c.x + 0.5, c.y + 0.5, 28, '#b6f0d0', 8);
      sfx('clue');
    } else if (event.type === 'phase2') {
      const b = engine?.enemies.find(e => e.boss);
      this.shake = Math.max(this.shake, 0.3);
      sfx('warning');
      if (b) {
        this.popup('신났다!', b.x, b.y - 3, 1.8, '#ffb4a8');
        this.burst(b.x, b.y, 18, '#ffb4a8', 6);
      }
    } else if (event.type === 'fuse') {
      sfx('warning');
      const a = engine?.anchor;
      if (a) this.burst(a.x + 0.5, a.y + 0.5, 8, '#ffb070', 4);
    } else if (event.type === 'sticker') {
      const k = event.sticker;
      this.popup(`${k.icon} 스티커!`, k.x + 0.5, k.y - 1, 1.6, '#fff1b8', 1.6);
      this.burst(k.x + 0.5, k.y + 0.5, 16, '#fff1b8', 6);
      sfx('pickup', { pitch: 5 });
    } else if (event.type === 'daylight') {
      this.shake = Math.max(this.shake, 0.25);
      this.popup(
        event.phase === 'noon' ? '☀ 정오!' : '🌙 밤!',
        36,
        20,
        2.4,
        event.phase === 'noon' ? '#ffe9a0' : '#c9d4ff',
        1.8,
      );
      if (event.spawned) this.burst(event.spawned.x, event.spawned.y, 14, '#ffd0d0', 5);
      sfx('warning');
    } else if (event.type === 'heartpiece') {
      const at = event.at;
      if (at) this.popup('하트 조각!', at.x, at.y - 1.5, 1.4, '#ffb3c1', 1.4);
      sfx('pickup', { pitch: 3 });
    } else if (event.type === 'heal') {
      this.heartBump = 0.5;
      const v = engine?.visualPlayer;
      if (v) this.popup('♥ +1', v.x + 0.5, v.y - 1.5, 1.6, '#ff8fa3', 1.4);
      sfx('clue');
    } else if (event.type === 'pickup') {
      const p = engine?.player;
      if (p) {
        this.burst(p.x + 0.5, p.y + 0.5, 10, '#ffe38e', 4);
        this.popup('빨라졌어요!', p.x + 0.5, p.y - 1, 1.2, '#ffe38e');
      }
    } else if (event.type === 'ability') {
      const v = engine?.visualPlayer;
      if (v) this.burst(v.x + 0.5, v.y + 0.5, 16, '#cfe8ff', 7);
      for (const e of event.caughtPositions || []) this.burst(e.x, e.y, 8, '#c3eac7', 5);
    }
  }

  // Fog lifts outward from the closed line, cell by cell, like ink washing away.
  startReveal(line, claimed) {
    if (!claimed.length) return;
    const inSet = new Uint8Array(WIDTH * HEIGHT),
      dist = new Int32Array(WIDTH * HEIGHT).fill(-1),
      queue = [];
    for (const i of claimed) inSet[i] = 1;
    for (const p of line) {
      const i = p.y * WIDTH + p.x;
      if (inSet[i] && dist[i] < 0) {
        dist[i] = 0;
        queue.push(i);
      }
    }
    if (!queue.length) {
      dist[claimed[0]] = 0;
      queue.push(claimed[0]);
    }
    let far = 0;
    for (let q = 0; q < queue.length; q++) {
      const at = queue[q],
        x = at % WIDTH;
      for (const next of [x > 0 ? at - 1 : -1, x < WIDTH - 1 ? at + 1 : -1, at - WIDTH, at + WIDTH])
        if (next >= 0 && next < inSet.length && inSet[next] && dist[next] < 0) {
          dist[next] = dist[at] + 1;
          far = Math.max(far, dist[next]);
          queue.push(next);
        }
    }
    const perStep = Math.min(0.03, REVEAL_SPREAD / Math.max(1, far));
    for (const i of claimed) {
      const d = dist[i] < 0 ? far : dist[i];
      this.revealAt[i] = this.clock + d * perStep;
    }
    this.revealUntil = Math.max(this.revealUntil, this.clock + far * perStep + REVEAL_FADE);
  }

  popup(text, x, y, size = 1, color = '#ffffff', life = 1.1) {
    this.popups.push({ text, x, y, size, color, life, max: life });
  }
  burst(x, y, count, color, speed) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + Math.random() * 0.4,
        v = speed * (0.6 + Math.random() * 0.6);
      this.sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0.9, max: 0.9, color });
    }
  }

  update(dt) {
    this.clock += dt;
    if (!this.revealing && this.revealUntil) {
      this.revealAt.fill(-1);
      this.revealUntil = 0;
    }
    for (const key of ['shake', 'hitstop', 'slowmo', 'heartBump']) this[key] = Math.max(0, this[key] - dt);
    if (this.rewind && (this.rewind.life -= dt) <= 0) this.rewind = null;
    if (this.zoom && (this.zoom.life -= dt) <= 0) this.zoom = null;
    this.popups = this.popups.filter(p => ((p.y -= dt * 1.6), (p.life -= dt) > 0));
    this.sparks = this.sparks.filter(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vx *= 1 - dt * 2.5;
      p.vy *= 1 - dt * 2.5;
      return (p.life -= dt) > 0;
    });
  }

  // Camera: a small shake and a gentle zoom toward the moment that matters.
  camera(width, height, sx, sy) {
    let x = 0,
      y = 0,
      scale = 1,
      cx = width / 2,
      cy = height / 2;
    if (this.shake > 0) {
      const k = this.shake * 18;
      x = (Math.random() - 0.5) * k;
      y = (Math.random() - 0.5) * k;
    }
    if (this.zoom) {
      const t = this.zoom.life / this.zoom.max;
      scale = 1 + this.zoom.amount * Math.sin(t * Math.PI);
      cx = this.zoom.x * sx;
      cy = this.zoom.y * sy;
    }
    return { x, y, scale, cx, cy };
  }
}

function centroid(indices) {
  if (!indices.length) return null;
  let x = 0,
    y = 0;
  for (const i of indices) {
    x += (i % WIDTH) + 0.5;
    y += Math.floor(i / WIDTH) + 0.5;
  }
  return { x: x / indices.length, y: y / indices.length };
}
