import {PageIntro,ProjectCTA} from '@/components/PageIntro';
const testimonials = [
  {
    id: 1,
    name: "Washington Conceição",
    position: "CEO | Sócio Fundador",
    company: "ECOLOGIKA Gestão de Resíduos",
    content: "A MONITORAR CONSULTORIA tem sido uma excelente parceira para a ECOLOGIKA. Os serviços técnicos solicitados são do mais alto comprometimento e qualidade. Uma das qualidades que eu mais admiro é o serviço personalizado que executa."
  },
  {
    id: 2,
    name: "Bruno Rosa",
    position: "Eng. Ambiental e Segurança do Trabalho",
    company: "DRATEC Engenharia",
    content: "Equipe da Monitorar sempre nos atende com excelência, realizando um ótimo trabalho. Empresa muito especializada nos serviços de monitoramento ambiental."
  },
  {
    id: 3,
    name: "Amanda Ouverney",
    position: "Eng. Ambiental e Segurança do Trabalho",
    company: "Biogênese Engenharia",
    content: "Qualidade e compromisso são dois valores fundamentais que fazem a parceria com a MONITORAR CONSULTORIA ser de tanto sucesso. Juntos, conseguimos elevar os padrões de segurança de processos industriais, entregando valor aos nossos clientes."
  }
];
export default function Testimonials(){return <><PageIntro eyebrow="Depoimentos" title="O trabalho, na voz de quem esteve conosco."><p>Relatos apresentados por profissionais de organizações que se relacionam com a Monitorar.</p></PageIntro><div className="site-wrap quote-list">{testimonials.map(t=><blockquote key={t.id}><img src={["/clientes/ecologika.jpeg","/clientes/dratec.jpeg","/clientes/biogenese.jpeg"][t.id-1]} alt={t.company} width={160} height={80} loading="lazy" className="quote-company-logo"/><p>“{t.content}”</p><footer><strong>{t.name}</strong>{t.position}<br/>{t.company}</footer></blockquote>)}</div><ProjectCTA/></>}
