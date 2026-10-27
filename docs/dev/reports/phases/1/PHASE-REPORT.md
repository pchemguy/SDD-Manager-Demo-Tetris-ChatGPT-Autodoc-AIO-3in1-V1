# Phase 1 — Classic browser game

## Outcome and source

T-001–T-010 establish the classic browser delivery and release readiness for 0.1.0. Reviewed phase base: ed9cf4355df7b7891d16c035e79b72814ff01c08. Independent review source: a8ccf6a63b7b41c96a3aa5931d5732e2904730c2, followed by the bounded T-010 fixes in this closing commit. At this review checkpoint, phase integration, release commit/tag and GitHub assets remained pending; their completed outcomes are recorded below.

## Independent code review and repairs

A separate read-only reviewer assessed geometry/reducer, timing/input/session, rendering/layout, archive generation, extracted-host boundary, tests and shipped documentation against GAME/basic HOST/browser RELEASE and the Phase 1 exits. No Critical or Important implementation finding. Two Minor findings were repaired rather than deferred:

- P1-001: the narrow CSS rule hid the keyboard guide. A new extracted-artifact test failed on the old distribution because the named guide was inaccessible. The guide now occupies the right column at wide widths and the section below the board at narrow widths. Full artifact checks passed after rebuild. The reviewer rechecked the patch and found no regression risk.
- P1-002: DEVELOPMENT described packaging as future work and browser launch as unverified. Those paragraphs now point to current commands and recorded environment evidence; the reviewer confirmed the correction.

The review did not independently rerun suites or judge provider publication/native events. The coordinator supplies those execution and hosted gates. Deferred modern rules/native hosts were intentionally outside the Phase 1 review, consistent with PLAN.

## Verification

- Forty core/application tests passed; typecheck passed; five packaging tests passed; credential-route regression passed.
- TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 npm run test:artifact: 28 cases passed, zero skipped. Actual extracted static assets exercised in both required isolated browsers. Five viewport widths cover centering/overflow/input; new guide regression covers narrow access. Existing Canvas, wall/input, automatic gravity, score, top-out/restart, pause/repeat and explicitly labeled modeled host-event checks pass.
- Browser identity and trusted-local Firefox limitation match [1.3](1.3.md). [Narrow Chromium](artifacts/T010-chromium-280.png) and [wide Firefox](artifacts/T010-firefox-1440.png) screenshots inspected after the fix. The first retains reachable help below the board; the second retains a centered board with help on the right.
- Candidate tetris-web-0.1.0.zip SHA-256: ece5026ee6604058ed02bd779dfe058b1e698144a655797d4b2cd3ff727ef2d4. This replaces the earlier T-009 candidate after the UI fix. Provider asset filename is the stable tetris-web.zip with identical bytes and corresponding SHA256SUMS; INSTALL-WEB.md is a separate attached instruction asset.
- Task persistence audit over the full phase range verified T-001–T-009 each have exactly one initial closing commit combining result, evidence and owning checkbox. The additional T-003 private-route fix is a task-specific repair, not another initial closure. T-010 staging is inspected for the same single-task contract before commit. No history rewrite or combined task closure.
- All three delivery milestones and their task issues are closed/read back. Version authority remains 0.1.0 in package.json/package-lock; complete initial Git history has no release tag. Public repository metadata confirms main as default and no existing release/publishing workflow. Source package is browser only, as explicitly deferred by Phase 1.

## Exit and next workflow

Phase 1 functional, usability and package exits are verified; no unresolved contract blocker. Prepared complete notes are retained in ignored root RELEASE-NOTES.md and refreshed through the final release source before publication. Next: publish this task, close/read back issue 19 and review milestone 5, explicitly integrate into refreshed main, verify/publish merged state, create the exact-body default-branch release commit, rebuild/recheck its assets, publish/read back tag and one GitHub release, then verify uploaded bytes/latest state. Until then, no published release is claimed.

Full T-001–T-072 authorization persists. Phase 2 remains unactivated until the required predecessor release. Native Windows 10/11 x64 execution and real Chromium/Firefox sidebars remain required for its acceptance; headless content tests do not substitute.

## TODO

None within Phase 1. Native hosts and all later gameplay/persistence are planned increments, not deferred defects in the classic browser release.

## Integration and release outcome

The explicit phase merge fe157d5d53be7c79fb3bff65d632005e487de748 has parents ed9cf4355df7b7891d16c035e79b72814ff01c08 and 6384185553db1fd1bb995daae77abc682ba2d38b. Merged-state checks passed 40 core/application tests, typecheck and 28 extracted-package cases. The merge was pushed and exact remote containment verified.

Direct default-branch release commit 416feaaab94b53d809a9d33c129a07a1eb329494 contains no additional tree changes; its raw message body exactly equals the finalized complete notes. Commit and lightweight tag v0.1.0 were independently pushed/read back. The release source lies on published main's first-parent history, package/lock versions both identify 0.1.0, and its final-source rebuild passed all 28 extracted-browser cases with the same candidate ZIP hash.

[GitHub release v0.1.0](https://github.com/pchemguy/SDD-Manager-Demo-Tetris-ChatGPT-Autodoc-AIO-3in1-V1/releases/tag/v0.1.0), ID 425014426, is published stable and read back as latest. One direct publisher created the draft, attached/verified the exact three-asset inventory, then published. No CI publishing workflow was configured or dispatched. Published body SHA-256 is 0e077c0f79d7e9181f2eef5b46679a2c067bd8310cc0a5ffd58e15c86618fe52 and matches the release-commit body and retained RELEASE-NOTES.md.

| Asset | Bytes | SHA-256 |
| --- | --- | --- |
| INSTALL-WEB.md | 1524 | 4de3a04b00bbf216d0c47855423b57f160f4c30c7f8791efc9bed8a607c36064 |
| SHA256SUMS | 162 | 679c4fbb6c2001dd9caba5375d3e2b9dd3551e2c419ec086b823ffecc0330bfc |
| tetris-web.zip | 16291 | ece5026ee6604058ed02bd779dfe058b1e698144a655797d4b2cd3ff727ef2d4 |

Server SHA-256 digests matched the supplied files. The first unauthenticated public download returned HTTP 404; supported authenticated release-asset API downloads then returned all three exact files, and byte-for-byte/hash comparison passed. The public URLs are retained from GitHub metadata; anonymous download availability was not independently established. There was no duplicate release creation, tag movement, asset replacement or forced push. The internal highlights checkpoint was consumed after published-body readback; complete notes remain retained.

Phase 1 is delivered. Phase 2 native verification remains an environment prerequisite, not a Phase 1 defect: this execution host reports Linux and has no cmd.exe, Wine, Docker or Xvfb facility, and the connected tool inventory exposes no native Windows execution service. The accepted dedicated Windows 10/11 x64 checks cannot be substituted by a Linux build, virtual host-event test or Wine. Existing full-Chromium native-window execution also remains blocked by the separately diagnosed socket restriction. Phase 2 is not activated and T-011–T-072 remain unchecked. Full implementation/release authorization persists; resume at Phase 2 readiness/projection after a compatible native Windows facility is available.
