import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Factory, Zap, Waves, Hammer, Truck } from "lucide-react";
// Imagem de fundo com refinaria e floresta
import industrialBg from "@/assets/refinary+floresta.png";

// Clientes reais da Monitorar (usando imagens da pasta /public/clientes/)
type Client = {
  name?: string;
  logo: string;
  sector: string;
  isSpecial?: boolean;
};

const clients: Client[] = [
  {  
    logo: "/clientes/petrobras.png",
    sector: "Petroquímica"
  },
  { 
    name: "", 
    logo: "/clientes/ipiranga.png",
    sector: "Combustíveis"
  },
  { 
    name: "", 
    logo: "/clientes/csn.png",
    sector: "Siderurgia"
  },
  { 
    name: "", 
    logo: "/clientes/transpetro.png",
    sector: "Logística",
    isSpecial: true
  },
  { 
    name: "", 
    logo: "/clientes/firjan.png",
    sector: "Industrial",
    isSpecial: true
  },
  { 
    name: "", 
    logo: "/clientes/drager.png",
    sector: "Equipamentos"
  },
  { 
    name: "", 
    logo: "/clientes/ream.png",
    sector: "Industrial"
  },
  { 
    name: "", 
    logo: "/clientes/rand.png",
    sector: "Equipamentos"
  },
  { 
    name: "", 
    logo: "/clientes/iconic.png",
    sector: "Lubrificantes"
  },
  { 
    name: "", 
    logo: "/clientes/lubrizol.png",
    sector: "Químicos"
  },
  { 
    name: "", 
    logo: "/clientes/nitriflex.png",
    sector: "Borrachas",
    isSpecial: true
  },
];

const sectors = [
  { 
    name: "Petroquímica", 
    icon: Factory, 
    description: "Refinarias e plantas químicas",
    count: 15
  },
  { 
    name: "Siderurgia", 
    icon: Building2, 
    description: "Usinas e metalúrgicas",
    count: 12
  },
  { 
    name: "Combustíveis", 
    icon: Zap, 
    description: "Distribuidoras e postos",
    count: 18
  },
  { 
    name: "Equipamentos", 
    icon: Hammer, 
    description: "Fabricantes de equipamentos",
    count: 20
  },
  { 
    name: "Químicos", 
    icon: Waves, 
    description: "Indústria química especializada",
    count: 14
  },
  { 
    name: "Logística", 
    icon: Truck, 
    description: "Transporte e armazenagem",
    count: 16
  },
];

export default function Clients() {
  return (
    <div className="min-h-screen py-20 pt-32 md:pt-36 lg:pt-40">
      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slide-in-up {
            animation: slideInUp 0.5s ease-out forwards;
            opacity: 0;
          }
          
          /* Otimização para performance */
          .client-card {
            contain: layout style paint;
            will-change: transform;
          }
        `
      }} />
      
      <div className="container mx-auto px-4">


        {/* Hero Clientes (imagem sob o header) */}
        <div className="mb-12 relative rounded-3xl overflow-hidden mt-0 z-0">
          {/* Background image FREE + overlays no mesmo estilo da página Sobre */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `url(${industrialBg})`,
                filter: 'brightness(0.85) contrast(1.2) saturate(1.15)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-emerald-900/60 to-green-800/70" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="text-center py-16 relative">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-30" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Nossos Clientes</span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
                Empresas que confiam em nosso trabalho
              </h2>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Parceiros de renome que escolheram a <span className="font-semibold text-green-200">Monitorar</span> para suas necessidades de 
                <span className="font-semibold text-green-200"> segurança</span> e 
                <span className="font-semibold text-emerald-300"> meio ambiente</span>
              </p>
              
              {/* Linha decorativa (alto contraste) */}
              <div className="flex items-center justify-center mt-8">
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <div className="mx-4 w-3.5 h-3.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] ring-2 ring-white/40" />
                <div className="h-[2px] w-40 bg-gradient-to-l from-transparent via-white/80 to-transparent" />
              </div>
            </div>
          </div>

        </div>

        {/* Logos Grid - abaixo do herói, SEM imagem de fundo */}
        <div className="relative rounded-3xl">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {clients.map((client, index) => (
              <div
                key={index}
                className="group relative animate-slide-in-up"
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="client-card relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 aspect-[4/3] p-6 flex flex-col items-center justify-center">
                    <div className={`w-full h-16 flex items-center justify-center mb-3 relative ${client.isSpecial ? 'h-32' : ''}`}>
                      <img
                        src={client.logo}
                        alt={`Logo ${client.name}`}
                        className={`max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200 will-change-transform ${client.isSpecial ? 'h-28' : ''}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const nextElement = target.nextElementSibling as HTMLElement;
                          if (nextElement) nextElement.style.display = 'flex';
                        }}
                      />
                      <div 
                        className="hidden w-full h-full items-center justify-center text-base font-bold bg-gradient-to-br from-primary to-secondary text-white rounded-xl shadow-md"
                        style={{ display: 'none' }}
                      >
                        <span className="text-center px-2">
                          {client.name}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors duration-200 text-center">
                      {client.name}
                    </h3>
                    <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Badge variant="outline" className="text-xs">
                        {client.sector}
                      </Badge>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats - Movido para baixo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <Card className="card-service text-center">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Projetos Realizados</div>
            </CardContent>
          </Card>
          <Card className="card-service text-center">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-secondary mb-2">16</div>
              <div className="text-muted-foreground">Anos de Experiência</div>
            </CardContent>
          </Card>
          <Card className="card-service text-center">
            <CardContent className="p-8">
              <div className="text-4xl font-bold text-secondary mb-2">11</div>
              <div className="text-muted-foreground">Grandes Clientes</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}