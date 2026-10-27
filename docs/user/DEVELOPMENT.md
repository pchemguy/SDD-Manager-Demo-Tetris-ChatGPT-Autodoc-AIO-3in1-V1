# Development

## Requirements

Use Node.js 24.x and npm. Runtime application users will not need Node.js; the browser and native artifacts are built by developers. Dependencies are pinned in package.json and package-lock.json. Run commands from the direct checkout path, not an unexplained symlink/junction. Do not modify /pyenv.

## Validated source commands

These commands were exercised on the Linux execution host for the geometry and command foundation and use syntax also accepted by Windows CMD:

```text
npm ci --no-audit --no-fund
npm test
npm run typecheck
```

Node's built-in runner executes the TypeScript core tests directly. Compiler checking is a separate command. The classic game loop is available with npm run dev; npm run build compiles the static browser bundle. Browser packaging and extracted-artifact checks are described below. These source commands alone do not verify a distribution.

## Isolated browser provisioning

Playwright 1.62.1 is pinned. Browser assets are provisioned for the owning browser task using one absolute project/job-specific PLAYWRIGHT_BROWSERS_PATH for both installation and execution. Do not use personal/system browser installations or profiles. Chromium and Playwright-managed Firefox are required. Provisioning syntax follows below. The diagnosed Linux setup and verified browser versions are recorded in the milestone reports linked below.

```text
node node_modules/playwright/cli.js install --only-shell chromium firefox
```

Linux sets PLAYWRIGHT_BROWSERS_PATH in the process environment. Windows CMD uses set PLAYWRIGHT_BROWSERS_PATH=<absolute-owned-directory>; do not invoke PowerShell/pwsh. Actual native sidebar installation/events require a compatible full browser; headless-shell content tests do not establish that coverage. The user selected supported headless application/adapter/package checks for continued implementation and releases, with unavailable native coverage explicitly unverified. Follow the bundled browser policy and Playwright diagnostics for download signatures, matching revisions, sandbox/session faults and supported official-image recovery. Native Windows execution is explicitly excluded from this implementation’s verification scope; installation instructions and release notes retain that limitation.

## Browser checks on the diagnosed Linux host

```text
TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 npm run test:ui
```

The prefix above is Linux process-environment syntax. Windows CMD uses set TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 only if the same Firefox content-sandbox failure is actually diagnosed and policy permits trusted local testing; do not apply that override routinely. It reduces Firefox content-process isolation. The normal test command is npm run test:ui without that flag on compatible hosts. scripts/browser.mjs always supplies the same absolute project browser root.

The recorded host needed official-image Chromium recovery and the PRSS Firefox download fallback. See docs/dev/reports/phases/1/1.1.md for exact versions, official source digests, checks, failures and evidence limits. Browser binaries remain ignored and must be reprovisioned in a fresh environment under the bundled browser policy.

## Native-window evidence boundary

Chromium shell and managed Firefox pass real game input/Canvas checks. DOM board focus loss is tested through actual browser focus. Window blur and document visibility handlers have explicitly modeled tests. A separate full Chromium native-window probe failed the execution host’s process-singleton socket restriction (Operation not permitted); no socket restriction or host sandbox was relaxed. Actual desktop/sidebar window events require a compatible native environment in their owning phases.

## Browser distribution packaging

Packaging requires Python 3.11+ in addition to the pinned Node development tools. Runtime players do not need either. The validated commands are:

```text
npm run test:server
npm run test:package
npm run package:web
```

The package command compiles the static build and creates release/tetris-web-<version>.zip, SHA256SUMS and artifacts.json. Only the compiled build and explicit installation/control/license documents enter the archive. Credential files, links and unsafe archive paths are rejected. Archive timestamps and ordering are fixed for reproducible bytes. Candidate packages are generated/ignored; release publication and final-source verification are separate phase gates.

## Extracted browser acceptance

Run npm run test:artifact to build the versioned ZIP, verify its checksum and entries, extract it into .package-test/web and execute the Chromium/Firefox suite through a plain Python static server. The test server serves only extracted files, with no Vite transformation or application backend. Python 3.11+ is required for this developer check. Apply the process-local Firefox override described above only on the diagnosed host.

The artifact suite reuses gameplay, Canvas, pause/repeat and restart checks, then exercises 280/360/600/1024/1440-pixel layouts and rejects external runtime requests. Browser virtual clocks control timing; modeled window/document events are labeled separately from actual DOM focus and key delivery.

## Electron host checks

Electron 43.8.3 is pinned. npm run test:desktop exercises fixed-origin asset responses and sandboxed-window/navigation policy through real filesystem fixtures and a controlled Electron API boundary. npm run build compiles the shared UI. These source checks do not establish native Windows execution. The user waived native Windows 10/11 verification for the remaining implementation; Windows packages must retain that explicit limitation. Developer dependency installation can set ELECTRON_SKIP_BINARY_DOWNLOAD=1 when only source/cross-package checks are needed; distributable runtime archives are verified separately by desktop packaging.

Desktop blur, hide and minimize events send only a suspension signal. The isolated preload forwards it to the same DOM blur handlers used by the shared game, clearing held keys and pausing without an automatic resume. Closing destroys the document; relaunch starts a new session. Source checks execute the preload and modeled Electron event boundary; browser checks verify the shared pause remainder and key clearing. Native Windows event delivery is unverified under the explicit exception.

## Portable Windows packaging

npm run package:windows builds the shared web UI, obtains the pinned official Electron Windows x64 archive and checks its declared size/SHA-256, then assembles release/tetris-windows-x64-<version>.zip. The archive includes the runtime, application, instructions and licenses. .runtime-cache is a project-owned ignored cache; a mismatching archive is rejected. Python 3.11+ is required for packaging, not for players.

npm run test:windows-assets validates and extracts the actual Windows candidate and runs Chromium/Firefox against its bundled web directory through a plain static server. This proves shared-asset behavior and packaging contents; it does not execute the Windows binary or establish Electron's native protocol/events. npm run test:desktop covers real asset responses and modeled Electron boundaries. Follow INSTALL-WINDOWS.md for the unsigned development package and explicit native Windows verification limitation.

## Chromium sidebar package checks

npm run package:chromium builds the shared UI and a development extension ZIP with local assets, a minimal manifest, worker and notices. npm run test:chromium-assets validates/extracts that ZIP and tests its compiled UI with the isolated headless browsers through a static server. npm run test:extensions executes actual background code against controlled API event fixtures. These checks retain native extension installation and actual sidebar events as explicitly unverified under the authorized headless-only scope.

## All-target package acceptance

npm run package:all compiles the shared UI once and produces browser, portable Windows x64, Chromium and Firefox archives from that build. npm run test:firefox-assets and npm run test:chromium-assets use the validated target wrapper, verify/extract the selected archive and run the pinned headless suite. The wrapper stops on preparation failure and supplies one project-owned browser root. Windows runtime and native extension installation/events remain explicitly unverified; package integrity, contents, shared UI and controlled host adapters are checked.
