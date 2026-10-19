import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { Menu, Search, ChevronDown, ArrowRight, Instagram, Linkedin } from 'lucide-react';
import { ContentContext } from '@/editorial/ContentContext';
import { topicLabels, topicPaths } from '@/editorial/topics';

type NavItem = {name:string;href:string;description?:string;children?:string[][]};
const baseItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Sobre', href: '/sobre', description: 'Monitorar Consultoria', children: [['Nossa História', '/sobre/historia'], ['Missão e Valores', '/sobre/missao'], ['Equipe', '/sobre/equipe']] },
  { name: 'Serviços', href: '/servicos', description: 'Segurança do trabalho e meio ambiente', children: [['Segurança do trabalho', '/servicos/seguranca'], ['Meio ambiente', '/servicos/meio-ambiente'], ['Consultoria ambiental no RJ', '/consultoria-ambiental-rj'], ['Consultoria ambiental por estado', '/consultoria-ambiental-por-estado'], ['Emissões fugitivas e LDAR', '/servicos/emissoes-fugitivas'], ['Ruído extramuros', '/servicos/ruido-extramuros'], ['Representação Drager', '/servicos/drager'], ['HAZOP', '/servicos/hazop'], ['Auditorias', '/servicos/auditorias'], ['Treinamentos', '/servicos/treinamentos']] },
  { name: 'Nossos Clientes', href: '/clientes' },
  { name: 'Depoimentos', href: '/depoimentos' },
  { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
  { name: 'Fale Conosco', href: '/contato' },
];

