# Implementation tasks

## Governing inputs and execution boundaries

Use [SPEC](SPEC.md), its [portable format](spec/PORTABLE-FORMAT.md), [ARCHITECTURE](ARCHITECTURE.md), [DECOMPOSITION](DECOMPOSITION.md), [PLAN](PLAN.md) and [layout](layout.md). Each item is planned and initially unchecked. The owning task's implementation, relevant tests/docs, evidence and initial checkbox completion must be committed together, then pushed/read back before progression. Project milestones/phases close only after their assigned boundary evidence and applicable issue/milestone closures.

Each task includes contract-derived tests and relevant documentation, not a separate detached test/checkbox task. Fix blocking findings before completing its boundary. Delivery milestone reports have a TODO section (None when empty); preserve permitted deferral evidence. Phase review is eligible after all delivery milestones close. The final implementation report aggregates unresolved/deferred findings with provenance.

Versions and platform deferrals are in PLAN. Every phase review prepares source/version/notes/assets for the separate verified main integration and default-branch release workflow. A checked review task alone does not prove an integrated phase, published release or platform delivery. Do not activate future phase tracking or execute beyond the human-authorized range.

## Phase 1 — Classic browser game

- [ ] Phase 1 — Classic browser game
    - [x] Milestone 1.1 — Playable board
        - [x] T-001 — Establish geometry and a pinned development foundation
            Scope: package/tool configuration, src/core geometry and tests/core. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: none; accepted/published preparation and verified eligible Phase 1 projection.
            Acceptance/evidence: Pin compatible dependencies/lockfile; verify all seven spawn shapes, bounds and occupied-cell tests; document the actual Linux/Windows-CMD commands and isolated browser setup requirements.
            Verified: Node 24.22.1; all 11 independent geometry tests first failed for unimplemented geometry, then passed after implementation, including after clean npm ci. npm run typecheck passed. Vite 8.3.5, TypeScript 7.0.2 and Playwright 1.62.1 are pinned in the lockfile. npm emits an inherited http-proxy configuration warning; installation and checks succeed. Browser/runtime package acceptance is not part of this task.
        - [x] T-002 — Implement active-piece commands and restart state
            Scope: src/core reducer and tests/core. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-001.
            Acceptance/evidence: Controlled streams prove spawn, movement, baseline no-kick rotation, rejected moves and fresh restart without settled-cell overwrites.
            Verified: seven new command tests observed RED before implementation, then 18 total core tests passed; typecheck passed. Controlled draw counts, immutable move/restart outcomes, wall/settled-cell rejection, no-kick rotation and blocked spawn were exercised. Gravity and line/score progression remain separate tasks.
        - [x] T-003 — Render and control the playable board
            Scope: src/app session composition, src/ui board and tests/ui. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-001, T-002.
            Acceptance/evidence: A real browser displays the board and active piece, accepts focused movement/rotation and visibly rejects collisions; domain state and rendering agree.
            Verified: two real-browser missing-control tests observed RED, then four UI tests passed across managed Chromium/Firefox; all 18 core tests, typecheck and production compilation passed. Whole-milestone code review and visual inspection passed; see reports/phases/1/1.1.md for browser recovery, screenshots and evidence limits.
            Follow-up repair: a synthetic HEAD-only fixture demonstrated that development credential routes were served (HTTP 200). Explicit Vite fs.deny rules now reject direct, encoded, raw-query and @fs credential routes; the regression passes. Real credentials were neither read through HTTP nor logged. No game rules or task completion changed.
            Milestone boundary: after its implementation, review all of 1.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/1/1.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [x] Milestone 1.2 — Complete classic loop
        - [x] T-004 — Implement gravity and classic locking
            Scope: src/core reducer timing and tests/core. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-003.
            Acceptance/evidence: Explicit time advances prove gravity, failed-down locking, spawn transitions and top-out at boundaries.
            Verified: Six new gravity/locking scenarios observed RED before implementation; all 24 core tests, typecheck and four Chromium/Firefox UI regressions passed. Explicit active-time intervals/remainders, failed-down locking, exactly-one next spawn, top-out without board writes, paused/over exclusion and invalid elapsed input were verified. Session soft-down uses the coherent locking transition; automatic UI scheduling remains T-006.
        - [x] T-005 — Implement line clearing and score progression
            Scope: src/core scoring/clear transitions and tests/core. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-004.
            Acceptance/evidence: One through four simultaneous clears, row compaction, drop points, score saturation and level/speed thresholds match GAME.
            Verified: Eight scoring/clear fixtures observed RED before implementation; all 32 core tests, typecheck and four Chromium/Firefox UI regressions passed. Verified 1-4 simultaneous line awards, row compaction, independent empty rows, pre-clear level multipliers, level/speed thresholds, soft-drop versus gravity points and safe-integer score saturation. An intermediate duplicate-local compile error was corrected before the passing runs. Hard drop remains outside the classic phase.
        - [x] T-006 — Integrate the complete classic game loop
            Scope: src/app session, src/ui game information and tests/e2e. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-004, T-005.
            Acceptance/evidence: Demonstrate continued play, score/levels and game over; completion fires once and restart abandons unfinished games without recording fake completions.
            Verified: Four application cases and two real-browser automatic-gravity scenarios observed RED before integration. Final verification: 36 core/application tests, eight Chromium/Firefox UI tests, typecheck and production compilation passed. Whole-milestone code review, completion/restart behavior and screenshot inspection passed; report 1.2.md records timing controls, resolved status-locator ambiguity and native/package evidence limits.
            Milestone boundary: after its implementation, review all of 1.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/1/1.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [x] Milestone 1.3 — Browser delivery
        - [x] T-007 — Implement pause, focus and keyboard repeat handling
            Scope: src/app input/scheduler and focused UI checks. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-006.
            Acceptance/evidence: Pause excludes elapsed time, blur clears held keys, repeats use specified delays, and form/button interaction keeps normal keyboard behavior.
            Verified: Four new application input/pause cases and three Chromium UI cases observed RED. Final checks passed 40 core/application tests, 16 Chromium/Firefox UI cases, typecheck and production compilation. Verified 150/50 ms horizontal and 50 ms down repeats, once-per-press rotations, pause remainder/no catch-up, P/Escape, real DOM board-blur key clearing, and explicitly modeled window/visibility suspension with manual resume. Full Chromium native-window probing was blocked by the host socket restriction; no host restriction was relaxed and native desktop/sidebar evidence remains pending.
        - [x] T-008 — Build and document the standalone browser artifact
            Scope: scripts web packaging, generated dist/web and docs/user. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-007.
            Acceptance/evidence: Extracted static build runs through a static HTTP(S) host without an app backend/CDN; include controls, notices, versioned archive and checksums.
            Verified: Five archive cases observed RED before implementation; all five packaging tests and the private-route regression pass. Production build and ZIP CRC/content checks passed. The extracted candidate launched over a plain static HTTP host in managed Chromium, with working input/score/pause, no page errors and only local runtime requests. Candidate SHA-256: 744557c62935ff1330ec88ec333aaf928195033dc826ef24fc8e0765bc234421. Installation/control/license/version documents and checksums included; reproducibility, private-file, symlink and traversal checks passed. Final broad artifact acceptance and release are still T-009/T-010.
        - [x] T-009 — Verify baseline browser usability and package behavior
            Scope: tests/e2e, scripts artifact checks and docs/user. Contracts: GAME, basic HOST/UI, browser RELEASE.
            Depends on: T-007, T-008.
            Acceptance/evidence: Isolated Chromium/Firefox exercise the extracted build, actual Canvas output, restart/pause and wide/narrow layout; report exact binaries and evidence limitations.
            Verified: 26 extracted-build Chromium/Firefox cases passed across five viewport widths; 40 core/app tests, typecheck, five packaging tests and credential-route regression passed. Candidate ZIP hash remained 744557c62935ff1330ec88ec333aaf928195033dc826ef24fc8e0765bc234421. Whole Milestone 1.3 code review and screenshot inspection passed; see reports/phases/1/1.3.md for binaries and explicit native-event limits.
            Milestone boundary: after its implementation, review all of 1.3, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/1/1.3.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [x] Milestone 1.4 — Phase review
        - [x] T-010 — Review, test and report phase 1
            Scope: whole Phase 1 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-003, T-006, T-009; all delivery milestones 1.1, 1.2, 1.3 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.1.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Verified: Independent Phase 1 code review found no Critical/Important issues; two Minor help/documentation findings fixed and rechecked. Narrow guide regression observed RED before repair; all 28 rebuilt extracted-browser cases, 40 core/app tests, typecheck, five packaging cases and credential-route regression pass. Task persistence audit passed; version 0.1.0 notes and candidate hash prepared. See reports/phases/1/PHASE-REPORT.md. Integration and published release remain subsequent gates.
            Report: docs/dev/reports/phases/1/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 2 — Desktop and sidebar baseline

