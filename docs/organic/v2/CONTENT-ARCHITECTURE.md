# Arquitetura editorial V2 da Monitorar

Materialização em 17/10/2026 do planejamento já realizado. Esta entrega cria somente documentação V2: não altera código, corpus, manifesto, plano anterior, DNS ou produção. Direção visual confirmada: **Campo e precisão**.

## Decisão e contagens

Manter 90 propostas substantivas com IDs 001–090: **12 serviços, 6 hubs e 72 artigos/guias**. Os 90 briefs V2 estão em `briefs/`; o mapa verificável é `url-map-v2.csv` e a representação estruturada retomável é `evidence/editorial-matrix.json`.

O corpus anterior contém dez rascunhos iniciais, três serviços, um hub e seis artigos. Nenhum texto novo foi escrito nesta materialização. Nenhuma revisão humana concluída, aprovação ou publicação é declarada. Demanda individual, volume, dificuldade, ranking e indexação continuam não medidos.

Não contar home, contato, políticas, aliases, busca, filtros, paginação, diretórios utilitários ou cases sem prova para completar 90. Um hub só conta porque terá síntese própria, percursos e decisões; uma lista automática não satisfaz o brief.

## Preservação e decisões por ID

As ações `manter`, `aprofundar`, `substituir` e `pendente de pesquisa` estão explícitas em cada linha. Manter significa preservar pergunta/caminho, não certificar o conteúdo. Pendente de pesquisa mantém uma hipótese legítima sem apresentá-la como estratégia validada.

| ID | Decisão V2 | Destino da intenção anterior |
|---|---|---|
|040|Substituir `/blog/o-que-o-ldar-informa-sobre-covs` por `/blog/criterios-de-vazamento-e-gatilhos-de-acao-ldar`.|COVs e limites de composição são aprofundados em 036, com síntese em 019.|
|060|Substituir `/blog/avaliacao-geoambiental-etapas-e-limites` por `/blog/lacunas-de-dados-em-avaliacoes-geoambientais`.|Panorama em 016; comparação de etapas em 062.|
|011, 085, 086|Reclassificar como `treinamentos`; retirar fonte IEC-HAZOP atribuída automaticamente.|Permanecem os mesmos IDs e caminhos; referências próprias de capacitação.|

Os outros 88 caminhos candidatos são preservados. As substituições 040/060 são de planejamento: não há publicação comprovada dos caminhos antigos, portanto não se inventa redirect HTTP. Os17 legados continuam sujeitos ao `../redirect-map.csv` existente; o mapa V2 não altera esse arquivo. Canonical próprio em alias comercial só entra quando houver conteúdo distinto aprovado e liberação pertinente.

Higiene ocupacional permanece excluída como oferta. Comparação educativa053 não a reintroduz. Emissões canalizadas, inventário GEE, fauna, flora, educação ambiental, resíduos, ESG, monitoramento de água e supervisão de obras não se tornam serviços por aparecerem em conteúdo técnico ou concorrencial. Equipamentos, clientes, números, credenciais, história e relações Petrobras/Dräger exigem evidência e autorização específicas.

## Navegação editorial e contratos de página

- `/blog`: entrada do acervo de artigos, 12 por página estática com links acessíveis. Não incluir serviços ou hubs como artigos. Não criar página2 vazia antes de 13 itens elegíveis.
- `/conteudos`: diretório dos seis hubs. Pais 013–018 apontam para esse diretório, nunca para si próprios.
- Serviços têm pai `/servicos`. Artigos têm o hub pertinente; HAZOP e treinamento usam018. Equipamentos 087–090 podem usar `/blog`, sem fabricar hub vazio.
- `/busca`: experiência separada, noindex, estado em fragmento. Busca, filtros e paginação não entram na contagem 90.
- Prévia atual: seis artigos 019/021/022/023/053/082 no blog, hub013 em conteúdos e serviços 002/006/009 no catálogo, todos com aviso de rascunho e noindex. Isso não é acervo publicado.
- Primeira jornada visual futura: **home → blog →021 → 002→ contato**, mais **home → serviço → artigo**. Não basta existir rota escondida.

