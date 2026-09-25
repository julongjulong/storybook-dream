// Original music for 뒤죽박죽 꿈동화. No recordings or external assets are used.
// Durations are measured in beats; each phrase is one four-beat bar.
const MELODIES = {
  dream: [
    [
      ['E4', 1],
      ['G4', 1],
      ['A4', 1.5],
      ['G4', 0.5],
    ],
    [
      ['D4', 1],
      ['E4', 1],
      ['G4', 2],
    ],
    [
      ['A4', 1],
      ['C5', 1],
      ['B4', 1],
      ['G4', 1],
    ],
    [
      ['E4', 1.5],
      ['D4', 0.5],
      ['C4', 2],
    ],
    [
      ['E4', 1],
      ['G4', 0.5],
      ['A4', 0.5],
      ['C5', 2],
    ],
    [
      ['B4', 1],
      ['G4', 1],
      ['E4', 2],
    ],
    [
      ['F4', 1],
      ['A4', 1],
      ['G4', 1],
      ['D4', 1],
    ],
    [
      ['E4', 1],
      ['D4', 1],
      ['C4', 1.5],
      [null, 0.5],
    ],
  ],
  play: [
    [
      ['G4', 0.5],
      ['E4', 0.5],
      ['C4', 1],
      ['E4', 0.5],
      ['G4', 0.5],
      ['A4', 1],
    ],
    [
      ['A4', 0.5],
      ['F4', 0.5],
      ['D4', 1],
      ['F4', 0.5],
      ['E4', 0.5],
      ['D4', 1],
    ],
    [
      ['E4', 0.5],
      ['G4', 0.5],
      ['C5', 1],
      ['B4', 0.5],
      ['G4', 0.5],
      ['E4', 1],
    ],
    [
      ['D4', 0.5],
      ['G4', 0.5],
      ['B4', 0.5],
      ['A4', 0.5],
      ['G4', 1],
      [null, 1],
    ],
    [
      ['G4', 0.5],
      ['E4', 0.5],
      ['C5', 1],
      ['A4', 0.5],
      ['G4', 0.5],
      ['E4', 1],
    ],
    [
      ['F4', 0.5],
      ['A4', 0.5],
      ['C5', 1],
      ['A4', 0.5],
      ['F4', 0.5],
      ['D4', 1],
    ],
    [
      ['E4', 0.5],
      ['G4', 0.5],
      ['A4', 1],
      ['G4', 0.5],
      ['E4', 0.5],
      ['D4', 1],
    ],
    [
      ['B3', 0.5],
      ['D4', 0.5],
      ['G4', 1],
      ['C4', 1.5],
      [null, 0.5],
    ],
  ],
  celebrate: [
    [
      ['C4', 0.5],
      ['E4', 0.5],
      ['G4', 1],
      ['C5', 2],
    ],
    [
      ['A4', 1],
      ['G4', 1],
      ['E4', 2],
    ],
    [
      ['F4', 0.5],
      ['A4', 0.5],
      ['C5', 1],
      ['D5', 1],
      ['C5', 1],
    ],
    [
      ['B4', 1],
      ['G4', 1],
      ['D4', 1.5],
      [null, 0.5],
    ],
    [
      ['E4', 0.5],
      ['G4', 0.5],
      ['C5', 1],
      ['E5', 1],
      ['D5', 1],
    ],
    [
      ['C5', 1],
      ['A4', 1],
      ['F4', 2],
    ],
    [
      ['E4', 1],
      ['G4', 1],
      ['D4', 1],
      ['B3', 1],
    ],
    [
      ['C4', 1],
      ['E4', 1],
      ['C5', 1.5],
      [null, 0.5],
    ],
  ],
  boss: [
    [
      ['E4', 0.5],
      ['A4', 0.5],
      ['C5', 0.5],
      ['B4', 0.5],
      ['A4', 1],
      ['E4', 0.5],
      [null, 0.5],
    ],
    [
      ['F4', 0.5],
      ['A4', 0.5],
      ['C5', 1],
      ['A4', 0.5],
      ['G4', 0.5],
      ['F4', 1],
    ],
    [
      ['D4', 0.5],
      ['G4', 0.5],
      ['B4', 0.5],
      ['A4', 0.5],
      ['G4', 1],
      ['D5', 1],
    ],
    [
      ['C5', 1],
      ['G4', 0.5],
      ['E4', 0.5],
      ['G4', 1],
      [null, 1],
    ],
    [
      ['A4', 0.5],
      ['C5', 0.5],
      ['E5', 1],
      ['D5', 0.5],
      ['C5', 0.5],
      ['A4', 1],
    ],
    [
      ['D5', 0.5],
      ['C5', 0.5],
      ['A4', 1],
      ['F4', 0.5],
      ['A4', 0.5],
      ['C5', 1],
    ],
    [
      ['B4', 0.5],
      ['D5', 0.5],
      ['G4', 1],
      ['A4', 0.5],
      ['B4', 0.5],
      ['D5', 1],
    ],
    [
      ['C5', 1],
      ['G4', 0.5],
      ['E4', 0.5],
      ['C4', 1.5],
      [null, 0.5],
    ],
  ],
  morning: [
    [
      ['E4', 1.5],
      ['G4', 0.5],
      ['C5', 2],
    ],
    [
      ['B4', 1],
      ['G4', 1],
      ['E4', 1.5],
      [null, 0.5],
    ],
    [
      ['A4', 1],
      ['G4', 1],
      ['F4', 2],
    ],
    [
      ['E4', 1.5],
      ['D4', 0.5],
      ['C4', 2],
    ],
    [
      ['F4', 1],
      ['A4', 1],
      ['C5', 2],
    ],
    [
      ['B4', 1],
      ['G4', 1],
      ['D4', 1.5],
      [null, 0.5],
    ],
    [
      ['E4', 1],
      ['G4', 1],
      ['C5', 1],
      ['G4', 1],
    ],
    [
      ['E4', 1],
      ['C4', 2],
      [null, 1],
    ],
  ],
};

