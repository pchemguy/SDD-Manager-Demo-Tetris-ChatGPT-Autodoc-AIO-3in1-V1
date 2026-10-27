import test from 'node:test';
import assert from 'node:assert/strict';
import {TYPES} from '../../src/core/geometry.ts';
import {SevenBag} from '../../src/core/randomizer.ts';
test('each seeded bag contains exactly the seven types and is reproducible',()=>{
  const seeded=()=>{let s=123;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296);};
  const a=new SevenBag(seeded()),b=new SevenBag(seeded());
  for(let bag=0;bag<100;bag++){
    const draws=Array.from({length:7},()=>a.next());
    assert.deepEqual([...draws].sort(),[...TYPES].sort());
    assert.deepEqual(draws,Array.from({length:7},()=>b.next()));
  }
});
test('shuffle endpoints stay in bounds and each independent bag draws six random values',()=>{
  let count=0;const bag=new SevenBag(()=>{count++;return 0;});
  assert.deepEqual(Array.from({length:7},()=>bag.next()),['J','L','O','S','T','Z','I']);assert.equal(count,6);
  assert.deepEqual(Array.from({length:7},()=>bag.next()),['J','L','O','S','T','Z','I']);assert.equal(count,12);
  const high=new SevenBag(()=>1-Number.EPSILON);
  assert.deepEqual(Array.from({length:7},()=>high.next()),TYPES);
});
test('reset discards the old remainder without eagerly drawing',()=>{
  let count=0;const bag=new SevenBag(()=>{count++;return 0;});bag.next();bag.reset();assert.equal(count,6);
  assert.equal(bag.next(),'J');assert.equal(count,12);
});
test('invalid random values are rejected before indexing',()=>{
  for(const value of [-1,1,NaN,Infinity])assert.throws(()=>new SevenBag(()=>value).next(),RangeError);
});
