"""Reverse-engineer the sites on Google's first page: robots.txt, sitemaps, HTML, headings and structured data.

Run with the isolated environment (scripts/requirements-seo.txt) and `python -I`, because the downloads are untrusted data:
  .venv-seo/Scripts/python -I scripts/serp_reverse_engineer.py selftest
  .venv-seo/Scripts/python -I scripts/serp_reverse_engineer.py fetch --serp docs/organic/reverse-engineering/serp/*.json --raw-dir DIR --own
  .venv-seo/Scripts/python -I scripts/serp_reverse_engineer.py analyze --raw-dir DIR --out docs/organic/reverse-engineering
The SERP files come from scripts/google-serp.py (`results` holds the full URL of every organic link read).
fetch keeps one request per second per host, a 20 s timeout and the site's robots.txt for pages; it writes DIR/<domain>/.
analyze writes robots-sitemaps.csv/.md and on-page-schema.json/.md. An optional classes.json in the output folder maps each
domain to direto, diretorio, referencia, marca or midia; on-page-schema.md then compares our pillar with the top 3 direct competitors.
"""
import argparse, csv, gzip, json, os, re, sys, time, unicodedata
from collections import Counter
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

ORIGIN = 'https://www.monitorarconsultoria.com.br'
OWN_HOST = 'monitorarconsultoria.com.br'
# Phrase -> our pillar (plan, "Termo → página pilar"); /consultoria-ambiental is the informational support page.
PILLARS = {'emissões fugitivas': '/emissoes-fugitivas', 'consultoria ambiental': '/', 'consultoria ambiental rj': '/consultoria-ambiental-rj',
           'empresa de engenharia ambiental': '/'}
OWN_PAGES = ['/', '/emissoes-fugitivas', '/consultoria-ambiental', '/consultoria-ambiental-rj']
AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
GUESSES = ['/sitemap.xml', '/sitemap_index.xml', '/wp-sitemap.xml']
MAX_CHILDREN, MAX_URLS = 10, 5000
GEO = re.compile(r'\s+(rj|rio de janeiro)$')
STOP = set('a o as os de da do das dos e em no na nos nas para por com sem um uma que como qual quais sobre ao à se sua seu suas seus mais'
           ' the and of for to in on with what how why você voce nosso nossa nossos nossas'.split())


# ---------- parsers (covered by selftest) ----------

def plain(text):
    """Lower case, no accents, single spaces: 'Emissões  Fugitivas' -> 'emissoes fugitivas'."""
    text = unicodedata.normalize('NFKD', text or '')
    return ' '.join(''.join(c for c in text if not unicodedata.combining(c)).casefold().split())


def count_term(text, term):
    """Whole-phrase occurrences, ignoring case, accents and spacing."""
    words = plain(term).split()
    if not words:
        return 0
    return len(re.findall(r'(?<!\w)' + r'\s+'.join(map(re.escape, words)) + r'(?!\w)', plain(text)))


def soup_of(html):
    from bs4 import BeautifulSoup
    return BeautifulSoup(html, 'lxml')


def onpage(html):
    soup = soup_of(html)
    meta = soup.find('meta', attrs={'name': re.compile('^description$', re.I)})
    headings = [[h.name, ' '.join(h.get_text(' ').split())] for h in soup.find_all(['h1', 'h2', 'h3'])]
    return {'title': ' '.join(soup.title.get_text().split()) if soup.title else None,
            'meta': ' '.join(meta.get('content', '').split()) if meta else None,
            'headings': headings, 'h1': sum(1 for h in headings if h[0] == 'h1'), 'h2': sum(1 for h in headings if h[0] == 'h2'),
            'generator': [m.get('content', '') for m in soup.find_all('meta', attrs={'name': re.compile('^generator$', re.I)})]}


def jsonld_blocks(html):
    """Every parsable application/ld+json block; broken blocks are counted, not raised."""
    blocks, broken = [], 0
    for script in soup_of(html).find_all('script', attrs={'type': re.compile(r'^\s*application/ld\+json\s*$', re.I)}):
        try:
            blocks.append(json.loads(script.string or script.get_text()))
        except ValueError:
            broken += 1
    return blocks, broken


