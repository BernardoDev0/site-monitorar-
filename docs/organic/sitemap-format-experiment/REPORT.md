# Experimento de formato de sitemap e robots — 10/11/2026

Atualização: a política de robots deste registro histórico foi substituída por [robots-ai-policy.md](../robots-ai-policy.md), a pedido do proprietário. O sitemap deste experimento permanece.

Solicitação explícita do proprietário: adotar o formato de https://www.ambiens.com.br/sitemap.xml e as regras de https://www.ambiens.com.br/robots.txt, adaptados ao domínio da Monitorar, para observar o resultado.

## Mudança isolada

- `/sitemap.xml` passa de índice para `urlset` legível e indentado, com as mesmas 126 URLs canônicas, geradas automaticamente no build.
- Cada entrada traz `loc`, a data real já existente em `lastmod`, `changefreq` semanal e `priority` 1.0 para a Home ou 0.8 para as demais URLs. Não se copia a data uniforme da referência nem a assinatura de Screaming Frog, que não gerou este arquivo.
- `robots.txt`: `User-agent: *`, bloqueios de `/doutor/`, `/inc/` e `/imagens/informacoes/thumb/`, e sitemap da Monitorar. Esses caminhos da referência não coincidem com nossas páginas ou recursos públicos. O rastreamento público continua permitido por padrão.
- Os antigos `page-sitemap.xml`, `post-sitemap.xml` e `category-sitemap.xml` continuam disponíveis para consumidores e cadastros anteriores.
- Leitores e verificadores locais aceitam o XML indentado. IndexNow mantém suporte aos dois formatos; nenhum pedido de indexação é disparado pelo build.
- HTML, conteúdo, URLs, canonical, imagens, vídeo e datas das páginas são preservados.

## Evidência e interpretação

`before.json` registra o commit anterior, robots, índice, URLs, datas e hashes dos HTMLs do artefato validado na entrega anterior. A validação posterior compara o conjunto completo e as datas, verifica que nenhum HTML mudou e testa regras de rastreamento.

Validação local concluída: build público e 98 testes aprovados; auditoria `local.json` com 126 URLs, 89 artigos ativos e zero falhas. Comparação por SHA-256 confirmou os mesmos 126 HTMLs, URLs e datas. O robô pode acessar todas as páginas para Googlebot, bingbot, OAI-SearchBot e ClaudeBot. Os campos do experimento e os três arquivos legados também foram verificados.

Este é um experimento de formato solicitado pelo proprietário, não uma correção de bloqueio encontrado. O Google ignora `priority` e `changefreq`; um sitemap é uma indicação para descoberta e não garante rastreamento, indexação ou posição. As três novas restrições do robots não mudam o acesso às URLs atuais. Fonte: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap .

Para avaliar: comparar as mesmas consultas, mecanismo, região e dispositivo em períodos de 28 dias antes/depois; registrar releitura do sitemap e métricas de impressões, cliques e posição quando houver acesso autorizado ao Search Console. Não atribuir oscilações isoladas à mudança nem misturar resultados Google e DuckDuckGo. Não foi criado agendamento nem acessada conta Google.

Rollback: reverter somente o commit deste experimento, reconstruir e publicar; o commit anterior está registrado em `before.json`. Nenhuma migração de domínio ou DNS é necessária.
