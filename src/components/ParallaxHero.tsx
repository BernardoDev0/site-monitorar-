import { useState, type PropsWithChildren } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import heroImage from "@/assets/hero-refinery.jpg";
interface ParallaxHeroProps { backgroundUrl?: string; backgroundVideo?: string; overlayClassName?: string; className?: string }
export function ParallaxHero({backgroundUrl, backgroundVideo, overlayClassName = "hero-gradient", className = "", children}: PropsWithChildren<ParallaxHeroProps>) {
  const [playing, setPlaying] = useState(false);
  const reduced = usePrefersReducedMotion();
  return <section className={`relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden ${className}`}>
    <img src={backgroundUrl || heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
    {playing && !reduced && backgroundVideo && <video src={backgroundVideo} autoPlay muted loop playsInline preload="none" className="absolute inset-0 w-full h-full object-cover" onError={() => setPlaying(false)} />}
    <div className={`absolute inset-0 ${overlayClassName}`} />
    <div className="relative z-10 container mx-auto px-4 py-16 text-center">{children}
      {backgroundVideo && !reduced && <button type="button" onClick={() => setPlaying(!playing)} className="mt-8 px-4 py-3 rounded border border-white/70 text-sm">{playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo (38 MB)"}</button>}
    </div>
  </section>;
}
