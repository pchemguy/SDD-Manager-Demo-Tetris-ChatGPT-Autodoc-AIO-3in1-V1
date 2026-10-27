# Firefox sidebar development package

Use Firefox140 ESR or newer. Open about:debugging#/runtime/this-firefox, choose Load Temporary Add-on and select the development ZIP or its extracted manifest.json. Click the extension toolbar action to open its sidebar, or select Blockfield from Firefox's sidebar chooser. Keep all bundled files together; no separate Node.js, development server or backend is part of the package design.

This is an unsigned temporary development installation, not a signed or store-distributed add-on. Temporary installation is removed on browser restart; reinstall it for another development session. Native installation and actual sidebar events have not been verified by this execution environment. Headless tests cover extracted UI assets; controlled API tests cover the opener and shared handlers. These checks do not establish native installation/event delivery.

The baseline requests no website or storage permissions and transmits no personal data. The manifest declares no data collection. Current games and scores are not saved by the background page. Closing/destroying the sidebar document discards the session; retained suspended documents require explicit resume. Read CONTROLS.md for bindings and rules.

The Firefox panel entry also suspends on pagehide and pageshow, preserving a retained document's remaining gravity interval and requiring explicit resume. A new document creates a fresh idle session. Existing visibility/focus handlers clear held keys. Controlled document-lifecycle tests exercise this behavior; actual sidebar destruction and reopening remain unverified native coverage.
