"""Content preservation + functional/browser evidence for the isolated V3 home."""
from pathlib import Path
from collections import Counter
import json,re
from playwright.sync_api import sync_playwright

OUT=Path(__file__).resolve().parent.parent/'evidence'
OUT.mkdir(exist_ok=True)
errors=[];results=[];contracts={};interactions={}

def settle(page):
    page.wait_for_load_state('networkidle')
    page.evaluate('document.fonts.ready')
    page.evaluate("async()=>{for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));scrollTo(0,0);}")
    page.wait_for_timeout(1300)
    page.evaluate("()=>{const t=document.querySelector('.logos-track');if(t){t.style.animation='none';t.style.transform='translateX(0)';}}")

def contract(page):
    return page.evaluate("""()=>{
      const text=e=>e.textContent.replace(/\\s+/g,' ').trim();
      const label=e=>{const clone=e.cloneNode(true);clone.querySelectorAll('[aria-hidden]').forEach(n=>n.remove());return text(clone)};
      return {
       headings:[...document.querySelectorAll('main h1,main h2,main h3')].map(e=>[e.tagName,text(e)]),
       prose:[...document.querySelectorAll('main p,main li,footer p')].map(text).filter(Boolean),
       links:[...document.querySelectorAll('main a')].map(e=>[label(e),e.getAttribute('href')]),
       destinations:[...new Set([...document.querySelectorAll('a')].map(e=>e.getAttribute('href')))].sort(),
       images:[...new Set([...document.querySelectorAll('img[src^="/clientes/"]')].map(e=>e.getAttribute('src')+'|'+e.alt))].sort(),
       backgroundImages:[...document.querySelectorAll('[style]')].map(e=>e.style.backgroundImage).filter(Boolean),
       stats:[...document.querySelectorAll('main section:nth-child(2) .grid>div')].map(text)
      };
    }""")

