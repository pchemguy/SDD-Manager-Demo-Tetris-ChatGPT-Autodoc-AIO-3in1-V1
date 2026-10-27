/** First reachable normal landing; one-row collision checks cannot cross an obstruction. */
import {canPlace,type Cell,type Piece} from './geometry.ts';
export function projectLanding(board:readonly (readonly Cell[])[],piece:Piece):Piece {
 if(!canPlace(board,piece))throw new RangeError('Cannot project an invalid normal placement');
 let current=piece;
 for(;;){
  const candidate={...current,y:current.y+1};
  if(!canPlace(board,candidate))return current;
  current=candidate;
 }
}
