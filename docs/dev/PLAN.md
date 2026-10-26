# Delivery plan

## Strategy and scope

Deliver the complete [SPEC](SPEC.md) through bounded increments, preserving the preceding playable release. Phase 1 delivers the simplest useful browser game. The Windows and two sidebar targets are explicitly deferred to Phase 2; all four targets are required from Phase 2 onward. Modern gameplay is split between piece flow, landing/timing and the penetrator capability. Session-only settings are a separately released increment before persistence. Scores remain session-only through the final manual-file feature.

The supported compatibility and format contracts remain in SPEC; this plan selects delivery order. Dependencies are sequential by phase because each later phase extends the same integrated product. Within a phase, delivery milestones follow the displayed order and retain their own testable outcomes. Versions are initial targets; increment further for fixes and never reuse an already published version/tag.

## Phase map

| Phase | Useful outcome | Version | Required release platforms |
| --- | --- | --- | --- |
| 1 — Classic browser game | A playable classic browser game with movement, rotation, gravity, line clears, scoring, levels, game over, pause and restart. | 0.1.0 | Browser |
| 2 — Desktop and sidebar baseline | The same classic game runs from verified Windows Electron, Chromium sidebar and Firefox sidebar packages. | 0.2.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 3 — Piece flow | 7-bag generation, next-piece preview and once-per-piece Hold are available on all delivered hosts. | 0.3.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 4 — Landing and rotation rules | SRS wall kicks, ghost, hard drop and full-interval locking provide the modern landing experience on every host. | 0.4.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 5 — Penetrator and dynamic ghost | Earn/spend capped penetrator bonuses and traverse obstructions to the deepest valid landing; ghost visibility respects the midline. | 0.5.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 6 — Session configuration and panels | Players can adjust all six settings within the current document and control auxiliary panel visibility. | 0.6.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 7 — Persistent settings | Browser/desktop cookie and URL settings, and extension-local settings, survive reopening with precise per-key precedence. | 0.7.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 8 — Session leaderboard | The top ten completed-game results appear in a toggleable panel with stable IDs, UTC timestamps and deterministic ranking. | 0.8.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |
| 9 — Manual portable saves | Save and Restore provide validated JSON/SQLite exchange of session results and all six settings on every target. | 1.0.0 | Browser, Windows Electron, Chromium sidebar, Firefox sidebar |

## Phase and milestone boundaries

Each delivery milestone's final assigned task owns whole-capability code review, applicable tests/regressions, blocker repairs, a committed milestone report and HANDOFF update. TASKS applies the conditional standalone-review threshold; these obligations cannot be skipped when folded into a delivery task. Each phase has a separate final review milestone containing exactly one review/testing/report task, eligible only after every delivery milestone and its hosted closure is verified.

## Phase 1 — Classic browser game

Outcome: A playable classic browser game with movement, rotation, gravity, line clears, scoring, levels, game over, pause and restart.

Included contracts: GAME, basic HOST/UI, browser RELEASE. Modern rules, additional hosts, settings, leaderboard and file controls remain outside this phase.

Prerequisite: accepted, quality-reviewed and published preparation integrated into main, with phase tracking activated.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 1.1 — Playable board | A visible controllable piece on a settled-board model; demonstrate legal moves, rejected collisions and restart. Code review, applicable failure/regression checks, report and tracking closure are required. | Geometry/reducer and initial UI are genuine prerequisites for the full loop. |
| 1.2 — Complete classic loop | Gravity, failed-down locking, line clears, score/levels and exactly-once game over work together. Code review, applicable failure/regression checks, report and tracking closure are required. | Fixed failed-down locking and independent uniform pieces form the simple classic baseline; interval locking and bags belong to later rule increments. |
| 1.3 — Browser delivery | Keyboard/focus/pause, readable game information and an extracted offline-asset browser build pass acceptance. Code review, applicable failure/regression checks, report and tracking closure are required. | Browser delivery establishes early usability and build reproducibility without requiring unfinished native wrappers. |
| 1.4 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the browser artifact, and establish integration/release readiness for 0.1.0. Later contracts are scheduled rather than claimed complete.

