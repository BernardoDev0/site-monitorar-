from pathlib import Path
from playwright.sync_api import sync_playwright
import json
out=Path('docs/organic/v4.2/evidence/browser');out.mkdir(parents=True,exist_ok=True)
results={};errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome',headless=True);page=b.new_page(viewport={'width':1440,'height':900})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.goto('http://127.0.0.1:8081/');page.wait_for_function("document.querySelector('video').currentTime>0.5")
 assert page.locator('.erm-hero button').count()==0
 # Real playback and compositor frame timings over a complete ping-pong cycle.
 results['video']=page.evaluate('''async()=>{const v=document.querySelector('video');let frames=[],ticks=[],last=performance.now();const start=v.getVideoPlaybackQuality();let stop=false;function tick(t){ticks.push(t-last);last=t;if(!stop)requestAnimationFrame(tick)}requestAnimationFrame(tick);function sample(_,m){frames.push(m.mediaTime);if(!stop)v.requestVideoFrameCallback(sample)}v.requestVideoFrameCallback(sample);await new Promise(r=>setTimeout(r,21500));stop=true;const q=v.getVideoPlaybackQuality();return {duration:v.duration,source:v.currentSrc,loop:frames.some((x,i)=>i&&x<frames[i-1]),presented:frames.length,total:q.totalVideoFrames-start.totalVideoFrames,dropped:q.droppedVideoFrames-start.droppedVideoFrames,rafMedian:ticks.sort((a,b)=>a-b)[Math.floor(ticks.length/2)],rafP95:ticks[Math.floor(ticks.length*.95)]}}''')
 assert results['video']['loop'];page.screenshot(path=str(out/'home-playing.png'))
 # Slow pointer traversal and rapid changes including animation reversal.
 for name in ['Sobre','Serviços','Blog','Sobre','Blog']:
  trigger=page.locator(f'.erm-desktop-nav summary[aria-label="Abrir submenu {name}"]');trigger.hover();page.wait_for_timeout(110)
 page.wait_for_timeout(350);assert page.locator('.erm-desktop-nav details[open]').count()==1
 trigger=page.locator('.erm-desktop-nav summary[aria-label="Abrir submenu Blog"]');box=trigger.bounding_box();y=page.locator('.erm-header').bounding_box();page.mouse.move(box['x']+10,y['y']+y['height']-1);page.wait_for_timeout(450);page.mouse.move(box['x']+10,y['y']+y['height']+10);page.wait_for_timeout(450);assert page.locator('.erm-desktop-nav details[open]').count()==1
 page.screenshot(path=str(out/'menu-fluid-1440.png'));page.mouse.move(2,850);page.wait_for_timeout(200);trigger.hover();page.wait_for_timeout(400);assert page.locator('.erm-desktop-nav details[open]:not([data-closing])').count()==1
 trigger.focus();page.keyboard.press('Escape');page.wait_for_timeout(250);assert page.locator('.erm-desktop-nav details[open]').count()==0
 results['menu_slow_bridge_rapid_switch_reverse_escape']=True
 # Geometry at the desktop threshold, mobile and zoom.
 results['header']=[]
 for width in [320,390,768,1280,1290,1440,1920]:
  page.set_viewport_size({'width':width,'height':900});page.wait_for_timeout(250)
  geom=page.evaluate('''()=>{const rect=s=>document.querySelector(s).getBoundingClientRect();const logo=rect('.erm-logo'),nav=rect('.erm-desktop-nav'),search=rect('.erm-search'),mobile=rect('.erm-mobile-nav');return {overflow:document.documentElement.scrollWidth>innerWidth,desktop:nav.width>0,overlap:nav.width>0?(logo.right>nav.left||nav.right>search.left):(logo.right>search.left||search.right>mobile.left)}}''')
  results['header'].append({'width':width,**geom});assert not geom['overflow'] and not geom['overlap'],results['header'][-1]
 page.set_viewport_size({'width':1440,'height':900});page.evaluate('document.body.style.zoom=2');assert not page.evaluate('document.documentElement.scrollWidth>innerWidth');page.evaluate("document.body.style.zoom=''")
 # Full 40-second logo cycle; hover deliberately stays on the carousel.
 page.locator('.client-marquee').scroll_into_view_if_needed();page.locator('.client-marquee').hover();page.wait_for_timeout(400)
 results['logos']=page.evaluate('''async()=>{const belt=document.querySelector('.client-marquee-belt'),groups=[...belt.children];const width=groups[0].getBoundingClientRect().width;const x=()=>new DOMMatrix(getComputedStyle(belt).transform).m41;let values=[];const start=performance.now();while(performance.now()-start<41200){values.push({x:x(),t:performance.now()});await new Promise(r=>setTimeout(r,100))}return {width,groupWidths:groups.map(g=>g.getBoundingClientRect().width),count:groups[0].querySelectorAll('img').length,moved:Math.abs(values[5].x-values[0].x)>5,wraps:values.filter((v,i)=>i&&v.x>values[i-1].x+width/2).length,maxStepError:Math.max(...values.slice(1).map((v,i)=>Math.abs(((values[i].x-v.x+width)%width)-width*(v.t-values[i].t)/40000)))}}''')
 assert results['logos']['moved'] and results['logos']['wraps']==1 and results['logos']['count']==13 and results['logos']['maxStepError']<10,results['logos']
 page.screenshot(path=str(out/'logos-moving.png'));page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(300)
 assert page.locator('video').evaluate('(v)=>v.paused');assert not page.locator('.client-marquee').get_attribute('data-animated');assert page.locator('.client-marquee-group[aria-hidden]').is_hidden()
 results['reduced_motion']=True;results['errors']=errors;assert not errors
 b.close()
(out/'motion.json').write_text(json.dumps(results,indent=2),encoding='utf8');print(json.dumps(results),flush=True)
