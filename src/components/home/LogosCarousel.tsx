import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props { logos: { src: string; alt: string; className?: string }[]; speed?: number }
export function LogosCarousel({ logos, speed = 40 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current, belt = track.current;
    if (!element || !belt) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      element.dataset.animated = 'true';
      const tween = gsap.fromTo(belt, {xPercent:0}, {xPercent:-50,duration:Number.isFinite(speed) && speed > 0 ? speed : 40,ease:'none',repeat:-1,paused:true});
      let visible = false;
      const update = () => { if (visible && !document.hidden) tween.play(); else tween.pause(); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
      observer.observe(element);
      document.addEventListener('visibilitychange',update);
      return () => { tween.kill(); gsap.set(belt,{clearProps:'transform'}); delete element.dataset.animated; observer.disconnect(); document.removeEventListener('visibilitychange',update); };
    });
    return () => mm.revert();
  }, [speed]);
  return <div ref={root} className="client-marquee">
    <div className="client-marquee-window" tabIndex={0} role="region" aria-label="Clientes da Monitorar">
      <div ref={track} className="client-marquee-belt">{[0,1].map(copy=><ul key={copy} className="client-marquee-group" aria-hidden={copy===1?true:undefined}>{logos.map(logo=><li key={logo.src} className={logo.className}><img src={logo.src} alt={copy===0?logo.alt:''} loading="lazy" width={160} height={80}/></li>)}</ul>)}</div>
    </div>
  </div>;
}
