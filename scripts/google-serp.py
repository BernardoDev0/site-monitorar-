"""Read Google's first results page for one phrase and report where monitorarconsultoria.com.br appears.

Uses the Chrome started for scripts/gsc.py (debug port 9223). Modes:
  neutral  the signed-in profile followed by Google's own "Testar sem personalização" link (peek_pws=0). The page footer then
           says the results are not personalised, and no captcha appears. This is the primary measure.
  signed   the same profile with the ordinary results. Personalised: Google favours sites the account visits, so it overstates.
  clean    an isolated context with no cookies. Closer to a stranger but Google often answers with a captcha, which is reported
           as blocked and never bypassed.
  default  signed + neutral.
The first page is the ~10 organic links read; a position is the rank among them (AI Overview and ads excluded).
With --shots DIR, each Monitorar result is also saved as an image, and the site icon Google shows next to it is hashed:
the globe placeholder keeps one hash while the icon is missing, and the hash changes when Google starts showing the logo.
"""
import argparse, hashlib, json, os, sys
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


# For each Monitorar result: the small image Google shows as the site icon in the same result block.
ICONS = """(domain) => {
  const out = [];
  for (const a of document.querySelectorAll('#search a:has(h3), #rso a:has(h3)')) {
    if (!a.href.includes(domain)) continue;
    // The result block: the outermost ancestor that still holds only this result's title.
    let box = a;
    while (box.parentElement && box.parentElement.querySelectorAll('h3').length === 1) box = box.parentElement;
    const small = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.width <= 32 && r.height <= 32; };
    const img = [...box.querySelectorAll('img')].find(small);
    const svg = img ? null : [...box.querySelectorAll('svg')].find(small);
    out.push({href: a.href, icon: img ? img.src : (svg ? 'svg:' + svg.outerHTML : null), kind: img ? 'img' : (svg ? 'svg' : null)});
  }
  return out;
}"""


def icons(page, shots, label):
    found = []
    for i, item in enumerate(page.evaluate(ICONS, DOMAIN)):
        entry = {'path': urlparse(item['href']).path, 'iconKind': item['kind'], 'iconHash': hashlib.sha1(item['icon'].encode()).hexdigest()[:12] if item['icon'] else None}
        if shots:
            os.makedirs(shots, exist_ok=True)
            block = page.locator('#search a[href="' + item['href'] + '"]').first.locator('xpath=ancestor::div[count(.//h3)=1][last()]')
            try:
                name = os.path.join(shots, f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M')}-{label}-{i + 1}.png")
                block.screenshot(path=name)
                entry['shot'] = name
            except Exception as error:
                entry['shotError'] = type(error).__name__
        found.append(entry)
    return found


def read(context, phrase, neutral=False, shots=None):
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
                'linksRead': len(links), 'monitorar': ours, 'icons': icons(page, shots, 'neutral' if neutral else 'signed'),
                'top': [urlparse(l['url']).netloc + urlparse(l['url']).path[:50] for l in links[:10]]}
    finally:
        page.close()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('phrase')
    parser.add_argument('--mode', choices=['neutral', 'signed', 'clean', 'default'], default='default')
    parser.add_argument('--output')
    parser.add_argument('--shots', help='folder for images of the Monitorar results, to see the icon Google shows')
    args = parser.parse_args()
    report = {'capturedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'phrase': args.phrase, 'readings': {}}
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(CDP)
        if args.mode in ('signed', 'default'):
            report['readings']['signed'] = read(browser.contexts[0], args.phrase, shots=args.shots)
        if args.mode in ('neutral', 'default'):
            report['readings']['neutral'] = read(browser.contexts[0], args.phrase, neutral=True, shots=args.shots)
        if args.mode == 'clean':
            clean = browser.new_context(locale='pt-BR')
            try:
                report['readings']['clean'] = read(clean, args.phrase)
            finally:
                clean.close()
    text = json.dumps(report, ensure_ascii=False, indent=1)
    if args.output:
        open(args.output, 'w', encoding='utf-8').write(text)
    print(json.dumps({k: {x: v[x] for x in ('blocked', 'personalised', 'monitorar', 'icons', 'error') if x in v} for k, v in report['readings'].items()}, ensure_ascii=False))
    primary = report['readings'].get('neutral') or report['readings'].get('clean')
    sys.exit(0 if not primary or (not primary['blocked'] and 'error' not in primary) else 2)
