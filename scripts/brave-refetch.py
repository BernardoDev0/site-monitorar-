"""Ask Brave Search to re-fetch Monitorar pages through its public form (https://search.brave.com/submit-url).

The form's proof-of-work captcha is solved by the browser. Only URLs listed in the live sitemap are accepted,
submissions are sequential and paced, and the run stops at the first rejection or rate limit.
"""
import argparse, json, re, sys, time, urllib.request
from datetime import datetime, timezone
from playwright.sync_api import sync_playwright

ORIGIN = 'https://www.monitorarconsultoria.com.br'
PRIORITY = [
    '/', '/servicos/emissoes-fugitivas', '/conteudos/emissoes-fugitivas', '/emissoes-fugitivas',
    '/blog/o-que-e-ldar', '/servicos', '/sobre', '/contato', '/blog', '/conteudos', '/servicos/drager',
    '/servicos/ruido-extramuros', '/servicos/hazop', '/servicos/seguranca',
    '/conteudos/qualidade-do-ar', '/conteudos/ruido-ambiental', '/conteudos/areas-impactadas',
    '/conteudos/licenciamento-ambiental', '/conteudos/seguranca-de-processos-e-gestao-sms', '/conteudos/hazop',
    '/conteudos/treinamentos', '/conteudos/equipamentos',
]

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
parser.add_argument('--skip', nargs='*', default=[], help='paths already submitted')
parser.add_argument('--paths', nargs='*', default=None, help='submit these paths instead of the priority list')
parser.add_argument('--pause', type=float, default=8.0)
parser.add_argument('--headed', action='store_true')
args = parser.parse_args()

sitemap = urllib.request.urlopen(ORIGIN + '/sitemap.xml', timeout=20).read().decode('utf-8')
# /sitemap.xml is an index of the page, post and category sitemaps.
for child in re.findall(r'<sitemap><loc>(.*?)</loc>', sitemap):
    sitemap += urllib.request.urlopen(child, timeout=20).read().decode('utf-8')
live = set(re.findall(r'<url><loc>(.*?)</loc>', sitemap))
queue = [p for p in (args.paths if args.paths is not None else PRIORITY) if p not in args.skip]
unknown = [p for p in queue if (ORIGIN + p if p != '/' else ORIGIN + '/') not in live]
if unknown:
    sys.exit('Not in the live sitemap: ' + ', '.join(unknown))

results, failed = [], False
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=not args.headed)
    for index, path in enumerate(queue):
        url = ORIGIN + path
        entry = {'url': url, 'at': datetime.now(timezone.utc).isoformat(timespec='seconds')}
        page = browser.new_page()
        try:
            page.goto('https://search.brave.com/submit-url', wait_until='domcontentloaded')
            page.fill('#url', url)
            with page.expect_response(lambda r: '/api/fetcher' in r.url, timeout=180000) as response_info:
                page.click('button[name="captcha-button"]')
            response = response_info.value
            entry['httpStatus'] = response.status
            page.wait_for_function('document.body.innerText.includes("Success") || document.body.innerText.toLowerCase().includes("error")', timeout=30000)
            entry['message'] = ' '.join(page.inner_text('body').split())[:200]
            entry['accepted'] = response.status == 200 and 'Success' in entry['message']
        except Exception as error:
            entry.update(accepted=False, error=type(error).__name__ + ': ' + str(error)[:300])
        finally:
            page.close()
        results.append(entry)
        with open(args.output, 'w', encoding='utf-8') as handle:
            json.dump({'engine': 'search.brave.com/submit-url', 'results': results}, handle, ensure_ascii=False, indent=1)
        print(json.dumps(entry, ensure_ascii=False), flush=True)
        if not entry['accepted']:
            failed = True
            break
        if index < len(queue) - 1:
            time.sleep(args.pause)
    browser.close()
sys.exit(1 if failed else 0)
