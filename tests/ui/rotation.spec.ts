import {test,expect} from '@playwright/test';
import {painted} from './helpers.ts';
test('visible I wall kick follows SRS and held rotation resets on its next spawn',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>1-Number.EPSILON;});await page.clock.install({time:new Date('2026-01-01T00:00:00Z')});await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));await page.goto('/');
 await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'});
 await board.press('ArrowDown');await board.press('x');for(let i=0;i<5;i++)await board.press('ArrowLeft');await board.press('x');
 expect(await painted(page)).toEqual(['0,2','1,2','2,2','3,2']);
 await board.press('z');expect(await painted(page)).toEqual(['2,0','2,1','2,2','2,3']);
 await board.press('Shift');await board.press('ArrowDown');expect(await painted(page)).toEqual(['3,0','3,1','4,1','5,1']);
 for(let i=0;i<20;i++)await board.press('ArrowDown');await board.press('Shift');
 expect((await painted(page)).filter(p=>Number(p.split(',')[1])<4)).toEqual(['3,0','4,0','5,0','6,0']);
 await page.screenshot({path:`test-results/srs-${test.info().project.name}.png`,fullPage:true});
});
