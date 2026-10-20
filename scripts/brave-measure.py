"""Read-only snapshot of how Brave Search shows Monitorar: site: listing, topical query and brand query."""
import argparse, json, sys
from datetime import datetime, timezone
from urllib.parse import quote
from playwright.sync_api import sync_playwright

QUERIES = {'site': 'site:monitorarconsultoria.com.br', 'exact': 'monitorar consultoria emissoes', 'brand': 'monitorar consultoria'}
JS = """() => {
  const skip = /(search|cdn\.search|imgs\.search|tiles\.search)\.brave\.com|\/\/brave\.com|brave\.app|hackerone\.com/;
  const seen = new Set(), results = [];
  for (const a of document.querySelectorAll('main a[href^="http"], #results a[href^="http"]')) {
    if (skip.test(a.href)) continue; const h = a.href.split('#')[0]; if (seen.has(h)) continue;
    const text = a.innerText.replace(/\s+/g, ' ').trim(); if (text.length < 8) continue; seen.add(h); results.push({rank: results.length + 1, url: h, text: text.slice(0, 160)});
  }
  const fav = [...document.querySelectorAll('img.favicon')].find(i => i.src.includes('d3d3Lm1vbml0b3Jhcm')) || null;
  return {results, favicon: fav ? {w: fav.naturalWidth, h: fav.naturalHeight} : null, captcha: /captcha|unusual traffic/i.test(document.body.innerText)};
}"""

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
parser.add_argument('--headed', action='store_true', help='Brave answers headless browsers with a captcha')
parser.add_argument('phrases', nargs='*', help='phrases to read instead of the site:, exact and brand queries')
args = parser.parse_args()
if args.phrases:
    QUERIES = {phrase: phrase for phrase in args.phrases}
report = {'capturedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'engine': 'search.brave.com', 'queries': {}}
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome', headless=not args.headed)
    context = browser.new_context(locale='pt-BR')
    for name, query in QUERIES.items():
        page = context.new_page()
        page.goto('https://search.brave.com/search?q=' + quote(query) + '&source=web', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(3500)
        data = page.evaluate(JS)
        ours = [r for r in data['results'] if 'monitorarconsultoria.com.br' in r['url']]
        webonly = [r for r in data['results'] if 'youtube.com/watch' not in r['url']]
        report['queries'][name] = {'query': query, 'blockedByCaptcha': data['captcha'], 'linksRead': len(data['results']), 'monitorarResults': ours,
            'monitorarRankExcludingVideos': next((i + 1 for i, r in enumerate(webonly) if 'monitorarconsultoria.com.br' in r['url']), None), 'favicon': data['favicon'], 'firstLinks': [r['url'] for r in data['results'][:6]]}
        page.close()
    browser.close()
json.dump(report, open(args.output, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps({k: {x: v[x] for x in ('blockedByCaptcha', 'linksRead', 'monitorarResults', 'monitorarRankExcludingVideos', 'favicon')} for k, v in report['queries'].items()}, ensure_ascii=False, indent=1))
