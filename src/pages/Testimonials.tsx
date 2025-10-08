import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
// Imagem de fundo para a seção hero
import testimonialsBg from "/depoimentos.png";

const testimonials = [
  {
    id: 1,
    name: "João Silva",
    position: "CEO | Sócio Fundador",
    company: "ECOLOGIKA Gestão de Resíduos",
    rating: 5,
    content: "A MONITORAR CONSULTORIA tem sido uma excelente parceira para a ECOLOGIKA. Os serviços técnicos solicitados são do mais alto comprometimento e qualidade. Uma das qualidades que eu mais admiro é o serviço personalizado que executa.",
    avatar: "/api/placeholder/60/60"
  },
  {
    id: 2,
    name: "Bruno Rosa",
    position: "Eng. Ambiental e Segurança do Trabalho",
    company: "DRATEC Engenharia",
    rating: 5,
    content: "Equipe da Monitorar sempre nos atende com excelência, realizando um ótimo trabalho. Empresa muito especializada nos serviços de monitoramento ambiental.",
    avatar: "/api/placeholder/60/60"
  },
  {
    id: 3,
    name: "Amanda Ouverney",
    position: "Eng. Ambiental e Segurança do Trabalho",
    company: "Biogênese Engenharia",
    rating: 5,
    content: "Qualidade e compromisso são dois valores fundamentais que fazem a parceria com a MONITORAR CONSULTORIA ser de tanto sucesso. Juntos, conseguimos elevar os padrões de segurança de processos industriais, entregando valor aos nossos clientes.",
    avatar: "/api/placeholder/60/60"
  }
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  // Função para abrir WhatsApp com mensagem personalizada
  const handleConsultorClick = () => {
    const phoneNumber = "5521997521212";
    const message = "Olá! Gostaria de falar com um consultor da Monitorar Consultoria sobre os serviços oferecidos.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen py-20 pt-32 md:pt-36 lg:pt-40">
      <div className="container mx-auto px-4">
        {/* Hero Depoimentos com imagem de fundo */}
        <div className="mb-12 relative rounded-3xl overflow-hidden mt-0 z-0">
          {/* Background image com overlays */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${testimonialsBg})`,
                filter: 'brightness(0.85) contrast(1.2) saturate(1.15)',
                backgroundPosition: 'center ' // Alterado para focar na parte superior da imagem e evitar corte de rostos
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/75 via-emerald-900/60 to-green-800/70" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="text-center py-16 relative">
            {/* Decoração de fundo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-30" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-white/20">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium text-white">Depoimentos</span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
                O que nossos clientes dizem
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Conheça as experiências de <span className="font-semibold text-green-200">empresas parceiras</span> que confiam em nossos 
                <span className="font-semibold text-emerald-300"> serviços especializados</span>
              </p>
              
              {/* Linha decorativa */}
              <div className="flex items-center justify-center mt-8">
                <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <div className="mx-4 w-3.5 h-3.5 rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] ring-2 ring-white/40" />
                <div className="h-[2px] w-40 bg-gradient-to-l from-transparent via-white/80 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="card-service relative">
              <CardContent className="p-8">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <Quote className="h-8 w-8 text-secondary/20" />
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <RatingStars rating={testimonial.rating} />
                </div>

                {/* Content */}
                <blockquote className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.content}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.position}</div>
                    <div className="text-sm font-medium text-secondary">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">
            Resultados que Falam por si
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-success mb-2">95%</div>
              <div className="opacity-90">Taxa de Satisfação</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">500+</div>
              <div className="opacity-90">Projetos Entregues</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">16</div>
              <div className="opacity-90">Anos de Mercado</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">800%</div>
              <div className="opacity-90">Crescimento</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-primary mb-4">
            Quer ser nosso próximo caso de sucesso?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a alcançar os mesmos resultados excepcionais.
          </p>
          <div className="space-x-4">
            <button 
              onClick={handleConsultorClick}
              className="btn-hero bg-[#3f9905] hover:bg-[#368a05] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Fale com um Consultor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}