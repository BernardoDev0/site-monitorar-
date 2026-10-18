# Conteúdo e90URLs

## Objetivo e requisitos
REQ-CONTENT-01;REQ-ENTITY-01. 90propostas distintas com briefs; primeiro lote10rascunhos; não contar aliases ou legais. Reutilizar URLs adequadas e revisar conflitos de intenção.

## Evidências de entrada
Missão, auditoria16/10/2026, briefing local, código b253b47 e escolhas confirmadas pelo proprietário.

## Decisão e alternativas
90propostas distintas com briefs; primeiro lote10rascunhos; não contar aliases ou legais. Reutilizar URLs adequadas e revisar conflitos de intenção. Reutilização escolhida em lugar de migração de framework, CMS pago ou reconstrução.

## Componentes e modelo
content/catalog.json; content/documents; docs/organic/url-map.csv
12serviços+6hubs+72guias/artigos. Ideia/brief/rascunho/revisões/aprovado/publicado separados. Pessoas/evidências em registro privado.

## Não objetivos
Produção, DNS, alteração de contas, compra de serviços, campanhas e publicação recorrente. Não fabricar prova comercial.

## Riscos e dependências
Mudanças em shell devem preservar legados; dados novos precisam de autoria/revisão; nenhuma indisponibilidade externa é tratada como aprovação. Configuração real de CDN/conta exige validação posterior autorizada.

## Aceite e testes
Validação Zod e contagens; revisão humana específica antes de aprovação.
Resultados efetivos em docs/organic/validation.md; pendências em execution-state.md.
