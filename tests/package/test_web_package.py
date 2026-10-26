"""Literal archive expectations protect deployment boundaries, not ZIP internals."""
import hashlib
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
import zipfile

spec = importlib.util.spec_from_file_location('web_package', Path(__file__).resolve().parents[2] / 'scripts/package_web.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class WebPackageTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)
        self.build = self.root / 'build'
        (self.build / 'assets').mkdir(parents=True)
        (self.build / 'index.html').write_text('<h1>Hello</h1>')
        (self.build / 'assets/app.js').write_text('console.log("compiled")')
        self.output = self.root / 'web.zip'
        self.extras = {'INSTALL.md': b'Upload these files.', 'LICENSE': b'License fixture.'}
    def tearDown(self):
        self.temporary.cleanup()
    def test_deployable_contents_and_version(self):
        digest = module.pack_web(self.build, self.extras, self.output, '1.2.3')
        self.assertEqual(digest, hashlib.sha256(self.output.read_bytes()).hexdigest())
        with zipfile.ZipFile(self.output) as z:
            self.assertEqual(set(z.namelist()), {'index.html','assets/app.js','INSTALL.md','LICENSE','VERSION.txt'})
            self.assertEqual(z.read('index.html'), b'<h1>Hello</h1>')
            self.assertEqual(z.read('VERSION.txt'), b'1.2.3\n')
            self.assertIsNone(z.testzip())
    def test_private_file_is_rejected(self):
        (self.build / 'fixture.tkn').write_text('synthetic private fixture')
        with self.assertRaises(ValueError): module.pack_web(self.build, self.extras, self.output, '1.2.3')
        self.assertFalse(self.output.exists())
    def test_source_symlink_is_rejected(self):
        target = self.root / 'outside.js'; target.write_text('outside')
        try: (self.build / 'assets/link.js').symlink_to(target)
        except OSError: self.skipTest('Host does not permit creating a symlink fixture')
        with self.assertRaises(ValueError): module.pack_web(self.build, self.extras, self.output, '1.2.3')
    def test_missing_index_and_traversing_extra_are_rejected(self):
        with self.assertRaises(ValueError): module.pack_web(self.build, {'../escape':b'x'}, self.output, '1.2.3')
        (self.build / 'index.html').unlink()
        with self.assertRaises(ValueError): module.pack_web(self.build, self.extras, self.output, '1.2.3')
    def test_bytes_are_reproducible_despite_source_timestamps(self):
        module.pack_web(self.build, self.extras, self.output, '1.2.3'); first = self.output.read_bytes()
        os.utime(self.build / 'assets/app.js', (1000,1000))
        module.pack_web(self.build, self.extras, self.output, '1.2.3')
        self.assertEqual(self.output.read_bytes(), first)
        with zipfile.ZipFile(self.output) as z: self.assertTrue(all(i.date_time == (1980,1,1,0,0,0) for i in z.infolist()))

if __name__ == '__main__': unittest.main()