const HARMONY = {
  dream: [
    ['C3', 'E3', 'G3'],
    ['C3', 'E3', 'G3'],
    ['A2', 'C3', 'E3'],
    ['C3', 'E3', 'G3'],
    ['F2', 'A3', 'C4'],
    ['A2', 'C3', 'E3'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
  ],
  play: [
    ['C3', 'E3', 'G3'],
    ['D3', 'F3', 'A3'],
    ['A2', 'C3', 'E3'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
    ['F2', 'A3', 'C4'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
  ],
  celebrate: [
    ['C3', 'E3', 'G3'],
    ['A2', 'C3', 'E3'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
  ],
  boss: [
    ['A2', 'C3', 'E3'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
    ['A2', 'C3', 'E3'],
    ['D3', 'F3', 'A3'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
  ],
  morning: [
    ['C3', 'E3', 'G3'],
    ['A2', 'C3', 'E3'],
    ['F2', 'A3', 'C4'],
    ['C3', 'E3', 'G3'],
    ['F2', 'A3', 'C4'],
    ['G2', 'B3', 'D4'],
    ['C3', 'E3', 'G3'],
    ['C3', 'E3', 'G3'],
  ],
};

export const MUSIC_INFO = Object.freeze({
  dream: { title: '책갈피 속 달빛', bpm: 72, beats: 32, seconds: 80 / 3 },
  play: { title: '통통, 이야기 한 조각', bpm: 96, beats: 32, seconds: 20 },
  celebrate: { title: '우리 손으로 되찾은 아침', bpm: 80, beats: 32, seconds: 24 },
  boss: { title: '꼬인 책갈피의 작은 모험', bpm: 100, beats: 32, seconds: 19.2 },
  morning: { title: '햇살이 책장을 넘기면', bpm: 64, beats: 32, seconds: 30 },
});

function frequency(note) {
  const match = /^([A-G])([#b]?)(\d)$/.exec(note);
  if (!match) return 0;
  const semitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1]];
  const accidental = match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0;
  return 440 * 2 ** (((Number(match[3]) + 1) * 12 + semitone + accidental - 69) / 12);
}

function makeScore(scene) {
  const events = [];
  MELODIES[scene].forEach((bar, index) => {
    let beat = index * 4;
    for (const [note, duration] of bar) {
      if (note) events.push({ beat, note, duration: duration * 0.86, kind: 'melody' });
      beat += duration;
    }
    const chord = HARMONY[scene][index];
    events.push({ beat: index * 4, note: chord[0], duration: 2.7, kind: 'bass' });
    if (scene === 'boss') {
      for (const offset of [0.5, 1.5, 2.5, 3.5]) {
        events.push({
          beat: index * 4 + offset,
          note: chord[1 + (Math.floor(offset) % 2)],
          duration: 0.36,
          kind: 'harmony',
        });
      }
      // Quiet, pitched pulses add movement at higher boss phases without a siren.
      for (const offset of [0, 1, 2, 3])
        events.push({ beat: index * 4 + offset, note: chord[0], duration: 0.3, kind: 'pulse' });
    } else if (scene === 'play') {
      for (const offset of [1, 3]) {
        for (const note of chord.slice(1))
          events.push({ beat: index * 4 + offset, note, duration: 0.7, kind: 'harmony' });
      }
    } else {
      chord
        .slice(1)
        .forEach((note, n) =>
          events.push({ beat: index * 4 + 0.12 * n, note, duration: 3.3, kind: 'harmony' }),
        );
    }
  });
  return events.sort((a, b) => a.beat - b.beat);
}

const SCORES = Object.fromEntries(Object.keys(MUSIC_INFO).map(scene => [scene, makeScore(scene)]));

export class AudioDirector {
  constructor() {
    this.context = null;
    this.master = null;
    this.muted = false;
    this.volume = 0.45;
    this.intensity = 0;
    this.scene = null;
    this.paused = false;
    this.destroyed = false;
    this.timer = null;
    this.voices = new Set();
    this.index = 0;
    this.loopStart = 0;
    this.lastEffect = new Map();
    this.hidden = typeof document !== 'undefined' && document.hidden;
    this.visibilityHandler = () => {
      this.hidden = document.hidden;
      if (this.hidden) {
        this._silence();
        this.context?.suspend().catch(() => {});
      } else if (!this.paused) {
        this.resume();
      }
    };
    if (typeof document !== 'undefined')
      document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  // Only invoke from a user gesture. Other methods never create a context.
  async unlock() {
    if (this.destroyed) return false;
    try {
      if (!this.context) {
        const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Context) return false;
        this.context = new Context();
        this.master = this.context.createGain();
        this.master.gain.value = this.muted ? 0 : this.volume;
        this.master.connect(this.context.destination);
      }
      if (this.context.state !== 'running') await this.context.resume();
      if (!this.paused && !this.hidden) this._start();
      return this.context.state === 'running';
    } catch {
      return false;
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    this._updateGain();
  }

  setVolume(volume) {
    if (Number.isFinite(volume)) this.volume = Math.min(1, Math.max(0, volume));
    this._updateGain();
  }

  // Applies to newly scheduled boss pulses only; it never restarts the loop or
  // alters tempo/master volume. Safe to call on every game-state update.
  setIntensity(value) {
    if (Number.isFinite(value)) this.intensity = Math.min(1, Math.max(0, value));
  }

  _updateGain() {
    if (!this.master || this.context.state === 'closed') return;
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, now, 0.025);
  }

  play(scene) {
    if (this.destroyed || !SCORES[scene]) return;
    if (this.scene === scene && this.timer !== null) return;
    this._silence();
    this.scene = scene;
    if (!this.paused && !this.hidden) this._start();
  }

  _start() {
    if (
      this.destroyed ||
      this.timer !== null ||
      !this.scene ||
      !this.context ||
      this.context.state !== 'running' ||
      this.paused ||
      this.hidden
    )
      return;
    this.index = 0;
    this.loopStart = this.context.currentTime + 0.04;
    this._schedule();
    this.timer = setInterval(() => this._schedule(), 50);
  }

  _schedule() {
    if (!this.context || !this.scene || this.context.state !== 'running') return;
    const beatSeconds = 60 / MUSIC_INFO[this.scene].bpm;
    const score = SCORES[this.scene];
    const now = this.context.currentTime;
    // Restart after throttling instead of playing a backlog of old notes.
    if (this.loopStart + score[this.index].beat * beatSeconds < now - 0.4) {
      this.index = 0;
      this.loopStart = now + 0.04;
    }
    while (this.loopStart + score[this.index].beat * beatSeconds < now + 0.18) {
      const event = score[this.index];
      this._note(
        event.note,
        this.loopStart + event.beat * beatSeconds,
        event.duration * beatSeconds,
        event.kind,
      );
      this.index += 1;
      if (this.index === score.length) {
        this.index = 0;
        this.loopStart += MUSIC_INFO[this.scene].beats * beatSeconds;
      }
    }
  }

  _note(note, at, duration, kind = 'effect', strength = 1, pitch = 0) {
    if (!this.context || !this.master || this.context.state !== 'running' || this.voices.size >= 48) return;
    const ctx = this.context;
    const start = Math.max(ctx.currentTime, at);
    const end = start + Math.max(0.08, duration);
    const gain = ctx.createGain();
    const osc = ctx.createOscillator();
    const isPlay = this.scene === 'play' || this.scene === 'boss';
    const baseLevel =
      kind === 'bass'
        ? 0.07
        : kind === 'harmony'
          ? 0.026
          : kind === 'pulse'
            ? 0.006 + this.intensity * 0.024
            : kind === 'effect'
              ? 0.09
              : 0.105;
    const sceneLevel =
      kind === 'effect' ? 1 : this.scene === 'morning' ? 0.78 : this.scene === 'boss' ? 0.9 : 1;
    const level = baseLevel * sceneLevel * strength;
    const attack = kind === 'harmony' ? 0.07 : kind === 'bass' ? 0.03 : 0.014;
    // Sine timbre is soft, with no sharp sawtooth harmonics or percussion noise.
    osc.type = 'sine';
    osc.frequency.value = frequency(note) * 2 ** (pitch / 12);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(level, start + attack);
    if (isPlay && kind === 'melody') {
      gain.gain.exponentialRampToValueAtTime(0.016, start + duration * 0.7);
    } else {
      gain.gain.linearRampToValueAtTime(level * 0.65, Math.max(start + attack, end - 0.09));
    }
    gain.gain.linearRampToValueAtTime(0, end);
    osc.connect(gain);
    gain.connect(this.master);
    const voice = { osc, gain };
    this.voices.add(voice);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
      this.voices.delete(voice);
    };
    osc.start(start);
    osc.stop(end + 0.025);
  }

  // pitch: semitones up, so bigger captures can sound brighter.
  effect(name, { pitch = 0 } = {}) {
    if (
      this.destroyed ||
      this.muted ||
      this.paused ||
      this.hidden ||
      !this.context ||
      this.context.state !== 'running'
    )
      return;
    const motifs = {
      capture: ['C5', 'E5'],
      pickup: ['E4', 'G4', 'C5'],
      hit: ['G3', 'E3'],
      ability: ['C4', 'G4', 'A4', 'C5'],
      win: ['C4', 'E4', 'G4', 'C5', 'E5', 'C5'],
      warning: ['G4', 'G4'],
      dash: ['E4', 'G4', 'C5'],
      beam: ['C4', 'D4', 'E4', 'G4'],
      page: ['E4', 'C4'],
      'draw-on': ['G4', 'D5'],
      'draw-off': ['D5', 'G4'],
      'capture-big': ['C5', 'E5', 'G5', 'C6'],
      clue: ['G4', 'C5', 'E5', 'G5', 'E5', 'G5', 'C6'],
      catch: ['E5', 'C5', 'G5'],
    };
    if (!motifs[name]) return;
    const now = this.context.currentTime;
    // Repeated collisions or repeated captures cannot produce a loud sound stack.
    if (now - (this.lastEffect.get(name) ?? -Infinity) < (name === 'warning' ? 0.7 : 0.25)) return;
    this.lastEffect.set(name, now);
    const short = name.startsWith('draw-');
    const interval =
      name === 'warning' ? 0.19 : name === 'dash' ? 0.07 : name === 'page' || short ? 0.06 : 0.105;
    const duration = name === 'win' || name === 'clue' ? 0.32 : name === 'page' ? 0.12 : short ? 0.09 : 0.2;
    const strength = short ? 0.45 : ['warning', 'dash', 'beam', 'page'].includes(name) ? 0.72 : 1;
    motifs[name].forEach((note, i) =>
      this._note(note, now + i * interval, duration, 'effect', strength, pitch),
    );
  }

  _silence() {
    if (this.timer !== null) clearInterval(this.timer);
    this.timer = null;
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const voice of this.voices) {
      try {
        if (voice.gain.gain.cancelAndHoldAtTime) {
          voice.gain.gain.cancelAndHoldAtTime(now);
        } else {
          const value = voice.gain.gain.value;
          voice.gain.gain.cancelScheduledValues(now);
          voice.gain.gain.setValueAtTime(value, now);
        }
        voice.gain.gain.linearRampToValueAtTime(0, now + 0.008);
        voice.osc.stop(now + 0.012);
      } catch {
        /* A voice may already have ended. */
      }
    }
    this.voices.clear();
  }

  pause() {
    this.paused = true;
    this._silence();
    this.context?.suspend().catch(() => {});
  }

  async resume() {
    if (this.destroyed) return;
    this.paused = false;
    if (this.hidden || !this.context) return;
    try {
      if (this.context.state !== 'running') await this.context.resume();
      if (!this.paused && !this.hidden && !this.destroyed) this._start();
    } catch {
      /* Browser may require a fresh user gesture. */
    }
  }

  stop() {
    this._silence();
    this.scene = null;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    if (typeof document !== 'undefined')
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.context?.close().catch(() => {});
    this.context = null;
    this.master = null;
  }
}
