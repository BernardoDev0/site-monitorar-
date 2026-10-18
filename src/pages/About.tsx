import { Photo } from '@/components/Photo';
import { photoUrl } from '@/lib/photo';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Eye, ThumbsUp, Users, Award, Target, CheckCircle, Building2, Lightbulb, Heart, Shield } from 'lucide-react';
import {PageIntro} from '@/components/PageIntro';
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
    description: "Ser a empresa mais reconhecida nas áreas de Meio ambiente e Segurança do trabalho do país.",
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
  { number: "800%", label: "Crescimento", icon: Target },
  { number: "33ª", label: "Posição Ranking Exame", icon: Building2 },
  { number: "500+", label: "Projetos Realizados", icon: Users }
];


export default function About(){return <div className="v4-company"><PageIntro eyebrow="Sobre Nós" title="Monitorar Consultoria"><p>16 anos construindo excelência em segurança do trabalho e meio ambiente</p><p>Fundada em 2009 · 500+ Projetos · 33º no Ranking Exame</p></PageIntro>      {/* Nossa História */}
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
                    <h3 className="text-2xl font-bold text-secondary mb-4">2009 - O Início</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Fundada por profissionais experientes que identificaram a necessidade de serviços especializados em Segurança do trabalho e Meio ambiente no mercado brasileiro.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="card-service p-8 border-l-4 border-l-accent">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold text-accent mb-4">2025 - Consolidação</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      16 anos depois, alcançamos a 33ª posição no ranking da revista Exame com crescimento de 800%, atendendo mais de 100 clientes.
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="relative">
                <Photo src="/equipe/equipe2.jpeg" alt="Registro da equipe Monitorar" className="section-photo institutional-visual" loading="lazy" width={1024} height={768}/>
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
          
          <Photo src="/paisagem2.png" alt="" className="section-photo institutional-visual" loading="lazy" width={1408} height={736}/>
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
      <section id="resultados" className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${photoUrl('/paisagem2.png')})`,
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
      <section id="equipe" className="py-20 bg-gradient-to-br from-slate-100 to-blue-50/30">
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
          
          <Photo src="/equipe/equipe1.JPG" alt="Equipe Monitorar reunida" className="section-photo institutional-visual" loading="lazy" width={1280} height={960}/>
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

</div>;}
