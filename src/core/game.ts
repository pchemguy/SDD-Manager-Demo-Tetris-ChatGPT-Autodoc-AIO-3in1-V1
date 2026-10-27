/** Immutable classic commands; clocks and random selection are supplied by callers. */
import { emptyBoard, spawn, canPlace, cells, WIDTH, HEIGHT, type Cell, type Piece, type PieceType } from './geometry.ts';
export interface GameState {
  board:Cell[][];
  active:Piece|null;
  nextPiece:PieceType|null;
  heldPiece:PieceType|null;
  holdUsed:boolean;
  status:'idle'|'running'|'paused'|'over';
  score:number;
  lines:number;
  level:number;
  fallMs:number;
}
export type Action='left'|'right'|'down'|'rotateCW'|'rotateCCW';
/** Allocate a clean inactive game. No random values are consumed. */
export function idleState():GameState {
  return {board:emptyBoard(),active:null,nextPiece:null,heldPiece:null,holdUsed:false,status:'idle',score:0,lines:0,level:1,fallMs:0};
}
/** Start/restart from a fresh board and consume one injected piece draw. */
export function startGame(next:()=>PieceType):GameState { return spawnNext(idleState(),next()); }
/** Spawn against the settled board, preserving it if the spawn is blocked. */
export function spawnNext(state:GameState,type:PieceType):GameState {
  const active=spawn(type);
  return canPlace(state.board,active) ? {...state,active,status:'running',fallMs:0,holdUsed:false} : {...state,active:null,status:'over',fallMs:0};
}
/** Hold exchanges types at a fresh spawn, consuming a draw only for an empty slot. */
export function holdPiece(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active||state.holdUsed)return state;
  const incoming=state.heldPiece??next();
  return {...spawnNext(state,incoming),heldPiece:state.active.type,holdUsed:true};
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
  const surviving=board.filter(row=>row.some(cell=>cell===null));
  const cleared=HEIGHT-surviving.length;
  const compacted=[...Array.from({length:cleared},()=>Array<Cell>(WIDTH).fill(null)),...surviving];
  const lines=state.lines+cleared;
  const award=[0,100,300,500,800][cleared]*state.level;
  return spawnNext({...state,board:compacted,lines,level:1+Math.floor(lines/10),score:addScore(state.score,award)},next());
}
/** A classic downward attempt locks only when the one-row move fails. */
export function descend(state:GameState,next:()=>PieceType,source:'gravity'|'soft'='gravity'):GameState {
  if(state.status!=='running'||!state.active)return state;
  const moved=command(state,'down');
  return moved===state?lockPiece(state,next):(source==='soft'?{...moved,score:addScore(moved.score,1)}:moved);
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

/** Keep scores exactly representable at the portable-format integer boundary. */
function addScore(score:number,points:number){return Math.min(Number.MAX_SAFE_INTEGER,score+points);}
