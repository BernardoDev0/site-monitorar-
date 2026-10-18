import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {loadCorpus,validateManifest,publicDocument,readPause} from '../scripts/editorial.mjs';
import {editorialPages} from '../scripts/editorial-pages.mjs';
import {startServer} from '../scripts/serve.mjs';

test('pagination: 0, 1, 12, 13, 25 articles; no service mixed into blog',()=>{
 for(const n of [0,1,12,13,25]){
  const docs=Array.from({length:n},(_,i)=>({id:String(i).padStart(3,'0'),slug:'/blog/example-'+i,type:'article',title:'Example '+i}));
  docs.push({id:'service',slug:'/servicos/example',type:'service'});
  const pages=editorialPages(docs),blog=pages.filter(p=>p.type==='listing');
  assert.equal(blog.length,Math.max(1,Math.ceil(n/12)));
  assert.equal(blog.flatMap(p=>p.entries).length,n);
  assert.equal(blog[0].noindex,n===0);
  assert.equal(blog[0].slug,'/blog');
  assert.ok(blog.every(p=>p.entries.length<=12));
  assert.ok(pages.find(p=>p.slug==='/busca').noindex);
 }
});
test('manifest rejects mismatched keys, duplicate IDs, duplicate bodies and reserved routes',async()=>{
 const [d]=await loadCorpus();
 assert.throws(()=>validateManifest({'/wrong':d}),/mismatch/);
 const other={...d,slug:'/blog/other',body:[...d.body,{heading:'Different',paragraphs:['This is a different paragraph for the test fixture.']}]};
 assert.throws(()=>validateManifest({[d.slug]:d,[other.slug]:other}),/Duplicate/);
 assert.throws(()=>validateManifest({[d.slug]:d,[other.slug]:{...other,id:'other',body:d.body}}),/Duplicate/);
 for(const slug of ['/blog','/conteudos','/busca','/blog/pagina/2'])assert.throws(()=>validateManifest({[slug]:{...d,slug}}),/Reserved/);
 const promoted={...d,slug:'/servicos/hazop'};
 assert.throws(()=>validateManifest({[promoted.slug]:promoted}),/promotion/);
 assert.doesNotThrow(()=>validateManifest({[promoted.slug]:promoted},{legacy_promotions:{[promoted.slug]:d.id}}));
});
test('unauthorized names never appear in public projection',async()=>{
 const [d]=await loadCorpus();d.author_id='hidden';d.reviewer_id='hidden';
 const projected=publicDocument(d,{people:{hidden:{name:'Private name',authorized:false}}});
 assert.equal(projected.author,null);assert.equal(projected.reviewer,null);
});
test('pause fails closed on invalid JSON or missing boolean',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'monitorar-control-'));const file=path.join(dir,'control.json');
 try{assert.equal(await readPause(file),false);for(const body of ['{','{}','{"paused":"false"}']){await writeFile(file,body);await assert.rejects(readPause(file));}await writeFile(file,'{"paused":true}');assert.equal(await readPause(file),true);}finally{await rm(dir,{recursive:true});}
});
test('published blog is indexable and search remains noindex; normalized index and page 1 redirect',async()=>{
 const server=await startServer('dist',0),base='http://127.0.0.1:'+server.address().port;
 try{
  for(const route of ['/blog','/conteudos','/busca']){const r=await fetch(base+route);assert.equal(r.status,200);assert.ok((await r.text()).includes('content="'+(route==='/busca'?'noindex, follow':'index, follow')+'"'));}
  for(const [route,destination] of [['/index.html','/'],['/index','/'],['/blog/pagina/1','/blog']]){const r=await fetch(base+route,{redirect:'manual'});assert.equal(r.status,308);assert.equal(r.headers.get('location'),destination);}
  assert.equal((await fetch(base+'/blog/pagina/2')).status,200);
  const index=await (await fetch(base+'/search-index.json')).json();
  assert.ok(index.some(d=>d.slug==='/contato'));
  assert.ok(index.some(d=>d.slug==='/servicos/drager'));
  assert.equal(index.filter(d=>d.slug.startsWith('/blog/')).length,90);
  assert.ok(index.some(d=>d.slug==='/blog/o-que-sao-emissoes-fugitivas'));
  const sitemap=await readFile('dist/sitemap.xml','utf8');for(const route of ['/blog','/conteudos','/busca'])assert.equal(sitemap.includes(route+'</loc>'),route!=='/busca');
 }finally{await new Promise(r=>server.close(r));}
});
