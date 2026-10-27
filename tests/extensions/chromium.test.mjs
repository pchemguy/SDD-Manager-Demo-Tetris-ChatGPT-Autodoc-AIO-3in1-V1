/** Execute the actual background script with controlled browser API event delivery. */
import {test} from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import fs from 'node:fs';
test('closed/opened native panel notifications contain only a valid target window',async()=>{
 const callbacks={},messages=[];let opener;
 const chrome={sidePanel:{setPanelBehavior:async value=>{opener=value;},onClosed:{addListener:fn=>callbacks.closed=fn},onOpened:{addListener:fn=>callbacks.opened=fn}},runtime:{sendMessage:async value=>{messages.push(JSON.parse(JSON.stringify(value)));}}};
 vm.runInNewContext(fs.readFileSync('extensions/chromium/background.js','utf8'),{chrome,console});
 assert.equal(opener.openPanelOnActionClick,true);callbacks.closed({path:'other.html',windowId:3});callbacks.closed({path:'index.html',windowId:'3'});assert.deepEqual(messages,[]);
 callbacks.closed({path:'index.html',windowId:3});callbacks.opened({path:'index.html',windowId:3});assert.deepEqual(messages,[{type:'blockfield:suspend',windowId:3},{type:'blockfield:suspend',windowId:3}]);
});
