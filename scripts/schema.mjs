import { origin } from './editorial.mjs';
import {business,breadcrumbs} from './seo-data.mjs';
export function schemaFor(row,preview=false) {
 const graph=[{'@type':'Organization','@id':origin+'/#organization',name:business.name,url:origin+'/',logo:origin+business.logo,description:business.description,telephone:business.phone,email:business.email,address:{'@type':'PostalAddress',...business.address},sameAs:business.sameAs},
 {'@type':'WebSite','@id':origin+'/#website',name:'Monitorar Consultoria',url:origin+'/',inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}}];
 if(row.page) {
  const p=row.page,url=origin+p.slug;
  graph.push({'@type':'BreadcrumbList',itemListElement:(p.breadcrumbs||breadcrumbs(p)).map((item,i)=>({'@type':'ListItem',position:i+1,name:item.title,item:origin+item.slug}))});
  if(!preview&&p.type==='service') graph.push({'@type':'Service','@id':url+'#service',name:p.title,description:p.summary,url,provider:{'@id':origin+'/#organization'}});
  if(!preview&&p.type==='article') graph.push({'@type':'Article','@id':url+'#article',headline:p.title,description:p.summary,mainEntityOfPage:url,inLanguage:'pt-BR',author:{'@type':'Person',name:p.author},datePublished:p.first_published_at,dateModified:p.substantive_updated_at,...(p.cover?{image:origin+p.cover.src}:{}),publisher:{'@id':origin+'/#organization'}});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
