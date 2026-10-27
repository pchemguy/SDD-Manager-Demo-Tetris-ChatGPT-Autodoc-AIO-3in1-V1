import {test,expect} from '@playwright/test';
import {painted,ghostCells} from './helpers.ts';
test.beforeEach(async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>1-Number.EPSILON;});await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();
});
test('ghost outline stays distinguishable when coincident with the active landing',async({page})=>{
 const expected=['3,19','4,19','5,19','6,19'];expect(await ghostCells(page)).toEqual(expected);
 const board=page.getByRole('img',{name:'Game board'});for(let i=0;i<19;i++)await board.press('ArrowDown');
 expect(await painted(page)).toEqual(expected);expect(await ghostCells(page)).toEqual(expected);
 await page.screenshot({path:`test-results/ghost-coincident-${test.info().project.name}.png`,fullPage:true});
});
test('Space reaches the ghost for exact distance points; held repeat and form Space do not drop again',async({page})=>{
 const ghost=await ghostCells(page);expect(ghost).toEqual(['3,19','4,19','5,19','6,19']);
 await page.keyboard.down('Space');await expect(page.getByLabel('Score',{exact:true})).toHaveText('38');expect((await painted(page)).filter(p=>Number(p.split(',')[1])>=10)).toEqual(ghost);
 await page.keyboard.down('Space');await page.clock.runFor(500);await page.keyboard.up('Space');await expect(page.getByLabel('Score',{exact:true})).toHaveText('38');
 await page.getByRole('button',{name:'Pause',exact:true}).focus();await page.keyboard.press('Space');await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');await expect(page.getByLabel('Score',{exact:true})).toHaveText('38');
});
