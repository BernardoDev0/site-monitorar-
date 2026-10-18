import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { ArrowUpRight, Play, Pause } from 'lucide-react';
const poster = '/media/refinaria2-poster.jpg';
import { WHATSAPP_URL, recordContactClick } from '@/lib/contact';

export function VideoHero({ children }: PropsWithChildren) {
  const video = useRef<HTMLVideoElement>(null);
  const visible = useRef(true);
  const choice = useRef<'play' | 'pause' | null>(null);
  const syncPlayback = useRef<() => void>(() => {});
  const [showControl, setShowControl] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    let disposed = false;
    media.muted = true;
    try { const saved = sessionStorage.getItem('monitorar:hero-playback'); if (saved === 'play' || saved === 'pause') choice.current = saved; } catch { /* Playback works without storage. */ }
    const offerControl = () => { if (!disposed) setShowControl(true); };
    const update = () => {
      if (disposed) return;
      const restricted = preference.matches || connection?.saveData;
      if (restricted || choice.current) offerControl();
      if (choice.current === 'pause' || (restricted && choice.current !== 'play') || !visible.current || document.hidden) media.pause();
      else void media.play().catch(error => { if (error.name !== 'AbortError') offerControl(); });
    };
    syncPlayback.current = update;
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; update(); }, {threshold: .1});
    observer.observe(media);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    media.addEventListener('canplay', update);
    window.addEventListener('pageshow', update);
    update();
    return () => { disposed = true; syncPlayback.current = () => {}; observer.disconnect(); preference.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); media.removeEventListener('canplay', update); window.removeEventListener('pageshow', update); media.pause(); };
  }, []);
  const togglePlayback = () => {
    choice.current = video.current?.paused ? 'play' : 'pause';
    try { sessionStorage.setItem('monitorar:hero-playback', choice.current); } catch { /* Storage is optional. */ }
    syncPlayback.current();
  };
  return <section className="erm-hero" aria-label="Apresentação da Monitorar">
    <video ref={video} className="erm-hero-photo" muted loop playsInline preload="metadata" poster={poster}
      onPlaying={() => { setPlaying(true); setFailed(false); }} onPause={() => setPlaying(false)}
      onError={() => setFailed(true)} aria-label="Vídeo de uma instalação industrial">
      <source src="/media/refinaria-pingpong-mobile.mp4" media="(max-width: 767px)" type="video/mp4"/>
      <source src="/media/refinaria-pingpong-desktop.mp4" type="video/mp4"/>
    </video>
    <div className="erm-hero-shade"/>
    <div className="container erm-hero-copy">{children}<a data-enter className="erm-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick('whatsapp')}>Fale com um Consultor<ArrowUpRight size={20} aria-hidden="true"/></a></div>
    {showControl && !failed && <button type="button" className="video-control" onClick={togglePlayback}>
      {playing ? <Pause size={16} aria-hidden="true"/> : <Play size={16} aria-hidden="true"/>}
      {playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
    </button>}
    {failed && <p role="status" className="video-status">Vídeo indisponível. A apresentação permanece acessível.</p>}
  </section>;
}
