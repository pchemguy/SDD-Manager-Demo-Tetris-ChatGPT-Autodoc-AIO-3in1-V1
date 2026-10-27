/** Pure ordered SRS search. The first valid candidate wins; rejection preserves identity. */
import {canPlace,type Cell,type Piece} from './geometry.ts';
import {KICKS} from './srs-data.ts';
export function rotateSRS(board:readonly (readonly Cell[])[],piece:Piece,direction:1|-1):Piece {
 const from=((piece.rotation%4)+4)%4,to=(from+direction+4)%4;
 const offsets=piece.type==='O'?[[0,0]]:KICKS[piece.type==='I'?'I':'JLSTZ'][`${from}>${to}`];
 for(const [dx,dy] of offsets){
  const candidate={...piece,rotation:to,x:piece.x+dx,y:piece.y+dy};
  if(canPlace(board,candidate))return candidate;
 }
 return piece;
}
