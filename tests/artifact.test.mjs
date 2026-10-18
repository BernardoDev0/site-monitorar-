import test from 'node:test';import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';import path from 'node:path';
import {legacy} from '../scripts/routes.mjs';import {startServer} from '../scripts/serve.mjs';
import {schemaFor} from '../scripts/schema.mjs';
import {loadCorpus} from '../scripts/editorial.mjs';
test('legacy HTML, canonical, language and sitemap agree',async()=>{
 const sitemap=await readFile('dist/sitemap.xml','utf8');
 for(const row of legacy.filter(r=>r.path!=='/servicos/hazop')){const html=await readFile(path.join('dist',row.path==='/'?'index.html':row.path.slice(1)+'.html'),'utf8');
 assert.match(html,/<html lang="pt-BR">/);assert.match(html,/<h1[\s>]/);assert.ok(html.includes('href="https://www.monitorarconsultoria.com.br'+row.canonical+'"'));
 assert.equal(sitemap.includes('<loc>https://www.monitorarconsultoria.com.br'+row.path+'</loc>'),row.path===row.canonical);
 }
});

test('preview corpus is noindex, internally linked and reachable from its index',async()=>{
 const server=await startServer('dist-preview',0),base='http://127.0.0.1:'+server.address().port;
 try {
  const index=(await (await fetch(base+'/conteudos')).text())+(await (await fetch(base+'/blog')).text())+JSON.stringify(await (await fetch(base+'/search-index.json')).json());
  for(const d of await loadCorpus()) {
   assert.ok(index.includes(d.slug));
   const response=await fetch(base+d.slug);assert.equal(response.status,200);assert.match(response.headers.get('x-robots-tag'),/noindex/);
   const html=await response.text();assert.match(html,/<meta name="robots" content="noindex, nofollow"/);
   assert.equal((html.match(/<h1[\s>]/g)||[]).length,1);
   for(const [,href] of html.matchAll(/href="(\/[^"#]*)(?:#[^"]*)?"/g)) {const linked=await fetch(base+href,{method:"HEAD"});assert.equal(linked.status,200,d.slug+' -> '+href);}
  }
  assert.match(await readFile('dist-preview/robots.txt','utf8'),/Disallow: \//);
  assert.doesNotMatch(await readFile('dist/robots.txt','utf8'),/Disallow: \/\s*(?:\n|$)/);
 } finally {await new Promise(r=>server.close(r));}
});

test('schema graph uses visible breadcrumb and only approved article or service entities',()=>{
 const page={slug:'/blog/example',title:'Example fixture',summary:'Fixture summary',type:'article',author:'Fixture Author',substantive_updated_at:'2026-10-15T00:00:00.000Z'};
 const graph=schemaFor({page},false)['@graph'];
 assert.deepEqual(graph.map(x=>x['@type']),['Organization','WebSite','BreadcrumbList','Article']);
 assert.equal(graph[2].itemListElement[1].name,page.title);
 assert.ok(!schemaFor({page},true)['@graph'].some(x=>x['@type']==='Article'));
 assert.ok(schemaFor({page:{...page,type:'service'}},false)['@graph'].some(x=>x['@type']==='Service'));
});
test('credentials are excluded from public artifacts',async()=>{
 const forbidden=['graph.instagram.com','access_token='];
 async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await scan(p);else if(/\.(html|js|json|map|xml|txt)$/.test(p)){const t=await readFile(p,'utf8');for(const value of forbidden)assert.ok(!t.includes(value),p+' includes forbidden marker');}}}
 await scan('dist');
});
test('HTTP contract: known 200, normalized 308, missing and draft 404',async()=>{
 const server=await startServer('dist',0);const base='http://127.0.0.1:'+server.address().port;
 try{for(const [url,status] of [['/sobre',200],['/contato',200],['/sobre/?x=1',308],['/sobre.html',308],['/missing',404],['/blog/o-que-sao-emissoes-fugitivas',200],['/missing.png',404]]){
 const r=await fetch(base+url,{redirect:'manual'});assert.equal(r.status,status,url);if(status===404)assert.match(await r.text(),/noindex/);if(url.includes('?'))assert.equal(r.headers.get('location'),'/sobre?x=1');
 }assert.match((await fetch(base+'/sitemap.xml')).headers.get('content-type'),/xml/);}finally{await new Promise(r=>server.close(r));}
});

test('every public HTML internal link and image resolves',async()=>{
 const server=await startServer('dist',0),base='http://127.0.0.1:'+server.address().port;
 const links=new Set();
 async function scan(dir){for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await scan(p);else if(p.endsWith('.html')){const html=await readFile(p,'utf8');for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g))links.add(href);}}}
 try{await scan('dist');for(const href of links)assert.equal((await fetch(base+href,{method:"HEAD"})).status,200,href);}finally{await new Promise(r=>server.close(r));}
});
