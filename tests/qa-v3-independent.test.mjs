// Independent QA exercises the public engine with normal animation frames and persisted state.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {GameEngine,ABILITIES,MAX_BULLETS,PATTERN_SPECS,WIDTH} from '../src/engine.js';
import {STORY} from '../src/story-data.js';
const make=(stage=8,extra={})=>new GameEngine({stage:STORY.worlds[stage-1],...extra});
const near=(actual,expected,epsilon=1e-8)=>assert.ok(Math.abs(actual-expected)<=epsilon,`${actual} differs from ${expected}`);
function fire(g,index){g.attackIndex=index;g.beginWarning();const tells=structuredClone(g.telegraphs);g.firePattern();return tells;}
function frames(g,seconds,dt){for(let elapsed=0;elapsed<seconds-1e-9;elapsed+=dt)g.step(Math.min(dt,seconds-elapsed));}
// Execute the real application's save sanitiser without booting its DOM or copying its logic.
const appSource=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const saveLogic=appSource.slice(appSource.indexOf('function earnedFrom('),appSource.indexOf('let save=fresh();'));
const saveContext=vm.createContext({items:STORY.items,worlds:STORY.worlds,ids:STORY.worlds.map(w=>w.id),WIDTH,HEIGHT:48,fresh:()=>({version:1})});
vm.runInContext(saveLogic+'\nthis.clean=cleanSave;',saveContext);

for(const dt of [.1,1/60]){
 test(`independent QA: aimed three-shot cadence at ${dt} second frames`,()=>{
  const emissions=[],g=make(4,{onEvent:e=>{if(e.type==='volley')emissions.push(g.elapsed);}});
  const t=fire(g,1)[0];g.player={x:68,y:1};frames(g,1.05,dt);
  assert.equal(emissions.length,3);near(emissions[0],0);near(emissions[1],.45,dt+1e-8);near(emissions[2],.9,dt+1e-8);
  assert.equal(g.attackWaves.length,0);assert.equal(g.bullets.length,3);
  for(const b of g.bullets){near(Math.atan2(b.vy,b.vx),Math.atan2(Math.sin(t.angle),Math.cos(t.angle)));near(Math.hypot(b.vx,b.vy),PATTERN_SPECS.aimed.speed);}
 });
 test(`independent QA: dense ring reservations respect 14 and leave an exit at ${dt}`,()=>{
  const g=make();g.enemies[0].x=36;g.enemies[0].y=24;g.bossState.enraged=true;const t=fire(g,0)[0];
  // Density is locked when the warning is created; subsequent frames must not retarget that pulse.
  for(let elapsed=0;elapsed<1.3;elapsed+=dt){g.step(dt);assert.ok(g.bullets.length<=MAX_BULLETS);}
  assert.equal(g.bullets.length,14);assert.equal(g.attackWaves.length,0);
  for(const b of g.bullets){const angle=Math.atan2(b.vy,b.vx),delta=Math.atan2(Math.sin(angle-t.gapAngle),Math.cos(angle-t.gapAngle));assert.ok(Math.abs(delta)>=Math.PI/4-1e-8);}
 });
}

