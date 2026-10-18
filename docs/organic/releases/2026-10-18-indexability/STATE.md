# Publicação e descoberta — 18/10/2026

Autorização do proprietário para publicar todos os arquivos recebida nesta conversa. Não é necessária nova autorização de deploy. Publicação editorial ainda não executada: revisão humana pertinente não foi informada, conforme requisito explícito da missão original (PROMPT_CODEX_SEO_CONSULTORIA_AMBIENTAL.md, linhas 314–326). Pergunta enviada sobre responsável técnico real, identidade autorizada e conclusão da revisão. Não inventar autoria, aprovação técnica, evidência ou datas.

## Evidência atual

- `live.json`: consulta direta ao domínio de produção. Robots HTTP 200 permite Googlebot, Bingbot e demais agentes via `User-agent: * / Allow: /`. Sitemap XML HTTP 200 com 10 URLs institucionais canônicas.
- Home: HTTP 200, index/follow. Blog: HTTP 200, noindex/follow. Artigo `/blog/o-que-sao-emissoes-fugitivas` e serviço `/servicos/emissoes-fugitivas`: HTTP 404. Não é possível indexar essas páginas enquanto não forem publicadas.
- Corpus: 94 documentos, sendo 90 artigos, 3 serviços e 1 hub. Todos em technical_review, claims pending, sem autor/revisor e sem data de revisão. Manifesto editorial público vazio. Catálogo de propostas: 108 (inclui 90 artigos).
- `sources.json`: 18 fontes consultadas; 17 responderam HTTP 200. Manual Dräger não pôde ser verificado por erro de cadeia TLS no Python; tentativa independente com PowerShell expirou em 20 segundos. Não significa que a fonte inexista. HTTP 200 não equivale a revisão técnica ou comprovação das alegações.
- O documento 009 ocupa `/servicos/hazop`, URL institucional existente. Promoção exige comparação e preservação da página anterior, além do registro explícito em legacy_promotions; não foi feita substituição silenciosa.

## Alteração local

Corrigido `scripts/editorial-cli.mjs status`: contagem real do catálogo (108 propostas/90 artigos) e do manifesto editorial (0), eliminando mensagem falsa de que não havia deployment. O comando diferencia manifesto local de comprovação em produção/indexação. Nenhum conteúdo ou validador de publicação foi alterado.

Validação: 11 testes editoriais aprovados e execução do status com as contagens esperadas. Sem mudança na aplicação, não foi repetida a suíte visual. Nenhum novo commit, push ou deploy nesta rodada.

## Continuação

1. Receber informação factual sobre revisão humana e identidades autorizadas, incluindo autoria. Se ainda não houve revisão, manter pendente; autorização de publicação não demonstra revisão técnica.
2. Resolver a consulta à fonte Dräger, revisar pertinência e alegações por documento, reconciliar registro de fontes com evidências sem confundir resposta HTTP com aprovação técnica.
3. Registrar revisões reais e versões aprovadas; tratar HAZOP sem remover conteúdo existente.
4. Simular e preparar manifesto, atualizar testes que hoje comprovam a exclusão dos rascunhos, verificar publicação/paginação/links/canonicals/schema/sitemap, executar build e testes. Commit e push autorizados após esses requisitos.
5. Verificar deployment e URLs reais. Search Console não está conectado nesta sessão: indexação, impressões e cliques não medidos. Solicitação de indexação/sitemap na conta depende de acesso.

Robots permite acesso; não assegura rastreamento, indexação, posicionamento ou citação por IA. Não foram verificados logs ou regras de firewall para IPs reais dos crawlers. Google informa que o rastreamento pode levar dias a semanas e não garante inclusão: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl . OAI-SearchBot é o agente de busca do ChatGPT, distinto de GPTBot para treinamento: https://developers.openai.com/api/docs/bots . O wildcard atual permite ambos; não houve mudança nessa política.

## Atualização após indicação de responsável

O proprietário indicou Bernardo Tavares e solicitou push. Nome autorizado cadastrado nos 94 documentos como autor e revisor designado; nenhuma qualificação profissional foi atribuída. Revisão concluída não foi declarada: reviewed_at, claim_status, status e manifesto público permanecem intactos. Build público aprovado (17 rotas institucionais, 0 documentos editoriais, 10 URLs no sitemap) e 11 testes editoriais aprovados. Push solicitado para origin/main inclui cadastro, correção do status e evidências da auditoria; não equivale à publicação dos artigos.

## Publicação autorizada após confirmação da revisão

O proprietário confirmou explicitamente: "EU JA REVISEI DA PUSH LOGO". Registrada a confirmação em nome autorizado de Bernardo Tavares, com data de registro atual; nenhuma certificação independente foi atribuída. Liberados 94 documentos: 90 artigos, 3 serviços e 1 hub. Fontes: 18/18 acessíveis, incluindo manual Dräger HTTP 200 pela execução Node com TLS validado (SHA no registry). Revisão futura programada para 180 dias. Manifesto anterior preservado no histórico e no Git.

HAZOP: promoção explícita da URL existente que antes renderizava a página genérica de serviços; essa página genérica continua em /servicos e /servicos/seguranca. Textos dos 94 documentos mantidos. Blog com oito páginas; 113 URLs canônicas no sitemap; busca interna inclui artigos. Robots continua permitindo rastreamento. Build público e preview aprovados; 29 testes aprovados, incluindo todos os 94 documentos com HTML, autor, canonical, index/follow, H1 único e inclusão no sitemap; links e imagens internos resolvem. Testes de exclusão de rascunhos atualizados para estado publicado, mantendo validação de aprovação, revisão, fontes e credenciais.

Limites: publicação não comprova indexação ou posição no Google. Search Console ainda não conectado. Validador atual exige fontes verificadas há até sete dias: revalidar antes de futuros builds após esse prazo. Próxima etapa: push main e conferência do deployment e URLs públicas.
## Redes sociais na primeira tela — 18/10/2026

Instagram e LinkedIn adicionados acima do título da home, com ícones, nomes visíveis e links oficiais já usados no rodapé. Alvos de toque de 44px, foco visível, abertura segura em nova aba e ajuste responsivo. Identidade, vídeo, textos e CTA existentes preservados. Impeccable aplicado como refinamento da identidade existente; sem geração de imagens necessária.

Validação: typecheck e build aprovados (94 documentos, 113 URLs no sitemap). Navegador Chromium em 1440x900, 390x844 e 320x640: ambos os links visíveis na primeira tela e sem overflow horizontal; destinos conferidos. Capturas e resultado local em .organic/home-social-*.png e .organic/home-social-check.json.
