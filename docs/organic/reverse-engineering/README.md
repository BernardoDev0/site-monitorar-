# Engenharia reversa da página 1 do Google — 20/10/2026

Pedido do dono (6 etapas): mapear quem está na página 1 para **emissões fugitivas**, **consultoria ambiental**, **consultoria ambiental RJ** e **empresa de engenharia ambiental**, baixar robots.txt, sitemaps, HTML e JSON-LD dos líderes e comparar com o nosso. Este arquivo cobre as Etapas 1 a 4. A Etapa 5 está em `canibalizacao.md` e `hub-spoke.md`.

## Como foi medido

- **Google:** 4 consultas em 20/10, das 12:02 às 12:07 UTC, com `python scripts/google-serp.py "<termo>" --mode peek` (o Chrome dedicado da porta 9223, `peek_pws=0`). O rodapé confirmou "Os resultados não são personalizados" nas 4. Sem captcha. Os JSON estão em `serp/`.
- **Limite da leitura:** o Google não personaliza pela conta, mas localiza pelo IP, que é do Rio de Janeiro. Por isso o diretório oHub aparece com a página do RJ até no termo sem cidade. Uma leitura de São Paulo pode ser outra. As posições também oscilam: em 19/10 "emissões fugitivas" passou do 8º lugar para a 2ª página em 20 minutos.
- **Arquivos dos concorrentes:** `scripts/serp_reverse_engineer.py fetch` baixou o robots.txt, os sitemaps (até 10 filhos e 5.000 URLs por domínio) e o HTML da URL que ranqueia. Foi 1 requisição por segundo por host, respeitando o robots. Os brutos ficam fora do repositório, em `%TEMP%\competitors_seo`. São dados não confiáveis, lidos só com `python -I`.
- **Relatórios gerados:** `analyze` gerou `robots-sitemaps.md`/`.csv` e `on-page-schema.md`/`.json`. A classe de cada domínio está em `classes.json`.
- **Não lidos:** ebp.global respondeu 403 à página e ao sitemap; start5g.com.br não respondeu. A página da Thermo Fisher está em inglês, e o título em português da SERP é tradução do Google.

## Etapa 1: ferramentas

- **Instaladas** num ambiente isolado `.venv-seo` (versões em `scripts/requirements-seo.txt`): advertools, trafilatura, extruct, beautifulsoup4, lxml, requests e playwright.
- **Não instaladas:**
  - ultimate-sitemap-parser: o script já percorre índices de sitemap;
  - python-seo-analyzer: redundante com o script.
- **A avaliação de ferramentas do GitHub de 19/10** está em `docs/organic/skills-lock.md`. Os rastreadores pagos ou legados foram rejeitados. A Indexing API do Google não é usada, porque só vale para vagas e transmissões ao vivo.
- **Skills e MCPs disponíveis:**
  - `.agents/skills/`: seo-audit, schema, ai-seo e link-building (mais accessibility e public-relations);
  - MCP chrome-devtools: Lighthouse e leitura do JSON-LD injetado por JavaScript;
  - o Chrome dedicado da porta 9223, com o Search Console e a leitura do Google.
  - Não há API de SERP paga.
- **Scripts novos:**
  - `scripts/serp_reverse_engineer.py`, com os comandos `selftest`, `fetch` e `analyze`;
  - `scripts/google-serp.py`, que agora grava `results` (a URL completa de todos os orgânicos) e tem o modo `--mode peek`.

## Etapa 2: quem está na página 1

Classes:
- **direto:** empresa de consultoria ou engenharia ambiental;
- **diretório:** oHub;
- **referência:** Wikipedia, universidade, governo;
- **marca:** fabricante ou software;
- **mídia.**

| Pos. | emissões fugitivas | consultoria ambiental | consultoria ambiental RJ | empresa de engenharia ambiental |
|---|---|---|---|---|
| 1 | Thermo Fisher, artigo (marca) | oHub, lista do RJ (diretório) | oHub, lista do RJ (diretório) | ambientalconsult.com.br, Home |
| 2 | blog.alutal.com.br, artigo (marca) | **Monitorar** `/consultoria-ambiental-rj` | rioambiental.com.br, Home | rioambiental.com.br, Home |
| 3 | Wikipedia (referência) | rioambiental.com.br, Home | ambientalconsult.com.br, Home | masterplan.eng.br, Home |
| 4 | WIKA (marca) | ambientalconsult.com.br, Home | etica-ambiental.com.br, Home | eea.eng.br `/quem-somos` |
| 5 | Persefoni (marca) | masterplan.eng.br, Home | **Monitorar** `/consultoria-ambiental-rj` | weberambiental.com.br, Home |
| 6 | monografia UFMG (referência) | etica-ambiental.com.br, Home | evaway.com.br `/atuacao-nacional/rio-de-janeiro` | reservaeng.com.br, Home |
| 7 | start5g.com.br (mídia) | consultoriagpr.com.br, Home | masterplan.eng.br, Home | ebp.global `/br-pt` |
| 8 | gov.br/ANP, estudo (referência) | metricaambiental.com.br, Home | sagriambiental.com.br `/local/…/sao-joao-de-meriti/…` | ambientobrasil.com.br, Home |
| 9 | — | — | metricaambiental.com.br, Home | orionambiental.com.br, Home |

