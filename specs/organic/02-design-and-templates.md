# Design e templates

## Objetivo e requisitos
REQ-DESIGN-01. Preservar identidade e componentes úteis; leitura72ch, hierarquia, links reais, foco e reduced motion. Impeccable contexto/teach e revisão incremental; sem alegar craft completo.

## Evidências de entrada
Missão, auditoria16/10/2026, briefing local, código b253b47 e escolhas confirmadas pelo proprietário.

## Decisão e alternativas
Preservar identidade e componentes úteis; leitura72ch, hierarquia, links reais, foco e reduced motion. Impeccable contexto/teach e revisão incremental; sem alegar craft completo. Reutilização escolhida em lugar de migração de framework, CMS pago ou reconstrução.

## Componentes e modelo
PRODUCT.md; DESIGN.md; src/editorial
EditorialPage recebe apenas projeção pública. Serviço/artigo/hub/case/company compartilham shell com hierarquia específica.

## Não objetivos
Produção, DNS, alteração de contas, compra de serviços, campanhas e publicação recorrente. Não fabricar prova comercial.

## Riscos e dependências
Mudanças em shell devem preservar legados; dados novos precisam de autoria/revisão; nenhuma indisponibilidade externa é tratada como aprovação. Configuração real de CDN/conta exige validação posterior autorizada.

## Aceite e testes
Navegador390/768/1440px; teclado, console, captura e formulário controlado.
Resultados efetivos em docs/organic/validation.md; pendências em execution-state.md.
