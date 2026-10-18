import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {loadCorpus,loadRegistry,versionOf,validatePublic,simulate,rollback,atomicJson,prepareRelease,readPause} from './editorial.mjs';
import {createHash} from 'node:crypto';
import {checkSource} from './source-check.mjs';
import {sealPublication,validatePublished,maintenanceIssues} from './editorial.mjs';
const [command,id,...args]=process.argv.slice(2);
const docs=await loadCorpus(),registry=await loadRegistry();

async function state(){try{return JSON.parse(await readFile('.organic/simulation.json','utf8'));}catch(e){if(e.code!=='ENOENT')throw e;return JSON.parse(await readFile('content/published.json','utf8'));}}
if(command==='status'){
 const catalog=JSON.parse(await readFile('content/catalog.json','utf8'));
 const published=JSON.parse(await readFile('content/published.json','utf8'));
 console.log(JSON.stringify({proposals:catalog.length,articleProposals:catalog.filter(d=>d.type==='article').length,drafted:docs.length,technicalReview:docs.filter(d=>d.status==='technical_review').length,approved:docs.filter(d=>!validatePublic(d,registry).length).length,publishedInManifest:Object.keys(published.current).length,production:'requires separate live verification; manifest count is not proof of deployment or Google indexation',documents:docs.map(d=>({id:d.id,status:d.status,blockers:validatePublic(d,registry)}))},null,2));
}else if(command==='maintenance'){
 const published=JSON.parse(await readFile('content/published.json','utf8'));
 console.log(JSON.stringify(Object.values(published.current).map(d=>({id:d.id,slug:d.slug,issues:maintenanceIssues(d,registry)})).filter(d=>d.issues.length),null,2));
}else if(command==='check-sources'){
 const urls=[...new Set(docs.flatMap(d=>d.source_urls))];
 if(urls.length>50)throw new Error('Request budget exceeded');
 const updates=[],checks=[];
 for(const url of urls){
  const previous=registry.sources[url];const checked=await checkSource(url);checks.push({url,...checked});
  if(previous?.hash&&checked.hash&&previous.hash!==checked.hash)updates.push({url,previous_hash:previous.hash,new_hash:checked.hash,action:'review source changes; do not auto-publish'});
  registry.sources[url]=checked;
 }
 await atomicJson('content/registry.json',registry);await atomicJson('.organic/source-proposals.json',updates);await atomicJson('.organic/source-checks.json',checks);
 console.log(JSON.stringify({checked:checks.length,available:checks.filter(s=>s.available).length,proposals:updates.length,failed:checks.filter(s=>!s.available)}));
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
 const receipts=JSON.parse(await readFile('content/publication-receipts.json','utf8'));
 const candidate=prepareRelease(baseline,current,registry,{paused,receipts});
 const nextReceipts={...receipts};
 for(const d of Object.values(candidate.current)){if(!receipts[d.slug]||receipts[d.slug].version!==d.approved_version)nextReceipts[d.slug]=sealPublication(d,registry);}
 await atomicJson('.organic/release-receipts.json',nextReceipts);
 await atomicJson('.organic/release-candidate.json',candidate);
 await atomicJson('.organic/release-candidate-digest.json',{sha256:createHash('sha256').update(await readFile('.organic/release-candidate.json')).digest('hex'),created_at:new Date().toISOString()});
 console.log('Candidate saved in .organic/release-candidate.json. Published manifest unchanged.');
}else{console.log('Commands: status, maintenance, check-sources, approve ID --by PERSON, simulate [ID], pause, resume, rollback, prepare-release');}
