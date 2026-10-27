/** Browser composition; desktop and sidebar hosts reuse the application and view. */
import {GameSession} from '../app/session.ts';
import {runClock} from '../app/clock.ts';
import {mountGame} from '../ui/app.ts';
import '../ui/style.css';
import {connectChromiumLifecycle,type ChromeLifecycleAPI} from '../platform/chromium.ts';
import {connectFirefoxLifecycle} from '../platform/firefox.ts';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw new Error('Application root is missing.');
const session=new GameSession();
const view=mountGame(root,session);
runClock(session,view.advanceInput);

const chromeHost=(globalThis as {chrome?:ChromeLifecycleAPI&{sidePanel?:unknown}}).chrome;
if(chromeHost?.sidePanel&&chromeHost.runtime?.id)connectChromiumLifecycle(chromeHost,()=>window.dispatchEvent(new Event('blur')));

const firefoxHost=(globalThis as {browser?:{runtime?:{id?:string};sidebarAction?:unknown}}).browser;
if(firefoxHost?.runtime?.id&&firefoxHost.sidebarAction)connectFirefoxLifecycle(window,()=>window.dispatchEvent(new Event('blur')));
