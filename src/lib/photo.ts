import photos from './photos.json';
type Variant={src:string;srcSet:string;width:number;height:number};
export function photoVariant(src: string) {
 const key=src.includes('images.unsplash.com/')?src.split('/').at(-1)!.split('?')[0]:src;
 return (photos as Record<string,Variant>)[key];
}
export function photoUrl(src:string){return photoVariant(src)?.src||src;}
