# Skills e proveniência — 16/10/2026

Só duas skills adicionais foram instaladas, em escopo local .agents/skills, pelo helper oficial skill-installer com --method download e --ref fixo. Script local foi lido antes da execução; nenhum hook, instalador remoto ou script de terceiros foi executado. As skills locais ficam disponíveis para descoberta a partir do próximo turno; nesta rodada seus SKILL.md foram lidos diretamente.

| Skill | Origem / versão | Caminho | Licença | Uso e verificação |
|---|---|---|---|---|
| impeccable | pbakaus/impeccable; commit da cópia local desconhecido; SHA256 abaixo | C:/Users/Bernardo/.codex/skills/impeccable/SKILL.md | upstream Apache-2.0; licença ausente no diretório local inspecionado | leitura e loader anteriores na sessão; contexto/identidade, revisão incremental e harden; referências reais consultadas |
| schema 2.0.2 | coreyhaines31/marketingskills @ 365b412152b9542499ca1439426f7fc3cc92bb65 | .agents/skills/schema/SKILL.md | MIT, LICENSE copiada do mesmo commit | instalado e lido; graph Organization/WebSite/BreadcrumbList/Article/Service e testes |
| accessibility 2.0 | addyosmani/web-quality-skills @ afa8da942115f2961fdbfa80807ea0b232ff6c00 | .agents/skills/accessibility/SKILL.md | MIT, LICENSE copiada do mesmo commit | instalado e lido; Lighthouse, árvore acessível, teclado, contato, contraste |
| skill-installer | instalação sistêmica do ambiente, commit não informado | C:/Users/Bernardo/.codex/skills/.system/skill-installer/SKILL.md | licença não verificada nesta rodada | helper Python oficial inspecionado; download das duas skills acima |

Impeccable SKILL.md SHA256: 2291f40c01e5ea13e8803ddfdfb07583057b815de26d3fa78f145cef4b19c336. Referência upstream consultada no planejamento: 6af45ac9a5eb8792f033d3242f52e99812fd91fa; equivalência com a cópia instalada NÃO comprovada.

Dependências/permissões: skills schema/accessibility são instruções e referências Markdown; Node/npm e navegador já existentes foram usados. Skill-installer usa Python e rede pública GitHub. Nenhuma API paga, nova extensão, MCP, analytics, compra ou publicação foi ativada. Permissão usada: instalação local e implementação reversível previstas na missão.

SEO audit, site architecture, content strategy, programmatic SEO, AI SEO e web-quality foram referências consultadas durante o planejamento; não declarar essas skills instaladas ou carregadas localmente nesta rodada. Spec Kit foi usado como método SDD, sem instalar CLI.

Limite: exemplos de schema não substituem documentação oficial ou avaliação de elegibilidade. Não implementado FAQ/HowTo para prometer resultados especiais; nenhum dado fictício foi acrescentado para preencher campos.


## Skills de SEO instaladas em 19/10/2026 (pedido do proprietário: "baixa skill, utiliza skill")

| Skill | Origem / versão | Caminho | Licença | Uso |
|---|---|---|---|---|
| ai-seo | coreyhaines31/marketingskills @ 06d647eacf349eb0cbf15b8e00f1ce13c24fc2a0 | .agents/skills/ai-seo/ (SKILL.md e 15 referências) | MIT, LICENSE do mesmo commit | checklist do guia: definição no 1º parágrafo, estatística com fonte e data, resumo, data visível, nada de conteúdo separado "para IA" |
| seo-audit | coreyhaines31/marketingskills @ 06d647eacf349eb0cbf15b8e00f1ce13c24fc2a0 | .agents/skills/seo-audit/ (SKILL.md e 7 referências) | MIT, LICENSE do mesmo commit | consistência www/sem www, uma página por termo (canibalização), *rankings-push* (links internos, 3–4 semanas sem editar), *title-tags* |

SHA256 do SKILL.md: ai-seo 6ae9d428b8eb2c8378c31fd0d07f801bb6d16174c74b3da7ad53978ce86f9e9c; seo-audit e0ebb5808787f2ff26b96d7b429423874d9785541cd4ab775629a5cf1137e7a9. Baixados com `curl` do raw.githubusercontent.com no commit fixo; são instruções em Markdown, sem scripts executados.
