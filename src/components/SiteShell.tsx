import { useEffect, useRef, type PropsWithChildren } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { usePageMotion } from '@/hooks/use-page-motion';

export function SiteShell({children}: PropsWithChildren) {
  const root = useRef<HTMLDivElement>(null);
  const {pathname, hash} = useLocation();
  usePageMotion(root, pathname);
  useEffect(() => {
    const section = hash.slice(1) || ({'/sobre/historia':'historia','/sobre/missao':'missao','/sobre/equipe':'equipe','/servicos/hazop':'hazop','/servicos/auditorias':'auditorias','/servicos/treinamentos':'treinamentos'} as Record<string,string>)[pathname];
    const frame = requestAnimationFrame(() => {
      if (section) { const target = document.getElementById(section); if (target instanceof HTMLDetailsElement) target.open = true; target?.scrollIntoView({behavior:'instant'}); }
      else window.scrollTo(0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return <div ref={root} className="site-v4"><a className="skip-link" href="#conteudo">Pular para conteúdo</a><Header/>{children}<Footer/><WhatsAppButton/></div>;
}
