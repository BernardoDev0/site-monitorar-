import { SiteShell } from '@/components/SiteShell';
import type { EditorialPage } from "./types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

import { Search } from './Search';
import {ArticleCard} from './ArticleCard';
import {Cover} from './Cover';
import {ArticleTools} from './ArticleTools';
import { LocationBlock } from '@/components/LocationBlock';
// Three natural phrasings of the same link, so the 90 articles do not repeat one anchor.
const rjAnchors=['Conheça a consultoria ambiental da Monitorar no RJ','Veja a engenharia ambiental da Monitorar no Rio de Janeiro','Conheça a empresa de consultoria e engenharia ambiental no RJ'];
function Entries({page}:{page:EditorialPage}){return <><nav className="subnav" aria-label="Navegação editorial"><a href="/blog">Artigos</a><a href="/conteudos">Assuntos</a><a href="/busca">Buscar conteúdos</a></nav>{page.type==='search'?<Search/>:page.entries?.length?<div className="editorial-catalog">{page.type==='listing'?<><div className="editorial-featured-grid">{page.entries.slice(0,2).map((entry,i)=><ArticleCard key={entry.slug} entry={entry} featured priority={i===0}/>)}</div><div className="editorial-card-grid">{page.entries.slice(2).map(entry=><ArticleCard key={entry.slug} entry={entry}/>)}</div></>:<div className="editorial-card-grid">{page.entries.map(entry=><ArticleCard key={entry.slug} entry={entry}/>)}</div>}</div>:<section className="editorial-empty"><h2>{page.type==='listing'?'Novos artigos estão em preparação.':'Os guias por assunto estão em preparação.'}</h2><p>Os textos serão disponibilizados após revisão. Enquanto isso, conheça nossas áreas de atuação ou converse com a equipe sobre sua necessidade.</p><div className="actions"><a className="button" href="/servicos">Conhecer os serviços</a><a className="text-link" href="/contato">Falar com a Monitorar</a></div></section>}{(page.pageCount||0)>1&&<nav className="pagination" aria-label="Páginas do blog">{Array.from({length:page.pageCount!},(_,i)=><a href={i===0?'/blog':`/blog/pagina/${i+1}`} aria-current={page.pageNumber===i+1?'page':undefined} key={i}>{i+1}</a>)}</nav>}</>}
export default function EditorialApp({page}:{page:EditorialPage}) {
 const kind={service:"Serviços",article:"Conhecimento técnico",hub:"Explore o tema",case:"Experiência documentada",company:"A empresa",listing:'Blog Monitorar',directory:'Biblioteca por assunto',search:'Busca',collection:'Artigos por assunto'}[page.type];
 const listing=['listing','directory','search','collection'].includes(page.type);
 return <SiteShell>
 <main tabIndex={-1} id="conteudo" className={`editorial editorial-${page.type}`}>
 {page.preview&&<div className="editorial-preview" role="note">Prévia local · Rascunho aguardando revisão técnica e aprovação. Não publicado.</div>}
 <div className="editorial-wrap">
 <nav aria-label="Caminho da página" className="editorial-breadcrumb">{(page.breadcrumbs||[{slug:'/',title:'Início'},{slug:page.slug,title:page.title}]).map((item,i,items)=><span key={item.slug}>{i>0&&<span aria-hidden="true"> / </span>}{i===items.length-1?<span aria-current="page">{item.title}</span>:<a href={item.slug}>{item.title}</a>}</span>)}</nav>
 <div className={page.cover?"editorial-hero-split":"editorial-hero-plain"}><header className="editorial-intro"><p className="editorial-eyebrow">{kind}</p><h1>{page.title}</h1><p className="editorial-summary">{page.summary}</p>
 {page.author&&<p className="editorial-byline">Por {page.author}{page.reviewer&&` · Revisão técnica: ${page.reviewer}`}{page.reviewed_at&&` · Revisado em ${new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(page.reviewed_at))}`}</p>}
 {page.type==="service"&&<a className="editorial-cta" href="/contato">Conversar sobre uma proposta <span aria-hidden="true">↗</span></a>}</header>{page.cover&&<figure><Cover media={page.cover} priority sizes="(max-width: 850px) 100vw, 40vw"/><figcaption>{page.cover.caption}</figcaption></figure>}</div>
 {listing?<Entries page={page}/>:<div className="editorial-layout"><aside><ArticleTools headings={page.body.map(s=>s.heading)} preview={page.preview}/></aside>
 <article>{page.body.map((s,i)=><section id={`secao-${i+1}`} key={i}><h2>{s.heading}</h2>{s.paragraphs.map((p,j)=><p key={j}>{p}</p>)}{s.items&&<ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul>}{s.table&&<div className="table-scroll" tabIndex={0} role="region" aria-label={s.table.caption}><table><caption>{s.table.caption}</caption><thead><tr>{s.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{s.table.rows.map((r,k)=><tr key={k}>{r.map((v,l)=><td key={l}>{v}</td>)}</tr>)}</tbody></table></div>}</section>)}
 {page.source_urls.length>0&&<section><h2>Fontes para consulta</h2><ol>{page.source_urls.map(url=><li key={url}><a href={url} target="_blank" rel="noopener noreferrer">{new URL(url).hostname} · {decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1)||"Referência")}</a></li>)}</ol></section>}
 {page.first_published_at&&<p className="entry-date">Publicado em {new Intl.DateTimeFormat('pt-BR',{timeZone:'UTC'}).format(new Date(page.first_published_at))}</p>}
 {page.services&&page.services.length>0&&<section className="editorial-service-links"><h2>Serviços relacionados</h2><ul>{page.services.map(service=><li key={service.slug}><a href={service.slug}>{service.title} ↗</a></li>)}</ul></section>}
 {page.topic&&page.topic.slug!==page.slug&&<p><a href={page.topic.slug}>Explorar todos os artigos: {page.topic.title} ↗</a></p>}
 {page.topicEntries&&<section><h2>Artigos sobre este assunto</h2><ul className="topic-article-links">{page.topicEntries.map(entry=><li key={entry.slug}><a href={entry.slug}>{entry.title}</a></li>)}</ul></section>}
 {page.related&&page.related.length>0&&<section><h2>Continue a leitura</h2><ul className="related-illustrated">{page.related.map(r=><li key={r.slug}><a href={r.slug}><Cover media={r.cover} sizes="(max-width: 767px) 100vw, 25vw"/><span>{r.title}</span></a></li>)}</ul></section>}
 {page.type==="service"&&<LocationBlock heading="Atendimento a partir do Rio de Janeiro"/>}
 {page.type==="article"&&<section className="editorial-local-cta"><h2>Consultoria ambiental no RJ, em SP e no Amazonas</h2><p>A Monitorar é uma consultoria de engenharia ambiental com sede no Rio de Janeiro e atende projetos em qualquer estado do Brasil conforme o escopo, com atuação principal no RJ, em São Paulo e no Amazonas. <a href="/consultoria-ambiental-rj">{rjAnchors[(Number(page.id)||0)%rjAnchors.length]}</a>. Veja também a consultoria ambiental <a href="/consultoria-ambiental-sp">em São Paulo</a> e <a href="/consultoria-ambiental-am">no Amazonas</a>.</p></section>}
 {(page.slug==="/servicos/emissoes-fugitivas"||page.topic?.slug==="/conteudos/emissoes-fugitivas")&&<p className="editorial-faq-link"><a href="/emissoes-fugitivas-perguntas-e-respostas">Perguntas e respostas sobre emissões fugitivas ↗</a></p>}
 <section className="editorial-contact"><h2>Seu projeto tem requisitos próprios</h2><p>Compartilhe o objetivo e o contexto da sua necessidade. A definição do escopo depende das características da instalação e das informações disponíveis.</p><a className="editorial-cta" href="/contato">Falar com a Monitorar <span aria-hidden="true">↗</span></a></section>
 </article></div>}</div></main></SiteShell>;
}
