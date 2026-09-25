import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../', import.meta.url));
const modules = new Map();
let next = 0;
async function bundle(file) {
  file = path.resolve(file);
  if (modules.has(file)) return modules.get(file).id;
  if (!file.startsWith(root)) throw new Error('Import outside game folder');
  const record = { id: `m${next++}`, code: '' };
  modules.set(file, record);
  let source = await readFile(file, 'utf8');
  const imports = [...source.matchAll(/^import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"];?[ \t]*\r?\n/gm)];
  for (const match of imports) {
    if (!match[2].startsWith('.')) throw new Error('External dependency: ' + match[2]);
    const dependency = await bundle(path.resolve(path.dirname(file), match[2]));
    const binding = match[1].trim();
    if (!binding.startsWith('{')) throw new Error('Use named module imports');
    source = source.replace(match[0], `const ${binding.replace(/\bas\b/g, ':')} = ${dependency};\n`);
  }
  const names = [...source.matchAll(/^export\s+(?:async\s+)?(?:const|let|var|class|function)\s+(\w+)/gm)].map(
    m => m[1],
  );
  // Capture additional names in simple exported const declarations such as W=72,H=48.
  for (const declaration of source.matchAll(/^export\s+(?:const|let)\s+([^;\n]+);/gm))
    for (const match of declaration[1].matchAll(/(?:^|,)\s*([A-Za-z_$][\w$]*)\s*=/g))
      if (!names.includes(match[1])) names.push(match[1]);
  source = source.replace(/^export\s+(?=(?:async\s+)?(?:const|let|var|class|function)\b)/gm, '');
  source = source.replace(/^export default [A-Za-z_$][\w$]*;?[ \t]*$/gm, '');
  if (/^import\s|^export\s/m.test(source)) throw new Error('Unsupported module syntax in ' + file);
  record.code = `const ${record.id}=(()=>{\n${source}\nreturn {${names.join(',')}};\n})();`;
  return record.id;
}
const entry = await bundle(path.join(root, 'src/app.js'));
// Dependencies complete before dependants; recurse through transformed references.
const ordered = [],
  visited = new Set();
function visit(record) {
  if (visited.has(record.id)) return;
  visited.add(record.id);
  for (const m of record.code.matchAll(/= (m\d+);/g)) {
    const dep = [...modules.values()].find(r => r.id === m[1]);
    if (dep) visit(dep);
  }
  ordered.push(record.code);
}
visit([...modules.values()].find(r => r.id === entry));
const javascript = `(()=>{\n${ordered.join('\n')}\n})();`;
new vm.Script(javascript, { filename: 'storybook-dream.bundle.js' });
let html = await readFile(path.join(root, 'dev.html'), 'utf8');
const css = await readFile(path.join(root, 'style.css'), 'utf8');
html = html.replace(/<link[^>]+href=["'](?:\.\/)?style\.css["'][^>]*>/, () => `<style>${css}</style>`);
html = html.replace(
  /<script[^>]+type=["']module["'][^>]*src=["'][^"']+["'][^>]*><\/script>/,
  () => `<script>${javascript.replace(/<\/script/gi, '<\\/script')}</script>`,
);
if (!html.includes('id="storybook-save"'))
  html = html.replace(
    '<script>',
    '<script id="storybook-save" type="application/json">{}</script>\n<script>',
  );
if (/<script[^>]+src=|<link[^>]+rel=["']stylesheet|@import\s/i.test(html))
  throw new Error('Standalone contains external code/styles');
await mkdir(path.join(root, 'output'), { recursive: true });
await writeFile(path.join(root, 'output/storybook-dream.html'), html);
await writeFile(path.join(root, 'index.html'), html);
console.log(
  `Built output/storybook-dream.html (${Math.round(Buffer.byteLength(html) / 1024)} KB, ${modules.size} modules)`,
);
