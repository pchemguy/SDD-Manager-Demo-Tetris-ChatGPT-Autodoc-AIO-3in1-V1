# Chromium sidebar development package

Extract the Chromium ZIP into its own directory. In a desktop Chromium 142+ browser, open chrome://extensions, enable Developer mode, choose Load unpacked and select the directory containing manifest.json. Click the extension's toolbar action to open its side panel. Keep all bundled assets together; no Node.js installation, local server or backend is required by the package design.

This is an unsigned unpacked development extension, not a Chrome Web Store installation. Native installation and actual side-panel open/close behavior have not been verified in this execution environment because full Chromium cannot launch here. The package, host adapter and extracted shared UI are checked separately using the supported headless browsers. This limitation does not represent a passed native check.

The baseline permission is sidePanel only, with no website access or score/settings persistence. The panel contains its own game session and bundled assets. Read CONTROLS.md for keyboard controls. Restart preserves the current document; destroying the panel document resets its session. Resume paused play explicitly.
