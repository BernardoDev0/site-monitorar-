import type { ImgHTMLAttributes } from 'react';
import { photoVariant } from '@/lib/photo';
export function Photo({src='',sizes='(max-width: 767px) 100vw, 60vw',...props}:ImgHTMLAttributes<HTMLImageElement>){
 const variant=photoVariant(src);
 return <img {...props} src={variant?.src||src} srcSet={variant?.srcSet} sizes={variant?sizes:undefined} decoding="async"/>;
}
