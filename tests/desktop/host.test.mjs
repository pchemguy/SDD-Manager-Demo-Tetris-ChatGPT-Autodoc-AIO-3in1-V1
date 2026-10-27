/** Contract checks for real asset responses and Electron window policy, without Windows execution. */
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,symlink,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {EventEmitter} from 'node:events';
import {createAssetHandler,createGameWindow} from '../../electron/host.mjs';
async function fixture(run){const root=await mkdtemp(join(tmpdir(),'tetris-host-'));try{await mkdir(join(root,'assets'));await writeFile(join(root,'index.html'),'<main>Game</main>');await writeFile(join(root,'assets/game.js'),'export const game=true;');await writeFile(join(root,'private.tkn'),'synthetic-only');await run(root);}finally{await rm(root,{recursive:true,force:true});}}
test('fixed app origin serves only compiled assets with MIME and restrictive CSP',()=>fixture(async root=>{
 const handle=await createAssetHandler(root);const response=await handle({url:'app://tetris/',method:'GET'});assert.equal(response.status,200);assert.equal(await response.text(),'<main>Game</main>');assert.match(response.headers.get('content-type'),/text\/html/);assert.match(response.headers.get('content-security-policy'),/script-src 'self'/);assert.match(response.headers.get('content-security-policy'),/object-src 'none'/);
 const script=await handle({url:'app://tetris/assets/game.js',method:'GET'});assert.equal(await script.text(),'export const game=true;');assert.match(script.headers.get('content-type'),/javascript/);
}));
test('foreign origins, private files, encoded traversal and non-assets are denied',()=>fixture(async root=>{
 const handle=await createAssetHandler(root);
 for(const url of ['https://tetris/index.html','app://evil/index.html','app://user@tetris/index.html','app://tetris:80/index.html','app://tetris/private.tkn','app://tetris/assets/../index.html','app://tetris/%2e%2e/index.html','app://tetris/assets%2fgame.js','app://tetris/%252e%252e/private.tkn','app://tetris/unknown.js','app://tetris/\\private.tkn'])assert.ok((await handle({url,method:'GET'})).status>=400,url);
}));
test('only GET/HEAD work and HEAD returns no body',()=>fixture(async root=>{
 const handle=await createAssetHandler(root);assert.equal((await handle({url:'app://tetris/',method:'POST'})).status,405);const head=await handle({url:'app://tetris/',method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
}));
test('asset symlinks cannot expose an external resource',()=>fixture(async root=>{
 await symlink(join(root,'private.tkn'),join(root,'assets/leak.js'));await assert.rejects(createAssetHandler(root),/link/i);
}));
test('window enforces renderer isolation and denies external navigation/popups',()=>{
 let options,window;class FakeWindow extends EventEmitter{constructor(value){super();options=value;window=this;this.webContents=new EventEmitter();this.webContents.setWindowOpenHandler=fn=>{this.open=fn;};}loadURL(value){this.url=value;return Promise.resolve();}}
 createGameWindow(FakeWindow,'/owned/preload.cjs');assert.equal(options.webPreferences.nodeIntegration,false);assert.equal(options.webPreferences.contextIsolation,true);assert.equal(options.webPreferences.sandbox,true);assert.equal(options.webPreferences.webviewTag,false);assert.equal(window.url,'app://tetris/');assert.deepEqual(window.open({url:'https://example.test'}),{action:'deny'});
 let prevented=false;window.webContents.emit('will-navigate',{preventDefault(){prevented=true;}},'https://example.test');assert.equal(prevented,true);
 prevented=false;window.webContents.emit('will-navigate',{preventDefault(){prevented=true;}},'app://tetris/?ghost=hide');assert.equal(prevented,false);
});
