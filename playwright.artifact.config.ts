/** Run release acceptance through plain HTTP against extracted distribution bytes. */
import {defineConfig} from '@playwright/test';
import source from './playwright.config.ts';
export default defineConfig(source, {
 testDir:'./tests',testMatch:['ui/*.spec.ts','e2e/*.spec.ts'],
 use:{baseURL:'http://127.0.0.1:4174'},
 webServer:{command:'python -m http.server 4174 --bind 127.0.0.1 --directory .package-test/web',url:'http://127.0.0.1:4174',reuseExistingServer:false,timeout:15000}
});
