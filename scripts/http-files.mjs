import {stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import path from 'node:path';
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.ico':'image/x-icon','.pdf':'application/pdf','.mp4':'video/mp4','.webm':'video/webm','.woff2':'font/woff2'};
export async function sendFile(req,res,file,{status=200,preview=false}={}) {
 const info=await stat(file);
 const headers={'Content-Type':mime[path.extname(file).toLowerCase()]||'application/octet-stream','Accept-Ranges':'bytes','Cache-Control':'no-store',...(preview?{'X-Robots-Tag':'noindex, nofollow'}:{})};
 let start=0,end=info.size-1;
 if(req.headers.range && status===200) {
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  let valid=!!match && !!(match[1]||match[2]);
  if(valid){
   if(!match[1]) {const suffix=Number(match[2]);start=Math.max(0,info.size-suffix);valid=suffix>0;}
   else {start=Number(match[1]);end=match[2]?Math.min(Number(match[2]),end):end;}
   valid=valid&&Number.isSafeInteger(start)&&Number.isSafeInteger(end)&&start<=end&&start<info.size;
  }
  if(!valid){res.writeHead(416,{...headers,'Content-Range':`bytes */${info.size}`,'Content-Length':'0'});res.end();return;}
  status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
 }
 headers['Content-Length']=Math.max(0,end-start+1);res.writeHead(status,headers);
 if(req.method==='HEAD'||info.size===0){res.end();return;}
 const stream=createReadStream(file,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
}
