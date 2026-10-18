export function editorialPages(documents,preview=false) {
 const articles=documents.filter(d=>d.type==='article').sort((a,b)=>(b.reviewed_at||'').localeCompare(a.reviewed_at||'')||a.id.localeCompare(b.id));
 const base={body:[],source_urls:[],author:null,reviewer:null,reviewed_at:null,substantive_updated_at:null,preview};
 const pages=[];
 const count=Math.max(1,Math.ceil(articles.length/12));
 for(let n=1;n<=count;n++)pages.push({...base,id:'blog-'+n,slug:n===1?'/blog':'/blog/pagina/'+n,type:'listing',title:n===1?'Conhecimento para decisões ambientais':'Blog: página '+n,summary:'Conceitos, critérios e perguntas para preparar o seu projeto. Explore os artigos por tema e aprofunde o que importa para a sua operação.',entries:articles.slice((n-1)*12,n*12),pageNumber:n,pageCount:count,noindex:!articles.length});
 pages.push({...base,id:'directory',slug:'/conteudos',type:'directory',title:'Explore por assunto',summary:'Um ponto de partida para conectar conceitos, decisões e serviços. Escolha o tema da sua necessidade.',entries:documents.filter(d=>d.type==='hub'),noindex:!documents.some(d=>d.type==='hub')});
 pages.push({...base,id:'search',slug:'/busca',type:'search',title:'Encontre uma resposta',summary:'Busque pelos termos do seu projeto e refine os resultados por assunto.',entries:documents.filter(d=>d.type==='hub'),noindex:true});
 return pages;
}
