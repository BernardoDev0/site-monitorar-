> Atualização de execução 17/10/2026: implementação local autorizada e realizada parcialmente. As descrições/status originais abaixo são o baseline do plano. O estado efetivo e suas pendências estão em [EXECUTION-STATE.md](EXECUTION-STATE.md) e [IMPLEMENTATION.md](IMPLEMENTATION.md). Não interpretar “não implementado” abaixo como estado corrente de todas as tarefas.

# Tarefas V2 — requisitos, execução e evidências

A01 materializa esta entrega. B01–B08 e as fases seguintes são tarefas de implementação futura; código e publicação não foram executados. Direção Campo e precisão confirmada. Cada tarefa preserva os campos exigidos pelo prompt, mais classificação e estado.

## Ordem e contratos comuns

B01/B02 abrem a fatia; B03/B04 seguem; B05 depende de B03, B06 de B02 e B07 de B04; B08 fecha. C completa as famílias. D contém nove lotes de dez; D01 reconhece 002/021 já trabalhados em B07. E verifica o conjunto. F01 prepara o candidato; F02 só publica com autorização específica. M01 depende de acesso. Dependências humanas de artigos não bloqueiam UI independente.

Classificações: executável localmente após aprovação; dependente de informação técnica/institucional; dependente de permissão/acesso externo; condicionada à validação de hipótese. Nenhuma hipótese é usada para justificar migração de stack. Demanda individual não medida não impede conteúdo útil ligado ao negócio.

Estimativas representam esforço indicativo, não prazo prometido. Evidências das tarefas futuras são resultados a guardar. Contratos nas [sete specs](../../../specs/organic/v2/01-scope-and-preservation.md); critérios gerais em [validação](VALIDATION-AND-RELEASE.md).

## A01 — Materializar auditoria, pesquisa, mapas, 90 briefs, sete specs, tarefas e evidências; validar contagens, referências e preservação.

- **specification**: 01-scope-and-preservation + 04-original-content-and-90-urls
- **requirement_ids**: S01-R01; S01-R02; S04-R04
- **priority**: P1
- **dependencies**: direção Campo e precisão confirmada; autorização documental V2
- **actual_files_or_components**: docs/organic/v2; specs/organic/v2
- **concrete_change**: Materializar auditoria, pesquisa, mapas, 90 briefs, sete specs, tarefas e evidências; validar contagens, referências e preservação.
- **skill_and_reference**: Impeccable contexto/brand/shape; Taste diagnóstico e direção; missão V2.
- **acceptance_test**: 13 artefatos principais, sete specs, 90 briefs; inventário 785; mapa 90; IDs/links/requisitos reconciliados; arquivos anteriores preservados.
- **evidence_to_save**: preservation-baseline.json, materialization-validation.json, inventários e hashes de arquivos.
- **human_dependency**: Direção já confirmada; nenhuma nova confirmação necessária para os documentos.
- **permission_needed**: Autorização documental já dada pelo usuário; não abrange redesign ou publicação nesta entrega.
- **classification**: Executável localmente; autorização documental cumprida.
- **estimated_effort**: Executado nesta rodada de materialização.
- **rollback**: Se necessário, retirar somente novos artefatos V2 identificados no manifesto, preservando todo o histórico e código anteriores.
- **status**: materializado; validação final registrada em EXECUTION-STATE.md

## B01 — Capturar baseline do estado sujo; centralizar validações de manifesto, pausa, projeção de pessoas e rotas; separar candidato/publicado/rascunho; corrigir /index.html → /.

