# Main documentation preparation record

## Current control

- Mode: autodoc/onepass, selected by the original project request.
- Scope: complete Tetris target across browser, Windows Electron, Chromium sidebar and Firefox sidebar, including all requested gameplay, configuration, leaderboard and manual file capabilities.
- Approval basis: PROJECT was approved by the user’s “k” response to the published proposal 65fad484fd8a73d090006f45ec70bebe37ba1028; ARCHITECTURE through TASKS are preapproved by autodoc. The later “OK, and check env” accepts the six presented gameplay/platform proposals and requests environment recovery; it does not approve an unseen PROJECT artifact.
- Tracking: enabled for preparation and implementation by root AGENTS.md policy. Milestone 1, sdd-docs-main, and DOCS-001–009 issues 1–9 were created/reused and read back with exact template content and associations before repository writes.
- Publication: push and exact remote readback after every owned commit. Standard reporting follows the Explicit bootstrap.
- Next boundary: prepare through DOCS-008 under autodoc preapproval, then stop before DOCS-009, documentation integration or implementation.

## Scope and decisions

The original user prompt defines the complete product scope. Deliver the simplest playable baseline first, followed by bounded useful increments. Each verified and integrated implementation phase needs an increased version and release assets for every platform delivered in that phase. No platform delivery claim is allowed without packaged-artifact verification.

The user accepted the following proposals with “OK, and check env” on 2026-10-26:

- Dynamic ghost visibility requires every projected cell to be in the lower board half; straddling projections remain hidden.
- Grounded movement and rotation do not restart lock delay. Leaving support cancels it; landing starts a new interval.
- Hold is disabled for an activated penetrator, whose final lock must be fully valid and non-overlapping.
- Invalid URL/cookie values fall through to the next valid source. Invalid restore settings reject the complete file without changing state.
- Hidden/closed sidebars pause play. A retained document reopens paused; destroyed panel documents lose session-only state.
- Persistent extension settings use extension-local storage in place of cookies and URL parameters; scores remain session-only until manual restoration.

Exact remaining contracts belong to the later specification. Initial package routes and signing/store status must be explicit; no signing or store delivery is assumed.

## Decisions and document evidence

| Task | Current evidence / decision basis |
| --- | --- |
| DOCS-001 | Four existing root files preserved byte-for-byte against f14f78a6cc9fc3420425d5be19c9db3cdd2e6911; no root copies needed. Task/control/handoff records initialized here. Enabled provenance setup verified below. |
| DOCS-002 | User accepted published PROJECT proposal with “k”; exact blob retained. See completion evidence below. |
| DOCS-003–008 | Not authored; later-document preapproval comes from autodoc selection, subject to governing inputs and QC. |
| DOCS-009 | Not selected; remains pending after the autodoc stop. |

## Initialization

- All four root destinations originally existed: AGENTS.md, AI_DISCLOSURE.md, SDD-MANAGER.md and SKILL_DISCOVERY_PROTOCOL.md. All are retained unchanged. Full initial presence requires no mixed-state continuation pause.
- Running and repository-pinned SDD Manager: 0.15.4. Root plugin and relevant workflow entries inspected; standalone technical-writing-assistant also present.
- Default manual provenance setup enabled: scaffold seed 9fcb53f06f711ce1812c7336a6e0e45bb2695698 from main base f14f78a6cc9fc3420425d5be19c9db3cdd2e6911, explicitly integrated as 9a23aaca4d260eac949ed27d322a839c5643cf6d. Both branch publications were verified through supervised exact remote readback with confirmed process cleanup. Two scaffold files match packaged bytes. No transcript was created.
- Current reset: none; onepass preparation.
- Host: Linux; Git 2.51.1, Node.js 24.22.1 and Python 3.12.14 available. No gh, Chromium, Firefox or Wine executable found on PATH. This establishes documentation readiness only, not browser or Windows package readiness.
- API recovery: GitHub connector reads repository metadata but issue creation returned 403 Resource not accessible by integration. Protected supplied-token REST requests created and verified documentation tracking. A partial first attempt was stopped; exact object lookup reused issues 1–3 and completed 4–9 without duplicate identities.

## Pending transitions

DOCS-003 commit publication and issue 3 closure require readback after this checkpoint. Earlier completed document boundaries have been published and their issue closures verified. Continue only after this transition; after DOCS-008 stop before whole-package QC, integration and implementation.

## PROJECT proposal review

The brief covers the complete requested target, accepted gameplay/lifecycle clarifications, six settings, ordered persistence increments, session leaderboard, transactional JSON/SQLite restore, panel layout and verified-package release obligations. Detailed contracts, stack, compatibility floors and package routes remain with their later owners. Development distribution is proposed without assuming signing or store publication. Browser API feasibility was checked against [Chromium sidePanel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel), [Firefox sidebar_action](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/sidebar_action), and [Firefox sidebar lifecycle](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars). This is documentation/source research, not runtime or artifact verification.

## DOCS-002 completion evidence

Human approval of the published PROJECT proposal. Reviewed state: docs/dev/PROJECT.md blob 3d6a68f612226a1d42f86e92df1d05697990d606. The owning checkbox closes in this commit. Required publication and hosted closure follow this checkpoint and must be verified before dependent work.

## DOCS-003 completion evidence

Scoped preapproval from autodoc/onepass; owner conformance review passed for this document and any required report. Reviewed state: docs/dev/ARCHITECTURE.md blob c311e609d49e0254ae4827dd00abece643704d43. The owning checkbox closes in this commit. Required publication and hosted closure follow this checkpoint and must be verified before dependent work.
