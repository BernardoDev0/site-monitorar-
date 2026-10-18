"""Local regression evidence; never submits external messages."""
import json,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('docs/organic/v4.2/evidence/browser');OUT.mkdir(parents=True,exist_ok=True)
checks=[];errors=[]
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 widths=list(map(int,sys.argv[1:])) or [390,768,1440]
 for width in widths:
  page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
  page.on('pageerror',lambda e:errors.append(str(e)))
  for route,name in [('/','home'),('/sobre','about'),('/servicos','services'),('/servicos/seguranca','safety'),('/servicos/drager','drager'),('/clientes','clients'),('/depoimentos','testimonials'),('/trabalhe-conosco','careers'),('/contato','contact'),('/politica-privacidade','privacy'),('/blog','blog'),('/blog/pagina/8','blog8'),('/conteudos','directory'),('/busca','search'),('/blog/o-que-sao-emissoes-fugitivas','article'),('/servicos/emissoes-fugitivas','editorial-service'),('/conteudos/emissoes-fugitivas','hub'),('/missing','404')]:
   r=page.goto('http://127.0.0.1:8081'+route);page.wait_for_load_state('networkidle')
   page.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i=>i.loading='eager')")
   page.wait_for_function("[...document.images].every(i=>i.complete)")
   page.evaluate('async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)}')
   page.evaluate('scrollTo(0,0)')
   result={'route':route,'width':width,'status':r.status,'h1':page.locator('h1').count(),'overflow':page.evaluate('document.documentElement.scrollWidth>innerWidth'),'broken_images':page.locator('img').evaluate_all('(imgs)=>imgs.filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)')}
   checks.append(result)
   page.screenshot(path=str(OUT/f'{name}-{width}.png'),full_page=True)
   print(json.dumps(result),flush=True)
  page.close()
 browser.close()
(OUT/('routes-'+('-'.join(map(str,widths)))+'.json')).write_text(json.dumps({'checks':checks,'errors':errors},ensure_ascii=False,indent=2),encoding='utf8')
assert not errors,errors
assert all(x['status']==(404 if x['route']=='/missing' else 200) and x['h1']==1 and not x['overflow'] and not x['broken_images'] for x in checks)
