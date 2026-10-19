import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import { LocationBlock } from '@/components/LocationBlock';
import topics from '../../content/topics.json';

// Services and figures below repeat what the site already publishes (home, about and services pages).
const services = [
  { title: 'Monitoramento de emissões fugitivas e LDAR', text: 'Organize a contratação de uma campanha de emissões fugitivas: informações iniciais, responsabilidades, entregas e limites que precisam constar no escopo.', href: '/servicos/emissoes-fugitivas', cta: 'Conheça o serviço de emissões fugitivas e LDAR' },
  { title: 'Qualidade do ar, PTS e Procon Fumaça Preta', text: 'Monitoramento e avaliação da qualidade do ar em ambientes industriais e urbanos.', href: '/conteudos/qualidade-do-ar', cta: 'Guias sobre qualidade do ar, PTS e Fumaça Preta' },
  { title: 'Avaliação de ruído extramuros', text: 'Medição e análise de ruído para atendimento às normas ambientais.', href: '/servicos/ruido-extramuros', cta: 'Conheça o serviço de ruído extramuros' },
  { title: 'Áreas impactadas e avaliação geoambiental', text: 'Investigação e remediação de áreas contaminadas conforme legislação ambiental.', href: '/conteudos/areas-impactadas', cta: 'Guias sobre áreas impactadas e avaliação geoambiental' },
  { title: 'Licenciamento ambiental (LP, LI e LO)', text: 'Assessoria completa para obtenção de licenças ambientais, renovações e conformidade regulatória.', href: '/conteudos/licenciamento-ambiental', cta: 'Guias sobre licenciamento ambiental (LP, LI e LO)' },
  { title: 'Auditoria, certificação ambiental e efluentes', text: 'Auditoria e certificação ambiental e monitoramento de efluentes para empresas que precisam comprovar conformidade.', href: '/servicos', cta: 'Ver todos os serviços ambientais' },
];
const faq = [
  ['A Monitorar atende empresas fora do Rio de Janeiro?', 'Sim. Com sede no Rio de Janeiro, atendemos projetos no RJ e em outras regiões do Brasil conforme o escopo de cada contratação.'],
  ['Quais serviços de consultoria ambiental a Monitorar oferece?', 'Monitoramento de emissões fugitivas e LDAR, qualidade do ar, PTS e Procon Fumaça Preta, ruído extramuros, áreas impactadas com avaliação geoambiental, licenciamento ambiental, auditoria e certificação ambiental e monitoramento de efluentes.'],
  ['Há quanto tempo a Monitorar atua?', 'A Monitorar foi fundada em 2009 e soma 16 anos de experiência em meio ambiente e segurança do trabalho.'],
  ['Como solicitar uma proposta de consultoria ambiental?', 'Entre em contato por telefone, WhatsApp ou e-mail e informe o objetivo do projeto, a localização e o prazo. A proposta comercial confirma atividades, entregas, prazos e exclusões.'],
];

export default function ConsultoriaAmbientalRJ() {
  return <>
    <PageIntro eyebrow="Consultoria ambiental no RJ" title="Consultoria e engenharia ambiental no Rio de Janeiro">
      <p>A Monitorar Consultoria é uma consultoria de engenharia ambiental e segurança do trabalho com sede no Rio de Janeiro, fundada em 2009. Atendemos projetos no RJ e em outras regiões do Brasil conforme o escopo.</p>
    </PageIntro>
    <div className="site-wrap rj-page">
      <section className="v4-services">
        <h2>Serviços de consultoria ambiental</h2>
        <p>Ajudamos empresas a cumprir regulamentos ambientais, reduzir impactos negativos e promover a sustentabilidade, com planos de ação e práticas corretas.</p>
        <div className="rj-grid">
          {services.map(s => <article key={s.title}><h3>{s.title}</h3><p>{s.text}</p><a className="text-link" href={s.href}>{s.cta} ↗</a></article>)}
        </div>
      </section>
      <section className="v4-services">
        <h2>Engenharia ambiental e segurança do trabalho com o mesmo parceiro</h2>
        <p>Além do meio ambiente, atuamos em segurança do trabalho: gestão de SMS, estudos HAZOP, auditorias e treinamentos. Conheça as <a className="text-link" href="/servicos/seguranca">soluções em segurança do trabalho</a> e o <a className="text-link" href="/servicos/hazop">estudo HAZOP</a>.</p>
      </section>
      <section className="v4-services">
        <h2>Guias técnicos para preparar o seu projeto</h2>
        <p>Reunimos artigos técnicos por assunto para ajudar a definir objetivo, escopo e informações antes de pedir uma proposta.</p>
        <ul className="rj-guides">
          {topics.map(t => <li key={t.slug}><a className="text-link" href={t.slug}>{t.label}</a></li>)}
        </ul>
        <p><a className="text-link" href="/blog">Ver todos os artigos do blog ↗</a></p>
      </section>
      <section className="v4-services">
        <h2>Experiência em meio ambiente e segurança do trabalho</h2>
        <p>Fundada em 2009, a Monitorar soma 16 anos de experiência, mais de 500 projetos realizados, mais de 100 clientes atendidos e a 33ª posição no ranking da revista Exame. Conheça a <a className="text-link" href="/sobre">história da empresa</a>, os <a className="text-link" href="/clientes">clientes atendidos</a> e os <a className="text-link" href="/depoimentos">depoimentos</a>.</p>
      </section>
      <section className="v4-services">
        <h2>Atendimento no Rio de Janeiro e em outras regiões</h2>
        <p>Com sede na Barra da Tijuca, no Rio de Janeiro, atendemos projetos em todo o estado do RJ e em outras regiões do Brasil conforme o escopo de cada contratação. Para começar, informe o objetivo do projeto, a localização e o prazo.</p>
        <LocationBlock />
      </section>
      <section className="v4-services">
        <h2>Perguntas frequentes sobre consultoria ambiental</h2>
        {faq.map(([q, a]) => <div key={q} className="rj-faq"><h3>{q}</h3><p>{a}</p></div>)}
      </section>
    </div>
    <ProjectCTA />
  </>;
}
