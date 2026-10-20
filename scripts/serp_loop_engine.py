"""SEO loop engine: Google position of the target phrases and the gap between our pillar and the top 3, every cycle.

  .venv-seo/Scripts/python -I scripts/serp_loop_engine.py selftest
  .venv-seo/Scripts/python -I scripts/serp_loop_engine.py run
"""
import argparse, importlib.util, json, os, re, statistics, sys, tempfile, time
from collections import Counter
from datetime import datetime, timedelta, timezone
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from serp_reverse_engineer import STOP, Client, count_term, jsonld_types, main_text, plain, soup_of  # noqa: E402

ORIGIN = 'https://www.monitorarconsultoria.com.br'
DOMAIN = 'monitorarconsultoria.com.br'
PHRASES = ['emissões fugitivas', 'consultoria ambiental', 'consultoria ambiental RJ', 'empresa de engenharia ambiental']
# Phrase -> our pillar and the exact anchors that should point at it (docs/organic/reverse-engineering/hub-spoke.md).
PILLARS = {'emissoes fugitivas': ('/emissoes-fugitivas', ['emissões fugitivas', 'guia completo de emissões fugitivas: o que são, fontes, detecção, ldar e normas']),
           'consultoria ambiental': ('/', ['consultoria ambiental', 'empresa de engenharia e consultoria ambiental']),
           'consultoria ambiental rj': ('/consultoria-ambiental-rj', ['consultoria ambiental rj', 'consultoria ambiental no rj']),
           'empresa de engenharia ambiental': ('/', ['empresa de engenharia ambiental', 'empresa de engenharia e consultoria ambiental'])}
# Terms the niche's pages share; a term counts once any of its spellings appears.
NICHE = [('LDAR', ['ldar']), ('EPA Method 21', ['method 21', 'metodo 21']), ('CONAMA', ['conama']), ('IBAMA', ['ibama']), ('INEA', ['inea']),
         ('CETESB', ['cetesb']), ('licenciamento ambiental', ['licenciamento ambiental']),
         ('monitoramento atmosférico', ['monitoramento atmosferico', 'qualidade do ar']),
         ('COV/VOC', ['cov', 'covs', 'voc', 'vocs', 'compostos organicos volateis']), ('OGI', ['ogi', 'camera optica']), ('Dräger', ['drager', 'draeger'])]
LEDGER = 'docs/organic/google-first-page/evidence/engine/readings.jsonl'
OUT = 'docs/organic/google-first-page/evidence/engine'


# ---------- measures (covered by selftest) ----------

def phrase_by_region(html, phrase):
    """Occurrences of the phrase in the title, each heading level, the paragraphs and the alt/title attributes."""
    soup = soup_of(html)
    text = lambda tags: ' '.join(t.get_text(' ') for t in soup.find_all(tags))
    regions = {'title': soup.title.get_text(' ') if soup.title else '', 'h1': text('h1'), 'h2': text('h2'), 'h3': text('h3'), 'p': text('p'),
               'alt': ' '.join(t.get('alt', '') + ' ' + t.get('title', '') for t in soup.find_all(attrs={'alt': True}) + soup.find_all(attrs={'title': True}) if t.name != 'title')}
    return {region: count_term(value, phrase) for region, value in regions.items()}


def ngrams(text, n):
    """n-word sequences of the text, without accents or case, never starting or ending on a stopword."""
    words = re.findall(r'\w+', plain(text))
    grams = Counter()
    for i in range(len(words) - n + 1):
        gram = words[i:i + n]
        if gram[0] in STOP or gram[-1] in STOP or any(w.isdigit() for w in gram):
            continue
        grams[' '.join(gram)] += 1
    return grams


def niche_terms(text):
    return {label: sum(count_term(text, spelling) for spelling in spellings) for label, spellings in NICHE}


def gap(ours, rivals):
    """What at least two of the top 3 have and our pillar lacks."""
    most = lambda has: sum(1 for r in rivals if has(r)) >= 2
    return {'missingTerms': [t for t, n in ours['terms'].items() if not n and most(lambda r: r['terms'].get(t))],
            'regionsMissing': [k for k, n in ours['regions'].items() if not n and most(lambda r: r['regions'].get(k))],
            'missingBigrams': sorted({g for r in rivals for g in r['bigrams'] if g not in ours['bigrams'] and most(lambda x: g in x['bigrams'])}),
            'wordsOurs': ours['words'], 'wordsTop3Median': int(statistics.median([r['words'] for r in rivals])) if rivals else None}


