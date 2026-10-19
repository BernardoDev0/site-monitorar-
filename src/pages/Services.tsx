import { Photo } from '@/components/Photo';
import {useLocation} from 'react-router-dom';
import {Wind,MapPin,Volume2,FileText,Users,AlertTriangle,Search,GraduationCap} from 'lucide-react';
import {PageIntro,ProjectCTA} from '@/components/PageIntro';
const environmentalServices = [
  {
    title: "Qualidade do Ar",
    icon: Wind,
    description: "Monitoramento e avaliação da qualidade do ar em ambientes industriais e urbanos.",
    fullDescription: "Desenvolvemos soluções sustentáveis para proteger e melhorar o meio ambiente através de auditoria e certificação ambiental, qualidade do ar, avaliação geoambiental, monitoramento de efluentes e licenciamento. Nossos métodos reconhecidos garantem conformidade com as normas ambientais e proteção da saúde pública. Incluímos serviços de LDAR (Leak Detection and Repair), monitoramento de PTS (Partículas Totais em Suspensão), PROCON Fumaça Preta e outras avaliações essenciais para a gestão da qualidade do ar."
  },
  {
    title: "Áreas Impactadas",
    icon: MapPin, 
    description: "Investigação e remediação de áreas contaminadas conforme legislação ambiental.",
    fullDescription: "Processo essencial para entender condições de solo e água: coleta e análise de amostras, identificação de contaminantes e compreensão das características geológicas. Fundamenta planos de mitigação, remediação e prevenção de danos. Também protege a saúde pública e viabiliza uso sustentável do solo e da água. Realizamos investigação confirmatória, investigação detalhada, análise de risco e planos de remediação completos."
  },
  {
    title: "Avaliação de Ruído Extramuros",
    icon: Volume2,
    description: "Medição e análise de ruído para atendimento às normas ambientais.",
    fullDescription: "Monitoramento e análise do nível de ruído que ultrapassa os limites de uma instalação, avaliando impacto em áreas adjacentes e conformidade com normas. Utilizamos monitoramento contínuo ou pontual com sonômetros, modelagem acústica através de softwares especializados e análise estatística completa. Nossos serviços incluem medições acústicas, relatórios técnicos detalhados, adequação às normas e monitoramento contínuo."
  },
  {
    title: "Licenciamento Ambiental",
    icon: FileText,
    description: "Assessoria completa para obtenção de licenças ambientais.",
    fullDescription: "Realizamos o licenciamento junto aos órgãos ambientais, avaliando a viabilidade ambiental de empreendimentos e atividades para controle preventivo, proteção do meio ambiente, garantia do desenvolvimento sustentável e cumprimento legal. Oferecemos Licença Prévia (LP), Licença de Instalação (LI), Licença de Operação (LO) e renovações. Nosso processo inclui requerimento e análise técnica, consulta pública e decisão, monitoramento e fiscalização contínua."
  }
];

const safetyServices = [
  {
    title: "Gestão de SMS",
    icon: Users,
    description: "Implantação e gestão de sistemas de Segurança, Meio Ambiente e Saúde.",
    fullDescription: "Fiscalização da documentação legal de segurança do trabalho para indústrias: essencial para proteger a saúde e integridade dos trabalhadores, prevenir acidentes e garantir conformidade. Incluímos planejamento da fiscalização, identificação dos documentos necessários, visita técnica à instalação, verificação de conformidade e coerência, orientação, educação e relatórios, acompanhamento e reavaliação. Desenvolvemos política SMS, procedimentos, indicadores e auditoria interna."
  },
  {
    title: "HAZOP",
    icon: AlertTriangle,
    description: "Análise de Operabilidade e Perigos (Hazard and Operability Study).",
    fullDescription: "Análise sistemática e estruturada para identificar perigos potenciais e problemas de operabilidade em processos industriais. Utilizamos metodologia reconhecida internacionalmente para análise de riscos, identificação de cenários de falha, avaliação de consequências e desenvolvimento de medidas preventivas. Nossos serviços incluem identificação de perigos, análise de riscos detalhada, relatório HAZOP completo e plano de ação para mitigação de riscos."
  },
  // Higiene Ocupacional removido conforme solicitação
  {
    title: "Auditorias",
    icon: Search,
    description: "Auditorias em sistemas de gestão e conformidade legal.",
    fullDescription: "Auditorias especializadas em sistemas de gestão e conformidade legal para garantir que sua empresa atenda aos mais altos padrões de segurança, meio ambiente e saúde ocupacional. Nossos serviços incluem auditoria legal completa, avaliação de sistema de gestão, verificação de conformidade com normas e regulamentações, e elaboração de relatórios detalhados com recomendações de melhoria."
  },
  {
    title: "Treinamentos",
    icon: GraduationCap,
    description: "Capacitação técnica especializada para equipes operacionais.",
    fullDescription: "Capacitação técnica especializada para equipes operacionais com foco em segurança do trabalho. Oferecemos treinamentos em NR-33 (Espaços Confinados), NR-35 (Trabalho em Altura), e outras normas regulamentadoras. Nossos programas incluem treinamentos práticos, simulações de situações de risco, capacitação em uso de equipamentos de proteção individual e coletiva, e desenvolvimento de competências para identificação e prevenção de acidentes."
  }
];