- **specification**: 01-scope-and-preservation + 06-editorial-operations
- **requirement_ids**: S01-R01; S06-R01; S06-R02; S06-R03
- **priority**: P1
- **dependencies**: aprovação do lote B
- **actual_files_or_components**: scripts/editorial.mjs; scripts/editorial-cli.mjs; scripts/build.mjs; scripts/serve.mjs; tests/editorial.test.mjs; tests/artifact.test.mjs
- **concrete_change**: Capturar baseline do estado sujo; centralizar validações de manifesto, pausa, projeção de pessoas e rotas; separar candidato/publicado/rascunho; corrigir /index.html → /.
- **skill_and_reference**: Contratos de preservação e operação; S01/S06; auditoria técnica.
- **acceptance_test**: Chave diferente de slug, IDs/corpos duplicados, pessoa não autorizada, pausa inválida, colisão e rascunho inválido; publicado válido continua utilizável.
- **evidence_to_save**: Hashes de baseline, inventário de rotas e logs reais dos contratos.
- **human_dependency**: Nenhuma confirmação editorial necessária para corrigir os contratos locais.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: G:8–12h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B02 — Aplicar tokens, header/footer e composição da home; incluir Blog; manter conteúdo visível; corrigir reduced motion e alt de Clientes sem antecipar seu redesign completo.

- **specification**: 02-design-impeccable-taste
- **requirement_ids**: S02-R01; S02-R02; S02-R03; S02-R05
- **priority**: P1
- **dependencies**: direção Campo e precisão confirmada; aprovação do lote B
- **actual_files_or_components**: src/index.css; tailwind.config.ts; src/components/Header.tsx; src/components/Footer.tsx; src/components/Logo.tsx; src/pages/Home.tsx; src/components/ParallaxHero.tsx; src/pages/Clients.tsx
- **concrete_change**: Aplicar tokens, header/footer e composição da home; incluir Blog; manter conteúdo visível; corrigir reduced motion e alt de Clientes sem antecipar seu redesign completo.
- **skill_and_reference**: Impeccable brand/shape e construção pertinente; Taste crítica/composição; DESIGN-PLAN.md.
- **acceptance_test**: Home → blog e home → serviços por teclado e sem JS; 390/768/1440; foco/logo não cobertos; 14 itens de Clientes visíveis com reduced motion; nenhum alt undefined.
- **evidence_to_save**: Capturas por largura, estilos computados e registro de decisões.
- **human_dependency**: Direção já confirmada; direitos para novos destaques fotográficos. Sem foto autorizada, composição tipográfica e diagrama próprio.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: G:8–12h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B03 — Emitir /blog e /conteudos; separar artigos e hubs; paginação estática de 12 com links HTML, canonical e status definidos.

- **specification**: 03-blog-and-templates
- **requirement_ids**: S03-R01; S03-R02; S03-R03
- **priority**: P1
- **dependencies**: B01; B02
- **actual_files_or_components**: scripts/build.mjs; src/main.tsx; src/entry-server.tsx; src/editorial/NavigationContext.tsx; novos BlogIndex, TopicDirectory, Pagination
- **concrete_change**: Emitir /blog e /conteudos; separar artigos e hubs; paginação estática de 12 com links HTML, canonical e status definidos.
- **skill_and_reference**: Impeccable fluxos/estados e Taste composição/densidade; S03.
- **acceptance_test**: 0/1/12/13/25 artigos; página 1 redireciona 308; fora do intervalo 404; página 2 apenas com pelo menos 13; público sem drafts.
- **evidence_to_save**: Inventários HTML, status/canonical e capturas dos estados vazio/cheio.
- **human_dependency**: Nenhuma para a UI; textos continuam em rascunho.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: M:4–8h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B04 — Separar templates de serviço, artigo e hub; projetar cluster, relações e referências legíveis; acrescentar tabelas/figuras semânticas compatíveis com body legado.

