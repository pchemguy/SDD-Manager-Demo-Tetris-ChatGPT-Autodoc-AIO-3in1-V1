# Tetris — browser, Windows desktop and sidebars

A Tetris project targeting a browser app, Windows Electron, and Chromium and Firefox sidebar extensions. The intended scope includes classic play, modern rules, penetrator bonuses, configurable behavior, a session leaderboard and manual JSON/SQLite files.

The classic browser loop includes falling pieces, movement, rotation, line clearing, scoring, levels, game over and restart. Pause/resume, focus handling and held-arrow repeat are implemented; packaged releases are still in progress. See [development setup](docs/user/DEVELOPMENT.md) for the validated source commands.

See the proposed [project brief](docs/dev/PROJECT.md), [preparation tasks](docs/dev/DOCS_TASKS.md), [decisions and evidence](docs/dev/DOCS_PREPARATION.md), and [continuity checkpoint](docs/dev/HANDOFF.md).

Development uses [SDD Manager](SDD-MANAGER.md). See the [AI-assisted development disclosure](AI_DISCLOSURE.md).

Build the deployable browser candidate with npm run package:web (Node 24 and Python 3.11+ for development). Deployment instructions are in [INSTALL-WEB.md](docs/user/INSTALL-WEB.md), with [controls](docs/user/CONTROLS.md). Final phase acceptance and release publication remain pending.
