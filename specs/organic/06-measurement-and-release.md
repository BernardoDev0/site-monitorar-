# Medição e liberação

## Objetivo e requisitos
REQ-METRIC-01;REQ-RELEASE-01. Clique de contato não é envio nem lead qualificado. Sem analytics externo. Build local não publica. Preparar release e rollback para autorização posterior.

## Evidências de entrada
Missão, auditoria16/10/2026, briefing local, código b253b47 e escolhas confirmadas pelo proprietário.

## Decisão e alternativas
Clique de contato não é envio nem lead qualificado. Sem analytics externo. Build local não publica. Preparar release e rollback para autorização posterior. Reutilização escolhida em lugar de migração de framework, CMS pago ou reconstrução.

## Componentes e modelo
src/lib/contact.ts; scripts/serve.mjs; docs/organic/validation.md
Evento local contém channel/path sem PII/query. Manifesto de publicação é versão candidata, não confirmação de deploy.

## Não objetivos
Produção, DNS, alteração de contas, compra de serviços, campanhas e publicação recorrente. Não fabricar prova comercial.

## Riscos e dependências
Mudanças em shell devem preservar legados; dados novos precisam de autoria/revisão; nenhuma indisponibilidade externa é tratada como aprovação. Configuração real de CDN/conta exige validação posterior autorizada.

## Aceite e testes
Testes locais de status, links, contatos interceptados, orçamentoJS170kB/CSS20kBgzip; dados de campo não medidos.
Resultados efetivos em docs/organic/validation.md; pendências em execution-state.md.
