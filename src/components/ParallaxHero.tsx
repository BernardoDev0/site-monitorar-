import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface ParallaxHeroProps {
  backgroundUrl?: string;
  backgroundVideo?: string;
  overlayClassName?: string;
  className?: string;
}

// Parallax leve via transform em um wrapper para evitar background-attachment: fixed (ruim em iOS)
export function ParallaxHero({ backgroundUrl, backgroundVideo, overlayClassName = "hero-gradient", className = "", children }: PropsWithChildren<ParallaxHeroProps>) {
  const reduced = usePrefersReducedMotion();
  const bgRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY * 0.15;
        const element = backgroundVideo ? videoRef.current : bgRef.current;
        if (element) element.style.transform = `translate3d(0, ${y}px, 0) scale(1.02)`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced, backgroundVideo]);

  return (
    <section className={`relative h-screen flex items-center justify-center text-white overflow-hidden -mt-[80px] ${className}`}>
      {backgroundVideo ? (
        <>
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover will-change-transform transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => {
              console.log('Video loaded successfully');
              setVideoLoaded(true);
            }}
            onError={(e) => {
              console.error('Video failed to load:', e);
              setVideoError(true);
              if (videoRef.current) {
                videoRef.current.style.display = 'none';
              }
            }}
            onCanPlay={() => {
              console.log('Video can start playing');
              if (videoRef.current) {
                videoRef.current.play().catch(e => {
                  console.error('Video play failed:', e);
                  setVideoError(true);
                });
              }
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
            Seu navegador não suporta vídeos HTML5.
          </video>
          {/* Fallback image - always show until video loads or if video fails */}
          <div 
            ref={bgRef} 
            className={`absolute inset-0 will-change-transform transition-opacity duration-1000 ${
              videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ 
              backgroundImage: `url(${backgroundUrl})`, 
              backgroundSize: "cover", 
              backgroundPosition: "center"
            }} 
          />
        </>
      ) : (
        <div ref={bgRef} className="absolute inset-0 will-change-transform" style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      )}
      <div className={`absolute inset-0 ${overlayClassName}`}></div>
      <div className="relative z-10 container mx-auto px-4 text-center">
        {children}
      </div>
    </section>
  );
}


