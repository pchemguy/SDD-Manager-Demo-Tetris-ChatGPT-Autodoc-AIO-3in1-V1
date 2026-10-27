"""Build an unsigned portable Windows x64 package from an integrity-verified Electron runtime."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import os
import re
import struct
import tempfile
import time
import urllib.request
import zipfile


def safe_name(name):
    path=PurePosixPath(name)
    if not name or path.is_absolute() or any(p in ('..','.') or p.startswith('.') for p in path.parts) or '\\' in name or ':' in name:
        raise ValueError('Unsafe archive path')


def app_files(root,prefix,extensions):
    result={}
    if root.is_symlink():raise ValueError('Application links prohibited')
    for item in root.rglob('*'):
        if item.is_symlink():raise ValueError('Application links prohibited')
        if item.is_dir():continue
        name=item.relative_to(root).as_posix();safe_name(name)
        if not item.is_file() or item.suffix not in extensions:raise ValueError('Unsupported/private application file')
        result[prefix+name]=item.read_bytes()
    return result


def pack_desktop(runtime,digest,web,host,output,version,extras):
    """Inspect trusted runtime bytes, replace the default app and write deterministic ZIP bytes."""
    with runtime.open('rb') as file:
        if hashlib.file_digest(file,'sha256').hexdigest()!=digest:raise ValueError('Runtime digest mismatch')
    if not re.fullmatch(r'\d+\.\d+\.\d+',version):raise ValueError('Invalid version')
    own=app_files(web,'resources/app/web/',{'.html','.js','.css','.svg','.ico','.png','.json','.wasm'})
    own.update(app_files(host,'resources/app/electron/',{'.mjs','.cjs'}))
    if 'resources/app/web/index.html' not in own or 'resources/app/electron/main.mjs' not in own:raise ValueError('Application entry missing')
    own['resources/app/package.json']=json.dumps({'name':'tetris-3in1','version':version,'type':'module','main':'electron/main.mjs'},indent=2).encode()+b'\n'
    own['VERSION.txt']=(version+'\n').encode()
    for name,data in extras.items():
        safe_name(name)
        if name in own:raise ValueError('Duplicate package entry')
        own[name]=data
    output.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=output.parent,delete=False) as f:temporary=Path(f.name)
    try:
        with zipfile.ZipFile(runtime) as source,zipfile.ZipFile(temporary,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as target:
            infos=source.infolist();names=[i.filename for i in infos]
            if len(names)!=len(set(names)):raise ValueError('Duplicate runtime entries')
            for info in infos:
                safe_name(info.filename)
                if (info.external_attr>>16)&0o170000 not in (0,0o100000,0o040000):raise ValueError('Runtime link/device entry')
            exe=source.read('electron.exe')
            if len(exe)<64 or exe[:2]!=b'MZ':raise ValueError('Invalid PE executable')
            offset=struct.unpack_from('<I',exe,60)[0]
            if offset+6>len(exe) or exe[offset:offset+4]!=b'PE\0\0' or struct.unpack_from('<H',exe,offset+4)[0]!=0x8664:raise ValueError('Runtime must be x64 PE')
            inventory={}
            for info in infos:
                if info.is_dir() or info.filename=='resources/default_app.asar':continue
                name={'electron.exe':'Tetris.exe','LICENSE':'LICENSE-ELECTRON.txt'}.get(info.filename,info.filename)
                if name.startswith('resources/app/') or name in own:raise ValueError('Runtime/application collision')
                inventory[name]=info
            for name in sorted(set(inventory)|set(own)):
                info=zipfile.ZipInfo(name,(1980,1,1,0,0,0));info.create_system=3;info.external_attr=0o100644<<16
                target.writestr(info,own[name] if name in own else source.read(inventory[name]),compress_type=zipfile.ZIP_DEFLATED,compresslevel=6)
        with zipfile.ZipFile(temporary) as archive:
            if archive.testzip() is not None:raise ValueError('Package integrity failure')
        os.replace(temporary,output)
    finally:temporary.unlink(missing_ok=True)
    with output.open('rb') as file:return hashlib.file_digest(file,'sha256').hexdigest()


def obtain_runtime(root,version):
    """Use only the pinned official Electron release and its published SHA-256/size."""
    api=f'https://api.github.com/repos/electron/electron/releases/tags/v{version}'
    with urllib.request.urlopen(urllib.request.Request(api,headers={'Accept':'application/vnd.github+json'}),timeout=25) as response:release=json.load(response)
    name=f'electron-v{version}-win32-x64.zip';matches=[a for a in release['assets'] if a['name']==name]
    if len(matches)!=1 or release['tag_name']!='v'+version:raise ValueError('Official runtime identity mismatch')
    asset=matches[0];digest=asset.get('digest','')
    if not re.fullmatch('sha256:[0-9a-f]{64}',digest):raise ValueError('Official runtime SHA-256 unavailable')
    cache=root/'.runtime-cache';cache.mkdir(exist_ok=True);path=cache/name
    if not path.exists():
        temporary=path.with_suffix('.download');started=time.monotonic();count=0
        try:
            with urllib.request.urlopen(urllib.request.Request(asset['url'],headers={'Accept':'application/octet-stream'}),timeout=25) as response,temporary.open('wb') as out:
                while chunk:=response.read(1024*1024):
                    count+=len(chunk)
                    if count>asset['size'] or time.monotonic()-started>180:raise ValueError('Runtime download bound exceeded')
                    out.write(chunk)
            if count!=asset['size']:raise ValueError('Truncated runtime download')
            with temporary.open('rb') as f:
                if hashlib.file_digest(f,'sha256').hexdigest()!=digest[7:]:raise ValueError('Downloaded runtime digest mismatch')
            os.replace(temporary,path)
        finally:temporary.unlink(missing_ok=True)
    if path.stat().st_size!=asset['size']:raise ValueError('Runtime size mismatch')
    return path,digest[7:]


def main():
    root=Path(__file__).resolve().parents[1];package=json.loads((root/'package.json').read_text());version=package['version'];electron=package['devDependencies']['electron']
    runtime,digest=obtain_runtime(root,electron)
    extras={name:(root/path).read_bytes() for name,path in {'INSTALL-WINDOWS.md':'docs/user/INSTALL-WINDOWS.md','CONTROLS.md':'docs/user/CONTROLS.md','LICENSE':'LICENSE','THIRD-PARTY-NOTICES.txt':'docs/user/THIRD-PARTY-NOTICES.txt'}.items()}
    vite_license=next((root/'node_modules/vite'/name for name in ('LICENSE','LICENSE.md','LICENSE.txt') if (root/'node_modules/vite'/name).is_file()),None)
    if vite_license is None:raise ValueError('Pinned Vite license missing')
    extras['VITE-LICENSE.txt']=vite_license.read_bytes()
    output=root/f'release/tetris-windows-x64-{version}.zip';sha=pack_desktop(runtime,digest,root/'dist/web',root/'electron',output,version,extras)
    result={'version':version,'platform':'windows-x64','file':output.name,'sha256':sha,'electron':electron,'runtime_sha256':digest,'native_windows_verified':False,'distribution':'unsigned development package'}
    (output.parent/'artifacts-windows.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)

if __name__=='__main__':main()
