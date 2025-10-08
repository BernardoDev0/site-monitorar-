import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
import { 
  Shield, 
  Leaf, 
  Award, 
  Users, 
  TrendingUp, 
  Globe,
  Factory,
  Truck,
  Building2,
  Ship,
  Wrench,
  HardHat,
  Flame,
  FileText,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-refinery.jpg";
// Video moved to public folder for better loading
import paisagemImage from "@/assets/paisagem.png";
import { ParallaxHero } from "@/components/ParallaxHero";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { AnimatedText } from "@/components/AnimatedText";
import { LogosCarousel } from "@/components/LogosCarousel";
import { OfferingsSection } from "@/components/OfferingsSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { useNavigate } from "react-router-dom";

const stats = [
  { number: "16", label: "Anos de experiência", icon: Award },
  { number: "800%", label: "Crescimento em faturamento", icon: TrendingUp },
  { number: "33ª", label: "Colocação ranking Exame", icon: Globe },
  { number: "100+", label: "Clientes atendidos", icon: Users },
];

const services = [
  {
    icon: Leaf,
    title: "Meio Ambiente",
    description: "Desenvolvemos soluções sustentáveis visando proteger e melhorar a qualidade do meio ambiente realizando auditoria e certificação ambiental, monitoramento de qualidade do ar, avaliação geoambiental, monitoramento de efluentes e licenciamento ambiental.",
    items: ["LDAR", "PTS", "Procon Fumaça Preta", "Áreas Impactadas", "Ruído Extramuros", "Licenciamento"]
  },
  {
    icon: Shield,
    title: "Segurança do Trabalho",
    description: "Consultoria em segurança do trabalho, planejamento e implementação de programas de segurança, elaboração de programas e laudos técnicos, treinamentos e gestão de SMS.",
    items: ["Gestão de SMS", "HAZOP", "Auditorias", "Treinamentos"]
  },
  {
    icon: Award,
    title: "Representação Dräger",
    description: "A Dräger é líder internacional em tecnologia de segurança desde 1889: soluções para indústria química, incêndio, água, mineração, petróleo e gás e muito mais.",
    items: ["Detectores de Gases", "Equipamentos de Proteção", "Calibração", "Manutenção"]
  }
];

const segments = [
  { icon: Factory, name: "Petroquímica" },
  { icon: Building2, name: "Indústria" },
  { icon: Ship, name: "Offshore" },
  { icon: Flame, name: "Termoelétrica" },
  { icon: Wrench, name: "Siderurgia" },
  { icon: HardHat, name: "Construção Civil" },
];

export default function Home() {
  const navigate = useNavigate();

  // Função para abrir WhatsApp com mensagem personalizada
  const handleConsultorClick = useCallback(() => {
    const phoneNumber = "5521997521212";
    const message = "Olá! Gostaria de falar com um consultor da Monitorar Consultoria sobre os serviços oferecidos.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }, []);

  // Memoizar os dados processados para os stats
  const processedStats = useMemo(() => {
    return stats.map(stat => {
      const match = String(stat.number).match(/^(\D*)(\d+)(\D*)$/);
      const prefix = match?.[1] ?? "";
      const num = match?.[2] ?? String(stat.number).replace(/\D/g, "");
      const suffix = match?.[3] ?? "";
      return {
        ...stat,
        prefix,
        num: parseInt(num, 10) || 0,
        suffix
      };
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ParallaxHero backgroundVideo="/refinarytest.mp4" backgroundUrl={heroImage}>
        <AnimatedText
          as="h1"
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-success"
          text="Melhores soluções – Vamos trabalhar juntos?"
        />
        <Reveal delayMs={80}>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Mantenha sua empresa protegida: com serviços de segurança do trabalho, saúde e meio ambiente alinhados com a sua estratégia.
          </p>
        </Reveal>
      </ParallaxHero>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Reveal key={index} delayMs={index * 80} className="text-center space-y-4">
                <div className="flex justify-center">
                  <stat.icon className="h-10 w-10 text-success md:h-12 md:w-12" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">
                  {/* Extrai número e sufixo/prefixo */}
                  {(() => {
                    const match = String(stat.number).match(/^(\D*)(\d+)(\D*)$/);
                    const prefix = match?.[1] ?? "";
                    const num = match?.[2] ?? String(stat.number).replace(/\D/g, "");
                    const suffix = match?.[3] ?? "";
                    return (
                      <>
                        {prefix}
                        <CountUp end={parseInt(num, 10) || 0} />
                        {suffix}
                      </>
                    );
                  })()}
                </div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">PRINCIPAIS ÁREAS DE ATUAÇÃO</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções completas em segurança do trabalho, saúde e meio ambiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="card-service h-full flex flex-col">
                <CardContent className="p-8 flex flex-col h-full">
                  <Reveal className="flex justify-center mb-6" delayMs={index * 70}>
                    <div className="p-4 bg-gradient-to-r from-secondary to-accent rounded-full">
                      <service.icon className="h-8 w-8 text-white" />
                    </div>
                  </Reveal>
                  <Reveal delayMs={120 + index * 70}>
                    <h3 className="text-xl font-bold mb-3 text-primary text-center md:text-left">{service.title}</h3>
                    <p className="text-muted-foreground mb-5 text-center md:text-left">{service.description}</p>
                  </Reveal>
                  <ul className="space-y-2 mb-6">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-auto">
                    <Button 
                      onClick={handleConsultorClick}
                      className="w-full bg-[#4fc106] hover:bg-[#43ad06] text-white"
                    >
                      Fale com um Consultor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Services Showcase */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 px-6 py-3 rounded-full mb-6">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-600 uppercase tracking-wider">Soluções Ambientais</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Expertise em Sustentabilidade</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Proteção ambiental e conformidade regulatória com soluções inovadoras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Industrial Safety Card */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Segurança Industrial</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Proteção de trabalhadores e instalações industriais com tecnologias avançadas e procedimentos rigorosos.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>

            {/* Environmental Consulting Card */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Consultoria Ambiental</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Consultoria completa para projetos sustentáveis, incluindo licenciamento ambiental e conformidade regulatória.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>

            {/* Environmental Restoration Card */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Reflorestamento</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Recuperação de áreas degradadas e preservação de vegetação nativa, restauração de ecossistemas.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>

            {/* Urban Studies Card */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Estudos Urbanos</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Avaliação do impacto ambiental de projetos em áreas urbanas, mobilidade e infraestrutura sustentável.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>

            {/* Water Treatment Card */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Tratamento de Efluentes</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Soluções para tratamento de águas residuais industriais e monitoramento de qualidade ambiental.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>

            {/* Licensing Card (replacing Energy Solutions) */}
            <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/20 h-full flex flex-col">
              <div 
                className="h-48 bg-cover bg-center relative overflow-hidden"
                style={{
                  backgroundImage: `url('/servicos/licenciamento.jpg')`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-gray-900">Licenciamento Ambiental</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                  Assessoria completa para licenciamento ambiental (LP, LI, LO), renovações e conformidade regulatória.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white mt-auto"
                  onClick={() => navigate('/servicos')}
                >
                  Conheça nossos serviços
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Principais Segmentos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Atendemos diversos setores da indústria com expertise especializada
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {segments.map((segment, index) => (
              <div key={index} className="text-center p-4 md:p-6 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex justify-center mb-3 md:mb-4">
                  <segment.icon className="h-8 w-8 text-primary md:h-12 md:w-12" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{segment.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${paisagemImage})` }}
        ></div>
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/55"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Pronto para proteger sua empresa?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a manter os mais altos padrões de segurança e sustentabilidade.
          </p>
          <Button 
            onClick={handleConsultorClick}
            size="lg" 
            className="bg-success hover:bg-success/90 text-white px-8 py-3 text-lg"
          >
            Fale com um Consultor
          </Button>
        </div>
      </section>

      {/* Offerings Section */}
      <OfferingsSection />

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Partners / Clients Logos */}
      <section className="pt-10 pb-14 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary text-center mb-8">Nossos Clientes</h2>
          <LogosCarousel
            logos={[
              { src: "/clientes/petrobras.png", alt: "Petrobras" },
              { src: "/clientes/transpetro.png", alt: "Transpetro" },
              { src: "/clientes/csn.png", alt: "CSN" },
              { src: "/clientes/ream.png", alt: "REAM" },
              { src: "/clientes/ipiranga.png", alt: "Ipiranga" },
              { src: "/clientes/lubrizol.png", alt: "Lubrizol" },
              { src: "/clientes/firjan.png", alt: "FIRJAN", className: "md:h-16 h-14" },
              { src: "/clientes/drager.png", alt: "Dräger" },
              { src: "/clientes/nitriflex.png", alt: "Nitriflex", className: "md:h-24 h-24" },
              { src: "/clientes/iconic.png", alt: "Iconic" },
              { src: "/clientes/rand.png", alt: "RAND" },
            ]}
            speed={28}
          />
        </div>
      </section>
    </div>
  );
}