import { Photo } from '@/components/Photo';
import {Trophy,GraduationCap,Users,Heart} from 'lucide-react';
import {PageIntro} from '@/components/PageIntro';
import {CONTACT} from '@/lib/contact';
const benefits = [
  {
    icon: Trophy,
    title: "Crescimento Profissional",
    description: "Oportunidades reais de crescimento em uma empresa em expansão"
  },
  {
    icon: GraduationCap,
    title: "Capacitação Contínua",
    description: "Investimento em treinamentos e certificações especializadas"
  },
  {
    icon: Users,
    title: "Ambiente Colaborativo",
    description: "Equipe unida trabalhando em projetos desafiadores"
  },
  {
    icon: Heart,
    title: "Bem-estar",
    description: "Cuidamos da saúde e qualidade de vida dos nossos colaboradores"
  }
];


const positions = [
  {
    title: "Técnico de Meio Ambiente",
    department: "Meio Ambiente",
    type: "CLT",
    location: "São José dos Campos/SP",
    description: "Seleção de novo colaborador para atuar com inspeções ambientais em campo.",
    requirements: [
      "Conhecimento das normas de segurança",
      "Boa comunicação escrita e verbal",
      "Domínio do Pacote Office",
      "Habilitação categoria B",
      "Experiência com inspeções ambientais em campo",
      "Perfil proativo e colaborativo",
      "Curso técnico em Meio Ambiente"
    ]
  }
];
export default function Careers(){return <><PageIntro eyebrow="Trabalhe conosco" title="Conhecimento técnico se constrói em equipe."><p>Apresente sua experiência e seu interesse em trabalhar com meio ambiente e segurança do trabalho.</p></PageIntro><section className="site-wrap section-space"><h2>Por que trabalhar conosco?</h2><div className="v4-benefits">{benefits.map(b=><div key={b.title}><h3>{b.title}</h3><p>{b.description}</p></div>)}</div><div className="v4-team-gallery">{['/equipe/equipe1.JPG','/equipe/equipe2.jpeg','/equipe/equipe6.jpeg'].map((src,i)=><Photo src={src} key={src} alt={'Equipe Monitorar, registro '+(i+1)} width={1280} height={960} loading="lazy"/>)}</div></section><div className="site-wrap prose-content"><Photo src="/equipe/equipe6.jpeg" alt="Registro da equipe Monitorar" width={1280} height={960} loading="lazy" className="section-photo"/><h2>Converse sobre oportunidades</h2><p>Consulte a disponibilidade atual antes de enviar sua candidatura. A descrição abaixo informa o perfil profissional apresentado pela empresa e não confirma uma seleção aberta neste momento.</p>{positions.map(p=><section key={p.title}><h3>{p.title}</h3><p>{p.department} · {p.location} · Modalidade informada: {p.type}</p><p>Perfil para atuação com inspeções ambientais em campo.</p><ul>{p.requirements.map(r=><li key={r}>{r}</li>)}</ul></section>)}<h2>Como entrar em contato</h2><p>Informe a área de interesse e um resumo da sua formação. Não envie documentos sensíveis no primeiro contato.</p><a className="button" href={'mailto:'+CONTACT.email}>Consultar oportunidades por e-mail ↗</a><p>Veja também nossa <a href="/politica-privacidade">política de privacidade</a>.</p></div></>}
