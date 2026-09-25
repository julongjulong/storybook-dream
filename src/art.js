import { STORY } from './story-data.js';

// Vite copies each picture next to the build and hands back its URL.
const files = import.meta.glob('../assets/detective/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
});
const url = id => files[`../assets/detective/${id}.jpg`] || '';

// v5 pictures made from docs/art-prompts-v5.md. Any that exist are used; the rest fall back.
const v5Files = import.meta.glob('../assets/v5/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const v5 = path => {
  const key = Object.keys(v5Files).find(k => k.replace(/\.[a-z]+$/, '').endsWith(`/v5/${path}`));
  return key ? v5Files[key] : '';
};

// Six-panel case sheets, keyed by case id. Each case sheet holds every panel of that case.
export const ART = Object.fromEntries(STORY.worlds.map(w => [w.id, url(w.id)]));

// Full-size play boards (one picture each, no panel cropping) when a v5 board exists.
export const BOARDS = Object.fromEntries(
  [
    ...STORY.worlds.map(w => [w.id, v5(`boards/${w.id}`)]),
    [STORY.finale.id, v5('story/ttorong-final-3')],
  ].filter(([, src]) => src),
);

// Story pages point at their case sheet; family scenes have their own paintings.
export const STORY_ART = {
  'opening-bedroom': url('opening-bedroom'),
  'ending-morning': v5('story/ending-morning-v5') || url('ending-morning'),
};
STORY_ART['opening-dream'] = ART.race;
for (const w of STORY.worlds) for (const page of [...w.intro, ...w.win]) STORY_ART[page.artId] = ART[w.id];
// 또롱 pictures: only listed once drawn, so pages can fall back to an existing picture.
for (const name of ['feather', 'sighting', 'map', 'watch']) {
  const src = v5(`story/ttorong-clue-${name}`);
  if (src) STORY_ART[`ttorong-clue-${name}`] = src;
}
for (let i = 0; i < 6; i++) {
  const src = v5(`story/ttorong-final-${i}`);
  if (src) STORY_ART[`ttorong-final-${i}`] = src;
}
