# Contrato visual e funcional V3

## Composição

Header 84 px desktop / 72 px mobile, fixo, fundo claro; menu compacto abaixo de 1280 px. Hero 620 px desktop e mínimo 580 px mobile, cresce conforme texto; foto estática, texto à esquerda, CTA verde com texto azul escuro. Não usar slider automático, parallax, vídeo ou scroll hijacking.

Conteúdo até 1280 px; margens de 80 px em 1440 px, 24 px mobile e 20 px a 320 px. Seções 56–104 px; títulos 28–44 px; fonte DM Sans preservada. Verdes claros com texto escuro, foco visível, alvos 44 px ou maiores.

Home, sequência: hero; indicadores; áreas de atuação; expertise; segmentos; CTA; fornecimentos; Instagram; clientes. Dois grupos de três cards tornam-se respectivamente faixas título/conteúdo e composições alternadas foto/texto. Seis blocos de expertise usam fotos e conteúdo aberto em duas colunas. Todos os textos originais continuam presentes.

GSAP: importação dinâmica, contexto/matchMedia com cleanup; título/CTA 24 px, .7s, stagger .12s; blocos abaixo da dobra 24 px, .65s, uma vez, power3.out. CSS e HTML inicial não escondem conteúdo. Movimento reduzido desliga GSAP. Falha da importação não interrompe leitura. Movimento do carrossel só após comando do visitante.

## Interfaces internas

StaticHero recebe children e usa imagens responsivas locais. Header usa links reais e disclosures nativos para operar sem JS. Oferta reutiliza Radix Dialog e mantém texto integral, Escape, fechamento e retorno de foco. usePageMotion recebe ref do escopo da página. Nenhuma API pública alterada.

Prévia usa entrada React/SSR própria, body[data-variant="erm"], CSS exclusivo, servidor loopback/noindex e artefatos fora da aplicação. Não modificar CSS global nem src/pages para compor a amostra. As outras páginas servidas como destino continuam sendo o build atual, sem alegação de cobertura V3.

## Páginas futuras após aprovação

Sobre: hero 350–430 px, introdução e seções próprias; equipe real. Serviços: seleção por rota preservada, catálogo legível e CTAs originais; Dräger mantém material original. Clientes: logos, setores e descrições. Depoimentos: citações integrais e atribuições originais. Carreiras: cultura, benefícios e processo atuais. Contato: introdução + formulário em duas colunas, todos os campos e canais. Editorial: lista com imagem/título e artigo 65–72ch, sumário, fontes e metadados verdadeiros. Privacidade/404: apresentação legível específica, sem forçar hero fotográfico.

## Aceitação

Browser em 320/390/768/1440/1920: um H1, sem overflow, imagens carregadas, nenhuma requisição MP4. Contrato compara títulos, parágrafos/listas, links, 13 logos, números e descrição dos três diálogos. Testar menus teclado/toque, Escape, foco, carrossel, destinos internos, no-JS e movimento reduzido. Registrar exceções; não alterar texto para fazer o teste passar.

Executar typecheck aplicação e preview, lint, testes existentes, build público e editorial. Capturas completas e primeira dobra em 390/1440, comparativo local, crítica visual e correções. Auditoria automatizada de acessibilidade não equivale a certificação WCAG ou teste com leitor de tela real.
