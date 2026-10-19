import { Photo } from '@/components/Photo';
import { Button } from "@/components/ui/button";
import { ExpertiseSection } from "@/components/home/ExpertiseSection";

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
import { photoUrl } from '@/lib/photo';
const paisagemImage=photoUrl('/src/assets/paisagem.png');
import { VideoHero as StaticHero } from "@/components/VideoHero";
import { FeaturedArticles } from "@/components/FeaturedArticles";
import { Reveal } from "@/components/Reveal";


import { LogosCarousel } from "@/components/home/LogosCarousel";
import { OfferingsSection } from "@/components/home/OfferingsSection";
import { InstagramFeed } from "@/components/InstagramFeed";
import { WHATSAPP_URL, recordContactClick } from "@/lib/contact";
import { clientsLogos } from "@/lib/clients";

const stats = [
  { number: "16", label: "Anos de experiência", icon: Award },
  { number: "800%", label: "Crescimento", icon: TrendingUp },
  { number: "33ª", label: "Colocação ranking Exame", icon: Globe },
  { number: "100+", label: "Clientes atendidos", icon: Users },
];

const services = [
  {
    icon: Leaf,
    title: "Meio Ambiente",
    image: "/servicos/areas-impactadas.jpg",
    description: "Desenvolvemos soluções sustentáveis para proteger e melhorar a qualidade do meio ambiente realizando auditoria e certificação ambiental, monitoramento de qualidade do ar, avaliação geoambiental, monitoramento de efluentes e licenciamento ambiental.",
    items: ["LDAR", "PTS", "Procon Fumaça Preta", "Áreas Impactadas", "Ruído Extramuros", "Licenciamento"]
  },
  {
    icon: Shield,
    title: "Segurança do Trabalho",
    image: "/servicos/gestao-sms.jpg",
    description: "Consultoria em segurança do trabalho, planejamento e implementação de programas de segurança, elaboração de programas e laudos técnicos, treinamentos e gestão de SMS.",
    items: ["Gestão de SMS", "HAZOP", "Auditorias", "Treinamentos"]
  },
  {
    icon: Award,
    title: "Representação Dräger",
    image: "/epis.png",
    description: "A Dräger é líder internacional em tecnologia de segurança desde 1889, oferecendo soluções inovadoras para os setores de indústria química, combate a incêndio, saneamento, mineração, petróleo e gás, entre outros.",
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
  return (
    <div className="erm-home">
      {/* Hero Section */}
      <StaticHero>
        <h1 data-enter>Engenharia e consultoria ambiental em todo o Brasil</h1>
        <p className="home-brand-line">As melhores soluções para o seu negócio – Vamos trabalhar juntos?</p>
        <Reveal delayMs={80}>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed opacity-90">
            Mantenha sua empresa protegida: com serviços de segurança do trabalho, saúde e meio ambiente alinhados com a sua estratégia. Com sede no Rio de Janeiro, atendemos projetos em qualquer estado do Brasil, com atuação principal no RJ, em São Paulo e no Amazonas.
          </p>
        </Reveal>
      </StaticHero>

      {/* Stats Section */}
      <section className="erm-stats"><Photo src="/equipe/equipe6.jpeg" alt="" width={1280} height={960} loading="lazy" className="stats-photo"/>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Reveal key={index} delayMs={index * 80} className="text-center space-y-4">
                <div className="flex justify-center">
                  <stat.icon className="h-10 w-10 text-success md:h-12 md:w-12" />
                </div>
                <div className="text-3xl md:text-4xl font-bold">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="erm-services erm-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="section-title">Principais áreas de atuação</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções completas em segurança do trabalho, saúde e meio ambiente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <article key={service.title} className="erm-service" data-reveal>
                <div className="service-visual"><h3>{service.title}</h3><Photo src={service.image} alt="" width={800} height={800} loading="lazy" sizes="(max-width:767px) 100vw, 35vw"/></div>
                <div>
                  <p>{service.description}</p>
                  <ul>{service.items.map(item => <li key={item}><CheckCircle aria-hidden="true" size={17}/><span>{item}</span></li>)}</ul>
                  <a className="erm-button" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick("whatsapp")}>Fale com um Consultor<span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ExpertiseSection/>

      {/* Segments Section */}
      <section className="erm-segments erm-section">
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

      {/* Company summary in the words people search for; links the two guides and the state pages */}
      <section className="site-wrap section-space home-company">
        <p className="eyebrow">Consultoria ambiental</p>
        <h2>Empresa de engenharia e consultoria ambiental</h2>
        <p>A Monitorar Consultoria é uma empresa de engenharia e consultoria ambiental com sede no Rio de Janeiro, fundada em 2009. Atendemos projetos em qualquer estado do Brasil, com atuação principal no RJ, em São Paulo e no Amazonas.</p>
        <p>Nossos serviços de consultoria ambiental incluem monitoramento de emissões fugitivas e LDAR, qualidade do ar, PTS e Procon Fumaça Preta, ruído extramuros, áreas impactadas com avaliação geoambiental, licenciamento ambiental, auditoria e certificação ambiental e monitoramento de efluentes.</p>
        <p>Para entender o que faz uma empresa de consultoria ambiental e como escolher uma, leia o <a className="text-link" href="/consultoria-ambiental">guia de consultoria ambiental</a>. Veja também a consultoria ambiental <a className="text-link" href="/consultoria-ambiental-rj">no Rio de Janeiro</a>, <a className="text-link" href="/consultoria-ambiental-sp">em São Paulo</a> e <a className="text-link" href="/consultoria-ambiental-am">no Amazonas</a>, e o <a className="text-link" href="/emissoes-fugitivas">guia de emissões fugitivas e LDAR</a>.</p>
      </section>

      {/* CTA Section */}
      <section className="erm-cta erm-section relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${paisagemImage})` }}
        ></div>

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
            asChild
            size="lg"
            className="bg-success hover:bg-success/90 text-white px-8 py-3 text-lg"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" onClick={() => recordContactClick("whatsapp")}>Fale com um Consultor</a>
          </Button>
        </div>
      </section>

      {/* Offerings Section */}
      <OfferingsSection />

      <section className="site-wrap section-space blog-teaser"><p className="eyebrow">Blog Monitorar</p><h2>Mais contexto. Melhores perguntas.</h2><p>Um espaço para compreender conceitos ambientais, comparar abordagens e preparar a contratação de serviços técnicos.</p><div className="actions"><a className="button" href="/blog">Explorar o blog ↗</a><a className="text-link" href="/conteudos">Navegar por assuntos</a></div><FeaturedArticles/></section>
      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Partners / Clients Logos */}
      <section className="erm-clients erm-section">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary text-center mb-8">Nossos Clientes</h2>
          <LogosCarousel
            logos={clientsLogos}
            speed={40}
          />
        </div>
      </section>
    </div>
  );
}
