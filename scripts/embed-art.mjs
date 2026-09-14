import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {jpegSize} from './jpeg-size.mjs';
import {STORY} from '../src/story-data.js';
const art={},families={};
const frames=JSON.parse(await readFile(new URL('../assets/detective/frames.json',import.meta.url),'utf8'));
async function jpeg(id){const bytes=await readFile(new URL(`../assets/detective/${id}.jpg`,import.meta.url));assert.equal(bytes[0],255);assert.equal(bytes[1],216);if(frames[id])assert.deepEqual(jpegSize(bytes),{width:frames[id].width,height:frames[id].height},`JPEG/frame dimensions differ: ${id}`);return 'data:image/jpeg;base64,'+bytes.toString('base64');}
for(const world of STORY.worlds){
 art[world.id]=await jpeg(world.id);
 const f=frames[world.id];assert.ok(f&&f.width>0&&f.height>0&&f.panels.length===6,`Missing reviewed panel bounds: ${world.id}`);
 for(const [x,y,w,h] of f.panels)assert.ok(x>=0&&y>=0&&w>0&&h>0&&x+w<=f.width&&y+h<=f.height,`Invalid panel: ${world.id}`);
}
for(const id of ['opening-bedroom','ending-morning'])families[id]=await jpeg(id);
await writeFile(new URL('../src/assets.js',import.meta.url),'// Original detective sheets and family paintings, embedded for offline play.\nexport const ART = '+JSON.stringify(art)+';\nexport const FAMILY_ART = '+JSON.stringify(families)+';\n');
await writeFile(new URL('../src/sheet-frames.js',import.meta.url),'// Reviewed original panel bounds, generated from assets/detective/frames.json.\nexport const SHEET_FRAMES = '+JSON.stringify(frames)+';\n');
const aliases={'opening-bedroom':'family','ending-morning':'family','opening-dream':'race'};
for(const w of STORY.worlds)for(const p of [...w.intro,...w.win])aliases[p.artId]=w.id;
const entries=Object.entries(aliases).map(([key,value])=>JSON.stringify(key)+':'+(value==='family'?`FAMILY_ART[${JSON.stringify(key)}]`:`ART[${JSON.stringify(value)}]`));
await writeFile(new URL('../src/story-art.js',import.meta.url),"import { ART, FAMILY_ART } from './assets.js';\nexport const STORY_ART = {"+entries.join(',')+'};\n');
console.log(`Embedded ${Object.keys(art).length} six-panel sheets + ${Object.keys(families).length} family paintings with reviewed panel bounds.`);
