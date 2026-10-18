# Pesquisa pública Ambiens — cobertura, leitura e decisões

## Identidade e finalidade

Ambiens (https://www.ambiens.com.br/) é referência concorrencial, não a empresa da missão. Monitorar Consultoria é o alvo. A pesquisa identifica perguntas, formatos e lacunas; não autoriza copiar textos, imagens, casos, clientes ou ofertas.

Data: 17/10/2026. Materialização posterior a partir do checkpoint da auditoria, sem nova varredura. [CSV completo](ambiens-inventory.csv) e [snapshot com notas próprias](evidence/ambiens-research-snapshot.json).

## Método e regra de término

Sementes: home, /blog/, /mapa-site, navegação pública, robots e sitemap. BFS sequencial, limite de uma requisição por segundo, timeout 12 s, sem retentativas; caminhos proibidos por robots não solicitados. Leituras semânticas complementares usaram intervalos superiores a 2 s. Sem login, captcha, paywall, formulários ou scraping do Google.

BFS principal:15:36:09–15:42:46 UTC,395 endereços, fila esgotada. Inspeção complementar encontrou variante de /blog/ e paginação por onclick.17 listagens foram seguidas até esgotamento, resultando em 413 endereços acessados. “Universo” significa os alvos descobertos pelo método; páginas órfãs/ocultas podem existir. Canonicals observados foram registrados, não usados para apagar variantes com comportamento diferente. Robots/sitemap são infraestrutura fora do denominador editorial.

## Contadores reconciliados

| Medida | Quantidade |
|---|---:|
| URLs-alvo distintas descobertas |785 |
| Acessadas |413 |
| HTTP 200 |374 |
| HTTP 404 |39 |
| Ativos excluídos, não solicitados |313 |
| Caminhos proibidos por robots, não solicitados |59 |
| Corpos principais/artigos lidos integralmente |24 |
| Variantes/listagens verificadas tecnicamente |18 |
| HTTP 200 somente com metadados |332 |

785=413+313+59; 413=374+39; 374=24+18+332. As 24 leituras incluem nove artigos e15 corpos institucionais/comerciais/índices. “Integral” refere-se ao corpo principal extraído, não a revisão normativa definitiva.

As 374 respostas 200 incluem 200 artigos,10detalhes /servicos/,65outras páginas não arquivísticas,79 arquivos de tags,2de autores,17 paginas de listagem e 1 variante problemática. Não são 374 conteúdos úteis distintos nem prova de indexação.

O CSV contém 19 campos mínimos do prompt e 13 complementares (32 colunas);  estados distinguem leitura, metadados, inspeção técnica,404 e exclusão. Campos analíticos de página não lida não fingem revisão: cluster_hint é triagem lexical, não conclusão semântica.

## Achados de navegação

- /blog funcionou; /blog/ retornou 200 com título “- Ambiens”, corpo principal praticamente vazio e canonical da home. O sitemap apontava para a variante com barra.
- Paginação usa URLs como https://www.ambiens.com.br/blog&perpage=12&page=2, acionadas por onclick.
- As 17 listagens somam 16×12+8=200 artigos, os mesmos já descobertos no menu; canonicals apontam /blog.
- Na primeira listagem,200dos 236links para artigos estão no menu global; 36são três links por card.
- 79 tags e2 autores apresentaram canonicals diferentes de suas URLs.

Aplicação Monitorar: links HTML, normalização explícita, canonical por página de paginação válida e separação de diretório, busca e artigo. Não inferir penalização ou explicar tráfego a partir desses sinais.

## Correspondências sustentadas por leitura

| Fontes efetivamente lidas | IDs Monitorar | Decisão própria |
|---|---|---|
| /servicos/licenciamento-ambiental; /licenciamento-ambiental-empreendimentos-imobiliarios |007,067,068,072,073 | Insumos, competência, responsabilidade e escopo; não importar especialidade imobiliária |
| /estudo-impacto-ambiental-preco; /blog/estudo-de-impacto-ambiental-preco-e-seus-fatores-influentes |007,068,073 | Fatores de comparação de escopos; não criar preço sem base |
| /blog/licenca-ambiental-para-empresas-guia-completo-para-o-sucesso-sustentavel |007,017,067,068,072,073 | Aplicabilidade/enquadramento com fontes vigentes |
| /blog/licenciamento-e-monitoramento-ambiental-entenda-ja; /supervisao-ambiental-obras |067,069,070 | Registro condicionante→responsável→prazo→evidência; não oferecer supervisão sem confirmação |
| /gestao-passivos-ambientais; /blog/investigacao-de-areas-contaminadas-riscos-e-solucoes-essenciais |005,016,061,062,063,065,066 | Distinguir fases, modelo conceitual, interpretação e gestão/remediação |
| /monitoramento-ambiental |063–065; lição estrutural para outros clusters | Objetivo→indicador→amostragem→qualidade→interpretação; não importar oferta de água |

060/lacunas e064/custódia são contribuições próprias propostas; não afirmar que essas perguntas foram desenvolvidas nas fontes lidas. Para 045–059, a aplicação é de estrutura editorial, não correspondência temática direta comprovada.

## Forças e lacunas observadas na amostra

Os artigos acrescentam etapas, métodos, dificuldades e exemplos às páginas comerciais. Há perguntas de gestores, menção à sazonalidade e propostas de indicadores. Isso é mais informativo do que apenas listar benefícios.

Por outro lado, vários exemplos e casos não identificam relatório/autor/projeto; algumas afirmações não distinguem recomendação de obrigação; falta demonstração operacional por matrizes, documentos ou cálculos contextualizados. Essas observações são da amostra lida, não um julgamento de todos os 332 corpos pendentes.

Leituras adjacentes de fauna, flora, fitossociologia, educação ambiental, resíduos e ESG não criam oferta Monitorar. /consultoria-esg-empresas e /neutralizacao-carbono responderam 404: não houve avaliação de seus corpos. O artigo ESG acessível não prova existência da página comercial.

Não foi identificada página dedicada a fugitivas/LDAR, ruído ou qualidade do ar nos títulos e URLs observados. Isso não prova ausência de menções em textos não lidos; prioridade Monitorar vem do negócio, não dessa ausência aparente.

## Pesquisa primária pendente

- Licenciamento007/067–073: Lei15.190/2025 consolidada, alterações, competência e regras aplicáveis. CONAMA237/1997 isolada não basta.
- Áreas impactadas: capítulos pertinentes e versão do Manual de Gerenciamento de Áreas Contaminadas da CETESB; atribuições/etapas e limites.
- Ar: referências brasileiras atuais do MMA e normas aplicáveis; distinguir ar ambiente, emissão e método.
- Fugitivas/LDAR: Method 21, guia LDAR EPA e referências específicas de quantificação/metrologia, contextualizadas sem importar obrigação estrangeira.
- HAZOP: fonte técnica lícita e revisão especializada; catálogo IEC não é leitura da norma.

Documentos foram localizados como candidatos; não foram integralmente lidos e validados tecnicamente nesta pesquisa. Ver [fontes](SOURCES-AND-SKILLS.md) e briefs por ID.

## Limites e retomada

332 respostas 200 têm corpo sem leitura semântica; 59caminhos foram respeitados como bloqueados; 313 ativos excluídos; 39 respostas 404 sem corpo revisado. Não houve análise de backlinks, ranking, tráfego, volume ou irregularidade jurídica.

Leitura competitiva adicional opcional: /servicos/gerenciamento-e-diagnostico-de-passivos-ambientais, /servicos/gestao-ambiental e /servicos/estudos-geologicos-e-hidrogeologicos. Não impede a implementação local especificada.

O snapshot exporta metadados e 24 notas próprias, não textos integrais/HTML para republicação. As datas de artigos citadas são as exibidas, não prova independente da data de publicação.
