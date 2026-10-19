import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import regions from '../../content/regions.json';

// The company serves any state according to scope; its principal states are Rio de Janeiro (headquarters), São Paulo and Amazonas.
// Agencies and portals live in content/regions.json. A state without a link has no portal that could be verified.
const principalPages: Record<string, string> = { RJ: '/consultoria-ambiental-rj', SP: '/consultoria-ambiental-sp', AM: '/consultoria-ambiental-am' };
const groups: [string, string[]][] = [
  ['Estados de atuação principal', ['RJ', 'SP', 'AM']],
  ['Região Norte', ['AC', 'AP', 'PA', 'RO', 'RR', 'TO']],
  ['Região Nordeste', ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE']],
  ['Região Centro-Oeste', ['DF', 'GO', 'MT', 'MS']],
  ['Região Sudeste', ['ES', 'MG']],
  ['Região Sul', ['PR', 'RS', 'SC']],
];
const faq = [
  ['A Monitorar atende projetos em qualquer estado?', 'Sim. Com sede no Rio de Janeiro, atendemos projetos em qualquer estado do Brasil conforme o escopo de cada contratação, com atuação principal no RJ, em São Paulo e no Amazonas.'],
  ['Em quais estados a Monitorar tem atuação principal?', 'No Rio de Janeiro, onde fica a sede, em São Paulo e no Amazonas. Cada um tem uma página própria nesta seção do site.'],
  ['Quem define prazos e entregas de um projeto em outro estado?', 'A proposta comercial confirma atividades, entregas, prazos e exclusões, depois que o objetivo, a localização do empreendimento e o prazo são informados.'],
];

export default function ConsultoriaPorEstado() {
  const byUf = Object.fromEntries(regions.map(r => [r.uf, r]));
  return <>
    <PageIntro eyebrow="Atendimento por estado" title="Consultoria ambiental por estado: onde a Monitorar atende projetos">
      <p>A Monitorar Consultoria tem sede no Rio de Janeiro e atende projetos de meio ambiente e segurança do trabalho em qualquer estado do Brasil conforme o escopo, com atuação principal no RJ, em São Paulo e no Amazonas. Veja o órgão ambiental estadual de cada estado.</p>
    </PageIntro>
    <div className="site-wrap rj-page">
      <section className="v4-services">
        <h2>Como atendemos cada estado</h2>
        <p>O escopo, as atividades, as entregas e os prazos de cada projeto são definidos na proposta comercial. Para começar, informe o objetivo, a localização do empreendimento e o prazo em nossa <a className="text-link" href="/contato">página de contato</a>. Conheça também os <a className="text-link" href="/servicos">serviços ambientais e de segurança do trabalho</a> e leia o <a className="text-link" href="/consultoria-ambiental">guia de consultoria ambiental</a>.</p>
      </section>
      {groups.map(([group, ufs]) => <section key={group} className="v4-services">
        <h2>{group}</h2>
        {ufs.map(uf => { const r = byUf[uf]; return <div key={uf} className="rj-faq">
          <h3>{`Consultoria ambiental ${r.in} (${r.uf})`}</h3>
          <p>{`A Monitorar atende projetos ${r.in} conforme o escopo. O órgão ambiental estadual é ${r.agency} (${r.acronym})`}{r.url ? <>; consulte o <a className="text-link" href={r.url} target="_blank" rel="noopener noreferrer">portal oficial do {r.acronym} ↗</a> para os procedimentos de licenciamento vigentes.</> : '. Consulte o órgão para os procedimentos de licenciamento vigentes.'}</p>
          {principalPages[uf] && <p><a className="text-link" href={principalPages[uf]}>{`Veja a página de consultoria ambiental ${r.in} ↗`}</a></p>}
        </div>; })}
      </section>)}
      <section className="v4-services">
        <h2>Serviços de consultoria ambiental</h2>
        <p>Atuamos com monitoramento de emissões fugitivas e LDAR, qualidade do ar, PTS e Procon Fumaça Preta, ruído extramuros, áreas impactadas e avaliação geoambiental, licenciamento ambiental, auditoria e certificação ambiental e monitoramento de efluentes. Veja o <a className="text-link" href="/servicos/emissoes-fugitivas">serviço de emissões fugitivas</a>, o <a className="text-link" href="/servicos/ruido-extramuros">serviço de ruído extramuros</a> e os <a className="text-link" href="/conteudos">guias técnicos por assunto</a>.</p>
      </section>
      <section className="v4-services">
        <h2>Perguntas frequentes</h2>
        {faq.map(([q, a]) => <div key={q} className="rj-faq"><h3>{q}</h3><p>{a}</p></div>)}
      </section>
    </div>
    <ProjectCTA />
  </>;
}
