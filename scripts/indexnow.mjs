// Notifies IndexNow engines (Bing, Yandex, Naver, Seznam, Yep) of the live sitemap. Run manually after a deploy; never during the build.
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {origin} from './editorial.mjs';
export function indexNowPayload(sitemap,key){
 const urlList=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 if(!urlList.length)throw new Error('Sitemap has no URLs');
 const foreign=urlList.find(u=>new URL(u).origin!==origin);
 if(foreign)throw new Error('URL outside the canonical host: '+foreign);
 return {host:new URL(origin).host,key,keyLocation:origin+'/'+key+'.txt',urlList};
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){
 const {INDEXNOW_KEY:key}=JSON.parse(await readFile(new URL('../content/site-integrations.json',import.meta.url),'utf8'));
 const get=async url=>{const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error(url+' HTTP '+r.status);return r.text();};
 if((await get(origin+'/'+key+'.txt')).trim()!==key)throw new Error('Published IndexNow key does not match');
 const payload=indexNowPayload(await get(origin+'/sitemap.xml'),key);
 const r=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(payload),signal:AbortSignal.timeout(30000)});
 console.log(JSON.stringify({submittedAt:new Date().toISOString(),endpoint:'https://api.indexnow.org/indexnow',status:r.status,urls:payload.urlList.length,response:(await r.text()).slice(0,500)}));
 if(r.status!==200&&r.status!==202)process.exit(1);
}
