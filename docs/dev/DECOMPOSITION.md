# Component decomposition

This model refines [ARCHITECTURE](ARCHITECTURE.md). Each component owns one kind of state or transformation; presentation and adapters consume application contracts without duplicating rules.

## Domain components

| Component | Owns / provides | Requires / excludes | Verification seam |
| --- | --- | --- | --- |
| Geometry | Tetromino orientations, SRS kicks, occupied-cell coordinates and legal placements | Board dimensions and settled cells; excludes clocks and rendering | Table-driven rotation and collision fixtures |
| Landing | First reachable normal landing and lowest valid penetrator landing | Geometry and board snapshot; excludes state mutation | Shared hard-drop/ghost equality and bounded scans |
| Randomizer | Uniform baseline stream or shuffled 7-bag stream | Injected random source; excludes UI/session persistence | Seeded streams and bag membership |
| Game reducer | Active piece, settled board, score, level, line count, held piece, bonus count, timers and status | Geometry, landing, randomizer; excludes wall-clock and I/O | Commands and explicit elapsed-time inputs |

Geometry never merges active/ghost cells into settled cells. The reducer alone locks pieces, clears lines, awards bonuses and emits game-completed events. A single lock transition is the score/result boundary; pauses and restarts do not fabricate completions. Landing derives projections from the same placement rules used by hard drop.

## Application components

| Component | Responsibility and provided interface | Dependencies / failure boundary |
| --- | --- | --- |
| Session controller | start/restart, pause/resume, dispatch command, advance time, subscribe to immutable snapshot | Reducer, settings controller, scheduler; serializes transitions |
| Scheduler and input | Translate monotonic active duration and focused keyboard events to commands; clear held keys on pause/blur | Session commands; no persistence or independent game state |
| Settings controller | Validate six settings, resolve host sources, expose apply/settings snapshot | Settings repository and location port; invalid input never reaches game rules |
| Leaderboard | Record each completion once with ID/time, stable sort and retain top ten; replace validated restored results | Injected ID and UTC clock; memory only |
| Portable snapshot validator | Validate complete versioned JSON-domain value, semantic timestamps, IDs and settings | Bundled JSON Schema and shared types; returns canonical immutable candidate or located errors |
| JSON codec | Encode/decode UTF-8 snapshot, detect parse and duplicate-key errors | Snapshot validator; no application mutation |
| SQLite codec worker | Read/write versioned high_scores/settings database, reject malformed structures, return candidate | Bundled sql.js/WASM and validator contract; bounded worker lifetime, temporary database disposal |
| Transfer controller | Save current stable snapshot; stage Restore, validate, commit settings and replace session results once | Codecs, file port, settings controller, leaderboard; cancel is a no-op |

A settings repository offers read sources and a verified apply operation with rollback to its captured prior settings on a normal failure. The location port offers current parameters and history replacement. The transfer controller never writes cookies, URLs or extension storage itself. It invokes the same settings transaction used by ordinary settings changes. Restore is serialized against settings changes and game completion so a committed snapshot has one clear ordering. It does not replace or restart the active game; settings follow the specified timing rules and the restored leaderboard becomes the current session history.

## Presentation components

The app shell owns panel visibility and live status, independent of game state. The board renderer draws settled cells, active cells and conditional ghost from an immutable render model; it owns no collision logic. Preview/Hold views render explicit domain snapshots. The information panel exposes score/level/lines, bonuses, panel toggles and start/pause actions. Settings renders the six validated controls and the one Save/Restore pair. Leaderboard and help are independent views. Errors use readable text and an accessible status region; controls remain keyboard-operable.

The responsive layout keeps one board/information group centered, balances auxiliary panels around it on wide displays, and stacks collapsible auxiliary sections below that group in narrow sidebars. No view independently persists settings, records results or runs gravity. Editing a form control suppresses game hotkeys.

## Platform components

| Adapter | Provided application ports | State / limits |
| --- | --- | --- |
| Memory host | Defaults, session-only settings and browser-like files when in scope | Per-document lifetime; no cookie, URL or extension writes |
| Web host | Cookie settings repository, URL location port, file input/download and visibility/focus events | Six owned cookies/parameters only; preserve unrelated URL state |
| Electron host | Standard app origin, persistent session cookies, renderer history, lifecycle, native file dialogs and bounded byte transfer | Main process owns allowlisted paths and dialogs; preload exposes narrow typed methods |
| Chromium host | Extension-local settings and sidePanel lifecycle forwarding | Background worker holds no game/score state; no broad website access |
| Firefox host | Extension-local settings, sidebarAction opener and document lifecycle | Firefox manifest/API differences isolated here |

Extension file adapters use user-initiated file selection and downloads from the panel, with the minimum required permissions. They neither read arbitrary disk paths nor require a native companion. Before file persistence is in scope, those methods and permissions are absent. Desktop settings persistence and protocol asset loading are separate responsibilities, even if both are implemented in the main process.

## Ownership and integration checks

The application composes ports once at the host entry point. The domain imports no host types. Common validators and codecs do not depend on presentation. The SQLite worker exchanges bounded, tagged request/result messages with request IDs and explicit errors; a failed startup, timeout or malformed response cannot change live state. Its asset locator is host-aware without introducing host-specific database rules.

Component tests exercise pure inputs/outputs. Application tests use controlled clock, random, ID, file and repository ports. Native-host checks exercise actual cookies/history, sidebar open/close and focus, downloads, packaged WASM, Electron dialogs and protocol resolution. A fake port or browser tab does not prove a packaged extension or Windows runtime works. Physical ownership belongs to the later repository layout; exact contracts belong to the system specification.