const images=['qualidade-ar','areas-impactadas','avaliacao-ruido','licenciamento','gestao-sms','hazop','auditorias','treinamentos'];
export default function Services(){
 const {pathname}=useLocation();const safety=/seguranca|hazop|auditorias|treinamentos/.test(pathname),drager=pathname.endsWith('/drager');
 const items=safety?safetyServices:environmentalServices;
 return <><PageIntro eyebrow="Serviços" title={drager?"Equipamentos Dräger":safety?"Serviços de segurança do trabalho":"Serviços de engenharia e consultoria ambiental"}><p>Soluções completas em segurança do trabalho e meio ambiente. Consultoria com sede no Rio de Janeiro e atendimento a projetos conforme o escopo.</p></PageIntro><div className="site-wrap"><nav className="subnav" aria-label="Áreas de atuação"><a href="/servicos" aria-current={!safety&&!drager?'page':undefined}>Meio Ambiente</a><a href="/servicos/seguranca" aria-current={safety?'page':undefined}>Segurança do Trabalho</a><a href="/servicos/drager" aria-current={drager?'page':undefined}>Representação Dräger</a></nav>
 {drager?<section className="v4-drager"><Photo src="/epis.png" alt="Equipamentos do acervo institucional" width={1704} height={1026} loading="lazy" className="section-photo"/><h2>Representação Dräger</h2><p>Como representantes oficiais da Dräger, oferecemos equipamentos de última geração para detecção de gases e proteção respiratória.</p><ul>{['Detectores de Gases','Equipamentos de Proteção','Calibração','Manutenção'].map(t=><li key={t}>{t}</li>)}</ul><a className="button" href="/drager-catalogo.pdf" target="_blank" rel="noopener noreferrer">Conheça os Equipamentos Dräger</a></section>:<section className="v4-services"><h2>{safety?'Segurança do Trabalho':'Meio Ambiente'}</h2>{!safety&&<p>Ajudamos empresas a cumprir regulamentos ambientais, reduzir impactos negativos e promover a sustentabilidade, com planos de ação e práticas corretas. Atendemos qualquer estado, com atuação principal no RJ, em SP e no Amazonas: conheça a consultoria ambiental da Monitorar <a className="text-link" href="/consultoria-ambiental-rj">no Rio de Janeiro</a>, <a className="text-link" href="/consultoria-ambiental-sp">em São Paulo</a>, <a className="text-link" href="/consultoria-ambiental-am">no Amazonas</a> e <a className="text-link" href="/consultoria-ambiental-por-estado">por estado ↗</a>. Leia também o <a className="text-link" href="/consultoria-ambiental">guia de consultoria ambiental ↗</a></p>}{items.map((item,i)=><article id={safety?['sms','hazop','auditorias','treinamentos'][i]:['qualidade-ar','areas-impactadas','ruido','licenciamento'][i]} key={item.title} className="v4-service-detail"><Photo className="v4-page-photo" src={'/servicos/'+images[i+(safety?4:0)]+'.jpg'} alt={item.title} width={800} height={800} loading="lazy"/><div><h3>{item.title}</h3><p>{item.description}</p><p>{item.fullDescription}</p>{!safety&&i===0&&<p className="service-detail-links"><a href="/servicos/emissoes-fugitivas">Monitoramento de emissões fugitivas e LDAR ↗</a><a href="/conteudos/qualidade-do-ar">Artigos sobre qualidade do ar, PTS e Fumaça Preta ↗</a><a href="/emissoes-fugitivas">Guia de emissões fugitivas e LDAR ↗</a></p>}
{!safety&&i===1&&<p><a className="text-link" href="/conteudos/areas-impactadas">Avaliação geoambiental e investigação ambiental ↗</a></p>}
{!safety&&i===2&&<p><a className="text-link" href="/servicos/ruido-extramuros">Conhecer o serviço de ruído extramuros ↗</a></p>}
{!safety&&i===3&&<p><a className="text-link" href="/conteudos/licenciamento-ambiental">Licenciamento ambiental, licenças e condicionantes ↗</a></p>}
{safety&&<p><a className="text-link" href={['/conteudos/seguranca-de-processos-e-gestao-sms','/servicos/hazop','/conteudos/seguranca-de-processos-e-gestao-sms','/conteudos/treinamentos'][i]}>Conheça orientações sobre {item.title} ↗</a></p>}
<a className="text-link" href="/contato">Conversar sobre {item.title.toLocaleLowerCase('pt-BR')} ↗</a></div></article>)}</section>}</div><ProjectCTA/></>;
}
