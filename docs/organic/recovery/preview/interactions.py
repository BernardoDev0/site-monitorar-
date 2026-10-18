from pathlib import Path
import json
from playwright.sync_api import sync_playwright

OUT=Path(__file__).resolve().parent.parent/'evidence'
checks=[]
dialogs={}
errors=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for variant,port in [('reference',4181),('polished',4182)]:
        page=browser.new_page(viewport={'width':1440,'height':900})
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.goto(f'http://127.0.0.1:{port}/');page.wait_for_load_state('networkidle')
        dialogs[variant]=[]
        for i in range(3):
            trigger=page.get_by_role('button',name='Saiba mais',exact=True).nth(i)
            trigger.click()
            dialog=page.get_by_role('dialog');dialog.wait_for()
            dialogs[variant].append({'text':dialog.inner_text(),'links':dialog.locator('a').evaluate_all('(a)=>a.map(e=>e.getAttribute("href"))')})
            page.keyboard.press('Escape');dialog.wait_for(state='hidden')
            assert trigger.evaluate('(e)=>e===document.activeElement')
        checks.append(variant+': 3 dialogs, full copy, Escape and restored focus')
        page.evaluate('scrollTo(0,0)');page.wait_for_timeout(500)
        video=page.get_by_role('button',name='Reproduzir vídeo de fundo (38 MB)',exact=True)
        video.click();page.locator('video').wait_for()
        assert page.locator('video').get_attribute('src')=='/refinaria2.mp4'
        page.get_by_role('button',name='Pausar vídeo de fundo',exact=True).click()
        assert page.locator('video').count()==0
        checks.append(variant+': original video starts on demand and stops')
        if variant=='polished':
            page.mouse.move(0,899)
            about=page.locator('.header-nav a[href="/sobre"]');about.focus()
            page.locator('.header-nav a[href="/sobre/historia"]').wait_for(state='visible')
            page.keyboard.press('Escape');page.locator('.header-nav a[href="/sobre/historia"]').wait_for(state='hidden')
            about.hover();page.locator('.header-nav a[href="/sobre/historia"]').hover()
            assert page.locator('.header-nav a[href="/sobre/historia"]').is_visible()
            checks.append('polished: desktop dropdown keyboard/Escape and pointer bridge')
            # Current unchanged build answers the original internal destinations.
            hrefs=page.locator('a[href^="/"]').evaluate_all('(a)=>[...new Set(a.map(e=>e.getAttribute("href")))]')
            for href in hrefs: assert page.request.get(f'http://127.0.0.1:{port}'+href).status==200,href
            checks.append('polished: all '+str(len(hrefs))+' internal link destinations return HTTP 200')
        page.close()
    assert dialogs['reference']==dialogs['polished']
    page=browser.new_page(viewport={'width':390,'height':844})
    page.goto('http://127.0.0.1:4182/');page.wait_for_load_state('networkidle')
    trigger=page.get_by_role('button',name='Abrir menu de navegação')
    trigger.click();menu=page.get_by_role('dialog');menu.wait_for();assert menu.locator('a').count()==7
    page.screenshot(path=str(OUT/'polished-mobile-menu.png'))
    page.keyboard.press('Escape');menu.wait_for(state='hidden');assert trigger.evaluate('(e)=>e===document.activeElement')
    checks.append('polished: mobile menu has original 7 destinations, Escape and restored focus')
    page.emulate_media(reduced_motion='reduce')
    page.wait_for_timeout(100)
    assert page.get_by_role('button',name='Reproduzir vídeo de fundo (38 MB)',exact=True).count()==0
    assert page.locator('.logos-track').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
    logos=page.locator('.logos-track > .logo-item:visible').evaluate_all('(items)=>items.map(i=>i.querySelector("img").getAttribute("src"))')
    assert len(logos)==len(set(logos))==13
    checks.append('polished: reduced motion stops animation, exposes all 13 original Home logos, disables video')
    page.close()
    context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844},reduced_motion='reduce')
    page=context.new_page();page.goto('http://127.0.0.1:4182/')
    assert page.locator('h1').is_visible() and page.locator('main section').count()==9
    assert page.get_by_role('navigation',name='Navegação sem JavaScript').is_visible()
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
    page.get_by_role('navigation',name='Navegação sem JavaScript').get_by_role('link',name='Serviços').click()
    assert page.url.endswith('/servicos') and page.locator('h1').is_visible()
    checks.append('polished: SSR/no-JS content, 9 sections and navigation to unchanged Services')
    context.close()
    # 200% browser zoom equivalent: CSS viewport is halved, device scale factor doubled.
    context=browser.new_context(viewport={'width':720,'height':450},device_scale_factor=2)
    page=context.new_page();page.goto('http://127.0.0.1:4182/');page.wait_for_load_state('networkidle')
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth')
    page.get_by_role('button',name='Abrir menu de navegação').click();assert page.get_by_role('dialog').is_visible()
    checks.append('polished: 200% zoom-equivalent reflow and menu; emulation, not physical device')
    context.close();browser.close()
assert not errors,errors
(OUT/'interactions.json').write_text(json.dumps({'checks':checks,'dialogs_equal':True,'dialogs':dialogs,'page_errors':errors},ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps(checks,ensure_ascii=False,indent=2))
