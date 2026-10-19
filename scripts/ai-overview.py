"""Is Monitorar cited in Google's AI Overview ("Visão geral criada por IA")?

For each phrase it reads the non-personalised results page (peek_pws=0) in the Chrome of scripts/gsc.py, finds the AI Overview,
and records the domains it cites and whether monitorarconsultoria.com.br is one of them, next to Monitorar's organic position.
Paced and resumable; on a captcha it stops and puts the captcha on the owner's screen (scripts/captcha_window.py).
"""
import argparse, csv, json, random, sys, time
from datetime import datetime, timezone
from urllib.parse import quote, urlparse
from playwright.sync_api import sync_playwright
import captcha_window

CDP = 'http://127.0.0.1:9223'
DOMAIN = 'monitorarconsultoria.com.br'
PHRASES = ['emissões fugitivas', 'emissões fugitivas RJ', 'o que é LDAR', 'LDAR', 'monitoramento de emissões fugitivas', 'consultoria ambiental',
           'consultoria ambiental RJ', 'engenharia ambiental RJ', 'consultoria ambiental São Paulo', 'consultoria ambiental Amazonas',
           'empresa de engenharia ambiental', 'empresa de consultoria ambiental']
AI = """() => {
  const header = [...document.querySelectorAll('div,span,h1,h2')].find(e => !e.children.length && /Visão geral criada por IA|AI Overview/.test(e.textContent));
  if (!header) return {present: false, hrefs: []};
  let box = header;
  for (let i = 0; i < 9 && box.parentElement; i++) { box = box.parentElement; if (box.querySelectorAll('a[href^="http"]').length >= 3) break; }
  const hrefs = [...box.querySelectorAll('a[href^="http"]')].map(a => a.href);
  return {present: true, hrefs: [...new Set(hrefs)].slice(0, 40)};
}"""
ORGANIC = """() => {
  const out = [], seen = new Set();
  for (const a of document.querySelectorAll('#search a:has(h3), #rso a:has(h3)')) {
    const h = a.href;
    if (!h.startsWith('http') || /google\.[a-z.]+\/(search|url|imgres)/.test(h) || seen.has(h)) continue;
    seen.add(h); out.push(h);
  }
  return out;
}"""


def check(page, phrase):
    url = 'https://www.google.com/search?q=' + quote(phrase) + '&hl=pt-BR&gl=br&peek_pws=0'
    page.goto(url, wait_until='domcontentloaded', timeout=60000)
    page.wait_for_timeout(3500)
    if '/sorry/' in page.url:
        return None, url
    body = page.inner_text('body')
    if 'Os resultados não são personalizados' not in body:
        return {'error': 'not confirmed as non-personalised'}, url
    ai = page.evaluate(AI)
    cited = sorted({urlparse(h).netloc.replace('www.', '') for h in ai['hrefs'] if 'google.' not in urlparse(h).netloc})
    organic = [urlparse(u).netloc for u in page.evaluate(ORGANIC)]
    position = next((i + 1 for i, n in enumerate(organic) if DOMAIN in n), '')
    return {'ai_present': ai['present'], 'monitorar_cited': any(DOMAIN in d for d in cited), 'cited_domains': ' | '.join(cited), 'organic_position': position}, url


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True)
    parser.add_argument('--limit', type=int, default=0)
    parser.add_argument('--pause', type=float, default=45.0)
    parser.add_argument('phrases', nargs='*')
    args = parser.parse_args()
    todo = args.phrases or PHRASES
    fields = ['checked_at', 'phrase', 'ai_present', 'monitorar_cited', 'organic_position', 'cited_domains']
    stopped = False
    with open(args.output, 'a', encoding='utf-8', newline='') as handle, sync_playwright() as p:
        writer = csv.DictWriter(handle, fieldnames=fields)
        if handle.tell() == 0:
            writer.writeheader()
        context = p.chromium.connect_over_cdp(CDP).contexts[0]
        for phrase in todo[:args.limit or None]:
            page = context.new_page()
            try:
                result, url = check(page, phrase)
            finally:
                page.close()
            if result is None:
                print('CAPTCHA: putting it on the owner\'s screen; solve it, then rerun', flush=True)
                captcha_window.show(url)
                stopped = True
                break
            if 'error' in result:
                print('SKIP', phrase, result['error'], flush=True)
                continue
            writer.writerow({'checked_at': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'phrase': phrase, **result})
            handle.flush()
            print(f"{phrase[:44]:44} AI={result['ai_present']!s:5} cited={result['monitorar_cited']!s:5} organic={result['organic_position'] or '-':>2} | {result['cited_domains'][:90]}", flush=True)
            time.sleep(args.pause + random.uniform(0, 8))
    sys.exit(2 if stopped else 0)
