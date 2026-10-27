/** Document lifecycle fixtures preserve timing/session boundaries without native Firefox chrome. */
import {test} from 'node:test';import assert from 'node:assert/strict';
import {connectFirefoxLifecycle} from '../../src/platform/firefox.ts';
import {GameSession} from '../../src/app/session.ts';
import type {GameState} from '../../src/core/game.ts';
test('page hide and restored document suspend, preserve remainder and require manual resume',()=>{
 const host=new EventTarget(),session=new GameSession(()=> 'O');let state:Readonly<GameState>;session.subscribe(value=>state=value);session.start();session.advance(700);const y=state!.active!.y;
 const dispose=connectFirefoxLifecycle(host,()=>session.pause());host.dispatchEvent(new Event('pagehide'));session.advance(5000);assert.equal(state!.status,'paused');assert.equal(state!.active!.y,y);
 host.dispatchEvent(new Event('pageshow'));assert.equal(state!.status,'paused');session.togglePause();session.advance(299);assert.equal(state!.active!.y,y);session.advance(1);assert.equal(state!.active!.y,y+1);
 dispose();host.dispatchEvent(new Event('pagehide'));assert.equal(state!.status,'running');
});
test('a destroyed document leaves no persistent session replica',()=>{
 const old=new GameSession(()=> 'I');old.start();old.act('down');const fresh=new GameSession(()=> 'I');let state:Readonly<GameState>;fresh.subscribe(value=>state=value);assert.equal(state!.status,'idle');assert.equal(state!.score,0);assert.equal(state!.active,null);
});
