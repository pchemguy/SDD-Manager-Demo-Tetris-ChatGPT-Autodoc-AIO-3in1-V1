import test from 'node:test';
import assert from 'node:assert/strict';
import {hardDrop,startGame,idleState} from '../../src/core/game.ts';
test('hard drop lands I at row19 for38 points, locks once and resets the next piece',()=>{
 let draws=0;const old={...startGame(()=> 'I'),heldPiece:'O' as const,holdUsed:true,fallMs:400},before=JSON.stringify(old);
 const next=hardDrop(old,()=>{draws++;return 'J';});assert.equal(next.score,38);assert.equal(draws,1);assert.equal(next.active?.type,'J');assert.equal(next.fallMs,0);assert.equal(next.holdUsed,false);assert.equal(next.heldPiece,'O');
 assert.deepEqual(next.board[19],[null,null,null,'I','I','I','I',null,null,null]);assert.equal(JSON.stringify(old),before);
});
test('hard drop cannot pass a floating obstruction or award a failed-attempt soft point',()=>{
 const old={...startGame(()=> 'O'),active:{type:'O' as const,rotation:0,x:4,y:-1}};old.board[10][4]='J';
 const next=hardDrop(old,()=> 'S');assert.equal(next.score,18);assert.deepEqual(next.board[8].slice(4,6),['O','O']);assert.deepEqual(next.board[9].slice(4,6),['O','O']);assert.equal(next.board[10][4],'J');assert.equal(next.board[19][4],null);
});
test('zero-distance drop adds no points and terminal repeats draw nothing',()=>{
 const old={...startGame(()=> 'O'),active:{type:'O' as const,rotation:0,x:0,y:18},score:7};old.board[0][4]='Z';let draws=0;
 const next=hardDrop(old,()=>{draws++;return 'O';});assert.equal(next.score,7);assert.equal(next.status,'over');assert.equal(draws,1);
 assert.equal(hardDrop(next,()=>{throw Error('Unexpected draw');}),next);assert.equal(next.score,7);
});
test('hard drop adds only distance points before ordinary line scoring',()=>{
 const old={...startGame(()=> 'I'),active:{type:'I' as const,rotation:0,x:3,y:17}};old.board[19].fill('J');for(let x=3;x<7;x++)old.board[19][x]=null;
 const next=hardDrop(old,()=> 'O');assert.equal(next.score,102);assert.equal(next.lines,1);
 const capped=hardDrop({...startGame(()=> 'I'),score:Number.MAX_SAFE_INTEGER-1},()=> 'O');assert.equal(capped.score,Number.MAX_SAFE_INTEGER);
});
test('idle, paused and game-over hard drops have no effects',()=>{
 for(const state of [idleState(),{...startGame(()=> 'I'),status:'paused' as const},{...startGame(()=> 'I'),status:'over' as const}])assert.equal(hardDrop(state,()=>{throw Error('Unexpected draw');}),state);
});
