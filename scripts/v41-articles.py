from pathlib import Path
import json,urllib.request,concurrent.futures
articles=[json.loads(p.read_text(encoding='utf8')) for p in Path('content/documents').glob('*.json')];articles=[d for d in articles if d['type']=='article']
def check(d):
 with urllib.request.urlopen('http://127.0.0.1:8081'+d['slug']) as r:
  text=r.read().decode();return {'slug':d['slug'],'status':r.status,'title_present':d['title'] in text,'cover_present':'editorial-cover' in text,'noindex':r.headers.get('X-Robots-Tag')}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:results=list(pool.map(check,articles))
Path('docs/organic/v4.1/evidence/browser/all-articles.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
assert len(results)==90 and all(r['status']==200 and r['title_present'] and r['cover_present'] and r['noindex']=='noindex, nofollow' for r in results)
print('90 article routes: PASS')
