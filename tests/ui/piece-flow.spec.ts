import {test,expect} from '@playwright/test';
test('preview renders the cached next shape and matches the following spawn',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>0;});
 await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('/');
 const preview=page.getByRole('img',{name:'Next piece'});await expect(preview).toHaveAttribute('data-piece','');
 await page.getByRole('button',{name:'Start',exact:true}).click();
 await expect(page.locator('.piece-name')).toHaveText('J piece');
 await expect(preview).toHaveAttribute('data-piece','L');await expect(preview.locator('rect')).toHaveCount(4);
 const before=await preview.innerHTML();await page.getByRole('button',{name:'Pause',exact:true}).click();
 await page.clock.runFor(5000);expect(await preview.innerHTML()).toBe(before);
 await page.getByRole('button',{name:'Resume',exact:true}).click();
 const board=page.getByRole('img',{name:'Game board'});
 for(let i=0;i<20;i++)await board.press('ArrowDown');
 await expect(page.locator('.piece-name')).toHaveText('L piece');await expect(preview).toHaveAttribute('data-piece','O');
 await page.screenshot({path:`test-results/preview-${test.info().project.name}.png`,fullPage:true});
});
