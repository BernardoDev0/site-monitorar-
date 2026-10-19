"""Search Console helper for the Monitorar property (Portuguese interface).

Drives a Chrome that the property owner signed in to once, started with a dedicated profile and a local debug port:
  chrome.exe --user-data-dir=%USERPROFILE%\\.cache\\monitorar-seo-chrome --remote-debugging-port=9223 https://search.google.com/search-console
Commands:
  inspect URL...   index status, last crawl and canonicals of each URL (read-only)
  request URL...   inspect, then ask Google to index the URL (stops when the daily quota is exhausted)
  queries          top queries of the Performance report (read-only)
  verify-domain    domain property (DNS TXT, authorised by the owner on 19/10): print the TXT record to publish, or press VERIFICAR once it is in the DNS
With --property apex they work on the URL-prefix property https://monitorarconsultoria.com.br/ (verified by the HTML tag on 19/10);
with --property domain, on the domain property (needs the DNS TXT record).
"""
import argparse, json, re, sys
from datetime import datetime, timezone
from urllib.parse import quote
from playwright.sync_api import sync_playwright

PROPERTY = 'https://www.monitorarconsultoria.com.br/'
RES = quote(PROPERTY, safe='')
DOMAIN = 'monitorarconsultoria.com.br'
DOMAIN_RES = quote('sc-domain:' + DOMAIN, safe='')
APEX_RES = quote('https://' + DOMAIN + '/', safe='')
CDP = 'http://127.0.0.1:9223'
ICONS = re.compile(r'[-]')
FIELDS = ['Último rastreamento', 'Rastreada como', 'O rastreamento é permitido?', 'Busca de página', 'A indexação é permitida?',
          'URL canônico declarado pelo usuário', 'URL canônico selecionado pelo Google']


def page_text(page):
    return ICONS.sub('', page.inner_text('body').split('PrivacidadeTermos', 1)[-1])


def open_inspection(context, url, resource=RES):
    page = context.new_page()
    page.goto(f'https://search.google.com/search-console?resource_id={resource}', wait_until='domcontentloaded', timeout=60000)
    box = page.locator('input[aria-label^="Inspecionar qualquer URL"]').first
    box.wait_for(timeout=30000)
    box.click(); box.fill(url); page.keyboard.press('Enter')
    heading = page.get_by_text('Indexação das páginas', exact=True).first  # no string eval: the page enforces Trusted Types
    heading.wait_for(timeout=120000)
    page.wait_for_timeout(1500)
    if 'Último rastreamento' not in page_text(page):  # indexed URLs start collapsed, excluded ones expanded
        heading.click(timeout=10000)
        page.wait_for_timeout(1500)
    return page


def parse_inspection(url, text):
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    value = lambda label: next((lines[i + 1] for i, l in enumerate(lines[:-1]) if l == label), None)
    verdict = next((l for l in lines if l.startswith('O URL ')), None)
    coverage = next((lines[i + 1] for i, l in enumerate(lines[:-1]) if l == 'Indexação das páginas'), None)
    return {'url': url, 'verdict': verdict, 'coverage': coverage, **{f: value(f) for f in FIELDS}}


def inspect(context, url, resource=RES):
    page = open_inspection(context, url, resource)
    try:
        return parse_inspection(url, page_text(page))
    finally:
        page.close()


def request_indexing(context, url, resource=RES):
    page = open_inspection(context, url, resource)
    result = {'url': url}
    try:
        result.update(parse_inspection(url, page_text(page)))
        page.get_by_text(re.compile(r'^\s*solicitar indexação\s*$', re.I)).first.click(timeout=15000)  # shown in capitals by CSS only
        # Poll the visible text: a locator wait can latch onto a hidden element that carries the same words.
        outcome = re.compile(r'Indexação solicitada|[Cc]ota|excedeu|Falha|[Nn]ão foi possível')
        for _ in range(120):
            dialog = re.sub(r'\s+', ' ', page_text(page))
            if outcome.search(dialog):
                break
            page.wait_for_timeout(2000)
        else:
            raise TimeoutError('no confirmation dialog within 240 s')
        result['requested'] = 'Indexação solicitada' in dialog
        result['quotaExceeded'] = bool(re.search(r'[Cc]ota|excedeu', dialog)) and not result['requested']
        result['dialog'] = next((m.group(0) for m in re.finditer(r'(Indexação solicitada|[^.]*[Cc]ota[^.]*|Falha[^.]*|[Nn]ão foi possível[^.]*)\.?[^.]*\.', dialog)), dialog[:200])
        try:
            page.get_by_role('button', name=re.compile('Dispensar|Entendi|OK', re.I)).first.click(timeout=4000)
        except Exception:
            pass
    except Exception as error:
        result.update(requested=False, error=type(error).__name__ + ': ' + str(error)[:200])
    finally:
        page.close()
    return result


