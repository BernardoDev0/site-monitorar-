"""Turn the images the owner downloaded from ChatGPT into article covers, after his review.

Flow (the requests come from scripts/chatgpt-image-briefs.py):
  list            images in imagens-chatgpt/ not yet matched, oldest first
  build           for every file in imagens-chatgpt/mapping.json ({"<file>": "<document code>"}): WebP variants in
                  public/media/covers/ and a review page imagens-chatgpt/revisao.html
  approve CODES   publish the reviewed covers ("all" or codes such as 019 022): content/editorial-media.json entries
                  with status generated-reviewed, which scripts/editorial-media.mjs uses instead of the shared archive photos
The matching (file -> code) is done by looking at each image against imagens-chatgpt/briefs.json.
Captions stay neutral ("Imagem ilustrativa."): no claim that the picture is a photo of Monitorar's own work.
"""
import argparse, html, json, pathlib, sys
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
INBOX = ROOT / 'imagens-chatgpt'
COVERS = ROOT / 'public' / 'media' / 'covers'
MANIFEST = ROOT / 'content' / 'editorial-media.json'
WIDTHS = (480, 800, 1200)
RATIO = 3 / 2
CAPTION = 'Imagem ilustrativa.'


def load(path, default):
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else default


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def briefs():
    return {b['code']: b for b in load(INBOX / 'briefs.json', [])}


def alt_text(scene):
    # The scene is written as a description already; keep its first sentence, without the style instructions.
    first = scene.split('. ')[0].rstrip('.')
    return first + '.'


def crop_to_ratio(image):
    width, height = image.size
    if abs(width / height - RATIO) < 0.01:
        return image
    if width / height > RATIO:
        new_width = round(height * RATIO)
        left = (width - new_width) // 2
        return image.crop((left, 0, left + new_width, height))
    new_height = round(width / RATIO)
    top = (height - new_height) // 2
    return image.crop((0, top, width, top + new_height))


def cmd_list(_):
    mapped = load(INBOX / 'mapping.json', {})
    files = sorted((p for p in INBOX.iterdir() if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp')), key=lambda p: p.stat().st_mtime)
    for p in files:
        print(('mapped ' + mapped[p.name]) if p.name in mapped else 'new   ', p.name)
    print(json.dumps({'images': len(files), 'mapped': sum(p.name in mapped for p in files), 'codes': len(briefs())}))


def cmd_build(_):
    mapping, by_code = load(INBOX / 'mapping.json', {}), briefs()
    codes = list(mapping.values())
    duplicates = sorted({c for c in codes if codes.count(c) > 1})
    if duplicates:
        sys.exit(f'one image per code; repeated: {duplicates}')
    COVERS.mkdir(parents=True, exist_ok=True)
    pending = {}
    for name, code in mapping.items():
        brief = by_code.get(code) or sys.exit(f'unknown code {code} for {name}')
        image = crop_to_ratio(Image.open(INBOX / name).convert('RGB'))
        variants = []
        for width in WIDTHS:
            if width > image.width:
                continue
            target = COVERS / f'{code}-{width}.webp'
            image.resize((width, round(width / RATIO)), Image.LANCZOS).save(target, 'WEBP', quality=80, method=6)
            variants.append((width, f'/media/covers/{code}-{width}.webp'))
        width, src = variants[-1]
        pending[code] = {'slug': brief['slug'], 'source': name, 'media': {
            'src': src, 'srcSet': ', '.join(f'{path} {w}w' for w, path in variants), 'width': width, 'height': round(width / RATIO),
            'alt': alt_text(brief['scene']), 'caption': CAPTION, 'sourceId': f'chatgpt:{code}', 'focalPoint': '50% 50%', 'status': 'generated-reviewed'}}
    save(INBOX / 'pending.json', pending)
    cards = ''.join(
        f'<figure><img src="../public{p["media"]["src"]}" alt=""><figcaption><b>{code}</b> {html.escape(by_code[code]["title"])}</figcaption></figure>'
        for code, p in sorted(pending.items()))
    missing = ', '.join(sorted(set(by_code) - set(pending))) or 'nenhum'
    (INBOX / 'revisao.html').write_text(
        '<!doctype html><meta charset="utf-8"><title>Revisão das capas</title><style>body{font:15px system-ui;margin:16px;background:#f5f6f2}'
        'div{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}figure{margin:0;background:#fff;border-radius:10px;overflow:hidden}'
        'img{width:100%;display:block}figcaption{padding:8px}</style>'
        f'<h1>Revisão das capas ({len(pending)} de {len(by_code)})</h1><p>Sem imagem ainda: {html.escape(missing)}</p><div>{cards}</div>', encoding='utf-8')
    print(json.dumps({'built': len(pending), 'review': str(INBOX / 'revisao.html'), 'without_image': len(by_code) - len(pending)}))


def cmd_approve(args):
    pending, manifest = load(INBOX / 'pending.json', {}), load(MANIFEST, None)
    codes = list(pending) if args.codes == ['all'] else args.codes
    for code in codes:
        entry = pending.get(code) or sys.exit(f'code {code} has no built image')
        manifest['articles'][entry['slug']] = entry['media']
    save(MANIFEST, manifest)
    print(json.dumps({'approved': len(codes), 'covers_in_manifest': len(manifest['articles'])}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    sub = parser.add_subparsers(dest='command', required=True)
    sub.add_parser('list').set_defaults(run=cmd_list)
    sub.add_parser('build').set_defaults(run=cmd_build)
    approve = sub.add_parser('approve')
    approve.add_argument('codes', nargs='+')
    approve.set_defaults(run=cmd_approve)
    args = parser.parse_args()
    args.run(args)
