import { origin } from './editorial.mjs';
export function schemaFor(row,preview=false) {
 const graph=[{'@type':'Organization','@id':origin+'/#organization',name:'Monitorar Consultoria',url:origin+'/',logo:origin+'/moni3.png'},
 {'@type':'WebSite','@id':origin+'/#website',name:'Monitorar Consultoria',url:origin+'/',inLanguage:'pt-BR',publisher:{'@id':origin+'/#organization'}}];
 if(row.page) {
  const p=row.page,url=origin+p.slug;
  graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:origin+'/'},{'@type':'ListItem',position:2,name:p.title,item:url}]});
  if(!preview&&p.type==='service') graph.push({'@type':'Service','@id':url+'#service',name:p.title,description:p.summary,url,provider:{'@id':origin+'/#organization'}});
  if(!preview&&p.type==='article') graph.push({'@type':'Article','@id':url+'#article',headline:p.title,description:p.summary,mainEntityOfPage:url,author:{'@type':'Person',name:p.author},dateModified:p.substantive_updated_at,publisher:{'@id':origin+'/#organization'}});
 }
 return {'@context':'https://schema.org','@graph':graph};
}
