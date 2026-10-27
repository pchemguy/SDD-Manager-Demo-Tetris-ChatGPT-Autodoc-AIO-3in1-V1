import test from 'node:test';
import assert from 'node:assert/strict';
import {activatePenetrator,startGame,idleState,lockPiece,holdPiece,spawnNext,type GameState} from '../../src/core/game.ts';
import {emptyBoard} from '../../src/core/geometry.ts';
function clearFixture(rows:number,bonuses:number):GameState{
 const board=emptyBoard();for(let y=20-rows;y<20;y++){board[y].fill('J');board[y][4]=null;}
 return {...startGame(()=> 'I'),board,active:{type:'I',rotation:1,x:2,y:16},bonuses};
}
test('each four-line lock earns one bonus capped at three, including penetrator locks',()=>{
 for(const bonuses of [0,1,2,3]){
  const old={...clearFixture(4,bonuses),penetrator:true},before=JSON.stringify(old),next=lockPiece(old,()=> 'T');
  assert.equal(next.bonuses,Math.min(3,bonuses+1));assert.equal(next.penetrator,false);assert.equal(next.lines,4);assert.equal(JSON.stringify(old),before);
 }
});
test('one, two and three-line clears do not earn a penetrator bonus',()=>{
 for(const rows of [1,2,3])assert.equal(lockPiece(clearFixture(rows,2),()=> 'T').bonuses,2);
});
test('activation spends once and preserves position, orientation and Hold restriction',()=>{
 const old={...startGame(()=> 'T'),active:{type:'T' as const,rotation:3,x:1,y:5},bonuses:2,holdUsed:true,heldPiece:'J' as const,fallMs:400},before=JSON.stringify(old),state=activatePenetrator(old);
 assert.equal(state.bonuses,1);assert.equal(state.penetrator,true);assert.equal(state.active,old.active);assert.equal(state.holdUsed,true);assert.equal(state.heldPiece,'J');assert.equal(state.fallMs,400);assert.equal(JSON.stringify(old),before);assert.equal(activatePenetrator(state),state);
});
test('activation rejects no-bonus, inactive, paused, game-over and already-active states',()=>{
 const base=startGame(()=> 'T');for(const state of [base,{...idleState(),bonuses:2},{...base,bonuses:2,status:'paused' as const},{...base,bonuses:2,status:'over' as const},{...base,bonuses:2,penetrator:true}])assert.equal(activatePenetrator(state),state);
});
test('Hold is disabled for the activation and the next spawn is ordinary with remaining bonuses',()=>{
 for(const heldPiece of [null,'J'] as const){
  const state=activatePenetrator({...startGame(()=> 'T'),bonuses:2,heldPiece});assert.equal(state.holdUsed,false);assert.equal(holdPiece(state,()=>{throw Error('Unexpected draw');}),state);
  const fresh=spawnNext(state,'O');assert.equal(fresh.penetrator,false);assert.equal(fresh.bonuses,1);assert.equal(fresh.holdUsed,false);assert.notEqual(holdPiece(fresh,()=> 'I'),fresh);
 }
});
test('restart clears all bonuses and penetrator lifetime',()=>{
 const fresh=startGame(()=> 'T');assert.equal(fresh.bonuses,0);assert.equal(fresh.penetrator,false);assert.equal(idleState().bonuses,0);
});
