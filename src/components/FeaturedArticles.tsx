import {ArticleCard} from '@/editorial/ArticleCard';
import {useContext} from 'react';
import {ContentContext} from '@/editorial/ContentContext';
// Curadoria editorial explícita; não representa popularidade ou audiência medida.
const selected=['021','022','023'];
export function FeaturedArticles(){const content=useContext(ContentContext);const articles=selected.flatMap(id=>content.filter(d=>d.id===id&&d.type==='article'));return articles.length?<div className="home-editorial-grid">{articles.map(d=><ArticleCard key={d.id} entry={d}/>)}</div>:null;}