- [ ] Phase 2 — Desktop and sidebar baseline
    - [ ] Milestone 2.1 — Windows desktop
        - [ ] T-011 — Implement the sandboxed Electron asset host
            Scope: electron main/protocol/preload, src/platform/electron and tests/desktop. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-010. Phase 1 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Allowlisted standard app origin loads bundled assets, rejects traversal/navigation, and exposes no Node or arbitrary filesystem API to the renderer.
        - [ ] T-012 — Integrate desktop focus and lifecycle behavior
            Scope: electron window lifecycle, src/platform/electron and native tests. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-011.
            Acceptance/evidence: Native focus/hide/resume events pause the shared game, preserve remaining timers and clear keys; retained versus destroyed windows follow session contracts.
        - [ ] T-013 — Package and verify portable Windows execution
            Scope: scripts desktop packaging, tests/desktop and docs/user. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-011, T-012.
            Acceptance/evidence: Extracted Windows x64 ZIP launches on actual declared Windows versions without external Node/server; record unsigned status, runtime versions, offline assets and checksums.
            Milestone boundary: after its implementation, review all of 2.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/2/2.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 2.2 — Chromium sidebar
        - [ ] T-014 — Build the minimal Chromium sidebar package
            Scope: extensions/chromium, src/entry and src/platform/chromium. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-013.
            Acceptance/evidence: MV3 manifest and local assets open the same classic game in a real side panel with only currently required permissions.
        - [ ] T-015 — Integrate Chromium panel close and reopen events
            Scope: src/platform/chromium lifecycle bridge and tests/extensions/chromium. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-014.
            Acceptance/evidence: Chromium 142+ native panel events pause retained documents, reset destroyed sessions and never persist scores or run background gravity.
        - [ ] T-016 — Verify Chromium development installation and layout
            Scope: scripts extension packaging, native panel tests and docs/user. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-014, T-015.
            Acceptance/evidence: Extract and load unpacked; demonstrate actual panel input, 280/360/600 widths, close/reopen and offline loading, with exact package/binary evidence.
            Milestone boundary: after its implementation, review all of 2.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/2/2.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 2.3 — Firefox sidebar
        - [ ] T-017 — Build the Firefox sidebar package
            Scope: extensions/firefox, src/entry and src/platform/firefox. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-016.
            Acceptance/evidence: Firefox manifest/sidebarAction opens the shared app from local assets without a native companion, remote code or premature storage/file permissions.
        - [ ] T-018 — Integrate Firefox sidebar session lifecycle
            Scope: src/platform/firefox and tests/extensions/firefox. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-017.
            Acceptance/evidence: Actual sidebar hide/close/document destruction obey pause/reset rules; retained settings and results have only their current in-scope lifetimes.
        - [ ] T-019 — Verify temporary Firefox installation and all-host parity
            Scope: scripts packaging, tests/extensions/firefox, cross-host checks and docs/user. Contracts: HOST/UI, RELEASE for all four targets.
            Depends on: T-017, T-018.
            Acceptance/evidence: Temporary ZIP installation opens a real sidebar offline; document restart/signing limitations and verify the classic behavior remains shared across all four packaged targets.
            Milestone boundary: after its implementation, review all of 2.3, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/2/2.3.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 2.4 — Phase review
        - [ ] T-020 — Review, test and report phase 2
            Scope: whole Phase 2 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-013, T-016, T-019; all delivery milestones 2.1, 2.2, 2.3 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.2.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/2/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 3 — Piece flow

