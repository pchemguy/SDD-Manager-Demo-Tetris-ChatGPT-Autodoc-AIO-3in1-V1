/** Headless checks of extracted sidebar assets; actual extension installation is unverified. */
import {defineConfig} from '@playwright/test';
import artifact from './playwright.artifact.config.ts';
const {webServer,...options}=artifact;
export default defineConfig(options,{
 webServer:{command:'python -m http.server 4174 --bind 127.0.0.1 --directory .package-test/chromium',url:'http://127.0.0.1:4174',reuseExistingServer:false,timeout:15000}
});
