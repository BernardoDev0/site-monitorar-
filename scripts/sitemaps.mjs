// The public sitemap is a readable urlset for the owner's format experiment.
// Grouped sitemaps remain available for existing consumers; dates always reflect actual page changes.
import {readFile} from 'node:fs/promises';
const head='<?xml version="1.0" encoding="UTF-8"?>',ns=' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
export const sitemapGroups=['page','post','category'];
// post = the articles; category = blog pages, subject pages and the subject directory; page = everything else.
export const sitemapGroup=row=>row.page?.type==='article'?'post':['listing','collection','directory','hub'].includes(row.page?.type)?'category':'page';
const entry=(tag,{loc,lastmod})=>'<'+tag+'><loc>'+loc+'</loc>'+(lastmod?'<lastmod>'+lastmod+'</lastmod>':'')+'</'+tag+'>';
export const urlsetXml=entries=>head+'<urlset'+ns+'>'+entries.map(e=>entry('url',e)).join('')+'</urlset>';
const escapeXml=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
export const readableUrlsetXml=entries=>head+'\n<urlset'+ns+'>\n'+entries.map(({loc,lastmod})=>
 '  <url>\n    <loc>'+escapeXml(loc)+'</loc>\n'+(lastmod?'    <lastmod>'+escapeXml(lastmod)+'</lastmod>\n':'')+
 '    <changefreq>weekly</changefreq>\n    <priority>'+(new URL(loc).pathname==='/'?'1.0':'0.8')+'</priority>\n  </url>\n').join('')+'</urlset>\n';
export const sitemapIndexXml=children=>head+'<sitemapindex'+ns+'>'+children.map(c=>entry('sitemap',c)).join('')+'</sitemapindex>';
// One urlset with the URLs of every child, for code that reads URLs (IndexNow, live checks, tests). A plain urlset is returned as is.
export async function expandSitemap(xml,fetchText){
 if(!xml.includes('<sitemapindex'))return xml;
 const children=await Promise.all([...xml.matchAll(/<sitemap>\s*<loc>(.*?)<\/loc>/g)].map(m=>fetchText(m[1])));
 return urlsetXml([]).replace('</urlset>',children.map(child=>child.match(/<urlset[^>]*>([\s\S]*)<\/urlset>/)?.[1]||'').join('')+'</urlset>');
}
export const readSitemap=(dir='dist')=>readFile(dir+'/sitemap.xml','utf8').then(xml=>expandSitemap(xml,loc=>readFile(dir+new URL(loc).pathname,'utf8')));
