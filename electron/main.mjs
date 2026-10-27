/** Desktop entry: local standard app origin, sandboxed renderer and no remote resources. */
import {app,BrowserWindow,protocol,session} from 'electron';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createAssetHandler,createGameWindow} from './host.mjs';
import {wireDesktopLifecycle} from './lifecycle.mjs';
const here=dirname(fileURLToPath(import.meta.url));
protocol.registerSchemesAsPrivileged([{scheme:'app',privileges:{standard:true,secure:true,supportFetchAPI:true}}]);
await app.whenReady();
const assets=join(app.getAppPath(),app.isPackaged?'web':'dist/web');
protocol.handle('app',await createAssetHandler(assets));
session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
session.defaultSession.setPermissionCheckHandler(()=>false);
session.defaultSession.webRequest.onBeforeRequest((details,callback)=>callback({cancel:!details.url.startsWith('app://tetris/')}));
const window=createGameWindow(BrowserWindow,join(here,'preload.cjs'));
window.once('closed',wireDesktopLifecycle(window));
app.on('window-all-closed',()=>app.quit());
