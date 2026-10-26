# System specification

## Scope and owners

The complete target is defined by [PROJECT](PROJECT.md), [ARCHITECTURE](ARCHITECTURE.md) and [DECOMPOSITION](DECOMPOSITION.md). This specification owns observable contracts. The domain reducer owns GAME/MOD/PEN, the settings controller owns CFG, leaderboard owns SCORE, transfer controller and codecs own FILE, and host/presentation adapters implement HOST/UI. [Portable format](spec/PORTABLE-FORMAT.md) and its [JSON Schema](spec/SAVE-FORMAT.schema.json) own file details. Implementation phases select subsets without weakening contracts already delivered.

## GAME — classic play

The visible board has 10 columns and 20 rows; coordinates start at its upper-left corner, y increases downward. Four hidden spawn rows permit rotation above the visible board. Seven tetromino types use four cells each and deterministic documented orientations. Spawn horizontally centered in its initial orientation, with its lowest occupied row at visible row 0. Failed spawn, or locking any cell above visible row 0, ends the game without overwriting settled cells. Active and ghost pieces never count as settled cells before locking.

Start enters running with an empty board, score 0, lines 0, level 1, empty Hold and zero bonuses. Restart abandons an unfinished game and starts fresh while preserving applied settings and session results. A completed game is recorded once; pressing Restart after game over does not record it again. Pause freezes gravity, grounding time and input repeats. Resume uses remaining time; no catch-up or key-repeat burst is applied. Game over accepts only restart and UI/settings/file operations.

Left/Right move one column; Down attempts a one-row soft drop; Up or X rotates clockwise; Z counterclockwise; Space hard-drops when enabled; C or Shift holds when enabled; P/Escape pauses/resumes; B activates penetrator. Inputs act only with the game area focused; form editing and buttons retain normal browser behavior. Prevent page scrolling only for handled game keys. Horizontal repeat uses a 150 ms initial delay and 50 ms repeats; Down repeats at 50 ms. Other actions trigger once per key press. Blur/pause clears held keys. Controls/help lists the actual bindings.

A baseline uses independent uniform random pieces and rotations without kicks. Gravity interval in milliseconds is max(80, floor(1000 × 0.8^(level−1))). Level is 1 + floor(total cleared lines / 10). Line-clear points for 1/2/3/4 lines are 100/300/500/800 multiplied by the level before that clear. Soft drop adds one point per row actually moved by input and hard drop two per row descended; automatic gravity, failed moves and repeated hard drops without descent score zero. Remove full rows simultaneously, compact downward and fill from the top. Apply level/speed changes after the lock/clear transition. Scores use exact non-negative safe integers; saturate at 9007199254740991 rather than overflow.

## MOD — modern rules and lock timing

The modern randomizer shuffles one each of I/J/L/O/S/T/Z into each bag; subsequent bags are independent. Preview shows the next piece without consuming it. Hold is allowed once per spawned active piece: an empty slot consumes the next piece; a nonempty slot swaps. Held pieces spawn with initial orientation/position and fresh timers; a blocked spawn ends the game. Hold becomes available again only after locking. Disabling Hold hides/disables its action but retains the slot for re-enabling. Disabled preview changes neither the stream nor spawn order.

Use standard SRS clockwise/counterclockwise orientation and ordered kick tests, including distinct I and JLSTZ tables and O's unchanged geometry. Take the first valid candidate and leave state unchanged if none succeeds. No 180-degree rotation is required. Publish table fixtures with the implementation so orientation and kick signs are independently checkable.

For a normal piece, ghost and hard drop use the first reachable resting placement on its downward path; they cannot jump through a collision. A ghost is an outline and remains distinguishable when coincident with the active piece. Dynamic mode shows it iff every projected cell has y >= 10; any cell above row 10 hides the entire ghost. Hidden spawn rows are in the upper half. Visibility affects rendering only.

Grounded means a normal piece has no valid one-row downward move, or a penetrator is at its lowest valid landing for the current x/orientation. In interval mode, capture one full current gravity interval on first grounding. Movement/rotation while still grounded and repeated hard-drop commands do not reset the elapsed grounding time. Leaving support cancels the timer; the next grounding starts a fresh full interval. Paused/hidden time is excluded. An elapsed delta can process successive gravity boundaries but stops at game over and cannot create a negative timer; deterministic tests include boundary-equal timestamps.

In failed-down mode a failed soft-drop or gravity downward attempt locks a grounded valid placement. Hard drop performs its terminal failed attempt and therefore locks under that policy. In interval mode hard drop descends to landing and waits the same grounding interval, preserving an already running timer. The immediate hard-drop option locks on that command regardless of the general policy. A successful Hold/spawn resets timers; changing the general lock policy while grounded starts a fresh interval when selecting interval mode, or waits for the next failed downward attempt when selecting failed-down mode. Settings changes and pause never award drop points.