**Leitura:**
- **Monitorar:**
  - 2º em "consultoria ambiental" e 5º em "consultoria ambiental RJ", nos dois casos com `/consultoria-ambiental-rj`. Os dois são de 20/10, sem personalização e com IP do RJ.
  - Ausente em "emissões fugitivas" e em "empresa de engenharia ambiental".
  - A nossa página RJ aparece com o título reescrito pelo Google para o H1 dela: "Consultoria e engenharia ambiental no Rio de Janeiro".
- **"emissões fugitivas":** a página 1 não tem nenhuma consultoria. É toda informacional: fabricantes, enciclopédia, universidade e governo. O nosso candidato é o guia `/emissoes-fugitivas`, que está "Detectada, mas não indexada" no Search Console.
- **Termos comerciais:** quem ranqueia é a Home da empresa. As exceções são o diretório e duas páginas de cidade/estado: evaway `/atuacao-nacional/<estado>`, com 144 URLs desse tipo, e sagri `/local/<cidade>`. As duas são páginas de entrada por local, que não copiamos.

**Concorrentes diretos que estão na nossa frente:**
- rioambiental.com.br, ambientalconsult.com.br e etica-ambiental.com.br nos termos de consultoria;
- ambientalconsult.com.br, rioambiental.com.br, masterplan.eng.br, eea.eng.br, weberambiental.com.br e reservaeng.com.br em "empresa de engenharia ambiental".

## Etapa 3: robots.txt e sitemaps

A tabela completa está em `robots-sitemaps.md`. Respostas às 4 perguntas do pedido:

**1. Como separam páginas comerciais de artigos?**
- **Separação feita pelo CMS:**
  - os sites WordPress com Yoast ou Rank Math (ambientobrasil, consultoriagpr, reservaeng, alutal) têm `sitemap_index.xml` com `page-sitemap`, `post-sitemap`, `category-sitemap` etc.;
  - os sites WordPress sem plugin (ambientalconsult, masterplan, weber, orion) têm `wp-sitemap.xml` com `posts-page`, `posts-post` e taxonomias.
- **A separação é o padrão do CMS, não uma escolha que dê posição.** O site que mais aparece nos termos de consultoria, rioambiental.com.br, tem um único `sitemap.xml` com **6 URLs**. A metricaambiental (Wix) tem 11.
- **Nós:** um único sitemap com 127 URLs. A Task 5 separa em page/post/category, como pedido. Para o Google, a diferença é organizacional: o relatório do Search Console passa a mostrar a cobertura por grupo.

**2. O que bloqueiam no robots.txt para "economizar crawl budget"?**
- **Nada nesse sentido.** Bloqueiam só o painel do CMS (`/wp-admin/`, `/admrio/`, `/admin/`), o envio do formulário (`/processa-contato.php`, `/contato-sucesso/`), `/author/` e cache.
- **Erros dos próprios líderes:**
  - o oHub declara `Sitemap: …/sitemap.xmls` (com erro de digitação, responde 404);
  - a Ética declara um `sitemap_index.xml` que responde 404;
  - a EBP responde 403 ao sitemap.
- **Por que não há o que economizar:** pela documentação do Google, o orçamento de rastreamento só pesa acima de ~10 mil páginas com mudança diária, ou de 1 milhão. Os concorrentes diretos têm de 6 a 463 URLs, e nós 127. Também não temos painel nem busca com URLs infinitas para bloquear. Por isso a Task 4 só simplifica o arquivo para um grupo.

**3. Como usam `<lastmod>`, `<priority>` e `<changefreq>`?**
- **Yoast, Rank Math e Wix:** `lastmod` em 100% das URLs, sem `priority` nem `changefreq`.
- **WordPress sem plugin:** `lastmod` em 75–88%.
- **Os sitemaps feitos à mão:**
  - rioambiental: `priority` em 100% e `lastmod` em 17%;
  - evaway: `priority` e `changefreq` em 100% e nenhum `lastmod`;
  - sagri: `priority` em 100%.
- O Google ignora `priority` e `changefreq` e usa o `lastmod` quando ele é confiável.
- **Nós:** `lastmod` em 100%, com a data real da última mudança (conferida contra o git por teste), e sem `priority`/`changefreq`. É o mesmo modelo do Yoast.

**4. Estrutura de URL?**

| Site | URLs |
|---|---|
| rioambiental | 6 URLs: `/`, `/empresa`, um único `/servicos` para todos os serviços, `/contato`, `/blog` e 1 post |
| reservaeng | `/servicos/<serviço>` (8) |
| consultoriagpr | `/consultoria-ambiental/<serviço>` (15) |
| evaway | `/servicos/`, `/setores/`, `/solucoes/` e 144 `/atuacao-nacional/<local>` |
| weber | 244 URLs de `/tag/` no sitemap |
| **nós** | `/servicos/<serviço>`, `/blog/<artigo>`, `/conteudos/<tema>` e os pilares na raiz (`/emissoes-fugitivas`, `/consultoria-ambiental`, `/consultoria-ambiental-rj`) |

