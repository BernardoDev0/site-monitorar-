// Search-result description for an article, derived from its approved summary without changing it.
// Google shows about 155 characters; longer descriptions are cut mid-sentence or replaced by text it picks itself.
export const SNIPPET_MAX=155;
const STOP=new Set(['a','o','as','os','de','do','da','dos','das','em','no','na','nos','nas','e','ou','para','por','com','um','uma','que','como','se','ao','aos','sem','sobre']);
const plain=s=>s.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const tokens=s=>new Set(plain(s).split(' ').filter(w=>w.length>2&&!STOP.has(w)));
// Share of the title's significant words that the text already uses.
const coverage=(title,text)=>{const t=tokens(title),u=tokens(text);return t.size?[...t].filter(w=>u.has(w)).length/t.size:1;};
export function seoDescription(title,summary,max=SNIPPET_MAX){
 const text=summary.replace(/\s+/g,' ').trim();
 let out;
 if(text.length<=max)out=text;
 else{
  // Whole sentences first.
  const sentences=text.match(/[^.!?]+[.!?]+(?:\s|$)/g)?.map(s=>s.trim())||[text];
  out='';
  for(const sentence of sentences){if((out?out+' '+sentence:sentence).length>max)break;out=out?out+' '+sentence:sentence;}
  if(!out){
   // One long sentence: stop at its colon or dash, otherwise at a word. Commas are never used, they would leave a cut list.
   const head=text.slice(0,max-1),cut=[head.indexOf(': '),head.indexOf(' — ')].filter(i=>i>=60).sort((a,b)=>a-b)[0];
   out=cut!==undefined?head.slice(0,cut).replace(/[,;:—\s]+$/,'')+'.':head.slice(0,head.lastIndexOf(' ')).replace(/[,;:—\s]+$/,'')+'…';
  }
 }
 // Name the subject only when the text barely mentions it, and only if that still fits.
 if(coverage(title,out)<0.6){const withTitle=title+': '+out.charAt(0).toLocaleLowerCase('pt-BR')+out.slice(1);if(withTitle.length<=max)out=withTitle;}
 return out;
}
