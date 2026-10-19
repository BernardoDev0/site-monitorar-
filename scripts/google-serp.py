"""Read Google's first results page for one phrase and report where monitorarconsultoria.com.br appears.

Uses the Chrome started for scripts/gsc.py (debug port 9223). Modes:
  neutral  the signed-in profile followed by Google's own "Testar sem personalização" link (peek_pws=0). The page footer then
           says the results are not personalised, and no captcha appears. This is the primary measure.
  signed   the same profile with the ordinary results. Personalised: Google favours sites the account visits, so it overstates.
  clean    an isolated context with no cookies. Closer to a stranger but Google often answers with a captcha, which is reported
           as blocked and never bypassed.
  default  signed + neutral.
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


def read(context, phrase, neutral=False):
    page = context.new_page()
    try:
        page.goto('https://www.google.com/search?q=' + quote(phrase) + '&hl=pt-BR&gl=br', wait_until='domcontentloaded', timeout=60000)
        page.wait_for_timeout(3500)
        if neutral and '/sorry/' not in page.url:
            link = page.locator('a:has-text("Testar sem personalização")').first
            if not link.count():
                return {'phrase': phrase, 'blocked': False, 'error': 'link "Testar sem personalização" not found'}
            href = link.get_attribute('href')
            page.goto(href if href.startswith('http') else 'https://www.google.com' + href, wait_until='domcontentloaded', timeout=60000)
            page.wait_for_timeout(3500)
        if '/sorry/' in page.url:
            return {'phrase': phrase, 'blocked': True}
        links = page.evaluate(LINKS)
        footer = page.inner_text('body')
        ours = [{'position': i + 1, 'path': urlparse(l['url']).path, 'title': l['title']} for i, l in enumerate(links) if DOMAIN in l['url']]
        return {'phrase': phrase, 'blocked': False, 'personalised': 'Os resultados são personalizados' in footer,
                'linksRead': len(links), 'monitorar': ours, 'top': [urlparse(l['url']).netloc + urlparse(l['url']).path[:50] for l in links[:10]]}
    finally:
        page.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('phrase')
    parser.add_argument('--mode', choices=['neutral', 'signed', 'clean', 'default'], default='default')
    parser.add_argument('--output')
    args = parser.parse_args()
    report = {'capturedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'phrase': args.phrase, 'readings': {}}
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP)
        if args.mode in ('signed', 'default'):
            report['readings']['signed'] = read(browser.contexts[0], args.phrase)
        if args.mode in ('neutral', 'default'):
            report['readings']['neutral'] = read(browser.contexts[0], args.phrase, neutral=True)
        if args.mode == 'clean':
            clean = browser.new_context(locale='pt-BR')
            try:
                report['readings']['clean'] = read(clean, args.phrase)
            finally:
                clean.close()
    text = json.dumps(report, ensure_ascii=False, indent=1)
    if args.output:
        open(args.output, 'w', encoding='utf-8').write(text)
    print(json.dumps({k: {x: v[x] for x in ('blocked', 'personalised', 'monitorar', 'error') if x in v} for k, v in report['readings'].items()}, ensure_ascii=False))
    primary = report['readings'].get('neutral') or report['readings'].get('clean')
    sys.exit(0 if not primary or (not primary['blocked'] and 'error' not in primary) else 2)
