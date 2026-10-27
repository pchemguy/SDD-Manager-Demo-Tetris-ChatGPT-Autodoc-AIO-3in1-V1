/** Controlled streams and literal command outcomes for the classic reducer. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyBoard, type PieceType } from '../../src/core/geometry.ts';
import { idleState, startGame, spawnNext, command, type GameState } from '../../src/core/game.ts';
const draw = (): PieceType => 'T';
test('idle has no active piece and start consumes exactly one draw', () => {
  assert.equal(idleState().status,'idle'); assert.equal(idleState().active,null);
  let count=0; const s=startGame(()=>{count++;return 'I';});
  assert.equal(count,1); assert.equal(s.status,'running'); assert.equal(s.active?.type,'I');
  assert.equal(s.score,0); assert.equal(s.level,1); assert.equal(s.lines,0);
});
test('left, right and down move by exactly one cell without changing settled state', () => {
  const s=startGame(draw); const original=JSON.stringify(s);
  const a=command(s,'left'); assert.equal(a.active?.x,2); assert.equal(a.active?.y,-1);
  const b=command(a,'right'); assert.equal(b.active?.x,3);
  const c=command(b,'down'); assert.equal(c.active?.y,0); assert.deepEqual(c.board,emptyBoard());
  assert.equal(JSON.stringify(s),original);
});
test('moves reject walls and occupied-cell intersections', () => {
  let s=startGame(()=> 'O'); for(let i=0;i<15;i++)s=command(s,'left');
  assert.equal(s.active?.x,0); assert.deepEqual(command(s,'left'),s);
  const b=emptyBoard();b[1][0]='J';s={...s,board:b,active:{type:'O',x:0,y:-1,rotation:0}};
  assert.deepEqual(command(s,'down'),s);
});
test('baseline rotation changes orientation without wall kicks', () => {
  let s=startGame(draw);s={...s,active:{type:'T',x:3,y:4,rotation:0}};
  const cw=command(s,'rotateCW');assert.equal(cw.active?.rotation,1);assert.equal(cw.active?.x,3);
  assert.equal(command(cw,'rotateCCW').active?.rotation,0);
  s={...s,active:{type:'I',x:-2,y:3,rotation:1}};assert.deepEqual(command(s,'rotateCW'),s);
});
test('blocked spawn ends game without replacing settled cells', () => {
  const b=emptyBoard();b[0][4]='Z';const s:GameState={...idleState(),board:b};
  const n=spawnNext(s,'O');assert.equal(n.status,'over');assert.equal(n.active,null);assert.deepEqual(n.board,b);
});
test('non-running games ignore movement', () => {
  const s={...startGame(draw),status:'over' as const};assert.deepEqual(command(s,'left'),s);
  assert.deepEqual(command(idleState(),'down'),idleState());
});
test('restart creates fresh game fields and does not mutate the abandoned state', () => {
  const old={...startGame(draw),score:900,lines:10,level:2};old.board[19][0]='Z';const before=JSON.stringify(old);
  const fresh=startGame(()=> 'O');assert.equal(fresh.score,0);assert.equal(fresh.lines,0);assert.equal(fresh.level,1);
  assert.deepEqual(fresh.board,emptyBoard());assert.equal(fresh.active?.type,'O');assert.equal(JSON.stringify(old),before);
});
