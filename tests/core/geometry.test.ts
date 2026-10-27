/** Literal shape and boundary fixtures independent of the geometry implementation. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { TYPES, emptyBoard, cells, spawn, canPlace, type Piece } from '../../src/core/geometry.ts';
const coordinates = (p: Piece) => cells(p).map(c => `${c.x},${c.y}`).sort();
const expected = {
  I: ['3,0', '4,0', '5,0', '6,0'],
  J: ['3,-1', '3,0', '4,0', '5,0'],
  L: ['5,-1', '3,0', '4,0', '5,0'],
  O: ['4,-1', '5,-1', '4,0', '5,0'],
  S: ['4,-1', '5,-1', '3,0', '4,0'],
  T: ['4,-1', '3,0', '4,0', '5,0'],
  Z: ['3,-1', '4,-1', '4,0', '5,0']
};
test('fresh board has twenty independent empty rows', () => {
  const b = emptyBoard(); assert.equal(b.length, 20); assert.ok(b.every(r => r.length === 10 && r.every(c => c === null)));
  b[0][0] = 'I'; assert.equal(b[1][0], null); assert.equal(emptyBoard()[0][0], null);
});
for (const type of TYPES) test(`${type} spawns centered with lowest row zero`, () => {
  const p = spawn(type); assert.equal(p.rotation, 0); assert.deepEqual(coordinates(p), [...expected[type]].sort());
  assert.equal(new Set(coordinates(p)).size, 4); assert.ok(canPlace(emptyBoard(), p));
});
test('clockwise orientation uses the correct square rotation center', () => {
  assert.deepEqual(coordinates({type:'I', x:0,y:0,rotation:1}), ['2,0','2,1','2,2','2,3']);
  assert.deepEqual(coordinates({type:'T', x:0,y:0,rotation:1}), ['1,0','1,1','1,2','2,1']);
  assert.deepEqual(coordinates({type:'O', x:0,y:0,rotation:3}), ['0,0','0,1','1,0','1,1']);
});
test('walls, floor and hidden-row ceiling are hard bounds', () => {
  const b = emptyBoard(); const p: Piece = {type:'O',rotation:0,x:0,y:0};
  for (const patch of [{x:-1},{x:9},{y:19},{y:-5}]) assert.equal(canPlace(b,{...p,...patch}),false);
  assert.equal(canPlace(b,{...p,y:-4}),true); assert.equal(canPlace(b,{...p,x:8,y:18}),true);
});
test('settled cells block only intersecting visible cells', () => {
  const b=emptyBoard(); const p=spawn('O'); b[0][4]='J'; assert.equal(canPlace(b,p),false);
  b[0][4]=null; b[19][9]='Z'; assert.equal(canPlace(b,p),true);
  const before=JSON.stringify(b); cells(p); canPlace(b,p); assert.equal(JSON.stringify(b),before);
});
