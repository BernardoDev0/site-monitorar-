import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {legacy} from './routes.mjs';
const catalog=JSON.parse(await readFile('content/catalog.json','utf8'));
if(catalog.length<90||new Set(catalog.map(c=>c.slug)).size!==catalog.length)throw new Error('At least 90 distinct paths required');
const columns='id,proposed_path,existing_url,page_type,cluster,audience,primary_intent,primary_topic,secondary_queries,business_value,demand_evidence,original_contribution,source_ids,commercial_claims_status,author_reviewer,parent_page,internal_links_in,internal_links_out,canonical_strategy,cta,priority,effort,content_status,publication_blocker'.split(',');
const quote=s=>'"'+String(s??'').replaceAll('"','""')+'"';
const pilot=new Set(['002','019','021','023','013','022','006','053','009','082']);
await mkdir('docs/organic/briefs',{recursive:true});
const rows=[];
for(const c of catalog){
 const hub=catalog.find(x=>x.type==='hub'&&x.cluster===c.cluster);
 const service=catalog.find(x=>x.type==='service'&&x.cluster===c.cluster);
 const peers=catalog.filter(x=>x.cluster===c.cluster&&x.id!==c.id).slice(0,3);
 const source=c.cluster==='fugitivas'?'EPA21;EPA-LDAR':c.cluster==='ruido'?'WHO-NOISE':c.cluster==='hazop'?'IEC-HAZOP':'PESQUISA-PRIMARIA-PENDENTE';
 const state=pilot.has(c.id)?'rascunho':'brief';
 rows.push([c.id,c.slug,legacy.some(x=>x.path===c.slug)?'https://www.monitorarconsultoria.com.br'+c.slug:'',c.type,c.cluster,'Responsáveis ambientais; engenharia; SMS; compras',c.type==='service'?'comercial':c.type==='hub'?'orientação editorial':'informacional',c.title,'a pesquisar por pauta','Relaciona necessidade técnica a serviço declarado','Amostra de busca por cluster; demanda individual não medida',c.contribution,source,c.type==='service'?'pendente de evidência':'revisão técnica pendente','a designar',hub?.slug||'/servicos',hub?.slug||'/servicos',[service?.slug,...peers.map(p=>p.slug)].filter(Boolean).join(';'),'self após conteúdo distinto aprovado; preservar canonical legado até substituição','/contato',pilot.has(c.id)?'P1':'P2','revisão especializada',state,'fontes específicas; autor/revisor reais; aprovação de versão']);
 const brief='# '+c.id+' · '+c.title+'\n\nEstado: '+state+'. Nenhuma aprovação ou medição de demanda individual.\n\n## Objetivo e diferença\n'+c.contribution+'.\nIntenção: '+(c.type==='service'?'contratação e delimitação de oferta':c.type==='hub'?'orientação entre necessidades, com síntese própria':'resolver uma dúvida técnica específica')+'.\n\n## Perguntas a responder\n- '+c.contribution+'?\n- Que evidências sustentam a resposta e quais limitações mudam a conclusão?\n- Qual é a próxima decisão que o leitor consegue tomar com esta informação?\n\n## Contribuição própria\n'+c.contribution+'. Produzir exemplo ilustrativo, matriz ou roteiro específico desta pergunta; não atribuir exemplo a cliente real.\n\n## Fontes e revisão\nFontes candidatas: '+source+'. Consultar fonte primária específica, registrar versão, data e aplicabilidade antes de usar. Revisor técnico e autor: a designar. Nenhuma instrução operacional sem validação.\n\n## Fronteira de intenção\nNão repetir as respostas completas de '+peers.map(p=>p.title).join('; ')+'. Comparar a necessidade atendida antes da redação; unir e substituir pauta se houver sobreposição.\n\n## Vínculos\nEntrada: '+(hub?.slug||'/servicos')+'\nSaída: '+[service?.slug,...peers.map(p=>p.slug)].filter(Boolean).join(', ')+'\nCTA: contato contextual. Links de rascunhos só na prévia local; só versões aprovadas na navegação pública.\n\n## Bloqueios\nRevisão técnica e editorial, fontes, autorização de alegações e aprovação por hash. Petrobras requer análise independente; normas requerem vigência e jurisdição; equipamentos não presumem disponibilidade.\n';
 try { await writeFile('docs/organic/briefs/'+c.id+'.md',brief,{flag:'wx'}); }
 catch(error) { if(error.code!=='EEXIST') throw error; }
}
await writeFile('docs/organic/url-map.csv',[columns.map(quote).join(','),...rows.map(r=>r.map(quote).join(','))].join('\n')+'\n');
await writeFile('docs/organic/redirect-map.csv','existing_path,target_path,action,reason,expected_status\n'+legacy.map(r=>[r.path,r.path,'preserve','preservação de URL existente; canonical '+r.canonical,'200'].join(',')).join('\n')+'\n');
console.log('90 proposals and briefs materialized');
