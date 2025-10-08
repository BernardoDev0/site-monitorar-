interface LogosCarouselProps {
  logos: { src: string; alt: string; className?: string }[];
  speed?: number; // segundos por loop
}

// Carrossel contínuo (marquee) com CSS-only + duplicação de trilha para loop infinito
export function LogosCarousel({ logos, speed = 25 }: LogosCarouselProps) {
  const track = [...logos, ...logos];
  return (
    <div className="relative overflow-hidden">
      <div
        className="flex items-center gap-12 animate-marquee will-change-transform"
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            className={`h-10 md:h-12 object-contain opacity-80 hover:opacity-100 transition-opacity ${logo.className ?? ""}`}
          />
        ))}
      </div>
    </div>
  );
}


