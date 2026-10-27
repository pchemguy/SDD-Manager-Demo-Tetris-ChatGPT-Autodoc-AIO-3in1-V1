"""Desktop packaging rejects tampered/unsafe runtimes and exports a self-contained application."""
import hashlib
import importlib.util
import json
from pathlib import Path
import struct
import tempfile
import unittest
import zipfile

spec=importlib.util.spec_from_file_location('desktop_packager',Path(__file__).resolve().parents[2]/'scripts/package_desktop.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class DesktopPackageTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);self.runtime=self.root/'runtime.zip';self.web=self.root/'web';self.web.mkdir();(self.web/'index.html').write_text('<main>Game</main>');self.host=self.root/'electron';self.host.mkdir();(self.host/'main.mjs').write_text('// main');(self.host/'preload.cjs').write_text('// preload')
    def tearDown(self):self.temp.cleanup()
    def runtime_zip(self,extra=None):
        pe=bytearray(256);pe[:2]=b'MZ';struct.pack_into('<I',pe,60,128);pe[128:132]=b'PE\0\0';struct.pack_into('<H',pe,132,0x8664)
        with zipfile.ZipFile(self.runtime,'w') as z:
            for name,data in {'electron.exe':pe,'resources.pak':b'pack','icudtl.dat':b'icu','LICENSE':b'electron license','resources/default_app.asar':b'default',**(extra or {})}.items():z.writestr(name,data)
        return hashlib.sha256(self.runtime.read_bytes()).hexdigest()
    def test_self_contained_versioned_runtime_and_app(self):
        digest=self.runtime_zip();output=self.root/'desktop.zip';module.pack_desktop(self.runtime,digest,self.web,self.host,output,'0.2.0',{'INSTALL-WINDOWS.md':b'Unsigned; native Windows execution unverified'})
        with zipfile.ZipFile(output) as z:
            names=set(z.namelist());self.assertIn('Tetris.exe',names);self.assertNotIn('electron.exe',names);self.assertNotIn('resources/default_app.asar',names);self.assertIn('resources/app/web/index.html',names);self.assertIn('resources/app/electron/preload.cjs',names);p=json.loads(z.read('resources/app/package.json'));self.assertEqual(p['version'],'0.2.0');self.assertEqual(p['main'],'electron/main.mjs');self.assertEqual(z.read('LICENSE-ELECTRON.txt'),b'electron license');self.assertIsNone(z.testzip())
        first=output.read_bytes();module.pack_desktop(self.runtime,digest,self.web,self.host,output,'0.2.0',{'INSTALL-WINDOWS.md':b'Unsigned; native Windows execution unverified'});self.assertEqual(first,output.read_bytes())
    def test_tampered_runtime_rejected(self):
        self.runtime_zip()
        with self.assertRaisesRegex(ValueError,'digest'):module.pack_desktop(self.runtime,'0'*64,self.web,self.host,self.root/'out.zip','0.2.0',{})
    def test_traversal_runtime_rejected(self):
        digest=self.runtime_zip({'../escape.exe':b'bad'})
        with self.assertRaises(ValueError):module.pack_desktop(self.runtime,digest,self.web,self.host,self.root/'out.zip','0.2.0',{})
    def test_private_application_file_rejected(self):
        digest=self.runtime_zip();(self.web/'gh.tkn').write_text('synthetic')
        with self.assertRaises(ValueError):module.pack_desktop(self.runtime,digest,self.web,self.host,self.root/'out.zip','0.2.0',{})
    def test_wrong_architecture_rejected(self):
        self.runtime_zip()
        with zipfile.ZipFile(self.runtime,'w') as z:z.writestr('electron.exe',b'MZ'+b'\0'*200)
        digest=hashlib.sha256(self.runtime.read_bytes()).hexdigest()
        with self.assertRaisesRegex(ValueError,'PE|x64'):module.pack_desktop(self.runtime,digest,self.web,self.host,self.root/'out.zip','0.2.0',{})
