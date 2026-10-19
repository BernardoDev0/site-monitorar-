"""Report whether Google's favicon store already holds the new square icon for the site.

The store (t3.gstatic.com/faviconV2) rescales the icon it has to the requested size. The previous icon was a
non-square PNG (601x539), so small sizes came back non-square (16x14, 32x28). Square results mean the new icon is registered.
Search results show the globe placeholder until then.
"""
import json, struct, sys, urllib.error, urllib.request
from datetime import datetime, timezone

SITE = 'https://www.monitorarconsultoria.com.br'
SIZES = (16, 32, 64, 128)


def fetch(size):
    url = f'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url={SITE}&size={size}'
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=20).read()
    except urllib.error.HTTPError as error:
        return {'size': size, 'http': error.code}
    width, height = struct.unpack('>II', data[16:24]) if data[:4] == b'\x89PNG' else (None, None)
    return {'size': size, 'http': 200, 'width': width, 'height': height, 'bytes': len(data)}


if __name__ == '__main__':
    readings = [fetch(size) for size in SIZES]
    small = [r for r in readings if r['size'] in (16, 32)]
    updated = all(r.get('width') == r.get('height') and r.get('width') for r in small)
    print(json.dumps({'checkedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'), 'updated': updated, 'readings': readings}))
    sys.exit(0 if updated else 1)