export function Header() {
  const { pathname } = useLocation();
  const content = useContext(ContentContext);
  const header = useRef<HTMLElement>(null);
  const topics = [...new Set(content.filter(d => d.type === 'article').map(d => d.topic_cluster).filter((t): t is string => !!t))];
  const items: NavItem[] = [...baseItems, {name:'Blog',href:'/blog',description:'Conhecimento para decisões ambientais',children:[['Todos os artigos','/blog'],['Biblioteca por assunto','/conteudos'],['Buscar conteúdos','/busca'],...topics.map(t => [topicLabels[t] || t, topicPaths[t] || '/busca#tema='+encodeURIComponent(t)])]}];
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const disposers: (() => void)[] = [];
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let restoringFocus = false;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const tweens = new Map<HTMLDetailsElement, gsap.core.Tween>();
    function setOpen(details: HTMLDetailsElement, open: boolean) {
      const panel = details.querySelector<HTMLElement>(':scope > .erm-dropdown, :scope > nav, :scope > .erm-mobile-subnav');
      const closing = details.dataset.closing === 'true';
      if (open && details.open && !closing || !open && (!details.open || closing)) return;
      tweens.get(details)?.kill();
      delete details.dataset.closing;
      if (open) {
        element!.querySelectorAll<HTMLDetailsElement>('.erm-desktop-nav details[open]').forEach(other => {
          if (other !== details) setOpen(other, false);
        });
        details.open = true;
        if (panel) panel.inert = false;
        if (panel && !reduced.matches) tweens.set(details, gsap.fromTo(panel, {y: closing ? Number(gsap.getProperty(panel,'y')) : -6, opacity: closing ? Number(gsap.getProperty(panel,'opacity')) : 0}, {y:0,opacity:1,duration:.26,ease:'power2.out',clearProps:'transform,opacity',overwrite:true}));
      } else if (panel && !reduced.matches) {
        details.dataset.closing = 'true';
        panel.inert = true;
        tweens.set(details, gsap.to(panel,{y:-4,opacity:0,duration:.17,ease:'power2.in',overwrite:true,onComplete:()=>{details.open=false;delete details.dataset.closing;panel.inert=false;gsap.set(panel,{clearProps:'transform,opacity'});}}));
      } else { details.open = false; if(panel) { panel.inert=false; gsap.set(panel,{clearProps:'transform,opacity'}); } }
    }
    const closeAll = () => { timers.forEach(clearTimeout); timers.clear(); element.querySelectorAll<HTMLDetailsElement>('details[open]').forEach(d => setOpen(d,false)); };
    const outside = (event: PointerEvent) => { if (!element.contains(event.target as Node)) closeAll(); };
    document.addEventListener('pointerdown', outside);
    element.querySelectorAll<HTMLDetailsElement>('details').forEach(details=>{
      const summary=details.querySelector('summary')!;
      const click=(event:MouseEvent)=>{event.preventDefault();setOpen(details,!details.open || details.dataset.closing==='true');};
      summary.addEventListener('click',click);
      disposers.push(()=>summary.removeEventListener('click',click));
    });
    element.querySelectorAll<HTMLElement>('.erm-nav-group').forEach(group => {
      const details = group.querySelector('details')!;
      let timer: ReturnType<typeof setTimeout>;
      const cancel = () => { clearTimeout(timer); timers.delete(timer); };
      const later = (fn:()=>void, delay:number) => { timer=setTimeout(()=>{timers.delete(timer);fn();},delay);timers.add(timer); };
      const enter = () => { cancel(); if (matchMedia('(hover:hover) and (pointer:fine)').matches) later(() => setOpen(details,true), 80); };
      const leave = () => { cancel(); later(() => { if (!group.contains(document.activeElement)) setOpen(details,false); }, 160); };
      const focus = (event: FocusEvent) => { cancel(); if (!restoringFocus && (event.target as Element).matches('summary:focus-visible')) setOpen(details,true); };
      const blur = () => { cancel(); later(() => { if (!group.contains(document.activeElement)) setOpen(details,false); }, 0); };
      group.addEventListener('mouseenter', enter); group.addEventListener('mouseleave', leave);
      group.addEventListener('focusin', focus); group.addEventListener('focusout', blur);
      disposers.push(() => { cancel(); group.removeEventListener('mouseenter', enter); group.removeEventListener('mouseleave', leave); group.removeEventListener('focusin', focus); group.removeEventListener('focusout', blur); });
    });
    const escape = (event: KeyboardEvent) => {
      if(event.key !== 'Escape') return;
      const disclosure=(event.target as HTMLElement).closest<HTMLDetailsElement>('details[open]:not([data-closing])');
      if(!disclosure) return;
      timers.forEach(clearTimeout); timers.clear(); restoringFocus=true;
      disclosure.querySelector('summary')?.focus(); restoringFocus=false;
      setOpen(disclosure,false);event.stopPropagation();event.preventDefault();
    };
    element.addEventListener('keydown',escape);
    reduced.addEventListener('change',closeAll);
    window.addEventListener('resize', closeAll);
    return () => { timers.forEach(clearTimeout); tweens.forEach(t=>t.kill()); element.querySelectorAll<HTMLDetailsElement>('details').forEach(d=>{d.open=false;delete d.dataset.closing;d.querySelectorAll<HTMLElement>('.erm-dropdown, nav, .erm-mobile-subnav').forEach(p=>{p.inert=false;gsap.set(p,{clearProps:'transform,opacity'});});}); element.removeEventListener('keydown',escape); reduced.removeEventListener('change',closeAll); disposers.forEach(fn => fn()); document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', closeAll); };
  }, [pathname]);
  return <header ref={header} className="erm-header">
    <div className="container erm-header-inner">
      <a href="/" aria-label="Monitorar Consultoria — início" className="erm-logo"><img src="/moni3.png" alt="Monitorar Consultoria" width={180} height={64}/></a>
      <nav aria-label="Navegação principal" className="erm-desktop-nav">
        {items.map(item => item.children ? <div key={item.href} className="erm-nav-group">
          <a href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.name}</a>
          <details>
            <summary aria-label={`Abrir submenu ${item.name}`}><ChevronDown size={14} aria-hidden="true"/></summary>
            <div className="erm-dropdown">
              <div className="mega-intro"><p className="eyebrow">{item.name}</p><p className="mega-description">{item.description}</p><a className="mega-explore" href={item.href}>Explorar {item.name.toLowerCase()}<ArrowRight size={17} aria-hidden="true"/></a></div>
              <div className="mega-links">{item.children.map(([label, url]) => <a key={url} href={url}><span>{label}</span><ArrowRight size={16} aria-hidden="true"/></a>)}</div>
            </div>
          </details>
        </div> : <a key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.name}</a>)}
      </nav>
      <div className="erm-header-actions">
        <nav className="erm-header-social" aria-label="Redes sociais da Monitorar">
          <a href="https://instagram.com/monitorarconsultoria_" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Monitorar (abre em nova aba)" title="Instagram"><Instagram size={18} aria-hidden="true"/></a>
          <a href="https://linkedin.com/company/monitorar-consultoria" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da Monitorar (abre em nova aba)" title="LinkedIn"><Linkedin size={18} aria-hidden="true"/></a>
        </nav>
        <a href="/busca" className="erm-search" aria-label="Buscar no site"><Search size={21} aria-hidden="true"/></a>
      </div>
      <details className="erm-mobile-nav">
        <summary aria-label="Abrir menu de navegação"><Menu size={25}/><span>Menu</span></summary>
        <nav aria-label="Navegação móvel">{items.map(item => <div className="mobile-nav-item" key={item.href}>
          <a href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>{item.name}</a>
          {item.children && <details className="erm-mobile-group"><summary aria-label={`Abrir submenu ${item.name}`}><ChevronDown size={18}/></summary><div className="erm-mobile-subnav">{item.children.map(([label, url]) => <a key={url} href={url}>{label}<ArrowRight size={15} aria-hidden="true"/></a>)}</div></details>}
        </div>)}</nav>
      </details>
    </div>
  </header>;
}
