"""Read Google's first results page for one phrase and report where monitorarconsultoria.com.br appears.

Uses the Chrome started for scripts/gsc.py (debug port 9223):
  signed  the owner's signed-in profile. Personalised: Google boosts sites the account visits, so this reading overstates the ranking.
  clean   an isolated browser context with no cookies. Closer to what a stranger sees, but Google may answer with a captcha;
          that is reported as blocked and never bypassed.
The first page is the ~10 organic links read; a position is the rank among them (AI Overview and ads excluded).
"""
import argparse, json, sys
from datetime import datetime, timezone
from urllib.parse import quote, urlparse
from playwright.sync_api import sync_playwright

CDP = 'http://127.0.0.1:9223'
DOMAIN = 'monitorarconsultoria.com.br'
LINKS = """() => {
  const out = [], seen = new Set();
  for (const a of document.querySelectorAll('#search a:has(h3), #rso a:has(h3)')) {
    const h = a.href;
    if (!h.startsWith('http') || /google\\.[a-z.]+\\/(search|url|imgres)/.test(h) || seen.has(h)) continue;
    seen.add(h); out.push({url: h, title: a.querySelector('h3').innerText.slice(0, 110)});
  }
  return out;
}"""


def read(context, phrase):
    page = context.new_page()
    try:
        page.goto('https://www.google.com/search?q=' + quote(phrase) + '&hl=pt-BR&gl=br', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(3500)
        if '/sorry/' in page.url:
            return {'phrase': phrase, 'blocked': True}
        links = page.evaluate(LINKS)
        ours = [{'position': i + 1, 'path': urlparse(l['url']).path, 'title': l['title']} for i, l in enumerate(links) if DOMAIN in l['url']]
        return {'phrase': phrase, 'blocked': False, 'linksRead': len(links), 'monitorar': ours, 'top': [urlparse(l['url']).netloc + urlparse(l['url']).path[:50] for l in links[:10]]}
    finally:
        page.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('phrase')
    parser.add_argument('--mode', choices=['signed', 'clean', 'both'], default='both')
    parser.add_argument('--output')
    args = parser.parse_args()
    report = {'capturedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'phrase': args.phrase, 'readings': {}}
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP)
        if args.mode in ('signed', 'both'):
            report['readings']['signed'] = read(browser.contexts[0], args.phrase)
        if args.mode in ('clean', 'both'):
            clean = browser.new_context(locale='pt-BR')
            try:
                report['readings']['clean'] = read(clean, args.phrase)
            finally:
                clean.close()
    text = json.dumps(report, ensure_ascii=False, indent=1)
    if args.output:
        open(args.output, 'w', encoding='utf-8').write(text)
    print(json.dumps({k: {x: v[x] for x in ('blocked', 'monitorar') if x in v} for k, v in report['readings'].items()}, ensure_ascii=False))
    clean = report['readings'].get('clean')
    sys.exit(0 if not clean or not clean['blocked'] else 2)
