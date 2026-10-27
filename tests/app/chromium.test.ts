/** Explicit runtime-message fixtures verify window-scoped sidebar suspension without native Chrome. */
import {test} from 'node:test';import assert from 'node:assert/strict';
import {connectChromiumLifecycle,type ChromeLifecycleAPI} from '../../src/platform/chromium.ts';
test('only authenticated suspension for this window pauses, with no automatic resume',async()=>{
 let listener:((message:unknown,sender:{id?:string})=>void)|undefined;let removed=false,count=0;
 const api:ChromeLifecycleAPI={runtime:{id:'own',onMessage:{addListener:value=>{listener=value;},removeListener:()=>{removed=true;}}},windows:{getCurrent:async()=>({id:7})}};
 const stop=connectChromiumLifecycle(api,()=>count++);await Promise.resolve();
 listener!({type:'blockfield:suspend',windowId:7},{id:'foreign'});listener!({type:'blockfield:suspend',windowId:8},{id:'own'});listener!({type:'resume',windowId:7},{id:'own'});listener!(null,{id:'own'});assert.equal(count,0);
 listener!({type:'blockfield:suspend',windowId:7},{id:'own'});assert.equal(count,1);stop();assert.equal(removed,true);
});
