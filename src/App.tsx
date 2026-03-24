import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Componente para rolar para o topo em cada mudança de rota
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Rolar para o topo em cada mudança de localização
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/sobre/historia" element={<About />} />
              <Route path="/sobre/missao" element={<About />} />
              <Route path="/sobre/equipe" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              <Route path="/servicos/seguranca" element={<Services />} />
              <Route path="/servicos/hazop" element={<Services />} />
              <Route path="/servicos/auditorias" element={<Services />} />
              <Route path="/servicos/treinamentos" element={<Services />} />
              <Route path="/servicos/meio-ambiente" element={<Services />} />
              <Route path="/servicos/drager" element={<Services />} />
              <Route path="/clientes" element={<Clients />} />
              <Route path="/depoimentos" element={<Testimonials />} />
              <Route path="/trabalhe-conosco" element={<Careers />} />
              <Route path="/contato" element={<Contact />} />
              <Route path="/politica-privacidade" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
