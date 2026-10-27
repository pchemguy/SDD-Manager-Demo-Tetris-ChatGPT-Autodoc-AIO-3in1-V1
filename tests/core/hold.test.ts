import test from 'node:test';
import assert from 'node:assert/strict';
import {holdPiece,idleState,startGame,lockPiece} from '../../src/core/game.ts';
import {spawn} from '../../src/core/geometry.ts';
test('empty Hold consumes exactly one piece and rejects another Hold before locking',()=>{
 let draws=0;const old={...startGame(()=> 'T'),active:{type:'T' as const,x:1,y:8,rotation:2},fallMs:731,score:75};
 const state=holdPiece(old,()=>{draws++;return 'I';});
 assert.equal(draws,1);assert.equal(state.heldPiece,'T');assert.equal(state.holdUsed,true);assert.deepEqual(state.active,spawn('I'));assert.equal(state.fallMs,0);assert.equal(state.score,75);
 assert.equal(holdPiece(state,()=>{throw Error('Unexpected draw');}),state);assert.equal(old.active.rotation,2);
});
test('a populated slot swaps types without consuming the stream and resets orientation/clock',()=>{
 const state=holdPiece({...startGame(()=> 'J'),heldPiece:'Z',active:{type:'J',rotation:3,x:0,y:10},fallMs:999},()=>{throw Error('Unexpected draw');});
 assert.equal(state.heldPiece,'J');assert.deepEqual(state.active,spawn('Z'));assert.equal(state.fallMs,0);assert.equal(state.holdUsed,true);
});
test('only locking a piece restores Hold availability; restart empties the slot',()=>{
 const used=holdPiece(startGame(()=> 'J'),()=> 'O');
 const locked=lockPiece({...used,active:{type:'O',rotation:0,x:0,y:18}},()=> 'L');
 assert.equal(locked.holdUsed,false);assert.equal(locked.heldPiece,'J');assert.equal(holdPiece(locked,()=> 'I').active?.type,'J');
 const fresh=startGame(()=> 'T');assert.equal(fresh.heldPiece,null);assert.equal(fresh.holdUsed,false);
});
test('blocked held spawn ends play without writing settled cells',()=>{
 const old={...startGame(()=> 'T'),heldPiece:'I' as const,active:{type:'T' as const,x:0,y:10,rotation:1}};old.board[0][4]='Z';const before=JSON.stringify(old.board);
 const state=holdPiece(old,()=>{throw Error('Unexpected draw');});assert.equal(state.status,'over');assert.equal(state.active,null);assert.equal(JSON.stringify(state.board),before);assert.equal(state.heldPiece,'T');
});
test('idle, paused and game-over reject Hold without drawing',()=>{
 for(const state of [idleState(),{...startGame(()=> 'T'),status:'paused' as const},{...startGame(()=> 'T'),status:'over' as const}])assert.equal(holdPiece(state,()=>{throw Error('Unexpected draw');}),state);
});
