/** Document-local game orchestration with terminal-transition completion events. */
import {TYPES,type PieceType} from '../core/geometry.ts';
import {idleState,startGame,command,descend,tick,type Action,type GameState} from '../core/game.ts';
export class GameSession {
  private state:GameState=idleState();
  private readonly next:()=>PieceType;
  private listeners=new Set<(state:Readonly<GameState>)=>void>();
  private completions=new Set<(score:number)=>void>();
  constructor(next:()=>PieceType=()=>TYPES[Math.floor(Math.random()*TYPES.length)]){this.next=next;}
  subscribe(listener:(state:Readonly<GameState>)=>void){this.listeners.add(listener);listener(this.state);return()=>{this.listeners.delete(listener);};}
  onComplete(listener:(score:number)=>void){this.completions.add(listener);return()=>{this.completions.delete(listener);};}
  start(){this.commit(startGame(this.next));}
  act(action:Action){this.commit(action==='down'?descend(this.state,this.next,'soft'):command(this.state,action));}
  advance(elapsed:number){this.commit(tick(this.state,elapsed,this.next));}
  private commit(next:GameState){
    if(next===this.state)return;
    const completed=this.state.status!=='over'&&next.status==='over';this.state=next;
    for(const listener of this.listeners)listener(this.state);
    if(completed)for(const listener of this.completions)listener(this.state.score);
  }
}
