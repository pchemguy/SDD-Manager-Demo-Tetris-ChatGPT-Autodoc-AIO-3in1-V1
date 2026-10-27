# Browser installation

## Deploy the static build

Extract the versioned browser ZIP. Upload its complete contents to an HTTP(S) static host, keeping index.html beside its assets directory. Open the hosted index URL in Chromium 142+ or Firefox 140 ESR+. The game runs locally in the browser; hosting serves static files and requires no application backend or Node.js. Players need no local development server or Node.js installation.

Serve JavaScript and CSS with their normal MIME types. Keep every compiled asset together; renaming hashed assets breaks references. This distribution contains its runtime resources and makes no CDN request. A developer can preview an extracted build using an existing static file server; opening index.html directly through file: is not the supported deployment route.

## Verify the download

Compare the ZIP's SHA-256 with the accompanying SHA256SUMS before deploying. On Windows CMD, use certutil -hashfile <archive-path> SHA256. On Linux, use sha256sum <archive-path>. Replace the placeholder with the actual file path. VERSION.txt identifies the packaged application version. LICENSE, THIRD-PARTY-NOTICES.txt and VITE-LICENSE.txt accompany the application.

This is a deployable browser build. Windows Electron and unpacked/temporary browser extensions are separate platform packages introduced by their delivery phase. A browser ZIP is not an Electron installer, signed browser extension or store-distributed add-on. Read the release's actual platform list and verification notes.
