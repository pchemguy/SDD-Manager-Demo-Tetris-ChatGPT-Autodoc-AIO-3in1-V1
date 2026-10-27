/** Run the pinned Playwright CLI with one absolute, project-owned browser root. */
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const child=spawn(process.execPath,[fileURLToPath(new URL('../node_modules/playwright/cli.js',import.meta.url)),...process.argv.slice(2)],{
  stdio:'inherit',env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:fileURLToPath(new URL('../.browser-cache',import.meta.url))}
});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',(code,signal)=>{process.exitCode=code??(signal?1:0);});