def internal_inbound(dist, target, anchors):
    """Pages of the build that link to `target` with one of the exact anchors, and how many such links."""
    wanted = {plain(a) for a in anchors}
    pages = links = 0
    for root, _, files in os.walk(dist):
        for name in files:
            if not name.endswith('.html'):
                continue
            soup = soup_of(open(os.path.join(root, name), encoding='utf-8').read())
            found = sum(1 for a in soup.find_all('a', href=True) if a['href'] in (target, ORIGIN + target) and plain(a.get_text(' ')) in wanted)
            pages += bool(found)
            links += found
    return {'pages': pages, 'links': links}


def _within(ledger, now, hours):
    limit = datetime.fromisoformat(now) - timedelta(hours=hours)
    return [e for e in ledger if datetime.fromisoformat(e['at']) > limit]


def n_of_m(ledger, phrase, now):
    """Readings of the last 24 h: how many had us on page 1, the best position and the last two positions."""
    readings = sorted((e for e in _within(ledger, now, 24) if plain(e['phrase']) == plain(phrase) and not e.get('blocked') and e.get('mode', 'peek') == 'peek'),
                      key=lambda e: e['at'])
    positions = [e.get('position') for e in readings]
    on = [p for p in positions if p is not None and p <= 10]
    return {'onPage1': len(on), 'readings': len(readings), 'best': min(on) if on else None, 'lastTwo': positions[-2:]}


def budget(ledger, now):
    return {'queries3h': len(_within(ledger, now, 3)), 'captcha6h': any(e.get('blocked') for e in _within(ledger, now, 6))}


# ---------- run ----------

def load_ledger(path):
    if not os.path.exists(path):
        return []
    return [json.loads(line) for line in open(path, encoding='utf-8') if line.strip()]


def google_reader():
    spec = importlib.util.spec_from_file_location('google_serp', os.path.join(HERE, 'google-serp.py'))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def features(client, url, phrase):
    answer = client.get(url)
    if answer['status'] != 200:
        return {'url': url, 'status': answer['status'], 'error': answer.get('error')}
    from serp_reverse_engineer import decode
    html = decode(answer['body'])
    text = main_text(html)
    return {'url': url, 'status': 200, 'ttfb': answer.get('elapsed'), 'kb': round(len(answer['body']) / 1024, 1), 'words': len(text.split()),
            'regions': phrase_by_region(html, phrase), 'terms': niche_terms(text), 'jsonld': jsonld_types(html),
            'bigrams': [g for g, _ in ngrams(text, 2).most_common(25)], 'trigrams': [g for g, _ in ngrams(text, 3).most_common(15)]}


def run(args):
    now = datetime.now(timezone.utc).isoformat(timespec='seconds')
    ledger = load_ledger(args.ledger)
    state = budget(ledger, now)
    if state['captcha6h']:
        print(json.dumps({'stopped': 'captcha in the last 6 h', **state}))
        return 3
    phrases = args.phrases[:max(0, args.max_queries - state['queries3h'])]
    if not phrases:
        print(json.dumps({'stopped': 'query budget used', **state}))
        return 3
    readings = []
    folder = os.path.join(args.out, now.replace(':', '').replace('+0000', 'Z').replace('-', ''))
    if not args.no_google:
        from playwright.sync_api import sync_playwright
        reader = google_reader()
        with sync_playwright() as p:
            context = p.chromium.connect_over_cdp(reader.CDP).contexts[0]
            for i, phrase in enumerate(phrases):
                if i:
                    time.sleep(args.pause)
                # Our result blocks are saved as images, the evidence that goes with each report to the owner.
                r = reader.read(context, phrase, peek=True, shots=os.path.join(folder, 'shots'))
                ours = [x for x in r.get('results', []) if DOMAIN in urlparse(x['url']).netloc]
                entry = {'at': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'phrase': phrase, 'mode': 'peek', 'blocked': r.get('blocked', False),
                         'error': r.get('error'), 'position': ours[0]['position'] if ours else None, 'url': ours[0]['url'] if ours else None,
                         'results': [x['url'] for x in r.get('results', [])], 'questions': r.get('questions', []),
                         'shots': [i['shot'] for i in r.get('icons', []) if i.get('shot')]}
                with open(args.ledger, 'a', encoding='utf-8') as handle:
                    handle.write(json.dumps(entry, ensure_ascii=False) + '\n')
                readings.append(entry)
                if entry['blocked']:
                    break
    client, report = Client(), {'at': now, 'phrases': {}}
    for entry in readings:
        if entry['blocked'] or entry['error']:
            continue
        key = plain(entry['phrase'])
        pillar, anchors = PILLARS[key]
        rivals = [features(client, u, entry['phrase']) for u in [u for u in entry['results'] if DOMAIN not in u][:3]]
        ours = features(client, ORIGIN + pillar, entry['phrase'])
        ok = [r for r in rivals if r.get('status') == 200]
        report['phrases'][entry['phrase']] = {'position': entry['position'], 'url': entry['url'], 'pillar': pillar, 'questions': entry['questions'],
                                              'trend': n_of_m(load_ledger(args.ledger), entry['phrase'], entry['at']),
                                              'gap': gap(ours, ok) if ours.get('status') == 200 and ok else None,
                                              'inbound': internal_inbound(args.dist, pillar, anchors), 'ours': ours, 'top3': rivals}
    os.makedirs(folder, exist_ok=True)
    open(os.path.join(folder, 'report.json'), 'w', encoding='utf-8').write(json.dumps(report, ensure_ascii=False, indent=1))
    open(os.path.join(folder, 'report.md'), 'w', encoding='utf-8').write(markdown(report, readings))
    print(json.dumps({'folder': folder, 'readings': [{k: e[k] for k in ('phrase', 'blocked', 'position', 'url')} for e in readings]}, ensure_ascii=False))
    return 2 if any(e['blocked'] for e in readings) else 0


