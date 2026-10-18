import type { PropsWithChildren } from 'react';
import hero from './media/hero-1920.webp';
import heroMedium from './media/hero-1280.webp';
import heroSmall from './media/hero-640.webp';
import { WHATSAPP_URL, recordContactClick } from '@/lib/contact';

export function StaticHero({ children }: PropsWithChildren) {
  return <section className="erm-hero">
    <img src={hero} srcSet={`${heroSmall} 640w, ${heroMedium} 1280w, ${hero} 1920w`} sizes="100vw" alt="" width={1920} height={1080} fetchPriority="high" className="erm-hero-photo" />
    <div className="erm-hero-shade" />
    <div className="container erm-hero-copy">
      {children}
      <a data-enter className="erm-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick('whatsapp')}>Fale com um Consultor<span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
