import { useRef } from 'react';
import { Menu, Search, ChevronDown } from 'lucide-react';

const items = [
  { name: 'Home', href: '/' },
  { name: 'Sobre', href: '/sobre', children: [['Nossa História', '/sobre/historia'], ['Missão e Valores', '/sobre/missao'], ['Equipe', '/sobre/equipe']] },
  { name: 'Serviços', href: '/servicos', children: [['Segurança do trabalho', '/servicos/seguranca'], ['Meio ambiente', '/servicos/meio-ambiente'], ['Representação Drager', '/servicos/drager']] },
  { name: 'Nossos Clientes', href: '/clientes' },
  { name: 'Depoimentos', href: '/depoimentos' },
  { name: 'Trabalhe Conosco', href: '/trabalhe-conosco' },
  { name: 'Fale Conosco', href: '/contato' },
  { name: 'Blog', href: '/blog' },
];

export function Header() {
  const header = useRef<HTMLElement>(null);
  return <header ref={header} className="erm-header" onKeyDown={event => {
    if (event.key !== 'Escape') return;
    const disclosure = (event.target as HTMLElement).closest('details');
    if (disclosure) { disclosure.open = false; disclosure.querySelector('summary')?.focus(); event.stopPropagation(); }
  }}>
    <div className="container erm-header-inner">
      <a href="/" aria-label="Monitorar Consultoria — início" className="erm-logo"><img src="/moni3.png" alt="Monitorar Consultoria" width={180} height={64}/></a>
      <nav aria-label="Navegação principal" className="erm-desktop-nav">
        {items.map(item => item.children ? <div key={item.href} className="erm-nav-group">
          <a href={item.href}>{item.name}</a>
          <details onToggle={event => { const opened = event.currentTarget; if (opened.open) header.current?.querySelectorAll('details').forEach(other => { if (other !== opened && !other.contains(opened)) other.open = false; }); }}>
            <summary aria-label={`Abrir submenu ${item.name}`}><ChevronDown size={14}/></summary>
            <div className="erm-dropdown">{item.children.map(([label, url]) => <a key={url} href={url}>{label}</a>)}</div>
          </details>
        </div> : <a key={item.href} href={item.href} aria-current={item.href === '/' ? 'page' : undefined}>{item.name}</a>)}
      </nav>
      <a href="/busca" className="erm-search" aria-label="Buscar no site"><Search size={21}/></a>
      <details className="erm-mobile-nav">
        <summary aria-label="Abrir menu de navegação"><Menu size={25}/><span>Menu</span></summary>
        <nav aria-label="Navegação móvel">{items.map(item => <div key={item.href}>
          <a href={item.href}>{item.name}</a>
          {item.children && <div className="erm-mobile-subnav">{item.children.map(([label, url]) => <a key={url} href={url}>{label}</a>)}</div>}
        </div>)}</nav>
      </details>
    </div>
  </header>;
}
