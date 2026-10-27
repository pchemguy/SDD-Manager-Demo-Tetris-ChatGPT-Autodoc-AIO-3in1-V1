/** Validate one sidebar candidate, then run the pinned headless suite with an isolated browser root. */
import {spawnSync,spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const target=process.argv[2];if(!['chromium','firefox'].includes(target))throw new Error('Expected chromium or firefox target');
const prepare=spawnSync('python',[fileURLToPath(new URL('./prepare_extension_test.py',import.meta.url)),target],{stdio:'inherit',timeout:30000});
if(prepare.error||prepare.status!==0)process.exit(prepare.status??1);
const child=spawn(process.execPath,[fileURLToPath(new URL('../node_modules/playwright/cli.js',import.meta.url)),'test','--config','playwright.extension.config.ts',...process.argv.slice(3)],{stdio:'inherit',env:{...process.env,TETRIS_EXTENSION_TARGET:target,PLAYWRIGHT_BROWSERS_PATH:fileURLToPath(new URL('../.browser-cache',import.meta.url))}});
child.on('error',error=>{console.error(error.message);process.exitCode=1;});child.on('exit',code=>{process.exitCode=code??1;});
