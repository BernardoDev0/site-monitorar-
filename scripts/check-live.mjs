// Read-only HTTP verification. Does not submit URLs, deploy, or change accounts.
import {origin} from './editorial.mjs';
const base=(process.argv[2]||origin).replace(/\/$/,'');
const results=[];
async function check(route,status,pattern){const r=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(15000)});const body=await r.text();const passed=r.status===status&&(!pattern||pattern.test(body));results.push({route,status:r.status,expected:status,passed});return body;}
await check('/',200,/<h1[\s>]/);
await check('/servicos',200,/<link rel="canonical" href="https:\/\/www.monitorarconsultoria.com.br\/servicos"/);
await check('/contato',200,/Preparar mensagem/);
await check('/blog',200,/<h1[\s>]/);
const robots=await check('/robots.txt',200,/Sitemap: https:\/\/www.monitorarconsultoria.com.br\/sitemap.xml/);
if(/^Disallow:\s*\/\s*$/m.test(robots))results.push({route:'/robots.txt',passed:false,reason:'Whole-site disallow found; inspect user-agent group'});
// /sitemap.xml is an index; every child must answer and every URL in them must be a live, indexable page.
const index=await check('/sitemap.xml',200,/<sitemapindex/);
let sitemap='';
for(const [,child] of index.matchAll(/<sitemap><loc>(.*?)<\/loc>/g))sitemap+=await check(new URL(child).pathname,200,/<urlset/);
for(const [,url] of sitemap.matchAll(/<url><loc>(.*?)<\/loc>/g)){
 const u=new URL(url);if(u.origin!==origin){results.push({url,passed:false,reason:'Unexpected canonical host'});continue;}
 const body=await check(u.pathname,200,/<h1[\s>]/);
 if(/<meta name="robots" content="noindex/.test(body))results.push({url,passed:false,reason:'Noindex URL in sitemap'});
}
await check('/__monitorar_missing_check__',404,/noindex/);
await check('/blog/pagina/1',308);
console.log(JSON.stringify({base,checked_at:new Date().toISOString(),checks:results,indexing_measured:false},null,2));
if(results.some(r=>!r.passed))process.exitCode=1;
