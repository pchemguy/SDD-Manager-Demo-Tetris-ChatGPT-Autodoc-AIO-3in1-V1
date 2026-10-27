/** Execute the Firefox opener under a controlled user-action API boundary. */
import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
test('Firefox sidebar opens only from the toolbar user action',()=>{
 let click,opens=0;const browser={browserAction:{onClicked:{addListener:value=>{click=value;}}},sidebarAction:{open:()=>{opens++;return Promise.resolve();}}};
 vm.runInNewContext(fs.readFileSync('extensions/firefox/background.js','utf8'),{browser,console});assert.equal(opens,0);click();assert.equal(opens,1);
});
