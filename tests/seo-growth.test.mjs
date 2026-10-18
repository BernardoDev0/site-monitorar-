import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadRegistry,validatePublic,validatePublished,maintenanceIssues,prepareRelease} from '../scripts/editorial.mjs';
import {loadSiteData} from '../scripts/page-data.mjs';
import {topics,business} from '../scripts/seo-data.mjs';
import {schemaFor} from '../scripts/schema.mjs';
import {checkSource,sourceHosts} from '../scripts/source-check.mjs';
import {verificationMeta} from '../scripts/site-verification.mjs';
const state=JSON.parse(await readFile('content/published.json','utf8'));
const receipts=JSON.parse(await readFile('content/publication-receipts.json','utf8'));
const registry=await loadRegistry();
test('future source checks and reviews are maintenance, never silent unpublication',()=>{
 const now=new Date('2027-12-01T00:00:00Z');
 for(const d of Object.values(state.current)){
  assert.deepEqual(validatePublished(d,registry,receipts[d.slug],{now}),[]);
  assert.ok(validatePublic(d,{...registry,now}).length);
  assert.ok(maintenanceIssues(d,registry,now).length);
 }
 assert.equal(prepareRelease(state,state,registry,{now,receipts}),state);
});
test('receipt still blocks material changes, revoked authorization, evidence and corrupt approval',()=>{
 const original=Object.values(state.current)[0];
 for(const mutate of [d=>d.body[0].paragraphs[0]+=' Alteração posterior.',d=>d.approved_version='changed',d=>d.first_published_at=null,d=>d.canonical_url='https://example.org']){
  const d=structuredClone(original);mutate(d);assert.ok(validatePublished(d,registry,receipts[d.slug]).length);
 }
 const r=structuredClone(registry);r.people[original.reviewer_id].authorized=false;
 assert.ok(validatePublished(original,r,receipts[original.slug]).length);
 const e=structuredClone(registry);e.evidence[original.evidence_ids[0]].approved=false;
 assert.ok(validatePublished(original,e,receipts[original.slug]).length);
 assert.ok(validatePublished(original,registry,null).length);
});
test('unavailable or changed live sources cannot approve new material but retain immutable published version',()=>{
 const d=Object.values(state.current)[0],r=structuredClone(registry);
 r.sources[d.source_urls[0]].available=false;r.sources[d.source_urls[0]].hash='changed';
 assert.ok(validatePublic(d,r).length);assert.deepEqual(validatePublished(d,r,receipts[d.slug]),[]);
 assert.ok(maintenanceIssues(d,r).some(x=>x.startsWith('source changed')));
});
test('nine topics cover every article exactly once and every article links to a real service',async()=>{
 const data=await loadSiteData();const slugs=new Set(data.rows.map(r=>r.path)),articles=data.documents.filter(d=>d.type==='article'),members=[];
 assert.equal(topics.length,9);
 for(const topic of topics){const page=data.documents.find(d=>d.slug===topic.slug);assert.ok(page);const entries=page.topicEntries||page.entries;assert.ok(entries.length);members.push(...entries.map(e=>e.slug));}
 assert.deepEqual(members.sort(),articles.map(d=>d.slug).sort());
 for(const d of articles){assert.ok(d.services.length,d.slug);assert.ok(d.related.length);assert.ok(slugs.has(d.topic.slug));
  const html=await readFile('dist'+d.slug+'.html','utf8');
  for(const s of d.services){assert.ok(slugs.has(s.slug.split('#')[0]),s.slug);assert.notEqual(s.slug.split('#')[0],d.slug);assert.ok(html.includes('href="'+s.slug+'"'));}
 }
});
test('all service anchors actually exist and all topics are in the sitemap',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 for(const t of topics){assert.ok(sitemap.includes(t.slug+'</loc>'));const [slug,anchor]=t.service.split('#');if(anchor)assert.ok((await readFile('dist'+slug+'.html','utf8')).includes('id="'+anchor+'"'));}
});
test('article schema uses real dates and cover; company data matches its public identity',async()=>{
 const data=await loadSiteData(),row=data.rows.find(r=>r.page?.type==='article');const graph=schemaFor(row)['@graph'];
 const org=graph.find(d=>d['@type']==='Organization'),article=graph.find(d=>d['@type']==='BlogPosting');
 assert.equal(org.telephone,business.phone);assert.deepEqual(org.sameAs,business.sameAs);assert.equal(org.address.addressLocality,'Rio de Janeiro');
 assert.equal(article.datePublished,state.current[row.path].first_published_at);assert.equal(article.image,business.url+row.page.cover.src);
 const breadcrumb=graph.find(d=>d['@type']==='BreadcrumbList');assert.equal(breadcrumb.itemListElement[1].name,'Blog');
 assert.equal(breadcrumb.itemListElement.at(-1).name,row.page.title);
});
test('source checker permits corpus hosts, rejects unsafe redirects and reports HTTP failures',async()=>{
 for(const d of Object.values(state.current))for(const url of d.source_urls)assert.ok(sourceHosts.has(new URL(url).hostname));
 const good=await checkSource('https://www.epa.gov/test',{fetcher:async()=>new Response('source',{status:200})});assert.ok(good.available&&good.hash);
 let calls=0;const blocked=await checkSource('https://www.epa.gov/test',{fetcher:async()=>{calls++;return new Response(null,{status:302,headers:{location:'http://127.0.0.1/private'}});}});assert.equal(calls,1);assert.equal(blocked.available,false);
 const missing=await checkSource('https://www.epa.gov/test',{fetcher:async()=>new Response(null,{status:404})});assert.equal(missing.status,404);assert.equal(missing.available,false);
});
test('site verification is optional and rejects injected markup',()=>{
 assert.equal(verificationMeta({}),'');
 assert.match(verificationMeta({GOOGLE_SITE_VERIFICATION:'real_token_12345'}),/google-site-verification/);
 assert.match(verificationMeta({BING_SITE_VERIFICATION:'1234567890abcdef'}),/msvalidate.01/);
 assert.throws(()=>verificationMeta({GOOGLE_SITE_VERIFICATION:'"><script>bad</script>'}));
});
