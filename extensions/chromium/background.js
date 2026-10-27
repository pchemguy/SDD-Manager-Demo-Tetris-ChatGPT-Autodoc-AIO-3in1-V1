/** Configure the toolbar to toggle this extension's bundled panel, without website access. */
chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true}).catch(error=>console.error('Unable to configure the game panel:',error.message));

/** Reopening a retained document never resumes play; destroyed panels have no receiving document. */
function suspendPanel(info){
 if(info.path!=='index.html'||!Number.isInteger(info.windowId))return;
 chrome.runtime.sendMessage({type:'blockfield:suspend',windowId:info.windowId}).catch(()=>{});
}
chrome.sidePanel.onClosed.addListener(suspendPanel);
chrome.sidePanel.onOpened.addListener(suspendPanel);
