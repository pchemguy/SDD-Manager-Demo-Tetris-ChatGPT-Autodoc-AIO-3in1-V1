/** Document-local composition of the pure core and its render subscriptions. */
import {TYPES,type PieceType} from '../core/geometry.ts';
import {idleState,startGame,command,type Action,type GameState} from '../core/game.ts';
export class GameSession {
  private state:GameState=idleState();
  private readonly next:()=>PieceType;
  private listeners=new Set<(state:Readonly<GameState>)=>void>();
  constructor(next:()=>PieceType=()=>TYPES[Math.floor(Math.random()*TYPES.length)]){this.next=next;}
  subscribe(listener:(state:Readonly<GameState>)=>void){this.listeners.add(listener);listener(this.state);return()=>{this.listeners.delete(listener);};}
  start(){this.state=startGame(this.next);this.publish();}
  act(action:Action){this.state=command(this.state,action);this.publish();}
  private publish(){for(const listener of this.listeners)listener(this.state);}
}
