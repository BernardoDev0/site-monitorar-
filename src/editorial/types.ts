export interface EditorialMedia {
 src:string;srcSet?:string;width:number;height:number;alt:string;caption:string;sourceId:string;
 focalPoint?:string;status:'existing-collection'|'generated-reviewed';
}
export interface EditorialPage {
 id:string;slug:string;type:"service"|"article"|"hub"|"case"|"company"|"listing"|"directory"|"search";title:string;summary:string;
 body:{heading:string;paragraphs:string[];items?:string[];table?:{caption:string;headers:string[];rows:string[][]}}[];source_urls:string[];
 topic_cluster?:string;service_links?:string[];entries?:EditorialPage[];pageNumber?:number;pageCount?:number;noindex?:boolean;
 author:string|null;reviewer:string|null;reviewed_at:string|null;substantive_updated_at:string|null;preview:boolean;
 cover?:EditorialMedia;
 related?:{slug:string;title:string;cover?:EditorialMedia}[];
}
