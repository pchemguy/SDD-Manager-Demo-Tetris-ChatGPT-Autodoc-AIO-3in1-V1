# Tetris across browser, desktop and sidebars

## Purpose and users

Build a keyboard-controlled Tetris game for desktop players, with a playable classic baseline and useful subsequent capability increments. Deliver a browser app, a Windows Electron desktop package, and separate Chromium and Firefox sidebar extension packages. Share the game rules and UI across targets, adapting presentation, persistence, file operations and lifecycle behavior to their hosts.

## Intended capabilities

The classic game provides falling tetrominoes, movement, rotation, gravity, line clearing, scoring, increasing levels and speed, game over, pause and restart. Modern rules add Hold, next-piece preview, ghost projection, 7-bag randomization, wall kicks, hard drop and a full-gravity-interval lock delay.

Ghost visibility supports always hidden, always visible and dynamic visibility below the midline. Dynamic mode shows a projection only when every projected cell is in the lower half of the board; a projection straddling the midline remains hidden.

Penetrator bonuses let a falling piece pass through occupied cells without destroying them. Four simultaneous cleared lines award one bonus, up to three. Activation spends one bonus and lasts until locking; Hold is disabled during activation. Penetrator pieces are entirely white, regular pieces use other colors, and the information panel displays one symbol per available bonus. Hard drop and visible ghost projection use the lowest valid penetrator landing. A locking position must be fully inside the board and must not overlap settled cells.

Six settings control ghost visibility, hard drop, next preview, hard-drop locking policy, general locking policy and Hold. Deliver session-only configuration before persistent configuration. The default lock policy waits one full gravity interval after grounding; grounded movement and rotation do not restart the timer. Leaving support cancels it, and landing again starts a new interval. Hard drop follows the general policy unless immediate locking is selected; the alternative general policy locks on a failed downward movement attempt.

The leaderboard retains the ten best completed-game results for the current session. Save offers a choice of JSON or SQLite; Restore accepts either format. Each file contains those results and all six settings. Both formats retain stable result IDs, non-negative integer scores and UTC completion timestamps. JSON is versioned and validated against a supplied JSON Schema; SQLite uses versioned database metadata and the required high_scores and settings tables. Validate the entire file before replacing session results or changing settings or their persistence. A failed restore reports a clear error and changes nothing.

## Platform behavior and presentation

Desktop and browser layouts place leaderboard, game information and controls, board, settings, and help panels from left to right. Keep the board centered and the board and information panels visible. Individual auxiliary-panel toggles appear above Pause and Start/Restart. One Save/Restore pair sits at the bottom of the settings panel and disappears with it. Sidebars adapt this layout to narrow, resizable widths while retaining access to every capability delivered in that increment.

Browser and desktop persistent settings resolve each value independently from explicit URL parameter, then cookie, then default. Changes update the corresponding cookie and URL parameter. Explicit valid URL values are saved even when equal to defaults; omitted parameters retain saved values. Invalid URL or cookie values are ignored in favor of the next valid source. Invalid restored settings reject the complete restore.

Extensions use extension-local storage instead of cookie/URL persistence once persistent configuration is delivered. Before then, settings remain in the panel's document session. Scores remain session-only; Restore replaces that session's leaderboard. Sidebar hiding or closing pauses play. A retained document reopens paused; destruction of the document resets its session, and reopening presents an idle game awaiting Start. Closing an unfinished game does not record a completed result. File persistence is introduced only in its owning capability increment and must update the applicable platform's settings persistence.

## Delivery constraints and success

Desktop and extension packages bundle required runtime assets and operate without separately installed Node.js, a local development server or a backend. Each completed, verified and integrated implementation phase receives an increased version and a GitHub release. Its assets include the deployable browser build and every desktop or extension package delivered by that phase, with installation instructions and explicit development/signing/store status. A platform is delivered only after its packaged artifact has been verified; source tests or successful compilation alone are insufficient.

Signing and store publication are separate distribution decisions. Development packages must be described and tested through their actual installation route, without implying signed or store-distributed status. Browser/sidebar compatibility, Windows execution and package verification evidence are required for their corresponding delivery claims.

No multiplayer, online leaderboard, backend service or mobile-touch interface is requested. Detailed contracts, package choices, compatibility floors, scoring values and test scenarios will be resolved within the stated scope before implementation. No change to the confirmed gameplay decisions is delegated by that refinement.