- [ ] Phase 3 — Piece flow
    - [ ] Milestone 3.1 — Bag and next preview
        - [ ] T-021 — Implement the injectable seven-piece bag
            Scope: src/core randomizer and tests/core. Contracts: MOD bag/preview/Hold.
            Depends on: T-020. Phase 2 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Seeded draws prove each bag has one of every type, valid shuffle bounds and reproducible independent bags.
        - [ ] T-022 — Expose the next-piece snapshot without consuming it
            Scope: src/core/session interfaces and tests/app. Contracts: MOD bag/preview/Hold.
            Depends on: T-021.
            Acceptance/evidence: Repeated preview reads consume no random values and always match the next spawn, including bag boundaries.
        - [ ] T-023 — Render next preview on every host
            Scope: src/ui next view and cross-host acceptance. Contracts: MOD bag/preview/Hold.
            Depends on: T-021, T-022.
            Acceptance/evidence: Preview matches a controlled spawn sequence on browser, desktop and both sidebars without changing gameplay state.
            Milestone boundary: after its implementation, review all of 3.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/3/3.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 3.2 — Hold
        - [ ] T-024 — Implement Hold state and exchange rules
            Scope: src/core Hold transitions and tests/core. Contracts: MOD bag/preview/Hold.
            Depends on: T-023.
            Acceptance/evidence: Empty/populated slots, once-per-piece limits, orientation/timer reset and blocked held-piece spawn match MOD.
        - [ ] T-025 — Integrate Hold controls and presentation
            Scope: src/app input and src/ui Hold view. Contracts: MOD bag/preview/Hold.
            Depends on: T-024.
            Acceptance/evidence: C/Shift exchanges once, renders the held piece and ignores repeated activation until a lock; game over and pause reject actions.
        - [ ] T-026 — Verify piece-flow artifacts and instructions
            Scope: cross-host suites, packaging and docs/user. Contracts: MOD bag/preview/Hold.
            Depends on: T-024, T-025.
            Acceptance/evidence: All four updated extracted artifacts demonstrate bag/preview/Hold combinations, retain classic behavior and contain accurate controls/version/assets.
            Milestone boundary: after its implementation, review all of 3.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/3/3.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 3.3 — Phase review
        - [ ] T-027 — Review, test and report phase 3
            Scope: whole Phase 3 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-023, T-026; all delivery milestones 3.1, 3.2 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.3.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/3/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 4 — Landing and rotation rules