## Phase 2 — Desktop and sidebar baseline

Outcome: The same classic game runs from verified Windows Electron, Chromium sidebar and Firefox sidebar packages.

Included contracts: HOST/UI, RELEASE for all four targets. Gameplay remains classic; no settings/score persistence or file-operation permissions are introduced.

Prerequisite: Phase 1 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 2.1 — Windows desktop | A portable Electron package runs from its extracted files without Node.js or a development server. Code review, applicable failure/regression checks, report and tracking closure are required. | Protocol, asset resolution and native lifecycle are the bounded desktop integration risk. |
| 2.2 — Chromium sidebar | An unpacked development package opens a real Chromium side panel and implements pause/reopen semantics. Code review, applicable failure/regression checks, report and tracking closure are required. | Full-browser native sidebar evidence is required; testing its panel HTML in a tab is insufficient. |
| 2.3 — Firefox sidebar | A temporary development package opens a real Firefox sidebar, preserving session destruction rules. Code review, applicable failure/regression checks, report and tracking closure are required. | Distinct manifest and lifecycle integration are required; signing/store distribution is separate. |
| 2.4 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.2.0. Later contracts are scheduled rather than claimed complete.

## Phase 3 — Piece flow

Outcome: 7-bag generation, next-piece preview and once-per-piece Hold are available on all delivered hosts.

Included contracts: MOD bag/preview/Hold. SRS, ghost, hard drop, interval lock delay, penetrator and settings remain scheduled later.

Prerequisite: Phase 2 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 3.1 — Bag and next preview | Each bag contains seven unique types; preview matches the next spawn without consuming randomness. Code review, applicable failure/regression checks, report and tracking closure are required. | One stream must govern both displayed and consumed pieces. |
| 3.2 — Hold | Empty and populated Hold slots, reset orientation, per-piece limits and blocked swap spawn integrate correctly. Code review, applicable failure/regression checks, report and tracking closure are required. | Hold depends on the coherent next stream and its complete lifecycle, not on landing enhancements. |
| 3.3 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.3.0. Later contracts are scheduled rather than claimed complete.

## Phase 4 — Landing and rotation rules

Outcome: SRS wall kicks, ghost, hard drop and full-interval locking provide the modern landing experience on every host.

Included contracts: MOD SRS/ghost/drop/timing. Penetrator and configurable alternatives remain later; delivered controls use fixed sensible modern defaults.

Prerequisite: Phase 3 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 4.1 — SRS rotation | Ordered piece-specific kick candidates work at walls/floors and reject invalid rotations. Code review, applicable failure/regression checks, report and tracking closure are required. | Orientation data and kick signs need independent fixtures. |
| 4.2 — Ghost and hard drop | Visible projection and hard drop agree on the first reachable normal landing. Code review, applicable failure/regression checks, report and tracking closure are required. | One landing service prevents divergent previews and movement. |
| 4.3 — Grounded lock delay | Grounding, pause exclusion, support changes and repeated-drop no-reset behavior are integrated. Code review, applicable failure/regression checks, report and tracking closure are required. | Timing must be verified together with landing and rotation before introducing penetrator traversal. |
| 4.4 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.4.0. Later contracts are scheduled rather than claimed complete.

## Phase 5 — Penetrator and dynamic ghost

Outcome: Earn/spend capped penetrator bonuses and traverse obstructions to the deepest valid landing; ghost visibility respects the midline.

Included contracts: PEN and MOD dynamic visibility. Six-setting UI remains later; this increment uses dynamic ghost visibility as its fixed mode.