A nossa estrutura já separa os tipos. Mudar URLs 2 dias depois do lançamento zeraria os sinais, por isso não há migração.

## Etapa 4: HTML e Schema das páginas que ranqueiam

A tabela por termo, com title, meta, H1/H2, palavras, densidade e os termos dos H2/H3 que faltam no nosso pilar, está em `on-page-schema.md`. O JSON-LD bruto está em `on-page-schema.json`.

**Termos comerciais (top 3 diretos): Homes curtas e Schema mínimo.**

| Página | Palavras | H1 | Termo no title | JSON-LD |
|---|---|---|---|---|
| rioambiental.com.br | 728 | 1 | não ("Engenharia e Assessoria Ambiental no Rio de Janeiro") | só `LocalBusiness` |
| ambientalconsult.com.br | 103 | **5** | não | **nenhum** |
| masterplan.eng.br | 157 | **0** | não | **nenhum** |
| etica-ambiental.com.br | 58 | 1 | sim | Yoast `WebSite`/`WebPage` |

- **ambientalconsult:** a meta description tem 271 caracteres, quebrada (texto da página colado).
- **O LocalBusiness da Rio Ambiental:**
  - tem `name`, `image`, `url`, `telephone`, `email`, `address` (rua, bairro, cidade, UF, CEP), `areaServed: "Estado do Rio de Janeiro"` e `sameAs` (Facebook, Instagram, LinkedIn);
  - não tem `geo`, horário, avaliações nem `Service`.
- **Densidade não explica a posição:** a Rio Ambiental tem **0** ocorrências de "consultoria ambiental" e está em 2º–3º.
- **Nosso pilar RJ:** 705 palavras, 1 H1, 8 H2, "consultoria ambiental" 8 vezes. JSON-LD só com `Organization` e `WebSite`.

**"emissões fugitivas": artigos longos com o grafo do Yoast.**

| Página | Palavras | H2 | Termo (vezes, por 1.000) | Title / H1 / URL / 100 primeiras | JSON-LD |
|---|---|---|---|---|---|
| Alutal (2º) | 1.178 | 15 | 17, 14,4 | sim / sim / sim / sim | Article, WebPage, BreadcrumbList, Organization, Person, ImageObject |
| Wikipedia (3º) | 86 | 3 | 1 | não / não / não / sim | Article |
| **nosso guia** | 2.662 | 17 | 23, 8,6 | sim / sim / sim / sim | Organization, WebSite, Article, BreadcrumbList, FAQPage |

O guia já supera o 2º colocado em tudo o que se mede no HTML. O que falta é **estar indexado** (hoje "Detectada, mas não indexada") e ter autoridade.

**Schema que aparece nos líderes:**
- `LocalBusiness`: Rio Ambiental, sagri e evaway;
- `Service`, `FAQPage` e `BreadcrumbList`: evaway, nas páginas por estado;
- o grafo `WebPage`/`Article`/`BreadcrumbList`/`Organization`: Yoast e Rank Math.
- **Nenhum** usa `EnvironmentalOrganization`, que não existe no schema.org, nem `ProfessionalService`, que foi descontinuado.

**O que entra no nosso site (Task 6):**
- o `LocalBusiness` com o endereço que a Rio Ambiental usa, mais `geo` e CEP verificados;
- o grafo `WebPage`/`BreadcrumbList` ligado por `@id`, como o do Yoast;
- `Service` nas páginas de estado e no serviço de LDAR.

## Conclusão das Etapas 2–4

**A parte técnica dos líderes é igual ou pior que a nossa:**
- sitemap de 6 URLs;
- sitemap declarado que responde 404;
- Home sem H1 ou com 5 H1;
- nenhum JSON-LD.

**O que os líderes têm e não se copia:**
- anos de histórico no índice;
- links;
- Perfil no Maps;
- reconhecimento da marca.

**Onde estamos:**
- Nos termos de consultoria já estamos na página 1 com a página RJ, por isso a Task 9 não mexe no H1 nem no título dela.
- Em "emissões fugitivas" o bloqueio é a indexação do guia.
- Em "empresa de engenharia ambiental" a Home precisa mirar a frase (Task 9) e ganhar autoridade (kit do dono em `docs/organic/owner-actions.md`).

## Publicação (20/10, 13:05 UTC)

A Etapa 6 foi implementada e publicada (commits `4e5fca9`..`63f60b3`, deploy de produção pela Vercel). O que mudou e por quê está no `REPORT.md` de `docs/organic/google-first-page/`.

**Evidências** (em `evidence/`):
- `check-live.json`: 137 verificações, 0 falhas;
- `audit-local.json`: 126 URLs e 89 artigos, sem problemas;
- `gsc-requests-2026-10-20.json`: cota de inspeção esgotada;
- `brave-refetch-2026-10-20.json`: 4 aceitos.

**Próxima medida:** as 4 frases uma vez por semana, com `google-serp.py --mode peek` (ver `LOOP.md`).

