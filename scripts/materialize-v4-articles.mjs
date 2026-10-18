import {readFile,writeFile,readdir} from 'node:fs/promises';
import {documentSchema,origin} from './editorial.mjs';
const catalog=JSON.parse(await readFile('content/catalog.json','utf8'));
const added=[
 ['ar','Médias e picos na qualidade do ar: por que o período importa'],['ar','Dados ausentes no monitoramento do ar'],['ar','Padrões de qualidade do ar: como verificar a referência vigente'],
 ['ruido','Por que decibéis não se somam como números comuns'],['ruido','Ruído tonal e impulsivo'],['ruido','Incerteza de medição em relatórios de ruído ambiental'],
 ['areas','Resultado não detectado em análises ambientais'],['areas','Valores orientadores e avaliação de risco'],['areas','Mudança de uso da área e validade das conclusões ambientais'],
 ['licenciamento','Como organizar resposta a pedido de complementação'],['licenciamento','Licença ambiental e outras autorizações'],['licenciamento','Consulta e participação pública no licenciamento'],
 ['sms','Amostragem de evidências em auditorias de SMS'],['sms','Troca de informações de riscos entre contratante e contratadas'],['hazop','Nós e intenção de projeto em estudos HAZOP'],
 ['treinamentos','Conteúdo prático e modalidade de capacitação'],['equipamentos','Interferências e sensibilidade cruzada em detectores de gases'],['equipamentos','Documentação do equipamento e adequação à aplicação']
];
for(const [i,[cluster,title]] of added.entries()){
 const id=String(91+i).padStart(3,'0');
 if(!catalog.some(d=>d.id===id))catalog.push({id,slug:'/blog/'+title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,''),title,contribution:'Pergunta e análise própria conforme corpo editorial V4; revisão técnica pendente.',cluster,type:'article'});
}
const sourceGroups={
 fugitivas:['https://www.epa.gov/emc/method-21-volatile-organic-compound-leaks','https://www.epa.gov/sites/default/files/2014-02/documents/ldarguide.pdf'],
 ar:['https://www.epa.gov/pm-pollution/particulate-matter-pm-basics','https://www.epa.gov/air-quality-management-process/managing-air-quality-ambient-air-monitoring'],
 ruido:['https://www.who.int/europe/publications/i/item/9789289053563'],
 areas:['https://www.epa.gov/risk/regional-screening-levels-rsls-users-guide'],
 licenciamento:['https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp140.htm','https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15190.htm'],
 sms:['https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1'],
 hazop:['https://www.hse.gov.uk/comah/sragtech/techmeasplantmod.htm'],
 treinamentos:['https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/nr-1'],
 equipamentos:['https://www.draeger.com/Content/Documents/Products/x-am-5600-technical-manual-ifu-9033072-en.pdf']
};
const individualSources={
 '044':['https://sustentabilidade.petrobras.com.br/w/sobre-o-relatorio-1'],
 ...Object.fromEntries(['050','051','052'].map(id=>[id,['https://www.inea.rj.gov.br/procon-fumaca-preta/']])),
 '093':['https://conama.mma.gov.br/?id=827&option=com_sisconama&task=arquivo.download'],
 '094':['https://www.hse.gov.uk/noise/calculator.htm'],
 '096':['https://www.bipm.org/en/committees/jc/jcgm/publications'],
 '080':sourceGroups.hazop,
};
catalog.find(d=>d.id==='045').title=catalog.find(d=>d.id==='045').title.replace('MP2, 5','MP2,5');
let created=0;
for(const filename of (await readdir('docs/organic/v4/articles')).filter(n=>n.endsWith('.md'))){
 const source=await readFile('docs/organic/v4/articles/'+filename,'utf8');
 for(const raw of source.split(/^@@ /m).slice(1)){
  const id=raw.slice(0,3),entry=catalog.find(d=>d.id===id);if(!entry)throw new Error('Unknown article '+id);
  const body=raw.split(/^## /m).slice(1).map(section=>{const [heading,...lines]=section.trim().split('\n');const paragraphs=lines.join('\n').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);return {heading,paragraphs};});
  const file='content/documents/'+id+'.json';let existing;try{existing=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}
  if(existing)continue;
  const now=new Date().toISOString();
  const doc={id,slug:entry.slug,type:'article',title:entry.title,summary:body[0].paragraphs[0],topic_cluster:entry.cluster,primary_intent:'informacional',body,author_id:null,reviewer_id:null,evidence_ids:[],source_urls:sourceGroups[entry.cluster]||[],claim_status:'pending',service_links:[],related_content_ids:catalog.filter(x=>x.cluster===entry.cluster&&x.id!==id&&x.type==='article').slice(0,3).map(x=>x.id),created_at:now,first_published_at:null,reviewed_at:null,substantive_updated_at:now,status:'technical_review',approved_by:null,approved_version:null,scheduled_at:null,canonical_url:origin+entry.slug,indexability:false,review_due_at:null};
  doc.source_urls=individualSources[id]||doc.source_urls;
  documentSchema.parse(doc);await writeFile(file,JSON.stringify(doc,null,2)+'\n');created++;
 }
}
await writeFile('content/catalog.json',JSON.stringify(catalog,null,2)+'\n');
console.log(JSON.stringify({created,catalog:catalog.length,articles:catalog.filter(d=>d.type==='article').length}));
