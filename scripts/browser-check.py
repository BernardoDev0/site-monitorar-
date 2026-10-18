"""Requires existing Python Playwright/Chromium; exercises only local previews."""
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT=Path('docs/organic/v2/evidence/implementation')
OUT.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width in [390,768,1440]:
        page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        for route,name in [('/','home'),('/blog','blog'),('/conteudos','directory'),('/busca','search'),('/servicos','services'),('/sobre','about'),('/clientes','clients'),('/depoimentos','testimonials'),('/trabalhe-conosco','careers'),('/politica-privacidade','privacy'),('/contato','contact'),('/blog/deteccao-e-quantificacao-de-emissoes-fugitivas','article'),('/servicos/emissoes-fugitivas','editorial-service')]:
            response=page.goto('http://127.0.0.1:4174'+route)
            page.wait_for_load_state('networkidle')
            assert response.status==200,route
            assert page.locator('h1').count()==1,route
            assert not page.evaluate('document.documentElement.scrollWidth>innerWidth'),route
            assert not page.locator('img').evaluate_all('(imgs)=>imgs.some(i=>!i.complete||!i.naturalWidth)'),route
            page.screenshot(path=str(OUT/f'{name}-{width}.png'),full_page=True)
            results.append({'route':route,'width':width,'status':200,'horizontal_overflow':False,'h1':1})
        assert not errors,errors
        if width==390:
            page.locator('.mobile-nav summary').click()
            assert page.locator('.mobile-nav').get_attribute('open') is not None
            page.keyboard.press('Escape')
            assert page.locator('.mobile-nav').get_attribute('open') is None
        page.close()
    page=browser.new_page(viewport={'width':1200,'height':900})
    page.goto('http://127.0.0.1:4174/busca');page.wait_for_load_state('networkidle')
    page.get_by_label('Termos da busca').fill('EMISSOES fugitivas')
    page.get_by_role('button',name='Buscar',exact=True).click()
    page.wait_for_function("document.querySelector('.search-status').textContent.includes('resultado')")
    assert page.locator('.entry-list article').count()>0
    assert '#q=' in page.url
    page.get_by_label('Termos da busca').fill('zzzinexistente')
    assert page.locator('.entry-list article').count()==0
    page.get_by_role('button',name='Limpar filtros').click()
    assert page.locator('.entry-list article').count()>0
    page.goto('http://127.0.0.1:4174/contato');page.wait_for_load_state('networkidle')
    # Synthetic test data remains in the browser. No external contact action is invoked.
    page.get_by_label('Nome *',exact=True).fill('Teste local')
    page.get_by_label('Telefone *',exact=True).fill('00000000000')
    page.get_by_label('E-mail *',exact=True).fill('fixture@example.invalid')
    page.get_by_label('Sobre o projeto').fill('Solicitação sintética para validar preparação local.')
    page.get_by_role('button',name='Preparar mensagem').click()
    assert 'Teste local' in page.get_by_label('Revise sua mensagem').input_value()
    assert 'fixture@example.invalid' not in page.url
    # Force clipboard failure to verify the accessible fallback.
    page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(new Error('test'))},configurable:true})")
    page.get_by_role('button',name='Copiar mensagem',exact=True).click()
    page.get_by_role('status').filter(has_text='Não foi possível copiar').wait_for()
    page.close()
    context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844},reduced_motion='reduce')
    page=context.new_page();page.goto('http://127.0.0.1:4174/')
    page.locator('.mobile-nav summary').click();page.locator('.mobile-nav a[href="/blog"]').click()
    assert page.locator('.entry-list article').count()==12
    assert page.locator('.pagination a[href="/blog/pagina/2"]').count()==1
    page.goto('http://127.0.0.1:4174/clientes')
    assert page.locator('.logo-grid figure').count()==14
    assert page.locator('.logo-grid img').first.is_visible()
    context.close();browser.close()
(OUT/'browser-validation.json').write_text(json.dumps({'checks':results,'interaction_checks':['mobile menu Escape','search accent/case normalization','empty and clear search','fragment state','contact local preparation','clipboard failure','no-JS navigation','14 logos reduced motion'],'limitations':['Chromium emulation, not physical mobile devices','No NVDA or full WCAG conformance assessment','No Google indexing measured']},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'{len(results)} rendered page/viewport checks and interaction checks passed')
