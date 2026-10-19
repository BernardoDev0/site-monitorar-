// Client logos shown in the home carousel and, as a static strip, on the landing pages. width and height are the pixel sizes of the files in public/clientes.
export type ClientLogo = { src: string; alt: string; width: number; height: number; className?: string };

export const clientsLogos: ClientLogo[] = [
  { src: "/clientes/petrobras.png", alt: "Petrobras", width: 117, height: 69 },
  { src: "/clientes/transpetro.png", alt: "Transpetro", width: 145, height: 76 },
  { src: "/clientes/csn.png", alt: "CSN", width: 212, height: 89 },
  { src: "/clientes/ream.png", alt: "REAM", width: 184, height: 53 },
  { src: "/clientes/ipiranga.png", alt: "Ipiranga", width: 283, height: 98 },
  { src: "/clientes/lubrizol.png", alt: "Lubrizol", width: 175, height: 53 },
  { src: "/clientes/firjan.png", alt: "FIRJAN", width: 146, height: 66, className: "md:h-16 h-14" },

  { src: "/clientes/nitriflex.png", alt: "Nitriflex", width: 184, height: 49, className: "md:h-16 h-14 object-contain opacity-80 hover:opacity-100 transition-opacity" },
  { src: "/clientes/iconic.png", alt: "Iconic", width: 225, height: 79 },
  { src: "/clientes/rand.png", alt: "RAND", width: 227, height: 65 },
  { src: "/clientes/biogenese.jpeg", alt: "Biogenese", width: 203, height: 142, className: "md:h-16 h-14" },
  { src: "/clientes/dratec.jpeg", alt: "Dratec", width: 199, height: 73, className: "md:h-16 h-14" },
  { src: "/clientes/ecologika.jpeg", alt: "Ecologika", width: 199, height: 70, className: "md:h-16 h-14" },
];
