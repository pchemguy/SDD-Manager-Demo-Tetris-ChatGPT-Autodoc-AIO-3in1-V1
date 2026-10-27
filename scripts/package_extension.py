"""Build a development sidebar extension around the same compiled local game assets."""
from pathlib import Path
import argparse,json
from package_web import pack_web


def package_extension(web,manifest,host,output,version,extras):
    """Validate the host boundary and use the shared deterministic archive writer."""
    manifest={**manifest,'version':version}
    if manifest.get('host_permissions') or manifest.get('content_scripts') or manifest.get('externally_connectable'):raise ValueError('Website/remote access is not required')
    if 'side_panel' in manifest:
        if manifest.get('manifest_version')!=3 or manifest['side_panel'].get('default_path')!='index.html':raise ValueError('Invalid local Chromium panel')
        if manifest.get('permissions')!=['sidePanel'] or manifest.get('background',{}).get('service_worker') not in host:raise ValueError('Invalid Chromium permission/worker boundary')
    elif 'sidebar_action' in manifest:
        if manifest.get('manifest_version')!=2 or manifest['sidebar_action'].get('default_panel')!='index.html':raise ValueError('Invalid local Firefox sidebar')
        if manifest.get('permissions')!=[] or manifest.get('background',{}).get('scripts')!=['background.js'] or 'background.js' not in host:raise ValueError('Invalid Firefox permission/background boundary')
    else:raise ValueError('Sidebar manifest entry missing')
    files={**extras,**host,'manifest.json':(json.dumps(manifest,indent=2)+'\n').encode()}
    if len(files)!=len(extras)+len(host)+1:raise ValueError('Duplicate extension assets')
    return pack_web(web,files,output,version)


def main():
    parser=argparse.ArgumentParser();parser.add_argument('target',choices=['chromium','firefox']);args=parser.parse_args()
    root=Path(__file__).resolve().parents[1];version=json.loads((root/'package.json').read_text())['version'];target=root/'extensions'/args.target
    manifest=json.loads((target/'manifest.json').read_text());host={'background.js':(target/'background.js').read_bytes()}
    license=next((root/'node_modules/vite'/name for name in ('LICENSE','LICENSE.md','LICENSE.txt') if (root/'node_modules/vite'/name).is_file()),None)
    if license is None:raise ValueError('Pinned Vite license missing')
    extras={'INSTALL.md':(root/f'docs/user/INSTALL-{args.target.upper()}.md').read_bytes(),'CONTROLS.md':(root/'docs/user/CONTROLS.md').read_bytes(),'LICENSE':(root/'LICENSE').read_bytes(),'VITE-LICENSE.txt':license.read_bytes(),'THIRD-PARTY-NOTICES.txt':(root/'docs/user/THIRD-PARTY-NOTICES.txt').read_bytes()}
    output=root/f'release/tetris-{args.target}-{version}.zip';digest=package_extension(root/'dist/web',manifest,host,output,version,extras)
    result={'version':version,'platform':args.target,'file':output.name,'sha256':digest,'native_sidebar_verified':False,'distribution':'unpacked development extension' if args.target=='chromium' else 'temporary development extension'}
    (output.parent/f'artifacts-{args.target}.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result),flush=True)

if __name__=='__main__':main()
