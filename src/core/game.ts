/** Immutable classic commands; clocks and random selection are supplied by callers. */
import { emptyBoard, spawn, canPlace, cells, type Cell, type Piece, type PieceType } from './geometry.ts';
export interface GameState {
  board:Cell[][];
  active:Piece|null;
  status:'idle'|'running'|'paused'|'over';
  score:number;
  lines:number;
  level:number;
  fallMs:number;
}
export type Action='left'|'right'|'down'|'rotateCW'|'rotateCCW';
/** Allocate a clean inactive game. No random values are consumed. */
export function idleState():GameState {
  return {board:emptyBoard(),active:null,status:'idle',score:0,lines:0,level:1,fallMs:0};
}
/** Start/restart from a fresh board and consume one injected piece draw. */
export function startGame(next:()=>PieceType):GameState { return spawnNext(idleState(),next()); }
/** Spawn against the settled board, preserving it if the spawn is blocked. */
export function spawnNext(state:GameState,type:PieceType):GameState {
  const active=spawn(type);
  return canPlace(state.board,active) ? {...state,active,status:'running',fallMs:0} : {...state,active:null,status:'over',fallMs:0};
}
/** Apply a legal single-cell move or baseline no-kick rotation to a running game. */
export function command(state:GameState,action:Action):GameState {
  if(state.status!=='running' || !state.active)return state;
  const p=state.active;
  const candidate:Piece={...p};
  switch(action){
    case 'left':candidate.x--;break;
    case 'right':candidate.x++;break;
    case 'down':candidate.y++;break;
    case 'rotateCW':candidate.rotation=(p.rotation+1)%4;break;
    case 'rotateCCW':candidate.rotation=(p.rotation+3)%4;break;
  }
  return canPlace(state.board,candidate) ? {...state,active:candidate} : state;
}
/** Current classic fall interval; level changes are owned by clear/scoring transitions. */
export function gravityMs(level:number){return Math.max(80,Math.floor(1000*Math.pow(.8,level-1)));}
/** Lock a visible valid active placement and spawn from the injected stream. */
export function lockPiece(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active)return state;
  const points=cells(state.active);
  if(points.some(p=>p.y<0))return {...state,active:null,status:'over',fallMs:0};
  const board=state.board.map(row=>[...row]);
  for(const {x,y} of points)board[y][x]=state.active.type;
  return spawnNext({...state,board},next());
}
/** A classic downward attempt locks only when the one-row move fails. */
export function descend(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active)return state;
  const moved=command(state,'down');
  return moved===state?lockPiece(state,next):moved;
}
/** Advance active time deterministically, excluding paused/game-over duration. */
export function tick(state:GameState,elapsed:number,next:()=>PieceType):GameState {
  if(state.status!=='running')return state;
  if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('Elapsed time must be finite and non-negative.');
  let current=state,remaining=state.fallMs+elapsed;
  while(current.status==='running'&&remaining>=gravityMs(current.level)){
    remaining-=gravityMs(current.level);current=descend(current,next);
  }
  return {...current,fallMs:current.status==='running'?remaining:0};
}
