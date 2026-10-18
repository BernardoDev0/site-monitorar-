import {readFile} from 'node:fs/promises';
import {legacy} from './routes.mjs';
import {loadCorpus,loadRegistry,publicDocument,validatePublic,validateManifest} from './editorial.mjs';
import {editorialPages} from './editorial-pages.mjs';
import {withEditorialMedia} from './editorial-media.mjs';
export function normalizeRoute(pathname) {
  if (['/index','/index.html'].includes(pathname)) return '/';
  if (pathname === '/blog/pagina/1') return '/blog';
  if (pathname.endsWith('.html') || pathname !== '/' && pathname.endsWith('/')) return pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  return null;
}
export async function loadSiteData(preview = false) {
  const registry = await loadRegistry();
  const published = JSON.parse(await readFile('content/published.json','utf8'));
  const candidates = preview ? await loadCorpus() : Object.values(published.current);
  if (!preview) { validateManifest(published.current, registry); for (const doc of candidates) { const errors = validatePublic(doc, registry); if (errors.length) throw new Error(doc.id+': '+errors.join('; ')); } }
  const seen = new Set();
  for (const doc of candidates) { if (seen.has(doc.slug)) throw new Error('Duplicate path: '+doc.slug); seen.add(doc.slug); }
  const illustrated = await withEditorialMedia(candidates.map(d=>publicDocument(d,registry,preview)));
  const documents = illustrated.map(d=>({...d,related:illustrated.filter(x=>candidates.find(c=>c.id===d.id).related_content_ids.includes(x.id)).map(({slug,title,cover})=>({slug,title,cover}))}));
  const content = documents.map(({id,slug,title,summary,type,topic_cluster,cover})=>({id,slug,title,summary,type,topic_cluster,cover}));
  // Index the existing home offerings verbatim, without publishing editorial drafts.
  const offeringsSource = await readFile('src/components/home/OfferingsSection.tsx','utf8');
  const homeSearchText = [...offeringsSource.matchAll(/(?:title|description|fullDescription):\s*"([^"]+)"/g)].map(m=>m[1]).join(' ');
  const institutionalSearch = legacy.filter(r=>!candidates.some(d=>d.slug===r.path)).map(r=>({slug:r.path,title:r.title.split(' | ')[0],summary:r.description,topic_cluster:'institucional',...(r.path==='/'?{searchText:homeSearchText}:{})}));
  const search = [...institutionalSearch, ...candidates.map(({slug,title,summary,topic_cluster,reviewed_at})=>({slug,title,summary,topic_cluster,reviewed_at}))];
  const pages = [...documents,...editorialPages(documents,preview)];
  const rows = legacy.filter(r=>!pages.some(d=>d.slug===r.path)).map(r=>({...r,page:null}));
  for (const page of pages) rows.push({path:page.slug,title:page.title+' | Monitorar',description:page.summary,canonical:page.slug,page});
  rows.push({path:'/404',title:'Página não encontrada | Monitorar',description:'O endereço solicitado não foi encontrado.',canonical:null,page:null});
  return {rows,content,search,candidates,documents:pages};
}
export const safeJson = value => JSON.stringify(value).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
