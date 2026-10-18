from pathlib import Path
import json,hashlib,zipfile
out=Path('docs/organic/v4.2/evidence');base=Path('D:/monitorar-recovery/motion-20261018-145607');old=json.loads((base/'manifest.json').read_text());changed=[];missing=[]
for name,sha in old.items():
 p=Path(name)
 if not p.exists():missing.append(name)
 elif hashlib.sha256(p.read_bytes()).hexdigest()!=sha:changed.append(name)
articles=[n for n in old if n.startswith('content/documents/')]
assert not missing and not any(n in changed for n in articles)
result={'backup':str(base),'changed':changed,'missing':missing,'editorial_documents_unchanged':len(articles),'note':'Backup taken before V4.2 implementation. Previous uncommitted work preserved. Public media originals separately verified by existing V4.1 manifest.'}
assetbase=json.loads(Path('D:/monitorar-recovery/v4.1-20261018-135135/manifest.json').read_text());assets=[n for n in assetbase if n.startswith(('public/','src/assets/')) and not n.startswith('public/media/')];result['original_assets_unchanged']=all(hashlib.sha256(Path(n).read_bytes()).hexdigest()==assetbase[n] for n in assets);result['original_assets_count']=len(assets);assert result['original_assets_unchanged']
(out/'preservation.json').write_text(json.dumps(result,indent=2),encoding='utf8');print(json.dumps(result))
