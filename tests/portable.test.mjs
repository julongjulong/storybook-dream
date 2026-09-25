import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = (await readFile(new URL('../src/portable.js', import.meta.url), 'utf8')).replace(
  'export function',
  'function',
);
async function exportWith({ development = false, html, save, images = {}, fetchOK = true }) {
  let blob,
    cleared = false,
    clicked = false,
    requested = '';
  const link = {
    click() {
      clicked = true;
    },
    remove() {},
  };
  const context = {
    window: {},
    Blob,
    URL: {
      createObjectURL(b) {
        blob = b;
        return 'blob:qa';
      },
      revokeObjectURL() {},
    },
    setTimeout() {},
    document: {
      querySelector() {
        return development ? {} : null;
      },
      documentElement: {
        cloneNode() {
          return {
            querySelector() {
              return {
                replaceChildren() {
                  cleared = true;
                },
              };
            },
            querySelectorAll() {
              return [];
            },
            get outerHTML() {
              return html;
            },
          };
        },
      },
      createElement() {
        return link;
      },
      body: { append() {} },
    },
    fetch: async url => {
      requested = url;
      return { ok: fetchOK, text: async () => html };
    },
  };
  vm.runInNewContext(source + ';installPortableExport();', context);
  await context.window.STORYBOOK_EXPORT(save, images);
  return { html: await blob.text(), cleared, clicked, requested, name: link.download };
}
const template =
  '<html><body><div id="app"></div><script id="storybook-save" type="application/json">{}</script><script>/*game-code*/</script></body></html>';
test('standalone export embeds progress and photos, strips live UI and keeps executable game', async () => {
  const save = { version: 1, cleared: ['race'], updatedAt: 9 },
    images = { race: 'data:image/jpeg;base64,ABC' };
  const r = await exportWith({ html: template, save, images });
  const seed = JSON.parse(r.html.match(/type="application\/json">(.*?)<\/script>/s)[1]);
  assert.deepEqual(seed, { save, customImages: images });
  assert.ok(r.cleared && r.clicked);
  assert.equal(r.requested, '');
  assert.equal(r.name, 'storybook-dream-continue.html');
  assert.ok(r.html.includes('/*game-code*/'));
});
test('embedded JSON escapes script terminators without changing saved strings', async () => {
  const save = { text: '</script><script>bad & text</script>' };
  const r = await exportWith({ html: template, save });
  assert.equal((r.html.match(/<script/g) || []).length, 2);
  assert.deepEqual(JSON.parse(r.html.match(/type="application\/json">(.*?)<\/script>/s)[1]).save, save);
});
test('development preview exports the built standalone instead of source modules', async () => {
  const r = await exportWith({ development: true, html: template, save: { version: 1 } });
  assert.equal(r.requested, './output/storybook-dream.html');
  assert.equal(r.cleared, false);
});
test('missing build or save marker reports failure instead of pretending to save', async () => {
  await assert.rejects(exportWith({ development: true, fetchOK: false, html: template, save: {} }));
  await assert.rejects(exportWith({ html: '<html></html>', save: {} }));
});
