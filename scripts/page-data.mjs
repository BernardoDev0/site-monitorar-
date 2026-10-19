import {readFile} from 'node:fs/promises';
import {legacy} from './routes.mjs';
import {loadCorpus,loadRegistry,publicDocument,validatePublished,validateManifest,maintenanceIssues} from './editorial.mjs';
import {topics,breadcrumbs} from './seo-data.mjs';
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
  // Search-result title/description (and internal anchor text) set outside the approved documents so their H1, text and approval hash stay untouched.
  const seoOverrides = JSON.parse(await readFile('content/seo-overrides.json','utf8'));
  const published = JSON.parse(await readFile('content/published.json','utf8'));
  const receipts = JSON.parse(await readFile('content/publication-receipts.json','utf8'));
  const candidates = preview ? await loadCorpus() : Object.values(published.current);
  if (!preview) { validateManifest(published.current, registry); for (const doc of candidates) { const errors = validatePublished(doc, registry,receipts[doc.slug]); if (errors.length) throw new Error(doc.id+': '+errors.join('; ')); } }
  const seen = new Set();
  for (const doc of candidates) { if (seen.has(doc.slug)) throw new Error('Duplicate path: '+doc.slug); seen.add(doc.slug); }
  const illustrated = await withEditorialMedia(candidates.map(d=>publicDocument(d,registry,preview)));
  const destinations=new Map([...legacy.map(r=>[r.path,{slug:r.canonical,title:r.title.split(' | ')[0]}]),...illustrated.map(d=>[d.slug,{slug:d.slug,title:d.title}])]);
  const documents = illustrated.map(d=>{
    const topic=topics.find(t=>t.id===d.topic_cluster);
    const services=[...(d.service_links||[]),...(topic?[topic.service]:[])].map(href=>{
      const [pathname,fragment]=href.split('#'),dest=destinations.get(pathname);
      return dest?{slug:dest.slug+(fragment?'#'+fragment:''),title:seoOverrides[pathname]?.anchor??(href===topic?.service?topic.serviceTitle:dest.title)}:null;
    }).filter((s,i,all)=>s&&s.slug.split('#')[0]!==d.slug&&all.findIndex(x=>x?.slug===s.slug)===i);
    const peers=illustrated.filter(x=>x.type==='article'&&x.topic_cluster===d.topic_cluster&&x.id!==d.id);
    const configured=candidates.find(c=>c.id===d.id).related_content_ids;
    // Different neighbours for each article; preserve relevant curated suggestions after them.
    const allPeers=illustrated.filter(x=>x.type==='article'&&x.topic_cluster===d.topic_cluster);
    const index=allPeers.findIndex(x=>x.id===d.id);
    const neighbours=index>=0?[allPeers[(index+1)%allPeers.length],allPeers[(index+allPeers.length-1)%allPeers.length]]:[];
    const related=[...neighbours,...peers.filter(x=>configured.includes(x.id)),...peers].filter((x,i,all)=>x&&x.id!==d.id&&all.findIndex(y=>y?.id===x.id)===i).slice(0,3).map(({slug,title,cover})=>({slug,title,cover}));
    return {...d,services,related,topic:topic?{slug:topic.slug,title:topic.label}:undefined,breadcrumbs:breadcrumbs(d)};
  });
  const content = documents.map(({id,slug,title,summary,type,topic_cluster,cover})=>({id,slug,title,summary,type,topic_cluster,cover}));
  // Index the existing home offerings verbatim, without publishing editorial drafts.
  const offeringsSource = await readFile('src/components/home/OfferingsSection.tsx','utf8');
  const homeSearchText = [...offeringsSource.matchAll(/(?:title|description|fullDescription):\s*"([^"]+)"/g)].map(m=>m[1]).join(' ');
  const institutionalSearch = legacy.filter(r=>!candidates.some(d=>d.slug===r.path)).map(r=>({slug:r.path,title:r.title.split(' | ')[0],summary:r.description,topic_cluster:'institucional',...(r.path==='/'?{searchText:homeSearchText}:{})}));
  const search = [...institutionalSearch, ...candidates.map(({slug,title,summary,topic_cluster,reviewed_at})=>({slug,title,summary,topic_cluster,reviewed_at}))];
  const pages = [...documents,...editorialPages(documents,preview)];
  const rows = legacy.filter(r=>!pages.some(d=>d.slug===r.path)).map(r=>({...r,page:null}));
  // Full brand name for brand + topic searches, shortened only where it would push the title past ~65 characters.
  const branded = title => (title+' | Monitorar Consultoria').length<=65 ? title+' | Monitorar Consultoria' : title+' | Monitorar';
  for (const slug of Object.keys(seoOverrides)) if (!pages.some(p=>p.slug===slug)) throw new Error('SEO override for unknown page: '+slug);
  for (const page of pages) rows.push({path:page.slug,title:seoOverrides[page.slug]?.title??branded(page.title),description:seoOverrides[page.slug]?.description??page.summary,canonical:page.slug,page});
  rows.push({path:'/404',title:'Página não encontrada | Monitorar',description:'O endereço solicitado não foi encontrado.',canonical:null,page:null});
  return {rows,content,search,candidates,documents:pages,maintenance:preview?[]:candidates.map(d=>({id:d.id,issues:maintenanceIssues(d,registry)})).filter(d=>d.issues.length)};
}
export const safeJson = value => JSON.stringify(value).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