def verify_domain(context, press_verify):
    """Open the add-property dialog for the domain. Without press_verify it only reads the TXT record Google wants in the DNS;
    with it, it presses VERIFICAR and reports what Google answered."""
    page = context.new_page()
    try:
        page.goto('https://search.google.com/search-console/welcome', wait_until='domcontentloaded', timeout=60000)
        page.get_by_text('Adicionar um site', exact=True).first.click(timeout=30000)
        box = page.locator('input[aria-label="example.com"]:visible').first
        box.wait_for(timeout=30000)
        box.click(); box.fill(DOMAIN)
        page.locator('text=CONTINUAR').first.click()
        page.get_by_text('Verificar a propriedade do domínio', exact=False).first.wait_for(timeout=30000)
        page.wait_for_timeout(2000)
        record = next((v for v in (page.locator('input, textarea').nth(i).input_value() for i in range(page.locator('input, textarea').count())) if 'google-site-verification' in v), None)
        result = {'domain': DOMAIN, 'txt': record}
        if press_verify:
            page.get_by_text('VERIFICAR', exact=True).last.click()
            page.wait_for_timeout(15000)
            answer = re.sub(r'\s+', ' ', page_text(page))
            result['verified'] = bool(re.search(r'[Pp]ropriedade verificada|verificada com sucesso|Propriedade adicionada', answer))
            result['answer'] = answer[-300:]
        return result
    finally:
        page.close()


def top_queries(context):
    page = context.new_page()
    try:
        page.goto(f'https://search.google.com/search-console/performance/search-analytics?resource_id={RES}', wait_until='domcontentloaded', timeout=60000)
        page.get_by_text('Top consultas').first.wait_for(timeout=60000)
        page.wait_for_timeout(2000)
        text = page_text(page)
        totals = {k: m.group(1) for k, m in ((k, re.search(k + r'\n([\d.,%]+)', text)) for k in ('Total de cliques', 'Total de impressões', 'CTR média', 'Posição média')) if m}
        table = text.split('Top consultas', 1)[-1].split('Linhas por página')[0]
        rows = [re.split(r'\t+', l) for l in table.split('\n')[3:] if '\t' in l]
        return {'totals': totals, 'queries': [{'query': r[0], 'clicks': r[1], 'impressions': r[2]} for r in rows if len(r) >= 3]}
    finally:
        page.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['inspect', 'request', 'queries', 'verify-domain'])
    parser.add_argument('urls', nargs='*')
    parser.add_argument('--output')
    parser.add_argument('--property', choices=['www', 'apex', 'domain'], default='www')
    parser.add_argument('--press-verify', action='store_true', help='verify-domain: press VERIFICAR (only after the TXT record is published)')
    args = parser.parse_intermixed_args()  # options may sit between the command and the URLs
    report = {'capturedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'command': args.command, 'results': []}
    with sync_playwright() as p:
        context = p.chromium.connect_over_cdp(CDP).contexts[0]
        resource = {'www': RES, 'apex': APEX_RES, 'domain': DOMAIN_RES}[args.property]
        if args.command == 'queries':
            report['results'] = top_queries(context)
        elif args.command == 'verify-domain':
            report['results'] = verify_domain(context, args.press_verify)
            print(json.dumps(report['results'], ensure_ascii=False))
        else:
            for url in args.urls:
                outcome = (request_indexing if args.command == 'request' else inspect)(context, url, resource)
                report['results'].append(outcome)
                print(json.dumps(outcome, ensure_ascii=False), flush=True)
                if outcome.get('quotaExceeded'):
                    break
    if args.output:
        json.dump(report, open(args.output, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    elif args.command == 'queries':
        print(json.dumps(report['results'], ensure_ascii=False, indent=1))
