# Automação editorial local

## Objetivo e requisitos
REQ-AUTO-01. Sem cron, API paga ou publicação externa. Aprovação por hash; fontes validadas, idempotência, pausa, simulação e rollback. Última versão preservada enquanto atualização está em revisão.

## Evidências de entrada
Missão, auditoria16/10/2026, briefing local, código b253b47 e escolhas confirmadas pelo proprietário.

## Decisão e alternativas
Sem cron, API paga ou publicação externa. Aprovação por hash; fontes validadas, idempotência, pausa, simulação e rollback. Última versão preservada enquanto atualização está em revisão. Reutilização escolhida em lugar de migração de framework, CMS pago ou reconstrução.

## Componentes e modelo
scripts/editorial.mjs; scripts/editorial-cli.mjs; content/registry.json
Manifesto current/history/runs. Projeção pública exclui dados internos. Erro de fonte, aprovação ou duplicação interrompe candidato.

## Não objetivos
Produção, DNS, alteração de contas, compra de serviços, campanhas e publicação recorrente. Não fabricar prova comercial.

## Riscos e dependências
Mudanças em shell devem preservar legados; dados novos precisam de autoria/revisão; nenhuma indisponibilidade externa é tratada como aprovação. Configuração real de CDN/conta exige validação posterior autorizada.

## Aceite e testes
node --test tests/editorial.test.mjs; ciclo sintético de sucesso/falha.
Resultados efetivos em docs/organic/validation.md; pendências em execution-state.md.
