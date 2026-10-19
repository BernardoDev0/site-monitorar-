"""Non-personalised Google position sweep for the Monitorar keyword map.

For every target page (the 90 articles and the commercial pages in docs/organic/seo-growth/keyword-map.csv, plus the owner's
priority phrases) it reads Google's first results page through the Chrome of scripts/gsc.py (debug port 9223) with
peek_pws=0, the parameter behind Google's own "Testar sem personalização" link. The footer must say the results are not
personalised; otherwise the reading is discarded. One page load per phrase, paced, resumable. A captcha stops the sweep
at once and is never bypassed.

Per phrase it records every Monitorar URL on the first page with its position, whether the intended page is among them,
and the first three competitors. Output: CSV (one row per phrase) that later sweeps can be compared against.
"""
import argparse, csv, json, random, re, sys, time
from datetime import datetime, timezone
from urllib.parse import quote, urlparse
from playwright.sync_api import sync_playwright

CDP = 'http://127.0.0.1:9223'
DOMAIN = 'monitorarconsultoria.com.br'
MAP = 'docs/organic/seo-growth/keyword-map.csv'
EXTRA = 'docs/organic/seo-growth/extra-queries.csv'  # generic head terms and state/city variants (target,kind,phrase)
# Phrases the owner named as the most important, aimed at the home page.
PRIORITY = [('/consultoria-ambiental-rj', 'consultoria ambiental RJ'), ('/consultoria-ambiental-rj', 'consultoria engenharia ambiental RJ')]
LINKS = """() => {
  const out = [], seen = new Set();
  for (const a of document.querySelectorAll('#search a:has(h3), #rso a:has(h3)')) {
    const h = a.href;
    if (!h.startsWith('http') || /google\\.[a-z.]+\\/(search|url|imgres)/.test(h) || seen.has(h)) continue;
    seen.add(h); out.push(h);
  }
  return out;
}"""


def phrases():
    seen, out = set(), []
    def add(url, phrase, kind):
        key = phrase.strip().lower()
        if key and key not in seen:
            seen.add(key); out.append({'target': url.split('#')[0] or '/', 'phrase': phrase.strip(), 'kind': kind})
    for url, phrase in PRIORITY:
        add(url, phrase, 'priority')
    with open(MAP, encoding='utf-8') as handle:
        for row in csv.DictReader(handle):
            if row['url'].startswith('/blog/'):
                add(row['url'], row['consulta_principal'], 'article')
            else:
                add(row['url'], row['consulta_principal'], 'commercial')
                for variation in [v for v in row['variacoes'].split(' | ') if v][:4]:
                    add(row['url'], variation, 'commercial')
    try:
        with open(EXTRA, encoding='utf-8') as handle:
            for row in csv.DictReader(handle):
                add(row['target'], row['phrase'], row['kind'])
    except FileNotFoundError:
        pass
    return out


def read(page, phrase):
    page.goto('https://www.google.com/search?q=' + quote(phrase) + '&hl=pt-BR&gl=br&peek_pws=0', wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(3000)
    if '/sorry/' in page.url:
        return None
    if 'Os resultados não são personalizados' not in page.inner_text('body'):
        return {'error': 'not confirmed as non-personalised'}
    links = page.evaluate(LINKS)
    ours = [{'position': i + 1, 'path': urlparse(u).path or '/'} for i, u in enumerate(links) if DOMAIN in urlparse(u).netloc]
    return {'read': len(links), 'ours': ours, 'top3': [urlparse(u).netloc.replace('www.', '') for u in links[:3]]}


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True, help='CSV path; existing rows are kept and their phrases skipped (resume)')
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--pause', type=float, default=11.0)
    parser.add_argument('--kind', choices=['all', 'priority', 'commercial', 'article', 'head', 'geo'], default='all')
    args = parser.parse_args()
    todo = [p for p in phrases() if args.kind in ('all', p['kind'])]
    done = set()
    try:
        with open(args.output, encoding='utf-8') as handle:
            done = {r['phrase'].lower() for r in csv.DictReader(handle)}
    except FileNotFoundError:
        pass
    todo = [p for p in todo if p['phrase'].lower() not in done]
    if args.limit:
        todo = todo[:args.limit]
    fields = ['checked_at', 'kind', 'target', 'phrase', 'read', 'target_position', 'best_position', 'ours', 'top3']
    new_file = not done
    stopped = False
    with open(args.output, 'a', encoding='utf-8', newline='') as handle, sync_playwright() as p:
        writer = csv.DictWriter(handle, fieldnames=fields)
        if new_file:
            writer.writeheader()
        context = p.chromium.connect_over_cdp(CDP).contexts[0]
        for item in todo:
            page = context.new_page()
            try:
                result = read(page, item['phrase'])
            finally:
                page.close()
            if result is None:
                print('CAPTCHA: stopping; rerun to resume', flush=True)
                stopped = True
                break
            if 'error' in result:
                print('SKIP', item['phrase'], result['error'], flush=True)
                continue
            ours = result['ours']
            on_target = [o['position'] for o in ours if o['path'].rstrip('/') == item['target'].rstrip('/')]
            writer.writerow({'checked_at': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'kind': item['kind'], 'target': item['target'],
                             'phrase': item['phrase'], 'read': result['read'], 'target_position': on_target[0] if on_target else '',
                             'best_position': min((o['position'] for o in ours), default=''), 'ours': json.dumps(ours, ensure_ascii=False),
                             'top3': ' | '.join(result['top3'])})
            handle.flush()
            print(f"{item['kind']:10} {item['phrase'][:52]:52} target={on_target[0] if on_target else '-'} best={min((o['position'] for o in ours), default='-')}", flush=True)
            time.sleep(args.pause + random.uniform(0, 5))
    sys.exit(2 if stopped else 0)
