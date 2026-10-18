"""Browser regression: python scripts/check-home-motion.py [origin]. Requires Playwright and Chrome."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

origin = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:4173'
results = []
with sync_playwright() as p:
    browser = p.chromium.launch(channel='chrome')
    for width, motion in [(1440, 'reduce'), (1440, 'no-preference'), (390, 'reduce')]:
        page = browser.new_page(viewport={'width': width, 'height': 900}, reduced_motion=motion)
        # The removed manual-pause feature must not keep returning visitors stuck.
        page.add_init_script("sessionStorage.setItem('monitorar:hero-playback','pause')")
        page.goto(origin, wait_until='domcontentloaded')
        page.wait_for_function('document.querySelector("video").currentTime > .5')
        page.wait_for_selector('[data-motion="active"]')
        assert page.locator('.video-control').count() == 0
        video = page.locator('video').evaluate('(v)=>({time:v.currentTime,ready:v.readyState,muted:v.muted,autoplay:v.autoplay})')
        assert video['autoplay'] and video['muted'] and video['ready'] >= 3
        target = page.locator('.erm-service').first
        assert float(target.evaluate('(e)=>getComputedStyle(e).opacity')) == 0
        target.evaluate('(e)=>window.scrollTo(0,scrollY+e.getBoundingClientRect().top-innerHeight*.7)')
        page.wait_for_timeout(180)
        middle = float(target.evaluate('(e)=>getComputedStyle(e).opacity'))
        assert 0 < middle < 1, middle
        page.wait_for_timeout(650)
        assert float(target.evaluate('(e)=>getComputedStyle(e).opacity')) == 1
        page.locator('.client-marquee').scroll_into_view_if_needed()
        page.wait_for_timeout(250)
        belt = page.locator('.client-marquee-belt')
        before = belt.evaluate('(e)=>getComputedStyle(e).transform')
        page.wait_for_timeout(700)
        after = belt.evaluate('(e)=>getComputedStyle(e).transform')
        assert before != after
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        results.append({'width':width, 'preference':motion, 'video':video, 'revealMidOpacity':middle, 'carouselBefore':before, 'carouselAfter':after})
        page.close()
    page = browser.new_page(java_script_enabled=False)
    page.goto(origin, wait_until='domcontentloaded')
    assert page.locator('h1').is_visible()
    assert page.locator('.erm-service').first.is_visible()
    assert page.locator('meta[name="google-site-verification"]').get_attribute('content') == '6zXIzKJxknnZ7cfnG7h44ehIHX8HMKWDgoWj3fEdXR4'
    browser.close()
report = {'origin':origin, 'results':results, 'noJavaScriptContentVisible':True, 'googleVerificationInHTML':True}
folder = Path('docs/organic/home-header-fix')
folder.mkdir(parents=True,exist_ok=True)
(folder / ('motion-live.json' if origin.startswith('https:') else 'motion-local.json')).write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