- **specification**: 03-blog-and-templates + 05-technical-seo-and-quality
- **requirement_ids**: S03-R04; S03-R05; S05-R01
- **priority**: P1
- **dependencies**: B01; B02
- **actual_files_or_components**: src/editorial/EditorialApp.tsx; src/editorial/types.ts; src/editorial/editorial.css; scripts/editorial.mjs; scripts/schema.mjs; novos ArticleTemplate, ServiceTemplate, HubTemplate, ContentTable, ContentFigure
- **concrete_change**: Separar templates de serviço, artigo e hub; projetar cluster, relações e referências legíveis; acrescentar tabelas/figuras semânticas compatíveis com body legado.
- **skill_and_reference**: Impeccable leitura/hierarquia; Taste diferenciação; Accessibility e Schema.
- **acceptance_test**: Três tipos visivelmente distintos; tabela com caption/cabeçalhos presente sem JS; links elegíveis; corpo legado compatível; nenhuma autoria/data fictícia.
- **evidence_to_save**: HTML/JSONLD por tipo e capturas da jornada.
- **human_dependency**: Revisão técnica de novas matrizes antes de publicação, não para o layout.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: G:8–12h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B05 — Implementar busca local sob demanda em /busca; título/resumo normalizados, filtro de tema, fragmento, resultados em grupos de 12 e estados completos.

- **specification**: 03-blog-and-templates
- **requirement_ids**: S03-R06; S03-R07
- **priority**: P1
- **dependencies**: B03
- **actual_files_or_components**: scripts/build.mjs; novo SearchPage; novo gerador de índice público de busca
- **concrete_change**: Implementar busca local sob demanda em /busca; título/resumo normalizados, filtro de tema, fragmento, resultados em grupos de 12 e estados completos.
- **skill_and_reference**: Impeccable estados; Taste interação útil; Accessibility.
- **acceptance_test**: Acentos/caixa, termos, ordem, filtro, limpar, mostrar mais, zero resultados, falha de índice, teclado e fallback sem JS; índice público sem drafts/PII.
- **evidence_to_save**: Testes funcionais e capturas de estados.
- **human_dependency**: Nenhuma API, analytics ou serviço externo necessário.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: M:4–8h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B06 — Canais no início; formulário compacto para preparar mensagem; edição e cópia com retorno verdadeiro; preservar campos e eventos mínimos sem PII.

- **specification**: 02-design-impeccable-taste + 07-measurement-and-release
- **requirement_ids**: S02-R04; S07-R01
- **priority**: P1
- **dependencies**: B02
- **actual_files_or_components**: src/pages/Contact.tsx; src/lib/contact.ts; src/components/WhatsAppButton.tsx
- **concrete_change**: Canais no início; formulário compacto para preparar mensagem; edição e cópia com retorno verdadeiro; preservar campos e eventos mínimos sem PII.
- **skill_and_reference**: Impeccable fluxo/clareza; Taste formulários; Accessibility.
- **acceptance_test**: Validação, edição, cópia recusada/sucesso, preservação de texto e nenhuma afirmação de envio; cliques externos interceptados.
- **evidence_to_save**: Capturas de erro/preparado/cópia e payloads channel/path.
- **human_dependency**: Nenhuma para a UI; nenhum envio real nos testes.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: P:2–4h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B07 — Aprofundar 002/021 com matriz de escopo/responsabilidades e matriz de resultados/dados/limites; três cenários hipotéticos; manter technical_review.

- **specification**: 04-original-content-and-90-urls
- **requirement_ids**: S04-R01; S04-R02
- **priority**: P1
- **dependencies**: B04
- **actual_files_or_components**: content/documents/002.json; content/documents/021.json; briefs V2 correspondentes; fontes/evidências locais
- **concrete_change**: Aprofundar 002/021 com matriz de escopo/responsabilidades e matriz de resultados/dados/limites; três cenários hipotéticos; manter technical_review.
- **skill_and_reference**: Briefs 002/021; Impeccable leitura; Taste conteúdo demonstrável.
- **acceptance_test**: Perguntas respondidas; exemplos rotulados; concentração não convertida automaticamente em massa; fontes específicas contextualizadas; render de preview e zero novo público.
- **evidence_to_save**: Diff editorial por versão, notas de leitura e capturas das matrizes.
- **human_dependency**: Confirmar oferta 002 e revisar tecnicamente 021 antes de publicação; pesquisa e prévia podem avançar.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: M:4–8h + revisãohumana
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## B08 — Validar jornadas, reversão e famílias preservadas; testes de contratos, acessibilidade, HTTP/SEO e orçamentos por experiência.

