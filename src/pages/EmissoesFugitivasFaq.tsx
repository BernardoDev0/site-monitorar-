import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import faq from '../../content/faq-emissoes-fugitivas.json';

// Answers carry [[label|/path]] link tokens; the same data feeds the FAQPage structured data (scripts/schema.mjs).
const token = /\[\[(.+?)\|(.+?)\]\]/g;
function Rich({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0, m: RegExpExecArray | null;
  token.lastIndex = 0;
  while ((m = token.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(<a key={m.index} className="text-link" href={m[2]}>{m[1]}</a>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

const sources: [string, string][] = [
  ['Resolução CONAMA nº 382, de 26 de dezembro de 2006, art. 3º (cópia no portal do IEMA-ES)', 'https://iema.es.gov.br/Media/iema/CQAI/FIGURAS/CRSS/CONAMA/CONAMA_382_2006.pdf'],
  ['EPA, Leak Detection and Repair: A Best Practices Guide', 'https://www.epa.gov/sites/default/files/2014-02/documents/ldarguide.pdf'],
  ['EPA, Method 21: Volatile Organic Compound Leaks', 'https://www.epa.gov/emc/method-21-volatile-organic-compound-leaks'],
  ['Resolução CONEMA nº 97, de 10 de novembro de 2022, que aprova a NOP-INEA-52 (INEA)', 'https://www.inea.rj.gov.br/wp-content/uploads/2022/11/Resolu%C3%A7%C3%A3o-CONEMA-n%C2%BA-97-aprova-a-NOP-INEA-52.pdf'],
];

export default function EmissoesFugitivasFaq() {
  return <>
    <PageIntro eyebrow="Guia técnico" title="Emissões fugitivas: perguntas e respostas">
      <p>Respostas diretas sobre emissões fugitivas, LDAR e detecção de vazamentos, com base em fontes oficiais: a Resolução CONAMA nº 382/2006, o guia de boas práticas LDAR e o Método 21 da EPA e a NOP-INEA-52, do Rio de Janeiro. Atualizado em outubro de 2026.</p>
    </PageIntro>
    <div className="site-wrap rj-page">
      {faq.map(item => <section key={item.q} className="v4-services">
        <h2>{item.q}</h2>
        {item.a.map((paragraph, i) => <p key={i}><Rich text={paragraph} /></p>)}
      </section>)}
      <section className="v4-services">
        <h2>Fontes</h2>
        <ul className="rj-sources">
          {sources.map(([label, url]) => <li key={url}><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>)}
        </ul>
        <p>Este guia reúne referências públicas e não substitui a leitura das normas vigentes nem a definição do escopo de um projeto. A aplicação a cada instalação depende do contexto, e a proposta técnica confirma atividades, entregas, prazos e exclusões.</p>
      </section>
    </div>
    <ProjectCTA />
  </>;
}
