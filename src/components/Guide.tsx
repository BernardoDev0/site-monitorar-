import { PageIntro, ProjectCTA } from '@/components/PageIntro';
import { ClientLogos } from '@/components/ClientLogos';
import { environmentalServices } from '@/lib/environmental-services';
import type { GuideData, GuideSectionData } from '@/lib/guide';

const parts = /(\[\[.+?\|.+?\]\]|\*\*.+?\*\*)/g;
const isExternal = (url: string) => /^https?:\/\//.test(url);

// Renders [[label|url]] as a link (external ones open in a new tab) and **text** as bold.
export function Rich({ text }: { text: string }) {
  return <>{text.split(parts).map((part, i) => {
    const link = part.match(/^\[\[(.+?)\|(.+?)\]\]$/);
    if (link) return <a key={i} className="text-link" href={link[2]} {...(isExternal(link[2]) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{link[1]}</a>;
    const bold = part.match(/^\*\*(.+?)\*\*$/);
    return bold ? <strong key={i}>{bold[1]}</strong> : part;
  })}</>;
}

function Section({ section }: { section: GuideSectionData }) {
  return <section id={section.id} className="v4-services guide-section">
    <h2>{section.heading}</h2>
    {section.paragraphs.map((paragraph, i) => <p key={i}><Rich text={paragraph} /></p>)}
    {section.items && <ul className="guide-list">{section.items.map(item => <li key={item}><Rich text={item} /></li>)}</ul>}
    {section.table && <div className="guide-table" tabIndex={0} role="region" aria-label={section.table.caption}>
      <table><caption>{section.table.caption}</caption>
        <thead><tr>{section.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>}
    {section.services && <div className="rj-grid">{environmentalServices.map(service => <article key={service.title}><h3>{service.title}</h3><p>{service.text}</p><a className="text-link" href={service.href}>{service.cta} ↗</a></article>)}</div>}
    {section.clients && <ClientLogos />}
    {section.after?.map((paragraph, i) => <p key={i}><Rich text={paragraph} /></p>)}
  </section>;
}

export function Guide({ data }: { data: GuideData }) {
  const toc: [string, string][] = [
    ...data.sections.map((section): [string, string] => [section.id, section.heading]),
    ...(data.clusters ? [['guias', data.clusters.heading] as [string, string]] : []),
    ...(data.company ? [['monitorar-e-o-tema', data.company.heading] as [string, string]] : []),
    ['perguntas-frequentes', 'Perguntas frequentes'],
    ['fontes', 'Fontes'],
  ];
  return <>
    <PageIntro eyebrow={data.eyebrow} title={data.title}><p>{data.intro}</p></PageIntro>
    <div className="site-wrap rj-page guide-page">
      <nav className="guide-toc" aria-label="Nesta página">
        <p>Nesta página</p>
        <ol>{toc.map(([id, label]) => <li key={id}><a href={'#' + id}>{label}</a></li>)}</ol>
      </nav>
      {data.sections.map(section => <Section key={section.id} section={section} />)}
      {data.clusters && <section id="guias" className="v4-services guide-section">
        <h2>{data.clusters.heading}</h2>
        <p><Rich text={data.clusters.intro} /></p>
        {data.clusters.groups.map(group => <div key={group.heading} className="guide-group">
          <h3>{group.heading}</h3>
          <ul className="rj-guides">{group.links.map(([label, href]) => <li key={href}><a className="text-link" href={href}>{label}</a></li>)}</ul>
        </div>)}
      </section>}
      {data.company && <section id="monitorar-e-o-tema" className="v4-services guide-section">
        <h2>{data.company.heading}</h2>
        {data.company.paragraphs.map((paragraph, i) => <p key={i}><Rich text={paragraph} /></p>)}
      </section>}
      <section id="perguntas-frequentes" className="v4-services guide-section">
        <h2>Perguntas frequentes</h2>
        {data.faq.map(item => <div key={item.q} className="rj-faq"><h3>{item.q}</h3><p><Rich text={item.a} /></p></div>)}
      </section>
      <section id="fontes" className="v4-services guide-section">
        <h2>Fontes</h2>
        <ul className="rj-sources">{data.sources.map(([label, url]) => <li key={url}><a className="text-link" href={url} target="_blank" rel="noopener noreferrer">{label} ↗</a></li>)}</ul>
        <p>{data.disclaimer}</p>
      </section>
    </div>
    <ProjectCTA />
  </>;
}
