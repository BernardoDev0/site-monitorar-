import {readFileSync} from 'node:fs';
export const business=JSON.parse(readFileSync(new URL('../content/business.json',import.meta.url),'utf8'));
export const topics=JSON.parse(readFileSync(new URL('../content/topics.json',import.meta.url),'utf8'));
export function breadcrumbs(page) {
 const items=[{slug:'/',title:'Início'}];
 const parent=page.type==='article'?{slug:'/blog',title:'Blog'}:page.type==='service'?{slug:'/servicos',title:'Serviços'}:page.slug.startsWith('/conteudos/')?{slug:'/conteudos',title:'Assuntos'}:null;
 if(parent)items.push(parent);
 items.push({slug:page.slug,title:page.title});
 return items;
}