def jsonld_types(html):
    """Top-level node types: a single object, a list at the top, or the items of @graph."""
    out = []

    def visit(node):
        if isinstance(node, list):
            for item in node:
                visit(item)
        elif isinstance(node, dict):
            if '@graph' in node:
                visit(node['@graph'])
            if '@type' in node:
                out.extend(node['@type'] if isinstance(node['@type'], list) else [node['@type']])
    visit(jsonld_blocks(html)[0])
    return out


def xml_root(xml):
    from defusedxml.ElementTree import fromstring
    try:
        return fromstring(xml.strip() if isinstance(xml, str) else xml.strip())
    except Exception:
        return None


def local(tag):
    return tag.rsplit('}', 1)[-1]


def sitemap_kind(xml):
    root = xml_root(xml)
    name = local(root.tag) if root is not None else None
    return {'sitemapindex': 'index', 'urlset': 'urlset'}.get(name)


def sitemap_entries(xml):
    """<url> entries of a urlset, or <sitemap> entries (loc, lastmod) of an index."""
    root = xml_root(xml)
    if root is None:
        return []
    out = []
    for item in root:
        fields = {local(child.tag): (child.text or '').strip() or None for child in item}
        if local(item.tag) == 'url':
            out.append({k: fields.get(k) for k in ('loc', 'lastmod', 'priority', 'changefreq')})
        elif local(item.tag) == 'sitemap':
            out.append({k: fields.get(k) for k in ('loc', 'lastmod')})
    return out


def robots_lines(text):
    groups, previous, out = 0, None, {'disallow': [], 'allow': [], 'sitemaps': []}
    for line in (text or '').splitlines():
        line = line.split('#', 1)[0].strip()
        if ':' not in line:
            continue
        key, value = (part.strip() for part in line.split(':', 1))
        key = key.lower()
        if key == 'user-agent' and previous != 'user-agent':
            groups += 1
        previous = key
        target = {'disallow': 'disallow', 'allow': 'allow', 'sitemap': 'sitemaps'}.get(key)
        if target and value and value not in out[target]:
            out[target].append(value)
    return {'groups': groups, **out}


# ---------- fetch ----------

class Client:
    """requests with one request per second per host and a browser user agent."""

    def __init__(self):
        import requests
        self.session = requests.Session()
        self.session.headers.update({'User-Agent': AGENT, 'Accept-Language': 'pt-BR,pt;q=0.9'})
        self.last = {}

    def get(self, url):
        host = urlparse(url).netloc
        wait = self.last.get(host, 0) + 1.0 - time.monotonic()
        if wait > 0:
            time.sleep(wait)
        try:
            response = self.session.get(url, timeout=20, allow_redirects=True)
            body = response.content
            if body[:2] == b'\x1f\x8b':
                body = gzip.decompress(body)
            return {'status': response.status_code, 'finalUrl': response.url, 'type': response.headers.get('Content-Type', ''), 'body': body}
        except Exception as error:
            return {'status': None, 'error': type(error).__name__ + ': ' + str(error)[:160], 'body': b''}
        finally:
            self.last[host] = time.monotonic()


def domain_of(url):
    host = urlparse(url).netloc.lower()
    return host[4:] if host.startswith('www.') else host


def serp_pages(files, limit):
    """url -> [{phrase, position}] from google-serp.py reports (peek, then neutral, then clean reading)."""
    pages = {}
    for name in files:
        report = json.load(open(name, encoding='utf-8'))
        readings = report.get('readings', {})
        reading = next((readings[k] for k in ('peek', 'neutral', 'clean') if readings.get(k, {}).get('results')), None)
        if not reading:
            print(f'{name}: no results to read (blocked or old format)', file=sys.stderr)
            continue
        for result in reading['results'][:limit]:
            pages.setdefault(result['url'], []).append({'phrase': report['phrase'], 'position': result['position'], 'title': result.get('title')})
    return pages


def needs_render(html):
    soup = soup_of(html)
    for tag in soup(['script', 'style', 'noscript']):
        tag.decompose()
    words = len((soup.body.get_text(' ') if soup.body else '').split())
    return words < 150


