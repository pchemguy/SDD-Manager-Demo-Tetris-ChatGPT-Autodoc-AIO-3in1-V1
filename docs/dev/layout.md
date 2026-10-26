# Repository layout

## Scope and ownership

This is the intended physical allocation of [ARCHITECTURE](ARCHITECTURE.md), [DECOMPOSITION](DECOMPOSITION.md) and [PLAN](PLAN.md). At preparation time only repository guidance, bundled skills and development documents exist; the implementation locations below are planned paths. A path allocation is not a claim that its component or command exists.

| Location | Owner and purpose | Checks / consumers |
| --- | --- | --- |
| src/core/ | Geometry, SRS tables, landing, randomizers and game reducer; pure TypeScript | tests/core/; application only |
| src/app/ | Session controller, scheduler/input policy, settings and session leaderboard | tests/app/; UI and host composition |
| src/ui/ | Canvas board, semantic panels, help, errors and responsive styling | tests/ui/ and tests/e2e/; one shared app shell |
| src/platform/contracts.ts | Narrow settings/location/file/lifecycle ports | Adapter and application contract checks |
| src/platform/memory/ | Session-only implementations | tests/platform/; default before persistent capabilities |
| src/platform/web/ | Browser cookies/history, selection/download and lifecycle | tests/platform/ and isolated browser e2e |
| src/platform/electron/ | Renderer-side typed bridge adapter and lifecycle mapping | tests/platform/ and tests/desktop/ |
| src/platform/chromium/ | sidePanel opener/event bridge and extension-local adapter | tests/extensions/chromium/ |
| src/platform/firefox/ | sidebarAction opener and Firefox-local adapter | tests/extensions/firefox/ |
| src/entry/ | Host composition entry points, one shared UI | Build target selects its ports; no runtime game-rule forks |
| src/transfer/ | Canonical snapshot validation, JSON codec, transfer coordinator, SQLite worker protocol and worker entry | tests/transfer/ and fixtures; shared host consumers |
| electron/ | Main process, sandboxed preload, allowlisted protocol and later native dialogs | Native packaged Windows tests; no reducer duplication |
| extensions/chromium/ | Chromium manifest and target-specific static metadata/icons | Package lint plus real panel installation/runtime checks |
| extensions/firefox/ | Firefox manifest and target-specific static metadata/icons | Package lint plus real sidebar installation/runtime checks |
| scripts/ | Build/package/checksum/artifact-verification and release-support utilities | Script contracts, CI jobs and extracted artifact checks |
| tests/fixtures/ | Seeded boards, random streams, timing cases, malformed/valid JSON and real SQLite databases | Tests across core, app, transfer and native hosts |
| tests/e2e/ | Shared browser game, settings, visual and file acceptance | Pinned isolated Chromium/Firefox |
| tests/desktop/ | Extracted Electron package and native lifecycle/file acceptance | Dedicated Windows runners |
| tests/extensions/ | Shared extension harness plus browser-specific native panel cases | Isolated full browser profiles; no personal sessions |
| .github/workflows/ | Pinned CI jobs for source, builds and required native artifact evidence | Release workflow with explicit permissions and retained results |
| docs/user/ | Controls, platform installation, development distribution, settings and Save/Restore instructions | Package/release instructions and validated usage examples |
| docs/dev/ | Canonical product design/spec/plan/layout/tasks and adjacent review reports | Preparation and implementation traceability |
| docs/dev/spec/SAVE-FORMAT.schema.json | Sole maintained JSON Schema source | Validator/build consumes directly; emits package asset when FILE is delivered |
| docs/dev/reports/phases/<phase-id>/ | Milestone reports <milestone-id>.md and PHASE-REPORT.md | Owning boundary tasks and hosted completion |
| docs/dev/reports/IMPLEMENTATION-REPORT.md | Final implementation/TODO aggregation | Final phase review |
| docs/ai-logs/ | Existing manual provenance scaffold and explicitly supplied historical records | Outside normal source/preparation validation |
| package.json and dependency lockfile | Pinned toolchain, declared validated commands and version | Root package/build/test entry points |
| vite.config.ts and TypeScript/test configuration | Shared build and isolated test configuration | Host-target builds with local asset paths |
| RELEASE-NOTES.md | Complete current release message | Default-branch release commit/tag and GitHub release body |

## Generated paths

Use dist/web/, dist/electron/, dist/chromium/ and dist/firefox/ for generated host bundles; release/ for versioned archives, checksums and accompanying notices; test-results/ and playwright-report/ for execution evidence. Project-owned browser binaries/profiles use an absolute dedicated path, consistently configured across provisioning and execution. Ignore generated bundles, caches, runtime profiles, temporary databases and credentials; retain only selected compact evidence in the owning reports.

Package the same shared logic/UI into each host's bundle. Build scripts copy only the selected manifest/entry and required target assets. The SQLite worker, sql.js WASM and canonical JSON Schema are bundled locally once that capability is delivered; generated schema copies are not separately edited sources. Resolve assets relative to the target bundle, not the developer checkout or a CDN. Record included dependency licenses/notices.

## Dependency and edit boundaries

Core modules import no DOM, Node, application or platform code. Application code depends on core and port contracts. UI consumes application snapshots/actions. Host entry points bind adapters; Electron Node modules are restricted to main/preload and never enter web/extension bundles. Transfer codecs share one canonical validator and never mutate game/session state. Extension background entry points forward only lifecycle/open events and introduced storage operations, with no persisted score/game replica.

Task edit scopes normally stay within one owned component and its focused tests; composition, adapters, packaging and acceptance tests can cross the few collaborating areas needed for a meaningful integration. Runtime assets and formats have one canonical maintained source. Do not create a per-platform game engine or a handwritten schema mirror.

Existing .agents/ plugin/skill sources, root guidance and disclosures retain their current ownership. Project development does not authorize editing the bundled SDD Manager or unrelated skills. Add project navigation and validated commands to root AGENTS when established; do not publish hypothetical npm commands as working setup. Do not modify /pyenv. Windows jobs follow CMD-based repository policy, independently of this Linux authoring host.

