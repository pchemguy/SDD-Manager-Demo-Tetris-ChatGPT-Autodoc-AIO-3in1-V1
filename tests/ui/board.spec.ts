/** Real DOM input and Canvas pixels verify the shared board view. */
import {test,expect} from '@playwright/test';
import {painted} from './helpers.ts';
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

test('pause preserves remaining gravity time without a catch-up burst',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'});await board.press('ArrowDown');await page.clock.runFor(700);
 await page.getByRole('button',{name:'Pause',exact:true}).click();const before=await painted(page);await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');
 await page.clock.runFor(5000);expect(await painted(page)).toEqual(before);await page.getByRole('button',{name:'Resume',exact:true}).click();await page.clock.runFor(250);expect(await painted(page)).toEqual(before);
 await page.clock.runFor(100);expect(await painted(page)).toEqual(before.map(v=>{const[x,y]=v.split(',').map(Number);return `${x},${y+1}`;}).sort());await board.press('p');await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');await board.press('Escape');await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('In play');
});
test('held arrows repeat and board blur clears their state',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'});await board.press('ArrowDown');const before=await painted(page);
 await page.keyboard.down('ArrowLeft');await page.clock.runFor(149);const once=await painted(page);expect(once).toEqual(before.map(v=>{const[x,y]=v.split(',').map(Number);return `${x-1},${y}`;}).sort());
 await page.clock.runFor(20);expect(await painted(page)).toEqual(before.map(v=>{const[x,y]=v.split(',').map(Number);return `${x-2},${y}`;}).sort());
 await page.getByRole('button',{name:'Restart',exact:true}).focus();const blurred=await painted(page);await page.clock.runFor(500);expect(await painted(page)).toEqual(blurred);await page.keyboard.up('ArrowLeft');
});
test('modeled host blur pauses and requires explicit resume',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');await page.clock.runFor(5000);await page.getByRole('button',{name:'Resume',exact:true}).click();await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('In play');
});

test('modeled hidden-document events pause without automatic resume',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>false});document.dispatchEvent(new Event('visibilitychange'));});
 await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');await page.getByRole('button',{name:'Resume',exact:true}).click();await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('In play');
});
