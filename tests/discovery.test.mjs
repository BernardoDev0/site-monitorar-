import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {indexNowPayload} from '../scripts/indexnow.mjs';
const integrations=JSON.parse(await readFile('content/site-integrations.json','utf8'));
const sitemap=await readFile('dist/sitemap.xml','utf8');
const paths=[...sitemap.matchAll(/<loc>https:\/\/www\.monitorarconsultoria\.com\.br(.*?)<\/loc>/g)].map(m=>m[1]);
const page=path=>readFile('dist'+(path==='/'?'/index.html':path+'.html'),'utf8');
const text=s=>s.replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&amp;','&');
const title=html=>text(html.match(/<title>([^<]*)<\/title>/)[1]);
const og=(html,property)=>html.match(new RegExp('<meta property="'+property+'" content="([^"]*)"'))?.[1];
test('full brand name accompanies home and emissions titles',async()=>{
 assert.match(title(await page('/')),/\| Monitorar Consultoria$/);
 assert.equal(title(await page('/servicos/emissoes-fugitivas')),'Monitoramento de emissões fugitivas | Monitorar Consultoria');
 assert.equal(title(await page('/conteudos/emissoes-fugitivas')),'Conhecimento sobre emissões fugitivas | Monitorar Consultoria');
});
test('every sitemap page names the site, keeps a unique branded title and stays short with the full brand',async()=>{
 assert.equal(paths.length,121);
 const titles=new Set();
 for(const path of paths){
  const html=await page(path),t=title(html);
  assert.equal(og(html,'og:site_name'),'Monitorar Consultoria',path);
  assert.equal(og(html,'og:locale'),'pt_BR',path);
  assert.match(t,/Monitorar/,path);
  if(t.endsWith(' | Monitorar Consultoria'))assert.ok(t.length<=65,path+' '+t.length);
  assert.ok(!titles.has(t),'duplicate title '+t);titles.add(t);
 }
});
test('IndexNow key is published only by the public build',async()=>{
 const key=integrations.INDEXNOW_KEY;
 assert.match(key,/^[A-Za-z0-9-]{8,128}$/);
 assert.equal(await readFile('dist/'+key+'.txt','utf8'),key);
 await assert.rejects(access('dist-preview/'+key+'.txt'));
});
test('IndexNow payload carries only canonical sitemap URLs',()=>{
 const key=integrations.INDEXNOW_KEY,payload=indexNowPayload(sitemap,key);
 assert.equal(payload.host,'www.monitorarconsultoria.com.br');
 assert.equal(payload.keyLocation,'https://www.monitorarconsultoria.com.br/'+key+'.txt');
 assert.equal(payload.urlList.length,121);
 assert.throws(()=>indexNowPayload('<loc>https://example.org/</loc>',key));
 assert.throws(()=>indexNowPayload('<urlset></urlset>',key));
});
