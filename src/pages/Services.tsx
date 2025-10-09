import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedText } from "@/components/AnimatedText";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceCardWithIcon } from "@/components/ServiceCardWithIcon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import { 
  Shield, 
  AlertTriangle, 
  HardHat, 
  Search, 
  GraduationCap,
  Leaf,
  Wind,
  MapPin,
  Volume2,
  FileText,
  Users,
  Award
} from "lucide-react";
// Imagem de fundo para a seção de serviços
import servicesBg from "/paisagem4.png.png";

const environmentalServices = [
  {
    title: "Qualidade do Ar",
    icon: Wind,
    description: "Monitoramento e avaliação da qualidade do ar em ambientes industriais e urbanos.",
    fullDescription: "Desenvolvemos soluções sustentáveis para proteger e melhorar o meio ambiente através de auditoria e certificação ambiental, qualidade do ar, avaliação geoambiental, monitoramento de efluentes e licenciamento. Nossos métodos reconhecidos garantem conformidade com as normas ambientais e proteção da saúde pública. Incluímos serviços de LDAR (Leak Detection and Repair), monitoramento de PTS (Partículas Totais em Suspensão), PROCON Fumaça Preta e outras avaliações essenciais para a gestão da qualidade do ar."
  },
  {
    title: "Áreas Impactadas",
    icon: MapPin, 
    description: "Investigação e remediação de áreas contaminadas conforme legislação ambiental.",
    fullDescription: "Processo essencial para entender condições de solo e água: coleta e análise de amostras, identificação de contaminantes e compreensão das características geológicas. Fundamenta planos de mitigação, remediação e prevenção de danos. Também protege a saúde pública e viabiliza uso sustentável do solo e da água. Realizamos investigação confirmatória, investigação detalhada, análise de risco e planos de remediação completos."
  },
  {
    title: "Avaliação de Ruído Extramuros",
    icon: Volume2,
    description: "Medição e análise de ruído para atendimento às normas ambientais.",
    fullDescription: "Monitoramento e análise do nível de ruído que ultrapassa os limites de uma instalação, avaliando impacto em áreas adjacentes e conformidade com normas. Utilizamos monitoramento contínuo ou pontual com sonômetros, modelagem acústica através de softwares especializados e análise estatística completa. Nossos serviços incluem medições acústicas, relatórios técnicos detalhados, adequação às normas e monitoramento contínuo."
  },
  {
    title: "Licenciamento Ambiental",
    icon: FileText,
    description: "Assessoria completa para obtenção de licenças ambientais.",
    fullDescription: "Realizamos o licenciamento junto aos órgãos ambientais, avaliando a viabilidade ambiental de empreendimentos e atividades para controle preventivo, proteção do meio ambiente, garantia do desenvolvimento sustentável e cumprimento legal. Oferecemos Licença Prévia (LP), Licença de Instalação (LI), Licença de Operação (LO) e renovações. Nosso processo inclui requerimento e análise técnica, consulta pública e decisão, monitoramento e fiscalização contínua."
  }
];

const safetyServices = [
  {
    title: "Gestão de SMS",
    icon: Users,
    description: "Implantação e gestão de sistemas de Segurança, Meio Ambiente e Saúde.",
    fullDescription: "Fiscalização da documentação legal de segurança do trabalho para indústrias: essencial para proteger a saúde e integridade dos trabalhadores, prevenir acidentes e garantir conformidade. Incluímos planejamento da fiscalização, identificação dos documentos necessários, visita técnica à instalação, verificação de conformidade e coerência, orientação, educação e relatórios, acompanhamento e reavaliação. Desenvolvemos política SMS, procedimentos, indicadores e auditoria interna."
  },
  {
    title: "HAZOP",
    icon: AlertTriangle,
    description: "Análise de Operabilidade e Perigos (Hazard and Operability Study).",
    fullDescription: "Análise sistemática e estruturada para identificar perigos potenciais e problemas de operabilidade em processos industriais. Utilizamos metodologia reconhecida internacionalmente para análise de riscos, identificação de cenários de falha, avaliação de consequências e desenvolvimento de medidas preventivas. Nossos serviços incluem identificação de perigos, análise de riscos detalhada, relatório HAZOP completo e plano de ação para mitigação de riscos."
  },
  // Higiene Ocupacional removido conforme solicitação
  {
    title: "Auditorias",
    icon: Search,
    description: "Auditorias em sistemas de gestão e conformidade legal.",
    fullDescription: "Auditorias especializadas em sistemas de gestão e conformidade legal para garantir que sua empresa atenda aos mais altos padrões de segurança, meio ambiente e saúde ocupacional. Nossos serviços incluem auditoria legal completa, avaliação de sistema de gestão, verificação de conformidade com normas e regulamentações, e elaboração de relatórios detalhados com recomendações de melhoria."
  },
  {
    title: "Treinamentos",
    icon: GraduationCap,
    description: "Capacitação técnica especializada para equipes operacionais.",
    fullDescription: "Capacitação técnica especializada para equipes operacionais com foco em segurança do trabalho. Oferecemos treinamentos em NR-33 (Espaços Confinados), NR-35 (Trabalho em Altura), e outras normas regulamentadoras. Nossos programas incluem treinamentos práticos, simulações de situações de risco, capacitação em uso de equipamentos de proteção individual e coletiva, e desenvolvimento de competências para identificação e prevenção de acidentes."
  }
];

