# Robots da Monitorar — 10/11/2026

Pedido: usar Reserva Engenharia como referência, adaptando ao sistema da Monitorar e verificando descoberta por assistentes de IA. Skill utilizada: `.agents/skills/ai-seo` e sua referência de agent readiness; documentação oficial prevalece.

## Referência e implementação

Leitura de https://reservaeng.com.br/robots.txt por HTTP com User-Agent Mozilla/5.0 retornou 200: User-agent *, Disallow /wp-admin/, Allow /wp-admin/admin-ajax.php e Sitemap https://reservaeng.com.br/sitemap_index.xml. A primeira tentativa recebeu 403. São regras de WordPress, não configurações especiais de IA.

A Monitorar não usa WordPress. Removidos os bloqueios de /doutor/, /inc/ e /imagens/informacoes/thumb/ copiados da referência anterior. Agora o grupo geral permite / e um grupo explícito permite Googlebot, bingbot, OAI-SearchBot, PerplexityBot e Claude-SearchBot. Os grupos específicos são documentação explícita, não uma vantagem de ranking. A permissão geral anterior já permitia esses agentes nas páginas públicas.

O build acrescenta uma única diretiva Sitemap com https://www.monitorarconsultoria.com.br/sitemap.xml. O sitemap e os HTMLs permanecem iguais. /busca continua rastreável para leitura do noindex; previews continuam com Disallow: /. Nenhuma mudança de conteúdo, datas, vídeo, design ou analytics.

## Como os sistemas descobrem e usam o arquivo

Após descobrir uma URL por links, índices ou sitemaps, um rastreador consulta a localização convencional /robots.txt na raiz do protocolo e host. Não é necessário indexar esse arquivo, adicioná-lo ao sitemap nem usar PHP. A diretiva Sitemap informa onde encontrar URLs; não exige que sejam indexadas ou citadas.

- Googlebot: busca Google e controle de rastreamento para recursos de IA na busca. Google-Extended é um controle distinto de certos usos do Gemini, não um requisito para ranking ou AI Overviews.
- OAI-SearchBot: descoberta para busca no ChatGPT. GPTBot é separado e relacionado a potencial treinamento. ChatGPT-User faz acessos iniciados pelo usuário, aos quais robots pode não se aplicar.
- PerplexityBot: busca. Perplexity-User faz acessos solicitados pelo usuário e geralmente ignora robots.
- Claude-SearchBot: busca. Claude-User: acesso solicitado pelo usuário. ClaudeBot: potencial treinamento.

A política geral de treinamento não foi alterada: os agentes não listados seguem a permissão geral. Não foram acrescentados llms.txt, schema especial ou regras sem suporte. CDN/WAF e status HTTP também podem impedir acesso independentemente do robots. Trocar o User-Agent numa requisição comum verifica apenas esse nome; não comprova visita ou acesso dos IPs reais desses serviços. Permissão não garante indexação, citação ou posição. OpenAI e Perplexity documentam até cerca de 24 horas para refletir mudanças de robots nos respectivos sistemas.

## Fontes oficiais consultadas

- https://developers.google.com/crawling/docs/robots-txt/create-robots-txt
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
- https://developers.openai.com/api/docs/bots
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- https://privacy.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler

## Validação

Build público e build de preview concluídos. Comparação SHA-256: 135 artefatos (HTMLs e sitemap) sem alteração. RobotFileParser validou as 126 URLs e caminhos de busca, assets, mídia e favicon para os cinco agentes explícitos, Claude-User, GPTBot e um agente desconhecido. Preview permanece bloqueado.

Suíte: 97/98 aprovados, incluindo a política de robots. Pendência independente: `preview corpus is noindex, internally linked and reachable from its index` ainda exige `/blog/o-que-sao-emissoes-fugitivas` nos índices da prévia; esse artigo foi migrado para `/emissoes-fugitivas`. Reconstruir a prévia não resolve essa expectativa. Não se alterou o teste nem o conteúdo para ocultar a falha. Esta política substitui somente a parte de robots do experimento anterior; o formato do sitemap permanece.
