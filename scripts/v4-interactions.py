import json
from pathlib import Path
from urllib.parse import urlparse,parse_qs
from playwright.sync_api import sync_playwright
out=Path('docs/organic/v4/evidence/browser');out.mkdir(parents=True,exist_ok=True)
results={}
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 context=browser.new_context(viewport={'width':1440,'height':900},record_video_dir=str(out/'video'),record_video_size={'width':1440,'height':900})
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.add_init_script("""window.motionFrames=[];let n=0;function sample(){const h=document.querySelector('h1');if(h)window.motionFrames.push(getComputedStyle(h).transform);if(++n<240)requestAnimationFrame(sample)}requestAnimationFrame(sample);""")
 page.goto('http://127.0.0.1:8081/');page.wait_for_function("document.querySelector('.site-v4').dataset.motion==='active'")
 page.wait_for_function("document.querySelector('video').currentTime>1")
 page.wait_for_timeout(1100)
 frames=page.evaluate('motionFrames');assert len(set(frames))>3,frames
 assert page.locator('h1').evaluate("h=>getComputedStyle(h).transform")=='none','Heading must settle at its natural position'
 results['heading_transforms']=list(dict.fromkeys(frames))
 t1=page.locator('video').evaluate('(v)=>v.currentTime');page.screenshot(path=str(out/'video-playing.png'))
 page.wait_for_timeout(500);t2=page.locator('video').evaluate('(v)=>v.currentTime');assert t2>t1
 page.get_by_role('button',name='Pausar vídeo',exact=True).click();t3=page.locator('video').evaluate('(v)=>v.currentTime');page.wait_for_timeout(350);assert abs(page.locator('video').evaluate('(v)=>v.currentTime')-t3)<.08
 page.get_by_role('button',name='Reproduzir vídeo',exact=True).click();page.wait_for_timeout(300);assert not page.locator('video').evaluate('(v)=>v.paused')
 results['video']={'start':t1,'later':t2,'pause_resume':True,'source':page.locator('video').evaluate('(v)=>v.currentSrc')}
 for selector in ['.erm-services','.erm-expertise','.erm-segments','.erm-offerings']:
  page.locator(selector).scroll_into_view_if_needed();page.wait_for_timeout(1100)
 page.get_by_role('button',name='Saiba mais',exact=True).first.click();page.get_by_role('dialog').wait_for();page.keyboard.press('Escape');page.get_by_role('dialog').wait_for(state='hidden')
 page.emulate_media(reduced_motion='reduce');page.wait_for_timeout(200);assert page.locator('.site-v4').get_attribute('data-motion')=='reduced';assert page.locator('video').evaluate('(v)=>v.paused');results['reduced_motion_live_toggle']=True
 page.goto('http://127.0.0.1:8081/contato');page.wait_for_load_state('networkidle')
 page.get_by_label('Nome *',exact=True).fill('Teste local & revisão');page.get_by_label('Telefone *',exact=True).fill('00000000000');page.get_by_label('E-mail *',exact=True).fill('fixture@example.invalid');page.get_by_label('Sobre o projeto').fill('Teste sintético: água + ar?')
 page.get_by_role('button',name='Preparar mensagem',exact=True).click();message=page.get_by_label('Revise sua mensagem');message.fill(message.input_value()+'\nTexto revisado: ç & + # ?')
 link=page.get_by_role('link',name='Abrir WhatsApp com esta mensagem');assert parse_qs(urlparse(link.get_attribute('href')).query)['text'][0]==message.input_value();assert 'fixture' not in page.url
 results['contact_exact_reviewed_text']=True
 page.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:()=>Promise.reject(Error('fixture'))},configurable:true})")
 page.get_by_role('button',name='Copiar mensagem',exact=True).click();page.get_by_role('status').filter(has_text='Não foi possível copiar').wait_for();results['clipboard_fallback']=True
 page.goto('http://127.0.0.1:8081/busca#q=EMISSOES+fugitivas');page.wait_for_function("document.querySelector('.search-status').textContent.includes('resultado')")
 assert page.locator('.entry-list article').count()>0
 page.get_by_label('Termos da busca').fill('zzzzinexistente');assert page.locator('.entry-list article').count()==0
 page.get_by_role('button',name='Limpar filtros',exact=True).click();assert page.locator('.entry-list article').count()==12
 page.evaluate("location.hash='q=HAZOP'");page.wait_for_timeout(200);assert page.get_by_label('Termos da busca').input_value()=='HAZOP';page.go_back();page.wait_for_timeout(200);assert page.get_by_label('Termos da busca').input_value()==''
 results['search_hash_back_empty_clear']=True
 page.route('**/search-index.json',lambda route:route.fulfill(status=503,body='unavailable'));page.reload();page.wait_for_load_state('networkidle');page.get_by_label('Termos da busca').focus();page.get_by_role('button',name='Tentar novamente',exact=True).wait_for();page.unroute('**/search-index.json');page.get_by_role('button',name='Tentar novamente',exact=True).click();page.wait_for_function("document.querySelector('.search-status').textContent.includes('resultado')");results['search_retry']=True
 page.set_viewport_size({'width':390,'height':844});page.goto('http://127.0.0.1:8081/');page.locator('.erm-mobile-nav summary').click();assert page.locator('.erm-mobile-nav').get_attribute('open') is not None;page.keyboard.press('Escape');assert page.locator('.erm-mobile-nav').get_attribute('open') is None;results['mobile_escape']=True
 page.goto('http://127.0.0.1:8081/clientes');assert page.locator('.logo-grid figure').count()==14
 for route,section in [('/sobre/historia','historia'),('/sobre/missao','missao'),('/sobre/equipe','equipe'),('/servicos/auditorias','auditorias'),('/servicos/treinamentos','treinamentos')]:
  page.goto('http://127.0.0.1:8081'+route);page.wait_for_load_state('networkidle');page.wait_for_timeout(200)
  assert 90<=page.locator('#'+section).bounding_box()['y']<=200,route
 results['deep_links_clear_sticky_header']=True
 assert not errors,errors
 context.close()
 context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':844});page=context.new_page();page.goto('http://127.0.0.1:8081/');page.locator('.erm-mobile-nav summary').click();page.locator('.erm-mobile-nav a[href="/blog"]').click();assert page.locator('.entry-list article').count()==12
 page.locator('.pagination a[href="/blog/pagina/8"]').click();assert page.locator('.entry-list article').count()==6;results['no_js_blog_pagination']=True
 context.close();browser.close()
(out/'interactions.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({k:True for k in results}))
