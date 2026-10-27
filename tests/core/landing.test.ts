import test from 'node:test';
import assert from 'node:assert/strict';
import {TYPES,emptyBoard,spawn,type Piece} from '../../src/core/geometry.ts';
import {projectLanding} from '../../src/core/landing.ts';
import {ORIENTATIONS} from '../fixtures/srs.ts';
test('every normal orientation rests against the empty floor, including hidden-row starts',()=>{
 for(const type of TYPES)for(let rotation=0;rotation<4;rotation++){
  const piece={...spawn(type),rotation},board=emptyBoard(),before=JSON.stringify(board),expectedY=19-Math.max(...ORIENTATIONS[type][rotation].map(p=>p[1]));
  assert.deepEqual(projectLanding(board,Object.freeze(piece)),{...piece,y:expectedY});assert.equal(JSON.stringify(board),before);
 }
});
test('normal projection stops at the first obstruction and never jumps into a deeper empty region',()=>{
 const board=emptyBoard();board[10][4]='J';
 assert.deepEqual(projectLanding(board,{type:'O',rotation:0,x:4,y:-1}),{type:'O',rotation:0,x:4,y:8});assert.equal(board[10][4],'J');
});
test('a reachable narrow well accepts O but supports I above its opening',()=>{
 const board=emptyBoard();for(let y=16;y<20;y++)for(let x=0;x<10;x++)if(x!==4&&x!==5)board[y][x]='Z';
 assert.equal(projectLanding(board,{type:'O',rotation:0,x:4,y:-1}).y,18);
 assert.equal(projectLanding(board,{type:'I',rotation:0,x:3,y:-1}).y,14);
});
test('immediate support and hidden spawn support preserve the current placement',()=>{
 const board=emptyBoard();board[10][4]='J';const grounded:Piece={type:'O',rotation:0,x:4,y:8};assert.equal(projectLanding(board,grounded),grounded);
 const hidden=spawn('T'),spawnBoard=emptyBoard();spawnBoard[1][4]='Z';assert.equal(projectLanding(spawnBoard,hidden),hidden);assert.equal(hidden.y,-1);
});
test('invalid initial placements are rejected without changing the caller board',()=>{
 const board=emptyBoard();assert.throws(()=>projectLanding(board,{type:'O',rotation:0,x:-1,y:0}),RangeError);assert.deepEqual(board,emptyBoard());
});
