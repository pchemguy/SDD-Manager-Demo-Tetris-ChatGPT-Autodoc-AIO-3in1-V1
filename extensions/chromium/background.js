/** Configure the toolbar to toggle this extension's bundled panel, without website access. */
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(error=>console.error('Unable to configure the game panel:',error.message));
