/** Validate the UI bytes shipped inside the Windows package; this is not native Windows execution. */
import {defineConfig} from '@playwright/test';
import artifact from './playwright.artifact.config.ts';
const {webServer,...options}=artifact;
export default defineConfig(options,{
 webServer:{command:'python -m http.server 4174 --bind 127.0.0.1 --directory .package-test/windows/resources/app/web',url:'http://127.0.0.1:4174',reuseExistingServer:false,timeout:15000}
});
