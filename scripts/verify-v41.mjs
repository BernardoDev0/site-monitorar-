import {spawnSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const out='docs/organic/v4.1/evidence/checks';await mkdir(out,{recursive:true});
const npm=process.env.npm_execpath||path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
const checks=[];
for(const task of ['typecheck','lint','build','build:preview','test']){
 const result=spawnSync(process.execPath,[npm,'run',task],{encoding:'utf8'});
 await writeFile(`${out}/${task.replace(':','-')}.txt`,(result.stdout||'')+(result.stderr||''));
 checks.push({task,exit_code:result.status});console.log(task+': '+(result.status===0?'PASS':'FAIL'));
 await writeFile(`${out}/results.json`,JSON.stringify({at:new Date().toISOString(),checks},null,2));
 if(result.status!==0){console.error(result.stderr||result.stdout);process.exit(result.status||1);}
}
