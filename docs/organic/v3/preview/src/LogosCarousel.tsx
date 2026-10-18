import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props { logos: { src: string; alt: string; className?: string }[]; speed?: number }
export function LogosCarousel({ logos }: Props) {
  const track=useRef<HTMLUListElement>(null);
  const move=(direction:number) => track.current?.scrollBy({left:direction * track.current.clientWidth * .8, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return <div className="erm-logo-carousel">
    <div className="erm-logo-controls"><button aria-label="Clientes anteriores" onClick={()=>move(-1)}><ArrowLeft size={21}/></button><button aria-label="Próximos clientes" onClick={()=>move(1)}><ArrowRight size={21}/></button></div>
    <ul ref={track} tabIndex={0} aria-label="Clientes da Monitorar, role para ver todos" className="erm-logo-track">{logos.map(logo=><li key={logo.src}><img src={logo.src} alt={logo.alt} loading="lazy" width={160} height={80}/></li>)}</ul>
  </div>;
}
