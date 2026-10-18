from pathlib import Path
import imageio_ffmpeg,subprocess,numpy as np,json
from PIL import Image,ImageDraw
ff=imageio_ffmpeg.get_ffmpeg_exe();path='public/media/refinaria-pingpong-desktop.mp4'
r=subprocess.run([ff,'-v','error','-i',path,'-vf','scale=160:90','-f','rawvideo','-pix_fmt','rgb24','-'],capture_output=True,check=True)
a=np.frombuffer(r.stdout,dtype=np.uint8).reshape(-1,90,160,3).astype(np.float32)
mae=lambda x,y:float(np.abs(x-y).mean())
report={'frames':len(a),'expected_frames':1194,'duration':len(a)/60,'reversed_pair_mae':{str(i):mae(a[i],a[-i]) for i in [20,150,300,500]},'loop_seam_mae':mae(a[-1],a[0]),'normal_first_step_mae':mae(a[0],a[1]),'turn_step_mae':mae(a[597],a[598])}
assert len(a)==1194 and max(report['reversed_pair_mae'].values())<3
out=Path('docs/organic/v4.2/evidence');out.mkdir(parents=True,exist_ok=True);(out/'video-frames.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
# Three actual-size samples to inspect interpolation around structures and edges.
for i,t in enumerate([2.25,5.25,8.25]):
 subprocess.run([ff,'-y','-v','error','-ss',str(t),'-i',path,'-frames:v','1',str(out/f'video-sample-{i}.png')],check=True)
