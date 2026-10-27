import test from 'node:test';
import assert from 'node:assert/strict';
import {TYPES,cells,emptyBoard,canPlace,type Piece} from '../../src/core/geometry.ts';
import {rotateSRS} from '../../src/core/rotation.ts';
import {ORIENTATIONS} from '../fixtures/srs.ts';
test('CW and CCW use every canonical orientation, including hidden spawn cells and stationary O geometry',()=>{
 for(const type of TYPES)for(let from=0;from<4;from++)for(const direction of [1,-1] as const){
  const p={type,rotation:from,x:3,y:-1},next=rotateSRS(emptyBoard(),p,direction),to=(from+direction+4)%4;
  assert.deepEqual(next,{...p,rotation:to});
  assert.deepEqual(cells(next).map(q=>`${q.x-3},${q.y+1}`).sort(),ORIENTATIONS[type][to].map(p=>p.join(',')).sort());
 }
});
const cases:[string,Piece,1|-1,number,number][]=[
 ['JLSTZ left wall',{type:'J',rotation:1,x:-1,y:4},1,0,4],
 ['JLSTZ right wall CCW',{type:'T',rotation:3,x:8,y:4},-1,7,4],
 ['I skips two invalid wall candidates',{type:'I',rotation:1,x:-2,y:4},1,0,4],
 ['I right wall CCW',{type:'I',rotation:3,x:8,y:4},-1,6,4],
 ['JLSTZ floor CW',{type:'T',rotation:0,x:3,y:18},1,2,17],
 ['JLSTZ floor CCW',{type:'T',rotation:0,x:3,y:18},-1,4,17],
 ['I floor CW fifth candidate',{type:'I',rotation:0,x:3,y:18},1,4,16],
 ['I floor CCW fourth candidate',{type:'I',rotation:0,x:3,y:18},-1,2,16]
];
for(const [name,p,direction,x,y] of cases)test(name,()=>{
 const board=emptyBoard();assert.equal(canPlace(board,p),true);const result=rotateSRS(board,Object.freeze(p),direction);
 assert.deepEqual(result,{...p,rotation:(p.rotation+direction+4)%4,x,y});assert.equal(canPlace(board,result),true);assert.deepEqual(board,emptyBoard());
});
test('stack collision chooses the earliest valid candidate without mutating settled cells',()=>{
 const board=emptyBoard();board[7][4]='Z';const before=JSON.stringify(board);
 assert.deepEqual(rotateSRS(board,{type:'T',rotation:0,x:3,y:5},1),{type:'T',rotation:1,x:2,y:5});assert.equal(JSON.stringify(board),before);
});
test('complete candidate rejection returns the original piece and leaves the board intact',()=>{
 const board=emptyBoard(),p:Piece={type:'T',rotation:0,x:3,y:5};board.forEach(row=>row.fill('Z'));
 for(const c of cells(p))board[c.y][c.x]=null;const before=JSON.stringify(board);
 assert.equal(canPlace(board,p),true);assert.equal(rotateSRS(board,p,1),p);assert.equal(rotateSRS(board,p,-1),p);assert.equal(JSON.stringify(board),before);
});
