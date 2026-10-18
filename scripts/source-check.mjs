import {createHash} from 'node:crypto';
export const sourceHosts=new Set(['www.epa.gov','www.who.int','webstore.iec.ch','agencia.petrobras.com.br','sustentabilidade.petrobras.com.br','www.inea.rj.gov.br','www.planalto.gov.br','www.gov.br','www.hse.gov.uk','www.draeger.com','conama.mma.gov.br','www.bipm.org']);
export async function checkSource(url,{fetcher=fetch}={}) {
 const result={available:false,checked_at:new Date().toISOString(),status:null,hash:null};
 try {
  let current=url;
  for(let redirect=0;redirect<=3;redirect++){
   const target=new URL(current);
   if(target.protocol!=='https:'||!sourceHosts.has(target.hostname)||target.username||target.password||target.port)throw new Error('Source destination not allowlisted');
   const response=await fetcher(current,{signal:AbortSignal.timeout(15000),redirect:'manual'});
   result.status=response.status;
   if([301,302,303,307,308].includes(response.status)){
    const location=response.headers.get('location');await response.body?.cancel();
    if(!location||redirect===3)throw new Error('Invalid redirect or redirect limit');
    current=new URL(location,current).href;continue;
   }
   if(!response.ok){await response.body?.cancel();throw new Error('Source HTTP '+response.status);}
   const reader=response.body.getReader(),chunks=[];let size=0;
   while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20*1024*1024){await reader.cancel();throw new Error('Source exceeds 20 MB limit');}chunks.push(value);}
   const bytes=Buffer.concat(chunks);
   if(!bytes.length)throw new Error('Empty source');
   return {...result,available:true,hash:createHash('sha256').update(bytes).digest('hex'),final_url:current,bytes:size};
  }
 }catch(error){return {...result,error:error.message};}
 return {...result,error:'Source check incomplete'};
}
