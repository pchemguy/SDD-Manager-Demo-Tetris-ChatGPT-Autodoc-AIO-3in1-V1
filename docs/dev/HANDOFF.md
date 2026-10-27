# Project handoff

Checkpoint: Milestone 2.1 desktop implementation/package verified under the native Windows exception; T-013 publication and milestone closure follow.

Outcome: T-001–T-013 implement the classic browser game and desktop host/lifecycle/portable Windows candidate. Eight desktop, 40 core/app, 10 package and 28 extracted-Windows-shared-asset cases pass. Native Windows execution remains explicitly waived/unverified. See [desktop milestone report](reports/phases/2/2.1.md). Phase 1 v0.1.0 remains the latest published release; Phase 2 is incomplete.

## Workflow and sources

- Workflow: main implementation; sdd-implement owns T-001–T-072. Governing [SPEC](SPEC.md), [PLAN](PLAN.md), [layout](layout.md), [TASKS](TASKS.md), [package QC](DOCS-QC-REPORT.md) and [preparation evidence](DOCS_PREPARATION.md).
- Dependencies: Node 24.x, exact package-lock dependencies and [development commands](../user/DEVELOPMENT.md). Isolated Chromium/Firefox browser input/Canvas execution is verified under the documented recovered environment; native Windows and actual sidebars remain unverified.
- Selected range: full 72-task implementation with required phase releases, authorized by “Do QC and full implement” and resumed by “Try again”. No additional human checkpoint approval is required within that scope; technical gates remain except the explicit native Windows verification exception below.
- Tracking: phase label sdd-phase-1-Classic-browser-game; milestones 1.1–1.4 map to GitHub milestone numbers 2–5; all ten task bodies/labels/milestone associations were read back before T-001. T-001 is issue 10. Phase 2 is now fully projected: label sdd-phase-2-Desktop-and-sidebar-baseline; milestones 2.1–2.4 are numbers 6–9; T-011–T-020 are issues 20–29, all titles/bodies and associations read back. Later phases remain unactivated.
- The projection utility left T-001 creation uncertain; read-only reconciliation confirmed it, then missing issues were created/reused and every association read back. No duplicate identities were created.
- Reporting: Standard. Preserve one verified task result/evidence/initial checkbox per commit, push/read back before advancing.

## Branches and return

- Current branch: phase/2-desktop-and-sidebar-baseline; creation parent/integration target: main. Completed Phase 1 source: phase/1-classic-browser-game.
- Creation parent and integration target: main.
- Phase 2 branch-off commit: 422adf7f01bde2a0a0912448b5f3744f7e7d998c.
- Retain design-docs/main and design-docs/ai-logs. Preparation integration is complete; no unfinished parent workflow is suspended.

## Pending work and next action

- Preserve the explicit user instruction “Run full implementation without native Windows 10/11 verification” across all remaining tasks/releases. Native Windows execution is waived; source/adapter/archive and available runtime checks remain required, Windows assets remain in scope, and native Windows claims remain unverified. Actual extension sidebar checks are not waived.
- Confirm T-013 publication/issue 22 closure and close/read back milestone 6 (2.1). T-011/T-012 publication and issue closures are verified. Candidate tetris-windows-x64-0.2.0.zip has SHA-256 b9d0794e17fe0cc7d2a235a99434cc0627cbf98658fa856e3cdad8d70083918c; rebuild via the recorded package command if ignored files are unavailable.
- Next task T-014 requires an actual Chromium side panel. Fresh isolated full Chromium 151.0.7922.34 launch fails before page creation with process_singleton_posix.cc:297 socket() EPERM; an independent AF_UNIX bind is also denied. Playwright's owned process/profile cleanup completed. Headless-shell asset tests pass but cannot establish actual sidebars. Docker/Xvfb and a compatible connected remote facility are unavailable. No restriction bypass, browser downgrade or silent coverage waiver is authorized.
- Full T-001–T-072 implementation and per-phase release authority persists. Resume T-014 when its required full-browser capability is available; Phase 2 remains on its phase branch and must not integrate/release while its unwaived exits remain blocked.
