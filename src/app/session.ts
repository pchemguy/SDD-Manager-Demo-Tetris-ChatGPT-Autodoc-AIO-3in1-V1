/** Document-local game orchestration with terminal-transition completion events. */
import {type PieceType} from '../core/geometry.ts';
import {SevenBag} from '../core/randomizer.ts';
import {idleState,startGame,holdPiece,hardDrop,command,descend,tick,type Action,type GameState} from '../core/game.ts';
export type SessionAction=Action|'hold'|'hardDrop';
export class GameSession {
  private state:GameState=idleState();
  private readonly bag=new SevenBag(Math.random);
  private readonly source:()=>PieceType;
  private pending:PieceType|undefined;
  private readonly next=()=>{const piece=this.peek();this.pending=undefined;return piece;};
  private peek():PieceType {return this.pending??=this.source();}
  private listeners=new Set<(state:Readonly<GameState>)=>void>();
  private completions=new Set<(score:number)=>void>();
  constructor(next?:()=>PieceType){this.source=next??(()=>this.bag.next());}
  subscribe(listener:(state:Readonly<GameState>)=>void){this.listeners.add(listener);listener(this.state);return()=>{this.listeners.delete(listener);};}
  onComplete(listener:(score:number)=>void){this.completions.add(listener);return()=>{this.completions.delete(listener);};}
  start(){this.bag.reset();this.pending=undefined;this.commit(startGame(this.next));}
  act(action:SessionAction){this.commit(action==='hold'?holdPiece(this.state,this.next):action==='hardDrop'?hardDrop(this.state,this.next):action==='down'?descend(this.state,this.next,'soft'):command(this.state,action));}
  pause(){if(this.state.status==='running')this.commit({...this.state,status:'paused'});}
  togglePause(){if(this.state.status==='running')this.pause();else if(this.state.status==='paused')this.commit({...this.state,status:'running'});}
  advance(elapsed:number){this.commit(tick(this.state,elapsed,this.next));}
  private commit(next:GameState){
    if(next===this.state)return;
    if(next.status!=='idle')next={...next,nextPiece:this.peek()};
    const completed=this.state.status!=='over'&&next.status==='over';this.state=next;
    for(const listener of this.listeners)listener(this.state);
    if(completed)for(const listener of this.completions)listener(this.state.score);
  }
}
