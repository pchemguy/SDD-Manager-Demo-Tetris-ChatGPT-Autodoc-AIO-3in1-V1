"""Validate and extract only the current browser release into an owned test directory."""
from pathlib import Path
import hashlib
import json
import shutil
import zipfile
from package_web import safe_name

root = Path(__file__).resolve().parents[1]
version = json.loads((root / 'package.json').read_text())['version']
archive_path = root / f'release/tetris-web-{version}.zip'
manifest = json.loads((root / 'release/artifacts.json').read_text())
assert manifest['version'] == version
asset = next(item for item in manifest['assets'] if item['platform'] == 'browser')
assert asset['file'] == archive_path.name
assert hashlib.sha256(archive_path.read_bytes()).hexdigest() == asset['sha256']
destination = root / '.package-test/web'
with zipfile.ZipFile(archive_path) as archive:
    assert archive.testzip() is None
    for info in archive.infolist():
        safe_name(info.filename)
        assert info.external_attr >> 16 & 0o170000 == 0o100000
    assert len(archive.namelist()) == len(set(archive.namelist()))
    shutil.rmtree(destination, ignore_errors=True)
    destination.mkdir(parents=True)
    archive.extractall(destination)
assert (destination / 'VERSION.txt').read_text().strip() == version
print(json.dumps({'artifact': archive_path.name, 'sha256': asset['sha256'], 'extracted': str(destination)}))
