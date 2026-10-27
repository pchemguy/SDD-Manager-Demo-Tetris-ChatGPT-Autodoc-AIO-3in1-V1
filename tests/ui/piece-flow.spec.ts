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

test('C and Shift Hold once per piece, swap after lock and reject paused/game-over input',async({page})=>{
 await page.addInitScript(()=>{Math.random=()=>0;});await page.clock.install();await page.clock.pauseAt(new Date());await page.goto('/');
 await page.getByRole('button',{name:'Start',exact:true}).click();const board=page.getByRole('img',{name:'Game board'}),held=page.getByRole('img',{name:'Held piece'}),preview=page.getByRole('img',{name:'Next piece'}),button=page.getByRole('button',{name:'Hold',exact:true});
 await board.press('x');await board.press('c');await expect(held).toHaveAttribute('data-piece','J');await expect(held.locator('rect')).toHaveCount(4);await expect(page.locator('.piece-name')).toHaveText('L piece');await expect(preview).toHaveAttribute('data-piece','O');await expect(button).toBeDisabled();
 await page.keyboard.down('Shift');await page.clock.runFor(500);await page.keyboard.up('Shift');await board.press('c');await expect(held).toHaveAttribute('data-piece','J');await expect(page.locator('.piece-name')).toHaveText('L piece');
 for(let i=0;i<20;i++)await board.press('ArrowDown');await expect(button).toBeEnabled();await board.press('Shift');await expect(held).toHaveAttribute('data-piece','O');await expect(page.locator('.piece-name')).toHaveText('J piece');await expect(preview).toHaveAttribute('data-piece','S');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(button).toBeDisabled();await board.press('c');await expect(held).toHaveAttribute('data-piece','O');
 await page.getByRole('button',{name:'Resume',exact:true}).click();await page.clock.runFor(100);await page.clock.fastForward(500000);await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Game over');await expect(button).toBeDisabled();await board.press('Shift');await expect(held).toHaveAttribute('data-piece','O');
 await page.getByRole('button',{name:'Restart',exact:true}).click();await expect(held).toHaveAttribute('data-piece','');await expect(button).toBeEnabled();await button.click();await expect(held).toHaveAttribute('data-piece','J');
 await page.screenshot({path:`test-results/hold-${test.info().project.name}.png`,fullPage:true});
});
