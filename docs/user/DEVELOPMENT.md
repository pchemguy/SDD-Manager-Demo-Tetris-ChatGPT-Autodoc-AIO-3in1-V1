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

Node's built-in runner executes the TypeScript core tests directly. Compiler checking is a separate command. The classic game loop is available with npm run dev; npm run build compiles the static browser bundle. Phase packaging and release verification remain later tasks. These source commands are not evidence of an extracted release artifact.

## Isolated browser provisioning

Playwright 1.62.1 is pinned. Browser assets are provisioned for the owning browser task using one absolute project/job-specific PLAYWRIGHT_BROWSERS_PATH for both installation and execution. Do not use personal/system browser installations or profiles. Chromium and Playwright-managed Firefox are required. Initial provisioning syntax follows below; browser download/launch has not yet been verified by the geometry task.

```text
node node_modules/playwright/cli.js install --only-shell chromium firefox
```

Linux sets PLAYWRIGHT_BROWSERS_PATH in the process environment. Windows CMD uses set PLAYWRIGHT_BROWSERS_PATH=<absolute-owned-directory>; do not invoke PowerShell/pwsh. Native sidebar tasks require full contained browsers and actual sidebar events; shell content tests do not substitute. Follow the bundled browser policy and Playwright diagnostics for download signatures, matching revisions, sandbox/session faults and supported official-image recovery. Native Windows package evidence remains required before desktop delivery.

## Browser checks on the diagnosed Linux host

```text
TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 npm run test:ui
```

The prefix above is Linux process-environment syntax. Windows CMD uses set TETRIS_FIREFOX_SANDBOX_OVERRIDE=1 only if the same Firefox content-sandbox failure is actually diagnosed and policy permits trusted local testing; do not apply that override routinely. It reduces Firefox content-process isolation. The normal test command is npm run test:ui without that flag on compatible hosts. scripts/browser.mjs always supplies the same absolute project browser root.

The recorded host needed official-image Chromium recovery and the PRSS Firefox download fallback. See docs/dev/reports/phases/1/1.1.md for exact versions, official source digests, checks, failures and evidence limits. Browser binaries remain ignored and must be reprovisioned in a fresh environment under the bundled browser policy.

## Native-window evidence boundary

Chromium shell and managed Firefox pass real game input/Canvas checks. DOM board focus loss is tested through actual browser focus. Window blur and document visibility handlers have explicitly modeled tests. A separate full Chromium native-window probe failed the execution host’s process-singleton socket restriction (Operation not permitted); no socket restriction or host sandbox was relaxed. Actual desktop/sidebar window events require a compatible native environment in their owning phases.
