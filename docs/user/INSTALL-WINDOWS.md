# Windows desktop development package

## Verification status

This portable Windows x64 package is unsigned and has not been executed on native Windows 10/11. The user explicitly waived native Windows verification for this implementation. Source/adapter tests, archive structure, bundled resources, x64 executable identity and official Electron runtime integrity are checked separately. Those checks do not establish that native startup, focus, cookies or file dialogs work on Windows.

## Install and run

Download the Windows x64 ZIP and verify its SHA-256 against the release checksums. Extract the complete archive into a writable directory. Keep Tetris.exe, DLLs, resources and all other runtime files together. Run Tetris.exe; no separate Node.js installation, application backend or local development server is part of the package design. Do not run a single copied executable without the remaining archive contents.

The runtime is bundled Electron 43.8.3. The renderer uses a fixed local app origin, sandboxing, context isolation and disabled Node integration. External navigation and popups are denied. Windows may display unsigned-application prompts; this package is neither signed nor store-distributed.

Click the board to focus keyboard controls. Loss of focus, hiding or minimizing suspends play; resume explicitly. Closing destroys the current game session. Read CONTROLS.md for the current rules and bindings. No settings, leaderboard or file-transfer capabilities are present in the desktop release.

## Contents and updates

VERSION.txt identifies the application version. LICENSE, LICENSE-ELECTRON.txt, LICENSES.chromium.html, VITE-LICENSE.txt and THIRD-PARTY-NOTICES.txt retain project/runtime notices. Extract a new version into its own directory; do not mix runtime files from different releases.
