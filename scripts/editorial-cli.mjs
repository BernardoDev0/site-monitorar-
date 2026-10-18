import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {loadCorpus,loadRegistry,versionOf,validatePublic,simulate,rollback,atomicJson,prepareRelease,readPause} from './editorial.mjs';
import {createHash} from 'node:crypto';
const [command,id,...args]=process.argv.slice(2);
const docs=await loadCorpus(),registry=await loadRegistry();

async function state(){try{return JSON.parse(await readFile('.organic/simulation.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return JSON.parse(await readFile('content/published.json','utf8'));}}
if(command==='status'){
 console.log(JSON.stringify({proposals:90,drafted:docs.length,technicalReview:docs.filter(d=>d.status==='technical_review').length,approved:docs.filter(d=>!validatePublic(d,registry).length).length,published:'not measured; no production deployment',documents:docs.map(d=>({id:d.id,status:d.status,blockers:validatePublic(d,registry)}))},null,2));
}else if(command==='check-sources'){
 const hosts=new Set(['www.epa.gov','www.who.int','webstore.iec.ch','agencia.petrobras.com.br']);
 const updates=[];let count=0;
 for(const url of [...new Set(docs.flatMap(d=>d.source_urls))]){
  if(++count>50)throw new Error('Request budget exceeded');
  const u=new URL(url);if(u.protocol!=='https:'||!hosts.has(u.hostname))throw new Error('Source not allowlisted: '+u.hostname);
  let available=false,hash=null,status=null;
  for(let attempt=0;attempt<2;attempt++){
   try{const response=await fetch(url,{signal:AbortSignal.timeout(10000),redirect:'manual'});status=response.status;
    if(response.ok){const bytes=Buffer.from(await response.arrayBuffer());const {createHash}=await import('node:crypto');hash=createHash('sha256').update(bytes).digest('hex');available=true;}break;
   }catch{if(attempt===0)await new Promise(r=>setTimeout(r,1000));}
  }
  const previous=registry.sources[url];if(previous?.hash&&hash&&previous.hash!==hash)updates.push({url,previous_hash:previous.hash,new_hash:hash,action:'review source changes; do not auto-publish'});
  registry.sources[url]={available,checked_at:new Date().toISOString(),status,hash};
 }
 await atomicJson('content/registry.json',registry);await atomicJson('.organic/source-proposals.json',updates);
 console.log(JSON.stringify({checked:count,available:Object.values(registry.sources).filter(s=>s.available).length,proposals:updates.length}));
}else if(command==='approve'){
 const doc=docs.find(d=>d.id===id);if(!doc)throw new Error('Unknown document');
 const by=args[args.indexOf('--by')+1];if(!args.includes('--by')||!by)throw new Error('Real authorized approver required: --by id');
 const candidate={...doc,status:'approved',approved_by:by,approved_sources:Object.fromEntries(doc.source_urls.map(url=>[url,registry.sources[url]?.hash??'']))};candidate.approved_version=versionOf(candidate);
 const errors=validatePublic(candidate,registry);if(errors.length)throw new Error(errors.join('; '));
 await atomicJson('content/documents/'+id+'.json',candidate);console.log('Approved local version '+candidate.approved_version);
}else if(command==='simulate'){
 const paused=await readPause();
 const selected=id?docs.filter(d=>d.id===id):docs;if(!selected.length)throw new Error('No documents selected');
 const next=simulate(await state(),selected,registry,{paused});
 await atomicJson('.organic/simulation.json',next);console.log('Simulation only; no deployment');
}else if(command==='pause'||command==='resume'){
 await atomicJson('.organic/control.json',{paused:command==='pause'});console.log(command);
}else if(command==='rollback'){
 await atomicJson('.organic/simulation.json',rollback(await state()));console.log('Simulation rollback only');
}else if(command==='prepare-release'){
 const current=await state();
 const paused=await readPause();
 const baseline=JSON.parse(await readFile('content/published.json','utf8'));
 const candidate=prepareRelease(baseline,current,registry,{paused});
 await atomicJson('.organic/release-candidate.json',candidate);
 await atomicJson('.organic/release-candidate-digest.json',{sha256:createHash('sha256').update(await readFile('.organic/release-candidate.json')).digest('hex'),created_at:new Date().toISOString()});
 console.log('Candidate saved in .organic/release-candidate.json. Published manifest unchanged.');
}else{console.log('Commands: status, check-sources, approve ID --by PERSON, simulate [ID], pause, resume, rollback, prepare-release');}
