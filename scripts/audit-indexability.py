"""Read-only artifact/HTTP SEO audit. Outputs evidence, never submits indexing requests."""
import argparse, collections, concurrent.futures, datetime, json, re
import urllib.request, urllib.error, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit

ORIGIN='https://www.monitorarconsultoria.com.br'
class HTML(HTMLParser):
    def __init__(self,source):
        super().__init__(convert_charrefs=True)
        self.main=False; self.skip=0; self.text=[]; self.meta={}; self.canonical=[]; self.links=[]; self.ld=[]; self.in_ld=False; self.code=''
        self.feed(source)
        self.titles=re.findall(r'<title>(.*?)</title>',source,re.S)
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='main': self.main=True
        if tag in ('script','style'): self.skip+=1
        if tag=='script' and a.get('type')=='application/ld+json': self.in_ld=True; self.code=''
        if tag=='meta': self.meta[a.get('name') or a.get('property')]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='a' and a.get('href'): self.links.append(a['href'])
    def handle_endtag(self,tag):
        if tag=='main': self.main=False
        if tag=='script' and self.in_ld: self.ld.extend(json.loads(self.code).get('@graph',[])); self.in_ld=False
        if tag in ('script','style'): self.skip=max(0,self.skip-1)
    def handle_data(self,data):
        if self.in_ld:self.code+=data
        if self.main and not self.skip:self.text.append(data)
    def visible(self):return ' '.join(' '.join(self.text).split())

parser=argparse.ArgumentParser()
parser.add_argument('--base',help='Public origin; omit for local dist artifacts')
parser.add_argument('--output',required=True)
parser.add_argument('--baseline',action='store_true',help='Record pre-fix schema/date/redirect findings without requiring new behavior')
args=parser.parse_args()
docs=json.loads(Path('content/published.json').read_text(encoding='utf-8'))['current']
# Retired articles stay in the approved manifest but redirect (content/retired.json): they must leave the sitemap.
retired=json.loads(Path('content/retired.json').read_text(encoding='utf-8'))
articles={k:v for k,v in docs.items() if v['type']=='article' and k not in retired}
def read(route,agent='Googlebot'):
    if args.base:
        req=urllib.request.Request(args.base.rstrip('/')+route,headers={'User-Agent':agent})
        with urllib.request.urlopen(req,timeout=30) as r:return r.read().decode(),r.status,r.url,r.headers.get('Content-Type',''),r.headers.get('X-Robots-Tag','')
    file=route.lstrip('/') or 'index.html'
    if not Path(file).suffix:file+='.html'
    return (Path('dist')/file).read_text(encoding='utf-8'),200,ORIGIN+route,('application/xml' if route.endswith('.xml') else 'text/html'),''

xml,status,_,mime,_=read('/sitemap.xml')
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
# /sitemap.xml is an index of the page, post and category sitemaps: read the children.
root=ET.fromstring(xml)
children=[e.findtext('s:loc',namespaces=ns) for e in root.findall('s:sitemap',ns)]
entries=[e for child in children for e in ET.fromstring(read(urlsplit(child).path)[0]).findall('s:url',ns)] if children else root.findall('s:url',ns)
locations=[e.findtext('s:loc',namespaces=ns) for e in entries]
modified={e.findtext('s:loc',namespaces=ns):e.findtext('s:lastmod',namespaces=ns) for e in entries}
problems=[]
def require(condition,message):
    if not condition:problems.append(message)
require(status==200 and 'application/xml' in mime,'Sitemap response/MIME')
require(len(locations)==len(set(locations)),'Duplicate sitemap entries')
require([urlsplit(c).path for c in children]==['/page-sitemap.xml','/post-sitemap.xml','/category-sitemap.xml'],'Sitemap index of page, post and category sitemaps')
require(all(ORIGIN+slug in locations for slug in articles),'Missing published article in sitemap')
require(all(urlsplit(url).netloc=='www.monitorarconsultoria.com.br' for url in locations),'Unexpected canonical host')
robots=read('/robots.txt')[0]
require('User-agent: *' in robots and 'Allow: /' in robots and 'Sitemap: '+ORIGIN+'/sitemap.xml' in robots,'robots directives')
require(not re.search(r'^Disallow:\s*/\s*$',robots,re.M),'Whole-site robots block')