Prerequisite: Phase 4 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 5.1 — Penetrator gameplay | Four-line rewards, activation, transit, strict final placement, white rendering and Hold disabling work together. Code review, applicable failure/regression checks, report and tracking closure are required. | Ability lifetime and shared landing geometry form one bounded gameplay increment. |
| 5.2 — Projection integration | Normal/penetrator ghost and hard drop agree through multiple obstructions and midline boundaries. Code review, applicable failure/regression checks, report and tracking closure are required. | Boundary and cross-feature tests must establish that the ability cannot overwrite settled cells or reset timers improperly. |
| 5.3 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.5.0. Later contracts are scheduled rather than claimed complete.

## Phase 6 — Session configuration and panels

Outcome: Players can adjust all six settings within the current document and control auxiliary panel visibility.

Included contracts: CFG memory-only, UI panel layout/toggles. Cookies, URL configuration, extension storage, leaderboard data and Save/Restore remain absent.

Prerequisite: Phase 5 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 6.1 — Six session settings | All six controls apply valid values and their timing/visibility/input effects immediately. Code review, applicable failure/regression checks, report and tracking closure are required. | Settings use memory ports only; reload/reset evidence protects the required intermediate increment. |
| 6.2 — Responsive panel controls | The board stays centered, required panels stay visible, and narrow sidebars expose all available controls. Code review, applicable failure/regression checks, report and tracking closure are required. | Panel toggles and host integration are verified together; no nonfunctional file buttons are displayed. |
| 6.3 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.6.0. Later contracts are scheduled rather than claimed complete.

## Phase 7 — Persistent settings

Outcome: Browser/desktop cookie and URL settings, and extension-local settings, survive reopening with precise per-key precedence.

Included contracts: CFG persistent resolution/transactions, HOST settings adapters. Scores remain session-only; no automatic game-state persistence or manual file import/export.

Prerequisite: Phase 6 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 7.1 — Browser and desktop settings | Explicit URL values, cookies, defaults, invalid sources and unrelated URL state follow CFG on web and packaged desktop. Code review, applicable failure/regression checks, report and tracking closure are required. | Standard app-origin cookies must be tested in the native desktop package, not assumed from browser tests. |
| 7.2 — Extension settings and failures | Both extension storage adapters restore/save settings and ordinary failed writes roll back coherently. Code review, applicable failure/regression checks, report and tracking closure are required. | Profile persistence and per-document session boundaries must remain independent. |
| 7.3 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.7.0. Later contracts are scheduled rather than claimed complete.

## Phase 8 — Session leaderboard

Outcome: The top ten completed-game results appear in a toggleable panel with stable IDs, UTC timestamps and deterministic ranking.

Included contracts: SCORE and leaderboard UI. Reload clears results; persistent scores and file buttons remain absent.

Prerequisite: Phase 7 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 8.1 — Session results | Completion, ranking, ties, trimming and panel presentation work without persisting scores. Code review, applicable failure/regression checks, report and tracking closure are required. | One narrow delivery milestone avoids splitting a small cohesive result feature; settings persistence is already established. |
| 8.2 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 0.8.0. Later contracts are scheduled rather than claimed complete.

## Phase 9 — Manual portable saves

Outcome: Save and Restore provide validated JSON/SQLite exchange of session results and all six settings on every target.

Included contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE. No automatic score persistence, backend, signing or store publication is implied.

Prerequisite: Phase 8 reviewed, integrated, published and released; activate only this eligible phase before execution.

| Milestone | Outcome / demonstration and exit | Scope rationale |
| --- | --- | --- |
| 9.1 — JSON transfer | Versioned JSON, Schema/semantic validation and user-initiated Save/Restore integrate with settings and results. Code review, applicable failure/regression checks, report and tracking closure are required. | Validation/staging must precede any live or host mutation. |
| 9.2 — SQLite transfer | Real SQLite databases, versioned metadata, exact rows and bundled worker/WASM assets provide the same canonical snapshot. Code review, applicable failure/regression checks, report and tracking closure are required. | The shared validator avoids format drift while real bytes and offline package checks establish the second format. |
| 9.3 — Transactional transfer delivery | Corruption, cancellation, resource limits and host failures preserve state across both formats and all hosts. Code review, applicable failure/regression checks, report and tracking closure are required. | Actual file dialogs/downloads and extracted-package checks close the end-to-end manual persistence boundary. |
| 9.4 — Phase review | Review cross-milestone interactions, required extracted artifacts, usability evidence and phase exits; repair blockers and retain the phase report. | Separate final review; depends on all delivery milestone closures. |

