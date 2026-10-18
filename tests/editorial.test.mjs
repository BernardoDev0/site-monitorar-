import test from 'node:test';import assert from 'node:assert/strict';
import {versionOf,validatePublic,simulate,rollback,loadCorpus,documentSchema,prepareRelease,validateManifest,publicDocument,readPause} from '../scripts/editorial.mjs';
import {editorialPages} from '../scripts/editorial-pages.mjs';
import {readFile} from 'node:fs/promises';
const now=new Date('2026-10-16T18:00:00.000Z');
function fixture(){
 const d={id:'fixture',slug:'/blog/fixture',type:'article',title:'Fixture de teste editorial',summary:'Documento sintético exclusivo para teste automatizado.',topic_cluster:'test',primary_intent:'test',
 body:[{heading:'Primeira seção',paragraphs:['Parágrafo sintético que verifica o contrato editorial.']},{heading:'Segunda seção',paragraphs:['Outro parágrafo sintético, sem alegações comerciais reais.']}],
 author_id:'test-author',reviewer_id:'test-reviewer',evidence_ids:['test-evidence'],source_urls:['https://example.org/source'],claim_status:'verified',service_links:[],related_content_ids:[],
 created_at:'2026-10-15T10:00:00.000Z',reviewed_at:'2026-10-16T10:00:00.000Z',substantive_updated_at:'2026-10-15T10:00:00.000Z',first_published_at:null,
 status:'approved',approved_by:'test-reviewer',approved_version:null,scheduled_at:null,canonical_url:'https://www.monitorarconsultoria.com.br/blog/fixture',indexability:true,review_due_at:'2027-01-01T00:00:00.000Z'};
 d.approved_sources={'https://example.org/source':'fixture-hash'};
 d.approved_version=versionOf(d);
 const registry={people:{'test-author':{authorized:true,name:'Test Person (fixture)'},'test-reviewer':{authorized:true,name:'Test Person (fixture)'}},evidence:{'test-evidence':{approved:true,authorized:true}},sources:{'https://example.org/source':{hash:'fixture-hash',available:true,checked_at:'2026-10-16T12:00:00.000Z'}}};
 return {d,registry};
}
test('real drafts parse but are blocked for publication',async()=>{const docs=await loadCorpus();assert.ok(docs.length>=10);for(const d of docs){assert.ok(documentSchema.safeParse(d).success);assert.ok(validatePublic(d,{now}).length>0);}});
test('108 distinct proposals with 12 services, 6 hubs and 90 articles',async()=>{const c=JSON.parse(await readFile('content/catalog.json'));assert.equal(c.length,108);assert.equal(new Set(c.map(x=>x.slug)).size,108);for(const [type,n] of [['service',12],['hub',6],['article',90]])assert.equal(c.filter(x=>x.type===type).length,n);});
test('approved version succeeds and a material edit invalidates approval',()=>{const {d,registry}=fixture();assert.deepEqual(validatePublic(d,{...registry,now}),[]);d.body[0].paragraphs[0]='Uma alteração substantiva posterior à revisão humana.';assert.ok(validatePublic(d,{...registry,now}).includes('approval does not match version'));});
test('missing source, expired review, future schedule and unauthorized reviewer fail closed',()=>{for(const mutate of [
 (d,r)=>r.sources[d.source_urls[0]].available=false,
 d=>d.review_due_at='2026-01-01T00:00:00.000Z',
 d=>d.scheduled_at='2027-01-01T00:00:00.000Z',
 (d,r)=>r.people[d.reviewer_id].authorized=false
 ]){const {d,registry}=fixture();mutate(d,registry);d.approved_version=versionOf(d);assert.ok(validatePublic(d,{...registry,now}).length>0);}});
test('simulation is idempotent, retains last version and supports rollback',()=>{const {d,registry}=fixture();const empty={current:{},history:[],runs:[]};const a=simulate(empty,[d],registry,{now});assert.equal(Object.keys(a.current).length,1);assert.equal(simulate(a,[d],registry,{now}),a);assert.deepEqual(rollback(a).current,{});d.body[0].paragraphs[0]='Alteração de conteúdo ainda não aprovada pelo responsável.';assert.throws(()=>simulate(a,[d],registry,{now}));assert.notEqual(a.current[d.slug].body[0].paragraphs[0],d.body[0].paragraphs[0]);});
test('pause, duplicate path and draft abort simulation',()=>{const {d,registry}=fixture(),empty={current:{},history:[],runs:[]};assert.throws(()=>simulate(empty,[d],registry,{paused:true,now}));assert.throws(()=>simulate(empty,[d,d],registry,{now}));d.status='draft';assert.throws(()=>simulate(empty,[d],registry,{now}));});

test('changed source and nameless person invalidate publication',()=>{const {d,registry}=fixture();registry.sources[d.source_urls[0]].hash='changed';assert.ok(validatePublic(d,{...registry,now}).some(e=>e.includes('source version')));registry.people[d.author_id].name=' ';assert.ok(validatePublic(d,{...registry,now}).includes('author_id not authorized'));});
test('release refuses deletions and pause; retains baseline',()=>{const {d,registry}=fixture();const empty={current:{},history:[],runs:[]};const existing=simulate(empty,[d],registry,{now});assert.throws(()=>prepareRelease(existing,empty,registry,{now}));assert.throws(()=>prepareRelease(existing,existing,registry,{now,paused:true}));assert.equal(prepareRelease(existing,existing,registry,{now}),existing);});
test('slug contract excludes trailing slash and sources require HTTPS',()=>{const {d}=fixture();d.slug+='/';assert.equal(documentSchema.safeParse(d).success,false);d.slug='/blog/fixture';d.source_urls=['http://example.org/source'];assert.equal(documentSchema.safeParse(d).success,false);});
test('same content cannot be published under a second slug',()=>{const {d,registry}=fixture();const other={...d,id:'another',slug:'/blog/another',canonical_url:'https://www.monitorarconsultoria.com.br/blog/another'};other.approved_version=versionOf(other);assert.throws(()=>simulate({current:{},history:[],runs:[]},[d,other],registry,{now}),/Duplicate/);});
test('reusing a previous approved version after a newer version restores it',()=>{const {d,registry}=fixture();const a=simulate({current:{},history:[],runs:[]},[d],registry,{now});const revised={...d,summary:'Uma revisão sintética diferente para verificar restauração.'};revised.approved_version=versionOf(revised);const b=simulate(a,[revised],registry,{now});const restored=simulate(b,[d],registry,{now});assert.equal(restored.current[d.slug].approved_version,d.approved_version);assert.equal(simulate(restored,[d],registry,{now}),restored);});
