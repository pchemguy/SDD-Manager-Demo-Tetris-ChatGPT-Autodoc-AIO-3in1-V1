"""Create a deterministic browser distribution, exporting only compiled local assets."""
from pathlib import Path, PurePosixPath
import hashlib
import json
import os
import re
import sys
import tempfile
import zipfile

ALLOWED = {'.html', '.js', '.css', '.png', '.svg', '.ico', '.woff', '.woff2', '.json', '.wasm', '.txt', '.md'}

def safe_name(name: str) -> None:
    path = PurePosixPath(name)
    if path.is_absolute() or '..' in path.parts or '\\' in name or ':' in name or any(p.startswith('.') for p in path.parts):
        raise ValueError('Unsafe archive entry: ' + name)
    if path.suffix not in ALLOWED and name != 'LICENSE':
        raise ValueError('Unsupported/private distribution file: ' + name)

def pack_web(build: Path, extras: dict[str, bytes], output: Path, version: str) -> str:
    """Validate inputs, write stable ZIP bytes, and return the completed archive SHA-256."""
    if not re.fullmatch(r'\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?', version):
        raise ValueError('Invalid package version')
    if not (build / 'index.html').is_file():
        raise ValueError('Compiled index.html is required; run the build first')
    entries: dict[str, bytes] = {}
    root = build.resolve()
    for item in sorted(build.rglob('*')):
        if item.is_symlink() or not item.resolve().is_relative_to(root):
            raise ValueError('Distribution links are prohibited')
        if item.is_dir():
            continue
        if not item.is_file():
            raise ValueError('Non-regular distribution file')
        name = item.relative_to(build).as_posix()
        safe_name(name)
        entries[name] = item.read_bytes()
    for name, content in {**extras, 'VERSION.txt': (version + '\n').encode()}.items():
        safe_name(name)
        if name in entries:
            raise ValueError('Duplicate archive entry: ' + name)
        entries[name] = content
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=output.parent, prefix=output.name+'.', suffix='.tmp', delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with zipfile.ZipFile(temporary_path, 'w') as archive:
            for name in sorted(entries):
                info = zipfile.ZipInfo(name, date_time=(1980,1,1,0,0,0))
                info.create_system = 3
                info.external_attr = 0o100644 << 16
                archive.writestr(info, entries[name], compress_type=zipfile.ZIP_DEFLATED, compresslevel=6)
        with zipfile.ZipFile(temporary_path) as archive:
            if archive.testzip() is not None:
                raise ValueError('Archive integrity check failed')
        os.replace(temporary_path, output)
    finally:
        temporary_path.unlink(missing_ok=True)
    return hashlib.sha256(output.read_bytes()).hexdigest()

def main() -> None:
    """Package the current project's compiled web build with deployment/legal instructions."""
    if sys.version_info < (3,11):
        raise RuntimeError('Packaging requires Python 3.11 or newer')
    root = Path(__file__).resolve().parents[1]
    version = json.loads((root / 'package.json').read_text())['version']
    vite_license = next((root / 'node_modules/vite' / name for name in ('LICENSE', 'LICENSE.md', 'LICENSE.txt') if (root / 'node_modules/vite' / name).is_file()), None)
    if vite_license is None:
        raise ValueError('The pinned Vite license file is missing')
    extras = {
        'INSTALL.md': (root / 'docs/user/INSTALL-WEB.md').read_bytes(),
        'CONTROLS.md': (root / 'docs/user/CONTROLS.md').read_bytes(),
        'THIRD-PARTY-NOTICES.txt': (root / 'docs/user/THIRD-PARTY-NOTICES.txt').read_bytes(),
        'VITE-LICENSE.txt': vite_license.read_bytes(),
        'LICENSE': (root / 'LICENSE').read_bytes(),
    }
    artifact = root / f'release/tetris-web-{version}.zip'
    digest = pack_web(root / 'dist/web', extras, artifact, version)
    (root / 'release/SHA256SUMS').write_text(f'{digest}  {artifact.name}\n', encoding='utf-8')
    (root / 'release/artifacts.json').write_text(json.dumps({'version':version,'assets':[{'platform':'browser','file':artifact.name,'sha256':digest}]},indent=2)+'\n',encoding='utf-8')
    print(json.dumps({'artifact':artifact.name,'sha256':digest,'version':version}))

if __name__ == '__main__':
    main()
