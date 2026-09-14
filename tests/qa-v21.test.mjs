import test from 'node:test';
import assert from 'node:assert/strict';
import {GameEngine, WIDTH, HEIGHT} from '../src/engine.js';

const ids=['race','duck','pigs','redhood','beans','ant','lion','fox','wind','ax','piper','troy'];
const make=(index=3,extra={})=>new GameEngine({stage:{id:ids[index-1],index},...extra});
const advance=(g,seconds)=>{for(let n=0;n<Math.round(seconds*100);n++)g.step(.01);};
const near=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-8,message||`${a} ≈ ${b}`);

test('v2.1 QA: three collected stars each give a visible fixed speed increment and survive a hit',()=>{
 const g=make(3);assert.equal(g.speed,7);
 for(const speed of [8.8,10.6,12.4]){g.pickups=[{x:g.player.x,y:g.player.y,type:'speed'}];g.collectNearby();near(g.speed,speed);}
 g.setDrawHeld(true);g.move(0,1);g.grace=0;g.damage();near(g.speed,12.4);assert.equal(g.speedLevel,3);
});

test('v2.1 QA: safe ground is still a genuine refuge for all eight faster stages',()=>{
 for(let index=1;index<=8;index++){
  const g=make(index,{unlockedAbilities:['shell']});g.useAbility('shell');g.grace=0;
  const land=Array.from(g.cells);advance(g,35);
  assert.deepEqual(Array.from(g.cells),land,`stage ${index}: gained land cannot be destroyed`);
  assert.equal(g.shield,3,`stage ${index}: no shield consumed while safe`);
  assert.deepEqual(g.player,{x:12,y:1});
  assert.ok(g.enemies.every(e=>!g.blocked(e.x,e.y)),`stage ${index}: enemies remain in open ground`);
 }
});

test('v2.1 QA: legacy v1 checkpoint preserves territory, stars and single-gift use during migration',()=>{
 const g=make(4,{unlockedAbilities:['shell']});const s=g.snapshot();
 delete s.engineVersion;delete s.balanceVersion;delete s.availableCharges;delete s.energy;
 s.cells[8*WIDTH+8]=1;s.speedLevel=2;s.ability='shell';s.charges=1;s.shield=2;s.shell=true;
 for(const e of s.enemies){e.vx=e.boss?3.07:-2.53;e.vy=e.boss?2.23:1.89;}
 const r=make(4,{unlockedAbilities:['shell','feather'],snapshot:s});
 assert.equal(r.cells[8*WIDTH+8],1);assert.equal(r.speedLevel,2);assert.equal(r.shield,2);assert.equal(r.shell,true);
 assert.equal(r.availableCharges.shell,1);assert.equal(r.availableCharges.feather,2);assert.equal(r.energy,2);
 near(r.speed,10.6*.7);assert.equal(r.drawHeld,false);assert.equal(r.trail.length,0);
});

test('v2.1 QA: legacy v2 checkpoint preserves all earned item counts, energy and buffs',()=>{
 const gifts=['shell','feather','clock'];const g=make(7,{unlockedAbilities:gifts});const s=g.snapshot();
 s.engineVersion=2;delete s.balanceVersion;s.cells[8*WIDTH+8]=1;s.speedLevel=1;s.energy=1;
 s.availableCharges={shell:1,feather:1,clock:0};s.shield=2;s.shell=true;s.freeze=2;s.boost=3;
 for(const e of s.enemies){e.vx=e.boss?3.79:-3.01;e.vy=e.boss?2.71:2.13;}
 const r=make(7,{unlockedAbilities:gifts,snapshot:s});
 assert.equal(r.cells[8*WIDTH+8],1);assert.equal(r.speedLevel,1);assert.equal(r.energy,1);
 assert.deepEqual(r.availableCharges,s.availableCharges);assert.equal(r.shield,2);assert.equal(r.freeze,2);assert.equal(r.boost,0);
 assert.ok(Math.hypot(r.enemies[0].vx,r.enemies[0].vy)>Math.hypot(s.enemies[0].vx,s.enemies[0].vy));
});

test('v2.1 QA: speed gifts remain independent from the shell slowdown and the hard cap',()=>{
 const g=make(5,{unlockedAbilities:['feather','shell']});g.speedLevel=3;g.useAbility('feather');near(g.speed,12.4);
 g.abilityCooldown=0;g.useAbility('shell');near(g.speed,8.68);g.setDrawHeld(true);g.move(0,1);
 for(let i=0;i<3;i++){g.grace=0;g.damage();}near(g.speed,12.4);assert.equal(g.shell,false);
});

