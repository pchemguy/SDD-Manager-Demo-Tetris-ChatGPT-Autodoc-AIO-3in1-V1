/** Model desktop host events and execute the actual isolated preload; native Windows is waived. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {wireDesktopLifecycle} from '../../electron/lifecycle.mjs';
test('desktop blur, hide and minimize suspend; focus, show and restore never auto-resume',()=>{
 const win=new EventEmitter(),sent=[];win.webContents={isDestroyed:()=>false,send:(...args)=>sent.push(args)};wireDesktopLifecycle(win);
 for(const event of ['blur','hide','minimize'])win.emit(event);
 assert.deepEqual(sent,[['tetris:suspend'],['tetris:suspend'],['tetris:suspend']]);
 for(const event of ['focus','show','restore'])win.emit(event);assert.equal(sent.length,3);
});
test('closed/disposed windows receive no further host messages',()=>{
 const win=new EventEmitter(),sent=[];let destroyed=false;win.webContents={isDestroyed:()=>destroyed,send:value=>sent.push(value)};
 const dispose=wireDesktopLifecycle(win);destroyed=true;win.emit('blur');assert.deepEqual(sent,[]);destroyed=false;dispose();win.emit('hide');assert.deepEqual(sent,[]);
});
test('preload forwards suspension as a DOM blur without exposing Node or IPC objects',async()=>{
 const ipc=new EventEmitter(),window=new EventTarget();let blurs=0;window.addEventListener('blur',()=>blurs++);
 const context={require:name=>{assert.equal(name,'electron');return{ipcRenderer:ipc};},window,Event};vm.runInNewContext(await readFile(new URL('../../electron/preload.cjs',import.meta.url),'utf8'),context);
 ipc.emit('tetris:suspend',{sender:{privileged:'synthetic'}},{unsafe:'ignored'});assert.equal(blurs,1);assert.equal(window.electron,undefined);assert.equal(window.ipcRenderer,undefined);assert.equal(window.require,undefined);
 ipc.emit('unrelated');assert.equal(blurs,1);
});