## PEN — penetrator ability

A four-line clear earns one bonus after the piece locks, capped at three. B on a running, non-penetrator active piece spends exactly one available bonus. With none, while paused/game-over, or when already active, it is a no-op. Activation preserves position/orientation and does not grant another Hold. Hold is disabled for the entire activation, including when its general setting is enabled. A newly spawned piece is ordinary; bonuses persist until restart, not across game sessions.

A penetrator ignores settled-cell occupancy during transit, including in-bounds movement/rotation, and never deletes those cells. Wall/floor and hidden-row bounds still apply. Candidate movement/rotation is permitted only if at least one fully visible, non-overlapping placement remains at or below its resulting y. Its landing is the largest y at or below the floor bounds and at or below the current position in the downward direction (y >= current y) for which all four cells are visible, within the board and empty. Evaluate every candidate row, not only the first obstruction. Reject a command with no such landing rather than place an overlapping piece or spend extra bonuses.

Gravity can traverse occupied rows but cannot descend beyond that deepest valid landing. Grounding and lock policies operate there. The ghost and hard drop use exactly that same landing; intervening occupied cells remain intact. A lock always validates placement again. A violated placement invariant reports an error and pauses instead of overwriting cells. Active/preview representation for penetrator is entirely white; regular tetromino cells use nonwhite colors. Game information shows 0–3 bonus symbols and updates within the same state transition when spent/earned.

## CFG — settings and persistence

| Key | Values | Default | URL key / cookie |
| --- | --- | --- | --- |
| ghost | hide, dynamic, show | dynamic | ghost / tetris_ghost |
| hardDrop | Boolean | true | hardDrop / tetris_hardDrop |
| next | Boolean | true | next / tetris_next |
| hardDropLock | general, immediate | general | hardDropLock / tetris_hardDropLock |
| lock | failed-down, interval | interval | lock / tetris_lock |
| hold | Boolean | true | hold / tetris_hold |

Values are case-sensitive; URL/cookie booleans are exactly true or false. Empty, duplicated owned URL keys and invalid values are invalid sources, not Boolean coercions. Resolve each setting independently: valid explicit URL value, then valid cookie, then default. An omitted/invalid parameter does not overwrite a saved cookie. Save every valid explicit URL value to its cookie even if equal to the default. Preserve unrelated query parameters and the fragment. Loading need not append omitted parameters; a user change updates only that setting's cookie and URL value with history replacement. Use path /, SameSite=Lax, one-year expiry and Secure on HTTPS. The desktop adapter uses its persistent app origin/session with equivalent semantics.

Before persistent settings are introduced, all six settings are memory-only and page reload resets them to defaults, without reading or writing cookies, URL configuration or extension storage. Modern controls/rules retain their delivered fixed behavior before the settings increment. Changing an ordinary setting applies immediately without restarting; hardDropLock affects subsequent hard drops and general-lock changes follow MOD timing. Hidden preview/Hold do not change the random stream. Paused settings changes are allowed without advancing the clock.

Once persistence is introduced, extensions resolve each key from a validated extension-local settings record then default. They ignore cookie/query configuration and save all six settings through one storage operation; scores and current games are not persisted there. Separate live panels use independent applied snapshots; a reload reads the latest saved record. Invalid saved keys fall back independently. Restoring replaces all six setting values and updates all six owned browser/desktop cookies/parameters, or the extension-local record.

Serialize writes and Restore against game-completion events. Validate before any write; capture the old settings, results, owned cookies/storage and URL. Check persistence availability, apply and verify host writes, then publish the new in-memory snapshot. On a normal operation failure restore the captured values and show an error; never display success before readback. Tests inject failure at each owned write/history replacement and verify rollback. Process termination or external concurrent modification is outside this in-process transaction. If the host refuses persistence, report the unavailable capability; do not claim the settings were saved. Source resolution still makes a valid supplied URL usable for the current document while reporting a failed cookie save.

## SCORE — session leaderboard

Record game-over completion exactly once using a generated UUID string, safe-integer score and canonical UTC completion time. Keep at most ten results sorted by score descending, timestamp ascending, then ID lexicographically. Equal scores remain separate results. Empty boards/leaderboards render without placeholders that resemble recorded results. Pausing, abandoning via restart, closing a document or cancelling a dialog creates no result. Results survive game restart within a document but reset on document destruction/reload. Restore replaces, rather than merges, the session leaderboard and retains imported IDs/timestamps.

## FILE — manual snapshots

