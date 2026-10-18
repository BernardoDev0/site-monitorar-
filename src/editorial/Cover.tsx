import type { EditorialMedia } from './types';
export function Cover({media,priority=false,sizes='(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw'}:{media?:EditorialMedia;priority?:boolean;sizes?:string}) {
 if(!media) return null;
 return <img className="editorial-cover" src={media.src} srcSet={media.srcSet} sizes={sizes} width={media.width} height={media.height} alt={media.alt} style={{objectPosition:media.focalPoint}} loading={priority?'eager':'lazy'} decoding="async"/>;
}
