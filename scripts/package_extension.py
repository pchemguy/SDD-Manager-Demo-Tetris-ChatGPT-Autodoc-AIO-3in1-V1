"""Build a development sidebar extension around the same compiled local game assets."""
from pathlib import Path
import argparse,json
from package_web import pack_web


def package_extension(web,manifest,host,output,version,extras):
    """Validate the host boundary and use the shared deterministic archive writer."""
    manifest={**manifest,'version':version}
    if manifest.get('host_permissions') or manifest.get('content_scripts') or manifest.get('externally_connectable'):raise ValueError('Website/remote access is not required')
    if manifest.get('manifest_version')!=3 or manifest.get('side_panel',{}).get('default_path')!='index.html':raise ValueError('Invalid local Chromium panel')
    if manifest.get('permissions')!=['sidePanel'] or manifest.get('background',{}).get('service_worker') not in host:raise ValueError('Invalid Chromium permission/worker boundary')
    files={**extras,**host,'manifest.json':(json.dumps(manifest,indent=2)+'\n').encode()}
    if len(files)!=len(extras)+len(host)+1:raise ValueError('Duplicate extension assets')
    return pack_web(web,files,output,version)


def main():
    parser=argparse.ArgumentParser();parser.add_argument('target',choices=['chromium']);args=parser.parse_args()
    root=Path(__file__).resolve().parents[1];version=json.loads((root/'package.json').read_text())['version'];target=root/'extensions'/args.target
    manifest=json.loads((target/'manifest.json').read_text());host={'background.js':(target/'background.js').read_bytes()}
    license=next((root/'node_modules/vite'/name for name in ('LICENSE','LICENSE.md','LICENSE.txt') if (root/'node_modules/vite'/name).is_file()),None)
    if license is None:raise ValueError('Pinned Vite license missing')
    extras={'INSTALL.md':(root/'docs/user/INSTALL-CHROMIUM.md').read_bytes(),'CONTROLS.md':(root/'docs/user/CONTROLS.md').read_bytes(),'LICENSE':(root/'LICENSE').read_bytes(),'VITE-LICENSE.txt':license.read_bytes(),'THIRD-PARTY-NOTICES.txt':(root/'docs/user/THIRD-PARTY-NOTICES.txt').read_bytes()}
    output=root/f'release/tetris-{args.target}-{version}.zip';digest=package_extension(root/'dist/web',manifest,host,output,version,extras)
    result={'version':version,'platform':args.target,'file':output.name,'sha256':digest,'native_sidebar_verified':False,'distribution':'unpacked development extension'}
    (output.parent/f'artifacts-{args.target}.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)

if __name__=='__main__':main()