- [ ] Phase 4 — Landing and rotation rules
    - [ ] Milestone 4.1 — SRS rotation
        - [ ] T-028 — Define canonical SRS geometry and orientation fixtures
            Scope: src/core geometry/tables and tests/fixtures. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-027. Phase 3 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: All orientations and rotation centers are explicitly documented; independent fixtures establish matrix coordinates and kick-sign convention.
        - [ ] T-029 — Implement ordered SRS kick searches
            Scope: src/core rotation and tests/core. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-028.
            Acceptance/evidence: JLSTZ, I and O cases cover walls/floors, CW/CCW transitions, first-valid ordering and unchanged state after complete rejection.
        - [ ] T-030 — Integrate SRS rotation into the shared game
            Scope: src/core reducer, src/app input and UI acceptance. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-028, T-029.
            Acceptance/evidence: Visible rotations and rejected wall/floor cases match fixture expectations; Hold/spawn orientation behavior remains correct.
            Milestone boundary: after its implementation, review all of 4.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/4/4.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 4.2 — Ghost and hard drop
        - [ ] T-031 — Implement normal landing projection
            Scope: src/core landing and tests/core. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-030.
            Acceptance/evidence: Projection returns the first reachable resting placement, including hidden-spawn cells, cavities and immediate support, without mutating board state.
        - [ ] T-032 — Implement hard-drop movement and scoring
            Scope: src/core commands and tests/core/app. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-031.
            Acceptance/evidence: Hard drop matches landing, adds exactly two points per descended row and cannot jump obstructions or score on a zero-distance repeat.
        - [ ] T-033 — Render the shared ghost and integrate hard-drop input
            Scope: src/ui board, src/app input and UI checks. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-031, T-032.
            Acceptance/evidence: Ghost outline is distinguishable from active cells and exactly matches hard drop on controlled boards; Space handling does not interfere with form controls.
            Milestone boundary: after its implementation, review all of 4.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/4/4.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 4.3 — Grounded lock delay
        - [ ] T-034 — Implement full-interval grounding timers
            Scope: src/core timing and tests/core. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-033.
            Acceptance/evidence: Grounding captures the interval; grounded movement/rotation and repeated drops do not reset it; support changes and precise boundary times behave deterministically.
        - [ ] T-035 — Integrate timing with pause, Hold and drop policies
            Scope: src/core/app and tests/app. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-034.
            Acceptance/evidence: Paused duration is excluded; Hold/spawn reset only permitted timers; fixed modern interval behavior preserves current hard-drop timing.
        - [ ] T-036 — Verify modern landing packages across hosts
            Scope: cross-host runtime suites, packaging and docs/user. Contracts: MOD SRS/ghost/drop/timing.
            Depends on: T-034, T-035.
            Acceptance/evidence: All four artifacts pass SRS/projection/drop/timing interactions, native pause evidence and preserved piece-flow/classic behavior; update installation/controls notes.
            Milestone boundary: after its implementation, review all of 4.3, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/4/4.3.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 4.4 — Phase review
        - [ ] T-037 — Review, test and report phase 4
            Scope: whole Phase 4 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-030, T-033, T-036; all delivery milestones 4.1, 4.2, 4.3 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.4.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/4/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 5 — Penetrator and dynamic ghost

