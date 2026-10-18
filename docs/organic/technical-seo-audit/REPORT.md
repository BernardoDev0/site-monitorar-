# Monitorar — auditoria técnica de indexabilidade

Data: 2026-10-18. Referência inicial: commit 3cf28cc. Domínio canônico confirmado pelo proprietário: https://www.monitorarconsultoria.com.br.

## Diagnóstico anterior às correções

| Item solicitado | Resultado | Evidência |
|---|---|---|
| HTML bruto dos artigos | PASS | 90/90 artigos completos no HTML inicial, incluindo tabelas, sem depender do JSON de hidratação. |
| Contadores da Home | PASS | 16, 800%, 33ª e 100+ presentes como texto, sem execução de JavaScript. |
| Sitemap | PASS | HTTP 200 application/xml, 121 URLs totais, 90 artigos, lastmod ISO 8601. |
| Links reais | PASS | Home → três artigos de emissões fugitivas/LDAR em um salto; demais 87 em dois saltos. Nenhum artigo órfão. |
| Metadados e JSON-LD | PASS | Títulos e descrições únicos, canonical www, Open Graph e Article completos. Article já era válido. |

Antes da edição, a auditoria de produção foi salva em before.json. Seus 94 apontamentos adicionais correspondem a 90 datas públicas de rascunho anteriores à publicação e quatro variantes de redirecionamento temporário. Não significam 94 páginas quebradas nem comprovam a causa de exclusão do índice Google.

A arquitetura é React/Vite com SSG customizado: renderToString no build, HTML por rota em dist e hydrateRoot no navegador. Não foi necessário migrar framework, adicionar outro pré-renderizador ou recriar destaques do blog.

## Alterações implementadas

1. `scripts/public-dates.mjs` calcula a última alteração pública como o maior instante entre first_published_at e substantive_updated_at, sem usar relógio de build. Datas inválidas provocam erro; páginas sem data mantêm lastmod ausente.
2. JSON-LD e sitemap usam essa mesma função. Para a publicação inicial dos 90 artigos, o resultado passa a ser 2026-10-18T19:12:02.612Z. O histórico de edição dos rascunhos, as aprovações e os recibos permanecem intactos.
3. Artigos especializados de Article para BlogPosting, preservando @id, autor, publisher, imagens, headlines e datas de publicação. Organization inclui knowsAbout para Engenharia Ambiental, Emissões Fugitivas e LDAR, assuntos existentes no conteúdo.
4. Redirecionamento na Vercel corrigido. Projeto site-monitorar, domínio monitorarconsultoria.com.br: redirect=www.monitorarconsultoria.com.br, redirectStatusCode=null → 308. A configuração de domínio precedia a regra permanente já existente em vercel.json. Alteração feita pelo endpoint PATCH de domínio do projeto, sem modificar DNS, outros projetos ou verificação de propriedade. HTTP confirmado como 308 com preservação de caminho e query string.

Nenhum texto editorial, valor de estatística, URL canônica, imagem, layout, animação ou configuração de Analytics foi modificado. Nenhum artigo novo, envio automático ao Google ou solicitação de indexação foi feito.

## Validações

- Build público e build de prévia aprovados; prévia continua noindex e sem sitemap público.
- TypeScript aprovado; 40 testes aprovados. Lint sem erros, com os oito avisos preexistentes.
- Auditoria local: 121 URLs, 90 artigos, zero falhas. Verifica corpo dentro de main excluindo scripts, listas e todas as células de tabelas, metadados únicos, schema, cronologia, sitemap, links e estatísticas.
- Chrome com JavaScript desativado: Home, blog, página 8 e dois artigos prioritários legíveis, H1 e canonical corretos.
- Build repetido sem alteração de conteúdo: sitemap SHA-256 estável C50A600509488B64FD4922498A9381DC902BA6A67510BC702F146F9F3D2CB127.
- Em produção, o auditor também compara o conteúdo e metadados servidos ao User-Agent Googlebot e ao navegador comum. Isso simula requisições com esse cabeçalho; não equivale a uma visita da infraestrutura real do Google.

Comandos reproduzíveis (Python padrão para auditoria HTTP; Playwright e Chrome para teste visual sem JavaScript):

```text
npm run build
npm run build:preview
npm run typecheck
npm test
npm run lint
python scripts/audit-indexability.py --output docs/organic/technical-seo-audit/local.json
python scripts/audit-indexability.py --base https://www.monitorarconsultoria.com.br --output docs/organic/technical-seo-audit/production.json
python scripts/check-seo-nojs.py --base https://www.monitorarconsultoria.com.br --output docs/organic/technical-seo-audit/nojs-production.json
```

## Verificação da publicação

Implementação publicada pelo commit `463586df02ca9c5b2de7fa9ff858b78e9fffeb03`, enviado para `origin/main`. O status de implantação consultado no GitHub retornou `success`.

- `production.json`: auditoria HTTP do domínio canônico concluída com 121 URLs, 90 artigos e zero falhas, incluindo comparação dos agentes de usuário, metadados, corpo editorial, sitemap e redirecionamentos.
- `nojs-production.json`: cinco páginas aprovadas no Chrome com JavaScript desativado, incluindo Home, listagem, paginação e os artigos de emissões fugitivas e LDAR.
- Os cinco critérios solicitados permanecem PASS em produção. Não há pendência de implantação das correções desta entrega.

## Acompanhamento do índice Google

Sitemap processado com 121 URLs foi confirmado anteriormente pelo proprietário. O número de artigos efetivamente indexados e a causa de eventual exclusão ainda não foram aferidos com dados de inspeção do Search Console. Não afirmar que só a Home está indexada, que todos os artigos já foram indexados, nem que estas mudanças garantem primeira página.

Próxima evidência necessária: inspeção de URL de /blog/o-que-sao-emissoes-fugitivas, /blog/o-que-e-ldar e /servicos/emissoes-fugitivas, incluindo última leitura, canonical escolhida e motivo de exclusão quando houver. A sessão autenticada dessa conta continua fora do navegador controlado. Não há pendência de reconstrução de renderização no código.

Referências: https://developers.google.com/search/docs/appearance/structured-data/article e https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap . Datas refletem alteração real da versão pública; não são atualizadas para simular frescor.

Se houver necessidade de rollback do código, reverter apenas o commit desta entrega; preservar conteúdo e recibos. O redirecionamento permanente é uma alteração separada na Vercel e deve ser tratado separadamente, sem presumir que git revert o modifique.
