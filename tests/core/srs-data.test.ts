import test from 'node:test';
import assert from 'node:assert/strict';
import {TYPES,cells} from '../../src/core/geometry.ts';
import {ROTATION_CENTERS,KICKS} from '../../src/core/srs-data.ts';
import {ORIENTATIONS,CENTERS,UP_KICKS} from '../fixtures/srs.ts';
for(const type of TYPES)for(let rotation=0;rotation<4;rotation++)test(`${type} SRS orientation ${rotation} matches independent local cells`,()=>{
 const actual=cells({type,rotation,x:0,y:0}).map(p=>[p.x,p.y].join(',')).sort();
 assert.deepEqual(actual,ORIENTATIONS[type][rotation].map(p=>p.join(',')).sort());
 assert.deepEqual(ROTATION_CENTERS[type],CENTERS[type]);assert.equal(new Set(actual).size,4);
});
test('all ordered kick tables convert reference y-up into board y-down',()=>{
 for(const family of ['JLSTZ','I'] as const){
  assert.equal(Object.keys(KICKS[family]).length,8);
  for(const [transition,reference] of Object.entries(UP_KICKS[family]))assert.deepEqual(KICKS[family][transition],reference.map(([x,y])=>[x,y===0?0:-y]));
 }
 assert.deepEqual(KICKS.JLSTZ['0>1'][2],[-1,-1]);assert.deepEqual(KICKS.I['0>1'][4],[1,-2]);
});
