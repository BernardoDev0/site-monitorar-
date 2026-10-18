import { z } from 'zod';
import { createHash } from 'node:crypto';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { legacy } from './routes.mjs';
export const origin='https://www.monitorarconsultoria.com.br';
const date=z.string().datetime().nullable();
export const documentSchema=z.object({
 id:z.string().min(1),slug:z.string().regex(/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/),type:z.enum(['service','article','hub','case','company']),
 title:z.string().min(8),summary:z.string().min(30),topic_cluster:z.string(),primary_intent:z.string(),
 body:z.array(z.object({heading:z.string().min(3),paragraphs:z.array(z.string().min(20)).min(1),items:z.array(z.string()).optional(),table:z.object({caption:z.string(),headers:z.array(z.string()).min(2),rows:z.array(z.array(z.string()))}).optional()})).min(2),
 author_id:z.string().nullable(),reviewer_id:z.string().nullable(),evidence_ids:z.array(z.string()),source_urls:z.array(z.string().url().startsWith('https://')),
 approved_sources:z.record(z.string()).optional(),
 claim_status:z.enum(['pending','verified','not_applicable']),service_links:z.array(z.string()),related_content_ids:z.array(z.string()),
 created_at:date,first_published_at:date,reviewed_at:date,substantive_updated_at:date,
 status:z.enum(['draft','technical_review','editorial_review','approved','scheduled','published']),
 approved_by:z.string().nullable(),approved_version:z.string().nullable(),scheduled_at:date,
 canonical_url:z.string().url(),indexability:z.boolean(),review_due_at:date
}).strict();
export function versionOf(doc) {
 const {status,approved_by,approved_version,scheduled_at,first_published_at,...material}=doc;
 return createHash('sha256').update(JSON.stringify(material)).digest('hex');
}
export function validatePublic(doc,{people={},evidence={},sources={},now=new Date()}={}) {
 const parsed=documentSchema.safeParse(doc);
 if(!parsed.success) return parsed.error.issues.map(i=>i.path.join('.')+': '+i.message);
 const errors=[];
 if(!['approved','scheduled','published'].includes(doc.status)) errors.push('not approved');
 if(!doc.indexability) errors.push('not indexable');
 if(doc.approved_version!==versionOf(doc)) errors.push('approval does not match version');
 for(const role of ['author_id','reviewer_id','approved_by']) if(!doc[role]||!people[doc[role]]?.authorized||!people[doc[role]]?.name?.trim()) errors.push(role+' not authorized');
 if(doc.claim_status==='pending') errors.push('claims pending');
 if(doc.claim_status==='verified'&&!doc.evidence_ids.length) errors.push('evidence required');
 for(const id of doc.evidence_ids) if(!evidence[id]?.approved||!evidence[id]?.authorized) errors.push('evidence blocked: '+id);
 if(!doc.source_urls.length) errors.push('sources required');
 for(const url of doc.source_urls) {
  const source=sources[url];
  if(!source?.available||!source?.checked_at||!Number.isFinite(Date.parse(source.checked_at))||new Date(source.checked_at)>now||now-new Date(source.checked_at)>7*86400000) errors.push('source unavailable or stale: '+url);
  if(!source?.hash||doc.approved_sources?.[url]!==source.hash) errors.push('source version requires review: '+url);
 }
 for(const key of ['created_at','reviewed_at','substantive_updated_at']) if(!doc[key]||new Date(doc[key])>now) errors.push(key+' invalid');
 if(new Date(doc.reviewed_at)<new Date(doc.substantive_updated_at)) errors.push('review predates substantive update');
 if(doc.first_published_at&&new Date(doc.first_published_at)>now) errors.push('publication date in future');
 if(!doc.review_due_at||new Date(doc.review_due_at)<=now) errors.push('review expired');
 if(doc.scheduled_at&&new Date(doc.scheduled_at)>now) errors.push('scheduled in future');
 if(doc.canonical_url!==origin+doc.slug) errors.push('canonical mismatch');
 return errors;
}
export async function loadCorpus() {
 const names=(await readdir('content/documents')).filter(n=>n.endsWith('.json'));
 return Promise.all(names.map(async n=>documentSchema.parse(JSON.parse(await readFile('content/documents/'+n,'utf8')))));
}
export async function loadRegistry() {return JSON.parse(await readFile('content/registry.json','utf8'));}
export function publicDocument(d,registry,preview=false) {
 return {id:d.id,slug:d.slug,type:d.type,title:d.title,summary:d.summary,body:d.body,source_urls:d.source_urls,
 topic_cluster:d.topic_cluster,
 author:registry.people[d.author_id]?.authorized?registry.people[d.author_id].name:null,reviewer:registry.people[d.reviewer_id]?.authorized?registry.people[d.reviewer_id].name:null,
 reviewed_at:d.reviewed_at,substantive_updated_at:d.substantive_updated_at,preview};
}
export function simulate(state,docs,registry,{paused=false,now=new Date()}={}) {
 if(paused) throw new Error('Publication paused');
 const seen=new Set();
 for(const doc of docs) {
  if(seen.has(doc.slug)) throw new Error('Duplicate slug'); seen.add(doc.slug);
  const errors=validatePublic(doc,{...registry,now}); if(errors.length) throw new Error(doc.id+': '+errors.join('; '));
 }
 const signature=createHash('sha256').update(JSON.stringify(docs.map(d=>[d.id,d.approved_version]).sort())).digest('hex');
 if(state.runs.includes(signature)&&docs.every(d=>state.current[d.slug]?.approved_version===d.approved_version)) return state;
 const current={...state.current};
 for(const d of docs) current[d.slug]=structuredClone(d);
 validateManifest(current,registry);
 const ids=new Set(),bodies=new Set();
 for(const d of Object.values(current)) {
  const body=JSON.stringify(d.body).normalize('NFC').toLowerCase().replace(/\s+/g,' ');
  if(ids.has(d.id)||bodies.has(body)) throw new Error('Duplicate document identity or body');
  ids.add(d.id);bodies.add(body);
 }
 return {current,history:[...state.history,state.current],runs:[...state.runs,signature]};
}
export function rollback(state) {
 if(!state.history.length) throw new Error('No previous manifest');
 return {...state,current:state.history.at(-1),history:state.history.slice(0,-1),runs:[]};
}
export function prepareRelease(baseline, proposed, registry, options={}) {
 if(options.paused) throw new Error('Publication paused');
 validateManifest(proposed.current,registry);
 for(const slug of Object.keys(baseline.current)) if(!proposed.current[slug]) throw new Error('Release would remove existing page: '+slug);
 for(const d of Object.values(proposed.current)) {
  const errors=validatePublic(d,{...registry,...options});
  if(errors.length) throw new Error(d.id+': '+errors.join('; '));
 }
 return proposed;
}
export function validateManifest(current,registry={}) {
 const ids=new Set(),bodies=new Set();
 for(const [slug,d] of Object.entries(current)) {
  documentSchema.parse(d);
  if(slug!==d.slug) throw new Error('Manifest key/slug mismatch');
  if(['/blog','/conteudos','/busca','/404','/index'].includes(slug)||slug.startsWith('/blog/pagina/')) throw new Error('Reserved route: '+slug);
  if(legacy.some(r=>r.path===slug)&&registry.legacy_promotions?.[slug]!==d.id) throw new Error('Explicit legacy promotion required: '+slug);
  const body=JSON.stringify(d.body).normalize('NFC').toLowerCase().replace(/\s+/g,' ');
  if(ids.has(d.id)||bodies.has(body)) throw new Error('Duplicate document identity or body');
  ids.add(d.id);bodies.add(body);
 }
}
export async function readPause(file='.organic/control.json') {
 try {const value=JSON.parse(await readFile(file,'utf8'));if(typeof value.paused!=='boolean')throw new Error('Invalid publication control');return value.paused;}
 catch(e){if(e.code==='ENOENT')return false;throw e;}
}
export async function atomicJson(file,value) {
 const {rename}=await import('node:fs/promises'); await mkdir(path.dirname(file),{recursive:true});
 await writeFile(file+'.tmp',JSON.stringify(value,null,2)); await rename(file+'.tmp',file);
}
