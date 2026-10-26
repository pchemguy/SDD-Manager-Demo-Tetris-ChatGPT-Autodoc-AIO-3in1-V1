/** Real DOM input and Canvas pixels verify the shared board view. */
import {test,expect,type Page} from '@playwright/test';
async function painted(page:Page){return page.locator('canvas').evaluate(node=>{
 const ctx=(node as HTMLCanvasElement).getContext('2d')!;const result:string[]=[];
 for(let y=0;y<20;y++)for(let x=0;x<10;x++){const p=ctx.getImageData(x*30+15,y*30+15,1,1).data;const v=[p[0],p[1],p[2]];if(Math.max(...v)>140&&Math.max(...v)-Math.min(...v)>60)result.push(`${x},${y}`);}
 return result.sort();
});}
test.beforeEach(async({page})=>{await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));});
test('rendered piece follows legal controls and stops at the wall',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();
 const board=page.getByRole('img',{name:'Game board'});await expect(board).toBeVisible();await board.press('ArrowDown');
 const before=await painted(page);expect(before).toHaveLength(4);
 await board.press('ArrowLeft');expect(await painted(page)).toEqual(before.map(v=>{const [x,y]=v.split(',').map(Number);return `${x-1},${y}`;}).sort());
 await board.press('ArrowRight');expect(await painted(page)).toEqual(before);
 for(let i=0;i<15;i++)await board.press('ArrowLeft');const wall=await painted(page);expect(Math.min(...wall.map(v=>Number(v.split(',')[0])))).toBe(0);
 await board.press('ArrowLeft');expect(await painted(page)).toEqual(wall);
 await page.getByRole('button',{name:'Restart',exact:true}).click();await board.press('ArrowDown');expect(await painted(page)).toHaveLength(4);
});
test('unfocused controls do not move the piece and the board remains centered',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'});await board.press('ArrowDown');const before=await painted(page);
 await page.getByRole('button',{name:'Restart',exact:true}).focus();await page.keyboard.press('ArrowLeft');expect(await painted(page)).toEqual(before);
 const box=await board.boundingBox();expect(Math.abs(box!.x+box!.width/2-720)).toBeLessThan(2);
 await page.screenshot({path:`test-results/board-${test.info().project.name}.png`,fullPage:true});
});

test('automatic gravity advances the rendered board and live metrics',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'});await board.press('ArrowDown');const before=await painted(page);
 await page.clock.runFor(1100);expect(await painted(page)).toEqual(before.map(v=>{const [x,y]=v.split(',').map(Number);return `${x},${y+1}`;}).sort());
 await expect(page.getByLabel('Score',{exact:true})).toHaveText('1');await expect(page.getByLabel('Level',{exact:true})).toHaveText('1');await expect(page.getByLabel('Lines',{exact:true})).toHaveText('0');
});

test('automatic top-out shows game over and restart clears the board',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();await page.clock.runFor(100);await page.clock.fastForward(500000);
 await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Game over');await expect(page.getByText('Final score: 0. Restart when you’re ready.')).toBeVisible();
 await page.screenshot({path:`test-results/gameover-${test.info().project.name}.png`,fullPage:true});
 await page.getByRole('button',{name:'Restart',exact:true}).click();await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('In play');expect((await painted(page)).length).toBeLessThanOrEqual(4);await expect(page.getByLabel('Score',{exact:true})).toHaveText('0');
});
