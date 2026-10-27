import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession} from '../../src/app/session.ts';
import {TYPES} from '../../src/core/geometry.ts';
import type {GameState} from '../../src/core/game.ts';
test('snapshot reads never consume draws and preview matches each subsequent spawn across bags',()=>{
 let count=0;const session=new GameSession(()=>TYPES[count++%7]);let state:Readonly<GameState>;
 session.subscribe(s=>{state=s;});assert.equal(count,0);assert.equal(state!.nextPiece,null);
 session.start();assert.equal(count,2);assert.equal(state!.active?.type,'I');
 for(let i=0;i<10;i++){
  const next:GameState['nextPiece']=state!.nextPiece;const draws:number=count;
  for(let read=0;read<20;read++){const stop=session.subscribe(s=>assert.equal(s.nextPiece,next));stop();}
  assert.equal(count,draws);
  for(let shift=0;shift<4;shift++)session.act(i%2?'left':'right');
  const board=state!.board;let attempts=0;
  while(state!.board===board&&state!.status==='running'&&attempts++<30)session.act('down');
  assert.equal(state!.active?.type,next);assert.equal(count,draws+1);
 }
});
test('default session uses complete independent seven-piece bags',()=>{
 const session=new GameSession();let state:Readonly<GameState>;session.subscribe(s=>{state=s;});session.start();
 const types=[state!.active!.type];
 for(let i=0;i<6;i++){
  for(let shift=0;shift<4;shift++)session.act(i%2?'left':'right');
  const board=state!.board;let attempts=0;
  while(state!.board===board&&attempts++<30)session.act('down');types.push(state!.active!.type);
 }
 assert.deepEqual(types.sort(),[...TYPES].sort());
});
test('Hold and preview share one stream; swapping consumes none and restart clears the slot',()=>{
 let draws=0;const session=new GameSession(()=>TYPES[draws++%7]);let state:Readonly<GameState>;session.subscribe(s=>{state=s;});session.start();
 session.act('hold');assert.equal(state!.heldPiece,'I');assert.equal(state!.active?.type,'J');assert.equal(state!.nextPiece,'L');assert.equal(draws,3);
 session.act('hold');assert.equal(draws,3);const board=state!.board;let attempts=0;
 while(state!.board===board&&attempts++<30)session.act('down');assert.equal(state!.active?.type,'L');assert.equal(state!.nextPiece,'O');assert.equal(draws,4);
 session.act('hold');assert.equal(state!.active?.type,'I');assert.equal(state!.heldPiece,'L');assert.equal(state!.nextPiece,'O');assert.equal(draws,4);
 session.start();assert.equal(state!.heldPiece,null);assert.equal(state!.holdUsed,false);assert.equal(draws,6);
});
test('session hard drop uses the shared projection, scores distance and advances one cached spawn',()=>{
 let draws=0;const session=new GameSession(()=>TYPES[draws++%7]);let state:Readonly<GameState>;session.subscribe(s=>{state=s;});session.start();session.act('hardDrop');
 assert.equal(state!.score,38);assert.equal(state!.active?.type,'J');assert.equal(state!.nextPiece,'L');assert.equal(draws,3);
});