Phase exit: demonstrate the outcome and its included SPEC acceptance groups, preserve all earlier delivered behavior, verify the four required platform artifacts, and establish integration/release readiness for 1.0.0. Aggregate final unresolved/deferred TODOs and the full implementation report; verify complete target coverage.

## Integration, packaging and releases

Milestone demonstrations supply functional/usability evidence for the human to continue, amend, simplify or stop; routine authorized progression does not require additional approval. A report identifies actual findings and limitations rather than fabricating user trials. Unresolved contract violations or missing required runtime/package evidence block the owning milestone/phase.

Every phase includes version, installation instructions, release notes, notices, artifact generation, checksums, and real artifact acceptance for its platforms. A final delivery boundary integrates the phase's changed behavior into each delivered host before phase review. Phase review verifies source/task persistence and prepares an evidence-backed release candidate, without pretending that the still-pending default merge/tag/release has happened.

After phase review and all applicable tracking closures, explicitly merge the complete phase into its recorded main target, verify the merged state, publish and read back. Use the established default-branch release-commit procedure; pin the exact release source, build and verify its final assets, publish/read back its tag and then create the GitHub release. Confirm uploaded bytes/checksums, complete notes, source/version agreement and actual development/signing status before calling the phase delivered. Rebuild/recheck assets affected by final release-source changes; earlier candidate tests do not automatically certify a changed artifact. Release preparation and publication follow the release workflow, not fabricated additional product tasks.

Browser assets are a deployable static ZIP; from Phase 2 also include the portable Windows Electron ZIP, Chromium unpacked-development ZIP and Firefox temporary-development ZIP. Every subsequent release contains updated packages for all four platforms. Desktop/extension assets require no external Node.js, local development server, backend or CDN. Add worker/WASM and schema assets only when file persistence is delivered. Record SHA-256 and the tested artifact name/version for each check.

## Verification, risks and gates

Use domain tests with injected time/randomness, application/codec/adapter integration tests and isolated browser acceptance. Rendering needs actual visual inspection or pixel/shape checks; DOM text alone is insufficient. Full browsers are required for true sidebars. Native Windows tests exercise extracted packages, protocol assets, cookies, lifecycle and eventual dialogs; Linux or cross-build evidence cannot substitute. Preserve the repository browser and Windows shell policies.

| Risk | Required decision/evidence gate |
| --- | --- |
| Browser provisioning or unsupported sandbox/session lifecycle | Diagnose official, compatible isolated distributions under policy; retain missing evidence as blocked rather than silently dropping Firefox or actual sidebars |
| Native Windows runner availability | Establish native packaged execution before Phase 2 desktop acceptance; preserve browser results without claiming the four-target phase complete |
| Electron standard-origin cookies/WASM and file adapters | Packaged Windows tests before the owning host/settings/file exits |
| Grounding/penetrator geometry and timing | Deterministic boundary fixtures plus cross-feature scenarios before Phases 4/5 complete |
| Six-cookie/history restore rollback | Failure injection and host readback; no claim of crash-atomic multi-store persistence |
| SQLite runtime and malformed input | Real database fixtures, full semantic validation, deadlines and extracted offline worker/WASM tests in Phase 9 |
| Development distribution limitations | Test unpacked/temporary extension and unsigned desktop installation routes and state limitations in every release |

The environment currently establishes documentation tools only; execution tasks must establish reproducible runtime/dependency capabilities. These gates constrain delivery claims and do not require browser installation for document preparation. Repository layout owns physical paths; TASKS owns executable units and their exact dependencies.
