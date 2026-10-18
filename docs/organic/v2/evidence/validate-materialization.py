"""Validate the V2 documentary deliverable without changing source code.
Writes only its report and artifact manifest under docs/organic/v2/evidence.
Run from any cwd: python -X utf8 docs/organic/v2/evidence/validate-materialization.py
"""
from pathlib import Path
import collections, csv, datetime, hashlib, json, re, struct, subprocess, sys
ROOT = Path(__file__).resolve().parents[4]
DOC = ROOT / "docs/organic/v2"
SPEC = ROOT / "specs/organic/v2"
checks = []
def check(name, condition, detail=None):
    checks.append({"name":name,"passed":bool(condition),"detail":detail})
def read_json(p):
    return json.loads(p.read_text(encoding="utf-8-sig"))
def read_csv(p):
    with p.open(encoding="utf-8-sig", newline="") as f:
        reader=csv.DictReader(f); rows=list(reader)
        return reader.fieldnames, rows
def digest(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()
main=["PLAN.md","AUDIT-DELTA.md","AMBIENS-RESEARCH.md","ambiens-inventory.csv","CONTENT-ARCHITECTURE.md","url-map-v2.csv","DESIGN-PLAN.md","design-coverage.csv","TASKS.md","VALIDATION-AND-RELEASE.md","DECISIONS-AND-BLOCKERS.md","SOURCES-AND-SKILLS.md","EXECUTION-STATE.md"]
check("13 main artifacts exist and are nonempty",all((DOC/n).is_file() and (DOC/n).stat().st_size for n in main))
specs=sorted(SPEC.glob("*.md"))
check("seven specifications",len(specs)==7)
for p in specs:
    text=p.read_text(encoding="utf-8")
    check("spec sections: "+p.name,all(s in text for s in ["Problema comprovado","Objetivo","Fora de escopo","Componentes e arquivos","Requisitos","Decisões","Estados vazios","Dependências","Critérios de aceite","Testes e evidências","Riscos","Reversão"]))
fields, rows=read_csv(DOC/"url-map-v2.csv")
oldfields, oldrows=read_csv(ROOT/"docs/organic/url-map.csv")
ids={r["id"] for r in rows}; paths={r["proposed_path"] for r in rows}
check("90 unique stable IDs and paths",len(rows)==len(ids)==len(paths)==90 and ids=={r["id"] for r in oldrows})
check("24 original columns preserved first",fields[:len(oldfields)]==oldfields and len(oldfields)==24)
check("12 services 6 hubs 72 articles",collections.Counter(r["page_type"] for r in rows)=={"service":12,"hub":6,"article":72})
check("nine batches of ten",collections.Counter(r["batch_v2"] for r in rows)=={str(i):10 for i in range(1,10)})
byid={r["id"]:r for r in rows}; bypath={r["proposed_path"]:r for r in rows}
changes=[r["id"] for r in rows if r["proposed_path"]!=r["current_path"]]
check("only040/060 paths replaced",set(changes)=={"040","060"},changes)
check("training cluster corrected",all(byid[i]["cluster"]=="treinamentos" for i in ["011","085","086"]))
check("specific editorial fields nonempty",all(all(r[k].strip() for k in ["own_question","intent_boundary","planned_artifact","specific_research","acceptance_criteria","planned_outline","publication_blocker"]) for r in rows))
check("90 distinct questions",len({r["own_question"] for r in rows})==90)
link_errors=[]
for r in rows:
    for key in ["internal_links_in","internal_links_out","related_ids","service_ids"]:
        links=[x.strip() for x in r[key].split(";") if x.strip()]
        if len(links)!=len(set(links)) or (r["id"] if key.endswith("_ids") else r["proposed_path"]) in links: link_errors.append((r["id"],key))
        if key.endswith("_ids") and any(x not in ids for x in links): link_errors.append((r["id"],"unknown id"))
    seen=set(); node=r
    while node and node["proposed_path"] not in seen:
        seen.add(node["proposed_path"]); parent=node["parent_page"]; node=bypath.get(parent)
    if node: link_errors.append((r["id"],"parent cycle"))
check("explicit relationships unique without selflinks/parent cycles",not link_errors,link_errors)
briefs=sorted((DOC/"briefs").glob("*.md"))
check("90 matching briefs",len(briefs)==90 and {p.stem for p in briefs}==ids)
check("brief identities match paths and questions",all(r["proposed_path"] in (DOC/"briefs"/(r["id"]+".md")).read_text(encoding="utf-8") and r["own_question"] in (DOC/"briefs"/(r["id"]+".md")).read_text(encoding="utf-8") for r in rows))
matrix=read_json(DOC/"evidence/editorial-matrix.json")
check("structured editorial matrix has90rows",len(matrix["matrix"])==90)
afields, ar=read_csv(DOC/"ambiens-inventory.csv")
required="source_url discovered_from accessed_at access_status canonical_observed source_title page_type topic_cluster search_intent read_status own_summary observable_strengths unanswered_questions overlapping_topics monitorar_fit recommended_action target_monitorar_id primary_research_needed limitations".split()
check("Ambiens required19columns",set(required)<=set(afields),sorted(set(required)-set(afields)))
urlkey="source_url" if "source_url" in afields else "url"
statekey="read_status" if "read_status" in afields else "reading_state"
check("785 unique Ambiens URLs",len(ar)==len({r[urlkey] for r in ar})==785)
snap=read_json(DOC/"evidence/ambiens-research-snapshot.json")
check("Ambiens CSV/snapshot same URLs",{r[urlkey] for r in ar}=={r["url"] for r in snap["inventory"]})
states=collections.Counter(r[statekey] for r in ar)
expected={"main_body_read":24,"metadata_extracted_not_read":332,"http_404_no_body_review":39,"excluded_not_requested":372,"technical_pagination_checked":17,"technical_blank_variant_checked":1}
check("Ambiens reading states reconcile",states==expected,dict(states))
check("24 own semantic notes",len(snap["semantic_notes"])==24)
mapped=[(r["id"],u) for r in rows for u in r["ambiens_source_urls"].split(";") if u]
read_urls={r[urlkey] for r in ar if r[statekey]=="main_body_read"}
check("editorial semantic mappings use read sources",all(u in read_urls for _,u in mapped),[(i,u) for i,u in mapped if u not in read_urls])
cfields, coverage=read_csv(DOC/"design-coverage.csv")
cf="route_or_family components visitor_goal current_issue proposed_design_change impeccable_application taste_application content_dependency responsive_states interaction_states planned_test evidence_required status".split()
check("design coverage13fields and17rows",set(cf)<=set(cfields) and len(coverage)==17)
legacy=re.findall(r"\[\s*'([^']*)'",(ROOT/"scripts/routes.mjs").read_text(encoding="utf-8"))
covered={v.strip() for r in coverage for v in r["route_or_family"].split(" + ")}
check("all17legacy routes covered",len(legacy)==17 and set(legacy)<=covered,sorted(set(legacy)-covered))
tasks=read_json(DOC/"evidence/tasks.json")
taskfields="id specification requirement_ids priority dependencies actual_files_or_components concrete_change skill_and_reference acceptance_test evidence_to_save human_dependency permission_needed estimated_effort rollback".split()
check("task contract complete",len(tasks)==27 and all(all(k in t and t[k] for k in taskfields) for t in tasks))
check("eight first implementation tasks",sum(bool(re.fullmatch(r"B0[1-8]",t["id"])) for t in tasks)==8)
reqs=set()
for p in specs: reqs.update(re.findall(r"\| (S\d{2}-R\d{2}) \|",p.read_text(encoding="utf-8")))
refs={r for t in tasks for r in t["requirement_ids"]}
check("28 requirements defined and covered",len(reqs)==28 and reqs==refs,{"unknown":sorted(refs-reqs),"uncovered":sorted(reqs-refs)})
taskids={t["id"] for t in tasks}
check("task dependencies refer to known IDs",all(d in taskids for t in tasks for d in t["dependencies"] if re.fullmatch(r"[BCDEFM]\d{2}",d)))
baseline=read_json(DOC/"evidence/preservation-baseline.json")
changed=[r["path"] for r in baseline["files"] if not (ROOT/r["path"]).is_file() or digest(ROOT/r["path"])!=r["sha256"]]
check("321 preexisting files unchanged",len(baseline["files"])==321 and not changed,changed)
prior=read_json(DOC/"evidence/editorial-materialization-validation.json")
# Verify every artifact hash from the earlier independent editorial materialization.
hashes=prior.get("file_hashes",{})
mismatches=[]
if isinstance(hashes,dict):
    for name,value in hashes.items():
        value=value.get("sha256") if isinstance(value,dict) else value
        p=Path(name) if Path(name).is_absolute() else ROOT/name
        if not p.is_file() or digest(p)!=value: mismatches.append(name)
else:
    for item in hashes:
        name=item.get("path",item.get("file","")); value=item.get("sha256",item.get("hash"))
        p=Path(name) if Path(name).is_absolute() else ROOT/name
        if not p.is_file() or digest(p)!=value: mismatches.append(name)
check("independent editorial artifact hashes preserved",not mismatches,mismatches)
badlinks=[]
for p in list(DOC.rglob("*.md"))+specs:
    for target in re.findall(r"\]\(([^)]+)\)",p.read_text(encoding="utf-8")):
        target=target.strip("<>").split("#")[0]
        if not target or re.match(r"[a-zA-Z][\w+.-]*://",target) or target.startswith("mailto:"): continue
        if not (p.parent/target).resolve().exists(): badlinks.append({"file":str(p.relative_to(ROOT)),"target":target})
check("relative markdown links resolve",not badlinks,badlinks)
shots=[]
for p in sorted((DOC/"evidence/screenshots").glob("*.png")):
    data=p.read_bytes(); w,h=struct.unpack(">II",data[16:24])
    shots.append({"path":p.relative_to(ROOT).as_posix(),"width":w,"height":h,"sha256":digest(p),"audit_date":"2026-10-17","meaning":"current site, not proposed redesign"})
check("15 real PNG screenshots at recorded widths",len(shots)==15 and collections.Counter(x["width"] for x in shots)=={1440:12,390:3})
(DOC/"evidence/screenshots-manifest.json").write_text(json.dumps(shots,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
assetsfields,assets=read_csv(DOC/"evidence/assets-inventory.csv")
check("62 existing assets match inventory hashes",len(assets)==62 and all((ROOT/r["path"]).is_file() and digest(ROOT/r["path"])==r["sha256"] for r in assets))
diff=subprocess.run(["git","diff","--check"],cwd=ROOT,text=True,capture_output=True)
check("git diff --check",diff.returncode==0,diff.stdout+diff.stderr)
trailing=[]
for p in list(DOC.rglob("*.md"))+specs:
    for n,line in enumerate(p.read_text(encoding="utf-8").splitlines(),1):
        if line.rstrip()!=line: trailing.append(str(p.relative_to(ROOT))+":"+str(n))
check("new Markdown has no trailing whitespace",not trailing,trailing[:20])
report={"verified_at_utc":datetime.datetime.now(datetime.timezone.utc).isoformat(),"scope":"documentation, cross-artifact contracts and preservation only; no redesign tests","status":"pass" if all(c["passed"] for c in checks) else "fail","passed":sum(c["passed"] for c in checks),"total":len(checks),"checks":checks,"not_run":["build/preview/test/typecheck/lint were already run during audit; not repeated for unchanged code","redesign browser tests","new Lighthouse protocol","NVDA","production release/indexing/analytics"]}
(DOC/"evidence/materialization-validation.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
artifacts=[]
for p in sorted(list(DOC.rglob("*"))+list(SPEC.rglob("*"))):
    if p.is_file() and p.name!="artifact-manifest.json":
        artifacts.append({"path":p.relative_to(ROOT).as_posix(),"bytes":p.stat().st_size,"sha256":digest(p)})
(DOC/"evidence/artifact-manifest.json").write_text(json.dumps({"generated_at_utc":report["verified_at_utc"],"excludes":"this manifest itself","files":artifacts},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print(json.dumps({"status":report["status"],"passed":report["passed"],"total":report["total"],"artifact_files_excluding_manifest":len(artifacts),"failures":[c for c in checks if not c["passed"]]},ensure_ascii=False,indent=2))
sys.exit(0 if report["status"]=="pass" else 1)
