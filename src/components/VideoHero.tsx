import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { photoUrl } from '@/lib/photo';
const poster=photoUrl('/src/assets/hero-refinery.jpg');
import { WHATSAPP_URL, recordContactClick } from '@/lib/contact';

export function VideoHero({ children }: PropsWithChildren) {
  const video = useRef<HTMLVideoElement>(null);
  const visible = useRef(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const media = video.current;
    if (!media) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection;
    let disposed = false;
    const update = () => {
      if (disposed) return;
      if (preference.matches || connection?.saveData || !visible.current || document.hidden) media.pause();
      else void media.play().catch(() => { /* Autoplay denied: retain the poster without controls. */ });
    };
    const observer = new IntersectionObserver(([entry]) => { visible.current = entry.isIntersecting; update(); }, {threshold: .1});
    observer.observe(media);
    preference.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => { disposed = true; observer.disconnect(); preference.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); media.pause(); };
  }, []);
  return <section className="erm-hero" aria-label="Apresentação da Monitorar">
    <video ref={video} className="erm-hero-photo" muted loop playsInline preload="metadata" poster={poster}
      onError={() => setFailed(true)} aria-label="Vídeo de uma instalação industrial">
      <source src="/media/refinaria-pingpong-mobile.mp4" media="(max-width: 767px)" type="video/mp4"/>
      <source src="/media/refinaria-pingpong-desktop.mp4" type="video/mp4"/>
    </video>
    <div className="erm-hero-shade"/>
    <div className="container erm-hero-copy">{children}<a data-enter className="erm-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick('whatsapp')}>Fale com um Consultor<span aria-hidden="true">↗</span></a></div>
    {failed && <p role="status" className="video-status">Vídeo indisponível. A apresentação permanece acessível.</p>}
  </section>;
}
