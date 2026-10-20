// Sitemaps split as the page-one WordPress leaders split theirs (Yoast, Rank Math): /sitemap.xml is an index of the
// page, post and category sitemaps. Only loc and lastmod: Google ignores priority and changefreq.
import {readFile} from 'node:fs/promises';
const head='<?xml version="1.0" encoding="UTF-8"?>',ns=' xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
export const sitemapGroups=['page','post','category'];
// post = the articles; category = blog pages, subject pages and the subject directory; page = everything else.
export const sitemapGroup=row=>row.page?.type==='article'?'post':['listing','collection','directory','hub'].includes(row.page?.type)?'category':'page';
const entry=(tag,{loc,lastmod})=>'<'+tag+'><loc>'+loc+'</loc>'+(lastmod?'<lastmod>'+lastmod+'</lastmod>':'')+'</'+tag+'>';
export const urlsetXml=entries=>head+'<urlset'+ns+'>'+entries.map(e=>entry('url',e)).join('')+'</urlset>';
export const sitemapIndexXml=children=>head+'<sitemapindex'+ns+'>'+children.map(c=>entry('sitemap',c)).join('')+'</sitemapindex>';
// One urlset with the URLs of every child, for code that reads URLs (IndexNow, live checks, tests). A plain urlset is returned as is.
export async function expandSitemap(xml,fetchText){
 if(!xml.includes('<sitemapindex'))return xml;
 const children=await Promise.all([...xml.matchAll(/<sitemap><loc>(.*?)<\/loc>/g)].map(m=>fetchText(m[1])));
 return urlsetXml([]).replace('</urlset>',children.map(child=>child.match(/<urlset[^>]*>([\s\S]*)<\/urlset>/)?.[1]||'').join('')+'</urlset>');
}
export const readSitemap=(dir='dist')=>readFile(dir+'/sitemap.xml','utf8').then(xml=>expandSitemap(xml,loc=>readFile(dir+new URL(loc).pathname,'utf8')));
