from pathlib import Path
import subprocess,imageio_ffmpeg,json,hashlib
ff=imageio_ffmpeg.get_ffmpeg_exe();out=Path('D:/monitorar-tools/motion');out.mkdir(exist_ok=True)
source=Path('public/media/refinaria-desktop.mp4');inter=out/'forward-60.mp4'
def run(args):
 with (out/'encode.log').open('a') as log:subprocess.run([ff,'-y','-hide_banner',*args],stdout=log,stderr=log,check=True)
if not inter.exists():run(['-i',str(source),'-an','-vf','scale=1280:-2,minterpolate=fps=60:mi_mode=mci:mc_mode=obmc:me_mode=bidir:vsbmc=1','-c:v','libx264','-preset','fast','-crf','20','-threads','4',str(inter)])
frames,_=imageio_ffmpeg.count_frames_and_secs(str(inter))
print('60 fps interpolation ready: '+str(frames)+' frames',flush=True)
run(['-i',str(inter),'-filter_complex',f'[0:v]split[f][r];[r]reverse,trim=start_frame=1:end_frame={frames-1},setpts=PTS-STARTPTS[b];[f][b]concat=n=2:v=1:a=0,setpts=N/(60*TB)[v]','-map','[v]','-an','-c:v','libx264','-preset','fast','-crf','21','-threads','4','-r','60','-fps_mode','cfr','-video_track_timescale','15360','-movflags','+faststart','public/media/refinaria-pingpong-desktop.mp4'])
run(['-i','public/media/refinaria-pingpong-desktop.mp4','-vf','scale=768:-2','-an','-c:v','libx264','-preset','fast','-crf','23','-threads','4','-r','60','-fps_mode','cfr','-video_track_timescale','15360','-movflags','+faststart','public/media/refinaria-pingpong-mobile.mp4'])
Path('docs/organic/v4.2').mkdir(exist_ok=True)
Path('docs/organic/v4.2/video.json').write_text(json.dumps({'source':str(source),'sha256_source':hashlib.sha256(source.read_bytes()).hexdigest(),'source_fps':24,'output_fps':60,'forward_frames':frames,'output_frames':2*frames-2,'duration_seconds':(2*frames-2)/60,'method':'FFmpeg motion-compensated interpolation then forward/reverse concatenation; original retained','outputs':['/media/refinaria-pingpong-desktop.mp4','/media/refinaria-pingpong-mobile.mp4']},indent=2))
print('Desktop and mobile ping-pong complete',flush=True)
