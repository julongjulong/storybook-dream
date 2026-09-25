import { STORY } from './story-data.js';

// Vite copies each JPEG next to the build and hands back its URL.
const files = import.meta.glob('../assets/detective/*.jpg', { eager: true, query: '?url', import: 'default' });
const url = id => files[`../assets/detective/${id}.jpg`] || '';

// Six-panel case sheets, keyed by case id. Each case sheet holds every panel of that case.
export const ART = Object.fromEntries(STORY.worlds.map(w => [w.id, url(w.id)]));

// Story pages point at their case sheet; family scenes have their own paintings.
export const STORY_ART = { 'opening-bedroom': url('opening-bedroom'), 'ending-morning': url('ending-morning') };
STORY_ART['opening-dream'] = ART.race;
for (const w of STORY.worlds) for (const page of [...w.intro, ...w.win]) STORY_ART[page.artId] = ART[w.id];
