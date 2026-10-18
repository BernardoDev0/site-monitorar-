from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path('docs/organic/v4.1/evidence/browser');results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 page=browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 for route in ['/','/sobre','/servicos','/contato','/blog','/busca','/depoimentos']:
  page.goto('http://127.0.0.1:8081'+route);page.wait_for_load_state('networkidle');page.add_script_tag(path='D:/monitorar-tools/v4/axe-4.10.3.min.js')
  result=page.evaluate("async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))}")
  results.append({'route':route,'violations':result});print(json.dumps(results[-1]),flush=True)
 page.goto('http://127.0.0.1:8081/contato');page.wait_for_load_state('networkidle');page.evaluate('document.body.style.zoom=2');assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
 page.goto('http://127.0.0.1:8081/');page.keyboard.press('Tab');assert page.evaluate('document.activeElement.classList.contains("skip-link")');page.keyboard.press('Enter');assert page.evaluate('document.activeElement.id==="conteudo"')
 browser.close()
(out/'accessibility.json').write_text(json.dumps({'axe':results,'keyboard_skip':True,'css_zoom_200_contact':True,'limitations':['Automated checks are not a full WCAG assessment; no physical-device or screen-reader test.']},ensure_ascii=False,indent=2),encoding='utf8')
assert all(not r['violations'] for r in results)
