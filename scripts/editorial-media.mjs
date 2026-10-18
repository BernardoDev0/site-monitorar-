import {readFile} from 'node:fs/promises';

// Server-only: receive documents already selected by the publication gate.
export async function withEditorialMedia(documents) {
 const manifest=JSON.parse(await readFile('content/editorial-media.json','utf8'));
 const photos=JSON.parse(await readFile('src/lib/photos.json','utf8'));
 return documents.map(doc=>{
  const own=manifest.articles[doc.slug];
  const sources=manifest.topics[doc.topic_cluster]||['/paisagem2.png'];
  const sourceId=own?.sourceId||sources[(Number(doc.id)||0)%sources.length];
  const media=own?.status==='generated-reviewed'?own:photos[sourceId];
  if(!media) throw new Error('Missing editorial media: '+sourceId);
  const cover=own?.status==='generated-reviewed'?own:{...media,sourceId,alt:'Imagem ilustrativa do acervo existente',caption:'Imagem ilustrativa do acervo existente da Monitorar.',status:'existing-collection',focalPoint:'50% 50%'};
  return {...doc,cover};
 });
}
