import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import { LocationBlock } from '@/components/LocationBlock';
import { ClientLogos } from '@/components/ClientLogos';
import { Rich } from '@/components/Guide';
import { environmentalServices as services } from '@/lib/environmental-services';
import topics from '../../content/topics.json';

const faq = [
  ['A Monitorar atende empresas fora do Rio de Janeiro?', 'Sim. Com sede no Rio de Janeiro, atendemos projetos em qualquer estado do Brasil conforme o escopo de cada contratação, com atuação principal no RJ, em São Paulo e no Amazonas.'],
  ['Quais serviços de consultoria ambiental a Monitorar oferece?', 'Monitoramento de emissões fugitivas e LDAR, qualidade do ar, PTS e Procon Fumaça Preta, ruído extramuros, áreas impactadas com avaliação geoambiental, licenciamento ambiental, auditoria e certificação ambiental e monitoramento de efluentes.'],
  ['Há quanto tempo a Monitorar atua?', 'A Monitorar foi fundada em 2009 e soma 16 anos de experiência em meio ambiente e segurança do trabalho.'],
  ['Qual é a diferença entre consultoria ambiental e engenharia ambiental?', 'Os dois termos costumam designar o mesmo tipo de empresa; o que muda de um contrato para outro é o escopo. A proposta comercial confirma atividades, entregas, prazos e exclusões.'],
  ['Quais licenças ambientais uma empresa pode precisar?', 'A Resolução CONAMA nº 237/1997 prevê a Licença Prévia, a Licença de Instalação e a Licença de Operação. O órgão ambiental competente define as exigências de cada caso; no Rio de Janeiro, o órgão é o INEA. [[Ver o guia de consultoria ambiental|/consultoria-ambiental]]'],
  ['Como escolher uma empresa de consultoria ambiental?', 'Compare escopo, entregas, prazos, referências de projetos comparáveis, métodos e a responsabilidade técnica dos serviços, e peça tudo por escrito. O [[guia de consultoria ambiental|/consultoria-ambiental]] detalha cada ponto.'],
  ['A Monitorar atua com emissões fugitivas no Rio de Janeiro?', 'Sim. A Monitorar apresenta monitoramento de emissões fugitivas e LDAR em seu portfólio, com sede no Rio de Janeiro. Veja o [[guia de emissões fugitivas e LDAR|/emissoes-fugitivas]] e o [[serviço de monitoramento de emissões fugitivas|/servicos/emissoes-fugitivas]].'],
  ['Como solicitar uma proposta de consultoria ambiental?', 'Entre em contato por telefone, WhatsApp ou e-mail e informe o objetivo do projeto, a localização e o prazo. A proposta comercial confirma atividades, entregas, prazos e exclusões.'],
];

export default function ConsultoriaAmbientalRJ() {
  return <>
    <PageIntro eyebrow="Consultoria ambiental no RJ" title="Consultoria e engenharia ambiental no Rio de Janeiro">
      <p>A Monitorar Consultoria é uma empresa de consultoria e engenharia ambiental e de segurança do trabalho com sede no Rio de Janeiro, fundada em 2009. Atendemos projetos em qualquer estado do Brasil, com atuação principal no RJ, em São Paulo e no Amazonas.</p>
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
        <h2>Empresa de engenharia ambiental e segurança do trabalho no Rio de Janeiro</h2>
        <p>Além do meio ambiente, atuamos em segurança do trabalho: gestão de SMS, estudos HAZOP, auditorias e treinamentos. Conheça as <a className="text-link" href="/servicos/seguranca">soluções em segurança do trabalho</a> e o <a className="text-link" href="/servicos/hazop">estudo HAZOP</a>.</p>
      </section>
      <section className="v4-services">
        <h2>Guias técnicos para preparar o seu projeto</h2>
        <p>Reunimos artigos técnicos por assunto para ajudar a definir objetivo, escopo e informações antes de pedir uma proposta.</p>
        <ul className="rj-guides">
          {topics.map(t => <li key={t.slug}><a className="text-link" href={t.slug}>{t.label}</a></li>)}
        </ul>
        <p><a className="text-link" href="/blog">Ver todos os artigos do blog ↗</a></p>
        <p>Para entender o que faz uma consultoria ambiental e como escolher uma empresa, leia o <a className="text-link" href="/consultoria-ambiental">guia de consultoria ambiental</a>. Para emissões fugitivas e LDAR, leia o <a className="text-link" href="/emissoes-fugitivas">guia de emissões fugitivas</a>.</p>
      </section>
      <section className="v4-services">
        <h2>Experiência em meio ambiente e segurança do trabalho</h2>
        <p>Fundada em 2009, a Monitorar soma 16 anos de experiência, mais de 500 projetos realizados, mais de 100 clientes atendidos e a 33ª posição no ranking da revista Exame. Conheça a <a className="text-link" href="/sobre">história da empresa</a>, os <a className="text-link" href="/clientes">clientes atendidos</a> e os <a className="text-link" href="/depoimentos">depoimentos</a>.</p>
        <ClientLogos />
      </section>
      <section className="v4-services">
        <h2>Atendimento no Rio de Janeiro e em outros estados</h2>
        <p>Com sede na Barra da Tijuca, no Rio de Janeiro, atendemos projetos em todo o estado do RJ e em qualquer outro estado do Brasil conforme o escopo de cada contratação. Para começar, informe o objetivo do projeto, a localização e o prazo.</p>
        <p>No estado do Rio de Janeiro, o atendimento alcança a capital, Niterói, a Baixada Fluminense, a Região dos Lagos, Macaé e o Norte Fluminense, Volta Redonda e o Sul Fluminense, e Angra dos Reis e a Costa Verde, conforme o escopo. Para projetos em outros estados, veja a consultoria ambiental <a className="text-link" href="/consultoria-ambiental-sp">em São Paulo</a> e <a className="text-link" href="/consultoria-ambiental-am">no Amazonas</a>, estados de atuação principal, e a página de <a className="text-link" href="/consultoria-ambiental-por-estado">consultoria ambiental por estado</a>.</p>
        <LocationBlock />
      </section>
      <section className="v4-services">
        <h2>Perguntas frequentes sobre consultoria ambiental</h2>
        {faq.map(([q, a]) => <div key={q} className="rj-faq"><h3>{q}</h3><p><Rich text={a} /></p></div>)}
      </section>
    </div>
    <ProjectCTA />
  </>;
}
