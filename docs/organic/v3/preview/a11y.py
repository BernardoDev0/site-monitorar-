"""Repeatable axe check using the existing, externally stored audit dependency."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright
out=Path(__file__).resolve().parent.parent/'evidence'
with sync_playwright() as p:
    browser=p.chromium.launch();results=[]
    for width in [390,1440]:
        page=browser.new_page(viewport={'width':width,'height':900})
        page.goto('http://127.0.0.1:4191/',wait_until='networkidle')
        page.add_script_tag(path='D:/monitorar-recovery/20261017-192451/axe.min.js')
        result=page.evaluate('async()=>await axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa","wcag22aa"]}})')
        results.append({'width':width,'violations':result['violations'],'incomplete':result['incomplete'],'passes':len(result['passes'])})
        page.close()
    browser.close()
(out/'axe.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps([{'width':r['width'],'violations':len(r['violations'])} for r in results]))
assert all(not r['violations'] for r in results), 'Review axe.json'