- [ ] Phase 5 — Penetrator and dynamic ghost
    - [ ] Milestone 5.1 — Penetrator gameplay
        - [ ] T-038 — Implement penetrator rewards and activation lifetime
            Scope: src/core reducer and tests/core. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-037. Phase 4 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Four-line rewards cap at three, activation spends once, restart clears bonuses and Hold remains disabled for the active penetrator.
        - [ ] T-039 — Implement bounded penetrator transit and landing
            Scope: src/core geometry/landing and adversarial board fixtures. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-038.
            Acceptance/evidence: Transit ignores occupied cells without deletion; scan selects deepest fully valid placement, rejects dead-end commands and never descends beyond its landing.
        - [ ] T-040 — Integrate penetrator controls and visual identity
            Scope: src/app input, src/ui board/info and UI checks. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-038, T-039.
            Acceptance/evidence: B activation, entirely white penetrator, nonwhite regular pieces and one symbol per bonus update on the same earn/spend transition.
            Milestone boundary: after its implementation, review all of 5.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/5/5.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 5.2 — Projection integration
        - [ ] T-041 — Implement dynamic ghost midline visibility
            Scope: src/core render projection or src/app presentation model and tests. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-040.
            Acceptance/evidence: Projected cells at rows 9/10, straddling shapes and hidden rows select visibility exactly; rendering mode changes no landing/rule state.
        - [ ] T-042 — Unify penetrator projection, drop and lock behavior
            Scope: shared landing consumers and tests/app. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-041.
            Acceptance/evidence: Multiple obstructions/pockets, movements/rotations during transit, Hold rejection and timing policies keep ghost/drop equal and final placements non-overlapping.
        - [ ] T-043 — Verify penetrator and dynamic-ghost artifacts
            Scope: all-host acceptance/visual checks, packaging and docs/user. Contracts: PEN and MOD dynamic visibility.
            Depends on: T-041, T-042.
            Acceptance/evidence: Four updated packages demonstrate rewards/caps, white rendering, dynamic visibility and no settled-cell destruction; preserve modern and classic regressions.
            Milestone boundary: after its implementation, review all of 5.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/5/5.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 5.3 — Phase review
        - [ ] T-044 — Review, test and report phase 5
            Scope: whole Phase 5 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-040, T-043; all delivery milestones 5.1, 5.2 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.5.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/5/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 6 — Session configuration and panels

