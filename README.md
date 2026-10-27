# Blockfield Tetris

A Tetris game sharing one TypeScript game core and Canvas UI across the browser, Windows Electron desktop and Chromium/Firefox sidebar development packages.

Implemented: seven tetrominoes, movement and SRS rotation, automatic gravity, line clearing, scoring/levels, game over/restart, pause/focus handling and controlled held-arrow repeat, seven-piece bags, next preview, once-per-piece Hold, ghost/hard drop and full-interval grounded locking. Penetrator, settings, leaderboard and manual JSON/SQLite transfer are planned increments described by the [project brief](docs/dev/PROJECT.md).

## Build and install

Developers use Node.js 24 and Python 3.11+; see [development setup](docs/user/DEVELOPMENT.md). npm run package:all builds the static browser ZIP, portable Windows x64 ZIP and both sidebar ZIPs from the same compiled UI. Player packages bundle their runtime assets and require no separate Node.js, development server or application backend.

| Target | Installation | Distribution |
| --- | --- | --- |
| Browser | [Static hosting](docs/user/INSTALL-WEB.md) | Deployable static ZIP |
| Windows x64 | [Portable desktop](docs/user/INSTALL-WINDOWS.md) | Unsigned development package |
| Chromium 142+ | [Load unpacked](docs/user/INSTALL-CHROMIUM.md) | Development extension |
| Firefox 140 ESR+ | [Temporary add-on](docs/user/INSTALL-FIREFOX.md) | Unsigned temporary extension |

Use the actual [GitHub release inventory](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases) and checksums for available downloads. Read [controls](docs/user/CONTROLS.md) for the current bindings.

## Verification scope

Source/application tests, controlled host API tests, archive/content checks and extracted shared-asset UI tests run in isolated headless Chromium and Firefox. Native Windows execution and actual installed-extension/sidebar events remain unverified under the explicitly selected testing scope. Headless/model checks do not establish those native behaviors. No signed or store-distributed package is claimed.

## Project records

See the accepted [brief](docs/dev/PROJECT.md), [tasks](docs/dev/TASKS.md), [decisions](docs/dev/DOCS_PREPARATION.md), [handoff](docs/dev/HANDOFF.md) and [phase reports](docs/dev/reports/phases). Development uses [SDD Manager](SDD-MANAGER.md); see the [AI-assisted development disclosure](AI_DISCLOSURE.md).
