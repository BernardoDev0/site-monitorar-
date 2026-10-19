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
 assert.equal(title(await page('/servicos/emissoes-fugitivas')),'Monitoramento de emissões fugitivas no RJ | Monitorar Consultoria');
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
const business=JSON.parse(await readFile('content/business.json','utf8'));
const vercel=JSON.parse(await readFile('vercel.json','utf8'));
const origin='https://www.monitorarconsultoria.com.br';
// Pages of the 2013-2016 site that Wayback archived and that still have a current equivalent.
const legacy={
 '/monitoramento-de-emissoes-fugitivas':'/servicos/emissoes-fugitivas',
 '/engenharia-ambiental':'/servicos',
 '/engenharia-do-trabalho':'/servicos/seguranca',
 '/quem-somos':'/sobre','/missao-e-visao':'/sobre','/nosso-valores':'/sobre',
 '/perfuracao-e-instalacao-de-pocos-de-monitoramento-ambiental':'/servicos'
};
test('service search title and description name Rio de Janeiro while the approved H1 stays unchanged',async()=>{
 const html=await page('/servicos/emissoes-fugitivas');
 assert.equal(title(html),'Monitoramento de emissões fugitivas no RJ | Monitorar Consultoria');
 assert.equal(text(og(html,'og:title')),title(html));
 const description=text(html.match(/<meta name="description" content="([^"]*)"/)[1]);
 assert.match(description,/Rio de Janeiro/);assert.match(description,/LDAR/);assert.ok(description.length<=160,'description '+description.length);
 assert.equal(text(html.match(/<h1[^>]*>([^<]*)<\/h1>/)[1]),'Monitoramento de emissões fugitivas');
});
test('old site URLs redirect permanently, in one hop, to pages that exist today',()=>{
 const rules=vercel.redirects,sources=new Set(rules.map(r=>r.source));
 const hostRule=rules.findIndex(r=>r.has?.some(h=>h.type==='host'));
 for(const [from,to] of Object.entries(legacy)){
  for(const source of [from,from+'.html']){
   const rule=rules.find(r=>r.source===source);
   assert.ok(rule,'missing redirect '+source);
   assert.equal(rule.permanent,true,source);
   assert.equal(rule.destination,origin+to,source);
   assert.ok(rules.indexOf(rule)<hostRule,source+' must precede the apex host rule to avoid a second hop');
  }
  assert.ok(paths.includes(to),to+' must be a live sitemap page');
  assert.ok(!paths.includes(from),from+' must not be a live page');
  assert.ok(!sources.has(to),'redirect chain through '+to);
 }
 for(const source of ['/engenharia-civil','/engenharia-civil.html'])assert.ok(!sources.has(source),source+' has no current equivalent and stays 404');
});
test('service pages show the Rio de Janeiro location block built from business data',async()=>{
 for(const path of ['/servicos/emissoes-fugitivas','/servicos/ruido-extramuros','/servicos/hazop']){
  const html=await page(path);
  assert.match(html,/<section class="editorial-local"/,path);
  assert.ok(html.includes('Atendimento a partir do Rio de Janeiro'),path);
  assert.match(html,/<address/,path);
  assert.ok(html.includes(business.address.streetAddress),path);
  assert.ok(html.includes('(21) 3881-1212'),path);
 }
 assert.ok(!(await page('/blog/o-que-sao-emissoes-fugitivas')).includes('editorial-local'));
});
