/** A narrow, window-scoped runtime bridge; game state stays in the panel document. */
export interface ChromeLifecycleAPI {
 runtime:{id:string;onMessage:{addListener:(listener:(message:unknown,sender:{id?:string})=>void)=>void;removeListener:(listener:(message:unknown,sender:{id?:string})=>void)=>void}};
 windows:{getCurrent:()=>Promise<{id?:number}>};
}
export function connectChromiumLifecycle(api:ChromeLifecycleAPI,suspend:()=>void){
 let windowId:number|null=null,disposed=false;
 void api.windows.getCurrent().then(value=>{if(!disposed&&Number.isInteger(value.id))windowId=value.id!;}).catch(()=>{if(!disposed)suspend();});
 const listener=(message:unknown,sender:{id?:string})=>{
  if(disposed||sender.id!==api.runtime.id||!message||typeof message!=='object')return;
  const value=message as {type?:unknown;windowId?:unknown};
  if(value.type==='blockfield:suspend'&&Number.isInteger(value.windowId)&&(windowId===null||value.windowId===windowId))suspend();
 };
 api.runtime.onMessage.addListener(listener);
 return()=>{disposed=true;api.runtime.onMessage.removeListener(listener);};
}
