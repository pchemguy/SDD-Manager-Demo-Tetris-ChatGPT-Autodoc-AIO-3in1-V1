/** Pure tetromino geometry. Negative y addresses the four hidden spawn rows. */
export const TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const;
export type PieceType = typeof TYPES[number];
export type Cell = PieceType | null;
export interface Point { x: number; y: number }
export interface Piece { type: PieceType; rotation: number; x: number; y: number }
export const WIDTH = 10;
export const HEIGHT = 20;
export const HIDDEN_ROWS = 4;
const SHAPES: Record<PieceType, readonly string[]> = {
  I: ['0000','1111','0000','0000'], J: ['100','111','000'],
  L: ['001','111','000'], O: ['11','11'], S: ['011','110','000'],
  T: ['010','111','000'], Z: ['110','011','000']
};
/** Return independent mutable rows for a newly allocated settled board. */
export function emptyBoard(): Cell[][] {
  return Array.from({length: HEIGHT}, () => Array<Cell>(WIDTH).fill(null));
}
/** Enumerate the four absolute cells without changing the piece or board. */
export function cells(piece: Piece): Point[] {
  const shape = SHAPES[piece.type], size = shape.length, result: Point[] = [];
  const turns = ((piece.rotation % 4) + 4) % 4;
  for (let y=0;y<size;y++) for (let x=0;x<size;x++) {
    if (shape[y][x] !== '1') continue;
    let px=x, py=y;
    for (let i=0;i<turns;i++) [px,py] = [size-1-py,px];
    result.push({x:piece.x+px,y:piece.y+py});
  }
  return result;
}
/** Center the initial orientation with its lowest occupied row at visible y=0. */
export function spawn(type: PieceType): Piece {
  const shape=SHAPES[type];
  const bottom=shape.reduce((last,row,y) => row.includes('1') ? y : last,0);
  return {type,rotation:0,x:Math.floor((WIDTH-shape.length)/2),y:-bottom};
}
/** Normal-piece placement checks walls, floor, spawn ceiling and settled cells. */
export function canPlace(board: readonly (readonly Cell[])[], piece: Piece): boolean {
  return cells(piece).every(({x,y}) => x>=0 && x<WIDTH && y>=-HIDDEN_ROWS && y<HEIGHT && (y<0 || board[y][x]===null));
}