def render(url):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch(channel='chrome', headless=True)
        try:
            page = browser.new_page(user_agent=AGENT, locale='pt-BR')
            page.goto(url, wait_until='networkidle', timeout=45000)
            return page.content()
        finally:
            browser.close()


def save(path, body):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as handle:
        handle.write(body if isinstance(body, bytes) else body.encode('utf-8'))


def fetch_site(client, origin, urls, folder):
    """robots.txt, the sitemaps it names (or the usual paths), and each ranking page of one host."""
    record = {'origin': origin, 'robots': None, 'sitemapSource': None, 'sitemaps': [], 'pages': []}
    robots = client.get(origin + '/robots.txt')
    text = robots['body'].decode('utf-8', 'replace') if robots['status'] == 200 else ''
    record['robots'] = {'status': robots['status'], 'finalUrl': robots.get('finalUrl'), 'error': robots.get('error')}
    if robots['status'] == 200:
        save(os.path.join(folder, 'robots.txt'), robots['body'])
    rules = RobotFileParser()
    rules.parse(text.splitlines())
    roots = robots_lines(text)['sitemaps']
    record['sitemapSource'] = 'robots' if roots else 'guess'
    queue = [(url, 'robots') for url in roots] or [(origin + path, 'guess') for path in GUESSES]
    total, fetched = 0, 0
    while queue and total < MAX_URLS:
        url, source = queue.pop(0)
        if source == 'child' and fetched >= MAX_CHILDREN:
            record['sitemaps'].append({'url': url, 'skipped': f'more than {MAX_CHILDREN} child sitemaps'})
            continue
        answer = client.get(url)
        kind = sitemap_kind(answer['body']) if answer['status'] == 200 else None
        entry = {'url': url, 'from': source, 'status': answer['status'], 'kind': kind, 'error': answer.get('error')}
        if kind:
            entry['file'] = f"sitemaps/{len(record['sitemaps']) + 1:02d}-{re.sub(r'[^A-Za-z0-9._-]', '_', urlparse(url).path.rsplit('/', 1)[-1] or 'root')}"
            save(os.path.join(folder, entry['file']), answer['body'])
            entries = sitemap_entries(answer['body'])
            if source == 'child':
                fetched += 1
            if kind == 'index':
                queue.extend((e['loc'], 'child') for e in entries if e.get('loc'))
            else:
                total += len(entries)
            if source == 'guess':
                queue = [q for q in queue if q[1] != 'guess']
        record['sitemaps'].append(entry)
    for number, (url, ranks) in enumerate(urls.items(), 1):
        page = {'url': url, 'ranks': ranks, 'robotsAllowed': rules.can_fetch(AGENT, url) if text else True}
        if page['robotsAllowed']:
            answer = client.get(url)
            page.update({'status': answer['status'], 'finalUrl': answer.get('finalUrl'), 'error': answer.get('error')})
            if answer['status'] == 200:
                page['file'] = f'pages/{number:02d}.html'
                save(os.path.join(folder, page['file']), answer['body'])
                html = decode(answer['body'])
                if not jsonld_blocks(html)[0] and needs_render(html):
                    try:
                        save(os.path.join(folder, f'pages/{number:02d}.rendered.html'), render(url))
                        page['rendered'] = f'pages/{number:02d}.rendered.html'
                    except Exception as error:
                        page['renderError'] = type(error).__name__ + ': ' + str(error)[:160]
        record['pages'].append(page)
    save(os.path.join(folder, 'fetch.json'), json.dumps(record, ensure_ascii=False, indent=1))
    return record


def fetch(args):
    pages = serp_pages(args.serp, args.limit)
    if args.own:
        for path in OWN_PAGES:
            pages.setdefault(ORIGIN + path, [])
    hosts = {}
    for url, ranks in pages.items():
        parsed = urlparse(url)
        hosts.setdefault(f'{parsed.scheme}://{parsed.netloc}', {})[url] = ranks
    client = Client()
    for origin, urls in sorted(hosts.items()):
        record = fetch_site(client, origin, urls, os.path.join(args.raw_dir, domain_of(origin)))
        maps = [s for s in record['sitemaps'] if s.get('kind')]
        print(f"{domain_of(origin)}: robots {record['robots']['status']}, {len(maps)} sitemap files, "
              f"pages {[p.get('status', 'robots-blocked') for p in record['pages']]}")


