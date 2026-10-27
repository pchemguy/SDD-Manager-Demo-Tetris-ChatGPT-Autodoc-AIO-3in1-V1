/** Stateless miniatures use the same canonical geometry and palette as the board. */
import {cells,type PieceType} from '../core/geometry.ts';
import {COLORS} from './board.ts';
export function renderMiniPiece(svg:SVGSVGElement,type:PieceType|null){
 if(svg.dataset.piece===(type??''))return;
 svg.dataset.piece=type??'';svg.replaceChildren();
 if(!type)return;
 const points=cells({type,rotation:0,x:0,y:0});
 const minX=Math.min(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y));
 const width=Math.max(...points.map(p=>p.x))-minX+1,height=Math.max(...points.map(p=>p.y))-minY+1;
 for(const p of points){
  const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');
  for(const [key,value] of Object.entries({x:(100-width*20)/2+(p.x-minX)*20+1,y:(60-height*20)/2+(p.y-minY)*20+1,width:18,height:18,fill:COLORS[type],rx:1}))rect.setAttribute(key,String(value));
  svg.append(rect);
 }
}
