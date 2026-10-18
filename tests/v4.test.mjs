import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {sendFile} from '../scripts/http-files.mjs';
import {loadCorpus} from '../scripts/editorial.mjs';
test('video streaming serves correct bytes, MIME, HEAD, suffix and invalid range',async()=>{
 const file='public/media/refinaria-mobile.mp4',bytes=await readFile(file);
 const server=createServer((req,res)=>sendFile(req,res,file));await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port;
 try{
  const head=await fetch(url,{method:'HEAD'});assert.equal(head.headers.get('content-type'),'video/mp4');assert.equal(Number(head.headers.get('content-length')),bytes.length);assert.equal((await head.arrayBuffer()).byteLength,0);
  for(const [range,start,end] of [['bytes=0-99',0,99],['bytes=-32',bytes.length-32,bytes.length-1]]){const r=await fetch(url,{headers:{Range:range}});assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),`bytes ${start}-${end}/${bytes.length}`);assert.deepEqual(Buffer.from(await r.arrayBuffer()),bytes.subarray(start,end+1));}
  for(const range of ['bytes=999999999-','bytes=12-1','bytes=-0','bytes=1-2,5-6'])assert.equal((await fetch(url,{headers:{Range:range}})).status,416);
 }finally{await new Promise(r=>server.close(r));}
});
test('90 distinct approved articles with substantive bodies are in the publication manifest',async()=>{
 const articles=(await loadCorpus()).filter(d=>d.type==='article');assert.equal(articles.length,90);assert.equal(new Set(articles.map(d=>d.slug)).size,90);assert.equal(new Set(articles.map(d=>JSON.stringify(d.body))).size,90);
 for(const a of articles){assert.ok(a.body.length>=3,a.id);assert.ok(a.body.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length>=180,a.id);assert.ok(a.source_urls.length,a.id);assert.equal(a.approved_by,'bernardo-tavares',a.id);}
 const manifest=JSON.parse(await readFile('content/published.json','utf8'));assert.equal(Object.keys(manifest.current).length,94);
});
