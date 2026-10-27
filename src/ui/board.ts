/** Canvas projection of a snapshot; this module owns no movement or collision rules. */
import {WIDTH,HEIGHT,cells,type Cell,type PieceType} from '../core/geometry.ts';
import {projectLanding} from '../core/landing.ts';
import type {GameState} from '../core/game.ts';
export const COLORS:Record<PieceType,string>={I:'#30c5d6',J:'#5c81f7',L:'#e99f3c',O:'#e5d34c',S:'#69c976',T:'#ae7ae3',Z:'#eb7285'};
export function renderBoard(canvas:HTMLCanvasElement,state:Readonly<GameState>){
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas 2D rendering is unavailable.');
 const size=canvas.width/WIDTH;
 ctx.fillStyle='#0a111c';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.strokeStyle='#1b2734';ctx.lineWidth=1;
 for(let x=0;x<=WIDTH;x++){ctx.beginPath();ctx.moveTo(x*size+.5,0);ctx.lineTo(x*size+.5,canvas.height);ctx.stroke();}
 for(let y=0;y<=HEIGHT;y++){ctx.beginPath();ctx.moveTo(0,y*size+.5);ctx.lineTo(canvas.width,y*size+.5);ctx.stroke();}
 const paint=(x:number,y:number,type:Cell)=>{if(type===null||y<0)return;ctx.fillStyle=COLORS[type];ctx.fillRect(x*size+2,y*size+2,size-4,size-4);ctx.fillStyle='#ffffff30';ctx.fillRect(x*size+3,y*size+3,size-6,3);};
 state.board.forEach((row,y)=>row.forEach((cell,x)=>paint(x,y,cell)));
 if(state.active){
  for(const {x,y} of cells(state.active))paint(x,y,state.active.type);
  const ghost=projectLanding(state.board,state.active);
  ctx.strokeStyle='#9fb3c8';ctx.lineWidth=2;
  // Paint after the active fill so a coincident ghost remains distinguishable.
  for(const {x,y} of cells(ghost))if(y>=0)ctx.strokeRect(x*size+1,y*size+1,size-2,size-2);
 }
}
