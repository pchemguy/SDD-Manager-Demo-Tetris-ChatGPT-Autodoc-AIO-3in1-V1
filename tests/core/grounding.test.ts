import test from 'node:test';
import assert from 'node:assert/strict';
import {startGame,tick,command,hardDrop,descend,holdPiece,type GameState} from '../../src/core/game.ts';
import {TYPES,type Piece} from '../../src/core/geometry.ts';
const next=()=> 'T' as const;
const interval=(active:Piece):GameState=>({...startGame(()=> 'O'),active,lockPolicy:'interval',grounding:null});
test('first grounding captures a full interval independently of the gravity remainder',()=>{
 let state={...interval({type:'O',rotation:0,x:0,y:18}),fallMs:900};state=tick(state,0,next);
 assert.deepEqual(state.grounding,{elapsedMs:0,intervalMs:1000});state=tick(state,100,next);assert.equal(state.active?.type,'O');assert.equal(state.grounding?.elapsedMs,100);assert.equal(state.fallMs,0);
 state=tick(state,899,next);assert.equal(state.active?.type,'O');state=tick(state,1,next);assert.equal(state.active?.type,'T');assert.equal(state.fallMs,0);assert.equal(state.grounding,null);
});
test('the captured interval uses the current level and locks at an equal boundary',()=>{
 const state=tick({...interval({type:'O',rotation:0,x:0,y:18}),level:2,lines:10},799,next);assert.deepEqual(state.grounding,{elapsedMs:799,intervalMs:800});assert.equal(state.active?.type,'O');assert.equal(tick(state,1,next).active?.type,'T');
});
test('grounded movement, floor rotation and repeated hard drops do not reset elapsed grounding',()=>{
 let state=tick(interval({type:'T',rotation:0,x:3,y:18}),400,next);state=command(state,'left');state=command(state,'rotateCW');
 assert.deepEqual(state.grounding,{elapsedMs:400,intervalMs:1000});
 for(let i=0;i<3;i++)state=hardDrop(state,()=>{throw Error('Premature lock');});
 assert.deepEqual(state.grounding,{elapsedMs:400,intervalMs:1000});assert.equal(state.score,0);state=tick(state,599,next);assert.equal(state.active?.type,'T');assert.equal(state.grounding?.elapsedMs,999);assert.equal(tick(state,1,()=> 'I').active?.type,'I');
});
test('leaving support cancels the timer and returning starts a fresh full interval',()=>{
 let state=interval({type:'O',rotation:0,x:4,y:8});state.board[10][4]='J';state=tick(state,400,next);assert.equal(state.grounding?.elapsedMs,400);
 state=command(state,'right');assert.equal(state.grounding,null);state=command(state,'left');assert.deepEqual(state.grounding,{elapsedMs:0,intervalMs:1000});
 state=tick(state,999,next);assert.equal(state.active?.type,'O');assert.equal(tick(state,1,next).active?.type,'T');
});
test('gravity arrival starts grounding at contact and processes the precise next deadline',()=>{
 let draws=0;const draw=()=>{draws++;return 'T' as const;};let state=tick(interval({type:'O',rotation:0,x:0,y:17}),1999,draw);
 assert.equal(state.active?.y,18);assert.deepEqual(state.grounding,{elapsedMs:999,intervalMs:1000});assert.equal(draws,0);state=tick(state,1,draw);assert.equal(draws,1);assert.equal(state.active?.type,'T');assert.equal(state.fallMs,0);
});
test('soft drop contact starts grounding and failed attempts do not lock or award points',()=>{
 let state=descend(interval({type:'O',rotation:0,x:0,y:17}),next,'soft');assert.equal(state.score,1);assert.deepEqual(state.grounding,{elapsedMs:0,intervalMs:1000});
 state=descend(state,()=>{throw Error('Premature lock');},'soft');assert.equal(state.score,1);assert.equal(tick(state,999,next).active?.type,'O');assert.equal(tick(state,1000,next).active?.type,'T');
});
test('one large advance equals successive advances through multiple locks and game over',()=>{
 let a=0,b=0;const drawA=()=>TYPES[a++%7],drawB=()=>TYPES[b++%7];const startA={...startGame(drawA),lockPolicy:'interval' as const},startB={...startGame(drawB),lockPolicy:'interval' as const};
 const whole=tick(startA,250000,drawA);let chunks:GameState=startB;for(let i=0;i<250;i++)chunks=tick(chunks,1000,drawB);
 assert.deepEqual(whole,chunks);assert.equal(a,b);assert.ok(a>2);assert.equal(whole.status,'over');assert.equal(whole.grounding,null);assert.ok(whole.fallMs>=0);
});
test('pause excludes elapsed time from both clocks',()=>{
 const state=tick(interval({type:'O',rotation:0,x:0,y:18}),400,next),paused={...state,status:'paused' as const};assert.equal(tick(paused,100000,next),paused);
 let resumed=tick({...paused,status:'running'},599,next);assert.equal(resumed.grounding?.elapsedMs,999);resumed=tick(resumed,1,next);assert.equal(resumed.active?.type,'T');
});
test('immediate hard-drop override locks even under interval policy',()=>{
 const state={...interval({type:'I',rotation:0,x:3,y:-1}),hardDropLock:'immediate' as const};const dropped=hardDrop(state,()=> 'O');assert.equal(dropped.active?.type,'O');assert.equal(dropped.score,38);assert.equal(dropped.board[19][3],'I');assert.equal(dropped.grounding,null);
});

test('Hold gets fresh clocks on immediate support and clears them on a blocked held spawn',()=>{
 let state=tick(interval({type:'T',rotation:0,x:3,y:18}),400,next);state.board[1][4]='Z';
 const supported=holdPiece({...state,heldPiece:'I'},()=>{throw Error('Unexpected draw');});assert.equal(supported.fallMs,0);assert.deepEqual(supported.grounding,{elapsedMs:0,intervalMs:1000});assert.equal(supported.active?.rotation,0);
 state.board[0][4]='Z';const before=JSON.stringify(state.board),blocked=holdPiece({...state,heldPiece:'I'},next);assert.equal(blocked.status,'over');assert.equal(blocked.fallMs,0);assert.equal(blocked.grounding,null);assert.equal(JSON.stringify(blocked.board),before);
});
