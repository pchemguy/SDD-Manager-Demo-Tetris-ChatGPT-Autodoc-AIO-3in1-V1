# Phase 3 — Piece flow review

## Outcome and independent review

T-021–T-027 deliver seven-piece bags, a non-consuming next preview and once-per-piece Hold across all four shared-host packages. The phase branch started at published main2326831e3c5222decccb7bbd207f4451aa418682. Independent delivery and final phase reviews found no Critical, Important or Minor defects. The final review covered the complete delta through bfc8874983a272f6569880fa397908ebb8452f3c and confirmed candidate hashes/versions, current instructions, identical compiled assets and absence of credential/hidden paths in archives.

## Verification and persistence

- Fresh phase checks passed55 core/application,8 desktop boundary,2 background API,14 packaging and1 private-route case plus typecheck. Production builds pass. Final source UI passed20 cases and all four extracted packages passed32 headless cases each,128 total. These exact candidates/hashes are listed in [Milestone3.2](3.2.md); no runtime or packaged instruction changed afterward.
- Acceptance covers independent complete bags, seeded reproducibility/shuffle bounds, lazy cached preview, multiple spawns/restart, empty/populated Hold, stream draw counts, once-per-piece restriction, spawn position/orientation/timers, blocked swap, paused/game-over rejection and C/Shift/button interaction. Five widths280–1440 remain centered and operable, with reachable Next/Hold/help and no horizontal overflow/external requests. The retained280px screenshot was visually inspected.
- Issues30–35 and delivery milestones10/11 are closed/read back. Every actual T-021–T-026 closing commit and its parent diff was audited: one leading owning ID, one initial executable checkbox and task-owned source/tests/instructions/evidence together. T-027 staging/commit receives the same check. Parent-only milestone reconciliation does not close another executable task.
- Version0.3.0 is consistent in package/lock and all archives. Complete body-only notes are retained at ignored root RELEASE-NOTES.md; the new internal highlights checkpoint accounts for every identity since v0.2.0, omitting only prior-release bookkeeping. Final default integration/release commits require incremental coverage refresh before publication.
- Chromium headless shell151.0.7922.34 and managed Firefox153.0 use owned browser assets and the diagnosed trusted-local process-only Firefox override. Native Windows execution and actual installed-sidebar events remain explicitly unverified under the user-authorized scope and do not halt implementation/releases. No static/modeled evidence is presented as native verification.

All Phase3 implementation exits within that scope are established. Integration/release publication remain subsequent workflow steps. The final release source must rebuild to the tested candidate bytes or receive affected acceptance checks; uploaded inventory, body, digests, downloads and latest state require readback.

## Next action

Publish T-027, close/read back issue36 and review milestone12, then explicitly integrate the complete phase into refreshed main, verify/publish, prepare the exact-body default-branch release commit, rebuild/verify assets and publish/read back v0.3.0. Only after that gate activate Phase4 under the retained full72-task authorization.

## TODO

None within the authorized phase scope. Native Windows/installed-sidebar coverage remains an unverified evidence limitation.
