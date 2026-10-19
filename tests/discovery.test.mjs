import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {indexNowPayload} from '../scripts/indexnow.mjs';
import {seoDescription} from '../scripts/seo-snippets.mjs';
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
 assert.equal(paths.length,123);
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
 assert.equal(payload.urlList.length,123);
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
 assert.equal(vercel.cleanUrls,true);
 const hostRule=rules.findIndex(r=>r.has?.some(h=>h.type==='host'));
 for(const [from,to] of Object.entries(legacy)){
  // cleanUrls redirects /x.html to /x before custom rules run, so an .html rule would be unreachable.
  const rule=rules.find(r=>r.source===from);
  assert.ok(rule,'missing redirect '+from);
  assert.equal(rule.permanent,true,from);
  assert.equal(rule.destination,origin+to,from);
  assert.ok(rules.indexOf(rule)<hostRule,from+' must precede the apex host rule to avoid a second hop');
  assert.ok(!sources.has(from+'.html'),from+'.html is handled by cleanUrls');
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
 assert.doesNotMatch(await page('/blog/o-que-sao-emissoes-fugitivas'),/class="editorial-local"/);
});
test('articles link to the emissions service with the Rio de Janeiro anchor text',async()=>{
 const html=await page('/blog/o-que-sao-emissoes-fugitivas');
 assert.match(html,/<a href="\/servicos\/emissoes-fugitivas">Monitoramento de emissões fugitivas no RJ/);
 assert.doesNotMatch(html,/<a href="\/servicos\/emissoes-fugitivas">Monitoramento de emissões fugitivas<\/a>/);
});
test('service structured data declares the Rio de Janeiro area served, as confirmed for the business scope',async()=>{
 const html=await page('/servicos/emissoes-fugitivas');
 const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const service=graph.find(n=>n['@type']==='Service');
 assert.ok(service,'Service node');
 const names=[].concat(service.areaServed).map(a=>a.name);
 assert.ok(names.includes('Rio de Janeiro'));assert.ok(names.includes('Brasil'));
});
const pngSize=buffer=>{assert.equal(buffer.readUInt32BE(0),0x89504e47,'not a PNG');return [buffer.readUInt32BE(16),buffer.readUInt32BE(20)];};
test('site icons are square, multiples of 48 and declared the way Google documents',async()=>{
 for(const path of ['/','/servicos/emissoes-fugitivas','/blog/o-que-e-ldar']){
  const html=await page(path);
  assert.match(html,/<link rel="icon" type="image\/png" sizes="192x192" href="\/favicon-192\.png"/,path);
  assert.match(html,/<link rel="icon" type="image\/x-icon" sizes="48x48" href="\/favicon\.ico"/,path);
  assert.match(html,/<link rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/,path);
  assert.ok(!/rel="icon"[^>]*sizes="[^"]*\b16x16/.test(html),'a 16x16 favicon is discouraged: '+path);
 }
 assert.deepEqual(pngSize(await readFile('dist/favicon-192.png')),[192,192]);
 assert.deepEqual(pngSize(await readFile('dist/apple-touch-icon.png')),[180,180]);
 const ico=await readFile('dist/favicon.ico'),count=ico.readUInt16LE(4),sizes=Array.from({length:count},(_,i)=>[ico[6+16*i]||256,ico[7+16*i]||256]);
 assert.ok(sizes.every(([w,h])=>w===h),'every ICO image is square: '+JSON.stringify(sizes));
 assert.ok(sizes.some(([w])=>w===48),'the ICO carries a 48x48 image');
 assert.deepEqual(await readFile('dist/simbolo-monitorar.ico'),ico,'the previous icon URL keeps serving the valid icon');
});
const words=html=>html.split('<div id="root">')[1].split('<script id="page-data"')[0].replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ').split(/\s+/).filter(Boolean).length;
const articlePaths=paths.filter(p=>/^\/blog\/[^/]+$/.test(p));
const regions=JSON.parse(await readFile('content/regions.json','utf8'));
const nothingAboutTheOffice=html=>assert.doesNotMatch(html.split('<div id="root">')[1],/escrit[óo]rio|coworking|virtual/i);
test('a dedicated page targets consultoria ambiental no RJ and is linked site-wide',async()=>{
 assert.ok(paths.includes('/consultoria-ambiental-rj'));
 const html=await page('/consultoria-ambiental-rj');
 assert.equal(title(html),'Consultoria ambiental no RJ | Monitorar Consultoria');
 const description=text(html.match(/<meta name="description" content="([^"]*)"/)[1]);
 assert.match(description,/Rio de Janeiro/);assert.ok(description.length<=160,'description '+description.length);
 assert.match(html,/<link rel="canonical" href="https:\/\/www\.monitorarconsultoria\.com\.br\/consultoria-ambiental-rj"/);
 assert.match(html,/<meta name="robots" content="index, follow"/);
 assert.equal(text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].replace(/<[^>]+>/g,'')),'Consultoria e engenharia ambiental no Rio de Janeiro');
 assert.ok(words(html)>=600,'words '+words(html));
 for(const href of ['/servicos/emissoes-fugitivas','/servicos/ruido-extramuros','/conteudos/qualidade-do-ar','/conteudos/areas-impactadas','/conteudos/licenciamento-ambiental','/servicos/seguranca','/clientes','/contato'])assert.ok(html.includes('href="'+href+'"'),href);
 assert.ok(html.includes('2009'));
 for(const path of ['/','/servicos','/blog','/blog/o-que-e-ldar','/servicos/emissoes-fugitivas'])assert.match(await page(path),/href="\/consultoria-ambiental-rj"/,path);
});
test('every article links to that page with varied anchor text that names the service and Rio de Janeiro',async()=>{
 assert.equal(articlePaths.length,90);
 const used=new Map();
 for(const path of articlePaths){
  const html=await page(path);
  assert.match(html,/<section class="editorial-local-cta"/,path);
  const anchor=html.match(/<section class="editorial-local-cta".*?<a href="\/consultoria-ambiental-rj">([^<]*)<\/a>/s)?.[1];
  assert.ok(anchor,path);
  assert.match(text(anchor),/(RJ|Rio de Janeiro)/,path);
  used.set(anchor,(used.get(anchor)||0)+1);
 }
 assert.equal(used.size,3,'three anchor variants');
 for(const [anchor,count] of used)assert.ok(count>=20,anchor+' '+count);
});
test('seoDescription keeps short summaries, ends cleanly and never overruns the result length',()=>{
 assert.equal(seoDescription('Resumo curto','Resumo curto e completo.'),'Resumo curto e completo.');
 const two='Primeira frase completa sobre o tema. '+'Segunda frase bem mais longa que não cabe no que sobra do limite de caracteres permitido aqui para o resultado de busca exibido pelo Google na página.';
 assert.equal(seoDescription('Primeira frase completa sobre o tema',two),'Primeira frase completa sobre o tema.');
 const colon='Em uma campanha de monitoramento, rastreabilidade significa reconstruir como cada observação foi produzida: componente, instrumento, configuração, verificações, operador, momento e procedimento utilizados.';
 assert.equal(seoDescription('Rastreabilidade em campanhas de monitoramento',colon),'Em uma campanha de monitoramento, rastreabilidade significa reconstruir como cada observação foi produzida.');
 assert.equal(seoDescription('Cadeia de custódia','As amostras precisam de registros contínuos.'),'Cadeia de custódia: as amostras precisam de registros contínuos.');
 for(const input of [colon,two,'x '.repeat(300)])assert.ok(seoDescription('Qualquer título',input).length<=155);
 assert.ok(!seoDescription('Palavra',('palavra '.repeat(60)).trim()).includes(', '));
});
test('article descriptions fit the result, end cleanly and stay unique',async()=>{
 const seen=new Set();
 for(const path of articlePaths){
  const description=text((await page(path)).match(/<meta name="description" content="([^"]*)"/)[1]);
  assert.ok(description.length>=60&&description.length<=155,path+' '+description.length);
  assert.match(description,/[.!?]$/,path);
  assert.ok(!seen.has(description),'duplicate description '+path);seen.add(description);
 }
});
test('the by-state page covers every authorised state with its official environmental agency',async()=>{
 assert.ok(paths.includes('/consultoria-ambiental-por-estado'));
 const html=await page('/consultoria-ambiental-por-estado');
 assert.equal(title(html),'Consultoria ambiental por estado | Monitorar Consultoria');
 const description=text(html.match(/<meta name="description" content="([^"]*)"/)[1]);
 assert.ok(description.length<=160&&description.length>=100,'description '+description.length);
 assert.equal(text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].replace(/<[^>]+>/g,'')),'Consultoria ambiental por estado: onde a Monitorar atende projetos');
 assert.ok(words(html)>=550,'words '+words(html));
 assert.equal(regions.length,11);
 for(const r of regions){
  assert.ok(html.includes('Consultoria ambiental em '+r.name),r.uf);
  assert.ok(html.includes(r.acronym),r.uf);
  assert.ok(html.includes('href="'+r.url+'"'),r.uf);
 }
 for(const href of ['/consultoria-ambiental-rj','/contato','/servicos'])assert.ok(html.includes('href="'+href+'"'),href);
 assert.match(await page('/consultoria-ambiental-rj'),/href="\/consultoria-ambiental-por-estado"/);
 assert.match(await page('/'),/href="\/consultoria-ambiental-por-estado"/);
});
test('no published page mentions the office arrangement',async()=>{
 for(const path of ['/consultoria-ambiental-rj','/consultoria-ambiental-por-estado','/contato','/sobre','/servicos/emissoes-fugitivas'])nothingAboutTheOffice(await page(path));
});
