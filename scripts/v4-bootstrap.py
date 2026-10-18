"""One-time, selective promotion of preserved V3 home components into V4.
Does not restore the repository or touch editorial approvals.
"""
from pathlib import Path
import shutil
import json

root = Path(__file__).resolve().parents[1]
marker = root / 'docs/organic/v4/BOOTSTRAP.json'
if marker.exists():
    raise SystemExit('Bootstrap already completed; edit the implementation directly.')
target = root / 'src/components/home'
target.mkdir(parents=True, exist_ok=True)
source = root / 'docs/organic/v3/preview/src'
for name in ['ServiceCard.tsx', 'OfferingsSection.tsx', 'LogosCarousel.tsx']:
    shutil.copyfile(source/name, target/name)
home = (source/'Home.tsx').read_text(encoding='utf-8')
home = home.replace('"./media/landscape-1024.webp"', '"@/assets/paisagem.png"')
home = home.replace('import { StaticHero } from "./StaticHero";', 'import { VideoHero as StaticHero } from "@/components/VideoHero";\nimport { FeaturedArticles } from "@/components/FeaturedArticles";')
for name in ['LogosCarousel','OfferingsSection']:
    home = home.replace(f'"./{name}"', f'"@/components/home/{name}"')
home = home.replace('      {/* Instagram Feed */}', '''      <section className="site-wrap section-space blog-teaser"><p className="eyebrow">Blog Monitorar</p><h2>Mais contexto. Melhores perguntas.</h2><p>Um espaço para compreender conceitos ambientais, comparar abordagens e preparar a contratação de serviços técnicos.</p><div className="actions"><a className="button" href="/blog">Explorar o blog ↗</a><a className="text-link" href="/conteudos">Navegar por assuntos</a></div><FeaturedArticles/></section>
      {/* Instagram Feed */}''')
(root/'src/pages/Home.tsx').write_text(home, encoding='utf-8')
header = (source/'Header.tsx').read_text(encoding='utf-8')
header = header.replace("import { useRef }", "import { useRef }")
header = "import { useLocation } from 'react-router-dom';\n"+header
header = header.replace('  const header =', '  const { pathname } = useLocation();\n  const header =')
header = header.replace("item.href === '/' ? 'page' : undefined", "pathname === item.href ? 'page' : undefined")
header = header.replace('<a href={item.href}>', '<a href={item.href} aria-current={pathname === item.href ? \'page\' : undefined}>')
(root/'src/components/Header.tsx').write_text(header,encoding='utf-8')
css = (source/'erm.css').read_text(encoding='utf-8').replace('.erm-preview', '.site-v4').replace('body[data-variant="erm"]', 'body')
(root/'src/v4-base.css').write_text(css,encoding='utf-8')
marker.parent.mkdir(parents=True,exist_ok=True)
marker.write_text(json.dumps({'source':'V3 preserved home, selected components only','backup':'D:/monitorar-recovery/v4-20261018-032828','published':False},indent=2),encoding='utf-8')
