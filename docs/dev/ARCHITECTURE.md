# Architecture

## System boundary

The system implements the [project brief](PROJECT.md) as one local game delivered through four hosts. TypeScript, a small DOM-based application shell and a Canvas 2D board avoid a framework-specific runtime. Vite builds static assets; Node.js is a development/build dependency only. All dependencies are pinned by a committed lockfile when introduced.

## Blocks and dependency direction

| Block | Responsibility | Dependencies |
| --- | --- | --- |
| Game domain | Board, pieces, rules, commands, timing, score and game completion | Injected random stream and elapsed time; no DOM, filesystem or host APIs |
| Application | Session state, input routing, configuration, leaderboard and import/export transactions | Domain, format codecs, platform ports |
| Presentation | Canvas board, semantic controls, responsive panels and accessible status | Read-only application snapshots and commands |
| Platform adapters | Browser cookies/URL, Electron lifecycle/files, extension storage/sidebar lifecycle | Narrow application ports; no separate gameplay rules |
| Packaging and verification | Reproducible assets, manifests, desktop packaging, checksums and artifact tests | Compiled application and host entry points |

The application owns state transitions and supplies immutable render snapshots. The domain never calls the UI or a platform API. Platform events become application commands. One application instance owns each document's game, settings and session leaderboard; no background process preserves a destroyed document's session. Separate windows are separate game sessions.

## Domain model

Represent settled cells separately from the active tetromino and ghost. Geometry/collision is shared by movement, normal landing, penetrator landing and projections, preventing preview/drop divergence. A game reducer takes a command, elapsed active-play time and explicit randomness and returns state plus domain events. The scheduler supplies monotonic time; pause removes suspended duration. Configuration is validated before entering the reducer.

Randomization is injectable: the classic baseline uses independent uniform choices; the modern increment uses shuffled seven-piece bags. SRS geometry/kick tables are immutable data. A penetrator uses the same geometry with relaxed occupied-cell transit and strict valid placement at lock. Its landing search is bounded by board height. Timing and overlap cases are specified in the later system specification; this structural document owns the separation rather than duplicating those contracts.

## Persistence and files

Application settings and the leaderboard have distinct owners and lifetimes. Session-only increments use memory ports. Persistent settings use six cookies and URL parameters in the browser and desktop, and one validated settings record in extension-local storage. Scores remain document-local memory on every host. No automatic score database or game-state persistence is introduced.

Import/export operates on a versioned portable snapshot, independent of its source file. JSON Schema validation and semantic validation produce one canonical snapshot; the SQLite adapter converts the required tables to that same snapshot and uses the same validators. A bundled sql.js WASM worker handles SQLite only when file persistence is delivered. The worker, WASM, schema and supporting code ship inside every corresponding package; no CDN fetch is allowed.

Restore parses and validates into isolated temporary state. The application serializes settings and restore operations, snapshots current state/persistence, commits the platform settings operation and then swaps the session leaderboard/settings. A normal reported commit failure rolls back the previous values and URL before exposing success. Validation failures perform no persistence writes. Process termination is outside the in-process rollback boundary; no claim of crash-atomic commits across cookies and history is made. Browser/desktop restore tests must exercise cookie and history failures, not only invalid files.

## Hosts and runtime boundaries

| Host | Arrangement | Distribution and acceptance boundary |
| --- | --- | --- |
| Browser | Static same-origin assets, cookies and history adapter; file input and download | Deployable ZIP served over HTTP(S), tested as an extracted build; no application backend |
| Windows Electron | Sandboxed renderer with context isolation and Node integration disabled; main process owns protocol, lifecycle and file dialogs; narrow validated preload bridge | Unsigned portable Windows x64 ZIP including Electron, tested after extraction on Windows without external Node.js |
| Chromium sidebar | MV3 side_panel manifest, bundled panel and small service worker for opening/closing lifecycle | Development ZIP extracted and loaded unpacked; Chromium 142+; actual panel and close events tested |
| Firefox sidebar | MV3 sidebar_action manifest and Firefox-specific opener/lifecycle adapter | Unsigned development ZIP loaded temporarily through about:debugging; Firefox 140 ESR+; actual sidebar tested |

Electron serves only packaged allowlisted assets from a standard, secure app://bundle origin using a registered protocol. This supports relative assets and cookie/URL behavior without a local server. Use a persistent Electron session; expose only validated settings and user-initiated file operations, never arbitrary filesystem paths or shell execution. Block renderer navigation away from the packaged origin and deny new-window creation. Protocol path resolution must reject traversal. Runtime cookies, URL handling and WASM loading require packaged Windows tests; protocol documentation is feasibility evidence only.

Browser and Electron pause on document hiding and loss of application focus. Sidebar lifecycle adapters also process host close events. Reopening a retained document remains paused; destroyed documents start idle. A background extension worker forwards lifecycle events but stores neither scores nor active game state. Persistent settings are shared within the extension profile; each live document retains its own applied settings snapshot until an explicit reload or change.

Firefox temporary installation and Chromium unpacked loading are development distribution routes. They are documented as such, with Firefox restart/uninstallation limitations. Signing/store publication needs a separately established distribution workflow; development ZIP verification never implies store acceptance. Windows 10/11 x64 are the desktop test targets; claims are limited to systems actually exercised.

## Verification and tradeoffs

Pure domain tests cover clock/random edge cases quickly. Integration tests cover state transactions, codecs and adapter contracts. Browser UI tests use isolated, pinned Playwright-managed Chromium and Firefox; real sidebar verification needs the full browser and an isolated profile, with native events distinguished from modeled callbacks. Windows tests execute the extracted Electron package. Package manifests, checksums, contents, offline assets and installation instructions are checked separately from source tests.

Canvas gives a compact scalable board while semantic HTML exposes controls, scores and errors. Separate manifests and adapters isolate incompatible sidebar APIs without duplicating game rules. The custom Electron protocol avoids file-origin cookie ambiguity at the cost of a small audited asset handler. A single canonical snapshot limits JSON/SQLite drift. No server, account, network leaderboard or cross-window game synchronization is required.

## Source basis

- [Electron protocol and standard schemes](https://www.electronjs.org/docs/latest/api/protocol)
- [Chromium sidePanel lifecycle API](https://developer.chrome.com/docs/extensions/reference/api/sidePanel)
- [Firefox sidebar manifest](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/sidebar_action)
- [Firefox temporary installation](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