def markdown(report, readings):
    rows = [f"# Ciclo do motor de SEO — {report['at']}", '', 'Leituras sem personalização (`peek_pws=0`), IP do RJ. Posição = entre os orgânicos lidos.', '',
            '| Frase | Agora | Página 1 nas últimas 24 h | Pilar | Palavras nosso / mediana top 3 | Termos do nicho que faltam | Regiões sem a frase | Links internos com âncora exata |',
            '|---|---|---|---|---|---|---|---|']
    for e in readings:
        item = report['phrases'].get(e['phrase'])
        if not item:
            rows.append(f"| {e['phrase']} | {'captcha' if e['blocked'] else e.get('error')} | | | | | | |")
            continue
        g, t = item['gap'] or {}, item['trend']
        rows.append(f"| {e['phrase']} | {str(item['position']) + 'º' if item['position'] else 'ausente'} | {t['onPage1']} de {t['readings']} | {item['pillar']} | "
                    f"{g.get('wordsOurs')} / {g.get('wordsTop3Median')} | {', '.join(g.get('missingTerms', [])) or '—'} | {', '.join(g.get('regionsMissing', [])) or '—'} | "
                    f"{item['inbound']['links']} em {item['inbound']['pages']} páginas |")
    for phrase, item in report['phrases'].items():
        rows += ['', f'## {phrase}', '', 'Top 3: ' + ', '.join(f"{r['url']} ({r.get('words', '?')} palavras, TTFB {r.get('ttfb', '?')} s)" for r in item['top3']),
                 f"Nosso pilar: {item['ours'].get('url')} ({item['ours'].get('words', '?')} palavras, TTFB {item['ours'].get('ttfb', '?')} s)",
                 'Bigramas do top 3 que faltam no pilar: ' + (', '.join((item['gap'] or {}).get('missingBigrams', [])[:20]) or '—'),
                 '"As pessoas também perguntam": ' + (' | '.join(item['questions']) or 'não lido')]
    return '\n'.join(rows) + '\n'


