import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, Mail, ChevronDown, Search, Instagram, Linkedin, Globe } from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      { name: "Representação Drager", href: "/servicos" }
    ]
  },
  { name: "Nossos Clientes", href: "/clientes" },
  { name: "Depoimentos", href: "/depoimentos" },
  { name: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  { name: "Fale Conosco", href: "/contato" },
];

const languages = [
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState(languages[0]);
  const location = useLocation();

  // Funções para redes sociais
  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/monitorarconsultoria_/', '_blank');
  };

  const handleLinkedinClick = () => {
    window.open('https://www.linkedin.com/company/monitorar-consultoria/', '_blank');
  };

  // Função para mudança de idioma
  const handleLanguageChange = (language: typeof languages[0]) => {
    setCurrentLanguage(language);
    // Aqui você pode implementar a lógica de internacionalização
    console.log(`Idioma alterado para: ${language.name}`);
  };

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
      outline: none !important;
      box-shadow: none !important;
    }
    .header-nav a:focus-visible {
      outline: none !important;
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
      <header className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
      {/* Top bar - Language and Social Media */}
      <div className={`transition-all duration-500 ${
        isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
      } bg-brand-blue`}>
        <div className="container mx-auto px-4 py-1 lg:py-2">
          <div className="flex justify-between items-center">
            {/* Language Selector */}
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-white border-white text-brand-blue hover:bg-gray-50">
                    <Globe className="h-4 w-4" />
                    <span className="flex items-center gap-1">
                      <span>{currentLanguage.flag}</span>
                      <span>{currentLanguage.name}</span>
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                      {currentLanguage.code === language.code && (
                        <span className="ml-auto text-brand-blue">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Instagram 
                  className="h-4 w-4 text-white hover:text-gray-200 transition-colors cursor-pointer" 
                  onClick={handleInstagramClick}
                />
                <Linkedin 
                  className="h-4 w-4 text-white hover:text-gray-200 transition-colors cursor-pointer" 
                  onClick={handleLinkedinClick}
                />
              </div>
              <div className="h-4 w-px bg-white/30 hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar - Logo, Contact, Search */}
      <div className={`transition-all duration-500 ${
        isScrolled ? 'backdrop-blur-xl bg-white/95 border-b border-gray-200/20' : 'bg-white'
      }`}>
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
                  <div className="text-xs text-gray-500">Telefone</div>
                  <div className="text-xs lg:text-sm font-medium">(21) 3881-1212</div>
                </div>
              </div>
              
              <div className="h-4 w-px bg-gray-300 hidden md:block lg:hidden"></div>
              <div className="h-6 w-px bg-gray-300 hidden lg:block"></div>
              
              <div className="flex items-center space-x-2 text-gray-700">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-xs lg:text-sm font-medium hidden sm:block break-all">administrativo@monitorarconsultoria.com.br</div>
                  <div className="text-xs lg:text-sm font-medium sm:hidden">contato@...</div>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="flex items-center">
              <Search className="h-4 w-4 lg:h-5 lg:w-5 text-gray-700 hover:text-[#4fc106] transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar - Glass effect with background image */}
      <div className="flex justify-center py-3 md:py-4 lg:py-5">
        <div className={`transition-all duration-500 rounded-full px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 shadow-lg ${
          isScrolled ? 'bg-white border border-gray-200' : 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-black/10'
        }`}>
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex header-nav">
            <div className="flex items-center space-x-2 lg:space-x-3">
              {navigationItems.map((item, index) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <>
                        <Link
                          to={item.href}
                        className={`flex items-center gap-1 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 rounded-full outline-none focus:outline-none border-0 ${
                          isActivePage(item.href)
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
                        className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200/20 py-2 transition-all duration-100 ${
                          openDropdown === item.name ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                        onMouseEnter={() => setOpenDropdown(item.name)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        {item.dropdown.map((subItem) => (
                          <Link
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
                      <Link
                        to={item.href}
                        onClick={scrollToTop}
                        className={`relative px-3 md:px-4 lg:px-5 py-2 md:py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-150 rounded-full outline-none focus:outline-none border-0 ${
                          isActivePage(item.href)
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
                  size="icon" 
                  className={`rounded-full shadow-lg border transition-all duration-150 ${
                    isScrolled 
                      ? 'bg-gray-100 border-gray-200 hover:bg-gray-200' 
                      : 'bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Menu className={`h-5 w-5 transition-colors duration-150 ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white/95 backdrop-blur-xl border-l border-gray-200/20">
                <div className="flex flex-col space-y-2 mt-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => {
                        setIsOpen(false);
                        scrollToTop();
                      }}
                      className={`text-sm font-medium py-3 px-4 rounded-xl transition-all duration-150 ${
                        isActivePage(item.href)
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