- [ ] Phase 6 — Session configuration and panels
    - [ ] Milestone 6.1 — Six session settings
        - [ ] T-045 — Define typed session settings and validation
            Scope: src/app settings, memory ports and tests/app. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-044. Phase 5 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Exactly six settings, enums/booleans and defaults validate without coercion; the memory host reads/writes no URL/cookie/extension store.
        - [ ] T-046 — Implement immediate rule-setting effects
            Scope: src/app settings/reducer integration and tests/app. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-045.
            Acceptance/evidence: Hard drop, Hold, preview and ghost switches preserve stream/held state; general lock changes, paused edits and immediate drop locking follow CFG/MOD.
        - [ ] T-047 — Render all six settings controls
            Scope: src/ui settings and UI checks. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-045, T-046.
            Acceptance/evidence: Controls have semantic labels, exact allowed values, readable current state and immediate effects; file buttons are absent and reload resets to defaults.
            Milestone boundary: after its implementation, review all of 6.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/6/6.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 6.2 — Responsive panel controls
        - [ ] T-048 — Implement centered auxiliary panel layout
            Scope: src/ui layout/panels and visual acceptance. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-047.
            Acceptance/evidence: Info and board remain visible; three independent toggles above Pause/Start control auxiliary panels while the board remains viewport-centered.
        - [ ] T-049 — Adapt panels and focus behavior to narrow sidebars
            Scope: src/ui responsive layout and tests/extensions/ui. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-048.
            Acceptance/evidence: At 280/360/600 pixels every in-scope control is reachable without overflow; auxiliary sections stack below the main group and editing suppresses game hotkeys.
        - [ ] T-050 — Verify session-only configuration packages
            Scope: all-host acceptance, packaging and docs/user. Contracts: CFG memory-only, UI panel layout/toggles.
            Depends on: T-048, T-049.
            Acceptance/evidence: All four artifacts preserve settings during a document session and reset them on document destruction/reload; no persistence calls or nonfunctional Save/Restore controls appear.
            Milestone boundary: after its implementation, review all of 6.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/6/6.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 6.3 — Phase review
        - [ ] T-051 — Review, test and report phase 6
            Scope: whole Phase 6 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-047, T-050; all delivery milestones 6.1, 6.2 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.6.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/6/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 7 — Persistent settings

