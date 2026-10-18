# Fontes, skills e proveniência

## Critério

Separar existência, acesso HTTP, leitura efetiva, aplicação e execução. Este pacote não instala skills nem confunde a versão local com a atual upstream. Hash identifica o arquivo, não prova sua execução. Fontes técnicas candidatas não são tratadas como parecer normativo.

## Skills efetivamente usadas

| Item | Cópia local / leitura | Origem oficial consultada | Execução e aplicação |
|---|---|---|---|
| Impeccable | C:/Users/Bernardo/.codex/skills/impeccable/SKILL.md; referência brand.md, shape.md e loader lidos | https://github.com/pbakaus/impeccable/tree/08d5b470495d242ca0470f4aeae1956c3a074f83; versão4.6.0, Apache-2.0 upstream | Somente loader local de contexto; raiz PRODUCT/DESIGN válidos, migrated:false. Contexto, três direções, hierarquia, fluxos e cobertura |
| Taste principal | C:/Users/Bernardo/.agents/skills/taste-skill/SKILL.md; leitura integral | https://github.com/Leonxlnx/taste-skill/tree/f624f37a8c650b9cc550253104925efe4c8de246; MIT upstream | Nenhum script executado; crítica do site existente, densidade, composição e conteúdo demonstrável |
| Taste redesign | C:/Users/Bernardo/.agents/skills/redesign-skill/SKILL.md; leitura integral | Mesmo commit; skills/redesign-skill/SKILL.md lido | Nenhuma instalação/automação; preservar base e diferenciar famílias |
| Accessibility | .agents/skills/accessibility/SKILL.md lido | addyosmani/web-quality-skills@afa8da942115f2961fdbfa80807ea0b232ff6c00; versão2.0; MIT conforme lock anterior | Critérios de teclado, foco, movimento e validação; não é certificação |
| Schema | .agents/skills/schema/SKILL.md lido | coreyhaines31/marketingskills@365b412152b9542499ca1439426f7fc3cc92bb65; versão2.0.2; MIT conforme lock anterior | Critérios de coerência entre JSONLD e conteúdo visível |

Commits de origem das cópias locais Impeccable/Taste: desconhecidos. Licença upstream não prova presença/equivalência de licença local. Schema/accessibility foram instaladas na rodada anterior; nesta V2 não houve instalação.

## Hashes SHA-256 conhecidos na auditoria

| Arquivo | SHA-256 |
|---|---|
| Impeccable local SKILL.md |2291f40c01e5ea13e8803ddfdfb07583057b815de26d3fa78f145cef4b19c336 |
| Impeccable upstream SKILL.md |5fb0d412928c03e62d2536adfd878ad6aad6f9ce343956aa4f7164da06da3459 |
| Taste local principal |aad50bb2af3349f7402af6b96df73472decf8de1ebb8208166761047d6f04d27 |
| Taste local redesign |899f431654883ad81d4007b1dfe7f3662c4bb1883440d9b1fc433e13ca4fb8f2 |
| Taste upstream principal |ee847084e58f5a81a46120912be9cd15f083570a6ca8f3d1a30372a720633043 |
| Taste upstream redesign |a75d547d04595fe97a5d377dddf145d029d51487a4f2a0a5a9d3b532ca3b84cd |

Taste local usa controles8/6/4 e recomendações de efeitos; upstream v2 não usa os mesmos controles e descreve scripts draw/assets/lint/inspect. Não foram instalados nem executados. Impeccable upstream possui launcher que pode baixar binário; não foi executado. Não usar comandos de uma versão como se fossem da outra.

## Resolução de conflitos e trabalho restante

Ordem: verdade/permissão → funcionalidade/acessibilidade/SEO → identidade/direção → preferência estética. Rejeitados nomes/números/datas fictícios, “Randomize dates to appear real”, troca automática de fonte, quotas de imagens/animações, placeholders como prova, loops permanentes, nova biblioteca obrigatória e migração de stack.

Impeccable foi aplicado em contexto/brand/shape; Taste em inventário, crítica e direção. Falta construir e revisar renderizações das famílias com as orientações pertinentes de ambas. A direção Campo e precisão foi confirmada pelo usuário; isso não aprova conteúdo técnico. Probes de imagem dispensados nesta etapa documental por usar acervo auditado e direções descritas; sem mockups gerados.

A skill accessibility contém uma simplificação incorreta de limiar de texto grande em px; usar WCAG:18pt normal ou 14 pt negrito. Contraste depende do par real, não só da cor da marca.

## Fontes locais e leitura

Prompt V2 integral(612 linhas); prompt anterior, PRODUCT/DESIGN, relatórios em docs/organic, seis specs,90 briefs, catálogo, dez JSONs, scripts/configurações/testes e diff confrontados pela equipe. Pasted text.txt não localizado. Não substituir ausência por leitura presumida. Fontes de16/10 são histórico; evidências desta V2 têm data própria.

## Referências públicas oficiais

| Fonte | Finalidade / estado |
|---|---|
| https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics | Consulta de orientação de HTML/renderização na auditoria; geração estática mantida |
| https://developers.google.com/search/docs/fundamentals/creating-helpful-content | Consulta sobre utilidade/autoria; sem tamanho universal de texto |
| https://developers.google.com/search/docs/crawling-indexing/robots/intro | Consulta sobre rastreamento; robots não substitui noindex |
| https://developers.google.com/search/docs/appearance/page-experience | Referência de experiência; não sustenta garantia de ranking |
| https://developers.google.com/search/docs/essentials/spam-policies | Referência de originalidade e abuso de escala; não é acusação contra concorrente |
| https://platform.openai.com/docs/bots | Orientação de bots consultada na auditoria; distinguir busca de treinamento, revalidar antes de política futura |
| https://www.ambiens.com.br/ | Pesquisa com24 corpos lidos e inventário; fonte concorrencial, não normativa |
| https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/l15190.htm | Candidata normativa; ler consolidado/alterações e aplicabilidade antes de afirmação |
| https://cetesb.sp.gov.br/areas-contaminadas/wp-content/uploads/sites/17/2023/12/Manual-GAC-3a-Edicao.pdf | Candidato técnico; capítulos pertinentes ainda pendentes |
| https://www.gov.br/mma/pt-br/assuntos/meio-ambiente-urbano-recursos-hidricos-qualidade-ambiental/qualidade-do-ar/padroes-de-qualidade-do-ar/ | Candidata para vigência de padrões; não leitura técnica concluída |
| https://www.epa.gov/compliance/leak-detection-and-repair-best-practices-guide | Candidato técnico LDAR; não obrigação brasileira automática |

Referências listadas no prompt mas sem registro de leitura efetiva não são promovidas a fontes integralmente lidas. Fontes individuais e pesquisas específicas pertencem aos briefs; disponibilidade não comprova aplicabilidade.

## Ferramentas e efeitos

Usados ambiente Node/npm existente, Git em leitura, PowerShell/Python, Playwright/Chromium já instalado e requisições públicas moderadas. Screenshot/resize DevTools e CUA falharam; fallback existente foi usado. Sem instalação, serviço pago, dados de cliente enviados, publicação, mensagens ou aprovação humana simulada.

Nesta materialização: escrita somente na V2, cópia das15 capturas, exportação de metadados/notas próprias e validação de integridade. Logs resumidos da auditoria são identificados como resumo; não fabricar transcrições brutas.
