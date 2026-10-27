import type {Page} from '@playwright/test';
export async function painted(page:Page){return page.locator('canvas').evaluate(node=>{
 const ctx=(node as HTMLCanvasElement).getContext('2d')!;const result:string[]=[];
 for(let y=0;y<20;y++)for(let x=0;x<10;x++){const p=ctx.getImageData(x*30+15,y*30+15,1,1).data;const v=[p[0],p[1],p[2]];if(Math.max(...v)>140&&Math.max(...v)-Math.min(...v)>60)result.push(`${x},${y}`);}
 return result.sort();
});}
/** Sample the pale outline edge, separately from colored active/settled centers. */
export async function ghostCells(page:Page){return page.locator('canvas').evaluate(node=>{
 const ctx=(node as HTMLCanvasElement).getContext('2d')!,result:string[]=[];
 for(let y=0;y<20;y++)for(let x=0;x<10;x++){
  const p=ctx.getImageData(x*30+1,y*30+15,1,1).data,values=[p[0],p[1],p[2]];
  if(Math.min(...values)>140&&Math.max(...values)-Math.min(...values)<60)result.push(`${x},${y}`);
 }
 return result.sort();
});}
