import { ArrowUpRight } from 'lucide-react';
import {Cover} from './Cover';
import {topicLabels} from './topics';
import type {EditorialMedia} from './types';
type Entry={type?:string;slug:string;title:string;summary:string;topic_cluster?:string;reviewed_at?:string|null;cover?:EditorialMedia};
export function ArticleCard({entry,featured=false,priority=false}:{entry:Entry;featured?:boolean;priority?:boolean}) {
 return <article className={`editorial-card${featured?' editorial-card-featured':''}`}>
  <a className="editorial-card-image" href={entry.slug} tabIndex={-1} aria-hidden="true"><Cover media={entry.cover} priority={priority} sizes={featured?'(max-width: 767px) 100vw, 50vw':undefined}/></a>
  <div className="editorial-card-copy"><p className="eyebrow">{topicLabels[entry.topic_cluster||'']||'Guia por assunto'}</p><h2><a href={entry.slug}>{entry.title}</a></h2><p>{entry.summary}</p>{entry.reviewed_at&&<p className="entry-date">Revisado em {new Date(entry.reviewed_at).toLocaleDateString('pt-BR',{timeZone:'UTC'})}</p>}<a className="editorial-read" href={entry.slug} aria-label={`Ler: ${entry.title}`}>{entry.type&&entry.type!=='article'?'Explorar assunto':'Ler artigo'} <ArrowUpRight size={17} aria-hidden="true"/></a></div>
 </article>;
}
