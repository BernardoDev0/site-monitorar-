import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Eye, ThumbsUp, Users, Award, Target, CheckCircle, Building2, Lightbulb, Heart, Shield } from "lucide-react";
import { AnimatedText } from "@/components/AnimatedText";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const values = [
  {
    icon: Leaf,
    title: "Nossa Missão",
    description: "Cuidar de vidas e garantir um futuro sustentável para as famílias do nosso país.",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Eye,
    title: "Nossa Visão",
    description: "Ser a empresa mais reconhecida nas áreas de meio ambiente e segurança do trabalho do país.",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Heart,
    title: "Nossos Valores",
    description: "Oportunidades, Trabalho em equipe, Senso de dono, Respeito, Família.",
    color: "from-purple-500 to-pink-600"
  }
];

const achievements = [
  { number: "16", label: "Anos de Experiência", icon: Award },
  { number: "800%", label: "Crescimento em Faturamento", icon: Target },
  { number: "33ª", label: "Posição Ranking Exame", icon: Building2 },
  { number: "500+", label: "Clientes Atendidos", icon: Users }
];


export default function About() {
  const location = useLocation();
  const [heroVisible, setHeroVisible] = useState(true);

  // Simple, lightweight scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldHide = scrollY > window.innerHeight * 0.5; // Hide after 50% scroll
      setHeroVisible(!shouldHide);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Scroll suave para seções específicas
    const scrollToSection = () => {
      const sectionMap: { [key: string]: string } = {
        '/sobre/historia': 'historia',
        '/sobre/missao': 'missao',
        '/sobre/equipe': 'equipe'
      };

      const sectionId = sectionMap[location.pathname];
      if (sectionId) {
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      }
    };

    scrollToSection();
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Hero Section com Background de Floresta - Simple & Fast */}
      <section className={`relative h-screen flex items-center justify-center overflow-hidden -mt-[80px] transition-opacity duration-500 ${
        heroVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Background de Floresta - Clean & Simple */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=90')`,
              filter: 'brightness(0.75) contrast(1.25) saturate(1.1)'
            }}
          />
          {/* Simple Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-emerald-900/60 to-green-800/70" />
          <div className="absolute inset-0 bg-black/25" />
        </div>
        
        {/* Simple floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute top-40 right-20 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        {/* Content with Glass Effect - Simple */}
        <div className="relative z-10 text-center text-white px-4">
          {/* Glass Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-white/20 shadow-lg">
            <Shield className="w-5 h-5 text-white" />
            <span className="text-sm font-medium uppercase tracking-wider text-white">Sobre Nós</span>
          </div>
          
          {/* Main Title with Glass Container */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 mb-8 border border-white/10 shadow-2xl max-w-5xl mx-auto">
            <AnimatedText 
              as="h1" 
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white" 
              text="Monitorar Consultoria" 
            />
            
            <p className="text-xl md:text-2xl mb-6 max-w-4xl mx-auto leading-relaxed font-light text-white/95 drop-shadow-lg">
              16 anos construindo <span className="font-semibold text-green-200">excelência</span> em segurança do trabalho e <span className="font-semibold text-emerald-300">meio ambiente</span>
            </p>
          </div>
          
          {/* Stats with Glass Effect */}
          <div className="flex flex-wrap items-center justify-center gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
                <span className="font-semibold text-white text-sm md:text-base">Fundada em 2008</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse" />
                <span className="font-semibold text-white text-sm md:text-base">100+ Clientes</span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-300 rounded-full animate-pulse" />
                <span className="font-semibold text-white text-sm md:text-base">33ª no Ranking Exame</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Simple Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-full p-2 shadow-lg">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section id="historia" className="py-20 bg-gradient-to-br from-slate-50 to-green-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-secondary/10 px-6 py-3 rounded-full mb-6">
                <Building2 className="w-5 h-5 text-secondary" />
                <span className="text-sm font-medium text-secondary uppercase tracking-wider">Nossa Jornada</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Como Tudo Começou</h2>
              <div className="w-24 h-1 bg-secondary mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="card-service p-8 border-l-4 border-l-secondary">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-secondary mb-4">2008 - O Início</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Fundada por profissionais experientes que identificaram a necessidade de serviços especializados em segurança do trabalho e meio ambiente no mercado brasileiro.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-service p-8 border-l-4 border-l-accent">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-accent mb-4">2025 - Consolidação</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      16 anos depois, alcançamos a 33ª posição no ranking da revista Exame com crescimento de 800% em faturamento, atendendo mais de 100 clientes.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-3xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">Excelência</h3>
                    <p className="text-muted-foreground">Reconhecida no mercado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section id="missao" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full mb-6">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary uppercase tracking-wider">Nossos Princípios</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Missão, Visão e Valores</h2>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Card key={index} className="card-service group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                      <value.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section id="equipe" className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/paisagem2.png')`,
            filter: 'brightness(0.85) contrast(1.2) saturate(1.3)'
          }}
        />
        {/* Lighter Overlay for more vibrant background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/45" />
        <div className="absolute inset-0 bg-black/15" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-white/30 shadow-lg">
              <Target className="w-5 h-5 text-white" />
              <span className="text-sm font-medium uppercase tracking-wider text-white">Nossos Números</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">Resultados que Impressionam</h2>
            <div className="w-24 h-1 bg-white/90 mx-auto" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/30 shadow-lg">
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white drop-shadow-md">{achievement.number}</div>
                <div className="text-white/95 font-medium drop-shadow-sm">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Equipe */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-blue-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 px-6 py-3 rounded-full mb-6">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Nossa Equipe</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Profissionais Especializados</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nossa equipe é formada por engenheiros, técnicos e especialistas certificados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="card-service group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Engenheiros Especialistas</h3>
                <p className="text-muted-foreground text-sm md:text-base">Profissionais com vasta experiência em segurança do trabalho e meio ambiente</p>
              </CardContent>
            </Card>
            
            <Card className="card-service group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Certificações Reconhecidas</h3>
                <p className="text-muted-foreground text-sm md:text-base">Todos os profissionais possuem certificações e participam de educação continuada</p>
              </CardContent>
            </Card>
            
            <Card className="card-service group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">Inovação Constante</h3>
                <p className="text-muted-foreground text-sm md:text-base">Sempre atualizados com as mais recentes tecnologias e metodologias</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}