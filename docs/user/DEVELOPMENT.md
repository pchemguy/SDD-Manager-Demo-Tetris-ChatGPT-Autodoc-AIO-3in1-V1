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

Node's built-in runner executes the TypeScript core tests directly. Compiler checking is a separate command. The complete browser app and production build entry are introduced by later tasks; dev/build scripts are reserved but are not yet claimed as working application commands.

## Isolated browser provisioning

Playwright 1.62.1 is pinned. Browser assets are provisioned for the owning browser task using one absolute project/job-specific PLAYWRIGHT_BROWSERS_PATH for both installation and execution. Do not use personal/system browser installations or profiles. Chromium and Playwright-managed Firefox are required. Initial provisioning syntax follows below; browser download/launch has not yet been verified by the geometry task.

```text
node node_modules/playwright/cli.js install --only-shell chromium firefox
```

Linux sets PLAYWRIGHT_BROWSERS_PATH in the process environment. Windows CMD uses set PLAYWRIGHT_BROWSERS_PATH=<absolute-owned-directory>; do not invoke PowerShell/pwsh. Native sidebar tasks require full contained browsers and actual sidebar events; shell content tests do not substitute. Follow the bundled browser policy and Playwright diagnostics for download signatures, matching revisions, sandbox/session faults and supported official-image recovery. Native Windows package evidence remains required before desktop delivery.
