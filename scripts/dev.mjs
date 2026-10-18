import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {createServer} from 'vite';
import {loadSiteData,normalizeRoute,safeJson} from './page-data.mjs';
import {sendFile} from './http-files.mjs';
import {origin} from './editorial.mjs';
import {schemaFor} from './schema.mjs';
const preview=!process.argv.includes('--public');
const vite=await createServer({appType:'custom',server:{middlewareMode:true,host:'127.0.0.1',watch:{ignored:['**/.organic*/**','**/dist*/**','**/docs/organic/**/evidence/**']}}});
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const server=http.createServer(async(req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost'),route=decodeURIComponent(url.pathname);
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  if(route.endsWith('.mp4')) {
   const base=path.resolve('public'),file=path.resolve(base,'.'+route);
   if(!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
   try{await sendFile(req,res,file,{preview:true});}catch{res.writeHead(404);res.end();}return;
  }
  if(route==='/search-index.json'){const data=await loadSiteData(preview);res.setHeader('Content-Type','application/json');res.end(safeJson(data.search));return;}
  if(path.extname(route)&&!route.endsWith('.html')||route.startsWith('/@')){vite.middlewares(req,res,()=>{res.statusCode=404;res.end();});return;}
  const redirect=normalizeRoute(route);if(redirect){res.writeHead(308,{Location:redirect+url.search});res.end();return;}
  const data=await loadSiteData(preview),found=data.rows.find(r=>r.path===route),row=found||data.rows.find(r=>r.path==='/404');
  let template=await vite.transformIndexHtml(url.pathname,await readFile('index.html','utf8'));
  const {render}=await vite.ssrLoadModule('/src/entry-server.tsx');
  template=template.replace(/<title>[\s\S]*?<\/title>/g,'').replace(/<meta\s+(?:name|property)="(?:description|author|keywords|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g,'').replace(/<link rel="canonical"[^>]*>/g,'');
  template=template.replace('</head>',`<title>${escape(row.title)}</title><meta name="description" content="${escape(row.description)}"/><meta name="robots" content="noindex, nofollow"/>${row.canonical?`<link rel="canonical" href="${origin+row.canonical}"/>`:''}<script type="application/ld+json">${safeJson(schemaFor(row,preview))}</script></head>`);
  template=template.replace('<div id="root"></div>',`<div id="root">${render(row.path,row.page,true,data.content)}</div><script id="page-data" type="application/json">${safeJson({page:row.page,hasEditorial:true,content:data.content})}</script>`);
  if(preview&&!row.page)template=template.replace('<body>','<body><aside class="local-preview-note">Prévia local não publicada</aside>');
  res.writeHead(found&&row.path!=='/404'?200:404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:template);
 }catch(error){vite.ssrFixStacktrace(error);console.error(error);res.writeHead(500);res.end('Não foi possível carregar a prévia local. Consulte o terminal.');}
});
server.listen(8081,'127.0.0.1',()=>console.log('Monitorar V4: http://127.0.0.1:8081/ — '+(preview?'prévia editorial':'manifesto público')));
