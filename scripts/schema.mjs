import { origin } from './editorial.mjs';
import {business,breadcrumbs,topics} from './seo-data.mjs';
import {publicModifiedAt} from './public-dates.mjs';
import {readFileSync} from 'node:fs';
// Guides rendered by components/Guide.tsx; their FAQ is marked up from the same file as the visible questions.
const photos=JSON.parse(readFileSync(new URL('../src/lib/photos.json',import.meta.url),'utf8'));
const guides=Object.fromEntries(['emissoes-fugitivas-guia','consultoria-ambiental-guia'].map(name=>{const guide=JSON.parse(readFileSync(new URL(`../content/${name}.json`,import.meta.url),'utf8'));return [guide.path,guide];}));
// A trailing "[[Ver ...|#anchor]]." is a pointer for readers, so the structured answer ends before it; other links keep their label.
const plain=t=>t.replace(/\s*\[\[[^\]|]+\|[^\]]+\]\]\.\s*$/,'').replace(/\[\[(.+?)\|.+?\]\]/g,'$1');
// Pages that carry a Service node: the published service documents and the principal states.
const published=JSON.parse(readFileSync(new URL('../content/published.json',import.meta.url),'utf8')).current;
const services=Object.keys(published).filter(slug=>published[slug].type==='service');
const states={'/consultoria-ambiental-rj':'Rio de Janeiro','/consultoria-ambiental-sp':'São Paulo','/consultoria-ambiental-am':'Amazonas'};
const areaServed=business.areaServed.map(({type,name})=>({'@type':type,name}));
const ref=id=>({'@id':id});
const organization=ref(origin+'/#organization');
// Only verified data: no opening hours, ratings or map pin; geo only once a building-level match is recorded in business.json.
const company={'@type':['Organization','LocalBusiness'],'@id':origin+'/#organization',name:business.name,url:origin+'/',logo:origin+business.logo,image:origin+business.logo,description:business.description,foundingDate:business.foundingDate,areaServed,
 knowsAbout:['Engenharia ambiental','Consultoria ambiental',...topics.map(t=>t.label).filter(label=>label!=='Equipamentos'),'LDAR'],
 telephone:business.phone,email:business.email,address:{'@type':'PostalAddress',...business.address},...(business.geo?{geo:{'@type':'GeoCoordinates',...business.geo}}:{}),
 contactPoint:[{'@type':'ContactPoint',telephone:business.phone,email:business.email,contactType:'customer service',areaServed:'BR',availableLanguage:'pt-BR'}],
 hasOfferCatalog:{'@type':'OfferCatalog',name:'Serviços da Monitorar Consultoria',itemListElement:[...services,...Object.keys(states)].map(slug=>({'@type':'Offer',itemOffered:ref(origin+slug+'#service')}))},
 sameAs:business.sameAs};
const pageType=row=>['listing','collection','directory','hub'].includes(row.page?.type)?'CollectionPage':row.path==='/sobre'?'AboutPage':row.path==='/contato'?'ContactPage':'WebPage';
export function schemaFor(row,preview=false) {
 const path=row.page?.slug||row.canonical||row.path,url=origin+path,webpage=ref(url+'#webpage');
 const crumbs=row.page||guides[row.path];
 const graph=[company,
 {'@type':'WebSite','@id':origin+'/#website',name:'Monitorar Consultoria',url:origin+'/',inLanguage:'pt-BR',publisher:organization},
 {'@type':pageType(row),'@id':url+'#webpage',url,name:row.title||row.page?.title,...(row.description||row.page?.summary?{description:row.description||row.page.summary}:{}),inLanguage:'pt-BR',isPartOf:ref(origin+'/#website'),about:organization,...(crumbs?{breadcrumb:ref(url+'#breadcrumb')}:{})}];
 const guide=guides[row.path];
 if(guide)graph.push(
  {'@type':'Article','@id':url+'#article',headline:guide.headline,description:row.description,mainEntityOfPage:webpage,inLanguage:'pt-BR',datePublished:guide.published,dateModified:guide.updated,...(guide.figure?{image:origin+(photos[guide.figure.src]?.src||guide.figure.src)}:{}),author:organization,publisher:organization},
  {'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:origin+'/'},{'@type':'ListItem',position:2,name:guide.eyebrow,item:url}]},
  {'@type':'FAQPage','@id':url+'#faq',inLanguage:'pt-BR',mainEntity:guide.faq.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:plain(a)}}))});
 if(states[row.path])graph.push({'@type':'Service','@id':url+'#service',name:'Consultoria ambiental em '+states[row.path],serviceType:'Consultoria ambiental',description:row.description,url,mainEntityOfPage:webpage,areaServed:{'@type':'State',name:states[row.path]},provider:organization});
 if(row.page) {
  const p=row.page;
  graph.push({'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:(p.breadcrumbs||breadcrumbs(p)).map((item,i)=>({'@type':'ListItem',position:i+1,name:item.title,item:origin+item.slug}))});
  // The LDAR service is the commercial page for "empresa de LDAR"; the guide is the reference it points to.
  const ldar=p.slug==='/servicos/emissoes-fugitivas'?{alternateName:['LDAR','Programa LDAR','Monitoramento de emissões fugitivas'],serviceType:'Monitoramento de emissões fugitivas e LDAR',subjectOf:ref(origin+'/emissoes-fugitivas#article')}:{serviceType:p.title};
  if(!preview&&p.type==='service') graph.push({'@type':'Service','@id':url+'#service',name:p.title,...ldar,description:p.summary,url,mainEntityOfPage:webpage,areaServed,provider:organization});
  if(!preview&&p.type==='article') graph.push({'@type':'BlogPosting','@id':url+'#article',headline:p.title,description:p.summary,mainEntityOfPage:webpage,inLanguage:'pt-BR',author:{'@type':'Person',name:p.author},datePublished:p.first_published_at,dateModified:publicModifiedAt(p),...(p.topic?{articleSection:p.topic.title}:{}),...(p.cover?{image:origin+p.cover.src}:{}),publisher:organization});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
