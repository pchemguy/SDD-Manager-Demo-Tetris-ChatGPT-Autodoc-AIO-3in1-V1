/** Session events integrate real reducers with a controlled piece source and clock. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {GameSession} from '../../src/app/session.ts';
import type {GameState} from '../../src/core/game.ts';
test('active time and soft input publish coherent game snapshots',()=>{
 const s=new GameSession(()=> 'S');let state:Readonly<GameState>|undefined;s.subscribe(n=>{state=n;});s.start();
 s.advance(999);assert.equal(state!.active?.y,-1);s.advance(1);assert.equal(state!.active?.y,0);
 s.act('down');assert.equal(state!.score,1);assert.equal(state!.active?.y,1);
});
test('game completion is emitted once and restart permits a separate completion',()=>{
 const s=new GameSession(()=> 'O');let count=0;s.onComplete(()=>{count++;});s.start();s.advance(250000);assert.equal(count,1);
 s.advance(250000);s.act('down');assert.equal(count,1);s.start();s.advance(250000);assert.equal(count,2);
});
test('abandoning a running game produces no completed result',()=>{
 const s=new GameSession(()=> 'O');let count=0;s.onComplete(()=>{count++;});s.start();s.advance(20000);s.start();assert.equal(count,0);
});
test('removed subscribers stop receiving snapshots and completions are not replayed',()=>{
 const s=new GameSession(()=> 'O');let snapshots=0;const stop=s.subscribe(()=>{snapshots++;});stop();s.start();s.advance(250000);assert.equal(snapshots,1);
 let completions=0;s.onComplete(()=>{completions++;});assert.equal(completions,0);s.start();s.advance(250000);assert.equal(completions,1);
});
