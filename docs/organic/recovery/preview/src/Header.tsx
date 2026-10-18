import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Menu, Phone, Mail, ChevronDown, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";

const navigationItems = [
  { name: "Home", href: "/" },
  {
    name: "Sobre",
    href: "/sobre",
    dropdown: [
      { name: "Nossa História", href: "/sobre/historia" },
      { name: "Missão e Valores", href: "/sobre/missao" },
      { name: "Equipe", href: "/sobre/equipe" }
    ]
  },
  {
    name: "Serviços",
    href: "/servicos",
    dropdown: [
      { name: "Segurança do trabalho", href: "/servicos/seguranca" },
      { name: "Meio ambiente", href: "/servicos/meio-ambiente" },
      { name: "Representação Drager", href: "/servicos/drager" }
    ]
  },
  { name: "Nossos Clientes", href: "/clientes" },
  { name: "Depoimentos", href: "/depoimentos" },
  { name: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  { name: "Fale Conosco", href: "/contato" },
];


export const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(() => location.pathname !== "/" && !location.pathname.startsWith("/sobre"));
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Função para rolar para o topo da página
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // CSS para remover outlines indesejados
  const headerStyles = `
    .header-nav a:focus {
      outline: 3px solid #3f9905 !important; outline-offset: 3px;
      box-shadow: none !important;
    }
    .header-nav a:focus-visible {
      outline: 3px solid #3f9905 !important; outline-offset: 3px;
      box-shadow: none !important;
    }
    .header-nav a {
      border: none !important;
      box-shadow: none !important;
    }
    .header-nav a:hover {
      box-shadow: none !important;
    }
    .header-nav a:active {
      box-shadow: none !important;
    }
  `;

  const isActivePage = (href: string) => {
    if (href === '/sobre') {
      return location.pathname.startsWith('/sobre');
    }
    return location.pathname === href;
  };

  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname.startsWith('/sobre');
  const hasHeroBackground = isHomePage || isAboutPage;

  useEffect(() => {
    // Se não for home ou about, sempre fica branco
    if (!hasHeroBackground) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      // Determina se está na área do hero (home ou about)
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasHeroBackground]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: headerStyles }} />
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
        }`}>
        {/* Top bar - Language and Social Media */}
        <div className={`transition-all duration-500 ${isScrolled ? 'hidden' : 'h-auto opacity-100'
          } bg-brand-blue`}>
          <div className="container mx-auto px-4 py-1 lg:py-2">
            <div className="flex justify-between items-center">
              {/* Language Selector */}
              <div className="flex items-center">
                <span className="text-sm text-white">Português</span>
              </div>

              {/* Social Media */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <a href="https://www.instagram.com/monitorarconsultoria_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Monitorar" className="inline-flex h-11 w-11 items-center justify-center text-white"><Instagram className="h-4 w-4" /></a>
                  <a href="https://www.linkedin.com/company/monitorar-consultoria/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn da Monitorar" className="inline-flex h-11 w-11 items-center justify-center text-white"><Linkedin className="h-4 w-4" /></a>
                </div>
                <div className="h-4 w-px bg-white/30 hidden md:block"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main bar - Logo, Contact, Search - Hides on scroll */}
        <div className={`transition-all duration-500 ${isScrolled ? 'hidden' : 'h-auto opacity-100'
          } bg-white`}>
          <div className="container mx-auto px-4 py-3 md:py-4 lg:py-5">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Logo
                variant="dark"
                logoSrc="/moni3.png"
                size="sm"
              />

              {/* Contact Info */}
              <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Phone className="h-4 w-4" />
                  <div>
                    <div className="text-xs lg:text-sm font-medium">(21) 3881-1212</div>
                  </div>
                </div>

                <div className="h-4 w-px bg-gray-300 hidden md:block lg:hidden"></div>
                <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>

                <div className="flex items-center space-x-2 text-gray-700">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs lg:text-sm font-medium hidden sm:block break-all">administrativo@monitorarconsultoria.com.br</div>
                    <div className="text-xs lg:text-sm font-medium sm:hidden">contato@...</div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* Navigation bar - Glass effect with background image */}
        <div className={`flex items-center py-2 md:py-3 lg:py-4 ${isScrolled ? 'justify-center px-4' : 'justify-center'}`}>
          <div className={`transition-all duration-500 rounded-full px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 shadow-lg flex items-center ${isScrolled ? 'bg-white border border-gray-200' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-black/10'
            }`}>
            {/* Logo inside nav bar - only visible when scrolled */}
            <div className={`transition-all duration-500 overflow-hidden ${isScrolled ? 'w-auto opacity-100 mr-4' : 'hidden'}`}>
              <Logo
                variant="dark"
                logoSrc="/moni3.png"
                size="sm"
              />
            </div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex header-nav">
              <div className="flex items-center space-x-2 lg:space-x-3">
                {navigationItems.map((item) => (
                  <div key={item.name} className="relative group" onKeyDown={(e) => { if(e.key === "Escape") setOpenDropdown(null); }} onFocus={() => setOpenDropdown(item.name)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenDropdown(null); }}>
                    {item.dropdown ? (
                      <>
                        <Link reloadDocument
                          to={item.href}
                          className={`flex items-center gap-1 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 rounded-full outline-none focus:outline-none border-0 ${isActivePage(item.href)
                            ? "text-white bg-brand-blue/80"
                            : isScrolled
                              ? "text-gray-700 hover:text-[#4fc106] hover:bg-gray-100"
                              : "text-white hover:text-gray-200 hover:bg-white/20"
                            }`}
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.name}
                          <ChevronDown className="h-3 w-3" />
                        </Link>

                        {/* Dropdown Menu */}
                        <div
                          className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200/20 py-2 transition-all duration-100 ${openDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                          onMouseEnter={() => setOpenDropdown(item.name)}
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link reloadDocument
                              key={subItem.name}
                              to={subItem.href}
                              onClick={scrollToTop}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#4fc106] transition-colors duration-100"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      </>
                    ) : (
                      <Link reloadDocument
                        to={item.href}
                        onClick={scrollToTop}
                        className={`relative px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 rounded-full outline-none focus:outline-none border-0 ${isActivePage(item.href)
                          ? "text-white bg-brand-blue/80"
                          : isScrolled
                            ? "text-gray-700 hover:text-[#4fc106] hover:bg-gray-100"
                            : "text-white hover:text-gray-200 hover:bg-white/20"
                          }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon" aria-label="Abrir menu de navegação"
                    className={`h-11 w-11 rounded-full shadow-lg border transition-all duration-150 ${isScrolled
                      ? 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                      : 'bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20'
                      }`}
                  >
                    <Menu className={`h-5 w-5 transition-colors duration-150 ${isScrolled ? 'text-gray-700' : 'text-white'
                      }`} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/20">
                  <SheetTitle>Navegação</SheetTitle><SheetDescription>Escolha uma página da Monitorar.</SheetDescription>
                  <div className="flex flex-col space-y-2 mt-8">
                    {navigationItems.map((item) => (
                      <Link reloadDocument
                        key={item.name}
                        to={item.href}
                        onClick={() => {
                          setIsOpen(false);
                          scrollToTop();
                        }}
                        className={`text-sm font-medium py-3 px-4 rounded-xl transition-all duration-150 ${isActivePage(item.href)
                          ? "bg-[#4fc106] text-white shadow-lg shadow-[#4fc106]/25"
                          : "hover:bg-white/60 text-gray-700 hover:text-[#4fc106]"
                          }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};