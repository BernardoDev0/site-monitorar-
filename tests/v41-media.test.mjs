import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {loadSiteData,safeJson} from '../scripts/page-data.mjs';

test('visual enrichment preserves publication boundary and draft exclusion',async()=>{
 const publicData=await loadSiteData(false),preview=await loadSiteData(true);
 const articles=preview.documents.filter(d=>d.type==='article');
 assert.equal(articles.length,90);
 assert.equal(publicData.candidates.length,0);
 assert.equal(publicData.content.length,0);
 assert.ok(articles.every(d=>!safeJson(publicData).includes(d.title)));
 assert.ok(publicData.documents.filter(d=>d.type==='listing').every(d=>!d.entries.length));
});

test('all eight blog pages preserve exact article membership with valid cover assets',async()=>{
 const data=await loadSiteData(true),articles=data.documents.filter(d=>d.type==='article');
 const pages=data.documents.filter(d=>d.type==='listing');
 assert.equal(pages.length,8);
 const listed=pages.flatMap(p=>p.entries.map(d=>d.slug));
 assert.equal(listed.length,90);assert.equal(new Set(listed).size,90);
 assert.deepEqual([...listed].sort(),articles.map(d=>d.slug).sort());
 for(const page of pages)assert.equal(page.entries.length,page.pageNumber===8?6:12);
 for(const doc of articles){
  assert.ok(doc.cover.src.startsWith('/media/'));
  await access('public'+doc.cover.src);
  assert.ok(doc.cover.width>0&&doc.cover.height>0&&doc.cover.caption);
 }
});

test('existing collection is not mislabeled as generated imagery',async()=>{
 const data=await loadSiteData(true);
 const manifest=JSON.parse(await readFile('content/editorial-media.json','utf8'));
 for(const doc of data.documents.filter(d=>d.type==='article')){
  if(!manifest.articles[doc.slug])assert.equal(doc.cover.status,'existing-collection');
 }
});


test('public search includes institutional destinations and existing home offerings without draft text',async()=>{
 const data=await loadSiteData(false);
 assert.ok(data.search.some(d=>d.slug==='/contato'));
 const home=data.search.find(d=>d.slug==='/');
 assert.match(home.searchText,/emissões fugitivas/);
 const source=await readFile('src/components/home/OfferingsSection.tsx','utf8');
 assert.ok(source.includes('Programa de detecção e reparo de vazamentos para redução de emissões fugitivas.'));
 assert.ok(data.search.every(d=>d.topic_cluster==='institucional'));
 assert.equal(new Set(data.search.map(d=>d.slug)).size,data.search.length);
});
