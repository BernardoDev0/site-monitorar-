"""Local interaction evidence for V4.1, without external submissions."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
OUT=Path('docs/organic/v4.1/evidence/browser');OUT.mkdir(parents=True,exist_ok=True)
checks=[]
def checked(name,condition):
 checks.append({'name':name,'pass':bool(condition)})
 (OUT/'interactions.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2),encoding='utf8')
 assert condition,name
with sync_playwright() as p:
 browser=p.chromium.launch(channel='chrome',headless=True)
 page=browser.new_page(viewport={'width':1440,'height':950},reduced_motion='reduce')
 page.goto('http://127.0.0.1:8081/blog');page.wait_for_load_state('networkidle')
 for label in ['Sobre','Serviços','Blog']:
  trigger=page.locator(f'.erm-desktop-nav summary[aria-label="Abrir submenu {label}"]')
  trigger.hover();page.wait_for_timeout(250)
  checked('hover '+label,page.locator('.erm-desktop-nav details[open]').count()==1)
  panel=page.locator('.erm-desktop-nav details[open] .erm-dropdown')
  panel.locator('a').last.hover();page.wait_for_timeout(250)
  checked('cross into panel '+label,panel.is_visible())
  page.mouse.move(5,850);page.wait_for_timeout(250)
  checked('leave '+label,page.locator('.erm-desktop-nav details[open]').count()==0)
 trigger=page.locator('.erm-desktop-nav summary[aria-label="Abrir submenu Blog"]')
 # Keyboard focus opens; escape must leave it closed, with the focus restored.
 trigger.focus();page.wait_for_timeout(50);trigger.press('Enter')
 if not page.locator('.erm-desktop-nav details[open]').count():trigger.press('Enter')
 checked('keyboard open',page.locator('.erm-desktop-nav details[open]').count()==1)
 page.keyboard.press('Tab');checked('tab into panel',page.evaluate("!!document.activeElement.closest('.erm-dropdown')"))
 page.keyboard.press('Escape');page.wait_for_timeout(200)
 checked('escape returns focus and closes',trigger.evaluate('(e)=>e===document.activeElement') and page.locator('.erm-desktop-nav details[open]').count()==0)
 trigger.hover();page.wait_for_timeout(250);page.mouse.click(5,700);page.wait_for_timeout(200)
 checked('outside click',page.locator('.erm-desktop-nav details[open]').count()==0)
 page.goto('http://127.0.0.1:8081/blog/pagina/8');page.wait_for_load_state('networkidle')
 checked('last page has six unique cards',page.locator('.editorial-card').count()==6 and len(set(page.locator('.editorial-card h2 a').evaluate_all('(links)=>links.map(a=>a.pathname)')))==6)
 page.set_viewport_size({'width':390,'height':844})
 page.goto('http://127.0.0.1:8081/blog');page.wait_for_load_state('networkidle')
 page.locator('.erm-mobile-nav>summary').click();page.locator('.erm-mobile-group summary[aria-label="Abrir submenu Blog"]').click()
 checked('mobile blog opens',page.locator('.erm-mobile-group[open] .erm-mobile-subnav a').count()==12)
 page.screenshot(path=str(OUT/'menu-blog-390.png'))
 page.keyboard.press('Escape');page.keyboard.press('Escape')
 checked('nested mobile escape',page.locator('.erm-mobile-nav[open]').count()==0)
 page.goto('http://127.0.0.1:8081/blog/o-que-sao-emissoes-fugitivas');page.wait_for_load_state('networkidle')
 checked('mobile toc collapsed',not page.locator('.article-toc').evaluate('(e)=>e.open'))
 page.locator('.article-toc>summary').click();page.locator('.article-toc a').nth(1).click()
 checked('toc navigation',page.evaluate('location.hash')=='#secao-2')
 page.set_viewport_size({'width':1440,'height':950});page.goto('http://127.0.0.1:8081/blog');page.wait_for_load_state('networkidle')
 page.evaluate('document.body.style.zoom=2');checked('zoom 200 percent no overflow',not page.evaluate('document.documentElement.scrollWidth>innerWidth'))
 context=browser.new_context(java_script_enabled=False,viewport={'width':1440,'height':950});nojs=context.new_page()
 nojs.goto('http://127.0.0.1:8081/blog');nojs.locator('.erm-desktop-nav summary[aria-label="Abrir submenu Blog"]').click()
 checked('no js disclosure',nojs.locator('.erm-desktop-nav details[open]').count()==1)
 nojs.locator('.pagination a').last.click();checked('no js pagination',nojs.locator('.editorial-card').count()==6)
 browser.close()
print(json.dumps(checks,ensure_ascii=False))
