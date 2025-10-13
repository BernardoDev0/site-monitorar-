import { useEffect, useRef } from 'react';

interface LogosCarouselProps {
  logos: { src: string; alt: string; className?: string }[];
  speed?: number;
}

export function LogosCarousel({ logos, speed = 40 }: LogosCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Duplica as logos para garantir loop infinito contínuo
  const track = [...logos, ...logos];

  useEffect(() => {
    const trackElement = trackRef.current;
    if (!trackElement) return;

    // Debug: informações sobre o carrossel
    console.log('--- LogosCarousel Debug ---');
    console.log('Total logos:', logos.length);
    console.log('Duplicated track length:', track.length);
    
    if (trackElement) {
      console.log('Track width:', trackElement.scrollWidth);
      console.log('Animation duration:', `${speed}s`);
      
      // Medir a largura de cada logo individualmente
      const logoElements = trackElement.children;
      let totalWidth = 0;
      for (let i = 0; i < logoElements.length; i++) {
        const element = logoElements[i] as HTMLElement;
        const width = element.offsetWidth;
        totalWidth += width + 80; // 80 = gap
        console.log(`Logo ${i} width:`, width);
      }
      console.log('Calculated total width:', totalWidth);
      
      // Log de animação
      const computedStyle = window.getComputedStyle(trackElement);
      console.log('Animation name:', computedStyle.animationName);
      console.log('Animation duration:', computedStyle.animationDuration);
      console.log('Animation timing function:', computedStyle.animationTimingFunction);
      console.log('Expected translateX at 100%: -50% (for duplicated content)');
    }
    
    console.log('--- End Debug ---');
  }, [logos, speed, track]);

  return (
    <div className="w-full overflow-hidden py-6">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .logos-track {
          display: flex;
          gap: 80px;
          width: fit-content;
          animation: scroll linear infinite;
          will-change: transform;
          padding: 0 20px;
        }



        .logo-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-item img {
          max-height: 100%;
          object-fit: contain;
        }
        
        .nitriflex-logo img {
          height: 3.5rem !important; /* h-14 */
          width: auto !important;
        }
        
        @media (min-width: 768px) {
          .nitriflex-logo img {
            height: 4rem !important; /* md:h-16 */
            width: auto !important;
          }
        }
      `}</style>

      <div
        ref={trackRef}
        className="logos-track"
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {track.map((logo, i) => {
          // Verifica se é a imagem da Nitriflex para aplicar tratamento especial
          const isNitriflex = logo.src.includes('nitriflex');
          
          // Define as classes base
          let logoClasses = "logo-item w-32 md:w-40";
          
          if (isNitriflex) {
            // Para nitriflex, vamos adicionar classes específicas
            logoClasses += " nitriflex-logo h-12 md:h-16"; // mantém dimensões base para o container
          } else if (logo.className) {
            // Para outros logos com classes personalizadas
            logoClasses += ` ${logo.className}`;
          } else {
            // Para logos sem classes personalizadas
            logoClasses += " h-12 md:h-16";
          }
          
          return (
            <div 
              key={i} 
              className={logoClasses}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                loading="lazy"
                className={`h-full object-contain opacity-100 ${isNitriflex ? 'nitriflex-image' : ''}`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}