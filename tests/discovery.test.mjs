import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {indexNowPayload} from '../scripts/indexnow.mjs';
import {seoDescription} from '../scripts/seo-snippets.mjs';
import {readSitemap} from '../scripts/sitemaps.mjs';
import {loadSiteData} from '../scripts/page-data.mjs';
const integrations=JSON.parse(await readFile('content/site-integrations.json','utf8'));
const sitemap=await readSitemap();
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
 assert.equal(paths.length,127);
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
test('robots.txt has one group for every crawler, allows everything and names the sitemap',async()=>{
 assert.equal(await readFile('dist/robots.txt','utf8'),'User-agent: *\nAllow: /\n\nSitemap: https://www.monitorarconsultoria.com.br/sitemap.xml\n');
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
 assert.equal(payload.urlList.length,127);
 assert.throws(()=>indexNowPayload('<loc>https://example.org/</loc>',key));
 assert.throws(()=>indexNowPayload('<urlset></urlset>',key));
});
const ORIGIN='https://www.monitorarconsultoria.com.br';
const locs=xml=>[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
const children={page:await readFile('dist/page-sitemap.xml','utf8').catch(()=>''),post:await readFile('dist/post-sitemap.xml','utf8').catch(()=>''),category:await readFile('dist/category-sitemap.xml','utf8').catch(()=>'')};
test('sitemap.xml is an index of the page, post and category sitemaps',async()=>{
 const index=await readFile('dist/sitemap.xml','utf8');
 assert.match(index,/^<\?xml[^>]*\?><sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
 assert.deepEqual(locs(index),['page','post','category'].map(name=>ORIGIN+'/'+name+'-sitemap.xml'));
 for(const [name,xml] of Object.entries(children)){
  const dates=[...xml.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map(m=>m[1]);
  const newest=dates.reduce((a,b)=>Date.parse(b)>Date.parse(a)?b:a);
  assert.ok(index.includes('<sitemap><loc>'+ORIGIN+'/'+name+'-sitemap.xml</loc><lastmod>'+newest+'</lastmod></sitemap>'),name+' child lastmod must be its newest URL date '+newest);
 }
});
test('articles live only in the post sitemap, listings in the category sitemap, everything else in the page sitemap',async()=>{
 const of=name=>locs(children[name]).map(u=>u.slice(ORIGIN.length)||'/');
 const post=of('post'),category=of('category'),pages=of('page');
 assert.ok(post.length===90&&post.every(p=>/^\/blog\/(?!pagina\/)[^/]+$/.test(p)),'post sitemap: the articles only');
 assert.ok(category.every(p=>/^\/(blog|conteudos)(\/pagina\/\d+|\/[^/]+)?$/.test(p)&&!post.includes(p)),'category sitemap: blog pages and subjects only');
 for(const p of ['/blog','/blog/pagina/2','/conteudos','/conteudos/emissoes-fugitivas','/conteudos/licenciamento-ambiental'])assert.ok(category.includes(p),p);
 for(const p of ['/','/emissoes-fugitivas','/consultoria-ambiental','/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am','/consultoria-ambiental-por-estado','/servicos/emissoes-fugitivas'])assert.ok(pages.includes(p),p);
 const all=[...pages,...post,...category];
 assert.equal(new Set(all).size,all.length,'no URL in two sitemaps');
 const {rows}=await loadSiteData(false);
 const expected=rows.filter(r=>r.canonical===r.path&&r.path!=='/404'&&!r.page?.noindex).map(r=>r.path);
 assert.deepEqual([...all].sort(),[...expected].sort());
});
test('no sitemap carries priority or changefreq',async()=>{
 for(const xml of [await readFile('dist/sitemap.xml','utf8'),...Object.values(children)])assert.doesNotMatch(xml,/<priority>|<changefreq>/);
});
test('IndexNow refuses a sitemap index and submits the URLs of its children',async()=>{
 const key=integrations.INDEXNOW_KEY,index=await readFile('dist/sitemap.xml','utf8');
 assert.throws(()=>indexNowPayload(index,key),/index/i);
 assert.equal(indexNowPayload(sitemap,key).urlList.length,locs(sitemap).length);
 assert.equal(locs(sitemap).length,Object.values(children).reduce((n,xml)=>n+locs(xml).length,0));
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
 assert.equal(regions.length,27);
 for(const r of regions){
  assert.ok(html.includes('Consultoria ambiental '+r.in+' ('+r.uf+')'),r.uf);
  assert.ok(html.includes(r.acronym),r.uf);
  if(r.url)assert.ok(html.includes('href="'+r.url+'"'),r.uf);else assert.ok(!html.includes('portal oficial do '+r.acronym),r.uf);
 }
 assert.ok(html.includes('qualquer estado'));
 for(const href of ['/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am','/contato','/servicos'])assert.ok(html.includes('href="'+href+'"'),href);
 assert.match(await page('/consultoria-ambiental-rj'),/href="\/consultoria-ambiental-por-estado"/);
 assert.match(await page('/'),/href="\/consultoria-ambiental-por-estado"/);
});
test('no published page mentions the office arrangement',async()=>{
 for(const path of ['/consultoria-ambiental-rj','/consultoria-ambiental-por-estado','/contato','/sobre','/servicos/emissoes-fugitivas'])nothingAboutTheOffice(await page(path));
});
test('the home page no longer limits the company to Rio de Janeiro',async()=>{
 const html=await page('/');
 assert.equal(title(html),'Consultoria e engenharia ambiental | Monitorar Consultoria');
 assert.equal(text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].replace(/<[^>]+>/g,'')),'Engenharia e consultoria ambiental em todo o Brasil');
 const description=text(html.match(/<meta name="description" content="([^"]*)"/)[1]);
 assert.ok(description.length<=160&&description.length>=100,'description '+description.length);
 assert.match(description,/qualquer estado/);assert.match(description,/RJ, SP e Amazonas/);
 const body=html.split('<div id="root">')[1];
 assert.match(body,/qualquer estado do Brasil/);assert.match(body,/no RJ, em São Paulo e no Amazonas/);
 for(const path of ['/','/consultoria-ambiental-rj','/consultoria-ambiental-por-estado','/blog/o-que-e-ldar'])assert.doesNotMatch(await page(path),/e em outras regiões do Brasil/,path);
});
test('São Paulo and Amazonas have their own pages as principal states',async()=>{
 const pages=[['/consultoria-ambiental-sp','Consultoria ambiental em São Paulo | Monitorar Consultoria','Consultoria e engenharia ambiental em São Paulo','CETESB','https://cetesb.sp.gov.br/'],['/consultoria-ambiental-am','Consultoria ambiental no Amazonas | Monitorar Consultoria','Consultoria e engenharia ambiental no Amazonas','IPAAM','https://www.ipaam.am.gov.br/']];
 for(const [path,expectedTitle,h1,acronym,agencyUrl] of pages){
  assert.ok(paths.includes(path),path);
  const html=await page(path);
  assert.equal(title(html),expectedTitle);
  assert.equal(text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].replace(/<[^>]+>/g,'')),h1);
  assert.match(html,new RegExp('<link rel="canonical" href="https://www\.monitorarconsultoria\.com\.br'+path+'"'));
  assert.ok(words(html)>=500,path+' words '+words(html));
  assert.ok(html.includes(acronym),path);assert.ok(html.includes('href="'+agencyUrl+'"'),path);
  assert.ok(html.includes('principal'),path);
  for(const href of ['/consultoria-ambiental-rj','/consultoria-ambiental-por-estado','/contato','/servicos/emissoes-fugitivas'])assert.ok(html.includes('href="'+href+'"'),path+' '+href);
  nothingAboutTheOffice(html);
  assert.match(await page('/'),new RegExp('href="'+path+'"'),'linked from every page: '+path);
 }
});
test('every article names the three principal states and links to their pages',async()=>{
 for(const path of articlePaths){
  const html=await page(path),block=html.match(/<section class="editorial-local-cta".*?<\/section>/s)?.[0]||'';
  assert.match(block,/qualquer estado/,path);
  for(const href of ['/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am'])assert.ok(block.includes('href="'+href+'"'),path+' '+href);
 }
});
test('structured data lists the principal states served',async()=>{
 const graph=JSON.parse((await page('/servicos/emissoes-fugitivas')).match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const names=[].concat(graph.find(n=>n['@type']==='Service').areaServed).map(a=>a.name);
 for(const name of ['Rio de Janeiro','São Paulo','Amazonas','Brasil'])assert.ok(names.includes(name),name);
});
const guidePath='/emissoes-fugitivas';
const oldFaqPath='/emissoes-fugitivas-perguntas-e-respostas';
const consultingPath='/consultoria-ambiental';
const clusterSlugs=['o-que-sao-emissoes-fugitivas','emissoes-fugitivas-e-canalizadas','tanques-vedacoes-e-classificacao-de-fontes-fugitivas','substancias-e-condicoes-na-deteccao-de-vazamentos','inventario-de-gee-e-monitoramento-de-emissoes-fugitivas','deteccao-e-quantificacao-de-emissoes-fugitivas','ogi-e-analisadores-na-deteccao-de-vazamentos','epa-method-21-contexto-e-limites','ppm-e-taxa-de-emissao-por-que-nao-sao-equivalentes','condicoes-meteorologicas-em-campanhas-de-emissoes-fugitivas','calibracao-e-rastreabilidade-de-dados-ldar','o-que-e-ldar','cadastro-de-componentes-para-ldar','componentes-sem-acesso-em-programas-ldar','criterios-de-vazamento-e-gatilhos-de-acao-ldar','reparo-e-reverificacao-em-programas-ldar','registro-de-vazamentos-em-programas-ldar','indicadores-de-programas-ldar','mudancas-na-planta-e-atualizacao-do-programa-ldar','qualidade-e-aceite-de-dados-de-campanhas-ldar','como-contratar-monitoramento-de-emissoes-fugitivas','dados-para-orcamento-de-emissoes-fugitivas','planejamento-de-campanha-de-emissoes-fugitivas','como-ler-relatorio-de-emissoes-fugitivas','comparacao-entre-campanhas-de-emissoes-fugitivas','emissoes-fugitivas-petrobras'].map(slug=>'/blog/'+slug);
const metaDescription=html=>text(html.match(/<meta name="description" content="([^"]*)"/)[1]);
const h1Of=html=>text(html.match(/<h1[^>]*>(.*?)<\/h1>/s)[1].replace(/<[^>]+>/g,''));
const headings=(html,tag)=>[...html.split('<div id="root">')[1].matchAll(new RegExp('<'+tag+'[^>]*>([^<]*)</'+tag+'>','g'))].map(m=>text(m[1]));
const graphOf=html=>JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
function guideStructuredData(html,expectedQuestions){
 const graph=graphOf(html);
 const article=graph.find(n=>n['@type']==='Article');
 assert.ok(article&&article.headline&&article.dateModified&&article.publisher,'Article node');
 if(expectedQuestions===9)assert.match(article.image||'',/^https:\/\/www\.monitorarconsultoria\.com\.br\/media\/photos-v41\/04-/,'Article image');
 const crumbs=graph.find(n=>n['@type']==='BreadcrumbList');
 assert.ok(crumbs&&crumbs.itemListElement.length===2,'BreadcrumbList with home and the guide');
 const faq=graph.find(n=>n['@type']==='FAQPage');
 assert.ok(faq,'FAQPage node');
 assert.ok(faq.mainEntity.length>=expectedQuestions,'FAQ size '+faq.mainEntity.length);
 const visible=headings(html,'h3');
 for(const item of faq.mainEntity){assert.ok(visible.includes(item.name),'visible question '+item.name);assert.ok(item.acceptedAnswer.text.length>60);assert.ok(!/\[\[|\]\]/.test(item.acceptedAnswer.text));}
}
test('the emissions guide is the single page for the head term: title, sourced sections, FAQ data and the whole cluster',async()=>{
 assert.ok(paths.includes(guidePath));
 assert.ok(!paths.includes(oldFaqPath),'the old Q&A address is only a redirect');
 const html=await page(guidePath);
 assert.equal(title(html),'Emissões fugitivas: o que são, fontes e LDAR | Monitorar');
 const description=metaDescription(html);
 assert.ok(description.length>=100&&description.length<=160,'description '+description.length);
 assert.match(description,/emissões fugitivas/i);assert.match(description,/LDAR/);
 assert.match(h1Of(html),/^Emissões fugitivas/);
 assert.ok(words(html)>=1800,'words '+words(html));
 const body=html.split('<div id="root">')[1];
 const h2=headings(html,'h2');
 for(const heading of ['Em resumo','O que são emissões fugitivas','Emissão fugitiva e emissão pontual','De onde vêm as emissões fugitivas','Por que controlar as emissões fugitivas','Como as emissões fugitivas são detectadas','Detectar não é quantificar','LDAR: o programa de detecção e reparo de vazamentos','Emissões fugitivas no Rio de Janeiro','Termos usados','Perguntas frequentes','Fontes'])assert.ok(h2.includes(heading),'H2 '+heading);
 assert.equal(h2.indexOf('Em resumo'),0,'the summary comes first');
 const summary=body.match(/<section id="em-resumo"[\s\S]*?<\/section>/)[0];
 const anchors=[...summary.matchAll(/<li>[\s\S]*?href="#([a-z0-9-]+)"/g)].map(m=>m[1]);
 assert.equal(anchors.length,6,'six summary points, each pointing to its section');
 for(const id of anchors)assert.ok(body.includes('id="'+id+'"'),'summary anchor #'+id);
 assert.match(body,/potencial de aquecimento global \(GWP\) de 27 a 30 em 100 anos/);
 assert.ok(body.includes('href="https://www.epa.gov/ghgemissions/understanding-global-warming-potentials"'),'EPA GWP source');
 const glossary=body.match(/<section id="termos"[\s\S]*?<\/section>/)[0];
 for(const term of ['Compostos orgânicos voláteis (COV)','Concentração de definição de vazamento','Fonte fixa de emissão','Emissão pontual','Emissão fugitiva','Escopo 1','Escopo 2','LDAR'])assert.ok(glossary.includes('<dt>'+term+'</dt>'),'glossary '+term);
 assert.match(glossary,/ponto de ebulição de até 130 °C/);
 assert.match(body,/<p class="guide-byline">Monitorar Consultoria · Publicado em 19\/10\/2026 · Atualizado em \d{2}\/\d{2}\/2026<\/p>/);
 const figure=body.match(/<figure class="guide-figure">[\s\S]*?<\/figure>/)[0];
 assert.match(figure,/<img[^>]+alt="Técnico com detector portátil de gases[^"]+"/);assert.match(figure,/\/media\/photos-v41\/04-/);
 assert.match(figure,/<figcaption>Imagem ilustrativa do acervo existente da Monitorar\.<\/figcaption>/);
 assert.match(body,/lançamento difuso na atmosfera de qualquer forma de matéria sólida, líquida ou gasosa, efetuado por uma fonte desprovida de dispositivo projetado para dirigir ou controlar seu fluxo/);
 for(const fact of ['63%','56%','mais de 90%','10.000 tCO2eq','Lei Estadual nº 5.690','NOP-INEA-52','ABNT NBR ISO 14064','cinco elementos'])assert.ok(body.includes(fact),'fact '+fact);
 for(const url of ['https://www.epa.gov/sites/default/files/2014-02/documents/ldarguide.pdf','https://www.epa.gov/emc/method-21-volatile-organic-compound-leaks','https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_4_Ch4_Fugitive_Emissions.pdf','https://www.inea.rj.gov.br/wp-content/uploads/2022/11/Resolu%C3%A7%C3%A3o-CONEMA-n%C2%BA-97-aprova-a-NOP-INEA-52.pdf','https://iema.es.gov.br/Media/iema/CQAI/FIGURAS/CRSS/CONAMA/CONAMA_382_2006.pdf'])assert.ok(body.includes('href="'+url+'"'),url);
 assert.equal(clusterSlugs.length,26);
 for(const slug of clusterSlugs){assert.ok(paths.includes(slug),slug+' must exist');assert.ok(body.includes('href="'+slug+'"'),'cluster link '+slug);}
 for(const href of ['/servicos/emissoes-fugitivas','/consultoria-ambiental-rj','/conteudos/emissoes-fugitivas'])assert.ok(body.includes('href="'+href+'"'),href);
 guideStructuredData(html,9);
 nothingAboutTheOffice(html);
});
const mainOf=html=>html.match(/<main[\s\S]*?<\/main>/)[0];
test('the emissions guide is linked, in the page content, from the home, the services, the hub and every article of the topic',async()=>{
 for(const path of ['/','/servicos','/servicos/emissoes-fugitivas','/conteudos/emissoes-fugitivas',...clusterSlugs])assert.ok(mainOf(await page(path)).includes('href="'+guidePath+'"'),'linked from '+path);
});
test('the article, the hub and the service link the emissions guide right under their summary, not only at the end',async()=>{
 for(const path of ['/blog/o-que-sao-emissoes-fugitivas','/conteudos/emissoes-fugitivas','/servicos/emissoes-fugitivas']){
  const html=await page(path);
  const header=html.match(/<header class="editorial-intro">[\s\S]*?<\/header>/)[0];
  assert.ok(header.includes('href="'+guidePath+'"'),'guide link in the header of '+path);
  assert.ok(!html.includes('editorial-faq-link'),'no second guide link at the end of '+path);
 }
});
test('the old emissions Q&A address redirects once to the guide',()=>{
 const rules=vercel.redirects,rule=rules.find(r=>r.source===oldFaqPath);
 assert.ok(rule,'missing redirect');assert.equal(rule.permanent,true);assert.equal(rule.destination,origin+guidePath);
 assert.ok(rules.indexOf(rule)<rules.findIndex(r=>r.has?.some(h=>h.type==='host')),'must precede the apex host rule');
 assert.ok(!rules.some(r=>r.source===guidePath),'no chain through the guide');
});
test('the consultoria ambiental guide says what it is, what it does and how to choose, with the law quoted',async()=>{
 assert.ok(paths.includes(consultingPath));
 const html=await page(consultingPath);
 assert.equal(title(html),'Consultoria ambiental: guia para escolher | Monitorar Consultoria');
 const description=metaDescription(html);
 assert.ok(description.length>=100&&description.length<=160,'description '+description.length);
 assert.match(description,/consultoria ambiental/i);assert.match(description,/engenharia ambiental/i);
 assert.match(h1Of(html),/^Consultoria e engenharia ambiental/);
 assert.ok(words(html)>=1300,'words '+words(html));
 const body=html.split('<div id="root">')[1];
 const h2=headings(html,'h2');
 for(const heading of ['O que é consultoria ambiental','O que uma empresa de consultoria e engenharia ambiental faz','Licenciamento ambiental: licenças e prazos','Quando contratar uma consultoria ambiental','Como escolher uma empresa de consultoria ambiental','A Monitorar: consultoria e engenharia ambiental no RJ, em SP e no Amazonas','Perguntas frequentes','Fontes'])assert.ok(h2.includes(heading),'H2 '+heading);
 for(const fact of ['Cadastro Técnico Federal','art. 17','procedimento administrativo pelo qual o órgão ambiental competente licencia a localização, instalação, ampliação e a operação','Licença Prévia','Licença de Instalação','Licença de Operação','relatório ambiental preliminar'])assert.ok(body.includes(fact),'fact '+fact);
 assert.match(body,/4 anos[\s\S]{0,200}10 anos/);
 for(const url of ['https://www.planalto.gov.br/ccivil_03/leis/l6938.htm','https://conama.mma.gov.br/?option=com_sisconama&amp;task=arquivo.download&amp;id=237'])assert.ok(body.includes('href="'+url+'"'),url);
 for(const href of ['/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am','/consultoria-ambiental-por-estado','/servicos/emissoes-fugitivas',guidePath,'/contato','/clientes'])assert.ok(body.includes('href="'+href+'"'),href);
 assert.ok((body.match(/<img[^>]+src="\/clientes\//g)||[]).length>=8,'client logos');
 guideStructuredData(html,6);
 nothingAboutTheOffice(html);
});
test('the consultoria ambiental guide is linked, in the page content, from the home, the services, the state pages and all 90 articles',async()=>{
 const articles=paths.filter(p=>p.startsWith('/blog/')&&!p.startsWith('/blog/pagina/'));
 assert.equal(articles.length,90);
 for(const path of ['/','/servicos','/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am','/consultoria-ambiental-por-estado',...articles])assert.ok(mainOf(await page(path)).includes('href="'+consultingPath+'"'),'linked from '+path);
 const footer=await page('/contato');
 for(const href of [consultingPath,guidePath])assert.ok(footer.includes('href="'+href+'"'),'footer links '+href);
});
test('the home and the Rio de Janeiro page carry the commercial phrases in their headings and link both guides',async()=>{
 const home=await page('/'),rj=await page('/consultoria-ambiental-rj');
 assert.ok(headings(home,'h2').includes('Empresa de engenharia e consultoria ambiental'),'home H2');
 assert.ok(headings(rj,'h2').includes('Empresa de engenharia ambiental e segurança do trabalho no Rio de Janeiro'),'RJ H2');
 assert.match(rj.split('<div id="root">')[1],/empresa de consultoria e engenharia ambiental/i);
 assert.ok((rj.match(/<img[^>]+src="\/clientes\//g)||[]).length>=8,'RJ client logos');
 for(const [name,html] of [['home',home],['RJ',rj]])for(const href of [consultingPath,guidePath])assert.ok(mainOf(html).includes('href="'+href+'"'),name+' links '+href);
});
test('the LDAR service page names the company as an LDAR provider without touching the approved text',async()=>{
 const html=await page('/servicos/emissoes-fugitivas');
 assert.ok(headings(html,'h2').includes('Empresa de LDAR e monitoramento de emissões fugitivas'));
 assert.equal(h1Of(html),'Monitoramento de emissões fugitivas');
});

test('the environment services page does not stop at Rio de Janeiro: it links the principal states and the state list',async()=>{
 // The footer already links these pages everywhere; the page's own content must too.
 const main=(await page('/servicos/meio-ambiente')).match(/<main[\s\S]*?<\/main>/)[0];
 for(const href of ['/consultoria-ambiental-rj','/consultoria-ambiental-sp','/consultoria-ambiental-am','/consultoria-ambiental-por-estado'])assert.ok(main.includes('href="'+href+'"'),href);
});

test('the organization data on every page names the founding year and the areas served',async()=>{
 for(const path of ['/','/blog/o-que-e-ldar','/consultoria-ambiental-sp']){
  const graph=JSON.parse((await page(path)).match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const org=graph.find(n=>[].concat(n['@type']).includes('Organization'));
  assert.equal(org.foundingDate,'2009',path);
  const names=[].concat(org.areaServed).map(a=>a.name);
  for(const name of ['Rio de Janeiro','São Paulo','Amazonas','Brasil'])assert.ok(names.includes(name),path+' '+name);
 }
});
const companyOf=graph=>graph.find(n=>[].concat(n['@type']).includes('Organization'));
test('the company node is an Organization and a LocalBusiness with verified address, geo and contact point',async()=>{
 assert.equal(business.address.postalCode,'22775-056','CEP from ViaCEP for the avenue');
 for(const path of ['/','/consultoria-ambiental-rj','/servicos/emissoes-fugitivas','/blog/o-que-e-ldar']){
  const org=companyOf(graphOf(await page(path)));
  assert.deepEqual([].concat(org['@type']),['Organization','LocalBusiness'],path);
  assert.equal(org['@id'],ORIGIN+'/#organization');
  assert.equal(org.address.postalCode,business.address.postalCode,path);
  assert.deepEqual(org.geo,business.geo?{'@type':'GeoCoordinates',...business.geo}:undefined,path+' geo only when verified');
  assert.equal(org.contactPoint[0].telephone,business.phone,path);
  assert.deepEqual([].concat(org.areaServed).map(a=>a.name),['Rio de Janeiro','São Paulo','Amazonas','Brasil'],path);
  for(const field of ['openingHoursSpecification','openingHours','hasMap','aggregateRating','review','priceRange'])assert.equal(org[field],undefined,path+' '+field);
  assert.ok(org.knowsAbout.includes('Licenciamento ambiental')&&org.knowsAbout.includes('LDAR'),path);
  assert.ok(org.hasOfferCatalog.itemListElement.some(o=>o.itemOffered['@id']===ORIGIN+'/servicos/emissoes-fugitivas#service'),path);
 }
});
const pageTypeOf=path=>/^\/(blog|conteudos)(\/|$)/.test(path)&&!/^\/blog\/(?!pagina\/)[^/]+$/.test(path)?'CollectionPage':path==='/sobre'?'AboutPage':path==='/contato'?'ContactPage':'WebPage';
test('every page has a WebPage node tied to the site, its breadcrumb and its main entity',async()=>{
 for(const path of paths){
  const graph=graphOf(await page(path)),url=ORIGIN+path,id=url+'#webpage';
  const nodes=graph.filter(n=>n['@id']===id);
  assert.equal(nodes.length,1,path+' one WebPage node');
  const web=nodes[0];
  assert.equal(web['@type'],pageTypeOf(path),path);
  assert.equal(web.url,url,path);
  assert.deepEqual(web.isPartOf,{'@id':ORIGIN+'/#website'},path);
  const crumbs=graph.find(n=>n['@type']==='BreadcrumbList');
  if(crumbs){assert.equal(crumbs['@id'],url+'#breadcrumb',path);assert.deepEqual(web.breadcrumb,{'@id':url+'#breadcrumb'},path);}
  for(const node of graph.filter(n=>['Article','BlogPosting','Service'].includes(n['@type'])))assert.deepEqual(node.mainEntityOfPage,{'@id':id},path+' '+node['@type']);
 }
});
test('state pages declare a consultoria ambiental Service for their state',async()=>{
 for(const [path,state] of [['/consultoria-ambiental-rj','Rio de Janeiro'],['/consultoria-ambiental-sp','São Paulo'],['/consultoria-ambiental-am','Amazonas']]){
  const service=graphOf(await page(path)).find(n=>n['@type']==='Service');
  assert.ok(service,path);
  assert.equal(service['@id'],ORIGIN+path+'#service');
  assert.equal(service.serviceType,'Consultoria ambiental');
  assert.deepEqual(service.areaServed,{'@type':'State',name:state},path);
  assert.deepEqual(service.provider,{'@id':ORIGIN+'/#organization'},path);
 }
});
test('the LDAR service names LDAR and points to the guide',async()=>{
 const service=graphOf(await page('/servicos/emissoes-fugitivas')).find(n=>n['@type']==='Service');
 assert.ok([].concat(service.alternateName).includes('LDAR'));
 assert.ok(service.serviceType);
 assert.deepEqual(service.subjectOf,{'@id':ORIGIN+'/emissoes-fugitivas#article'});
});
test('articles name their subject as the section',async()=>{
 const article=graphOf(await page('/blog/o-que-e-ldar')).find(n=>n['@type']==='BlogPosting');
 assert.equal(article.articleSection,'Emissões fugitivas');
});
const lastmods=Object.fromEntries([...sitemap.matchAll(/<url><loc>https:\/\/www\.monitorarconsultoria\.com\.br(.*?)<\/loc>(?:<lastmod>(.*?)<\/lastmod>)?<\/url>/g)].map(m=>[m[1],m[2]]));
test('every sitemap URL carries the date of its last public change',async()=>{
 const today=new Date().toISOString().slice(0,10);
 assert.equal(Object.keys(lastmods).length,paths.length);
 for(const path of paths){
  assert.ok(lastmods[path]&&Number.isFinite(Date.parse(lastmods[path])),'no lastmod for '+path);
  assert.ok(lastmods[path].slice(0,10)<=today,path+' '+lastmods[path]);
 }
 for(const name of ['emissoes-fugitivas-guia','consultoria-ambiental-guia']){
  const guide=JSON.parse(await readFile('content/'+name+'.json','utf8'));
  assert.equal(lastmods[guide.path],guide.updated);
 }
});
test('a listing is dated by the newest article it lists',async()=>{
 for(const path of ['/blog','/blog/pagina/8','/conteudos/qualidade-do-ar']){
  const listed=[...new Set([...mainOf(await page(path)).matchAll(/href="(\/blog\/(?!pagina\/)[^"#]+)"/g)].map(m=>m[1]))];
  assert.ok(listed.length,path);
  const newest=listed.map(p=>lastmods[p]).reduce((a,b)=>Date.parse(b)>Date.parse(a)?b:a);
  assert.equal(lastmods[path],newest,path);
 }
});
test('static pages move their sitemap date when their source changes',async()=>{
 const {spawnSync}=await import('node:child_process');
 const services=['src/pages/Services.tsx'],state=['src/pages/ConsultoriaEstado.tsx','src/lib/environmental-services.ts','content/regions.json','content/topics.json'];
 const sources={'/':['src/pages/Home.tsx','src/lib/clients.ts','src/lib/contact.ts'],'/sobre':['src/pages/About.tsx'],'/servicos':services,'/servicos/seguranca':services,'/servicos/drager':services,
  '/consultoria-ambiental-rj':['src/pages/ConsultoriaAmbientalRJ.tsx','src/lib/environmental-services.ts','content/topics.json'],'/consultoria-ambiental-sp':state,'/consultoria-ambiental-am':state,
  '/consultoria-ambiental-por-estado':['src/pages/ConsultoriaPorEstado.tsx','content/regions.json'],'/clientes':['src/pages/Clients.tsx'],'/depoimentos':['src/pages/Testimonials.tsx'],
  '/trabalhe-conosco':['src/pages/Careers.tsx','src/lib/contact.ts'],'/contato':['src/pages/Contact.tsx','src/lib/contact.ts'],'/politica-privacidade':['src/pages/Privacy.tsx','src/lib/contact.ts']};
 for(const [path,files] of Object.entries(sources)){
  const git=spawnSync('git',['log','-1','--format=%cs','--',...files],{encoding:'utf8'});
  if(git.status!==0)return;
  assert.ok((lastmods[path]||'')>=git.stdout.trim(),path+': sitemap date '+lastmods[path]+' is older than its last change '+git.stdout.trim());
 }
});
const canonicalOf=html=>html.match(/<link rel="canonical" href="https:\/\/www\.monitorarconsultoria\.com\.br([^"]*)"/)?.[1];
test('internal links point only at canonical pages',async()=>{
 const targets=new Set();
 for(const path of paths)for(const m of (await page(path)).matchAll(/<a[^>]+href="(\/[^"#?]*)/g))targets.add(m[1]);
 for(const target of targets){
  const html=await page(target).catch(()=>null);
  if(!html)continue;
  const canonical=canonicalOf(html);
  assert.ok(!canonical||canonical===target,target+' is linked but declares '+canonical+' as canonical');
 }
});
test('the old environment services URL no longer competes for consultoria ambiental',async()=>{
 assert.equal(title(await page('/servicos/meio-ambiente')),'Meio ambiente | Monitorar Consultoria');
});
test('every sitemap page has its own meta description',async()=>{
 const seen=new Map();
 for(const path of paths){
  const description=text((await page(path)).match(/<meta name="description" content="([^"]*)"/)[1]);
  assert.ok(!seen.has(description),path+' repeats the description of '+seen.get(description));
  seen.set(description,path);
 }
});
