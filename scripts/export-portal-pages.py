from pathlib import Path
import re, shutil
root=Path(__file__).resolve().parent.parent
source=root/'public-site'
target=root/'docs'
target.mkdir(exist_ok=True)
for path in source.rglob('*'):
 if not path.is_file(): continue
 dest=target/path.relative_to(source);dest.parent.mkdir(parents=True,exist_ok=True)
 if path.suffix in ('.html','.css','.js','.svg'):
  text=path.read_text()
  text=re.sub(r'(href|src|action)=("|\')/(?!/)',r'\1=\2/soc_architecture_ppals/',text)
  dest.write_text(text)
 else: shutil.copy2(path,dest)
(target/'.nojekyll').write_text('')
print('Exported portal to docs/ for GitHub Pages')
