"""Versioned photo candidates. No original is overwritten; export requires review."""
from pathlib import Path
import argparse, ast, hashlib, json, sys, time, urllib.request
import numpy as np
from PIL import Image, ImageOps, ImageFile, ImageFilter, ImageDraw, ImageChops

ImageFile.LOAD_TRUNCATED_IMAGES = True
BASE=Path('D:/monitorar-tools/v4'); OUT=Path('D:/monitorar-tools/v4.1')
EVIDENCE=Path('docs/organic/v4.1/evidence/photos')
OUT.mkdir(parents=True,exist_ok=True); EVIDENCE.mkdir(parents=True,exist_ok=True)
parser=argparse.ArgumentParser();parser.add_argument('--ids',nargs='*',type=int);parser.add_argument('--export-reviewed',nargs='*',type=int);args=parser.parse_args()
old=json.loads(Path('docs/organic/v4/evidence/photos/manifest.json').read_text(encoding='utf8'))
records=old['records'].copy()
extras=['src/assets/refinary plant.png','src/assets/seguranca_industrial.png','public/equipe/equipe3.jpeg','public/equipe/equipe4.jpg','public/equipe/foto-07.jpg.jpeg','public/equipe/foto-08.jpg.jpeg','public/equipe/matheus.jpeg','public/monitorar/trabalhar-img.jpeg','src/assets/environmental-monitoring.jpg','src/assets/safety-inspection.jpg']
for source in extras:
 p=Path(source)
 if not p.exists():
  matches=list(Path('public').rglob(p.name))+list(Path('src/assets').rglob(p.name))
  if len(matches)!=1: raise ValueError('Ambiguous photo '+source)
  p=matches[0]
 records.append({'id':len(records)+1,'source':str(p)})
protect={}
tree=ast.parse(Path('scripts/export-v4-photos.py').read_text(encoding='utf8'))
for node in tree.body:
 if isinstance(node,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='protect' for t in node.targets):protect=ast.literal_eval(node.value)
# Additional portraits remain original pixels; sharpening is deterministic.
for i in [30,31,32,33,34,35]:protect[i]=[(0,0,1,1)]
def source_key(p):
 return p.stem if p.is_absolute() else '/'+str(p).replace('\\','/').removeprefix('public/')
