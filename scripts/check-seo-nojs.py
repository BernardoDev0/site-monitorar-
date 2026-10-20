"""Confirm actual readable content in Chrome with JavaScript completely disabled."""
import argparse,json
from pathlib import Path
from playwright.sync_api import sync_playwright

parser=argparse.ArgumentParser()
parser.add_argument('--base',default='http://127.0.0.1:4173')
parser.add_argument('--output',required=True)
args=parser.parse_args()
docs=json.loads(Path('content/published.json').read_text(encoding='utf-8'))['current']
routes=['/','/blog','/blog/pagina/8','/blog/emissoes-fugitivas-petrobras','/blog/o-que-e-ldar']
results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome')
    page=browser.new_page(java_script_enabled=False)
    for route in routes:
        response=page.goto(args.base+route,wait_until='domcontentloaded')
        assert response.status==200
        assert page.locator('h1').count()==1 and page.locator('h1').is_visible()
        assert page.locator('link[rel="canonical"]').get_attribute('href')=='https://www.monitorarconsultoria.com.br'+route
        assert 'noindex' not in page.locator('meta[name="robots"]').get_attribute('content')
        text=' '.join(page.locator('main').inner_text().split())
        if route=='/':
            for value in ['16 Anos de experiência','800% Crescimento','33ª Colocação ranking Exame','100+ Clientes atendidos']: assert value in text
        if route in docs:
            for section in docs[route]['body']:
                for value in [section['heading']]+section['paragraphs']:assert ' '.join(value.split()) in text
        results.append({'route':route,'status':response.status,'h1':page.locator('h1').inner_text(),'visibleTextCharacters':len(text),'canonical':True})
    browser.close()
report={'base':args.base,'javascriptEnabled':False,'results':results}
output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'checked':len(results),'passed':True}))
