import { Link } from "react-router-dom";
import { MapPin, Phone, Clock, Instagram, Linkedin } from "lucide-react";
import { Logo } from "@/components/Logo";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo variant="light" size="sm" logoSrc="/moni2.png" />
            <p className="text-xs sm:text-sm opacity-90 leading-relaxed">
              Soluções especializadas em segurança do trabalho, saúde ocupacional e meio ambiente.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base md:text-lg">Links Rápidos</h4>
            <ul className="space-y-2">
              <li><Link to="/sobre" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">Sobre</Link></li>
              <li><Link to="/servicos" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">Serviços</Link></li>
              <li><Link to="/clientes" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">Nossos Clientes</Link></li>
              <li><Link to="/contato" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">Fale Conosco</Link></li>
              <li><Link to="/trabalhe-conosco" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity">Trabalhe Conosco</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base md:text-lg">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-2 md:space-x-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mt-0.5 flex-shrink-0" />
                <div className="text-xs sm:text-sm opacity-90">
                  <p>O2 Corporate & Offices</p>
                  <p>Av. José Silva de Azevedo Neto, nº 200</p>
                  <p>Bloco 7 - Loja 205</p>
                  <p>Barra da Tijuca - Rio de Janeiro – RJ</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <Phone className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs sm:text-sm opacity-90">(21) 3881-1212</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3">
                <Clock className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs sm:text-sm opacity-90">Segunda a Sexta, 8h às 17h</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base md:text-lg">Redes Sociais</h4>
            <div className="flex space-x-3 md:space-x-4">
              <a href="https://instagram.com/monitorarconsultoria_" target="_blank" rel="noopener noreferrer" 
                 className="p-1.5 md:p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a href="https://linkedin.com/company/monitorar-consultoria" target="_blank" rel="noopener noreferrer"
                 className="p-1.5 md:p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>
            <div className="pt-2 md:pt-4">
              <Link to="/politica-privacidade" className="text-xs sm:text-sm opacity-90 hover:opacity-100 transition-opacity underline">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm opacity-90">
            © 2025 Monitorar Consultoria. Todos os direitos reservados. | Desenvolvido por Bernardo Tavares.
          </p>
        </div>
      </div>
    </footer>
  );
};