Serviço explica oferta, entradas, responsabilidade, entrega e limites. Artigo resolve pergunta específica e mostra a contribuição própria. Hub orienta por tarefa e sintetiza relações. Componentes podem ser compartilhados; esses contratos não são o mesmo bloco genérico com rótulo diferente.

As matrizes 002/021 terão tabelas HTML com caption, cabeçalhos associados e leitura móvel compreensível; conteúdo essencial presente sem JavaScript. Cenários hipotéticos são identificados junto ao exemplo. A direção Campo e precisão não autoriza imagens ilustrativas a se passarem por projetos, equipamentos ou equipe reais.

## Relações explícitas e correção da causa

A auditoria anterior identificou81 linhas com destinos duplicados, nove com autolinks e seis hubs com pai igual à própria URL. `scripts/catalog.mjs` escolhe primeiros peers/serviço/hub e fontes pelo cluster, produzindo essas distorções;044 recebia apenas EPA e treinamento herdava IEC.

O mapa V2 usa relações explícitas por ID, fontes candidatas por necessidade e pais definidos. As entradas são derivadas dessas relações e do pai declarado, não dos primeiros itens do array. O JSON registra todos os destinos e a validação deve comprovar ausência de duplicatas, autolinks, destinos inexistentes no plano e ciclos de pais.

**Não executar o gerador antigo para materializar V2.** Ele sobrescreve o CSV anterior e preserva briefs antigos com `wx`, podendo criar divergência. A evolução futura do gerador exige tarefa própria; nenhum script foi alterado aqui.

## Fontes e originalidade

Pergunta do comprador → pertinência ao portfólio → leitura primária → contribuição própria → estrutura original → redação → revisão. Não copiar a sequência de argumentos da Ambiens nem importar seus ativos, autores, clientes, casos ou alegações.

As fontes técnicas abaixo continuam candidatas nesta subtarefa. HTTP 200, hash ou catálogo não demonstram leitura, atualidade ou aplicabilidade. Registrar trecho utilizado, versão, data e limite. Documentos internos permanecem locais e fora dos artefatos públicos.

| ID de pesquisa | Estado | Pesquisa necessária |
|---|---|---|
| CAND-NEG | declaração interna e evidência a confirmar | Confirmar com responsável atual atividades, entregáveis, exclusões e responsabilidades; obter exemplo local autorizado ou criar exemplo explicitamente ilustrativo. |
| CAND-EPA | candidata; leitura técnica pendente nesta subtarefa | Ler Method 21 e guia LDAR da EPA; registrar versão, trechos usados e diferença entre método, programa e exigência regulatória. |
| CAND-QUANT | candidata a localizar/ler | Localizar fonte primária EPA pertinente sobre estimativas de emissão por componentes e referência metrológica oficial; conferir grandezas, entradas, premissas e limitações. |
| CAND-OGI | candidata a localizar/ler | Ler documentação oficial vigente sobre OGI e manuais dos instrumentos efetivamente discutidos; identificar substâncias, condições, limitações e alcance quantitativo. |
| CAND-AR | candidata; aplicabilidade não validada | Examinar fonte MMA sobre padrões de qualidade do ar e CONAMA 506/2024 candidata; verificar vigência, alterações, poluentes, períodos, transição e métodos de monitoramento. |
| CAND-DIESEL | candidata a localizar/ler | Ler documentos vigentes do PROCON Fumaça Preta/INEA; identificar veículos abrangidos, método, registros e relação com regras federais; diferenciar avaliação visual e opacidade. |
| CAND-RUIDO | candidata; acesso normativo e revisão pendentes | Conferir edição da ABNT NBR 10151 e acesso lícito ao conteúdo; confrontar legislação aplicável. WHO é contexto de saúde. Comparação ocupacional exige fonte oficial própria, como Fundacentro/NHO. |
| CAND-GAC | candidata; capítulos e aplicabilidade pendentes | Ler capítulos pertinentes do Manual de Gerenciamento de Áreas Contaminadas CETESB 3ª edição; distinguir referência técnica de regra territorial e confrontar outros documentos aplicáveis. |
| CAND-LIC | candidata; legislação consolidada a ler | Ler Lei 15.190/2025 consolidada e alterações, LC 140/2011, atos compatíveis e instruções do órgão competente; verificar regimes, transições, competências e aplicabilidade. |
| CAND-SMS | candidata a localizar/ler | Ler requisitos oficiais pertinentes, especialmente NR 1 quando aplicável, e referências de sistemas/auditoria com acesso lícito; vincular cada requisito à aplicabilidade e evidência. |
| CAND-HAZOP | catálogo candidato; texto técnico e revisão pendentes | Consultar texto normativo licitamente acessível e especialista sobre IEC 61882, preparação, participação, registros e limites. |
| CAND-TREINO | candidata a localizar/ler | Ler disposições vigentes de capacitação e requisitos dos cursos efetivamente confirmados, incluindo NR 33/NR 35 apenas se pertinentes à oferta; distinguir presença, registro, habilitação e competência. |
| CAND-EQ | candidata a localizar/ler | Consultar documentação oficial do fabricante para categorias/modelos identificados; confirmar vínculo comercial separadamente da análise educativa. |
| CAND-PB | candidata; leitura de documentos e atualidade pendentes | Descobrir e ler documentos públicos Petrobras datados; registrar contexto, métrica, método, período e limites; comparar somente materiais comparáveis. Caderno 2022 é candidato histórico. |

