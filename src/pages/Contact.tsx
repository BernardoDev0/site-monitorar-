import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AnimatedText } from "@/components/AnimatedText";
// Imagem de fundo para a seção de contato
import contactBg from "/faleconosco.png";

const serviceAreas = [
  "Meio Ambiente",
  "Segurança do Trabalho",
  "Equipamentos Dräger",
  "Treinamentos",
  "Consultoria Geral",
  "Outros"
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    activity: "",
    interest: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Formatar dados para WhatsApp
    const formatarMensagemWhatsApp = () => {
      let mensagem = `🏢 *NOVO CONTATO - SITE MONITORAR*\n\n`;
      mensagem += `👤 *Nome:* ${formData.name}\n`;
      mensagem += `📞 *Telefone:* ${formData.phone}\n`;
      mensagem += `📧 *E-mail:* ${formData.email}\n`;
      
      if (formData.company) {
        mensagem += `🏭 *Empresa:* ${formData.company}\n`;
      }
      
      if (formData.activity) {
        mensagem += `⚙️ *Atividade:* ${formData.activity}\n`;
      }
      
      if (formData.interest) {
        mensagem += `🎯 *Área de Interesse:* ${formData.interest}\n`;
      }
      
      if (formData.message) {
        mensagem += `\n💬 *Mensagem:*\n${formData.message}`;
      }
      
      return mensagem;
    };

    // Enviar via WhatsApp
    const phoneNumber = "5521997521212";
    const mensagemFormatada = formatarMensagemWhatsApp();
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensagemFormatada)}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp!",
      description: "Seus dados foram formatados e serão enviados via WhatsApp.",
    });

    // Reset form após um pequeno delay
    setTimeout(() => {
      setFormData({
        name: "",
        phone: "",
        email: "",
        company: "",
        activity: "",
        interest: "",
        message: ""
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 pt-32 md:pt-36 lg:pt-40">
      {/* Background elegante e minimalista */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f8fafc_1px,transparent_1px),linear-gradient(to_bottom,#f8fafc_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Fale Conosco com imagem de fundo */}
        <div className="mb-12 relative rounded-3xl overflow-hidden mt-0 z-0">
          {/* Background image com overlays */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
              style={{
                backgroundImage: `url(${contactBg})`,
                filter: 'brightness(0.85) contrast(1.2) saturate(1.15)'
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
                <span className="text-sm font-medium text-white">Entre em Contato</span>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md">
                Fale conosco
              </h1>
              
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow">
                Entre em contato e descubra como podemos <span className="font-semibold text-green-200">transformar sua empresa</span> com nossas 
                <span className="font-semibold text-emerald-300"> soluções especializadas</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form - Cor Verde Uniforme */}
          <Card className="card-service">
            {/* Header verde uniforme */}
            <div className="bg-secondary p-8 relative rounded-t-xl">
              <CardTitle className="text-2xl font-semibold text-white mb-3">Solicite um Orçamento</CardTitle>
              <p className="text-white/90">Preencha o formulário e nossa equipe entrará em contato</p>
              <div className="absolute bottom-0 left-8 w-12 h-px bg-white/30" />
            </div>
              
              <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="activity">Atividade da Empresa</Label>
                  <Input
                    id="activity"
                    value={formData.activity}
                    onChange={(e) => handleInputChange("activity", e.target.value)}
                    placeholder="Ramo de atuação da empresa"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest">Área de Interesse</Label>
                  <Select value={formData.interest} onValueChange={(value) => handleInputChange("interest", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a área de interesse" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Conte-nos mais sobre suas necessidades..."
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
                  <Phone className="h-5 w-5" />
                  Enviar via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information - Padrão do Site */}
          <div className="space-y-8">
            <Card className="card-service">
              {/* Header com cor sólida suave */}
              <div className="bg-secondary p-8 border-b border-green-100 relative rounded-t-xl">
                <CardTitle className="text-2xl font-semibold text-white mb-3">Informações de Contato</CardTitle>
                <p className="text-white/90">Entre em contato através dos canais abaixo</p>
                <div className="absolute bottom-0 left-8 w-12 h-px bg-white/30" />
              </div>
                
              <CardContent className="p-8 space-y-6">
                <div className="flex items-start space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Endereço</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      O2 Corporate & Offices<br />
                      Av. José Silva de Azevedo Neto, nº 200<br />
                      Bloco 7 - Loja 205<br />
                      Barra da Tijuca - Rio de Janeiro – RJ
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Telefone</h3>
                    <p className="text-muted-foreground text-lg">(21) 3881-1212</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">E-mail</h3>
                    <p className="text-muted-foreground">administrativo@monitorarconsultoria.com.br</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 py-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">Segunda a Sexta, 8h às 17h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Map Placeholder - Verde Uniforme */}
            <Card className="card-service">
              <CardContent className="p-0">
                <div className="bg-green-50 h-64 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center mx-auto mb-4">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-muted-foreground font-medium">Nossa Localização</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Barra da Tijuca</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estamos estrategicamente localizados na <span className="font-semibold text-secondary">Barra da Tijuca</span>, 
                    facilitando o acesso e atendimento aos nossos clientes em todo o Rio de Janeiro.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}