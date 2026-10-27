/** Exact repeat timing and pause remainder checks use controlled active time. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {KeyRepeater} from '../../src/app/input.ts';
import {GameSession} from '../../src/app/session.ts';
import type {GameState} from '../../src/core/game.ts';
test('horizontal repeat waits 150 ms then repeats at 50 ms intervals',()=>{
 const seen:string[]=[];const r=new KeyRepeater(a=>seen.push(a));r.press('ArrowLeft','left');r.press('ArrowLeft','left');assert.equal(seen.length,1);
 r.advance(149);assert.equal(seen.length,1);r.advance(1);assert.equal(seen.length,2);r.advance(49);assert.equal(seen.length,2);r.advance(1);assert.equal(seen.length,3);
 r.release('ArrowLeft');r.advance(500);assert.equal(seen.length,3);
});
test('down repeats at 50 ms but rotation stays one action per press',()=>{
 const seen:string[]=[];const r=new KeyRepeater(a=>seen.push(a));r.press('ArrowDown','down');r.advance(49);assert.equal(seen.length,1);r.advance(1);assert.equal(seen.length,2);r.clear();
 r.press('KeyX','rotateCW');r.advance(10000);assert.equal(seen.length,3);r.release('KeyX');r.press('KeyX','rotateCW');assert.equal(seen.length,4);
});
test('clearing keys prevents stale repeat and permits a fresh press',()=>{
 const seen:string[]=[];const r=new KeyRepeater(a=>seen.push(a));r.press('ArrowRight','right');r.clear();r.advance(5000);assert.deepEqual(seen,['right']);r.press('ArrowRight','right');assert.deepEqual(seen,['right','right']);
});
test('pause preserves fall remainder and resume excludes suspended duration',()=>{
 const s=new GameSession(()=> 'I');let state:Readonly<GameState>|undefined;s.subscribe(n=>{state=n;});s.start();s.advance(799);s.pause();assert.equal(state!.status,'paused');
 s.advance(10000);assert.equal(state!.fallMs,799);s.togglePause();s.advance(200);assert.equal(state!.active?.y,-1);s.advance(1);assert.equal(state!.active?.y,0);
});
