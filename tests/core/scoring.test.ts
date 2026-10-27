/** Hand-built line-clear fixtures establish compaction and pre-clear level scoring. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {emptyBoard} from '../../src/core/geometry.ts';
import {startGame,lockPiece,descend,tick,gravityMs,type GameState} from '../../src/core/game.ts';
function clearFixture(count:number):GameState{
 const board=emptyBoard();for(let y=20-count;y<20;y++){board[y].fill('J');board[y][4]=null;}
 return {...startGame(()=> 'I'),board,active:{type:'I',x:2,y:16,rotation:1}};
}
for(const [n,points] of [[1,100],[2,300],[3,500],[4,800]])test(`${n} lines clear simultaneously for ${points} points`,()=>{
 const s=clearFixture(n),before=JSON.stringify(s);const next=lockPiece(s,()=> 'T');
 assert.equal(next.lines,n);assert.equal(next.score,points);assert.equal(next.board.flat().filter(Boolean).length,4-n);
 assert.equal(JSON.stringify(s),before);assert.equal(next.active?.type,'T');
});
test('surviving rows compact down and new top rows are independent',()=>{
 const s=clearFixture(2);s.board[0][0]='Z';const n=lockPiece(s,()=> 'T');
 assert.equal(n.board[2][0],'Z');assert.equal(n.board[0][0],null);assert.equal(n.board[1][0],null);
 n.board[0][0]='O';assert.equal(n.board[1][0],null);
});
test('level advances after clear and points use the pre-clear level',()=>{
 const s={...clearFixture(2),lines:8,level:1};const n=lockPiece(s,()=> 'T');
 assert.equal(n.lines,10);assert.equal(n.level,2);assert.equal(n.score,300);assert.equal(gravityMs(n.level),800);
 const m=lockPiece({...clearFixture(4),lines:10,level:2},()=> 'T');assert.equal(m.score,1600);
});
test('soft drop rewards only successful rows; gravity and failed attempts award no drop points',()=>{
 const s=startGame(()=> 'O');assert.equal(descend(s,()=> 'I','soft').score,1);assert.equal(tick(s,1000,()=> 'I').score,0);
 const floor={...s,active:{type:'O' as const,x:0,y:18,rotation:0}};assert.equal(descend(floor,()=> 'I','soft').score,0);
});
test('score saturation preserves an exact non-negative safe integer',()=>{
 const n=lockPiece({...clearFixture(1),score:Number.MAX_SAFE_INTEGER-10},()=> 'T');assert.equal(n.score,Number.MAX_SAFE_INTEGER);assert.ok(Number.isSafeInteger(n.score));
});
