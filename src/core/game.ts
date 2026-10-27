/** Immutable game commands; clocks and random selection are supplied by callers. */
import { emptyBoard, spawn, canPlace, cells, WIDTH, HEIGHT, type Cell, type Piece, type PieceType } from './geometry.ts';
import {projectLanding} from './landing.ts';
import {rotateSRS} from './rotation.ts';
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
  lockPolicy:'failed-down'|'interval';
  grounding:{elapsedMs:number;intervalMs:number}|null;
}
export type Action='left'|'right'|'down'|'rotateCW'|'rotateCCW';
/** Allocate a clean inactive game. No random values are consumed. */
export function idleState():GameState {
  return {board:emptyBoard(),active:null,nextPiece:null,heldPiece:null,holdUsed:false,status:'idle',score:0,lines:0,level:1,fallMs:0,lockPolicy:'failed-down',grounding:null};
}
/** Start/restart from a fresh board and consume one injected piece draw. */
export function startGame(next:()=>PieceType):GameState { return spawnNext(idleState(),next()); }
/** Spawn against the settled board, preserving it if the spawn is blocked. */
export function spawnNext(state:GameState,type:PieceType):GameState {
  const active=spawn(type);
  return canPlace(state.board,active) ? reconcileGrounding({...state,active,status:'running',fallMs:0,grounding:null,holdUsed:false}) : {...state,active:null,status:'over',fallMs:0,grounding:null};
}
/** Hold exchanges types at a fresh spawn, consuming a draw only for an empty slot. */
export function holdPiece(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active||state.holdUsed)return state;
  const incoming=state.heldPiece??next();
  return {...spawnNext(state,incoming),heldPiece:state.active.type,holdUsed:true};
}
/** Apply a legal single-cell move or ordered SRS rotation to a running game. */
export function command(state:GameState,action:Action):GameState {
  if(state.status!=='running' || !state.active)return state;
  const current=reconcileGrounding(state),p=current.active!;
  if(action==='rotateCW'||action==='rotateCCW'){
    const rotated=rotateSRS(current.board,p,action==='rotateCW'?1:-1);
    return rotated===p?current:reconcileGrounding({...current,active:rotated});
  }
  const candidate:Piece={...p};
  switch(action){
    case 'left':candidate.x--;break;
    case 'right':candidate.x++;break;
    case 'down':candidate.y++;break;
  }
  return canPlace(current.board,candidate) ? reconcileGrounding({...current,active:candidate}) : current;
}
/** Drop to the shared landing; interval mode preserves the existing grounding timer. */
export function hardDrop(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active)return state;
  const current=reconcileGrounding(state),active=projectLanding(current.board,current.active!);
  const dropped={...current,active,score:addScore(current.score,(active.y-current.active!.y)*2)};
  return current.lockPolicy==='interval'?reconcileGrounding(dropped):lockPiece(dropped,next);
}
/** Current classic fall interval; level changes are owned by clear/scoring transitions. */
export function gravityMs(level:number){return Math.max(80,Math.floor(1000*Math.pow(.8,level-1)));}
/** Lock a visible valid active placement and spawn from the injected stream. */
export function lockPiece(state:GameState,next:()=>PieceType):GameState {
  if(state.status!=='running'||!state.active)return state;
  const points=cells(state.active);
  if(points.some(p=>p.y<0))return {...state,active:null,status:'over',fallMs:0,grounding:null};
  const board=state.board.map(row=>[...row]);
  for(const {x,y} of points)board[y][x]=state.active.type;
  const surviving=board.filter(row=>row.some(cell=>cell===null));
  const cleared=HEIGHT-surviving.length;
  const compacted=[...Array.from({length:cleared},()=>Array<Cell>(WIDTH).fill(null)),...surviving];
  const lines=state.lines+cleared;
  const award=[0,100,300,500,800][cleared]*state.level;
  return spawnNext({...state,board:compacted,lines,level:1+Math.floor(lines/10),score:addScore(state.score,award)},next());
}
/** Failed downward attempts lock only under the failed-down policy. */
export function descend(state:GameState,next:()=>PieceType,source:'gravity'|'soft'='gravity'):GameState {
  if(state.status!=='running'||!state.active)return state;
  const current=reconcileGrounding(state),moved=command(current,'down');
  if(moved===current)return current.lockPolicy==='interval'?current:lockPiece(current,next);
  return source==='soft'?{...moved,score:addScore(moved.score,1)}:moved;
}
/** Advance active time deterministically, excluding paused/game-over duration. */
export function tick(state:GameState,elapsed:number,next:()=>PieceType):GameState {
  if(state.status!=='running')return state;
  if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('Elapsed time must be finite and non-negative.');
  if(state.lockPolicy==='interval')return tickInterval(state,elapsed,next);
  let current=state,remaining=state.fallMs+elapsed;
  while(current.status==='running'&&remaining>=gravityMs(current.level)){
    remaining-=gravityMs(current.level);current=descend(current,next);
  }
  return {...current,fallMs:current.status==='running'?remaining:0};
}

/** Capture once at contact; losing support cancels, remaining supported preserves elapsed time. */
export function reconcileGrounding(state:GameState):GameState {
  if(state.status!=='running'||!state.active)return state;
  if(state.lockPolicy!=='interval'||canPlace(state.board,{...state.active,y:state.active.y+1}))
    return state.grounding===null?state:{...state,grounding:null};
  return state.grounding?state:{...state,grounding:{elapsedMs:0,intervalMs:gravityMs(state.level)}};
}
/** Process gravity and grounding as separate deadlines, including equal-time locks. */
function tickInterval(state:GameState,elapsed:number,next:()=>PieceType):GameState {
  let current=reconcileGrounding(state),remaining=elapsed;
  while(current.status==='running'){
    const fallWait=Math.max(0,gravityMs(current.level)-current.fallMs);
    const groundWait=current.grounding?Math.max(0,current.grounding.intervalMs-current.grounding.elapsedMs):Infinity;
    const step=Math.min(remaining,fallWait,groundWait);
    current={...current,fallMs:current.fallMs+step,grounding:current.grounding?{...current.grounding,elapsedMs:current.grounding.elapsedMs+step}:null};
    remaining-=step;
    if(current.grounding&&current.grounding.elapsedMs>=current.grounding.intervalMs){
      current=lockPiece(current,next);
    }else if(current.fallMs>=gravityMs(current.level)){
      current=descend({...current,fallMs:Math.max(0,current.fallMs-gravityMs(current.level))},next);
    }else break;
  }
  return current;
}

/** Keep scores exactly representable at the portable-format integer boundary. */
function addScore(score:number,points:number){return Math.min(Number.MAX_SAFE_INTEGER,score+points);}
