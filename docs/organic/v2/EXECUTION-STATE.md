> **Escopo visual substituído em 17/10/2026.** A correção do proprietário determina recuperação seletiva e lapidação conservadora, preservando textos, seções, identidade e funcionalidades. O redesign integral abaixo é histórico, não autorização vigente. A rodada atual termina na amostra isolada da home e aguarda aprovação visual. Consulte `docs/organic/recovery/README.md`. A frente editorial permanece separada.

# Estado de execução: implementação local, 17/10/2026

A autorização mais recente do proprietário amplia a rodada documental para implementação local completa. Não houve push, deploy, DNS, contratação ou publicação automática. A direção confirmada permanece Campo e precisão.

## Alvo

Monitorar Consultoria; D:/site-monitorar--main; branch codex/organic-monitorar; base b253b47; remoto https://github.com/BernardoDev0/site-monitorar-; domínio https://www.monitorarconsultoria.com.br/.

## Implementado nesta continuação

- Redesign de home, empresa, serviços, clientes, depoimentos, carreiras, contato, privacidade e 404; header/footer comuns. As 17 rotas legadas e seus canonicals foram preservados. Aliases continuam disponíveis.
- Blog sempre existente, 12 artigos por página, segunda página real na prévia, diretório de hubs, busca por termos/assunto com normalização de acentos, estados vazio/erro/carregamento, fragmento de URL e mostrar mais.
- Home com destaques editoriais por IDs explícitos e somente do conjunto elegível; navegação por HTML. Header móvel com details/summary, Escape e foco. Sem JS e com movimento reduzido, conteúdo e 14 logos continuam visíveis.
- Templates de artigo, serviço, hub, listagem e busca, incluindo tabelas semânticas com rolagem local e fontes/relacionados. Artigos não recebem hero comercial gigante.
- Contato prepara mensagem localmente, permite edição/cópia e trata falha da área de transferência. Não envia dados automaticamente e não coloca dados pessoais em eventos/URLs.
- Validação de manifesto, identidade/corpo duplicados, chave/slug, rotas reservadas, promoção explícita de legado e nomes autorizados. Pausa inválida bloqueia a operação. Candidato separado do manifesto publicado, com SHA256 verificável.
- Build público independente de rascunhos inválidos, saída em staging e promoção só após renderização bem-sucedida. Backup do artefato anterior conservado. Redirect /index e /index.html para /, paginação 1 para /blog. Configuração local da Vercel inclui redirecionamento do host sem www; comportamento remoto ainda não testado.
- Removidos providers de UI/query não usados, reduzindo o chunk App de aproximadamente 172 kB para 29 kB antes de gzip nesta implementação.
- Dez pilotos aprofundados com matrizes próprias; oito artigos novos (024–031), sem copiar textos da Ambiens. Catálogo alinhado às propostas V2, incluindo substituições 040/060 e clusters de treinamento.

## Contagens reais

| Item | Estado |
|---|---|
| Meta editorial | 90 conteúdos úteis, ainda não atingida |
| Documentos com corpo | 18: 3 serviços, 1 hub, 14 artigos |
| Artigos visíveis na prévia | 14, em duas páginas |
| Revisão técnica humana concluída | 0 |
| Conteúdo editorial público novo | 0 |
| Propostas sem corpo | 72 |
| Sitemap público local | 10 URLs canônicas legadas |
| Blog público com manifesto atual | Estado vazio honesto, noindex, fora do sitemap |

**Um push agora entrega o redesign e a infraestrutura; não entrega 90 artigos publicados nem coloca os rascunhos no Google.** A produção do restante do corpus não foi concluída e não deve ser apresentada como dependente apenas de um clique de aprovação.

## Evidências e verificação

`npm run verify` executa tipos, lint, ambos os builds e testes. Logs e contagens em evidence/implementation/verification.json. Lint: zero erros, oito avisos preexistentes. Testes de integridade, paginação, rotas, links e isolamento de rascunhos documentados nos logs.

`python scripts/browser-check.py`: 39 combinações de página/largura (390, 768, 1440), sem overflow horizontal, uma H1, imagens carregadas; interações de menu, busca, formulário e falha de cópia; navegação sem JS e reduced motion. Capturas e browser-validation.json no diretório de evidências.

Inspeção visual corrigiu logo branco no fundo claro, espaço superior herdado do header fixo, overflow do e-mail na privacidade e resumos editoriais com linguagem de planejamento. Capturas finais substituem os primeiros renders. Lighthouse móvel da home pública local: acessibilidade 100, boas práticas 100, SEO 100; não é prova de indexação, performance de campo ou conformidade WCAG integral. Preview: SEO 69 por noindex intencional. Relatórios JSON guardados. Sem NVDA, dispositivos físicos, métricas de campo ou acesso Search Console.

Leitura técnica parcial de duas fontes primárias EPA registrada em primary-source-notes.json com hashes e limites. Não foi feita leitura integral dos PDFs nem validação normativa brasileira. Não houve nova varredura da Ambiens: o inventário V2 anterior foi reutilizado.

## Preservação

Backup anterior às edições: C:/Users/Bernardo/AppData/Local/Temp/monitorar-pre-redesign-20261017.zip (458 arquivos). Comparação das alterações desta continuação em changed-from-session-baseline.json. Não usar o diff contra HEAD para atribuir a esta rodada alterações anteriores. Nenhum reset, clean ou descarte de mudanças do usuário.

Ativos existentes permanecem no projeto. Depoimentos preservam seus textos e atribuições; ratings decorativos e placeholders de avatar foram retirados. Alegações numéricas antigas, certificações universais e promessas não comprovadas não foram repetidas no novo layout; o original está no backup. Não foram fabricados casos, fotos de projetos ou vínculos comerciais. Direitos e alegações institucionais ainda precisam de validação do titular.

## Pendências e próxima execução

1. Concluir pesquisa e redação das 72 propostas restantes, por briefs específicos. Não gerar massa de páginas genéricas para fechar a contagem.
2. Revisão técnica/editorial dos 18 textos; confirmação comercial de 002/006/009; pesquisa específica de quantificação/metrologia, ruído, HAZOP e demais clusters. Responsáveis e autorização de nomes ainda não informados. Pedido assíncrono enviado ao proprietário.
3. Revisar o lote concretamente em EDITORIAL-REVIEW.md e na prévia 4174. Registrar evidências e autorizações reais; só então aprovar hashes e preparar candidato publicável. Nenhuma identidade ou aprovação foi inventada.
4. Confirmar direitos de logos/depoimentos e dados institucionais existentes; tratar a credencial histórica pelo titular (não foi rotacionada).
5. Validar configurações de hospedagem, domínio e Search Console quando houver acesso/autorização. Só o proprietário publica; não houve commit/push/PR.
6. Após publicação autorizada, executar scripts/check-live.mjs no domínio e inspecionar indexação no Search Console. A nota de SEO local não prevê posição no Google.

A interface local avançou significativamente, mas **a missão integral de 90 conteúdos revisados não está concluída**. Não relatar “tudo pronto, só push” enquanto esses itens permanecerem.

## Retomada

Ler este arquivo, IMPLEMENTATION.md, EDITORIAL-REVIEW.md, verification.json, primary-source-notes.json e os briefs das próximas propostas. Rodar npm run verify apenas após alterações que justifiquem nova validação. Prévia pública: http://127.0.0.1:4173; editorial não publicada: http://127.0.0.1:4174. Se os processos não estiverem ativos: npm run preview e npm run preview:editorial em terminais separados, após os builds.
