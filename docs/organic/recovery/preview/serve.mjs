import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const local=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(local,'../../../..');
const storage=process.argv[2];
if(!storage || !path.isAbsolute(storage)) throw new Error('Pass the absolute snapshot directory.');
const output=path.join(storage,'preview');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.mp4':'video/mp4','.woff2':'font/woff2','.json':'application/json'};
function inside(base,name){const p=path.resolve(base,'.'+name);return p.startsWith(base+path.sep)?p:null;}
for(const [port,variant] of [[4181,'reference'],[4182,'polished'],[4180,'comparison']]) {
 const server=http.createServer(async(req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  res.setHeader('X-Robots-Tag','noindex, nofollow');res.setHeader('Cache-Control','no-store');
  if(pathname==='/robots.txt'){res.end('User-agent: *\nDisallow: /\n');return;}
  try{
   let file;
   if(pathname==='/')file=variant==='comparison'?path.join(local,'comparison.html'):path.join(output,variant+'.html');
   else if(pathname.startsWith('/evidence/'))file=inside(path.resolve(local,'..'),pathname);
   else {
    const candidates=[inside(path.join(output,'client'),pathname),inside(path.join(root,'public'),pathname),inside(path.join(root,'dist'),pathname+(path.extname(pathname)?'':'.html'))];
    for(const candidate of candidates){if(!candidate)continue;try{await readFile(candidate);file=candidate;break;}catch{}}
   }
   if(!file){res.writeHead(404);res.end('Página não encontrada na prévia local.');return;}
   const data=await readFile(file);res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
   // Range support keeps the original optional background video seekable.
   const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
   if(range){const start=Number(range[1]),end=Math.min(Number(range[2]||data.length-1),data.length-1);if(start>end){res.writeHead(416);res.end();return;}res.writeHead(206,{'Content-Range':`bytes ${start}-${end}/${data.length}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});res.end(data.subarray(start,end+1));}
   else {res.setHeader('Content-Length',data.length);res.end(data);}
  }catch{res.writeHead(404);res.end('Arquivo não encontrado.');}
 });
 server.on('error',e=>{console.error(e);process.exit(1);});
 server.listen(port,'127.0.0.1',()=>console.log(`Local ${variant}: http://127.0.0.1:${port}`));
}
