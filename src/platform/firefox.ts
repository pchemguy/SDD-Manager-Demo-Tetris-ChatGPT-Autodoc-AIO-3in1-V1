/** Suspend Firefox panel documents on hide and bfcache restoration; never resume implicitly. */
export function connectFirefoxLifecycle(target:EventTarget,suspend:()=>void){
 const events=['pagehide','pageshow'];for(const event of events)target.addEventListener(event,suspend);
 return()=>{for(const event of events)target.removeEventListener(event,suspend);};
}