- **specification**: 05-technical-seo-and-quality + 07-measurement-and-release
- **requirement_ids**: S05-R01; S05-R02; S05-R03; S05-R04; S07-R02
- **priority**: P1
- **dependencies**: B01; B02; B03; B04; B05; B06; B07
- **actual_files_or_components**: tests/editorial.test.mjs; tests/artifact.test.mjs; evidências reais de navegador/build
- **concrete_change**: Validar jornadas, reversão e famílias preservadas; testes de contratos, acessibilidade, HTTP/SEO e orçamentos por experiência.
- **skill_and_reference**: Impeccable audit/adapt/polish pertinentes à versão; Taste revisão renderizada; Accessibility/Schema.
- **acceptance_test**: Build público/preview, tipos, lint, testes; HTTP/metadados; teclado/zoom/forced colors/reduced motion; budgets; nenhum draft público.
- **evidence_to_save**: Logs, capturas em três larguras, matriz manual e protocolo de laboratório quando executado.
- **human_dependency**: NVDA manual se disponível; limite explícito se não executado.
- **permission_needed**: Aprovação do lote B para implementação local; publicação exige autorização separada.
- **classification**: Executável localmente após aprovação do plano; dependências factuais restritas ao uso pertinente.
- **estimated_effort**: M:4–8h
- **rollback**: restaurar somente arquivos tocados a partir do snapshot do estado sujo atual; conservar alterações concorrentes e conteúdos/URLs anteriores; não usar reset/clean
- **status**: planejado; não implementado

## C01 — Redesenhar Empresa, história, missão e equipe como seções próprias; preservar quatro URLs/aliases e canonicals até migração justificada.

- **specification**: 02-design-impeccable-taste
- **requirement_ids**: S02-R01; S02-R02; S02-R03
- **priority**: P2
- **dependencies**: B02
- **actual_files_or_components**: src/pages/About.tsx; scripts/routes.mjs
- **concrete_change**: Redesenhar Empresa, história, missão e equipe como seções próprias; preservar quatro URLs/aliases e canonicals até migração justificada.
- **skill_and_reference**: Impeccable superfícies/adaptação; Taste narrativa institucional.
- **acceptance_test**: Quatro rotas acessíveis; fatos conflitantes não promovidos a números; teclado e três larguras.
- **evidence_to_save**: Capturas e inventário de rotas/canonicals.
- **human_dependency**: Provas de história/equipe para novos destaques; layout independente.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 4–8 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## C02 — Redesenhar catálogo e famílias ambiental/segurança/HAZOP/auditorias/treinamento/Dräger; distinguir oferta, estudo e capacitação; preservar PDF e destinos.

- **specification**: 02-design-impeccable-taste + 03-blog-and-templates
- **requirement_ids**: S02-R02; S03-R04; S03-R05
- **priority**: P2
- **dependencies**: B04
- **actual_files_or_components**: src/pages/Services.tsx; src/components/ServiceCard.tsx; src/components/ServiceCardWithIcon.tsx; public/drager-catalogo.pdf
- **concrete_change**: Redesenhar catálogo e famílias ambiental/segurança/HAZOP/auditorias/treinamento/Dräger; distinguir oferta, estudo e capacitação; preservar PDF e destinos.
- **skill_and_reference**: Impeccable fluxos; Taste diferenciação comercial.
- **acceptance_test**: Links e diálogos por teclado; PDF íntegro; substituição de legado só explícita; sem ampliar oferta.
- **evidence_to_save**: Capturas por família, hashes do PDF, teste de navegação.
- **human_dependency**: Escopo dos serviços e relação Dräger antes de novas alegações.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 8–12 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## C03 — Redesenhar referências e depoimentos com nomes, contexto e autorizações; manter conteúdo visível; não criar cases.

