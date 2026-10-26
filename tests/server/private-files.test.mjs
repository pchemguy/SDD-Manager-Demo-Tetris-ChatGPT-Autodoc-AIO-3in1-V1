/** Private development files must never be served by the loopback dev host. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {writeFile,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
import {once} from 'node:events';
test('Vite denies credential file paths without reading any real credential', {timeout:15000},async()=>{
 const fixture=resolve('private-route-fixture.tkn');await writeFile(fixture,'synthetic development fixture only\n',{flag:'wx'});
 const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4174'],{stdio:'ignore'});
 try{
  let ready=false;for(let i=0;i<60;i++){try{await fetch('http://127.0.0.1:4174/',{method:'HEAD'});ready=true;break;}catch{await new Promise(r=>setTimeout(r,100));}}assert.ok(ready,'dev server starts');
  for(const path of ['/private-route-fixture.tkn','/private-route-fixture%2Etkn','/private-route-fixture.tkn?raw','/@fs'+fixture.replaceAll('\\','/')]){
   const response=await fetch('http://127.0.0.1:4174'+path,{method:'HEAD'});assert.equal(response.status,403,'private route must be denied: '+path);
  }
 }finally{server.kill('SIGTERM');await once(server,'exit');await unlink(fixture);}
});
