"""Local browser audit. Existing Python Playwright; no production/network writes."""
from pathlib import Path
import json, re
from playwright.sync_api import sync_playwright

OUT=Path(__file__).resolve().parent.parent/'evidence'
OUT.mkdir(exist_ok=True)
results=[]
errors=[]
contracts={}

def settle(page):
    page.wait_for_load_state('networkidle')
    page.evaluate('document.fonts.ready')
    page.evaluate("async () => {for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}scrollTo(0,0);}")
    # Finish counters and load every original carousel asset, including offscreen clones.
    page.wait_for_timeout(1600)
    page.evaluate("async () => {await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));const t=document.querySelector('.logos-track');if(t){t.style.animationPlayState='paused';t.style.transform='translateX(0)';t.style.animation='none';}}")

def contract(page):
    return page.evaluate('''() => ({
      headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>[e.tagName,e.textContent.trim()]),
      texts:[...document.querySelectorAll('#conteudo p,#conteudo li,footer p')].map(e=>e.textContent.replace(/\\s+/g,' ').trim()),
      links:[...document.querySelectorAll('a')].map(e=>[e.textContent.replace(/\\s+/g,' ').trim(),e.getAttribute('aria-label'),e.getAttribute('href')]),
      images:[...document.querySelectorAll('img')].map(e=>[e.getAttribute('src'),e.getAttribute('alt')]),
      backgrounds:[...document.querySelectorAll('[style]')].map(e=>e.style.backgroundImage).filter(Boolean),
      buttons:[...document.querySelectorAll('button')].map(e=>[e.textContent.trim(),e.getAttribute('aria-label')])
    })''')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for variant,port in [('reference',4181),('polished',4182)]:
        for width in [320,390,768,1440]:
            page=browser.new_page(viewport={'width':width,'height':900})
            page.on('pageerror',lambda e:errors.append(str(e)))
            requests=[]
            page.on('request',lambda r: requests.append(r.url))
            response=page.goto(f'http://127.0.0.1:{port}/')
            settle(page)
            info=page.evaluate('''() => ({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,
              images:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.getAttribute('src')),
              font:getComputedStyle(document.querySelector('h1')).fontFamily,
              sections:document.querySelectorAll('main section').length})''')
            info.update(variant=variant,width=width,status=response.status,video_requested=any('.mp4' in u for u in requests))
            results.append(info)
            contracts[f'{variant}-{width}']=contract(page)
            if width in [390,1440]:
                page.screenshot(path=str(OUT/f'{variant}-{width}.png'),full_page=True,animations='disabled')
                page.screenshot(path=str(OUT/f'{variant}-{width}-top.png'),animations='disabled')
            page.close()
    # Original and polished versions use identical content and destinations at every viewport.
    equality={str(w):contracts[f'reference-{w}']==contracts[f'polished-{w}'] for w in [320,390,768,1440]}
    (OUT/'content-contracts.json').write_text(json.dumps(contracts,ensure_ascii=False,indent=2),encoding='utf8')
    (OUT/'browser-check.json').write_text(json.dumps({'viewports':results,'content_equality':equality,'page_errors':errors},ensure_ascii=False,indent=2),encoding='utf8')
    assert all(equality.values()), 'Content differs between reference and proposal'
    assert not errors, errors
    assert all(not r['overflow'] and r['h1']==1 and not r['images'] and not r['video_requested'] for r in results), results
    browser.close()
print(json.dumps({'viewports':results,'content_equality':equality,'page_errors':errors},ensure_ascii=False,indent=2))
