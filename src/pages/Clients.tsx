import {PageIntro,ProjectCTA} from '@/components/PageIntro';
const clients = [
  {  
    logo: "/clientes/petrobras.png",
    sector: "Petroquímica"
  },
  { 
    logo: "/clientes/ipiranga.png",
    sector: "Combustíveis"
  },
  { 
    logo: "/clientes/csn.png",
    sector: "Siderurgia"
  },
  { 
    logo: "/clientes/transpetro.png",
    sector: "Logística"
  },
  { 
    logo: "/clientes/firjan.png",
    sector: "Industrial",
    isSpecial: true
  },
  { 
    logo: "/clientes/ream.png",
    sector: "Industrial"
  },
  { 
    logo: "/clientes/rand.png",
    sector: "Equipamentos"
  },
  { 
    logo: "/clientes/iconic.png",
    sector: "Lubrificantes"
  },
  { 
    logo: "/clientes/lubrizol.png",
    sector: "Químicos"
  },
  { 
    logo: "/clientes/nitriflex.png",
    sector: "Borrachas",
  },
  { 
    logo: "/clientes/biogenese.jpeg",
    sector: "Meio Ambiente",
    isSpecial: true
  },
  { 
    logo: "/clientes/dratec.jpeg",
    sector: "Tecnologia"
  },
  { 
    logo: "/clientes/ecologika.jpeg",
    sector: "Meio Ambiente"
  },
  { 
    logo: "/clientes/amspec.png",
    sector: "Industrial"
  },
];
const names:Record<string,string>={petrobras:'Petrobras',ipiranga:'Ipiranga',csn:'CSN',transpetro:'Transpetro',firjan:'Firjan',ream:'Ream',rand:'Rand',iconic:'Iconic',lubrizol:'Lubrizol',nitriflex:'Nitriflex',biogenese:'Biogênese',dratec:'Dratec',ecologika:'Ecologika',amspec:'AmSpec'};
export default function Clients(){return <><PageIntro eyebrow="Clientes" title="Relações que fazem parte da nossa trajetória."><p>Conheça as organizações apresentadas no portfólio institucional da Monitorar.</p></PageIntro><div className="site-wrap logo-grid">{clients.map(c=>{const name=names[c.logo.split('/').pop()!.split('.')[0]];return <figure key={c.logo}><img src={c.logo} alt={name} width="200" height="90" loading="lazy"/><figcaption>{name} · {c.sector}</figcaption></figure>})}</div><ProjectCTA/></>}
