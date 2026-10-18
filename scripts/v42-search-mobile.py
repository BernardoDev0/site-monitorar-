from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('docs/organic/v4.2/evidence/browser');results=[]
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome',headless=True)
 page=b.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
 for port in [4173,8081]:
  page.goto(f'http://127.0.0.1:{port}/busca');page.wait_for_function("document.querySelector('.search-status').textContent.includes('resultado')")
  for query,expected in [('Dräger','/servicos/drager'),('DRAGER','/servicos/drager'),('segurança do trabalho','/servicos/seguranca'),('contato','/contato'),('emissoes fugitivas','/')]:
   page.get_by_label('Termos da busca').fill(query);page.get_by_label('Termos da busca').press('Enter');links=page.locator('.entry-list h2 a').evaluate_all('(a)=>a.map(x=>x.pathname)');assert expected in links,(port,query,links);results.append({'port':port,'query':query,'expected':expected,'found':True})
  if port==4173:
   assert not any(l.startswith('/blog/') for l in links)
   page.screenshot(path=str(out/'public-search.png'))
 page.close();page=b.new_page(viewport={'width':390,'height':844},is_mobile=True)
 page.goto('http://127.0.0.1:8081/');page.wait_for_function("document.querySelector('video').currentTime>.5")
 assert page.locator('video').evaluate('(v)=>v.currentSrc.includes("pingpong-mobile")')
 assert page.locator('.erm-hero button').count()==0
 media=page.evaluate('''async()=>{const v=document.querySelector('video');const q=v.getVideoPlaybackQuality();let frames=[],stop=false;function sample(_,m){frames.push(m.mediaTime);if(!stop)v.requestVideoFrameCallback(sample)}v.requestVideoFrameCallback(sample);await new Promise(r=>setTimeout(r,21000));stop=true;const end=v.getVideoPlaybackQuality();return {source:v.currentSrc,loop:frames.some((x,i)=>i&&x<frames[i-1]),total:end.totalVideoFrames-q.totalVideoFrames,dropped:end.droppedVideoFrames-q.droppedVideoFrames}}''')
 assert media['loop'];results.append({'mobile_video':media});page.screenshot(path=str(out/'home-playing-390.png'))
 page.locator('.erm-mobile-nav>summary').click();page.wait_for_timeout(300);page.locator('.erm-mobile-group summary[aria-label="Abrir submenu Blog"]').click();page.wait_for_timeout(300);page.keyboard.press('Escape');page.keyboard.press('Escape');page.wait_for_timeout(250);assert not page.locator('.erm-mobile-nav[open]').count()
 results.append({'mobile_animated_nested_escape':True});b.close()
(out/'search-mobile.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps(results))
