import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {loadCorpus,loadRegistry,validatePublic} from '../scripts/editorial.mjs';
test('all 94 approved documents are rendered, canonical, indexable and listed in sitemap',async()=>{
 const docs=await loadCorpus(),registry=await loadRegistry();
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 assert.equal(docs.length,94);assert.equal(docs.filter(d=>d.type==='article').length,90);
 for(const d of docs){
  assert.deepEqual(validatePublic(d,registry),[],d.slug);
  const html=await readFile('dist'+d.slug+'.html','utf8');
  assert.ok(html.includes('content="index, follow"'),d.slug);
  assert.ok(html.includes('href="'+d.canonical_url+'"'),d.slug);
  assert.ok(sitemap.includes('<loc>'+d.canonical_url+'</loc>'),d.slug);
  assert.ok(html.includes('Bernardo Tavares'),d.slug);
  assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,d.slug);
 }
 assert.equal((sitemap.match(/<loc>/g)||[]).length,113);
});