with sync_playwright() as p:
    browser=p.chromium.launch()
    for variant,port,widths in [('reference',4192,[390,1440]),('erm',4191,[320,390,768,1440,1920])]:
        for width in widths:
            page=browser.new_page(viewport={'width':width,'height':900})
            page.on('pageerror',lambda error:errors.append(str(error)))
            requests=[];page.on('request',lambda request:requests.append(request.url))
            response=page.goto(f'http://127.0.0.1:{port}/')
            settle(page)
            contracts[f'{variant}-{width}']=contract(page)
            info=page.evaluate("""()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,sections:document.querySelectorAll('main section').length,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),heroTop:document.querySelector('main section').getBoundingClientRect().top,headerHeight:document.querySelector('header').getBoundingClientRect().height,videoElements:document.querySelectorAll('video').length})""")
            info.update(variant=variant,width=width,status=response.status,videoRequested=any('.mp4' in u for u in requests))
            results.append(info)
            if width in [390,1440]:
                page.screenshot(path=str(OUT/f'{variant}-{width}.png'),full_page=True)
                page.screenshot(path=str(OUT/f'{variant}-{width}-top.png'))
            page.close()

    original=contracts['reference-1440']; new=contracts['erm-1440']
    preservation={
      'headings_equal':original['headings']==new['headings'],
      'prose_equal':original['prose']==new['prose'],
      'all_original_main_links_present':not(Counter(map(tuple,original['links']))-Counter(map(tuple,new['links']))),
      'client_logos_equal':original['images']==new['images'],
      'client_logo_count':len(new['images']),
      'stats_equal':original['stats']==new['stats'],
      'missing_destinations':sorted(url for url in original['destinations'] if url.replace('://www.', '://').rstrip('/') not in {u.replace('://www.', '://').rstrip('/') for u in new['destinations']}),
      'added_destinations':sorted(set(new['destinations'])-set(original['destinations'])),
    }
    # Native disclosure menus operate by keyboard and without JavaScript.
    page=browser.new_page(viewport={'width':1440,'height':900})
    page.goto('http://127.0.0.1:4191/',wait_until='networkidle')
    summary=page.get_by_label('Abrir submenu Sobre',exact=True)
    summary.focus();page.keyboard.press('Enter')
    assert page.locator('.erm-dropdown').first.is_visible()
    page.keyboard.press('Escape');assert not page.locator('.erm-dropdown').first.is_visible()
    interactions['desktop_keyboard_menu']=True
    descriptions={}
    for port,key in [(4192,'reference'),(4191,'erm')]:
        page.goto(f'http://127.0.0.1:{port}/',wait_until='networkidle')
        descriptions[key]=[]
        buttons=page.get_by_role('button',name='Saiba mais',exact=True)
        for i in range(buttons.count()):
            buttons.nth(i).click()
            dialog=page.get_by_role('dialog');dialog.wait_for()
            descriptions[key].append(dialog.inner_text())
            page.keyboard.press('Escape')
            dialog.wait_for(state='hidden')
            assert buttons.nth(i).evaluate('e=>e===document.activeElement')
    interactions['dialog_text_equal']=descriptions['reference']==descriptions['erm']
    interactions['dialogs_checked']=len(descriptions['erm'])
    page.goto('http://127.0.0.1:4191/',wait_until='networkidle')
    page.get_by_role('button',name='Próximos clientes').click();page.wait_for_timeout(700)
    interactions['client_carousel_scroll']=page.locator('.erm-logo-track').evaluate('e=>e.scrollLeft>0')
    interactions['internal_links']={}
    for url in new['destinations']:
        if url.startswith('/'):
            interactions['internal_links'][url]=page.request.get('http://127.0.0.1:4191'+url).status
    page.close()
    for js,motion in [(False,'reduce'),(True,'reduce')]:
        context=browser.new_context(java_script_enabled=js,reduced_motion=motion,viewport={'width':390,'height':900})
        page=context.new_page();page.goto('http://127.0.0.1:4191/',wait_until='networkidle')
        page.get_by_label('Abrir menu de navegação').click()
        assert page.get_by_role('navigation',name='Navegação móvel',exact=True).is_visible()
        assert page.get_by_role('navigation',name='Navegação móvel',exact=True).get_by_role('link').count()==14
        if js:
            page.keyboard.press('Escape')
            assert not page.get_by_role('navigation',name='Navegação móvel',exact=True).is_visible()
            assert page.locator('[data-reveal]').evaluate_all('es=>es.every(e=>getComputedStyle(e).opacity==="1")')
        interactions[f'mobile_js_{js}_reduced_motion']=True
        context.close()
    browser.close()

report={'viewports':results,'preservation':preservation,'interactions':interactions,'page_errors':errors,'exceptions':['Hero photo converted to WebP with responsive sizes; original preserved.','Landscape photo converted to WebP; original preserved.','Hero video/player removed by instruction.','Header contact/language information moved to footer.','Blog and search added to primary navigation; hero CTA added.','Duplicate carousel clones replaced by a manually scrollable unique-logo list.']}
(OUT/'browser-check.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'content-contracts.json').write_text(json.dumps(contracts,ensure_ascii=False,indent=2),encoding='utf8')
(OUT/'dialog-contracts.json').write_text(json.dumps(descriptions,ensure_ascii=False,indent=2),encoding='utf8')
assert all(preservation[k] for k in ['headings_equal','prose_equal','all_original_main_links_present','client_logos_equal','stats_equal']),preservation
assert not preservation['missing_destinations'],preservation
assert interactions['dialog_text_equal'] and interactions['dialogs_checked']==3 and interactions['client_carousel_scroll'],interactions
assert all(v==200 for v in interactions['internal_links'].values()),interactions
assert not errors,errors
assert all(r['status']==200 and not r['overflow'] and not r['brokenImages'] and r['h1']==1 and not r['videoRequested'] for r in results),results
assert all(r['heroTop']==r['headerHeight'] for r in results if r['variant']=='erm'),results
print(json.dumps({'preservation':preservation,'interactions':interactions,'viewports':len(results),'page_errors':errors},ensure_ascii=False,indent=2))