test('v2.1 QA: freeze holds warning direction, countdown and enemy positions while allowing the player to move',()=>{
 const g=make(6,{unlockedAbilities:['clock']});g.beginWarning();g.useAbility('clock');
 const positions=g.enemies.map(e=>[e.x,e.y]);const telegraph=structuredClone(g.telegraphs),remaining=g.bossState.remaining;
 g.setDirection(1,0);advance(g,1);
 assert.deepEqual(g.enemies.map(e=>[e.x,e.y]),positions);assert.deepEqual(g.telegraphs,telegraph);near(g.bossState.remaining,remaining);
 assert.ok(g.player.x>12);
});

test('v2.1 QA: bullets and beams cannot cross a one-cell claimed wall or mutate it',()=>{
 const g=make(8);for(let y=2;y<HEIGHT-2;y++)g.cells[g.index(30,y)]=1;
 g.bullets=[{x:29.8,y:15.5,vx:12,vy:0,life:5}];
 g.beams=[{x:20,y:20,angle:0,length:40,width:1.25,life:1}];const before=Array.from(g.cells);
 g.advanceProjectiles(.1,1);assert.equal(g.bullets.length,0);assert.ok(g.beams[0].length<10);assert.deepEqual(Array.from(g.cells),before);
});

test('v2.1 QA: every boss pattern uses the displayed locked angle and gives a projectile-free stationary recovery',()=>{
 for(let index=3;index<=8;index++)for(let p=0;p<make(index).profile.patterns.length;p++){
  const g=make(index);g.attackIndex=p;g.beginWarning();const shown=structuredClone(g.telegraphs[0]),boss=g.enemies[0],start=[boss.x,boss.y];
  g.player={x:65,y:1};g.advanceEnemies(.1,1);assert.deepEqual([boss.x,boss.y],start);
  g.advanceBoss(shown.duration);assert.equal(g.bossState.phase,'attack');
  if(shown.type==='dash')near(Math.atan2(boss.vy,boss.vx),shown.angle);
  else if(shown.type==='beam')near(g.beams[0].angle,shown.angle);
  else for(let i=0;i<g.bullets.length;i++)near(Math.cos(Math.atan2(g.bullets[i].vy,g.bullets[i].vx)-shown.angles[i]),1);
  if(shown.type!=='dash'){g.advanceEnemies(.1,1);assert.deepEqual([boss.x,boss.y],start);}
  g.advanceBoss(g.bossState.remaining+.001);assert.equal(g.bossState.phase,'recover');assert.equal(g.bullets.length,0);assert.equal(g.beams.length,0);
  const rest=[boss.x,boss.y];g.advanceEnemies(.1,1);assert.deepEqual([boss.x,boss.y],rest);
 }
});

test('v2.1 QA: a dash into claimed ground stops rather than bouncing toward an unmarked direction',()=>{
 const g=make(4),boss=g.enemies[0];boss.x=29.8;boss.y=20.5;boss.vx=1;boss.vy=0;
 for(let y=2;y<HEIGHT-2;y++)g.cells[g.index(30,y)]=1;
 g.player={x:40,y:20};g.beginWarning();g.advanceBoss(g.profile.warning);assert.equal(boss.dashing,true);
 g.advanceEnemies(.1,1);assert.equal(boss.dashing,false);assert.equal(g.bossState.phase,'recover');assert.ok(boss.x<30);assert.equal(boss.vx,1);
 const stopped=[boss.x,boss.y];g.advanceEnemies(.1,1);assert.deepEqual([boss.x,boss.y],stopped);
});

test('v4 QA: helper flashes then roams quickly without shooting or aiming at the player',()=>{
 const events=[],g=make(7,{onEvent:e=>events.push(e)}),e=g.enemies[1];e.intent.remaining=0;g.advanceIntent(e,.01);assert.equal(e.intent.phase,'warmup');assert.ok(events.some(e=>e.type==='minion-warning'));assert.equal(g.bullets.length,0);assert.equal(g.telegraphs.length,0);
 g.advanceIntent(e,.91);assert.equal(e.intent.phase,'rush');g.beginWarning();assert.equal(e.intent.phase,'rush');g.advanceIntent(e,1.51);assert.equal(e.intent.phase,'roam');
});

test('v2.1 QA: a null enemy in damaged checkpoint is rejected without throwing or losing a new game',()=>{
 const bad=make(4).snapshot();bad.enemies=[null];bad.speedLevel=3;let r;
 assert.doesNotThrow(()=>{r=make(4,{snapshot:bad});});assert.equal(r.speedLevel,0);assert.equal(r.progress,0);
});
