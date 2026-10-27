/** SRS local matrices use 0,R,2,L = 0,1,2,3; coordinates increase right/down.
 * Centers are measured from the top-left cell center of the canonical matrix:
 * I uses 4×4, JLSTZ 3×3 and O 2×2. O geometry is unchanged in every state.
 * Ordered translation tuples below already invert the reference y-UP convention.
 * Reference and independent orientation/kick fixtures: tests/fixtures/srs.ts.
 */
import type {PieceType} from './geometry.ts';
export const ROTATION_CENTERS:Readonly<Record<PieceType,readonly [number,number]>>={I:[1.5,1.5],J:[1,1],L:[1,1],O:[.5,.5],S:[1,1],T:[1,1],Z:[1,1]};
type KickTable=Readonly<Record<string,readonly (readonly [number,number])[]>>;
export const KICKS:Readonly<Record<'JLSTZ'|'I',KickTable>>={
 JLSTZ:{
  '0>1':[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '1>0':[[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '1>2':[[0,0],[1,0],[1,1],[0,-2],[1,-2]],
  '2>1':[[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
  '2>3':[[0,0],[1,0],[1,-1],[0,2],[1,2]],
  '3>2':[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '3>0':[[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
  '0>3':[[0,0],[1,0],[1,-1],[0,2],[1,2]]},
 I:{
  '0>1':[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '1>0':[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '1>2':[[0,0],[-1,0],[2,0],[-1,-2],[2,1]],
  '2>1':[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '2>3':[[0,0],[2,0],[-1,0],[2,-1],[-1,2]],
  '3>2':[[0,0],[-2,0],[1,0],[-2,1],[1,-2]],
  '3>0':[[0,0],[1,0],[-2,0],[1,2],[-2,-1]],
  '0>3':[[0,0],[-1,0],[2,0],[-1,-2],[2,1]]}
};
