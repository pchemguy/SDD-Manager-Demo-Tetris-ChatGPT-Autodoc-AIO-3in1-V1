/** Translate monotonic animation frames into active-time inputs without host clock I/O in core. */
import {GameSession} from './session.ts';
export function runClock(session:GameSession){
 let previous:number|null=null,status='',handle=0;
 const unsubscribe=session.subscribe(state=>{if(state.status!==status){status=state.status;previous=state.status==='running'?performance.now():null;}});
 const frame=(now:number)=>{const elapsed=previous===null?0:Math.max(0,now-previous);previous=now;if(elapsed>0)session.advance(elapsed);handle=requestAnimationFrame(frame);};
 handle=requestAnimationFrame(frame);
 return()=>{cancelAnimationFrame(handle);unsubscribe();};
}
