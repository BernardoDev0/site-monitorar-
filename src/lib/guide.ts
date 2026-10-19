// Shape of content/*-guia.json, rendered by components/Guide.tsx. Text may carry [[label|url]] links and **bold**.
export type GuideTable = { caption: string; headers: string[]; rows: string[][] };

export type GuideSectionData = {
  id: string;
  heading: string;
  paragraphs: string[];
  items?: string[];
  table?: GuideTable;
  services?: boolean;
  clients?: boolean;
  after?: string[];
};

export type GuideData = {
  path: string;
  eyebrow: string;
  title: string;
  headline: string;
  published: string;
  updated: string;
  intro: string;
  sections: GuideSectionData[];
  summary?: { heading: string; items: string[] };
  figure?: { src: string; alt: string; caption: string; width: number; height: number };
  glossary?: { id: string; heading: string; terms: [string, string][] };
  clusters?: { heading: string; intro: string; groups: { heading: string; links: [string, string][] }[] };
  company?: { heading: string; paragraphs: string[] };
  faq: { q: string; a: string }[];
  sources: [string, string][];
  disclaimer: string;
};
