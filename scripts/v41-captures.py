from playwright.sync_api import sync_playwright
from pathlib import Path
out=Path('docs/organic/v4.1/evidence/browser')
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome',headless=True)
 for width in [390,1440]:
  page=b.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  for route,name in [('/','home'),('/blog','blog'),('/blog/o-que-sao-emissoes-fugitivas','article')]:
   page.goto('http://127.0.0.1:8081'+route);page.wait_for_load_state('networkidle');page.evaluate("document.querySelectorAll('img').forEach(i=>i.loading='eager')");page.evaluate('async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))}')
   for y in range(0,page.evaluate('document.documentElement.scrollHeight'),800):page.evaluate('(y)=>scrollTo(0,y)',y);page.wait_for_timeout(40)
   page.evaluate('scrollTo(0,0)');page.wait_for_timeout(150);page.screenshot(path=str(out/f'{name}-{width}.png'),full_page=True)
  page.close()
 b.close()
print('Final screenshots refreshed')
