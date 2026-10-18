import { ArrowUpRight, Leaf } from 'lucide-react';
import { Photo } from '@/components/Photo';

const areas = [
  {
    "title": "Segurança Industrial",
    "description": "Proteção de trabalhadores e instalações industriais com tecnologias avançadas e procedimentos rigorosos.",
    "image": "/epis.png",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  },
  {
    "title": "Consultoria Ambiental",
    "description": "Consultoria completa para projetos sustentáveis, incluindo licenciamento ambiental e conformidade regulatória.",
    "image": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  },
  {
    "title": "Reflorestamento",
    "description": "Recuperação de áreas degradadas e preservação de vegetação nativa, restauração de ecossistemas.",
    "image": "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  },
  {
    "title": "Estudos Urbanos",
    "description": "Avaliação do impacto ambiental de projetos em áreas urbanas, mobilidade e infraestrutura sustentável.",
    "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  },
  {
    "title": "Tratamento de Efluentes",
    "description": "Soluções para tratamento de águas residuais industriais e monitoramento de qualidade ambiental.",
    "image": "https://images.unsplash.com/photo-1581594549595-35f6edc7b762?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=90",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  },
  {
    "title": "Licenciamento Ambiental",
    "description": "Assessoria completa para licenciamento ambiental (LP, LI, LO), renovações e conformidade regulatória.",
    "image": "/servicos/licenciamento.jpg",
    "href": "/servicos",
    "link": "Conheça nossos serviços"
  }
];

export function ExpertiseSection() {
  return <section className="erm-expertise expertise-compact erm-section" aria-labelledby="expertise-heading">
    <div className="container">
      <header className="expertise-heading">
        <div><p className="expertise-eyebrow"><Leaf size={17} aria-hidden="true"/>Soluções Ambientais</p><h2 id="expertise-heading">Expertise em Sustentabilidade</h2></div>
        <p className="expertise-intro">Proteção ambiental e conformidade regulatória com soluções inovadoras</p>
      </header>
      <div className="expertise-lead">{areas.slice(0,2).map(area=><article key={area.title}>
        <Photo src={area.image} alt="" loading="lazy" width={800} height={450} sizes="(max-width: 767px) 100vw, 50vw"/>
        <div className="expertise-copy"><h3>{area.title}</h3><p>{area.description}</p><a href={area.href}>{area.link}<ArrowUpRight size={18} aria-hidden="true"/></a></div>
      </article>)}</div>
      <div className="expertise-details">{areas.slice(2).map(area=><article key={area.title}>
        <Photo src={area.image} alt="" loading="lazy" width={240} height={200} sizes="(max-width: 767px) 88px, 128px"/>
        <div className="expertise-copy"><h3>{area.title}</h3><p>{area.description}</p><a href={area.href}>{area.link}<ArrowUpRight size={17} aria-hidden="true"/></a></div>
      </article>)}</div>
    </div>
  </section>;
}
