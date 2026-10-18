# Contratos de implementação

- `content/business.json`: identidade pública central, somente dados já visíveis ou confirmados. Contatos usados pelo frontend e schema; sameAs aponta exclusivamente para perfis da Monitorar.
- `content/topics.json`: nove temas com slug, rótulo, destino comercial e consultas pesquisadas. Consultas orientam o mapa, não são renderizadas como lista de palavras-chave no site.
- Coleções: oito novas URLs /conteudos/qualidade-do-ar, /conteudos/ruido-ambiental, /conteudos/areas-impactadas, /conteudos/licenciamento-ambiental, /conteudos/seguranca-de-processos-e-gestao-sms, /conteudos/hazop, /conteudos/treinamentos, /conteudos/equipamentos. O hub /conteudos/emissoes-fugitivas mantém seu texto e passa a listar os artigos. Coleções vazias não geram páginas indexáveis.
- Projeção editorial: first_published_at, service_links, serviços resolvidos, tema e breadcrumbs. Tipo collection reaproveita o layout de listagem, sem misturar artigos na contagem editorial aprovada. Entradas de coleções são projeções compactas; não carregam cópias dos corpos integrais.
- Serviços: destinos resolvidos contra páginas públicas, aliases convertidos à canonical, fragmentos úteis preservados, duplicatas e autorreferências removidas. Todos os artigos têm destino contextual.
- Publicação: `publication-receipts.json` guarda versão, data de captura, primeira publicação e evidências de fonte aprovadas. Recibos iniciais capturam as versões já aprovadas; não representam uma nova revisão técnica. Renderização valida material e autorização atuais contra recibo. Fonte atual indisponível/alterada ou revisão vencida gera manutenção, sem apagar URL já publicada. Nova versão continua exigindo validação estrita.
- `prepare-release`: versões idênticas podem reaproveitar recibos; versões novas precisam passar validação atual e recebem novo recibo. Release gera manifesto e recibos candidatos, sem promovê-los ou publicar automaticamente.
- Checagem de fontes: allowlist explícita dos hosts do corpus, HTTPS, sem credenciais/portas, até três redirects igualmente verificados, timeout 15s, limite 20MB por fonte e 50 URLs por execução. Falha é registrada por URL. Mudança de bytes não renova revisão.
- Verificação de propriedade: GOOGLE_SITE_VERIFICATION e BING_SITE_VERIFICATION opcionais no build, tokens reais e formato validado, sem valores fictícios. Não são credenciais de API. Sem configuração, nenhuma metatag é emitida.
- Schema: Article recebe publicação real, imagem da capa e idioma; Organization recebe identidade pública; breadcrumbs do HTML e JSON-LD seguem mesma sequência. Sem ratings ou FAQ rich results artificiais.

## Critérios de aceite

Preservar as 113 URLs canônicas anteriores e todos os textos técnicos. Oito coleções adicionais resultam em 121 URLs atualmente. Testar links/fragmentos, navegação nos nove temas, autoria, datas, imagens, canonical e indexabilidade. Simular fontes envelhecidas e alteradas, autorização revogada, material adulterado e recibo ausente. Verificar metatags opcionais sem injeção de HTML. Conferir desktop e celular sem overflow ou conteúdo dependente de animação. Não confundir testes locais com índice do Google.
