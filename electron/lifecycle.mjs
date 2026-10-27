/** Convert Electron window suspension events to a narrow renderer notification. */
export function wireDesktopLifecycle(win){
 const suspend=()=>{if(!win.webContents.isDestroyed())win.webContents.send('tetris:suspend');};
 const events=['blur','hide','minimize'];for(const event of events)win.on(event,suspend);
 return()=>{for(const event of events)win.removeListener(event,suspend);};
}
