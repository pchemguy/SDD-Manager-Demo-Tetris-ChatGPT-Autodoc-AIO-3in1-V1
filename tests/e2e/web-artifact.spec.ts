/** Acceptance of compiled/extracted bytes, independent of Vite and source modules. */
import {test,expect} from '@playwright/test';
for(const width of [280,360,600,1024,1440]){
 test(`extracted game remains centered and operable at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];const external:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  page.on('request',request=>{if(new URL(request.url()).origin!=='http://127.0.0.1:4174')external.push(request.url());});
  await page.goto('/');await page.getByRole('button',{name:'Start',exact:true}).click();
  const board=page.getByRole('img',{name:'Game board'});
  await board.press('ArrowDown');await expect(page.getByLabel('Score',{exact:true})).toHaveText('1');
  const box=await board.boundingBox();expect(box).not.toBeNull();
  expect(Math.abs(box!.x+box!.width/2-width/2)).toBeLessThan(2);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  for(const label of ['Pause','Restart']){const button=page.getByRole('button',{name:label,exact:true});await expect(button).toBeVisible();const b=await button.boundingBox();expect(b!.x).toBeGreaterThanOrEqual(0);expect(b!.x+b!.width).toBeLessThanOrEqual(width);}
  await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('status',{name:'Game status',exact:true})).toHaveText('Paused');
  await page.getByRole('button',{name:'Restart',exact:true}).click();await expect(page.getByLabel('Score',{exact:true})).toHaveText('0');
  await page.screenshot({path:`test-results/artifact-${test.info().project.name}-${width}.png`,fullPage:true});
  expect(errors).toEqual([]);expect(external).toEqual([]);
 });
}
