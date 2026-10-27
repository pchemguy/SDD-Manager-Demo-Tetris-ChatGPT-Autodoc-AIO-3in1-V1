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

## Integration and release outcome

Phase 4 explicitly integrated into main at c5908f5a03848f4f64803e930bb8b5f2dd2394c2, parents 3356f0040ff0c7c1eebbddcacb8116ea777228a4 and dfdd492457136e9f976a11babfb59fcc7dceb6a5. Its tree matched the reviewed branch; merged-state source/application and extracted-web checks passed before the integration commit was individually pushed/read back. Direct release commit 645415b2c39c90a833f0ba9bbf0a0f62520c43d2 has the exact retained notes body and no further tree change; its main first-parent placement and separately pushed lightweight v0.4.0 were verified. No tag was moved.

The exact release source rebuilt all four packages. Every archive byte/hash matched its previously tested candidate, retaining the final artifact evidence above. CRC, version, controls and identical compiled assets were rechecked. Native Windows/installed-sidebar coverage remains explicitly unverified.

[GitHub v0.4.0](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/tag/v0.4.0), release 425093280, is published stable and read back as latest. One publisher uploaded the complete explicit inventory before publication. Body SHA-256 8cae63393587012442bfeb05500b2a45ba8dc8aa123c77b11236529aaa010ed8 matches retained notes and the raw release commit. Server digests and protected API downloads matched every asset byte; refreshed metadata supplies canonical tag-specific URLs.

| Asset | Bytes | SHA-256 |
| --- | --- | --- |
| [INSTALL-CHROMIUM.md](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/INSTALL-CHROMIUM.md) | 1555 | 932fa085feb384234498c17ed8f9a647f4c14bf2bd9692352cc5c1e5512dc5ac |
| [INSTALL-FIREFOX.md](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/INSTALL-FIREFOX.md) | 1634 | 562c4d6adc3facbab8cce96d6c86616bfbec84984c597affb8d430f9b6ff4c81 |
| [INSTALL-WEB.md](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/INSTALL-WEB.md) | 1524 | 4de3a04b00bbf216d0c47855423b57f160f4c30c7f8791efc9bed8a607c36064 |
| [INSTALL-WINDOWS.md](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/INSTALL-WINDOWS.md) | 1822 | 08174d22e3ff420a3f783f4cdddc5a9915877da08f3340cc4f7b9283fc38bf09 |
| [SHA256SUMS](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/SHA256SUMS) | 678 | 2d91384814afe9624a3bcf560289ae1f12da29f190c32b3ff76e6c6b3068fde1 |
| [tetris-chromium.zip](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/tetris-chromium.zip) | 19472 | 331cdc349af2677782e6530f175bc155a8146199948400a8f58ac2dd7b897ebc |
| [tetris-firefox.zip](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/tetris-firefox.zip) | 19383 | 8094a1f17139b6401e6dc7670c9bb85c790aefb767f7445b6a6771294e9fe216 |
| [tetris-web.zip](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/tetris-web.zip) | 18630 | a9f0da8a9d415273331d27497c66bc76ef5237349d9d9fc841949905b5772565 |
| [tetris-windows-x64.zip](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/download/v0.4.0/tetris-windows-x64.zip) | 151393794 | 579e3c0eb46854113308ace405a99f8183cb3b9f809350974423a0f1dcf16ec0 |

All phase task issues and milestones are closed/read back. Every actual closing commit, including the phase-review task, was inspected for one owning checkbox/result/evidence boundary. The consumed internal highlights checkpoint is removed only after published-body readback; complete RELEASE-NOTES.md remains retained. The next phase is eligible under the full implementation authorization.
