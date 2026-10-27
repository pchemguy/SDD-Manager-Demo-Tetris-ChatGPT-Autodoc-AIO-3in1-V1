"""Inspect/extract the actual Windows candidate for shared-asset acceptance, without executing PE files."""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile
from package_desktop import safe_name

root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'release/artifacts-windows.json').read_text())
archive_path=root/'release'/manifest['file']
with archive_path.open('rb') as file:
    if hashlib.file_digest(file,'sha256').hexdigest()!=manifest['sha256']:raise ValueError('Candidate digest mismatch')
destination=root/'.package-test/windows'
with zipfile.ZipFile(archive_path) as archive:
    names=archive.namelist()
    if len(names)!=len(set(names)) or archive.testzip() is not None:raise ValueError('Invalid candidate ZIP')
    for info in archive.infolist():
        safe_name(info.filename)
        if (info.external_attr>>16)&0o170000!=0o100000:raise ValueError('Unexpected candidate entry mode')
    app=json.loads(archive.read('resources/app/package.json'))
    if app['version']!=manifest['version'] or app['main']!='electron/main.mjs':raise ValueError('App entry/version mismatch')
    for name in ('Tetris.exe','resources/app/electron/main.mjs','resources/app/electron/host.mjs','resources/app/electron/lifecycle.mjs','resources/app/electron/preload.cjs','resources/app/web/index.html','LICENSE-ELECTRON.txt','VITE-LICENSE.txt','LICENSES.chromium.html','INSTALL-WINDOWS.md'):
        if name not in names:raise ValueError('Required package asset missing: '+name)
    shutil.rmtree(destination,ignore_errors=True);destination.mkdir(parents=True);archive.extractall(destination)
print(json.dumps({'candidate':archive_path.name,'sha256':manifest['sha256'],'native_windows_verified':False,'extracted':str(destination)}))