- [ ] Phase 7 — Persistent settings
    - [ ] Milestone 7.1 — Browser and desktop settings
        - [ ] T-052 — Implement per-key cookie and URL source resolution
            Scope: src/platform/web, shared settings resolver and tests/platform. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-051. Phase 6 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Explicit-default, omitted, invalid/empty/duplicate and mixed-key cases follow URL/cookie/default precedence; unrelated parameters/hash remain untouched.
        - [ ] T-053 — Implement verified browser settings writes and rollback
            Scope: src/platform/web transaction and tests/platform/e2e. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-052.
            Acceptance/evidence: Each change updates the owned cookie/URL value; injected cookie/history failures restore prior state and report unavailable persistence accurately.
        - [ ] T-054 — Verify persistent desktop and web settings
            Scope: src/platform/electron, native desktop/browser suites and docs/user. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-052, T-053.
            Acceptance/evidence: Packaged app-origin cookies persist across restarts; actual browser and native desktop precedence/write tests pass with precise cookie policy and session-only scores.
            Milestone boundary: after its implementation, review all of 7.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/7/7.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 7.2 — Extension settings and failures
        - [ ] T-055 — Implement extension-local settings repositories
            Scope: src/platform/chromium/firefox and adapter tests. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-054.
            Acceptance/evidence: Persist only six validated settings in one record; independently invalid values fall back to defaults; no scores or current game state enter storage.
        - [ ] T-056 — Integrate serialized settings transactions
            Scope: src/app settings and fault-injected integration checks. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-055.
            Acceptance/evidence: Concurrent actions have deterministic order, saved readback gates success, failures roll back and separate panels retain their own applied document snapshots.
        - [ ] T-057 — Verify persistent settings on all packaged targets
            Scope: native extension/browser/desktop checks, packaging and docs/user. Contracts: CFG persistent resolution/transactions, HOST settings adapters.
            Depends on: T-055, T-056.
            Acceptance/evidence: Reopen/reload the actual packages to prove host-specific persistence and retained session boundaries; include storage-denial failure evidence and regression results.
            Milestone boundary: after its implementation, review all of 7.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/7/7.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 7.3 — Phase review
        - [ ] T-058 — Review, test and report phase 7
            Scope: whole Phase 7 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-054, T-057; all delivery milestones 7.1, 7.2 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.7.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/7/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 8 — Session leaderboard

- [ ] Phase 8 — Session leaderboard
    - [ ] Milestone 8.1 — Session results
        - [ ] T-059 — Implement session result identity and ranking
            Scope: src/app leaderboard and tests/app. Contracts: SCORE and leaderboard UI.
            Depends on: T-058. Phase 7 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Stable IDs/UTC timestamps, safe scores, deterministic tie order, duplicate completion suppression and top-ten trimming work with controlled clocks/IDs.
        - [ ] T-060 — Integrate completed results and leaderboard panel
            Scope: src/app session and src/ui leaderboard. Contracts: SCORE and leaderboard UI.
            Depends on: T-059.
            Acceptance/evidence: Game over records once, restart/abandon/cancel do not fabricate results, panel ordering/toggle behavior matches UI and empty histories remain clear.
        - [ ] T-061 — Verify session leaderboard packages
            Scope: all-host acceptance, packaging and docs/user. Contracts: SCORE and leaderboard UI.
            Depends on: T-059, T-060.
            Acceptance/evidence: More than ten completed games, ties, restart retention and document reload clearing pass on all four updated artifacts; settings persistence does not persist scores.
            Milestone boundary: after its implementation, review all of 8.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/8/8.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 8.2 — Phase review
        - [ ] T-062 — Review, test and report phase 8
            Scope: whole Phase 8 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-061; all delivery milestones 8.1 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 0.8.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/8/PHASE-REPORT.md. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.

## Phase 9 — Manual portable saves

