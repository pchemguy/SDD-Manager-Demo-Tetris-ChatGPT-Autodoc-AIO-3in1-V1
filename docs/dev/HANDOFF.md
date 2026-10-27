# Project handoff

Checkpoint: Phase 5 activated from published Phase 4; T-038 rewards/activation in progress.

Outcome: T-001–T-037 are implemented, individually committed/pushed and closed. Phase 4 integrated at c5908f5a03848f4f64803e930bb8b5f2dd2394c2; v0.4.0 is published stable/latest from 645415b2c39c90a833f0ba9bbf0a0f62520c43d2. All nine assets and the body were downloaded/read back and byte/hash compared. See [phase/release report](reports/phases/4/PHASE-REPORT.md).

## Workflow and authority

- Workflow: main implementation under sdd-implement, selected full T-001–T-072 with per-phase releases, authorized by “Do QC and full implement” and subsequent continuation/“Go”. No additional human checkpoint approval is required inside that scope; QC, verification, publication and tracking gates remain.
- Governing sources: [SPEC](SPEC.md), [PLAN](PLAN.md), [layout](layout.md), [TASKS](TASKS.md), [task-list QC](TASKS-REVIEW-REPORT.md), [package QC](DOCS-QC-REPORT.md) and [preparation evidence](DOCS_PREPARATION.md). Preparation integration is complete; retain design-docs/main and design-docs/ai-logs. No unfinished parent workflow is suspended.
- Preserve one verified task result/evidence/initial executable checkbox per commit, push/read back before advancing, and close/read back task issues and milestones. Automatic milestone/phase report tasks own checkpoint refresh. Integrate complete verified phases explicitly; keep release tags on their exact default-branch release commits.
- Tracking remains enabled. Phase 4 issues 37–46 and milestones 13–16 are closed/read back. Later phases remain unactivated. Reuse known identities rather than creating duplicates after uncertainty.

## Verification scope and setup

- User explicitly directed “Run full implementation without native Windows 10/11 verification” and selected supported headless checks for continuation. Native Windows execution and actual installed-sidebar/native-window delivery remain explicitly unverified and do not halt implementation/releases. Never describe modeled host APIs or extracted-asset rendering as native checks.
- Node24.x, pinned package-lock dependencies and Python3.11+; see [development commands](../user/DEVELOPMENT.md). Use owned absolute browser/cache paths, Chromium headless shell and managed Firefox. On this diagnosed trusted-local Linux host only, TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 enables the documented process-only Firefox override. Full Chromium's host-denied socket EPERM is not repaired by repeating sandbox flags; do not change host restrictions.
- Build all four packages with package:all, check/extract exact bytes and run the supported headless suites. Generated assets/caches remain ignored. Do not expose gh.tkn or ship private files. Native packages retain unsigned/unpacked/temporary status. Complete notes remain retained locally and in release commit/body; consumed internal highlights are separately cleaned up.

## Branches and next action

- Current branch: phase/5-penetrator-and-dynamic-ghost, created from published main e4a9920f54e8b1bb0bb4b59732325173e0f55525. Integration target: main.
- Phase 5 branch-off and all tracking were verified before source/test edits: milestones5.1–5.3 are17–19, T-038–T-044 are issues47–53. Continue T-038 rewards/activation, then bounded transit, controls and dynamic projection in task order; full T-038–T-072 authorization persists.
- Reconstruct current state from this checkpoint plus subsequent Git/task evidence. Current release/body/assets/latest and closure gates are verified; Phase 5 tracking is fully activated as recorded above.