# ---------- analyze ----------

def decode(body):
    from bs4 import UnicodeDammit
    return UnicodeDammit(body, is_html=True).unicode_markup or ''


def main_text(html):
    import trafilatura
    text = trafilatura.extract(html, include_comments=False, include_tables=True) or ''
    if not text:
        soup = soup_of(html)
        for tag in soup(['script', 'style', 'noscript', 'header', 'footer', 'nav']):
            tag.decompose()
        text = soup.get_text(' ')
    return ' '.join(text.split())


def cms_of(robots, sitemap_text, generators):
    found = []
    probes = [('yoast', 'Yoast SEO (WordPress)'), ('rank-math', 'Rank Math (WordPress)'), ('rankmath', 'Rank Math (WordPress)'),
              ('aioseo', 'All in One SEO (WordPress)'), ('wp-sitemap', 'WordPress (sitemap do núcleo)'), ('wix', 'Wix')]
    blob = (sitemap_text or '').lower()
    for probe, name in probes:
        if probe in blob and name not in found:
            found.append(name)
    for generator in generators:
        if generator and generator.split(' ')[0] not in ' '.join(found):
            found.append(generator)
    if not found and '/wp-admin/' in (robots or ''):
        found.append('WordPress (robots)')
    return ', '.join(found) or 'não identificado'


def term_of(phrase):
    """The phrase without its place name, and whether it had one: 'consultoria ambiental RJ' -> ('consultoria ambiental', True)."""
    core = GEO.sub('', plain(phrase))
    return core, core != plain(phrase)


def page_type(path, types, klass):
    if klass == 'diretorio':
        return 'diretório'
    if path in ('', '/'):
        return 'Home'
    if {'Article', 'BlogPosting', 'NewsArticle'} & set(types) or re.search(r'/(blog|noticias?|artigos?)/|/20\d\d/', path):
        return 'artigo'
    return 'serviço/página'


def measure(html, url, phrase):
    seen, text = onpage(html), main_text(html)
    words = text.split()
    term, geo = term_of(phrase)
    hits = count_term(text, term)
    path = urlparse(url).path
    h1 = ' '.join(h[1] for h in seen['headings'] if h[0] == 'h1')
    return {'phrase': phrase, 'term': term, 'occurrences': hits, 'per1000': round(hits * 1000 / len(words), 2) if words else 0,
            'inTitle': count_term(seen['title'] or '', term) > 0, 'inH1': count_term(h1, term) > 0,
            'inUrl': count_term(re.sub(r'[-_/.]+', ' ', path), term) > 0, 'inFirst100': count_term(' '.join(words[:100]), term) > 0,
            'geoMentions': (count_term(text, 'rio de janeiro') + count_term(text, 'rj')) if geo else None}


def significant(text):
    return {w for w in re.findall(r'\w+', plain(text)) if len(w) > 3 and w not in STOP}


