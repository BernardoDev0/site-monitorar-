# Implementação local V2

## Resultado e limites

O site inteiro recebeu a direção Campo e precisão. O blog, os templates, a busca e a paginação agora existem em código e HTML estático. A entrega editorial ainda não atingiu 90 conteúdos: há 18 rascunhos e zero aprovações humanas. A prévia editorial e o artefato público são deliberadamente diferentes.

## Arquivos principais

- `src/site.css`: identidade, tipografia, espaços, navegação, layouts comerciais/institucionais e responsividade.
- `src/components/Header.tsx`, `Footer.tsx`, `PageIntro.tsx`, `FeaturedArticles.tsx`: navegação, contatos, padrões compartilhados e curadoria explícita.
- `src/pages/*`: home, empresa, serviços, clientes, depoimentos, carreiras, contato, privacidade e 404. URLs anteriores preservadas; fatos não comprovados não ampliados.
- `src/editorial/EditorialApp.tsx`, `Search.tsx`, `ContentContext.tsx`, `types.ts`, `editorial.css`: artigo/serviço/hub, listas, busca, tabela, contexto de links elegíveis e estados.
- `src/App.tsx`, `main.tsx`, `entry-server.tsx`: renderização/hidratação coerentes e remoção de providers não utilizados.
- `scripts/editorial-pages.mjs`: listagens, paginação de 12 e política dos estados vazios.
- `scripts/editorial.mjs`, `editorial-cli.mjs`: invariantes, nomes autorizados, pausa, candidato separado e hash do arquivo.
- `scripts/build.mjs`, `serve.mjs`, `vercel.json`: staging, isolamento público/rascunho, redirects locais e configuração para futura hospedagem.
- `content/documents/002,006,009,013,019,021,022,023,053,082.json`: dez pilotos aprofundados com quadros próprios.
- `content/documents/024–031.json`: oito artigos novos sobre orçamento, planejamento, cadastro, acesso, reparo, registros, indicadores e leitura de relatório.
- `content/catalog.json`: decisões V2 reconciliadas por ID. Meta continua 90, sem contar índices, busca, paginação ou aliases.
- `tests/v2.test.mjs`, testes existentes atualizados, `scripts/verify.mjs`, `browser-check.py`, `check-live.mjs`: verificação automatizada, navegador e diagnóstico HTTP somente leitura.

## Skills e decisões aplicadas

Impeccable: contexto e direção já confirmados; referências craft, brand, spatial/typography, responsive e interaction. Taste: composição assimétrica, estados reais, legibilidade e redução de padrões decorativos. Identidade existente (DM Sans, azul/verde) prevaleceu sobre defaults das skills. Sem geração nativa de imagens disponível: usado o fallback aprovado de tipografia e diagrama conceitual próprio, identificado como tal. Não há imagem sintética apresentada como projeto real.

Webapp-testing: Python Playwright/Chromium, capturas e interações em navegador. Accessibility: foco, landmarks, alternativas sem JS, reduced motion, labels e Lighthouse. Não se declara auditoria WCAG integral.

## Como verificar localmente

```powershell
npm run verify
npm run preview
```

Em outro terminal, para avaliar os rascunhos:

```powershell
npm run preview:editorial
```

Com a prévia editorial ativa:

```powershell
python scripts/browser-check.py
```

`npm run verify` produz logs e `verification.json` em `evidence/implementation`. Não instala dependências nem publica. O script de navegador exige o Playwright/Chromium já disponível neste ambiente.

## Antes de push/publicação

Não executar `git reset`, `git clean` ou substituir alterações indiscriminadamente. O estado sujo anterior foi arquivado e a comparação por hash distingue esta continuação do trabalho anterior.

O artefato público atual contém as páginas institucionais redesenhadas e um blog vazio honesto. Os 18 rascunhos são exclusivos da prévia. Fazer push do código não constitui aprovação editorial. Para liberar novos textos: revisão técnica, evidências, autor/revisor/approver autorizados, fontes verificadas e hash aprovado devem estar consistentes. `prepare-release` gera `.organic/release-candidate.json`, sem alterar `content/published.json`.

Nenhum job foi ativado. O projeto precisa de verificação da configuração real de hospedagem antes da publicação. Não foi alterada a configuração externa da Vercel nem estabelecido um novo deploy automático.

Depois da publicação autorizada:

```powershell
node scripts/check-live.mjs
```

Esse comando faz somente GETs no domínio: HTML, canonical, robots, sitemap, URLs canônicas, 404 e redirect de paginação. Não envia URLs ao Google. A inspeção no Search Console, submissão do sitemap quando apropriada e observação de impressões/indexação dependem do acesso do proprietário. Nenhum teste local garante indexação ou posição.

## Rollback

Backup da sessão em `C:/Users/Bernardo/AppData/Local/Temp/monitorar-pre-redesign-20261017.zip`. Restaurar seletivamente os arquivos desejados, confrontando alterações posteriores; nunca substituir toda a árvore sem essa comparação. Cada build conserva o artefato anterior em `dist.previous` ou `dist-preview.previous`. Não há rollback remoto necessário nesta rodada porque nada foi publicado.

## Trabalho não concluído

Pesquisa/redação de 72 propostas; revisão técnica/editorial humana dos 18 textos; comprovação e autorizações institucionais; direitos de novos ativos; rotação de credencial histórica pelo titular; acesso Search Console; validação remota de domínio/redirects/robots; métricas de campo; publicação. A meta integral permanece aberta. Veja `EDITORIAL-REVIEW.md` para o lote concretamente revisável e `EXECUTION-STATE.md` para retomar.
