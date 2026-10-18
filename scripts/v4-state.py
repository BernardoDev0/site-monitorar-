"""Inventory relative to the verified pre-V4 backup; no production mutation."""
from pathlib import Path
import json,hashlib,csv,re,zipfile
root=Path.cwd();out=root/'docs/organic/v4';baseline=Path('D:/monitorar-recovery/v4-20261018-032828')
old=json.loads((baseline/'manifest.json').read_text(encoding='utf8'));changed=[];missing=[]
for r in old:
 p=root/r['path']
 if not p.exists():missing.append(r['path'])
 elif hashlib.sha256(p.read_bytes()).hexdigest()!=r['sha256']:changed.append(r['path'])
known={r['path'] for r in old};new=[]
for folder in ['src','scripts','content','specs/organic/v4','docs/organic/v4','public/media']:
 for p in (root/folder).rglob('*'):
  if p.is_file() and p.relative_to(root).as_posix() not in known:new.append(p.relative_to(root).as_posix())
docs=[json.loads(p.read_text(encoding='utf8')) for p in (root/'content/documents').glob('*.json')];articles=sorted([d for d in docs if d['type']=='article'],key=lambda d:d['id'])
with (out/'article-map.csv').open('w',encoding='utf8',newline='') as f:
 w=csv.writer(f);w.writerow(['id','url','title','cluster','paragraph_words','sections','status','human_review','sources'])
 for d in articles:w.writerow([d['id'],d['slug'],d['title'],d['topic_cluster'],len(' '.join(p for s in d['body'] for p in s['paragraphs']).split()),len(d['body']),d['status'],'pending',';'.join(d['source_urls'])])
# Existing article JSONs are preserved byte-for-byte relative to the V4 backup.
oldarticles=[]
with zipfile.ZipFile(baseline/'workspace.zip') as z:
 for name in z.namelist():
  if name.startswith('content/documents/') and name.endswith('.json'):
   data=z.read(name);d=json.loads(data)
   if d['type']=='article':oldarticles.append({'id':d['id'],'unchanged':data==(root/name).read_bytes()})
source=(baseline/'reference-Services.tsx').read_text(encoding='utf8');current=(root/'src/pages/Services.tsx').read_text(encoding='utf8')
descriptions=re.findall(r'fullDescription:\s*"([^"]+)"',current)
preservation={'existing_articles':oldarticles,'service_full_descriptions':[{'index':i+1,'exact_in_reference':s in source} for i,s in enumerate(descriptions)],'original_assets':all(r['original_unchanged'] for r in json.loads((out/'evidence/photos/accepted.json').read_text(encoding='utf8')))}
(out/'evidence/preservation.json').write_text(json.dumps(preservation,ensure_ascii=False,indent=2),encoding='utf8')
(out/'evidence/change-inventory.json').write_text(json.dumps({'baseline':str(baseline),'changed_from_v4_backup':changed,'missing_from_v4_backup':missing,'new_in_work_scopes':new,'note':'Git diff also includes work that predates V4. Evidence files can evolve after this inventory.'},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'articles':len(articles),'documents':len(docs),'changed':len(changed),'new':len(new),'missing':missing,'preservation':preservation},ensure_ascii=False))
