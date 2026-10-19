import { origin } from './editorial.mjs';
import {business,breadcrumbs} from './seo-data.mjs';
import {publicModifiedAt} from './public-dates.mjs';
import {readFileSync} from 'node:fs';
// Guides rendered by components/Guide.tsx; their FAQ is marked up from the same file as the visible questions.
const guides=Object.fromEntries(['emissoes-fugitivas-guia','consultoria-ambiental-guia'].map(name=>{const guide=JSON.parse(readFileSync(new URL(`../content/${name}.json`,import.meta.url),'utf8'));return [guide.path,guide];}));
// A trailing "[[Ver ...|#anchor]]." is a pointer for readers, so the structured answer ends before it; other links keep their label.
const plain=t=>t.replace(/\s*\[\[[^\]|]+\|[^\]]+\]\]\.\s*$/,'').replace(/\[\[(.+?)\|.+?\]\]/g,'$1');
export function schemaFor(row,preview=false) {
 const graph=[{'@type':'Organization','@id':origin+'/#organization',name:business.name,url:origin+'/',logo:origin+business.logo,description:business.description,foundingDate:business.foundingDate,areaServed:business.areaServed.map(({type,name})=>({'@type':type,name})),knowsAbout:['Engenharia Ambiental','Emissões Fugitivas','LDAR'],telephone:business.phone,email:business.email,address:{'@type':'PostalAddress',...business.address},sameAs:business.sameAs},
 {'@type':'WebSite','@id':origin+'/#website',name:'Monitorar Consultoria',url:origin+'/',inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}}];
 const guide=guides[row.path];
 if(guide){const url=origin+row.path;graph.push(
  {'@type':'Article','@id':url+'#article',headline:guide.headline,description:row.description,mainEntityOfPage:url,inLanguage:'pt-BR',datePublished:guide.published,dateModified:guide.updated,author:{'@id':origin+'/#organization'},publisher:{'@id':origin+'/#organization'}},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:origin+'/'},{'@type':'ListItem',position:2,name:guide.eyebrow,item:url}]},
  {'@type':'FAQPage','@id':url+'#faq',inLanguage:'pt-BR',mainEntity:guide.faq.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:plain(a)}}))});}
 if(row.page) {
  const p=row.page,url=origin+p.slug;
  graph.push({'@type':'BreadcrumbList',itemListElement:(p.breadcrumbs||breadcrumbs(p)).map((item,i)=>({'@type':'ListItem',position:i+1,name:item.title,item:origin+item.slug}))});
  if(!preview&&p.type==='service') graph.push({'@type':'Service','@id':url+'#service',name:p.title,description:p.summary,url,areaServed:business.areaServed.map(({type,name})=>({'@type':type,name})),provider:{'@id':origin+'/#organization'}});
  if(!preview&&p.type==='article') graph.push({'@type':'BlogPosting','@id':url+'#article',headline:p.title,description:p.summary,mainEntityOfPage:url,inLanguage:'pt-BR',author:{'@type':'Person',name:p.author},datePublished:p.first_published_at,dateModified:publicModifiedAt(p),...(p.cover?{image:origin+p.cover.src}:{}),publisher:{'@id':origin+'/#organization'}});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
