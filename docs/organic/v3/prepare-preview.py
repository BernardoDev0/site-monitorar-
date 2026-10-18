"""Create the isolated ERM variant from the verified pre-redesign home.
Run once when establishing V3; does not modify application source or recovery evidence.
"""
from pathlib import Path
import shutil,re

root=Path(__file__).resolve().parents[3]
previous=root/'docs/organic/recovery/preview'
target=root/'docs/organic/v3/preview'
if (target/'src/Home.tsx').exists():
    raise SystemExit('V3 already exists. One-time bootstrap refused to overwrite reviewed implementation.')
(target/'src').mkdir(parents=True,exist_ok=True)
for name in ['Footer.tsx','App.tsx','main.tsx','server.tsx']:
    shutil.copy2(previous/'src'/name,target/'src'/name)
for name in ['index.html','tsconfig.json']:
    shutil.copy2(previous/name,target/name)
home=(previous/'src/Home.tsx').read_text(encoding='utf8')
home=home.replace('import { useCallback, useMemo } from "react";','')
home=home.replace('import { ParallaxHero } from "@/components/ParallaxHero";','import { StaticHero } from "./StaticHero";')
home=home.replace('import { CountUp } from "@/components/CountUp";','').replace('import { AnimatedText } from "@/components/AnimatedText";','')
home=home.replace('import { OfferingsSection } from "@/components/OfferingsSection";','import { OfferingsSection } from "./OfferingsSection";')
start=home.index('  const processedStats = useMemo')
end=home.index('  return (',start)
home=home[:start]+home[end:]
home=home.replace('<ParallaxHero backgroundVideo="/refinaria2.mp4">','<StaticHero>')
home=home.replace('</ParallaxHero>','</StaticHero>')
home=re.sub(r'<AnimatedText\s+as="h1"\s+className="[^"]*"\s+text="([^"]*)"\s*/>',r'<h1 data-enter>\1</h1>',home)
home=re.sub(r'\{\(\(\) => \{.*?\}\)\(\)\}', '{stat.number}',home,flags=re.S)
start=home.index('              <Card key={index} className="card-service')
end=home.index('              </Card>',start)+len('              </Card>')
home=home[:start]+'''              <article key={service.title} className="erm-service" data-reveal>
                <h3>{service.title}</h3>
                <div>
                  <p>{service.description}</p>
                  <ul>{service.items.map(item => <li key={item}><CheckCircle aria-hidden="true" size={17}/><span>{item}</span></li>)}</ul>
                  <a className="erm-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick("whatsapp")}>Fale com um Consultor<span aria-hidden="true">↗</span></a>
                </div>
              </article>'''+home[end:]
home=home.replace('{services.map((service, index) => (','{services.map((service) => (')
home=home.replace('className="min-h-screen"','className="erm-home"',1)
home=home.replace('<section className="py-16 bg-primary text-primary-foreground">','<section className="erm-stats">')
home=home.replace('<section className="py-20 bg-muted/30">','<section className="erm-services erm-section">')
home=home.replace('<section className="py-20 bg-gradient-to-br from-slate-50 to-green-50/30">','<section className="erm-expertise erm-section">')
home=home.replace('<section className="py-20">','<section className="erm-segments erm-section">')
home=home.replace('<section className="py-20 relative overflow-hidden">','<section className="erm-cta erm-section relative overflow-hidden">')
home=home.replace('<section className="pt-10 pb-14 bg-muted/20">','<section className="erm-clients erm-section">')
# Logos remain authentic; motion is bounded to finite GSAP entrances.
home=home.replace('speed={50}','speed={0}')
(target/'src/Home.tsx').write_text(home,encoding='utf8')
offerings=(root/'src/components/OfferingsSection.tsx').read_text(encoding='utf8').replace('from "@/components/ServiceCard"','from "./ServiceCard"').replace('className="py-20"','className="erm-offerings erm-section"')
(target/'src/OfferingsSection.tsx').write_text(offerings,encoding='utf8')
card=(root/'src/components/ServiceCard.tsx').read_text(encoding='utf8')
card=card.replace('className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col group" style={{ willChange: \'box-shadow\' }}','className="erm-offering" data-reveal')
card=card.replace('className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"','className="w-full h-full object-cover"').replace('style={{ willChange: \'transform\' }}','')
card=card.replace('className="max-w-2xl max-h-[90vh] overflow-y-auto"','className="erm-dialog max-w-2xl max-h-[90vh] overflow-y-auto"')
(target/'src/ServiceCard.tsx').write_text(card,encoding='utf8')
main=(target/'src/main.tsx').read_text(encoding='utf8').replace("import './polish.css';","import './erm.css';")
(target/'src/main.tsx').write_text(main,encoding='utf8')
index=(target/'index.html').read_text(encoding='utf8').replace('Amostra local de preservação','Prévia ERM • Home').replace('__VARIANT__','erm')
(target/'index.html').write_text(index,encoding='utf8')
build=(previous/'build.mjs').read_text(encoding='utf8').replace("'preview'","'erm-preview'").replace("['reference','polished']","['erm']")
(target/'build.mjs').write_text(build,encoding='utf8')
print('Isolated sources prepared; production source unchanged.')
