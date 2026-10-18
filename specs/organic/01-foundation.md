# Fundação técnica

## Objetivo e requisitos
REQ-SEO-01;REQ-SEO-02;REQ-RELEASE-01. SSG incremental em React/Vite. Registro de rotas preserva17endereços; canonicals no host www, idioma pt-BR, sitemap de canônicas e404 real.

## Evidências de entrada
Missão, auditoria16/10/2026, briefing local, código b253b47 e escolhas confirmadas pelo proprietário.

## Decisão e alternativas
SSG incremental em React/Vite. Registro de rotas preserva17endereços; canonicals no host www, idioma pt-BR, sitemap de canônicas e404 real. Reutilização escolhida em lugar de migração de framework, CMS pago ou reconstrução.

## Componentes e modelo
scripts/build.mjs; scripts/routes.mjs; vercel.json
Registro legado e manifesto de versões elegíveis. Rascunhos não entram no grafo cliente.

## Não objetivos
Produção, DNS, alteração de contas, compra de serviços, campanhas e publicação recorrente. Não fabricar prova comercial.

## Riscos e dependências
Mudanças em shell devem preservar legados; dados novos precisam de autoria/revisão; nenhuma indisponibilidade externa é tratada como aprovação. Configuração real de CDN/conta exige validação posterior autorizada.

## Aceite e testes
npm run build; npm test — HTML, aliases,404 e exclusão de rascunho.
Resultados efetivos em docs/organic/validation.md; pendências em execution-state.md.