export default function Services() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"environmental" | "safety" | "drager">("environmental");

  useEffect(() => {
    const currentPath = location.pathname.toLowerCase();
    if (currentPath.includes("seguranca") || currentPath.includes("hazop") || currentPath.includes("auditorias") || currentPath.includes("treinamentos")) {
      setActiveTab("safety");
    } else if (currentPath.includes("meio-ambiente")) {
      setActiveTab("environmental");
    } else if (currentPath.includes("drager")) {
      setActiveTab("drager");
    } else {
      setActiveTab("environmental"); // default tab
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen py-20 pt-32 md:pt-36 lg:pt-40">
      <div className="container mx-auto px-4">
        {/* Hero Serviços com imagem de fundo */}
        <div className="mb-12 relative rounded-3xl overflow-hidden m-0 z-0">
          {/* Background image com overlays */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `url(${servicesBg})`,
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
                <span className="text-sm font-medium text-white">Nossos Serviços</span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
                Soluções completas em segurança e meio ambiente
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Oferecemos serviços especializados em <span className="font-semibold text-green-200">segurança do trabalho</span> e 
                <span className="font-semibold text-emerald-300"> meio ambiente</span> para proteger pessoas e o planeta
              </p>
              
              {/* Linha decorativa */}
              <div className="flex items-center justify-center mt-8">
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <div className="mx-4 w-3.5 h-3.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] ring-2 ring-white/40" />
                <div className="h-[2px] w-40 bg-gradient-to-l from-transparent via-white/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="environmental">Meio Ambiente</TabsTrigger>
              <TabsTrigger value="safety">Segurança do Trabalho</TabsTrigger>
              <TabsTrigger value="drager">Representação Dräger</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="environmental">
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-gradient-to-r from-secondary to-accent rounded-full mr-3">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Meio Ambiente</h2>
              </div>

              <p className="text-base text-muted-foreground max-w-3xl mb-8">
                Ajudamos empresas a cumprir regulamentos ambientais, reduzir impactos negativos e promover a
                sustentabilidade, com planos de ação e práticas corretas.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {environmentalServices.map((service, index) => {
                  const imageMap: Record<string, string> = {
                    "Qualidade do Ar": "/servicos/qualidade-ar.jpg",
                    "Áreas Impactadas": "/servicos/areas-impactadas.jpg",
                    "Avaliação de Ruído Extramuros": "/servicos/avaliacao-ruido.jpg",
                    "Licenciamento Ambiental": "/servicos/licenciamento.jpg",
                  };
                  return (
                    <ServiceCardWithIcon
                      key={service.title}
                      title={service.title}
                      icon={service.icon}
                      description={service.description}
                      fullDescription={service.fullDescription}
                      imageSrc={imageMap[service.title]}
                      delayMs={index * 100}
                    />
                  );
                })}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="safety">
            <section className="mb-16">
              <div className="flex items-center mb-8">
                <div className="p-2 bg-gradient-to-r from-secondary to-accent rounded-full mr-3">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Segurança do Trabalho</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {safetyServices.map((service, index) => {
                  const imageMap: Record<string, string> = {
                    "Gestão de SMS": "/servicos/gestao-sms.jpg",
                    "HAZOP": "/servicos/hazop.jpg",
                    "Auditorias": "/servicos/auditorias.jpg",
                    "Treinamentos": "/servicos/treinamentos.jpg",
                  };
                  return (
                    <ServiceCardWithIcon
                      key={service.title}
                      title={service.title}
                      icon={service.icon}
                      description={service.description}
                      fullDescription={service.fullDescription}
                      imageSrc={imageMap[service.title]}
                      delayMs={index * 100}
                    />
                  );
                })}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="drager">
            <section className="bg-muted/30 rounded-2xl p-6 md:p-8 text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-[#4fc106] rounded-full mr-3">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-primary">Representação Dräger</h2>
              </div>

              <div className="max-w-2xl mx-auto">
                <p className="text-base text-muted-foreground mb-6 text-center">
                  Como representantes oficiais da Dräger no Brasil, oferecemos equipamentos 
                  de última geração para detecção de gases e proteção respiratória.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  <Badge variant="outline" className="py-2 px-4 text-sm text-center">Detectores de Gases</Badge>
                  <Badge variant="outline" className="py-2 px-4 text-sm text-center">Equipamentos de Proteção</Badge>
                  <Badge variant="outline" className="py-2 px-4 text-sm text-center">Calibração</Badge>
                  <Badge variant="outline" className="py-2 px-4 text-sm text-center">Manutenção</Badge>
                </div>

                <a href="/drager-catalogo.pdf" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#4fc106] hover:bg-[#43ad06] text-white text-sm px-8 py-3 rounded-lg font-semibold">
                    Conheça os Equipamentos Dräger
                  </Button>
                </a>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}