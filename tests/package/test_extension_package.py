"""Extension distributions contain local compiled UI and minimal host permissions."""
import importlib.util,json,sys,tempfile,unittest,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[2]/'scripts'))
spec=importlib.util.spec_from_file_location('extension_packager',Path(__file__).resolve().parents[2]/'scripts/package_extension.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class ExtensionPackageTests(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name);self.web=self.root/'web';self.web.mkdir();(self.web/'index.html').write_text('<main>Game</main>');self.manifest={'manifest_version':3,'name':'Tetris','version':'0.0.0','minimum_chrome_version':'142','permissions':['sidePanel'],'side_panel':{'default_path':'index.html'},'background':{'service_worker':'background.js'}}
    def tearDown(self):self.tmp.cleanup()
    def test_minimal_chromium_distribution(self):
        output=self.root/'chromium.zip';module.package_extension(self.web,self.manifest,{'background.js':b'chrome.sidePanel.setPanelBehavior({openPanelOnActionClick:true});'},output,'0.2.0',{'INSTALL.md':b'Development unpacked installation'})
        with zipfile.ZipFile(output) as z:
            m=json.loads(z.read('manifest.json'));self.assertEqual(m['version'],'0.2.0');self.assertEqual(m['permissions'],['sidePanel']);self.assertIn('index.html',z.namelist());self.assertIn(m['background']['service_worker'],z.namelist());self.assertNotIn('node_modules',z.namelist());self.assertIsNone(z.testzip())
    def test_remote_panel_rejected(self):
        self.manifest['side_panel']['default_path']='https://example.test/panel.html'
        with self.assertRaises(ValueError):module.package_extension(self.web,self.manifest,{'background.js':b''},self.root/'x.zip','0.2.0',{})
    def test_website_access_rejected(self):
        self.manifest['host_permissions']=['<all_urls>']
        with self.assertRaises(ValueError):module.package_extension(self.web,self.manifest,{'background.js':b''},self.root/'x.zip','0.2.0',{})