manifest_path=EVIDENCE/'manifest.json'
report=json.loads(manifest_path.read_text(encoding='utf8')) if manifest_path.exists() else {'records':[]}
if args.export_reviewed is not None:
 mapping=json.loads(Path('src/lib/photos.json').read_text(encoding='utf8'))
 public=Path('public/media/photos-v41');public.mkdir(parents=True,exist_ok=True)
 for r in report['records']:
  if r['id'] not in args.export_reviewed:continue
  if any(tuple(box)==(0,0,1,1) for box in r.get('protected_rectangles',[])):
   r['method']='original_resampling_and_deterministic_unsharp';r['neural_contribution']=False
  else:r['neural_contribution']=True
  original=Path(r['source']);assert hashlib.sha256(original.read_bytes()).hexdigest()==r['sha256_original']
  im=Image.open(r['candidate']);w,h=im.size;files=[]
  for width in sorted({min(w,n) for n in [480,800,1200,1600,1920]}):
   variant=im.resize((width,round(h*width/w)),Image.Resampling.LANCZOS)
   dest=public/f"{r['id']:02}-{width}.webp";variant.save(dest,quality=90,method=6)
   files.append({'src':'/'+str(dest).replace('\\','/').removeprefix('public/'),'width':width,'bytes':dest.stat().st_size})
  mapping[source_key(original)]={'src':files[-1]['src'],'srcSet':', '.join(f"{f['src']} {f['width']}w" for f in files),'width':w,'height':h}
  r.update(status='agent_visual_review_accepted',files=files,review='Comparison sheets and representative full-resolution crops; not human technical approval.')
 Path('src/lib/photos.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2),encoding='utf8')
 manifest_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print('Exported reviewed sources:',args.export_reviewed);sys.exit()

sys.path[:0]=[str(BASE/'python'),str(BASE)]
import torch
from network_swinir import SwinIR
torch.set_num_threads(4)
weights='001_classicalSR_DF2K_s64w8_SwinIR-M_x2.pth';checkpoint=OUT/weights
if not checkpoint.exists():
 temp=checkpoint.with_suffix('.part');urllib.request.urlretrieve('https://github.com/JingyunLiang/SwinIR/releases/download/v0.0/'+weights,temp);temp.replace(checkpoint)
device='cuda' if torch.cuda.is_available() else 'cpu'
model=SwinIR(upscale=2,in_chans=3,img_size=64,window_size=8,img_range=1.,depths=[6]*6,embed_dim=180,num_heads=[6]*6,mlp_ratio=2,upsampler='pixelshuffle',resi_connection='1conv')
model.load_state_dict(torch.load(checkpoint,map_location='cpu',weights_only=True)['params'],strict=True);model.eval().to(device)
report.update(model=weights,weights_sha256=hashlib.sha256(checkpoint.read_bytes()).hexdigest(),code_commit=old['code_commit'],device=device)
for record in records:
 i=record['id']
 if args.ids and i not in args.ids:continue
 result=OUT/f'{i:02}-refined.png';source=Path(record['source']);original=ImageOps.exif_transpose(Image.open(source)).convert('RGB');start=time.time();w,h=original.size
 method='classical_sr_x2_protected_then_unsharp'
 if not result.exists():
  # High resolution sources already have a neural denoise candidate; avoid unnecessary enlargement.
  prior=Path(record.get('candidate','missing'))
  if w>=1200 and prior.is_file():
   candidate=Image.open(prior).convert('RGB');base=original;method='prior_neural_denoise_protected_then_unsharp'
  else:
   array=np.asarray(original).astype(np.float32)/255
   inp=torch.from_numpy(array.transpose(2,0,1).copy()).unsqueeze(0)
   inp=torch.nn.functional.pad(inp,(0,(8-w%8)%8,0,(8-h%8)%8),mode='reflect');hh,ww=inp.shape[-2:]
   acc=torch.zeros((1,3,hh*2,ww*2));count=torch.zeros((1,1,hh*2,ww*2));tile=192;overlap=24
   ys=sorted(set(list(range(0,max(1,hh-tile),tile-overlap))+[max(0,hh-tile)]));xs=sorted(set(list(range(0,max(1,ww-tile),tile-overlap))+[max(0,ww-tile)]))
   with torch.inference_mode():
    for y in ys:
     for x in xs:
      pred=model(inp[:,:,y:y+tile,x:x+tile].to(device)).cpu();ph,pw=pred.shape[-2:]
      acc[:,:,y*2:y*2+ph,x*2:x*2+pw]+=pred;count[:,:,y*2:y*2+ph,x*2:x*2+pw]+=1
   arr=(acc/count)[:,:,:h*2,:w*2].squeeze(0).permute(1,2,0).clamp(0,1).numpy()
   candidate=Image.fromarray(np.uint8(arr*255+.5));base=original.resize(candidate.size,Image.Resampling.LANCZOS)
   candidate=Image.blend(base,candidate,.7)
  cw,ch=candidate.size;mask=Image.new('L',(cw,ch),0);draw=ImageDraw.Draw(mask)
  for box in protect.get(i,[]):draw.rectangle(tuple(round(v*(cw if j%2==0 else ch)) for j,v in enumerate(box)),fill=255)
  mask=ImageChops.lighter(mask,mask.filter(ImageFilter.GaussianBlur(8)))
  final=Image.composite(base,candidate,mask).filter(ImageFilter.UnsharpMask(radius=.9,percent=85,threshold=3));final.save(result)
 else:
  prior_record=next((r for r in report['records'] if r['id']==i),None)
  if prior_record:method=prior_record['method']
 if any(tuple(box)==(0,0,1,1) for box in protect.get(i,[])):method='original_resampling_and_deterministic_unsharp'
 final=Image.open(result)
 sheet=Image.new('RGB',(1200,640),(245,247,245));draw=ImageDraw.Draw(sheet)
 for offset,im,label in [(0,original,'ORIGINAL'),(600,final,'CANDIDATE')]:
  thumb=ImageOps.contain(im,(580,590));sheet.paste(thumb,(offset+(600-thumb.width)//2,32+(590-thumb.height)//2));draw.text((offset+16,12),label,fill=(36,48,76))
 sheet.save(EVIDENCE/f'{i:02}-comparison.jpg',quality=92)
 record={**record,'source':str(source),'sha256_original':hashlib.sha256(source.read_bytes()).hexdigest(),'candidate':str(result),'original_size':original.size,'size':final.size,'method':method,'protected_rectangles':protect.get(i,[]),'status':'candidate_requires_visual_review','seconds':round(time.time()-start,2)}
 report['records']=[r for r in report['records'] if r['id']!=i]+[record];report['records'].sort(key=lambda r:r['id'])
 manifest_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print(json.dumps({'id':i,'seconds':record['seconds'],'method':method}),flush=True)
