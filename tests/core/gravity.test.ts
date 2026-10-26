/** Explicit elapsed-time and hand-built resting placements protect classic locking. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyBoard} from '../../src/core/geometry.ts';
import {startGame,tick,descend,type GameState} from '../../src/core/game.ts';
const resting=():GameState=>({...startGame(()=> 'O'),active:{type:'O',x:0,y:18,rotation:0}});
test('gravity uses full elapsed intervals and retains the remainder',()=>{
 const s=startGame(()=> 'T');const a=tick(s,999,()=> 'I');assert.equal(a.active?.y,-1);assert.equal(a.fallMs,999);
 const b=tick(a,1,()=> 'I');assert.equal(b.active?.y,0);assert.equal(b.fallMs,0);
 const c=tick(s,2500,()=> 'I');assert.equal(c.active?.y,1);assert.equal(c.fallMs,500);
});
test('a failed downward attempt locks once and spawns exactly one new piece',()=>{
 let draws=0;const s=resting();const n=descend(s,()=>{draws++;return 'T';});
 assert.equal(draws,1);assert.deepEqual(n.board[18].slice(0,2),['O','O']);assert.deepEqual(n.board[19].slice(0,2),['O','O']);assert.equal(n.active?.type,'T');assert.equal(s.board[18][0],null);
});
test('gravity locks at a failed attempt and continues remaining active elapsed time',()=>{
 const n=tick(resting(),2000,()=> 'I');assert.equal(n.active?.type,'I');assert.equal(n.active?.y,0);assert.equal(n.fallMs,0);
 assert.equal(n.board.flat().filter(Boolean).length,4);
});
test('locking above the visible ceiling ends play without writing any cells',()=>{
 const b=emptyBoard();b[1][4]='J';b[1][5]='J';const s={...startGame(()=> 'O'),board:b};let draws=0;
 const n=descend(s,()=>{draws++;return 'I';});assert.equal(n.status,'over');assert.equal(n.active,null);assert.equal(draws,0);assert.deepEqual(n.board,b);
});
test('paused and game-over states ignore elapsed time and downward commands',()=>{
 for(const status of ['paused','over'] as const){const s={...resting(),status,fallMs:750};assert.deepEqual(tick(s,5000,()=> 'I'),s);assert.deepEqual(descend(s,()=> 'I'),s);}
});
test('invalid active elapsed time is rejected',()=>{
 for(const value of [-1,Infinity,NaN])assert.throws(()=>tick(startGame(()=> 'I'),value,()=> 'T'),RangeError);
});
