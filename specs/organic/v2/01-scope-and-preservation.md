# Escopo, preservação e estado verdadeiro

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

Há 32 arquivos versionados modificados, arquivos não versionados, 17 rotas legadas e dez rascunhos. A missão V2 separa planejamento, implementação e publicação.

## Objetivo

Evoluir o site inteiro sem perder alterações, corpus, URLs, ativos ou a distinção entre prévia e público.

## Fora de escopo

Migração de framework, exclusão de histórico, alteração de DNS/contas, publicação e instalação silenciosa.

## Componentes e arquivos afetados

scripts/routes.mjs; scripts/build.mjs; scripts/serve.mjs; src/App.tsx; public/drager-catalogo.pdf; docs/organic e specs/organic anteriores; content; PRODUCT.md; DESIGN.md.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S01-R01 | Antes de editar código, registrar snapshot/hash do estado sujo e inventário das 17 rotas, aliases, PDFs e arquivos tocados. Preservar alterações concorrentes. Não usar reset/clean/stash destrutivo. A V2 ocupa diretórios separados. | Comparar hashes, rotas e PDF; nenhum arquivo anterior alterado na entrega documental. |
| S01-R02 | Distinguir autorização de documentos, implementação local e publicação. Não aprovar conteúdo em nome de pessoa nem instalar/atualizar ferramentas por inferência. Identificar arquivos novos como propostas. | Registro de permissões e git status; nenhuma ação externa automática. |

## Decisões

Manter React 18/Vite 5 e a geração estática. A meta de 90 trata de conteúdo útil; aliases e paginação não contam. O lote B é a primeira fatia visível e C completa a cobertura.

## Estados vazios, erros e falhas

Arquivo ausente ou mudança concorrente: registrar e comparar, nunca restaurar cegamente. Colisão de rota: bloquear substituição não explícita. Ativo sem direito confirmado: preservar e usar fallback no novo destaque.

## Dependências

Direção visual confirmada; autorização de cada fase. Confirmações factuais só bloqueiam alegações pertinentes.

## Critérios de aceite

Todas as rotas/ativos preservados e alterações anteriores intactas; distinção público/preview documentada.

## Testes e evidências

Hash baseline/final; diff; inventário HTTP; teste PDF e aliases; checagem de paths fora de V2.

## Riscos

Reset acidental; arquivo não versionado perdido; alegação de publicação por build local. Mitigar por snapshot e logs de escopo.

## Reversão

Restaurar apenas mudanças da tarefa a partir do snapshot do estado sujo; documentos V2 são aditivos e não substituem anteriores.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