- **specification**: 02-design-impeccable-taste
- **requirement_ids**: S02-R02; S02-R03; S02-R05
- **priority**: P2
- **dependencies**: B02
- **actual_files_or_components**: src/pages/Clients.tsx; src/pages/Testimonials.tsx
- **concrete_change**: Redesenhar referências e depoimentos com nomes, contexto e autorizações; manter conteúdo visível; não criar cases.
- **skill_and_reference**: Impeccable verdade/hierarquia; Taste composição institucional.
- **acceptance_test**: Sem números novos não provados; citações contextualizadas; nomes/alt reais; reduced motion e foco.
- **evidence_to_save**: Capturas e registro de evidência por alegação.
- **human_dependency**: Prova e autorização de logos/citações/escopo divulgável.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 4–8 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## C04 — Redesenhar carreira, galeria e canal de candidatura; estado sem vagas e validade explícita de oportunidades.

- **specification**: 02-design-impeccable-taste
- **requirement_ids**: S02-R02; S02-R03
- **priority**: P2
- **dependencies**: B02
- **actual_files_or_components**: src/pages/Careers.tsx
- **concrete_change**: Redesenhar carreira, galeria e canal de candidatura; estado sem vagas e validade explícita de oportunidades.
- **skill_and_reference**: Impeccable estados; Taste composição e conteúdo.
- **acceptance_test**: Com e sem vaga; teclado; três larguras; nenhum envio real; imagens com origem registrada.
- **evidence_to_save**: Capturas e checklist de oportunidade.
- **human_dependency**: Confirmar vagas e direitos de fotos; layout independente.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 3–6 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## C05 — Redesenhar política com âncoras e leitura clara; 404 com retorno a home/serviços/blog; refletir fluxo real de contato.