test('independent QA: every beam warning arm becomes exactly one active arm after checkpoint restore',()=>{
 for(const [stage,index] of [[6,0],[7,2],[8,1],[8,4]]){
  const g=make(stage);g.attackIndex=index;g.beginWarning();frames(g,.4,1/60);
  const rays=g.telegraphs.flatMap(t=>t.rays.map(r=>({x:t.x,y:t.y,...r}))),r=make(stage,{snapshot:g.snapshot()});
  r.firePattern();assert.equal(r.beams.length,rays.length);
  for(let i=0;i<rays.length;i++)for(const key of ['x','y','angle','length'])near(r.beams[i][key],rays[i][key]);
  const reloaded=make(stage,{snapshot:r.snapshot()});assert.deepEqual(reloaded.beams,r.beams);
 }
});
test('independent QA: a newly claimed wall shortens its active beam and cannot extend other arms',()=>{
 const g=make(7);g.enemies[0].x=40.5;g.enemies[0].y=20.5;fire(g,2);const original=g.beams.map(b=>b.length);
 for(let y=2;y<46;y++)g.cells[y*WIDTH+43]=1;g.advanceProjectiles(1/60,1);
 assert.equal(g.beams.length,4);for(let i=0;i<4;i++)assert.ok(g.beams[i].length<=original[i]);
 assert.ok(g.beams.find(b=>Math.abs(b.angle)<1e-8).length<=2.5);
 const paused=structuredClone(g.beams);g.advanceProjectiles(.1,0);assert.deepEqual(g.beams,paused);
});
test('independent QA: ring second pulse survives save once and uses originally advertised angles',()=>{
 const g=make();g.enemies[0].x=36;g.enemies[0].y=24;fire(g,0);frames(g,.4,.1);const snapshot=g.snapshot(),r=make(8,{snapshot});
 assert.equal(r.attackWaves.length,1);frames(r,.55,1/60);assert.equal(r.attackWaves.length,0);assert.equal(r.bullets.length,10);
 const angles=snapshot.attackWaves[0].angles;for(const b of r.bullets)assert.ok(angles.some(a=>Math.abs(Math.cos(a)*PATTERN_SPECS.ring.speed-b.vx)<1e-8&&Math.abs(Math.sin(a)*PATTERN_SPECS.ring.speed-b.vy)<1e-8));
 frames(r,.3,.1);assert.equal(r.bullets.length,10);
});
test('independent QA: cancelling a queued volley with lantern cannot leak a delayed second pulse',()=>{
 const g=make(8,{unlockedAbilities:['lantern']});fire(g,0);frames(g,.5,.1);assert.ok(g.attackWaves.length);
 assert.equal(g.useAbility('lantern'),true);assert.equal(g.energy,2);assert.equal(g.availableCharges.lantern,1);
 frames(g,3.3,1/60);assert.equal(g.bullets.length,0);assert.equal(g.attackWaves.length,0);assert.equal(g.bossState.phase,'recover');
});
test('independent QA: all three stages of a volley preserve their consumed energy across repeated loads',()=>{
 for(const elapsed of [0,.5,1]){
  const g=make(4,{unlockedAbilities:['shell','feather','lantern','clock']});fire(g,1);g.useAbility('shell');frames(g,elapsed,.1);
  let s=g.snapshot();for(let i=0;i<4;i++){const r=make(4,{unlockedAbilities:Object.keys(ABILITIES),snapshot:s});assert.equal(r.energy,2);assert.equal(r.availableCharges.shell,1);assert.equal(r.shield,3);s=r.snapshot();}
 }
});
test('independent QA: obsolete v2.1 gifts disappear without refunding or consuming energy',()=>{
 for(const spentEnergy of [0,1,2,3]){
  const g=make(8,{unlockedAbilities:Object.keys(ABILITIES)}),s=g.snapshot();s.engineVersion=3;s.balanceVersion='2.1';s.ability='slippers';s.energy=spentEnergy;
  s.unlockedAbilities=['shell','slippers','feather','brick','lantern','seed','clock','apple'];
  s.availableCharges={shell:1,slippers:0,feather:0,brick:0,lantern:1,seed:0,clock:0,apple:0};s.boost=8;s.slow=5;
  const r=make(8,{unlockedAbilities:['shell','feather','lantern'],snapshot:s});
  assert.equal(r.energy,spentEnergy);assert.deepEqual(r.availableCharges,{shell:1,feather:0,lantern:1});assert.equal(r.boost,0);assert.equal(r.slow,0);
  for(const old of ['slippers','brick','seed','apple','clock'])assert.equal(r.useAbility(old),false);assert.equal(r.energy,spentEnergy);
 }
});
test('independent QA: legacy single-item checkpoint retains prior spending even when that gift was removed',()=>{
 const oldCaps={slippers:2,brick:2,seed:2,apple:1};
 for(const [ability,cap] of Object.entries(oldCaps))for(let charges=0;charges<=cap;charges++){
  const s=make(8).snapshot();s.engineVersion=1;s.ability=ability;s.charges=charges;delete s.energy;delete s.availableCharges;
  const r=make(8,{unlockedAbilities:['shell'],snapshot:s});assert.equal(r.energy,3-(cap-charges),`${ability}: ${charges} remaining`);assert.deepEqual(r.availableCharges,{shell:2});
 }
});
test('independent QA: corrupted delayed volleys never exceed cap or introduce unsupported emission patterns',()=>{
 const g=make(4);fire(g,1);
 for(const waves of [[null],[{pattern:'beam',x:40,y:30,remaining:.2,angles:[0]}],Array.from({length:3},()=>({pattern:'aimed',x:40,y:30,remaining:.2,angles:[0]}))]){
  const s=g.snapshot();s.attackWaves=waves;const r=make(4,{snapshot:s});assert.equal(r.attackWaves.length,0);frames(r,1,.1);assert.ok(r.bullets.length<=MAX_BULLETS);assert.ok(r.bullets.every(b=>b.kind==='aimed'));
 }
});
test('independent QA: four gifts map to exactly four disjoint triples of story completions',()=>{
 assert.deepEqual(STORY.items.map(i=>i.id),Object.keys(ABILITIES));assert.deepEqual(STORY.items.map(i=>i.key),[1,2,3,4]);
 assert.deepEqual(STORY.items.flatMap(i=>i.requiredStages),STORY.worlds.map(w=>w.id));
 for(const [i,item] of STORY.items.entries()){assert.equal(item.requiredStages.length,3);for(const id of item.requiredStages)assert.equal(STORY.worlds.find(w=>w.id===id).pairIndex,i);}
});
test('independent QA: actual app sanitiser derives four triple unlocks for every completion combination',()=>{
 for(let mask=0;mask<4096;mask++){
  const cleared=STORY.worlds.filter((w,i)=>mask&(1<<i)).map(w=>w.id),snapshot=make().snapshot();
  snapshot.unlockedAbilities=['shell','slippers','feather','brick','lantern','seed','clock','apple'];snapshot.energy=1;
  const clean=saveContext.clean({version:1,cleared,equipped:'slippers',current:snapshot});
  const expected=['shell','feather','lantern','clock'].filter((id,i)=>(mask&(7<<(i*3)))===(7<<(i*3)));
  assert.deepEqual(Array.from(clean.current.unlockedAbilities),expected);assert.equal(clean.equipped,null);assert.equal(clean.current.energy,1);
 }
});
test('independent QA: actual app sanitiser preserves v1 removed-gift spending before deleting its identity',()=>{
 for(const [ability,cap] of [['slippers',2],['brick',2],['seed',2],['apple',1]]){
  const snapshot=make().snapshot();snapshot.engineVersion=1;snapshot.ability=ability;snapshot.charges=0;delete snapshot.energy;delete snapshot.availableCharges;
  const clean=saveContext.clean({version:1,cleared:['race','duck','pigs'],equipped:ability,current:snapshot});
  assert.equal(clean.current.ability,null);assert.equal(clean.current.energy,3-cap);
  const r=make(8,{unlockedAbilities:Array.from(clean.current.unlockedAbilities),snapshot:clean.current});assert.equal(r.energy,3-cap);
 }
});
