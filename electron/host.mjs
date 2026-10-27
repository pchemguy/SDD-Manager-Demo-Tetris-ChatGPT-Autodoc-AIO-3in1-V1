/** Fixed-origin compiled asset responses and sandboxed Electron window construction. */
import {readdir,readFile,lstat} from 'node:fs/promises';
import {join} from 'node:path';
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json','.wasm':'application/wasm'};
const CSP="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'";
/** Read an immutable allowlist once; no request can select an arbitrary filesystem path. */
export async function createAssetHandler(root){
 const assets=new Map();
 async function collect(directory,prefix=''){
  if((await lstat(directory)).isSymbolicLink())throw new Error('Asset links are prohibited');
  for(const item of await readdir(directory,{withFileTypes:true})){
   const file=join(directory,item.name),name=prefix+item.name;
   if(item.isSymbolicLink())throw new Error('Asset links are prohibited');
   if(item.isDirectory())await collect(file,name+'/');
   else if(item.isFile()&&!name.split('/').some(part=>part.startsWith('.'))){
    const extension=name.slice(name.lastIndexOf('.'));if(TYPES[extension])assets.set('/'+name,{bytes:await readFile(file),type:TYPES[extension]});
   }
  }
 }
 await collect(root);if(!assets.has('/index.html'))throw new Error('Compiled index.html is required');
 return async request=>{
  const deny=(status)=>new Response(null,{status});
  if(!['GET','HEAD'].includes(request.method))return deny(405);
  try{
   const rawPath=/^[a-z]+:\/\/[^/]+(\/[^?#]*)?/.exec(request.url)?.[1]??'/';
   if(rawPath.includes('%')||rawPath.includes('\\')||rawPath.split('/').some(part=>part==='.'||part==='..'))return deny(403);
   const url=new URL(request.url);if(url.protocol!=='app:'||url.hostname!=='tetris'||url.port||url.username||url.password)return deny(403);
   const asset=assets.get(url.pathname==='/'?'/index.html':url.pathname);if(!asset)return deny(404);
   return new Response(request.method==='HEAD'?null:asset.bytes,{headers:{'Content-Type':asset.type,'Content-Security-Policy':CSP,'X-Content-Type-Options':'nosniff'}});
  }catch{return deny(400);}
 };
}
/** Allow only the application document; prevent arbitrary renderer navigation. */
function appPage(value){try{const url=new URL(value);return url.protocol==='app:'&&url.host==='tetris'&&!url.username&&!url.password&&(url.pathname==='/'||url.pathname==='/index.html');}catch{return false;}}
export function createGameWindow(BrowserWindow,preload){
 const win=new BrowserWindow({width:1200,height:900,minWidth:360,minHeight:600,backgroundColor:'#11171f',autoHideMenuBar:true,webPreferences:{preload,nodeIntegration:false,contextIsolation:true,sandbox:true,webviewTag:false,webSecurity:true,allowRunningInsecureContent:false}});
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',(event,url)=>{if(!appPage(url))event.preventDefault();});
 win.webContents.on('will-redirect',(event,url)=>{if(!appPage(url))event.preventDefault();});
 win.loadURL('app://tetris/').catch(()=>{console.error('Unable to load bundled game assets.');win.close();});return win;
}