- **specification**: 02-design-impeccable-taste + 05-technical-seo-and-quality
- **requirement_ids**: S02-R02; S05-R02; S05-R04
- **priority**: P2
- **dependencies**: B02
- **actual_files_or_components**: src/pages/Privacy.tsx; src/pages/NotFound.tsx; scripts/serve.mjs
- **concrete_change**: Redesenhar política com âncoras e leitura clara; 404 com retorno a home/serviços/blog; refletir fluxo real de contato.
- **skill_and_reference**: Impeccable leitura/estados; Taste densidade.
- **acceptance_test**: Status404 real; headings/âncoras/zoom; sem tratamento de dados inventado.
- **evidence_to_save**: HTTP, capturas e confronto factual do fluxo.
- **human_dependency**: Revisão factual da política para publicação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 2–4 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D01 — Pesquisar, redigir/aprofundar e revisar pilotos restantes: 006,009,013,019,022,023,053,082

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: B07
- **actual_files_or_components**: docs/organic/v2/briefs/002.md; docs/organic/v2/briefs/006.md; docs/organic/v2/briefs/009.md; docs/organic/v2/briefs/013.md; docs/organic/v2/briefs/019.md; docs/organic/v2/briefs/021.md; docs/organic/v2/briefs/022.md; docs/organic/v2/briefs/023.md; docs/organic/v2/briefs/053.md; docs/organic/v2/briefs/082.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar pilotos restantes: 006,009,013,019,022,023,053,082. IDs do lote: 002, 006, 009, 013, 019, 021, 022, 023, 053, 082. 002/021 já aprofundados em B07; concluir os outros oito e revisar coerência do lote. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D02 — Pesquisar, redigir/aprofundar e revisar contratação, planejamento e registros de fugitivas/LDAR

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D01
- **actual_files_or_components**: docs/organic/v2/briefs/001.md; docs/organic/v2/briefs/020.md; docs/organic/v2/briefs/024.md; docs/organic/v2/briefs/025.md; docs/organic/v2/briefs/026.md; docs/organic/v2/briefs/027.md; docs/organic/v2/briefs/028.md; docs/organic/v2/briefs/029.md; docs/organic/v2/briefs/030.md; docs/organic/v2/briefs/031.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar contratação, planejamento e registros de fugitivas/LDAR. IDs do lote: 001, 020, 024, 025, 026, 027, 028, 029, 030, 031. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D03 — Pesquisar, redigir/aprofundar e revisar qualidade, métodos, quantificação, campanhas, critérios LDAR e Petrobras documental

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D02
- **actual_files_or_components**: docs/organic/v2/briefs/032.md; docs/organic/v2/briefs/033.md; docs/organic/v2/briefs/034.md; docs/organic/v2/briefs/035.md; docs/organic/v2/briefs/036.md; docs/organic/v2/briefs/037.md; docs/organic/v2/briefs/038.md; docs/organic/v2/briefs/039.md; docs/organic/v2/briefs/040.md; docs/organic/v2/briefs/044.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar qualidade, métodos, quantificação, campanhas, critérios LDAR e Petrobras documental. IDs do lote: 032, 033, 034, 035, 036, 037, 038, 039, 040, 044. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D04 — Pesquisar, redigir/aprofundar e revisar fumaça preta, partículas e interpretação de ar

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D03
- **actual_files_or_components**: docs/organic/v2/briefs/003.md; docs/organic/v2/briefs/004.md; docs/organic/v2/briefs/014.md; docs/organic/v2/briefs/041.md; docs/organic/v2/briefs/042.md; docs/organic/v2/briefs/043.md; docs/organic/v2/briefs/045.md; docs/organic/v2/briefs/046.md; docs/organic/v2/briefs/047.md; docs/organic/v2/briefs/048.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar fumaça preta, partículas e interpretação de ar. IDs do lote: 003, 004, 014, 041, 042, 043, 045, 046, 047, 048. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D05 — Pesquisar, redigir/aprofundar e revisar ruído, qualidade do ar e situações de avaliação

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D04
- **actual_files_or_components**: docs/organic/v2/briefs/015.md; docs/organic/v2/briefs/049.md; docs/organic/v2/briefs/050.md; docs/organic/v2/briefs/051.md; docs/organic/v2/briefs/052.md; docs/organic/v2/briefs/054.md; docs/organic/v2/briefs/055.md; docs/organic/v2/briefs/056.md; docs/organic/v2/briefs/057.md; docs/organic/v2/briefs/058.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar ruído, qualidade do ar e situações de avaliação. IDs do lote: 015, 049, 050, 051, 052, 054, 055, 056, 057, 058. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D06 — Pesquisar, redigir/aprofundar e revisar áreas impactadas, investigação, lacunas e interpretação

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D05
- **actual_files_or_components**: docs/organic/v2/briefs/005.md; docs/organic/v2/briefs/016.md; docs/organic/v2/briefs/059.md; docs/organic/v2/briefs/060.md; docs/organic/v2/briefs/061.md; docs/organic/v2/briefs/062.md; docs/organic/v2/briefs/063.md; docs/organic/v2/briefs/064.md; docs/organic/v2/briefs/065.md; docs/organic/v2/briefs/066.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar áreas impactadas, investigação, lacunas e interpretação. IDs do lote: 005, 016, 059, 060, 061, 062, 063, 064, 065, 066. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D07 — Pesquisar, redigir/aprofundar e revisar licenciamento, condicionantes, documentos e renovação

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D06
- **actual_files_or_components**: docs/organic/v2/briefs/007.md; docs/organic/v2/briefs/017.md; docs/organic/v2/briefs/018.md; docs/organic/v2/briefs/067.md; docs/organic/v2/briefs/068.md; docs/organic/v2/briefs/069.md; docs/organic/v2/briefs/070.md; docs/organic/v2/briefs/071.md; docs/organic/v2/briefs/072.md; docs/organic/v2/briefs/073.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar licenciamento, condicionantes, documentos e renovação. IDs do lote: 007, 017, 018, 067, 068, 069, 070, 071, 072, 073. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D08 — Pesquisar, redigir/aprofundar e revisar SMS, auditorias e fundamentos/preparação HAZOP

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D07
- **actual_files_or_components**: docs/organic/v2/briefs/008.md; docs/organic/v2/briefs/010.md; docs/organic/v2/briefs/074.md; docs/organic/v2/briefs/075.md; docs/organic/v2/briefs/076.md; docs/organic/v2/briefs/077.md; docs/organic/v2/briefs/078.md; docs/organic/v2/briefs/079.md; docs/organic/v2/briefs/080.md; docs/organic/v2/briefs/081.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar SMS, auditorias e fundamentos/preparação HAZOP. IDs do lote: 008, 010, 074, 075, 076, 077, 078, 079, 080, 081. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## D09 — Pesquisar, redigir/aprofundar e revisar treinamentos, equipe HAZOP, equipamentos e fechamento do catálogo

