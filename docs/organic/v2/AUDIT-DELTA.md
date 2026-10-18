# Auditoria delta — 17/10/2026

## Método e escopo

Leitura integral do prompt V2 (612 linhas) na etapa de planejamento; confronto dos relatórios de 16/10 com código, seis specs anteriores, catálogo, 90 briefs, dez JSONs, manifesto, build e testes. Inspeções públicas apenas por GET. Nenhum AGENTS.md foi localizado na raiz ou em D:/; anexo Pasted text.txt não localizado. Sua ausência não foi convertida em evidência do conteúdo.

A auditoria original e sua materialização são etapas distintas. Os registros abaixo não afirmam que cada comando foi reexecutado durante a simples gravação dos documentos.

## Estado confrontado

| Tema | Verificação atual | Implicação |
|---|---|---|
| Stack | React 18, Vite 5, TS, Tailwind, Radix/shadcn | Manter geração estática existente |
| Git | codex/organic-monitorar, b253b47; 32 versionados modificados e arquivos não versionados | Preservar estado sujo e corpus anterior |
| Rotas | 17 legadas, oito famílias; aliases não são conteúdos distintos | Cobertura integral deve manter destinos |
| Editorial | 90 IDs/slugs; 12 serviços,6 hubs,72 artigos | Meta proposta, não publicação |
| Dez pilotos | technical_review; pessoas/evidências não preenchidas | Não aprovar por automação |
| Público local | 17 legadas +404; sitemap 10 canônicas; manifesto vazio | Zero novo editorial público |
| Prévia | Dez documentos +/conteudos | Índice mistura tipos; não há blog |
| /blog | 404 em público e prévia locais | Implementar entrada real, links e estados |
| Design | Heroes grandes, grades repetidas e templates similares | Redesign por tarefa e família |
| Evidência comercial | Sem GSC/GA/conversão verificada | Registrar não medido, não zero |

## Achados técnicos comprovados e tarefas

| Achado | Local | Consequência / tarefa |
|---|---|---|
| Chave do manifesto pode divergir de doc.slug | scripts/editorial.mjs, prepareRelease | Perda/substituição indevida de URL; B01 |
| Mesmo ID/corpo aceito em dois slugs na preparação | scripts/editorial.mjs | Validação diferente da simulação; B01 |
| Erro de parsing/leitura da pausa ignorado na CLI | scripts/editorial-cli.mjs | Operação segue sem pausa; falhar fechado em B01 |
| publicDocument projeta nome sem conferir authorized na prévia | scripts/editorial.mjs | Nome não autorizado exposto; B01 |
| Build público valida todo corpus antes do manifesto | scripts/build.mjs | Rascunho inválido bloqueia release técnico independente; B01 |
| Colisão com legado substitui automaticamente; utilitárias não reservadas | scripts/build.mjs e rotas | Exigir promoção explícita; B01 |
| /index.html normaliza para /index | scripts/serve.mjs | Destino incorreto; B01 |
| Projeção perde cluster e service_links | scripts/editorial.mjs | Relações frágeis; B04 |
| Testes fixam dez docs e12/6/72 | tests/editorial.test.mjs, tests/artifact.test.mjs | Testar invariantes e estados, sem impedir expansão legítima; B08 |
| Clientes invisíveis com reduced motion | src/pages/Clients.tsx e src/index.css |14 nós opacity 0/animationnone; B02 |
| Primeiro logo com alt Logo undefined | src/pages/Clients.tsx | Usar nome real ou apresentação decorativa quando apropriada; B02 |

O teste visual de Clientes comparou estilos computados: redução ativa produz opacity 0 e animationnone; sem redução produz opacity 1. Não foi inferido apenas de screenshot. A correção ainda não foi implementada.

## Achados editoriais

- 90/90 briefs repetem duas perguntas genéricas.
- 81/90 listas de vínculos contêm duplicatas; nove autolinks.
- Seis hubs são pais de si mesmos; 001 tem fronteira vazia.
- 044 depende somente de EPA; treinamento011/085/086 recebe IEC-HAZOP.
- scripts/catalog.mjs infere relações e fontes por posição/cluster: a futura correção deve atingir a origem.
- Dez resumos repetem fechamento e os corpos iniciais de 217–279 palavras não oferecem os artefatos prometidos. Não se adota meta universal de palavras.
- V2 especifica fronteira, pergunta e artefato; fontes candidatas continuam pendentes de leitura técnica.

## Produção observada

Em 17/10, home 200 entregou shell inicial de aproximadamente 1,8 k caracteres, sem H1 e com canonical sem www. /sitemap.xml retornou 200 text/html, mesmo shell; /blog retornou 200 com o shell. /robots.txt respondeu 200 e permitia rastreamento. Não atribuir à produção as correções locais; não afirmar que robots estava ausente. Não foi feito deploy nem teste de CDN após publicação.

## Verificações reexecutadas na auditoria

| Comando | Resultado |
|---|---|
| npm run build | Passou; 17 legadas,10 canônicas,0 editoriais novos |
| npm run build:preview | Passou; 10 rascunhos e índice |
| npm test |16/16 |
| npm run typecheck | Passou |
| npm run lint |0 erros; 8 avisos existentes |
| git diff --check | Passou |

Estes resultados foram registrados pela equipe na etapa de auditoria. Não há transcrição bruta nova de todos os comandos neste pacote; o resumo não foi fabricado como log. Logs anteriores em ../evidence pertencem à rodada de16/10, não à de17/10.

Chunks observados: aproximadamente 158,37 kB gzip legado/comercial e 79,54 kB editorial; CSS 14,77 kB geral +0,85kB editorial. Não inclui imagens/fontes nem representa transferência móvel total.

## Evidências visuais e limites

15 capturas reais copiadas para evidence/screenshots:12 desktop 1440 e 3 mobile 390. Foram inspecionadas. As ferramentas DevTools de screenshot/resize e CUA falharam; usou-se Python Playwright/Chromium já instalado, sem instalação. Algumas imagens lazy abaixo da dobra não foram solicitadas durante captura integral; vazio nessas regiões não prova falha funcional.

Não foram produzidas capturas de um redesign inexistente. Não houve novo Lighthouse com o protocolo V2, NVDA, medição de campo, rich-results remoto ou teste integral de todos os componentes. Acessibilidade 100 em amostra antiga não certifica todo o site.

## Ativos e preservação

Inventário observado:54 arquivos em public e 8 em src/assets. Vídeo refinaria2.mp4 ~39,8 MB; catálogo Dräger ~12,4 MB; algumas imagens ~2–2,7MB. Origem/licença não são inferidas da existência do arquivo. Planejar derivados, preservar originais/PDFs e manter vídeo sob demanda.

O baseline da materialização é evidence/preservation-baseline.json, com hashes de 321 arquivos existentes fora da V2. A validação final deve confirmar que nenhum foi alterado.