O JSON contém URLs candidatas conhecidas e a tarefa específica de cada ID. Não foi executada nova pesquisa para preencher arquivos. Legislação de licenciamento deve considerar regime consolidado vigente, incluindo Lei 15.190/2025 e alterações, em vez de presumir que referências anteriores bastam. CETESB não implica jurisdição nacional e WHO não substitui critério brasileiro de ruído.

A pesquisa Ambiens usada nesta matriz é **delegada** a `public_seo_audit` e seu auxiliar. As dez correspondências semânticas associadas aos IDs estão no JSON e nos briefs; títulos descobertos não são rotulados como textos lidos. Correspondências diretas concentram-se em licenciamento e áreas impactadas.064 e o foco novo060 são contribuições próprias; a transferência do formato de monitoramento não comprova correspondência temática com todos os outros clusters.

Contadores finais recebidos:785 alvos;413 URLs acessadas, 374 respostas 200 e39 respostas 404;313 ativos excluídos;59 bloqueadas por robots e não solicitadas;24 corpos selecionados lidos, incluindo nove artigos;18 variantes/listagens verificadas tecnicamente;332 respostas 200 apenas com metadados.17 URLs de paginação foram acrescentadas na revisão de botões, sem novos destinos de artigos:200 artigos já estavam inventariados. Não chamar374 páginas de leitura integral.

## Lotes e passagem

| Lote | IDs | Trabalho |
|---|---|---|
| 1 | 002, 006, 009, 013, 019, 021, 022, 023, 053, 082 | Aprofundar dez pilotos, começando por 002/021; validar contratos diferentes de serviço, artigo e hub. |
| 2 | 001, 020, 024, 025, 026, 027, 028, 029, 030, 031 | Consultoria ampla e jornada de contratação, preparação e acompanhamento de fugitivas. |
| 3 | 032, 033, 034, 035, 036, 037, 038, 039, 040, 044 | Métodos, grandezas, limitações, comparabilidade e análise documental Petrobras. |
| 4 | 003, 004, 014, 041, 042, 043, 045, 046, 047, 048 | Concluir dados e classificação LDAR e estabelecer núcleo de qualidade do ar. |
| 5 | 015, 049, 050, 051, 052, 054, 055, 056, 057, 058 | Finalizar ar/Fumaça Preta e aprofundar ruído ambiental. |
| 6 | 005, 016, 059, 060, 061, 062, 063, 064, 065, 066 | Reclamações de ruído e percurso de avaliação de áreas. |
| 7 | 007, 017, 018, 067, 068, 069, 070, 071, 072, 073 | Licenciamento sob regime vigente e hub transversal gestão/segurança. |
| 8 | 008, 010, 074, 075, 076, 077, 078, 079, 080, 081 | Gestão SMS, auditoria, evidências, indicadores e introdução HAZOP. |
| 9 | 011, 012, 083, 084, 085, 086, 087, 088, 089, 090 | Participação/acompanhamento HAZOP, treinamento e equipamentos confirmados. |

