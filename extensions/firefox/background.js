/** Firefox requires sidebar opening to remain directly within a user-action callback. */
browser.browserAction.onClicked.addListener(()=>browser.sidebarAction.open().catch(error=>console.error('Unable to open the game sidebar:',error.message)));