def analyze(args):
    classes_file = args.classes or os.path.join(args.out, 'classes.json')
    classes = json.load(open(classes_file, encoding='utf-8')) if os.path.exists(classes_file) else {}
    sites, pages = [], []
    for name in sorted(os.listdir(args.raw_dir)):
        folder = os.path.join(args.raw_dir, name)
        if not os.path.exists(os.path.join(folder, 'fetch.json')):
            continue
        record = json.load(open(os.path.join(folder, 'fetch.json'), encoding='utf-8'))
        robots = open(os.path.join(folder, 'robots.txt'), encoding='utf-8', errors='replace').read() if os.path.exists(os.path.join(folder, 'robots.txt')) else ''
        lines = robots_lines(robots)
        children, urls, sitemap_text = [], [], ''
        for item in record['sitemaps']:
            if not item.get('file'):
                continue
            xml = open(os.path.join(folder, item['file']), 'rb').read()
            sitemap_text += xml[:4000].decode('utf-8', 'replace')
            entries = sitemap_entries(xml)
            if item['kind'] == 'index':
                children.extend(urlparse(e['loc']).path.rsplit('/', 1)[-1] for e in entries if e.get('loc'))
            else:
                urls.extend(entries)
        share = lambda field: round(100 * sum(1 for u in urls if u.get(field)) / len(urls)) if urls else None
        patterns = Counter('/' if urlparse(u['loc'] or '').path.strip('/') == '' else
                           ('/' + urlparse(u['loc']).path.strip('/').split('/')[0] + '/…' if '/' in urlparse(u['loc']).path.strip('/') else '/<raiz>')
                           for u in urls if u.get('loc'))
        generators = []
        for page in record['pages']:
            if page.get('file'):
                html = decode(open(os.path.join(folder, page.get('rendered') or page['file']), 'rb').read())
                seen, (blocks, broken) = onpage(html), jsonld_blocks(html)
                generators.extend(seen['generator'])
                types = jsonld_types(html)
                klass = 'nosso' if name == OWN_HOST else classes.get(name, 'nao-classificado')
                path = urlparse(page['url']).path
                phrases = [r['phrase'] for r in page['ranks']] or [p for p, pillar in PILLARS.items() if pillar == (path or '/')]
                if path == '/consultoria-ambiental':
                    phrases = phrases or ['consultoria ambiental']
                text = main_text(html)
                pages.append({'domain': name, 'class': klass, 'url': page['url'], 'ranks': page['ranks'], 'rendered': bool(page.get('rendered')),
                              'type': page_type(path, types, klass), 'title': seen['title'], 'titleLength': len(seen['title'] or ''),
                              'meta': seen['meta'], 'metaLength': len(seen['meta'] or ''), 'h1': seen['h1'], 'h2': seen['h2'],
                              'headings': seen['headings'], 'words': len(text.split()), 'jsonldTypes': types, 'jsonldBroken': broken,
                              'jsonld': blocks, 'terms': [measure(html, page['url'], phrase) for phrase in phrases]})
        sites.append({'domain': name, 'class': 'nosso' if name == OWN_HOST else classes.get(name, 'nao-classificado'),
                      'cms': cms_of(robots, sitemap_text, generators), 'robotsStatus': (record['robots'] or {}).get('status'),
                      'groups': lines['groups'], 'disallow': lines['disallow'], 'sitemapLines': lines['sitemaps'],
                      'sitemapSource': record['sitemapSource'],
                      'tried': [f"{urlparse(s['url']).path} {s.get('status')}" for s in record['sitemaps'] if s['from'] != 'child' and not s.get('kind')],
                      'index': any(s.get('kind') == 'index' for s in record['sitemaps']), 'children': children, 'urls': len(urls),
                      'lastmodPct': share('lastmod'), 'priorityPct': share('priority'), 'changefreqPct': share('changefreq'),
                      'patterns': dict(patterns.most_common(8))})
    os.makedirs(args.out, exist_ok=True)
    write_sites(sites, args.out)
    write_pages(pages, args.out)
    print(f'{len(sites)} sites, {len(pages)} pages -> {args.out}')


