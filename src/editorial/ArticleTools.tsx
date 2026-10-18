import {useEffect,useRef,useState} from 'react';
export function ArticleTools({headings,preview}:{headings:string[];preview:boolean}) {
 const details=useRef<HTMLDetailsElement>(null);
 const [message,setMessage]=useState('');
 useEffect(()=>{const media=matchMedia('(max-width: 850px)');const update=()=>{if(details.current)details.current.open=!media.matches;};update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 async function copy(){try{await navigator.clipboard.writeText(location.href);setMessage(preview?'Endereço da prévia local copiado.':'Link copiado.');}catch{setMessage('Copie o endereço pela barra do navegador.');}}
 return <><details className="article-toc" ref={details} open><summary>Nesta página</summary><nav aria-label="Nesta página"><ol>{headings.map((heading,i)=><li key={i}><a href={`#secao-${i+1}`}>{heading}</a></li>)}</ol></nav></details><button type="button" className="editorial-copy-link" onClick={()=>void copy()}>{preview?'Copiar endereço da prévia':'Copiar link do artigo'}</button><p role="status" className="share-status">{message}</p></>;
}
