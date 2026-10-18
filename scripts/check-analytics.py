"""Exercise the production-origin gate and consent with local assets; no real GA hits."""
from pathlib import Path
from urllib.parse import urlsplit
import json
import mimetypes
from playwright.sync_api import sync_playwright

origin = 'https://www.monitorarconsultoria.com.br'
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    context = browser.new_context(viewport={'width':390,'height':844})
    google_requests = []
    def handle(route):
        url = urlsplit(route.request.url)
        if url.hostname != 'www.monitorarconsultoria.com.br':
            if 'googletagmanager.com' in url.hostname or 'google-analytics.com' in url.hostname:
                google_requests.append(route.request.url)
            route.fulfill(status=200,body='/* test stub */',content_type='application/javascript')
            return
        name = url.path.lstrip('/') or 'index.html'
        if not Path(name).suffix: name += '.html'
        file = Path('dist') / name
        if not file.is_file(): route.fulfill(status=404); return
        route.fulfill(status=200,body=file.read_bytes(),content_type=mimetypes.guess_type(name)[0] or 'application/octet-stream')
    context.route('**/*',handle)
    page = context.new_page()
    page.goto(origin+'/?email=private@example.com#mensagem',wait_until='domcontentloaded')
    page.get_by_role('button',name='Não permitir',exact=True).wait_for()
    assert not google_requests
    page.get_by_role('button',name='Não permitir',exact=True).click()
    page.reload(wait_until='domcontentloaded')
    assert page.locator('.analytics-consent').is_hidden()
    assert not google_requests
    page.get_by_role('button',name='Preferências de cookies').click()
    page.get_by_role('button',name='Permitir',exact=True).click()
    page.wait_for_function('window.dataLayer?.length >= 4')
    assert len(google_requests)==1 and 'G-VD3JR25R7P' in google_requests[0]
    commands=page.evaluate('window.dataLayer.map(x=>Array.from(x))')
    config=[x for x in commands if x[0]=='config']
    assert len(config)==1 and config[0][2]['page_location']==origin+'/'
    # Prevent leaving the site; the real delegated analytics listener still runs.
    page.evaluate('document.addEventListener("click", e=>{if(e.target.closest("a"))e.preventDefault();})')
    page.locator('.erm-hero .erm-button').click()
    events=page.evaluate('window.dataLayer.map(x=>Array.from(x)).filter(x=>x[0]==="event")')
    assert len(events)==1 and events[0][1]=='contact_click'
    assert events[0][2]['contact_channel']=='whatsapp'
    assert 'private@example.com' not in json.dumps(commands+events,default=str)
    page.get_by_role('button',name='Preferências de cookies').click()
    page.get_by_role('button',name='Não permitir',exact=True).click()
    page.wait_for_load_state('domcontentloaded')
    assert page.evaluate('localStorage.getItem("monitorar:analytics-consent:v1")')=='denied'
    page.wait_for_timeout(300)
    assert len(google_requests)==1
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    browser.close()
report={'productionOriginMappedToLocalAssets':True,'realGoogleRequestsSent':False,'beforeConsentRequests':0,'deniedRequests':0,'acceptedTagLoads':1,'contactClicksCount':1,'queryAndHashRemoved':True,'revocationStopsReloadTracking':True,'mobileOverflow':False}
Path('docs/organic/seo-growth/analytics-browser.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