def check(url):
    route=urlsplit(url).path;issues=[]
    try:
        raw,status,final,mime,header=read(route);h=HTML(raw);text=h.visible()
        if status!=200 or final!=url:issues.append('HTTP/redirect')
        if h.canonical!=[url]:issues.append('canonical')
        if 'noindex' in (h.meta.get('robots','')+header):issues.append('noindex')
        if len(h.titles)!=1 or not h.meta.get('description'):issues.append('missing title/description')
        if not text:issues.append('empty main HTML')
        doc=articles.get(route)
        if doc:
            body=[]
            for section in doc['body']:
                body += [section['heading']]+section['paragraphs']+section.get('items',[])
                if 'table' in section:
                    table=section['table'];body += [table['caption']]+table['headers']+[cell for row in table['rows'] for cell in row]
            missing=[value for value in body if ' '.join(value.split()) not in text]
            if missing:issues.append('Missing body segments: '+str(len(missing)))
            for key in ['og:title','og:description','og:url']:
                if not h.meta.get(key):issues.append('missing '+key)
            if h.meta.get('og:type')!='article' or h.meta.get('og:url')!=url:issues.append('Open Graph')
            schema=next((x for x in h.ld if x.get('@type') in ['Article','BlogPosting','TechArticle']),{})
            if not args.baseline and schema.get('@type')!='BlogPosting':issues.append('Expected BlogPosting')
            for field in ['headline','datePublished','dateModified','author','publisher','image']:
                if not schema.get(field):issues.append('schema '+field)
            expected=max(doc['first_published_at'],doc['substantive_updated_at'])
            if schema.get('dateModified')!=expected or modified.get(url)!=expected:issues.append('public date mismatch')
            if schema.get('datePublished')!=doc['first_published_at']:issues.append('publication history changed')
            if schema.get('headline')!=doc['title']:issues.append('headline mismatch')
            if args.base:
                normal=HTML(read(route,'Mozilla/5.0')[0])
                if normal.visible()!=text or normal.canonical!=h.canonical or normal.meta!=h.meta:issues.append('User-agent parity')
        return {'url':url,'article':bool(doc),'status':status,'title':h.titles[0] if h.titles else '', 'description':h.meta.get('description'), 'issues':issues,'links':h.links,'text':text if route=='/' else None}
    except Exception as error:return {'url':url,'issues':[str(error)],'links':[]}

with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: rows=list(pool.map(check,locations))
byurl={r['url']:r for r in rows};depth={ORIGIN+'/':0};todo=[ORIGIN+'/']
while todo:
    current=todo.pop(0)
    for link in byurl[current]['links']:
        u=urlsplit(urljoin(current,link));destination=u.scheme+'://'+u.netloc+u.path
        if destination in byurl and destination not in depth:depth[destination]=depth[current]+1;todo.append(destination)
require(all(ORIGIN+s in depth for s in articles),'Orphan articles')
home=byurl[ORIGIN+'/'];text=home.get('text','')
for stat in ['16 Anos de experiência','800% Crescimento','33ª Colocação ranking Exame','100+ Clientes atendidos']:require(stat in text,'Home final value: '+stat)
for slug in ['/blog','/blog/deteccao-e-quantificacao-de-emissoes-fugitivas','/blog/o-que-e-ldar','/blog/como-contratar-monitoramento-de-emissoes-fugitivas']:require(slug in home['links'],'Home link: '+slug)
for field in ['title','description']:
    values=[r.get(field) for r in rows if r.get('article')];require(len(values)==len(set(values)),'Duplicate article '+field)
redirects=[]
if args.base:
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self,*a,**kw):return None
    opener=urllib.request.build_opener(NoRedirect)
    for route in ['/','/sitemap.xml','/robots.txt','/blog/o-que-e-ldar?audit=1']:
        try:r=opener.open('https://monitorarconsultoria.com.br'+route,timeout=20)
        except urllib.error.HTTPError as e:r=e
        result={'route':route,'status':r.status,'location':r.headers.get('Location')};redirects.append(result)
        require(r.status==308 and result['location']==ORIGIN+route,'Permanent redirect '+route)
    try:urllib.request.urlopen(args.base+'/__seo_audit_missing__',timeout=20);require(False,'Missing route not 404')
    except urllib.error.HTTPError as e:require(e.code==404,'Missing route status')
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':args.base or 'dist','baseline':args.baseline,'sitemapURLs':len(locations),'publishedArticles':len(articles),'articlesInSitemap':sum(ORIGIN+s in locations for s in articles),'globalIssues':problems,'articleDepths':dict(collections.Counter(depth.get(ORIGIN+s,'unreachable') for s in articles)),'redirects':redirects,'pages':[{k:v for k,v in r.items() if k not in ['text','links']} for r in rows],'googleIndexationVerified':False}
output=Path(args.output);output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
failures=len(problems)+sum(bool(r['issues']) for r in rows)
print(json.dumps({'output':str(output),'urls':len(rows),'articles':len(articles),'failures':failures,'globalIssues':problems,'pageIssues':[{'url':r['url'],'issues':r['issues']} for r in rows if r['issues']][:3]}))
if failures and not args.baseline:raise SystemExit(1)
