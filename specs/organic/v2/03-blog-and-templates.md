# Blog, navegação e contratos dos templates

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

/blog retorna 404 local; /conteudos mistura tipos; não há busca/paginação próprias nem templates adequadamente distintos.

## Objetivo

Criar descoberta editorial real com HTML rastreável, estados honestos e relações artigo↔serviço↔hub.

## Fora de escopo

Busca externa paga, CMS novo, páginas de filtro indexáveis, popularidade inventada, publicação automática e paginação para inflar a meta de 90.

## Componentes e arquivos afetados

scripts/build.mjs; src/main.tsx; src/entry-server.tsx; src/editorial/NavigationContext.tsx, EditorialApp.tsx, types.ts, editorial.css; scripts/editorial.mjs; novos componentes em src/editorial: BlogIndex, TopicDirectory, Pagination, SearchPage, ArticleTemplate, ServiceTemplate, HubTemplate, ContentTable, ContentFigure.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S03-R01 | Emitir /blog e integrá-lo a header/home/footer. Listar somente artigos elegíveis; cards com título/resumo próprios e informação editorial verdadeira. Até três destaques curados explicitamente; sem destaque se nenhum for elegível. | 0/1/12/13/25artigos; serviços nunca listados; links presentes no HTML. |
| S03-R02 | /conteudos é diretório de hubs;013–018 têm esse pai. Hub inclui síntese própria e percursos. Público sem hubs usa estado vazio, noindex e exclusão do sitemap. | Pais sem autolinks/ciclos e síntese presente; o índice não conta na meta de 90. |
| S03-R03 | Doze artigos por página; /blog/pagina/1 redireciona com 308 para /blog; demais páginas válidas têm canonical próprio; inteiro inválido ou fora do intervalo retorna 404. Com zero aprovados: /blog retorna 200, noindex, follow e fica fora do sitemap. | Conferir status, cards, prev/next e canonical com 0/1/12/13/25 artigos; nenhuma página 2 vazia. |
| S03-R04 | Serviço contém aplicação/entradas/escopo/entregas/limites; artigo responde pergunta com sumário/corpo/fontes; hub orienta percursos. Preservar body legado e estender com blocos semânticos de tabela/figura, caption/cabeçalhos/alternativa textual. | Comparar os três tipos e o HTML sem JavaScript; renderizar documento antigo sem os campos novos. |
| S03-R05 | Relações explícitas porID/URL, únicas, sem autolink e só para destino elegível. Projetar cluster, service_links e referências legíveis. Público usa catálogo/blog elegível como fallback ou omite relação. | Nenhum link para draft; referências/navegação presentes no HTML; projeção sem campos internos. |
| S03-R06 | /busca carrega índice leve ao interagir: título, resumo, cluster, slug e revisão real. Normalizar caixa/acentos; todos os termos no título/resumo; título exato prioritário; revisão/ID como desempate. Um filtro de tema, estado no fragmento e grupos de 12 com Mostrar mais. | Acentos, combinação de termos, filtro, limpar, ordem, anúncio de resultados e zero resultados. |
| S03-R07 | Busca noindex, follow e fora do sitemap; sem JavaScript oferece temas. Blog, hubs e paginação continuam navegáveis. Prévia com aviso/noindex e dez pilotos, separados em seis artigos, um hub e três serviços. | Falha de índice com recuperação; zero conteúdos honesto; nenhuma autoria/data falsa ou índice público com draft. |

## Decisões

Ordenar o público por revisão real decrescente e ID; prévia sem revisão, por ID. Consultas/filtros não geram URLs rastreáveis combinatórias. O público usa versões publicadas e a prévia usa rascunhos validados. Referências apresentam nome, contexto e link.

## Estados vazios, erros e falhas

Vazio público; prévia com pilotos; página válida/inválida; busca inicial/carregando/resultado/vazio/erro/limpar; destaque ausente; destino relacionado ainda não elegível.

## Dependências

B01 (integridade) e B02 (shell) precedem B03/B04; B05 vem após B03. Revisão humana é necessária para publicar, não para demonstrar a prévia.

## Critérios de aceite

Jornada completa, listagens coerentes com tipo e elegibilidade, conteúdo principal sem JS e paginação testada.

## Testes e evidências

Fixtures com 0/1/12/13/25 artigos; contrato de projeção; HTTP/canonical/sitemap; busca determinística; tabela acessível; navegação sem JavaScript; compatibilidade do corpo legado.

## Riscos

Vazar drafts; misturar serviços no blog; índice vazio indexável; busca decorativa; fragmento com dados pessoais. Mitigar por índice mínimo e testes.

## Reversão

Retornar componentes/build ao snapshot, conservar documentos e rotas; manter versões antigas de body renderizáveis.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
