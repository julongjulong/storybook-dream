import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { ART, FAMILY_ART } from '../src/assets.js';
import { STORY_ART } from '../src/story-art.js';
import { STORY } from '../src/story-data.js';
import { artFrame } from '../src/art-layout.js';
import { SHEET_FRAMES } from '../src/sheet-frames.js';
import { jpegSize } from './jpeg-size.mjs';
const html = await readFile(new URL('../output/storybook-dream.html', import.meta.url), 'utf8');
assert.equal(STORY.worlds.length, 12);
assert.equal(Object.keys(ART).length, 12);
assert.equal(Object.keys(FAMILY_ART).length, 2);
for (const uri of [...Object.values(ART), ...Object.values(FAMILY_ART)]) {
  assert.ok(uri.startsWith('data:image/jpeg;base64,'));
  const bytes = Buffer.from(uri.split(',')[1], 'base64');
  assert.ok(bytes.length > 10000);
  assert.equal(bytes[0], 255);
  assert.equal(bytes[1], 216);
  assert.ok(html.includes(uri));
}
assert.ok(!/<script[^>]+src=|<link[^>]+rel=["']stylesheet/.test(html));
assert.ok(!/https?:\/\//.test(html));
assert.equal(html.match(/id="storybook-save" type="application\/json">([^<]*)<\/script>/)[1], '{}');
assert.ok(html.includes('class AudioDirector'));
for (const w of STORY.worlds) {
  const f = SHEET_FRAMES[w.id];
  assert.ok(f && f.panels.length === 6, `Missing original frame metadata: ${w.id}`);
  assert.deepEqual(jpegSize(Buffer.from(ART[w.id].split(',')[1], 'base64')), {
    width: f.width,
    height: f.height,
  });
}
assert.ok(html.includes(JSON.stringify(SHEET_FRAMES)));
const pages = [...STORY.opening, ...STORY.ending, ...STORY.worlds.flatMap(w => [...w.intro, ...w.win])];
for (const page of pages) {
  const uri = ART[page.artId] || STORY_ART[page.artId];
  assert.ok(uri, `Missing art: ${page.artId}`);
  assert.ok(html.includes(uri));
  const f = artFrame(page.artId);
  if (f)
    assert.ok(
      f.x >= 0 &&
        f.y >= 0 &&
        f.width > 0 &&
        f.height > 0 &&
        f.x + f.width <= 1.00001 &&
        f.y + f.height <= 1.00001,
    );
}
assert.equal(html, await readFile(new URL('../index.html', import.meta.url), 'utf8'));
console.log(
  'Release verified: 12 cases, 72 framed scenes + 2 family paintings, every page covered, inline code/styles/audio, no remote URL, empty initial save.',
);
