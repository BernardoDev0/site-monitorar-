import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import regions from '../../content/regions.json';

// Regions the owner confirmed (RJ state, Southeast, South, Northeast). Agencies and portals live in content/regions.json.
const groups: [string, string[]][] = [
  ['Estado do Rio de Janeiro', ['RJ']],
  ['Região Sudeste', ['SP', 'MG', 'ES']],
  ['Região Sul', ['PR', 'SC', 'RS']],
  ['Região Nordeste', ['BA', 'SE', 'PE', 'CE']],
];
const faq = [
  ['A Monitorar atende projetos fora do Rio de Janeiro?', 'Sim. Com sede no Rio de Janeiro, atendemos projetos no RJ e em outras regiões do Brasil conforme o escopo de cada contratação.'],
  ['Em quais estados a Monitorar atende?', 'No estado do Rio de Janeiro e, conforme o escopo, nos estados listados nesta página das regiões Sudeste, Sul e Nordeste.'],
  ['Quem define prazos e entregas de um projeto em outro estado?', 'A proposta comercial confirma atividades, entregas, prazos e exclusões, depois que o objetivo, a localização do empreendimento e o prazo são informados.'],
];

export default function ConsultoriaPorEstado() {
  const byUf = Object.fromEntries(regions.map(r => [r.uf, r]));
  return <>
    <PageIntro eyebrow="Atendimento por estado" title="Consultoria ambiental por estado: onde a Monitorar atende projetos">
      <p>A Monitorar Consultoria tem sede no Rio de Janeiro e atende projetos de meio ambiente e segurança do trabalho em outras regiões do Brasil conforme o escopo. Veja os estados atendidos e o órgão ambiental estadual de cada um.</p>
    </PageIntro>
    <div className="site-wrap rj-page">
      <section className="v4-services">
        <h2>Como atendemos fora do Rio de Janeiro</h2>
        <p>O escopo, as atividades, as entregas e os prazos de cada projeto são definidos na proposta comercial. Para começar, informe o objetivo, a localização do empreendimento e o prazo em nossa <a className="text-link" href="/contato">página de contato</a>. Conheça também a <a className="text-link" href="/consultoria-ambiental-rj">consultoria ambiental no Rio de Janeiro</a> e os <a className="text-link" href="/servicos">serviços ambientais e de segurança do trabalho</a>.</p>
      </section>
      {groups.map(([group, ufs]) => <section key={group} className="v4-services">
        <h2>{group}</h2>
        {ufs.map(uf => { const r = byUf[uf]; return <div key={uf} className="rj-faq">
          <h3>{`Consultoria ambiental em ${r.name} (${r.uf})`}</h3>
          <p>A Monitorar atende projetos em {r.name} conforme o escopo. O órgão ambiental estadual é {r.agency} ({r.acronym}); consulte o <a className="text-link" href={r.url} target="_blank" rel="noopener noreferrer">portal oficial do {r.acronym} ↗</a> para os procedimentos de licenciamento vigentes.</p>
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
