import { clientsLogos } from '@/lib/clients';

// Static strip of the client logos the site already shows in the home carousel, as plain HTML so crawlers read the names.
export function ClientLogos() {
  return <ul className="client-logos" aria-label="Clientes atendidos">
    {clientsLogos.map(logo => <li key={logo.src}><img src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} loading="lazy" decoding="async" /></li>)}
  </ul>;
}
