/** Forward host suspension into existing DOM controls; expose no privileged API. */
'use strict';
const {ipcRenderer}=require('electron');
ipcRenderer.on('tetris:suspend',()=>window.dispatchEvent(new Event('blur')));
