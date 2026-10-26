import {defineConfig} from '@playwright/test';
const trustedLocalOverride=process.env.TETRIS_FIREFOX_SANDBOX_OVERRIDE==='1';
export default defineConfig({
 testDir:'./tests/ui',timeout:15000,expect:{timeout:2500},globalTimeout:90000,workers:1,
 use:{baseURL:'http://127.0.0.1:4173',headless:true,viewport:{width:1440,height:900},deviceScaleFactor:1},
 projects:[{name:'chromium',use:{browserName:'chromium'}},{name:'firefox',use:{browserName:'firefox',launchOptions:trustedLocalOverride?{env:{...process.env,MOZ_DISABLE_CONTENT_SANDBOX:'1'}}:{}}}],
 webServer:{command:'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:false,timeout:20000}
});
