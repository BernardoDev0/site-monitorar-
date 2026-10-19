"""Put a Google captcha on the owner's screen so that he can solve it. The scripts never solve or bypass it."""
import os, subprocess

CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'


def show(url):
    """Open `url` in a new window of the dedicated Chrome (same profile and debug port as scripts/gsc.py); Google answers with the captcha."""
    profile = os.path.join(os.environ['USERPROFILE'], '.cache', 'monitorar-seo-chrome')
    subprocess.Popen([CHROME, f'--user-data-dir={profile}', '--remote-debugging-port=9223', '--no-first-run', '--new-window', url])