def write_sites(sites, out):
    columns = ['domain', 'class', 'cms', 'robotsStatus', 'groups', 'disallow', 'sitemapLines', 'sitemapSource', 'tried', 'index', 'children',
               'urls', 'lastmodPct', 'priorityPct', 'changefreqPct', 'patterns']
    with open(os.path.join(out, 'robots-sitemaps.csv'), 'w', encoding='utf-8', newline='') as handle:
        writer = csv.writer(handle)
        writer.writerow(columns)
        for site in sites:
            writer.writerow([' | '.join(map(str, v)) if isinstance(v, list) else (json.dumps(v, ensure_ascii=False) if isinstance(v, dict) else v)
                             for v in (site[c] for c in columns)])
    rows = ['# Robots e sitemaps dos sites da página 1', '', 'Gerado por `scripts/serp_reverse_engineer.py analyze`. Uma linha por domínio.', '',
            '| Domínio | Classe | CMS | Grupos no robots | Disallow | Sitemap no robots | Índice e filhos | URLs | % lastmod | % priority | % changefreq | Padrões de URL |',
            '|---|---|---|---|---|---|---|---|---|---|---|---|']
    for s in sorted(sites, key=lambda s: (s['class'] != 'nosso', s['class'], s['domain'])):
        sitemap = ', '.join(s['sitemapLines']) or ('nenhum; tentativas: ' + (', '.join(s['tried']) or '—'))
        index = ('índice: ' + ', '.join(s['children'])) if s['index'] else ('urlset' if s['urls'] else '—')
        pct = lambda v: '—' if v is None else f'{v}%'
        rows.append(f"| {s['domain']} | {s['class']} | {s['cms']} | {s['groups']} | {', '.join(f'`{d}`' for d in s['disallow']) or '—'} | "
                    f"{sitemap} | {index} | {s['urls']} | {pct(s['lastmodPct'])} | {pct(s['priorityPct'])} | {pct(s['changefreqPct'])} | "
                    f"{', '.join(f'{k} ({v})' for k, v in s['patterns'].items()) or '—'} |")
    open(os.path.join(out, 'robots-sitemaps.md'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')


def write_pages(pages, out):
    open(os.path.join(out, 'on-page-schema.json'), 'w', encoding='utf-8').write(json.dumps(pages, ensure_ascii=False, indent=1))
    rows = ['# On-page e Schema: concorrentes diretos × nosso pilar', '',
            'Gerado por `scripts/serp_reverse_engineer.py analyze`. Por termo: os 3 concorrentes diretos mais bem colocados e o nosso pilar.',
            'Densidade = ocorrências do termo (sem o nome do lugar) por 1.000 palavras do texto principal (trafilatura).', '']
    phrases = sorted({r['phrase'] for p in pages for r in p['ranks']} | set(PILLARS))
    for phrase in phrases:
        ranked = sorted(((r['position'], p) for p in pages for r in p['ranks'] if plain(r['phrase']) == plain(phrase)), key=lambda x: x[0])
        direct = [(pos, p) for pos, p in ranked if p['class'] == 'direto'][:3] or [(pos, p) for pos, p in ranked if p['class'] != 'nosso'][:3]
        ours = [p for p in pages if p['class'] == 'nosso' and urlparse(p['url']).path in (PILLARS.get(plain(phrase)), PILLARS.get(phrase.lower()))]
        if not direct and not ours:
            continue
        rows += [f'## {phrase}', '', '| Pos. | Página | Tipo | Title (caracteres) | Meta (caracteres) | H1 / H2 | Palavras | Termo: ocorrências, por 1.000 | Title / H1 / URL / 100 primeiras | JSON-LD |',
                 '|---|---|---|---|---|---|---|---|---|---|']
        for pos, p in direct + [(next((r['position'] for r in q['ranks'] if plain(r['phrase']) == plain(phrase)), '—'), q) for q in ours]:
            m = next((t for t in p['terms'] if plain(t['phrase']) == plain(phrase)), None) or measure_placeholder(phrase)
            flags = ' / '.join('sim' if m[k] else 'não' for k in ('inTitle', 'inH1', 'inUrl', 'inFirst100'))
            cell = lambda v: (v or '—').replace('|', '\\|')
            rows.append(f"| {pos} | {p['url']} | {p['type']} | {cell(p['title'])} ({p['titleLength']}) | {cell(p['meta'])} ({p['metaLength']}) | "
                        f"{p['h1']} / {p['h2']} | {p['words']} | {m['occurrences']}, {m['per1000']} | {flags} | {', '.join(p['jsonldTypes']) or 'nenhum'} |")
        if ours and direct:
            mine = set()
            for page in ours:
                mine |= significant(' '.join(h[1] for h in page['headings'])) | significant(page['title'] or '')
            pillar_text = ' '.join(plain(h[1]) for page in ours for h in page['headings'])
            gaps = []
            for _, p in direct:
                for level, heading in p['headings']:
                    missing = sorted(w for w in significant(heading) if w not in mine and w not in pillar_text)
                    if level in ('h2', 'h3') and missing:
                        gaps.append(f"- {p['domain']} {level.upper()} \"{heading[:90]}\": faltam {', '.join(missing)}")
            rows += ['', 'Termos dos H2/H3 dos concorrentes que não aparecem nos títulos do nosso pilar:', ''] + (gaps[:25] or ['- nenhum'])
        rows.append('')
    open(os.path.join(out, 'on-page-schema.md'), 'w', encoding='utf-8').write('\n'.join(rows) + '\n')


def measure_placeholder(phrase):
    return {'phrase': phrase, 'occurrences': 0, 'per1000': 0, 'inTitle': False, 'inH1': False, 'inUrl': False, 'inFirst100': False}


# ---------- selftest ----------

def selftest():
    page = """<html><head><title> Emissões Fugitivas | Exemplo </title>
<meta name="description" content="Monitoramento de emissões fugitivas.">
<script type="application/ld+json">{"@type": "Organization", "name": "A"}</script>
<script type="application/ld+json">[{"@type": "WebSite"}, {"@type": ["Article", "NewsArticle"]}]</script>
<script type="application/ld+json">{"@context": "https://schema.org", "@graph": [{"@type": "BreadcrumbList"}, {"@type": "WebPage"}]}</script>
<script type="application/ld+json">{ broken </script>
</head><body><h1>Emissões Fugitivas</h1><p>O que são emissoes fugitivas? EMISSÕES FUGITIVAS no RJ.</p>
<h2>Fontes</h2><h3>Válvulas</h3><h2>LDAR</h2></body></html>"""
    seen = onpage(page)
    assert seen['title'] == 'Emissões Fugitivas | Exemplo', seen['title']
    assert seen['meta'] == 'Monitoramento de emissões fugitivas.', seen['meta']
    assert seen['headings'] == [['h1', 'Emissões Fugitivas'], ['h2', 'Fontes'], ['h3', 'Válvulas'], ['h2', 'LDAR']], seen['headings']
    assert seen['h2'] == 2
    assert jsonld_types(page) == ['Organization', 'WebSite', 'Article', 'NewsArticle', 'BreadcrumbList', 'WebPage'], jsonld_types(page)
    assert count_term('O que são emissoes fugitivas? EMISSÕES FUGITIVAS e Emissões Fugitivas.', 'emissões fugitivas') == 3
    assert count_term('emissões fugitivasx', 'emissões fugitivas') == 0
    assert sitemap_kind('<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://a.br/post-sitemap.xml</loc></sitemap></sitemapindex>') == 'index'
    assert sitemap_kind('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://a.br/</loc></url></urlset>') == 'urlset'
    assert sitemap_kind('<html>404</html>') is None
    entries = sitemap_entries('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://a.br/</loc><lastmod>2026-01-01</lastmod><priority>1.0</priority></url><url><loc>https://a.br/x</loc></url></urlset>')
    assert entries == [{'loc': 'https://a.br/', 'lastmod': '2026-01-01', 'priority': '1.0', 'changefreq': None}, {'loc': 'https://a.br/x', 'lastmod': None, 'priority': None, 'changefreq': None}], entries
    robots = robots_lines('User-agent: *\nDisallow: /wp-admin/\nAllow: /wp-admin/admin-ajax.php\n\nUser-agent: Bingbot\nDisallow:\n# Sitemap: commented\nSitemap: https://a.br/sitemap_index.xml\n')
    assert robots == {'groups': 2, 'disallow': ['/wp-admin/'], 'allow': ['/wp-admin/admin-ajax.php'], 'sitemaps': ['https://a.br/sitemap_index.xml']}, robots
    assert term_of('consultoria ambiental RJ') == ('consultoria ambiental', True)
    assert term_of('emissões fugitivas') == ('emissoes fugitivas', False)
    print('selftest: PASS')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('selftest', help='check the parsers on inline fixtures')
    command = commands.add_parser('fetch', help='download robots.txt, sitemaps and the ranking pages')
    command.add_argument('--serp', nargs='+', required=True, help='google-serp.py reports')
    command.add_argument('--raw-dir', required=True, help='folder for the raw downloads (keep it outside the repository)')
    command.add_argument('--own', action='store_true', help='also fetch our pillar pages and files')
    command.add_argument('--limit', type=int, default=10, help='organic results per phrase')
    command = commands.add_parser('analyze', help='write the robots/sitemaps and on-page/Schema reports')
    command.add_argument('--raw-dir', required=True)
    command.add_argument('--out', required=True)
    command.add_argument('--classes', help='domain -> class JSON (default: <out>/classes.json)')
    args = parser.parse_args()
    {'selftest': lambda a: selftest(), 'fetch': fetch, 'analyze': analyze}[args.command](args)
