import { ServiceCard } from "@/components/ServiceCard";

const imgIQAR = "/pessoas/Picture12.jpg";
const imgLDAR = "/pessoas/Picture13.jpg";
const imgEM = "/pessoas/Picture14.jpg";

const services = [
  {
    title: "Monitoramento Ambiental",
    image: imgEM,
    description: "Medição e análise de poluição sonora extramuros para atendimento às normas.",
    fullDescription: "Executamos monitoramento ambiental de ruído em áreas externas às instalações (extramuros), avaliando a poluição sonora e seu impacto em vizinhanças. Utilizamos sonômetros calibrados, campanhas pontuais ou contínuas, elaboração de mapas/curvas acústicas e emitimos relatórios técnicos para comprovar conformidade com normas aplicáveis (ex.: ABNT NBR 10151)."
  },
  {
    title: "LDAR",
    image: imgIQAR,
    description: "Programa de detecção e reparo de vazamentos para redução de emissões fugitivas.",
    fullDescription: "O programa LDAR (Leak Detection and Repair) e SMART LDAR é um sistema focado na detecção e reparo de vazamentos em indústrias que lidam com gases e líquidos, utilizando tecnologias avançadas e equipamentos como câmeras (OGI) e analisadores (TVA, PHOCHECK) para identificar vazamentos de compostos orgânicos voláteis (VOCs) e outros poluentes. A detecção precoce é crucial para minimizar a emissão de poluentes. Este processo também ajuda a evitar perdas financeiras, multas regulatórias e promove maior eficiência da planta, redução de custos com matéria-prima e seguros de sinistro industrial, resultando em operações mais sustentáveis e confiáveis."
  },
  {
    title: "Emissões",
    image: imgLDAR,
    description: "Determinação de emissão de poluentes por amostragens isocinéticas ou métodos contínuos.",
    fullDescription: "Realizamos monitoramento de PTS (Partículas Totais em Suspensão) através da medição da concentração de partículas sólidas e líquidas em suspensão no ar ambiente. Essencial para a gestão da qualidade do ar, fiscalizado por INEA e demais órgãos. Utilizamos métodos como gravimetria, monitores contínuos de PTS, análise química e de tamanho de partículas. Também oferecemos serviços de PROCON Fumaça Preta - INEA para monitorar e controlar a emissão de fumaça preta em veículos ciclo diesel, exigida pelo CONAMA."
  }
];

export function OfferingsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center">O que oferecemos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              image={service.image}
              description={service.description}
              fullDescription={service.fullDescription}
              delayMs={i * 80}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