Reconciliação:90 posições, 90 IDs únicos, nenhum ausente. Cada lote é unidade de produção e revisão, não obrigação de publicar dez simultaneamente. Dependência de 044 ou012 não bloqueia as tarefas independentes.

Passagem por conteúdo: pergunta resolvida → artefato próprio entregue → fontes lidas/contextualizadas → revisão técnica/editorial pertinente → alegações autorizadas → aprovação da versão → teste de prévia → manifesto candidato. Publicação em produção exige autorização separada.

## Dicionário V2 e estado real

Preservadas as 24 colunas do mapa anterior, na mesma ordem: `id, proposed_path, existing_url, page_type, cluster, audience, primary_intent, primary_topic, secondary_queries, business_value, demand_evidence, original_contribution, source_ids, commercial_claims_status, author_reviewer, parent_page, internal_links_in, internal_links_out, canonical_strategy, cta, priority, effort, content_status, publication_blocker`. O significado geral continua em `../url-map-dictionary.md`. Aqui `source_ids` referencia os IDs CAND acima, não aprovação técnica; `internal_links_in/out` são relações planejadas, não prova de links públicos.

Campos acrescentados:

- `current_path`: candidato anterior, inclusive nas substituições.
- `action_v2` e `batch_v2`: decisão editorial e lote 1–9.
- `own_question`, `intent_boundary`, `planned_artifact`: pergunta exclusiva, fronteira e contribuição verificável.
- `specific_research`, `research_status`, `candidate_source_urls`: pesquisa concreta, estado verdadeiro e endereços ainda candidatos.
- `ambiens_source_urls`, `ambiens_read_status`: correspondência e proveniência da leitura delegada.
- `previous_intent_destinations`: destinos da intenção absorvida em 040/060.
- `related_ids`, `service_ids`: relações explícitas para revisão.
- `corpus_status`, `real_editorial_status`: estado técnico legado e interpretação factual. Os dez JSON estão em technical_review, mas continuam rascunhos iniciais sem revisão humana concluída comprovada.
- `planned_outline`, `acceptance_criteria`: estrutura e teste de utilidade específicos; os dez pilotos incluem lacunas e briefs aprofundados.
- `original_brief_path`, `body_document_path`, `body_words_observed`: localização preservada e contagem observada, sem regra de tamanho.
- `design_direction`: Campo e precisão.

A lista `secondary_queries` contém formulações naturais propostas, não palavras-chave validadas nem métricas. Prioridade é comercial/editorial, não previsão de ranqueamento. Esforço permanece classificado por atividade especializada; não há promessa de prazo para revisão de terceiros.

## Verificação e retomada

Verificar CSV por parser, 90 IDs/caminhos únicos, 90 briefs, 12/6/72 tipos, nove lotes completos, substituições corretas e relações sem problemas. Comparar hashes de content/, scripts/ e documentos anteriores para assegurar preservação. Evidência de materialização em `evidence/editorial-materialization-validation.json` quando produzida; não confundir esse teste estrutural com aprovação técnica do conteúdo.

Próxima etapa editorial concreta, após a autorização aplicável: consultar fontes específicas e aprofundar002/021 com as matrizes previstas, conservando rascunho e prévia. A revisão humana bloqueia a liberação pertinente, não o trabalho independente de interface. Esta materialização para antes de código, redesign, corpus, manifesto, commit, push ou deploy.

