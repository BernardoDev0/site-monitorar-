"""Conservative local neural restoration. Originals are never overwritten.
Official SwinIR direct inference; no synthetic benchmark degradation.
"""
from pathlib import Path
import sys, json, urllib.request, hashlib, time
BASE=Path('D:/monitorar-tools/v4');BASE.mkdir(parents=True,exist_ok=True)
sys.path.insert(0,str(BASE/'python'))
sys.path.insert(0,str(BASE))
COMMIT='6545850fbf8df298df73d81f3e8cba638787c8bd'
def download(url,dest):
    if not dest.exists():
        temp=dest.with_suffix(dest.suffix+'.part');urllib.request.urlretrieve(url,temp);temp.replace(dest)
for name in ['network_swinir.py']:
    download(f'https://raw.githubusercontent.com/JingyunLiang/SwinIR/{COMMIT}/models/{name}',BASE/name)
download(f'https://raw.githubusercontent.com/JingyunLiang/SwinIR/{COMMIT}/LICENSE',BASE/'SwinIR-LICENSE')
weights='005_colorDN_DFWB_s128w8_SwinIR-M_noise15.pth'
download('https://github.com/JingyunLiang/SwinIR/releases/download/v0.0/'+weights,BASE/weights)
import torch
import numpy as np
from PIL import Image,ImageOps,ImageFile
# One legacy JPEG has a truncated terminal marker. Decode into a separate
# candidate and require visual review; never repair/overwrite the source.
ImageFile.LOAD_TRUNCATED_IMAGES=True
from network_swinir import SwinIR
torch.set_num_threads(4)
device='cuda' if torch.cuda.is_available() else 'cpu'
model=SwinIR(upscale=1,in_chans=3,img_size=128,window_size=8,img_range=1.,depths=[6]*6,embed_dim=180,num_heads=[6]*6,mlp_ratio=2,upsampler='',resi_connection='1conv')
state=torch.load(BASE/weights,map_location='cpu',weights_only=True)
model.load_state_dict(state.get('params',state),strict=True);model.eval().to(device)
local=['src/assets/hero-refinery.jpg','src/assets/paisagem.png','public/epis.png',*[f'public/pessoas/Picture{i}.jpg' for i in [12,13,14]],'public/servicos/licenciamento.jpg','public/paisagem2.png','public/equipe/equipe5.png','public/equipe/equipe1.JPG','public/equipe/equipe2.jpeg','public/equipe/equipe6.jpeg','src/assets/refinary+floresta.png','public/faleconosco.png','public/depoimentos.png','public/paisagem4.png.png',*[f'public/servicos/{n}.jpg' for n in ['qualidade-ar','areas-impactadas','avaliacao-ruido','gestao-sms','hazop','auditorias','treinamentos']]]
remote=['photo-1518837695005-2083093ee35b','photo-1441974231531-c6227db76b6e','photo-1486406146926-c627a92ad1ab','photo-1581594549595-35f6edc7b762']
originals=BASE/'remote-originals';originals.mkdir(exist_ok=True)
for name in remote:
    file=originals/(name+'.jpg');download(f'https://images.unsplash.com/{name}?auto=format&fit=crop&w=2400&q=90',file);local.append(str(file))
out=Path('docs/organic/v4/evidence/photos');out.mkdir(parents=True,exist_ok=True)
candidates=BASE/'candidates';candidates.mkdir(exist_ok=True)
records=[]
for i,name in enumerate(local):
    source=Path(name)
    if not source.exists(): records.append({'source':name,'status':'missing'});continue
    result=candidates/f'{i+1:02}.png'
    original=ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    start=time.time()
    if not result.exists():
        array=np.asarray(original).astype(np.float32)/255
        inp=torch.from_numpy(array.transpose(2,0,1).copy()).unsqueeze(0)
        h,w=inp.shape[-2:];ph=(8-h%8)%8;pw=(8-w%8)%8
        inp=torch.nn.functional.pad(inp,(0,pw,0,ph),mode='reflect');hh,ww=inp.shape[-2:]
        acc=torch.zeros_like(inp);count=torch.zeros_like(inp)
        tile=128;overlap=32
        ys=list(range(0,max(1,hh-tile),tile-overlap))+[max(0,hh-tile)]
        xs=list(range(0,max(1,ww-tile),tile-overlap))+[max(0,ww-tile)]
        with torch.inference_mode():
            for y in sorted(set(ys)):
                for x in sorted(set(xs)):
                    patch=inp[:,:,y:y+tile,x:x+tile].to(device)
                    pred=model(patch).cpu();acc[:,:,y:y+tile,x:x+tile]+=pred;count[:,:,y:y+tile,x:x+tile]+=1
        arr=(acc/count)[:,:,:h,:w].squeeze(0).permute(1,2,0).clamp(0,1).numpy()
        # Conservative blend, not a generative replacement.
        enhanced=Image.fromarray(np.uint8(np.clip(array*.65+arr*.35,0,1)*255+.5))
        enhanced.save(result)
    enhanced=Image.open(result)
    pair=Image.new('RGB',(960,540),(245,247,245))
    for x,img in [(0,original),(480,enhanced)]:
        thumb=ImageOps.contain(img,(470,530));pair.paste(thumb,(x+(480-thumb.width)//2,(540-thumb.height)//2))
    pair.save(out/f'{i+1:02}-comparison.jpg',quality=90)
    record={'id':i+1,'source':name,'sha256_original':hashlib.sha256(source.read_bytes()).hexdigest(),'candidate':str(result),'size':original.size,'model':weights,'blend':.35,'status':'candidate_requires_visual_review','seconds':round(time.time()-start,2)}
    records.append(record);(out/'manifest.json').write_text(json.dumps({'code_commit':COMMIT,'weights_sha256':hashlib.sha256((BASE/weights).read_bytes()).hexdigest(),'device':device,'records':records},ensure_ascii=False,indent=2),encoding='utf8')
    print(json.dumps(record),flush=True)
