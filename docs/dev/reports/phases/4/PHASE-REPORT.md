# Phase 4 — Landing and rotation review

## Outcome and independent review

T-028–T-037 deliver standard ordered SRS, first-reachable normal landing/ghost, two-point hard drop and full-interval grounded locking in the shared game. Phase base is3356f0040ff0c7c1eebbddcacb8116ea777228a4. Independent milestone and final phase reviews found no actionable findings; the final review covered the complete delta through9924da1bdf8fb3203c5bda81fd4a8a1124b33f1e and verified candidate versions/hashes, current controls, identical compiled UI and absence of private archive paths.

## Verification and persistence

- Fresh phase checks passed119 core/application,8 desktop boundary,2 background API,14 packaging and1 private-route case plus typecheck. Builds pass. Each final extracted target passed40 headless cases,160 total; exact candidate hashes are in [Milestone4.3](4.3.md). No runtime/packaged instruction changed after those checks.
- Independent literal fixtures cover28 orientations, centers, distinct ordered I/JLSTZ kicks and y-sign conversion. Wall/floor/stack candidates, first-valid ordering and complete rejection are checked. Hold returns canonical orientation; score, board and timers remain unchanged by rotation.
- Projection/ghost/hard drop use one first-reachable normal landing. Tests cover hidden support, wells/obstructions, coincidence, distance points, zero-distance/terminal repeats and saturation. Space is board-only, once per press, and leaves focused button behavior intact.
- Timing tests cover captured full intervals independent of gravity remainder, exact boundaries/contact, no refresh while supported, support loss/recontact, multiple locks/top-out, large/chunked equivalence, pause and Hold/spawn reset. General drop waits; immediate override locks. The fixed shared-session default is interval; configurable settings remain later.
- Browser checks include five widths280–1440, prior piece flow/game lifecycle, actual DOM input and explicitly modeled host blur/focus. Screenshots were visually inspected. Established Chromium headless shell151.0.7922.34 and managed Firefox153.0 use owned browser assets and the diagnosed trusted-local Firefox process override. Native Windows/installed-sidebar delivery remains explicitly unverified under user authorization and does not halt progression/releases.
- Delivery issues37–45 and milestones13–15 are closed/read back. Each actual T-028–T-036 closing commit/parent diff was audited for one leading owning ID, one initial executable checkbox and owned result/tests/instructions/evidence together. T-037 staging/actual commit receives the same check. Parent-only lifecycle reconciliation closes no other executable task.
- Version0.4.0 is consistent in package/lock and all candidates. Complete body-only notes are retained at ignored root RELEASE-NOTES.md. The new internal highlights checkpoint accounts for every identity since v0.3.0, omitting only previous-release bookkeeping. Final default integration/release identities require incremental coverage refresh before publication.

Phase4 implementation exits within the authorized scope are established. Integration/release are subsequent operations, not implied by this checked task. Final-source packages must rebuild to the tested bytes or receive affected acceptance; published body/assets/digests/downloads/latest require actual readback.

## Next action and TODO

Publish T-037, close/read back issue46/review milestone16, explicitly integrate/verify/publish the phase into refreshed main, prepare the exact-body default release commit/tag and publish/read back v0.4.0 with all nine assets. Activate Phase5 only afterward under the retained full72-task authorization. No unresolved phase issue; native evidence limitations remain unverified, never passed.
