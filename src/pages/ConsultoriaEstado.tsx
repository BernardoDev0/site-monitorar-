import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import { LocationBlock } from '@/components/LocationBlock';
import { environmentalServices } from '@/lib/environmental-services';
import regions from '../../content/regions.json';
import topics from '../../content/topics.json';

// Principal states named by the owner: Rio de Janeiro (headquarters), São Paulo and Amazonas. The company serves any state according to scope.
type Copy = { agencyText: string; faqAgency: string };
const copy: Record<'SP' | 'AM', Copy> = {
  SP: {
    agencyText: 'O órgão ambiental do estado é a Companhia Ambiental do Estado de São Paulo (CETESB). Consulte o portal oficial para os procedimentos de licenciamento e as exigências vigentes antes de contratar um estudo ou uma campanha.',
    faqAgency: 'A Companhia Ambiental do Estado de São Paulo (CETESB) é o órgão ambiental do estado. Os procedimentos de licenciamento vigentes ficam no portal oficial.',
  },
  AM: {
    agencyText: 'O órgão ambiental do estado é o Instituto de Proteção Ambiental do Amazonas (IPAAM), responsável pelo licenciamento, pela fiscalização e pelo monitoramento ambiental no estado. Consulte o portal oficial para os procedimentos e as exigências vigentes.',
    faqAgency: 'O Instituto de Proteção Ambiental do Amazonas (IPAAM) é o órgão ambiental do estado. Os procedimentos de licenciamento vigentes ficam no portal oficial.',
  },
};
const others = { SP: ['no Rio de Janeiro', 'RJ', '/consultoria-ambiental-rj', 'no Amazonas', '/consultoria-ambiental-am'], AM: ['no Rio de Janeiro', 'RJ', '/consultoria-ambiental-rj', 'em São Paulo', '/consultoria-ambiental-sp'] } as const;

function ConsultoriaEstado({ uf }: { uf: 'SP' | 'AM' }) {
  const r = regions.find(x => x.uf === uf)!;
  const c = copy[uf];
  const [, , rjHref, otherIn, otherHref] = others[uf];
  const faq = [
    [`A Monitorar atende projetos ${r.in}?`, `Sim. ${r.name} é um dos estados de atuação principal da Monitorar. Com sede no Rio de Janeiro, atendemos projetos ${r.in} conforme o escopo de cada contratação.`],
    [`Qual é o órgão ambiental ${r.in}?`, c.faqAgency],
    ['A Monitorar atende outros estados?', 'Sim. Atendemos projetos em qualquer estado do Brasil conforme o escopo, com atuação principal no RJ, em São Paulo e no Amazonas.'],
    ['Como solicitar uma proposta de consultoria ambiental?', 'Entre em contato por telefone, WhatsApp ou e-mail e informe o objetivo do projeto, a localização do empreendimento e o prazo. A proposta comercial confirma atividades, entregas, prazos e exclusões.'],
  ];
  return <>
    <PageIntro eyebrow={`Consultoria ambiental ${r.in}`} title={`Consultoria e engenharia ambiental ${r.in}`}>
      <p>{`A Monitorar Consultoria atende projetos de meio ambiente e segurança do trabalho ${r.in}, um dos estados de atuação principal da empresa. Com sede no Rio de Janeiro, atendemos qualquer estado do Brasil conforme o escopo.`}</p>
    </PageIntro>
    <div className="site-wrap rj-page">
      <section className="v4-services">
        <h2>{`Atuação principal ${r.in}`}</h2>
        <p>{`${r.name} é um dos estados em que a Monitorar concentra a sua atuação, junto com o Rio de Janeiro e ${otherIn.replace(/^(no|em) /, '')}. O escopo, as atividades, as entregas e os prazos de cada projeto são definidos na proposta comercial. Para começar, informe o objetivo, a localização do empreendimento e o prazo em nossa `}<a className="text-link" href="/contato">página de contato</a>.</p>
        <p>Conheça também a <a className="text-link" href={rjHref}>consultoria ambiental no Rio de Janeiro</a>, a consultoria ambiental <a className="text-link" href={otherHref}>{otherIn}</a>, a página de <a className="text-link" href="/consultoria-ambiental-por-estado">consultoria ambiental por estado</a> e o <a className="text-link" href="/consultoria-ambiental">guia de consultoria ambiental</a>.</p>
      </section>
      <section className="v4-services">
        <h2>{`Serviços de consultoria ambiental ${r.in}`}</h2>
        <p>Ajudamos empresas a cumprir regulamentos ambientais, reduzir impactos negativos e promover a sustentabilidade, com planos de ação e práticas corretas.</p>
        <div className="rj-grid">
          {environmentalServices.map(s => <article key={s.title}><h3>{s.title}</h3><p>{s.text}</p><a className="text-link" href={s.href}>{s.cta} ↗</a></article>)}
        </div>
      </section>
      <section className="v4-services">
        <h2>{`Licenciamento e órgão ambiental ${r.in}`}</h2>
        <p>{c.agencyText}</p>
        <p><a className="text-link" href={r.url!} target="_blank" rel="noopener noreferrer">{`Portal oficial do ${r.acronym} ↗`}</a></p>
      </section>
      <section className="v4-services">
        <h2>Guias técnicos para preparar o seu projeto</h2>
        <p>Reunimos artigos técnicos por assunto para ajudar a definir objetivo, escopo e informações antes de pedir uma proposta.</p>
        <ul className="rj-guides">{topics.map(t => <li key={t.slug}><a className="text-link" href={t.slug}>{t.label}</a></li>)}</ul>
        <p><a className="text-link" href="/blog">Ver todos os artigos do blog ↗</a></p>
      </section>
      <section className="v4-services">
        <h2>Atendimento a partir do Rio de Janeiro</h2>
        <LocationBlock />
      </section>
      <section className="v4-services">
        <h2>{`Perguntas frequentes sobre consultoria ambiental ${r.in}`}</h2>
        {faq.map(([q, a]) => <div key={q} className="rj-faq"><h3>{q}</h3><p>{a}</p></div>)}
      </section>
    </div>
    <ProjectCTA />
  </>;
}

export const ConsultoriaSP = () => <ConsultoriaEstado uf="SP" />;
export const ConsultoriaAM = () => <ConsultoriaEstado uf="AM" />;
