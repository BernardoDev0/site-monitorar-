import {spawnSync} from 'node:child_process';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {loadCorpus,loadRegistry,validatePublic} from './editorial.mjs';
const output='docs/organic/v2/evidence/implementation';
await mkdir(output,{recursive:true});
const checks=[];
for(const command of ['typecheck','lint','build','build:preview','test']){
 const result=spawnSync(process.execPath,[process.env.npm_execpath,'run',command],{encoding:'utf8'});
 const log=(result.stdout||'')+(result.stderr||'');
 await writeFile(output+'/'+command.replace(':','-')+'.txt',log);
 checks.push({command:'npm run '+command,exit_code:result.status});
 console.log(command+': '+(result.status===0?'PASS':'FAIL'));
 if(result.status!==0){console.error(log);process.exitCode=1;break;}
}
const docs=await loadCorpus(),registry=await loadRegistry(),published=JSON.parse(await readFile('content/published.json','utf8'));
await writeFile(output+'/verification.json',JSON.stringify({checked_at:new Date().toISOString(),checks,editorial:{planned:90,drafted:docs.length,eligible:docs.filter(d=>!validatePublic(d,registry).length).length,manifest:Object.keys(published.current).length},production_deployed:false},null,2));
