/** Game-focused input with deterministic repeats independent of native key-repeat rate. */
import type {SessionAction as Action} from './session.ts';
import {GameSession} from './session.ts';
export class KeyRepeater {
 private keys=new Map<string,{action:Action;remaining:number}>();
 private readonly emit:(action:Action)=>void;
 constructor(emit:(action:Action)=>void){this.emit=emit;}
 press(key:string,action:Action){
  if(this.keys.has(key))return;
  this.keys.set(key,{action,remaining:action==='left'||action==='right'?150:action==='down'?50:Infinity});this.emit(action);
 }
 release(key:string){this.keys.delete(key);}
 advance(elapsed:number){
  for(const [key,item] of this.keys){item.remaining-=elapsed;while(item.remaining<=0&&this.keys.has(key)){item.remaining+=50;this.emit(item.action);}}
 }
 clear(){this.keys.clear();}
}
/** Bind only board input; application suspension clears held keys and never auto-resumes. */
export function keyboardControls(board:HTMLCanvasElement,session:GameSession){
 const keys=new KeyRepeater(action=>session.act(action));let running=false;
 const stop=session.subscribe(state=>{running=state.status==='running';if(!running)keys.clear();});
 const actions:Record<string,Action>={ArrowLeft:'left',ArrowRight:'right',ArrowDown:'down',ArrowUp:'rotateCW',x:'rotateCW',X:'rotateCW',z:'rotateCCW',Z:'rotateCCW',c:'hold',C:'hold',Shift:'hold',' ':'hardDrop'};
 const down=(event:KeyboardEvent)=>{
  if(event.key==='p'||event.key==='P'||event.key==='Escape'){event.preventDefault();if(!event.repeat)session.togglePause();return;}
  const action=actions[event.key];if(!action)return;event.preventDefault();if(running&&!event.repeat)keys.press(event.code||event.key,action);
 };
 const up=(event:KeyboardEvent)=>keys.release(event.code||event.key);
 const clear=()=>keys.clear();const suspend=()=>{keys.clear();session.pause();};const visibility=()=>{if(document.hidden)suspend();};
 board.addEventListener('keydown',down);board.addEventListener('blur',clear);window.addEventListener('keyup',up);window.addEventListener('blur',suspend);document.addEventListener('visibilitychange',visibility);
 return {advance:(elapsed:number)=>keys.advance(elapsed),dispose:()=>{stop();keys.clear();board.removeEventListener('keydown',down);board.removeEventListener('blur',clear);window.removeEventListener('keyup',up);window.removeEventListener('blur',suspend);document.removeEventListener('visibilitychange',visibility);}};
}
