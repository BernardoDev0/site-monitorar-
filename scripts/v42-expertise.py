from playwright.sync_api import sync_playwright
from pathlib import Path
import json,re
out=Path('docs/organic/v4.2/evidence');before=json.loads((out/'expertise-before.json').read_text(encoding='utf8'));results=[]
normalize=lambda x:' '.join(x.split())
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome',headless=True)
 for width in [320,390,768,1440,1920]:
  page=b.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce');page.goto('http://127.0.0.1:8081/');page.wait_for_load_state('networkidle');sec=page.locator('.erm-expertise');page.locator('img').evaluate_all('(imgs)=>imgs.forEach(i=>i.loading="eager")');page.evaluate('async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))}');sec.scroll_into_view_if_needed();page.wait_for_timeout(200)
  assert normalize(sec.inner_text())==normalize(before['text']),(width,sec.inner_text())
  assert sec.locator('h3').all_text_contents()==before['headings'];assert sec.locator('a').evaluate_all('(a)=>a.map(x=>({text:x.textContent,href:x.getAttribute("href")}))')==before['links']
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth');height=sec.bounding_box()['height'];results.append({'width':width,'height':height,'texts_links_and_order_preserved':True,'images':sec.locator('img').count()})
  page.add_style_tag(content='.erm-header,.skip-link,.whatsapp-button{visibility:hidden!important}');sec.screenshot(path=str(out/f'expertise-{width}.png'));page.close()
 b.close()
(out/'expertise-after.json').write_text(json.dumps({'before_desktop_height':before['height'],'checks':results},indent=2));print(json.dumps(results))