- **specification**: 04-original-content-and-90-urls + 06-editorial-operations
- **requirement_ids**: S04-R01; S04-R02; S04-R03; S06-R02
- **priority**: P2
- **dependencies**: D08
- **actual_files_or_components**: docs/organic/v2/briefs/011.md; docs/organic/v2/briefs/012.md; docs/organic/v2/briefs/083.md; docs/organic/v2/briefs/084.md; docs/organic/v2/briefs/085.md; docs/organic/v2/briefs/086.md; docs/organic/v2/briefs/087.md; docs/organic/v2/briefs/088.md; docs/organic/v2/briefs/089.md; docs/organic/v2/briefs/090.md; content/documents/<id>.json (novos quando ausentes); scripts/catalog.mjs (correção da origem das relações)
- **concrete_change**: Pesquisar, redigir/aprofundar e revisar treinamentos, equipe HAZOP, equipamentos e fechamento do catálogo. IDs do lote: 011, 012, 083, 084, 085, 086, 087, 088, 089, 090. Seguir pergunta, fronteira, artefato e fontes específicas de cada brief. Corrigir relações/fontes na origem sem substituir corpus publicado automaticamente.
- **skill_and_reference**: Briefs V2, disciplina de pesquisa primária; Impeccable/Taste na apresentação de conteúdo.
- **acceptance_test**: Dez intenções distintas; exemplos e artefatos previstos; fontes com versão/jurisdição; links únicos elegíveis; revisão por hash; público só após aceite.
- **evidence_to_save**: Notas próprias de leitura, diffs por versão, revisão e prévia de cada ID.
- **human_dependency**: Especialista por assunto e confirmação institucional apenas para afirmações pertinentes; nunca inventar aprovação.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Dependente de pesquisa técnica para afirmações; redação assistida e prévia local após aprovação.
- **estimated_effort**: Estimativa de referência: 4–8 h por conteúdo + revisão humana; reavaliar após pesquisa específica.
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## E01 — Executar regressão completa, ativos/fontes, acessibilidade e protocolo de performance; validar conteúdo elegível no candidato sem esperar 90.

- **specification**: 05-technical-seo-and-quality + 07-measurement-and-release
- **requirement_ids**: S05-R01; S05-R02; S05-R03; S05-R04; S07-R02
- **priority**: P2
- **dependencies**: B08; C01; C02; C03; C04; C05
- **actual_files_or_components**: tests/editorial.test.mjs; tests/artifact.test.mjs; todas as famílias em design-coverage.csv
- **concrete_change**: Executar regressão completa, ativos/fontes, acessibilidade e protocolo de performance; validar conteúdo elegível no candidato sem esperar 90.
- **skill_and_reference**: Impeccable audit/adapt/polish; Taste revisão renderizada; Accessibility/Schema.
- **acceptance_test**: 17 rotas e novas famílias; HTTP/HTML/JSONLD/sitemap; nenhuma fuga de drafts; budgets e manual por família; falhas resolvidas.
- **evidence_to_save**: Logs reais, capturas, métricas com protocolo e checklist de limites.
- **human_dependency**: NVDA e ambiente de laboratório quando disponíveis; não simular resultado.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 8–16 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## F01 — Preparar candidato com digest, inventário de rotas e aprovações; ensaiar reversão local; manter manifesto atual e publicação inalterados.

