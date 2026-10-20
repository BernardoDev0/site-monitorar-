import {verificationMeta} from './site-verification.mjs';
import {analyticsHead} from './analytics.mjs';
import {loadSiteData} from './page-data.mjs';
import { spawnSync } from 'node:child_process';
import { readFile,writeFile,mkdir,readdir,rename,rm } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { legacy } from './routes.mjs';
import { schemaFor } from './schema.mjs';
import { publicModifiedAt } from './public-dates.mjs';
import { sitemapGroups,sitemapGroup,urlsetXml,sitemapIndexXml } from './sitemaps.mjs';
import { loadCorpus,loadRegistry,publicDocument,validatePublic,validateManifest,origin } from './editorial.mjs';
import { editorialPages } from './editorial-pages.mjs';
import { business } from './seo-data.mjs';
const preview=process.argv.includes('--preview');
// Ownership tokens and measurement IDs are public identifiers, not credentials.
const integrations=JSON.parse(await readFile(new URL('../content/site-integrations.json',import.meta.url),'utf8'));
const verificationEnv={...integrations};
const analyticsMarkup=analyticsHead(process.env.GA4_MEASUREMENT_ID?.trim() || integrations.GA4_MEASUREMENT_ID,{preview});
for(const key of ['GOOGLE_SITE_VERIFICATION','BING_SITE_VERIFICATION'])if(process.env[key]?.trim())verificationEnv[key]=process.env[key];
const target=preview?'dist-preview':'dist';
const out='.organic-stage-'+(preview?'preview':'public');
function vite(args){const p=spawnSync(process.execPath,['node_modules/vite/bin/vite.js',...args],{stdio:'inherit'});if(p.status!==0) process.exit(p.status||1);}
vite(['build','--outDir',out]);
vite(['build','--ssr','src/entry-server.tsx','--outDir','.organic-server']);
const {render}=await import(pathToFileURL(path.resolve('.organic-server/entry-server.js')));
const {rows,content,candidates,documents,search,maintenance}=await loadSiteData(preview);
await mkdir('.organic',{recursive:true});
await writeFile('.organic/maintenance.json',JSON.stringify(maintenance,null,2));
if(maintenance.length)console.warn('Editorial maintenance due for '+maintenance.length+' documents; approved published versions retained.');
await writeFile(out+'/search-index.json',JSON.stringify(search));
const template=await readFile(out+'/index.html','utf8');
const editorialCss=(await readdir(out+'/assets')).find(n=>n.startsWith('EditorialApp-')&&n.endsWith('.css'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const json=d=>JSON.stringify(d).replaceAll('<','\\u003c').replaceAll('\u2028','\\u2028').replaceAll('\u2029','\\u2029');
for(const row of rows){
 const noindex=preview||row.path==='/404'||row.page?.noindex;
 const head=(row.page&&editorialCss?'<link rel="stylesheet" href="/assets/'+editorialCss+'"/>':'')+'<title>'+esc(row.title)+'</title><meta name="description" content="'+esc(row.description)+'"/>'+
 '<meta name="robots" content="'+(noindex?(preview?'noindex, nofollow':'noindex, follow'):'index, follow')+'"/>'+
 (row.canonical?'<link rel="canonical" href="'+origin+row.canonical+'"/>':'')+
 '<meta property="og:site_name" content="'+esc(business.name)+'"/><meta property="og:locale" content="pt_BR"/>'+
 '<meta property="og:title" content="'+esc(row.title)+'"/><meta property="og:description" content="'+esc(row.description)+'"/><meta property="og:url" content="'+origin+row.path+'"/><meta property="og:image" content="'+origin+'/simbolo-monitorar.png"/><meta property="og:type" content="'+(row.page?.type==='article'?'article':'website')+'"/>';
 const schema=schemaFor(row,preview);
 let html=template.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\s+(?:name|property)="(?:description|author|keywords|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/g,'');
 html=html.replace('</head>',(preview?'':verificationMeta(verificationEnv))+'</head>');
 html=html.replace('</head>',analyticsMarkup+'</head>');
 html=html.replace('<html lang="en">','<html lang="pt-BR">').replace('</head>',head+'<script type="application/ld+json">'+json(schema)+'</script></head>');
 html=html.replace('<div id="root"></div>','<div id="root">'+render(row.path,row.page,documents.length>0,content)+'</div><script id="page-data" type="application/json">'+json({page:row.page,hasEditorial:documents.length>0,content})+'</script>');
 if(preview && !row.page) html=html.replace('<body>','<body><aside style="position:relative;z-index:60;background:#fff2cb;color:#24304c;padding:1rem">Prévia local não publicada · <a href="/conteudos/emissoes-fugitivas">Revisar primeiro lote editorial</a></aside>');
 const file=path.join(out,row.path==='/'?'index.html':row.path.slice(1)+'.html');
 await mkdir(path.dirname(file),{recursive:true});await writeFile(file,html);
}
const urls=preview?[]:rows.filter(r=>r.canonical===r.path&&r.path!=='/404'&&!r.page?.noindex);
// A listing changes when what it lists changes: it takes the newest date among the pages it lists.
const rowBySlug=new Map(rows.map(r=>[r.path,r]));
const newest=dates=>dates.filter(Boolean).reduce((a,b)=>a===null||Date.parse(b)>Date.parse(a)?b:a,null);
const modifiedAt=row=>publicModifiedAt(row.page)||row.updated||newest((row.page?.entries||[]).map(e=>rowBySlug.get(e.slug)).filter(Boolean).map(modifiedAt));
// Each child sitemap takes the newest date among its URLs; the index at /sitemap.xml lists the three.
const children=sitemapGroups.map(name=>{const entries=urls.filter(r=>sitemapGroup(r)===name).map(r=>({loc:origin+r.path,lastmod:modifiedAt(r)}));return {name,entries,lastmod:newest(entries.map(e=>e.lastmod))};});
for(const child of children)await writeFile(out+'/'+child.name+'-sitemap.xml',urlsetXml(child.entries));
await writeFile(out+'/sitemap.xml',sitemapIndexXml(children.map(child=>({loc:origin+'/'+child.name+'-sitemap.xml',lastmod:child.lastmod}))));
await writeFile(out+'/robots.txt',preview?'User-agent: *\nDisallow: /\n':(await readFile('public/robots.txt','utf8')).replace(/\r\n/g,'\n').trim()+'\n\nSitemap: '+origin+'/sitemap.xml\n');
// IndexNow ownership key: a public identifier served only by the public build.
if(!preview&&integrations.INDEXNOW_KEY){
 if(!/^[A-Za-z0-9-]{8,128}$/.test(integrations.INDEXNOW_KEY))throw new Error('Invalid INDEXNOW_KEY');
 await writeFile(out+'/'+integrations.INDEXNOW_KEY+'.txt',integrations.INDEXNOW_KEY);
}
// Promote only a completely rendered artifact; recover the last output on failure.
const backup=target+'.previous';
// All recursive artifact operations are confined to this project's known output paths.
for(const candidate of [backup,target,out]) {
 const absolute=path.resolve(candidate),workspace=path.resolve('.');
 if(!absolute.startsWith(workspace+path.sep)||path.dirname(absolute)!==workspace)throw new Error('Unsafe artifact path: '+absolute);
}
await rm(backup,{recursive:true,force:true});
let moved=false;
async function move(from,to){
 for(let attempt=0;;attempt++){
  try{return await rename(from,to);}catch(error){
   if(!['EPERM','EBUSY'].includes(error.code)||attempt>=12)throw error;
   await new Promise(resolve=>setTimeout(resolve,250));
  }
 }
}
try {await move(target,backup);moved=true;} catch(e){if(e.code!=='ENOENT')throw e;}
try {await move(out,target);} catch(e){if(moved)await move(backup,target);throw e;}
console.log(JSON.stringify({output:target,legacy:legacy.length,editorial:candidates.length,preview,urls:urls.length}));