def selftest():
    page = """<html><head><title>Consultoria Ambiental no RJ | X</title></head><body>
<h1>Consultoria ambiental</h1><h2>Licenciamento ambiental no INEA</h2><h3>LDAR e Método 21</h3>
<p>A consultoria ambiental atende o licenciamento ambiental. Consultoria ambiental para empresas.</p>
<img src="a.png" alt="Equipe de consultoria ambiental"></body></html>"""
    seen = phrase_by_region(page, 'consultoria ambiental')
    assert seen == {'title': 1, 'h1': 1, 'h2': 0, 'h3': 0, 'p': 2, 'alt': 1}, seen
    grams = ngrams('Licenciamento ambiental e licenciamento ambiental no Rio', 2)
    assert grams['licenciamento ambiental'] == 2 and 'ambiental e' not in grams, grams
    assert ngrams('Emissões fugitivas', 1) == {'emissoes': 1, 'fugitivas': 1}
    terms = niche_terms('Programa LDAR conforme o Método 21 da EPA e a CONAMA 382; câmera OGI Dräger.')
    assert terms['LDAR'] == 1 and terms['EPA Method 21'] == 1 and terms['CONAMA'] == 1 and terms['OGI'] == 1 and terms['Dräger'] == 1, terms
    assert terms['IBAMA'] == 0 and terms['CETESB'] == 0
    ours = {'words': 300, 'terms': {'LDAR': 0, 'INEA': 2, 'IBAMA': 0}, 'regions': {'title': 0, 'h1': 1}, 'bigrams': ['consultoria ambiental']}
    rivals = [{'words': 700, 'terms': {'LDAR': 3, 'INEA': 0, 'IBAMA': 1}, 'regions': {'title': 1, 'h1': 1}, 'bigrams': ['consultoria ambiental', 'licenciamento ambiental']},
              {'words': 900, 'terms': {'LDAR': 1, 'INEA': 0, 'IBAMA': 0}, 'regions': {'title': 1, 'h1': 0}, 'bigrams': ['licenciamento ambiental', 'gestao ambiental']},
              {'words': 500, 'terms': {'LDAR': 0, 'INEA': 0, 'IBAMA': 0}, 'regions': {'title': 0, 'h1': 0}, 'bigrams': ['gestao residuos']}]
    found = gap(ours, rivals)
    assert found['missingTerms'] == ['LDAR'], found
    assert found['regionsMissing'] == ['title'], found
    assert found['missingBigrams'] == ['licenciamento ambiental'], found
    assert found['wordsOurs'] == 300 and found['wordsTop3Median'] == 700, found
    with tempfile.TemporaryDirectory() as dist:
        os.makedirs(os.path.join(dist, 'blog'))
        open(os.path.join(dist, 'index.html'), 'w', encoding='utf-8').write('<a href="/">Início</a>')
        open(os.path.join(dist, 'blog', 'a.html'), 'w', encoding='utf-8').write('<a href="/">Consultoria Ambiental</a> <a href="/">empresa de engenharia ambiental</a>')
        open(os.path.join(dist, 'blog', 'b.html'), 'w', encoding='utf-8').write('<a href="/consultoria-ambiental-rj">consultoria ambiental</a>')
        assert internal_inbound(dist, '/', ['consultoria ambiental', 'empresa de engenharia ambiental']) == {'pages': 1, 'links': 2}
    ledger = [{'at': '2026-10-20T10:00:00+00:00', 'phrase': 'consultoria ambiental', 'position': 2},
              {'at': '2026-10-20T13:00:00+00:00', 'phrase': 'consultoria ambiental', 'position': None},
              {'at': '2026-10-20T13:30:00+00:00', 'phrase': 'consultoria ambiental', 'position': None},
              {'at': '2026-10-18T13:30:00+00:00', 'phrase': 'consultoria ambiental', 'position': 1},
              {'at': '2026-10-20T13:40:00+00:00', 'phrase': 'consultoria ambiental', 'position': 3, 'mode': 'signed'},
              {'at': '2026-10-20T13:30:00+00:00', 'phrase': 'emissões fugitivas', 'blocked': True}]
    assert n_of_m(ledger, 'consultoria ambiental', '2026-10-20T14:00:00+00:00') == {'onPage1': 1, 'readings': 3, 'best': 2, 'lastTwo': [None, None]}
    assert budget(ledger, '2026-10-20T14:00:00+00:00') == {'queries3h': 4, 'captcha6h': True}, 'signed readings use the budget too'
    print('selftest: PASS')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('selftest')
    command = commands.add_parser('run', help='read Google, measure the gap, write the report')
    command.add_argument('--phrases', nargs='+', default=PHRASES)
    command.add_argument('--pause', type=float, default=90.0, help='seconds between Google queries')
    command.add_argument('--max-queries', type=int, default=8, help='Google queries allowed in any 3 hours')
    command.add_argument('--ledger', default=LEDGER)
    command.add_argument('--out', default=OUT)
    command.add_argument('--dist', default='dist')
    command.add_argument('--no-google', action='store_true', help='skip the Google readings (dry run)')
    args = parser.parse_args()
    if args.command == 'selftest':
        selftest()
    else:
        sys.exit(run(args))
