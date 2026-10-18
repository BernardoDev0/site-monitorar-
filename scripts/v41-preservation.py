from pathlib import Path
import json,hashlib,zipfile
root=Path.cwd();base=Path('D:/monitorar-recovery/v4.1-20261018-135135');out=Path('docs/organic/v4.1/evidence');old=json.loads((base/'manifest.json').read_text());changed=[];missing=[]
for path,sha in old.items():
 p=root/path
 if not p.exists():missing.append(path)
 elif hashlib.sha256(p.read_bytes()).hexdigest()!=sha:changed.append(path)
articles=[]
with zipfile.ZipFile(base/'workspace.zip') as z:
 for name in z.namelist():
  if name.startswith('content/documents/') and name.endswith('.json'):
   data=z.read(name);d=json.loads(data)
   if d['type']=='article':articles.append({'id':d['id'],'unchanged':data==(root/name).read_bytes()})
assets=[p for p in old if p.startswith(('public/','src/assets/')) and not p.startswith('public/media/')]
result={'baseline':str(base),'changed':changed,'missing':missing,'articles':articles,'original_assets_checked':len(assets),'original_assets_changed':[p for p in assets if p in changed or p in missing]}
(out/'preservation.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
assert len(articles)==90 and all(r['unchanged'] for r in articles)
assert not result['original_assets_changed'] and not missing
print(json.dumps({'articles_unchanged':len(articles),'assets_unchanged':len(assets),'changed_files':len(changed),'missing':missing}))