- **specification**: 06-editorial-operations + 07-measurement-and-release
- **requirement_ids**: S06-R03; S07-R02
- **priority**: P2
- **dependencies**: E01
- **actual_files_or_components**: scripts/editorial.mjs; scripts/editorial-cli.mjs; scripts/build.mjs; manifesto candidato e artefato anterior (novos artefatos locais)
- **concrete_change**: Preparar candidato com digest, inventário de rotas e aprovações; ensaiar reversão local; manter manifesto atual e publicação inalterados.
- **skill_and_reference**: Contratos S06/S07 e VALIDATION-AND-RELEASE.md.
- **acceptance_test**: Candidato reproduzível; saída válida; rollback local; zero deploy/cron/push automático.
- **evidence_to_save**: Hashes, logs e instrução de retorno ao artefato anterior.
- **human_dependency**: Aprovações reais dos conteúdos incluídos; release técnico pode ter zero novos conteúdos.
- **permission_needed**: Aprovação de implementação local da fase; publicação separada.
- **classification**: Executável localmente após aprovação do plano.
- **estimated_effort**: 2–4 h
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## F02 — Somente após autorização específica, publicar candidato aprovado e verificar status/HTML/CDN; checar24/72 h; executar retorno se autorizado e necessário.

- **specification**: 07-measurement-and-release
- **requirement_ids**: S07-R02; S07-R03
- **priority**: P2
- **dependencies**: F01
- **actual_files_or_components**: configuração de hospedagem existente; artefato candidato aprovado; verificações públicas após release
- **concrete_change**: Somente após autorização específica, publicar candidato aprovado e verificar status/HTML/CDN; checar24/72 h; executar retorno se autorizado e necessário.
- **skill_and_reference**: Plano de release e evidências, sem automação estética.
- **acceptance_test**: Domínio/rotas/canonical/sitemap/robots/404 corretos no provedor; relatórios com data e limitações.
- **evidence_to_save**: Logs do provedor e verificações públicas reais.
- **human_dependency**: Autorização específica de publicação e acesso do titular.
- **permission_needed**: Não autorizada nesta entrega. Exige autorização explícita do candidato/alvo e reversão.
- **classification**: Dependente de permissão/acesso externo.
- **estimated_effort**: 2–4 h + observação
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

## M01 — Configurar apenas medição aprovada sem PII; separar clique de contato recebido e oportunidade; analisar marca/serviço/cluster em2/4/8 semanas.

- **specification**: 07-measurement-and-release
- **requirement_ids**: S07-R01; S07-R03
- **priority**: P2
- **dependencies**: F02
- **actual_files_or_components**: src/lib/contact.ts; integrações de medição somente após acesso/autorização
- **concrete_change**: Configurar apenas medição aprovada sem PII; separar clique de contato recebido e oportunidade; analisar marca/serviço/cluster em2/4/8 semanas.
- **skill_and_reference**: Medição proporcional e privacidade por fluxo.
- **acceptance_test**: Sem PII em eventos/URLs/logs; fonte e período declarados; sem acesso registrado como não medido.
- **evidence_to_save**: Baseline, payloads mínimos e relatórios com limitações.
- **human_dependency**: Acesso GSC/GA/CRM e consentimentos/configuração pertinentes.
- **permission_needed**: Não autorizada; exige permissão/acesso externos específicos.
- **classification**: Dependente de permissão/acesso externo.
- **estimated_effort**: 4–8 h + observação
- **rollback**: Restaurar somente arquivos tocados a partir do snapshot do estado sujo anterior à tarefa; preservar alterações concorrentes e corpus; não usar reset/clean.
- **status**: planejado; não implementado

