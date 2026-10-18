import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const local=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(local,'../../../..');
const storage=process.argv[2];
if(!storage || !path.isAbsolute(storage)) throw new Error('Pass the absolute external V3 snapshot directory.');
const output=path.join(storage,'erm-preview');
const reference=path.resolve('D:/monitorar-recovery/20261017-192451/preview');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.webp':'image/webp','.woff2':'font/woff2','.json':'application/json','.pdf':'application/pdf'};
function inside(base,url){const target=path.resolve(base,'.'+url);return target.startsWith(base+path.sep)?target:null;}
for(const [port,variant] of [[4191,'erm'],[4192,'reference'],[4190,'comparison']]) {
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Robots-Tag','noindex, nofollow'); res.setHeader('Cache-Control','no-store');
  try {
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(pathname==='/robots.txt'){res.end('User-agent: *\nDisallow: /\n');return;}
   if(pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
   const candidates=pathname==='/' ? [variant==='erm'?path.join(output,'erm.html'):variant==='reference'?path.join(reference,'reference.html'):path.join(local,'comparison.html')] : [
    inside(path.join(variant==='reference'?reference:output,'client'),pathname),
    inside(path.join(root,'public'),pathname),
    pathname.startsWith('/evidence/')?inside(path.resolve(local,'..'),pathname):null,
    inside(path.join(root,'dist'),pathname+(path.extname(pathname)?'':'.html')),
   ];
   for(const file of candidates){if(!file)continue;try{const data=await readFile(file);res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.end(data);return;}catch{}}
   res.writeHead(404);res.end('Página não encontrada na prévia local.');
  } catch {res.writeHead(400);res.end('Requisição inválida.');}
 });
 server.on('error',error=>{console.error(error);process.exitCode=1;});
 server.listen(port,'127.0.0.1',()=>console.log(`${variant}: http://127.0.0.1:${port}/`));
}
