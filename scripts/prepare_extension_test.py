"""Validate/extract a sidebar development ZIP for headless shared-asset acceptance."""
from pathlib import Path
import argparse,hashlib,json,shutil,zipfile
from package_web import safe_name
parser=argparse.ArgumentParser();parser.add_argument('target',choices=['chromium','firefox']);args=parser.parse_args()
root=Path(__file__).resolve().parents[1];metadata=json.loads((root/f'release/artifacts-{args.target}.json').read_text());archive_path=root/'release'/metadata['file']
with archive_path.open('rb') as file:
    if hashlib.file_digest(file,'sha256').hexdigest()!=metadata['sha256']:raise ValueError('Extension hash mismatch')
with zipfile.ZipFile(archive_path) as archive:
    names=archive.namelist()
    if len(names)!=len(set(names)) or archive.testzip() is not None:raise ValueError('Invalid extension ZIP')
    for info in archive.infolist():
        safe_name(info.filename)
        if (info.external_attr>>16)&0o170000!=0o100000:raise ValueError('Unexpected extension entry mode')
    manifest=json.loads(archive.read('manifest.json'))
    if manifest['version']!=metadata['version'] or archive.read('VERSION.txt').decode().strip()!=metadata['version']:raise ValueError('Extension version mismatch')
    panel=manifest.get('side_panel',{}).get('default_path') if args.target=='chromium' else manifest.get('sidebar_action',{}).get('default_panel')
    backgrounds=[manifest['background']['service_worker']] if args.target=='chromium' else manifest['background']['scripts']
    if panel not in names or not backgrounds or any(name not in names for name in backgrounds):raise ValueError('Extension entry missing')
    if manifest.get('host_permissions') or manifest.get('content_scripts'):raise ValueError('Unexpected website access')
    for required in ('INSTALL.md','CONTROLS.md','VITE-LICENSE.txt','LICENSE'):
        if required not in names:raise ValueError('Required notice/instructions missing')
    target=root/'.package-test'/args.target;shutil.rmtree(target,ignore_errors=True);target.mkdir(parents=True);archive.extractall(target)
print(json.dumps({'target':args.target,'candidate':archive_path.name,'sha256':metadata['sha256'],'native_sidebar_verified':False}))
