import {readFileSync} from 'node:fs';
export const business=JSON.parse(readFileSync(new URL('../content/business.json',import.meta.url),'utf8'));
export const topics=JSON.parse(readFileSync(new URL('../content/topics.json',import.meta.url),'utf8'));
// Clusters whose pillar is a guide rather than their subject page (docs/organic/reverse-engineering/hub-spoke.md).
const pillars={fugitivas:'/emissoes-fugitivas'};
export function breadcrumbs(page) {
 const items=[{slug:'/',title:'Início'}];
 // An article sits under the pillar of its cluster: the guide when the cluster has one, otherwise the subject page.
 const topic=page.type==='article'&&topics.find(t=>t.id===page.topic_cluster);
 const parent=topic?{slug:pillars[topic.id]||topic.slug,title:topic.label}:page.type==='article'?{slug:'/blog',title:'Blog'}:page.type==='service'?{slug:'/servicos',title:'Serviços'}:page.slug.startsWith('/conteudos/')?{slug:'/conteudos',title:'Assuntos'}:null;
 if(parent)items.push(parent);
 items.push({slug:page.slug,title:page.title});
 return items;
}
