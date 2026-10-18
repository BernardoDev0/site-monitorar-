import {Photo} from './Photo';
import { Instagram } from "lucide-react";
export function InstagramFeed() {
  return <section className="container mx-auto px-4 py-12 instagram-illustrated" aria-labelledby="instagram-heading">
    <div><h2 id="instagram-heading" className="text-2xl font-bold text-primary">Acompanhe a Monitorar</h2>
    <p className="my-4 text-muted-foreground">Publicações e novidades no perfil institucional.</p>
    <a className="inline-flex items-center gap-2 underline underline-offset-4" href="https://instagram.com/monitorarconsultoria_" target="_blank" rel="noopener noreferrer"><Instagram aria-hidden="true" size={20}/> Ver perfil no Instagram</a>
  </div><Photo src="/equipe/equipe6.jpeg" alt="Registro institucional da equipe Monitorar" width={1280} height={960} loading="lazy"/></section>;
}
export default InstagramFeed;
