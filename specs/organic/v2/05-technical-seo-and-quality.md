# SEO técnico, renderização, desempenho e acessibilidade

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

As correções locais não estão comprovadas em produção; o sitemap público observado entrega HTML. Há falhas de rotas, projeção e movimento reduzido. O orçamento anterior não inclui mídia e fontes.

## Objetivo

Entregar HTML compreensível, rotas e status coerentes, acessibilidade verificável e desempenho medido com protocolo.

## Fora de escopo

Promessas de ranking, certificação WCAG por Lighthouse, migração por preferência e aprovação de produção a partir de build local.

## Componentes e arquivos afetados

scripts/build.mjs, routes.mjs, serve.mjs, schema.mjs, editorial.mjs; src/entry-server.tsx; src/index.css; src/editorial; public; tests/artifact.test.mjs e tests/editorial.test.mjs; vercel.json somente em implementação autorizada.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S05-R01 | Cada rota entrega conteúdo, H1, links, idioma, title, description, canonical, Open Graph e JSON-LD coerentes. Article, Service, Breadcrumb e Organization usam somente dados reais e visíveis. Tabelas e referências estão no HTML sem JavaScript. | Parsear HTML/JSON-LD e verificar ausência de autoria, data ou review fictícios. |
| S05-R02 | Sitemap XML contém somente canônicas elegíveis e lastmod verdadeiro quando usado. Robots não bloqueia acidentalmente. /index.html normaliza para /. Preservar aliases e 404 real. Prévia noindex; rascunhos fora de público, links e índices. Metadados públicos não contêm localhost. | Conferir status e content-type, inventário de aliases e exclusão de rascunhos; testar provedor somente após deploy autorizado. |
| S05-R03 | Orçamentos: JS gzip 170 kB comercial/110 kB editorial, CSS 20 kB, fontes 100 kB; transferência móvel inicial 650/400 kB. Vídeo sob demanda, imagens com dimensões/lazy e fontes com licença. Medir três execuções pelo protocolo V2. | Registrar versões, rede 1600 kbps/RTT 150 ms, CPU 4×, viewport 390 px, cache limpo, mediana e variação. Metas de laboratório: LCP ≤2,5 s, CLS ≤0,1, TBT ≤200 ms. |
| S05-R04 | Objetivo WCAG 2.2 AA com testes manuais de teclado, foco, contraste, zoom 200%, 390/768/1440 px, cores forçadas e movimento reduzido; NVDA quando disponível. Conteúdo essencial nunca fica oculto. | Matriz por família e estado, limitações explícitas e Clientes visível sem animação. |

## Decisões

Manter React/Vite estático. Bloqueio de crawl não substitui noindex. Disponibilizar assets necessários. Busca, paginação e utilitárias seguem políticas explícitas. Contar JS inicial completo, não somente o entrypoint.

## Estados vazios, erros e falhas

Erro de build não promove a saída; URL inexistente retorna 404; fonte/imagem indisponível recebe fallback. Distinguir sem JavaScript, prévia e público. Teste manual indisponível é registrado como não executado.

## Dependências

B01–B07 e cobertura C; licenças de ativos pertinentes; acesso externo apenas para validação após release autorizado.

## Critérios de aceite

Contratos automatizados e revisão manual por família; orçamentos sobre transferências reais; nenhuma alegação de INP de campo.

## Testes e evidências

Build público e prévia, typecheck, lint e testes; HTTP/HTML/JSON-LD; links locais; capturas; laboratório com protocolo; teclado e movimento reduzido.

## Riscos

Otimizar nota retirando conteúdo, confundir localhost com campo, canonical global, soft 404 e perda de PDF. Exigir evidência por rota e protocolo.

## Reversão

Manter artefato anterior disponível; falha impede promoção; reverter arquivos tocados sem perder corpus.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
