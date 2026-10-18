"""Export visually reviewed neural candidates with original-pixel protection."""
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw,ImageFilter,ImageChops,ImageFile
import json,hashlib
ImageFile.LOAD_TRUNCATED_IMAGES=True
folder=Path('docs/organic/v4/evidence/photos');manifest=json.loads((folder/'manifest.json').read_text(encoding='utf8'))
out=Path('public/media/photos');out.mkdir(parents=True,exist_ok=True)
# Normalized rectangles cover people, signage, documents and instrument details.
protect={3:[(.6,0,1,1)],4:[(0,0,1,.95)],5:[(.25,.3,.8,.9)],6:[(.1,.25,.72,1)],7:[(0,.3,1,1)],9:[(0,0,1,1)],10:[(.04,.16,.94,.98)],11:[(0,.25,1,1)],12:[(.12,.2,.9,.92)],14:[(.28,0,.85,1)],15:[(0,.25,1,1)],18:[(.32,.05,1,.95)],19:[(0,.2,.85,1)],20:[(0,.2,1,1)],21:[(.08,.15,.96,.95)],22:[(.05,.05,.8,1)],23:[(.05,.15,1,1)],27:[(.1,0,.85,.3),(.15,.15,1,1)]}
mapping={};accepted=[]
for r in manifest['records']:
 i=r['id']
 if i not in range(1,28):raise ValueError('Candidate outside reviewed batch')
 source=Path(r['source']);original=ImageOps.exif_transpose(Image.open(source)).convert('RGB');candidate=Image.open(r['candidate']).convert('RGB');w,h=original.size
 mask=Image.new('L',(w,h),0);draw=ImageDraw.Draw(mask)
 for box in protect.get(i,[]):draw.rectangle(tuple(round(v*(w if j%2==0 else h)) for j,v in enumerate(box)),fill=255)
 mask=ImageChops.lighter(mask,mask.filter(ImageFilter.GaussianBlur(12)))
 final=Image.composite(original,candidate,mask)
 # Source 9 has identity text throughout; retain it entirely, without claiming AI change.
 widths=sorted(set([min(600,w),min(960,w),min(1440,w),w if w<1920 else 1920]))
 files=[]
 for width in widths:
  variant=final.resize((width,round(h*width/w)),Image.Resampling.LANCZOS);name=f'{i:02}-{width}.webp';variant.save(out/name,quality=90,method=6)
  files.append({'url':'/media/photos/'+name,'width':width,'bytes':(out/name).stat().st_size})
 key='/'+str(source).replace('\\','/').removeprefix('public/')
 if source.is_absolute():key=source.stem
 mapping[key]={'src':files[-1]['url'],'srcSet':', '.join(f"{f['url']} {f['width']}w" for f in files),'width':w,'height':h}
 accepted.append({**r,'status':'original_retained_identity' if i==9 else 'accepted_with_protected_regions' if i in protect else 'accepted_conservative_denoise','protected_rectangles':protect.get(i,[]),'files':files,'original_unchanged':hashlib.sha256(source.read_bytes()).hexdigest()==r['sha256_original'],'review':'Visual comparison and center crops at 200%; protected regions retain original pixels before web encoding. Not human company approval.','legacy_decode_note':'Original JPEG terminal byte missing; recoverable raster decoded separately.' if i==10 else None})
(folder/'accepted.json').write_text(json.dumps(accepted,ensure_ascii=False,indent=2),encoding='utf8')
Path('src/lib/photos.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'reviewed':len(accepted),'neural_derivatives':sum(r['status']!='original_retained_identity' for r in accepted),'original_retained':1,'bytes':sum(f['bytes'] for r in accepted for f in r['files'])}))