The [portable format](spec/PORTABLE-FORMAT.md) defines full validation. Save captures a consistent snapshot at click time, offers JSON or SQLite, and writes exactly one downloadable file with results and all settings. Save does not clear/change live state. Restore accepts either format by content validation; filename extensions are hints only. Parse/decode/validate in temporary state, including every row/value/version/timestamp, then perform the CFG transaction and replace results once. The current board, active game score and random stream are retained. Completion arriving during restore is serialized and recorded after the restored history commits. Cancelled dialogs are no-ops. Errors identify a useful cause without dumping file contents. Repeated clicks cannot launch concurrent conflicting restores; show progress/disable conflicting transfer controls and recover on worker failure/timeout.

## HOST and UI — presentation and lifecycle

Browser and desktop panels are leaderboard, information/controls, board, settings, help in that left-to-right order at sufficient width. Keep the board's center at the viewport midpoint as panels toggle, using balanced gutters/columns rather than centering the entire panel row. Information and board remain visible. Three individual auxiliary show/hide buttons sit above Pause and Start/Restart. One Save and one Restore button appear only at the bottom of the settings panel once FILE is delivered. No second pair appears elsewhere.

At narrow widths retain the centered board/information group and place auxiliary sections in a scrollable area below; toggles keep all in-scope capabilities reachable. Test sidebars at 280, 360 and 600 CSS pixels, and browser/desktop at 1024 and 1440, without clipping controls or horizontal overflow. Board scaling must preserve readable piece boundaries. Semantic labels, focus indication, keyboard operation and readable error/status text accompany Canvas rendering. White regular pieces are prohibited independently of page theme.

Pause on document hiding, application focus loss and sidebar close. Resume requires an explicit player action. Retained panels reopen paused; destroyed documents reopen idle with session-only state reset and only introduced persistent settings restored. Clear key states on suspension. Host events and virtual handler tests are separate evidence. No host keeps gameplay ticking in the background, uses a backend, or requires external Node.js for the packaged application.

## RELEASE — compatibility and delivery acceptance

Browser and sidebar acceptance targets Chromium 142+ and Firefox 140 ESR+, using isolated compatible binaries. Windows desktop targets Windows 10/11 x64; test and document the exact OS/runtime versions actually used. Dependency setup pins compatible supported Electron, Vite, TypeScript, sql.js and test tools and their lockfile. Do not lower browser/platform coverage to work around a provisioning failure.

Every completed, verified, integrated implementation phase increments the version and publishes a GitHub release. Asset set: browser static ZIP, Windows portable Electron ZIP, Chromium unpacked-development ZIP, Firefox temporary-development ZIP for the platforms delivered by that phase, plus installation notes and SHA-256 checksums. Omit unavailable platforms only with an explicit phase deferral; do not call the phase complete when its required platform evidence is missing. Include licenses/notices and all runtime dependencies, including WASM/worker assets when applicable. Desktop and extensions must launch offline after installation/extraction with no development server, CDN, backend or separate Node.js installation.

Execute installation, launch, controls, pause/reopen, offline asset loading and the phase's settings/file scenarios against extracted artifacts. Test the actual Chromium side panel and Firefox sidebar, not only their HTML in a tab. Native Windows package evidence is required; cross-compilation, Linux Electron or Wine alone is insufficient. Signed/store claims require their corresponding actual distribution evidence; unsigned Electron and temporary/unpacked extensions are clearly marked development packages. Verify published asset hashes and release/tag/source version agreement. A blocker retains the affected phase/release as incomplete.

## Acceptance scenarios

| Group | Direct observable acceptance |
| --- | --- |
| A-GAME | Controlled streams exercise spawn, all moves, rejected collisions, 1–4 line clears, score/level boundaries, pause time exclusion and exactly-once completion |
| A-MOD | Seven-piece bags, Hold once per piece, blocked swap spawn, ordered SRS wall/floor kicks, ghost/hard-drop equality, every locking policy and timing boundary |
| A-PEN | Bonus cap/spend, Hold rejection, transit through multiple obstructions, deepest valid pockets, valid final lock, ghost equality and midline-straddling visibility |
| A-CFG | Six setting controls, memory-only reload reset, per-key source precedence, explicit-default persistence, omissions/invalid/duplicate parameters, unrelated URL preservation and failed-write rollback |
| A-SCORE | More than ten results, score ties, deterministic order, stable IDs/times, abandoned games and reload reset |
| A-FILE | JSON/SQLite round trips preserve exact data; malformed/version/row/key/score/date/duplicate/content/resource failures leave results/settings/cookies/URL/storage unchanged; cancellation and worker failure recover |
| A-HOST | Centering/toggles/sidebar widths, actual focus/visibility/close/reopen, persistent versus session boundaries, packaged dialogs/downloads, keyboard and visual inspection |
| A-RELEASE | Each required extracted artifact installs/launches offline, carries in-scope behavior/assets/notices and matches uploaded checksums and tagged source |
