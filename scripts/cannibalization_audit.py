"""Keyword overlap across the built site: which pages compete for the same phrase with the same intent.

Reads dist/ (run `npm run build` first): every URL of the sitemap (a flat urlset or an index of child sitemaps), its title,
H1, H2s, meta description and slug. A phrase is strong on a page when it is in the title, the H1 or the slug, and medium when it
is only in the H2s or the meta. A conflict is two or more pages with the phrase strong and the same intent. Google's view is added
from the SERP files of the reverse-engineering round and the 19/10 baseline (column `ours`).
  .venv-seo/Scripts/python -I scripts/cannibalization_audit.py --out docs/organic/reverse-engineering/canibalizacao-dados.md
"""
import argparse, csv, json, os, re, sys
from glob import glob
from urllib.parse import urlparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from serp_reverse_engineer import count_term, onpage, plain, sitemap_entries, sitemap_kind, term_of  # noqa: E402

PHRASES = ['emissões fugitivas', 'o que são emissões fugitivas', 'monitoramento de emissões fugitivas', 'LDAR', 'consultoria ambiental',
           'consultoria ambiental RJ', 'empresa de engenharia ambiental', 'licenciamento ambiental']
GUIDES = {'/emissoes-fugitivas', '/consultoria-ambiental'}
STATES = re.compile(r'^/consultoria-ambiental-(rj|sp|am|por-estado)$')
LISTINGS = re.compile(r'^/(blog|conteudos)(/|$)')


def routes(dist):
    """Sitemap URLs of the build, reading the children when sitemap.xml is an index."""
    xml = open(os.path.join(dist, 'sitemap.xml'), 'rb').read()
    if sitemap_kind(xml) == 'index':
        out = []
        for child in sitemap_entries(xml):
            out += [e['loc'] for e in sitemap_entries(open(os.path.join(dist, urlparse(child['loc']).path.lstrip('/')), 'rb').read())]
        return out
    return [e['loc'] for e in sitemap_entries(xml)]


def kind_of(path):
    if path == '/':
        return 'home', 'comercial'
    if path in GUIDES:
        return 'guia', 'informacional'
    if STATES.match(path):
        return 'estado', 'geográfica'
    if path.startswith('/blog/') and not path.startswith('/blog/pagina'):
        return 'artigo', 'informacional'
    if LISTINGS.match(path):
        return 'listagem', 'listagem'
    if path.startswith('/servicos'):
        return 'serviço', 'comercial'
    return 'institucional', 'institucional'


def has(text, phrase):
    core, geo = term_of(phrase)
    return count_term(text, core) > 0 and (not geo or count_term(text, 'rj') + count_term(text, 'rio de janeiro') > 0)


def google_view():
    """phrase (plain) -> [(position, path)] of our results, from the newest reading of each phrase."""
    seen = {}
    for name in sorted(glob('docs/organic/google-first-page/rankings/*.csv')):
        for row in csv.DictReader(open(name, encoding='utf-8')):
            if row.get('ours'):
                seen[plain(row['phrase'])] = [(o['position'], o['path']) for o in json.loads(row['ours'])]
    for name in sorted(glob('docs/organic/reverse-engineering/serp/*.json')):
        report = json.load(open(name, encoding='utf-8'))
        reading = next((r for r in report.get('readings', {}).values() if r.get('results')), None)
        if reading:
            seen[plain(report['phrase'])] = [(r['position'], urlparse(r['url']).path or '/') for r in reading['results']
                                             if 'monitorarconsultoria.com.br' in urlparse(r['url']).netloc]
    return seen


def audit(dist):
    pages = []
    for url in routes(dist):
        path = urlparse(url).path or '/'
        file = os.path.join(dist, 'index.html' if path == '/' else path.lstrip('/') + '.html')
        seen = onpage(open(file, encoding='utf-8').read())
        kind, intent = kind_of(path)
        h1 = ' '.join(h[1] for h in seen['headings'] if h[0] == 'h1')
        h2 = ' | '.join(h[1] for h in seen['headings'] if h[0] == 'h2')
        slug = re.sub(r'[-/]+', ' ', path)
        weights = {}
        for phrase in PHRASES:
            if has(seen['title'] or '', phrase) or has(h1, phrase) or has(slug, phrase):
                weights[phrase] = 'forte'
            elif has(h2, phrase) or has(seen['meta'] or '', phrase):
                weights[phrase] = 'médio'
        pages.append({'path': path, 'kind': kind, 'intent': intent, 'title': seen['title'], 'h1': h1, 'weights': weights})
    return pages


def report(pages, google):
    rows = ['# Dados da auditoria de canibalização', '', 'Gerado por `scripts/cannibalization_audit.py` a partir do `dist/`. '
            'Forte = frase no title, no H1 ou no slug; médio = só nos H2 ou na meta.', '']
    for phrase in PHRASES:
        strong = [p for p in pages if p['weights'].get(phrase) == 'forte']
        medium = [p for p in pages if p['weights'].get(phrase) == 'médio']
        by_intent = {}
        for page in strong:
            by_intent.setdefault(page['intent'], []).append(page)
        conflicts = {k: v for k, v in by_intent.items() if len(v) > 1}
        ours = google.get(plain(phrase))
        rows += [f'## {phrase}', '', f"- Páginas com a frase forte: {len(strong)}; médio: {len(medium)}.",
                 f"- Google (última leitura): {', '.join(f'{pos}º {path}' for pos, path in ours) if ours else ('ausente da 1ª página' if ours == [] else 'sem leitura')}.",
                 f"- Conflitos (mesma intenção, frase forte): {', '.join(f'{k} ({len(v)})' for k, v in conflicts.items()) or 'nenhum'}.", '',
                 '| Página | Tipo | Intenção | Peso | Title | H1 |', '|---|---|---|---|---|---|']
        for page in sorted(strong + medium, key=lambda p: (p['weights'][phrase] != 'forte', p['intent'], p['path']))[:40]:
            cell = lambda text: (text or '').replace('|', '\\|')
            rows.append(f"| {page['path']} | {page['kind']} | {page['intent']} | {page['weights'][phrase]} | {cell(page['title'])} | {cell(page['h1'])} |")
        if len(strong + medium) > 40:
            rows.append(f'| … mais {len(strong + medium) - 40} páginas | | | | | |')
        rows.append('')
    return '\n'.join(rows) + '\n'


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--dist', default='dist')
    parser.add_argument('--out', required=True, help='Markdown report')
    parser.add_argument('--json', help='also write every page with its phrase weights')
    args = parser.parse_args()
    pages = audit(args.dist)
    open(args.out, 'w', encoding='utf-8').write(report(pages, google_view()))
    if args.json:
        open(args.json, 'w', encoding='utf-8').write(json.dumps(pages, ensure_ascii=False, indent=1))
    print(f'{len(pages)} pages -> {args.out}')
