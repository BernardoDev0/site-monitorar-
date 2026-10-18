import {sendFile} from './http-files.mjs';
import http from 'node:http';import {readFile,stat} from 'node:fs/promises';import path from 'node:path';
export async function startServer(root,port=4173){
 const base=path.resolve(root); const preview=root.includes('preview');
 const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.mp4':'video/mp4','.woff2':'font/woff2'};
 const server=http.createServer(async(req,res)=>{
  try {
   const url=new URL(req.url,'http://localhost');let route=decodeURIComponent(url.pathname);
   if(['/index.html','/index','/blog/pagina/1'].includes(route)){res.writeHead(308,{Location:(route.startsWith('/blog')?'/blog':'/')+url.search});res.end();return;}
   if(route.endsWith('.html')||route!=='/'&&route.endsWith('/')){res.writeHead(308,{Location:(route.replace(/\.html$/,'').replace(/\/$/,'')||'/')+url.search});res.end();return;}
   let file=path.resolve(base,'.'+route);
   if(file!==base&&!file.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
   if(route==='/')file=path.join(base,'index.html');
   else if(!path.extname(file))file+='.html';
   let status=200;
   try{await stat(file);}catch{status=404;file=path.join(base,'404.html');}
   await sendFile(req,res,file,{status,preview});
  }catch{res.writeHead(400);res.end('Bad request');}
 }); await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));return server;
}
if(process.argv[1]?.endsWith('serve.mjs')) {const server=await startServer(process.argv.includes('--preview')?'dist-preview':'dist',process.argv.includes('--preview')?4174:4173);console.log('Local only: http://127.0.0.1:'+server.address().port);}