- [ ] Phase 9 — Manual portable saves
    - [ ] Milestone 9.1 — JSON transfer
        - [ ] T-063 — Implement canonical snapshots and JSON validation
            Scope: src/transfer validator/JSON codec, canonical Schema and tests/transfer. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-062. Phase 8 integration/publication/release and current-phase activation must also be verified.
            Acceptance/evidence: Schema plus semantic dates/IDs/duplicate-key/version/size/type tests accept exact valid snapshots and reject the entire malformed file without mutations.
        - [ ] T-064 — Implement staged JSON transfer transactions
            Scope: src/transfer controller, src/app settings/leaderboard and tests/app. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-063.
            Acceptance/evidence: Save captures consistent results/settings; Restore replaces results and applies all settings only after full validation, retaining the board/random stream and ordering completion events.
        - [ ] T-065 — Integrate manual JSON files on every host
            Scope: src/platform file ports, electron dialogs, src/ui settings and native checks. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-063, T-064.
            Acceptance/evidence: One Save/Restore pair sits at settings bottom; user-selected JSON writes/reads one file, cancellation is a no-op, hiding settings hides both buttons and each host updates its persistence correctly.
            Milestone boundary: after its implementation, review all of 9.1, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/9/9.1.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 9.2 — SQLite transfer
        - [ ] T-066 — Implement bounded SQLite worker transport
            Scope: src/transfer worker/protocol, build assets and tests/transfer. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-065.
            Acceptance/evidence: Bundled sql.js/WASM starts through the actual host asset path; request IDs, malformed messages, startup failures, timeout and database cleanup produce safe errors.
        - [ ] T-067 — Implement versioned SQLite codecs and validation
            Scope: src/transfer SQLite codec, real database fixtures and tests/transfer. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-066.
            Acceptance/evidence: Exact tables/rows/types, PRAGMA version, unique keys/IDs, actual timestamps and limits validate through the shared snapshot rules; unsupported objects or malformed bytes are rejected.
        - [ ] T-068 — Integrate local SQLite assets and format selection
            Scope: src/ui file choice, host builds and package acceptance. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-066, T-067.
            Acceptance/evidence: Save offers JSON/SQLite and Restore detects content safely; real database round trips preserve exact data on all targets with worker/WASM/Schema present offline.
            Milestone boundary: after its implementation, review all of 9.2, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/9/9.2.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 9.3 — Transactional transfer delivery
        - [ ] T-069 — Exercise cross-format rejection and rollback boundaries
            Scope: src/transfer/app failure handling and adversarial fixtures. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-068.
            Acceptance/evidence: Both formats reject corruption, wrong versions, missing/extra/duplicate keys, invalid scores/dates and resource failures; every validation failure leaves results/settings/cookies/URL/storage unchanged.
        - [ ] T-070 — Verify actual native file workflows and cancellation
            Scope: tests/desktop/extensions/e2e, adapters and docs/user. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-069.
            Acceptance/evidence: Packaged dialogs/downloads, repeated actions, cancellation and worker recovery are exercised through real Windows and sidebar packages; reports distinguish virtual callbacks from native evidence.
        - [ ] T-071 — Assemble and verify complete portable-save artifacts
            Scope: scripts packaging, all-host acceptance and docs/user. Contracts: FILE, portable format, CFG restore integration, complete HOST/UI/RELEASE.
            Depends on: T-069, T-070.
            Acceptance/evidence: Every final package includes all in-scope runtime assets/notices, passes offline end-to-end save/restore plus earlier-feature regressions, and has accurate format/install/development-status instructions and checksums.
            Milestone boundary: after its implementation, review all of 9.3, run required focused/integration/regression checks, repair blockers, and include the milestone report and HANDOFF with this task’s initial completion. Report: docs/dev/reports/phases/9/9.3.md. Close/read back all constituent task issues and this milestone before dependent review/transition.
    - [ ] Milestone 9.4 — Phase review
        - [ ] T-072 — Review, test and report phase 9
            Scope: whole Phase 9 code, contracts, integration, required artifacts and preserved prior behavior.
            Depends on: T-065, T-068, T-071; all delivery milestones 9.1, 9.2, 9.3 completed and closed/read back.
            Acceptance/evidence: independent code review and applicable domain/application/native-package checks cover the phase exits in PLAN; fix blockers, audit one-task commit/checkbox persistence, prepare version 1.0.0, complete release notes, installation/development-status instructions and candidate artifact checksums. Include PHASE-REPORT.md and HANDOFF with this task’s initial completion. A missing required platform check blocks completion; no integration/release is claimed before its actual verified workflow.
            Report: docs/dev/reports/phases/9/PHASE-REPORT.md. Also include docs/dev/reports/IMPLEMENTATION-REPORT.md aggregating final contract coverage and unresolved/deferred milestone/phase TODOs with options and provenance. After this task and its review milestone close, integrate/verify/publish the complete phase and perform the pinned default-branch release workflow before activating any authorized next phase.
