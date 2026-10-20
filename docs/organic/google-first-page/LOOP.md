# Ciclo de acompanhamento: "emissões fugitivas" e "consultoria ambiental" no Google

Meta inicial: o domínio aparecer entre os 10 primeiros resultados orgânicos do Google para **emissões fugitivas RJ**. Nenhuma posição é garantida; o ciclo mede, corrige o que está sob nosso controle e registra.

## Metas ampliadas (pedido do proprietário em 19/10)

Em cada consulta: **1º lugar orgânico; se não der, 2º; o máximo possível**. Quatro camadas, medidas por `scripts/rank-sweep.py` (sem personalização):

1. **Prioritárias:** "consultoria ambiental RJ" e "consultoria engenharia ambiental RJ" (alvo: `/consultoria-ambiental-rj`).
2. **Genéricas, sem cidade:** "emissões fugitivas", "LDAR", "consultoria ambiental", "engenharia ambiental" e afins (`extra-queries.csv`, tipo `head`).
3. **Por estado e cidade:** "consultoria ambiental" + SP, MG, ES, BA, PR, RS, SC, PE, CE, SE, Macaé, Niterói e outras (tipo `geo`). Escopo definido pelo proprietário em 19/10: a empresa atende **qualquer estado**, com atuação principal no RJ, em SP e no Amazonas; nenhuma página, nem a Home, pode limitar a empresa ao RJ.
4. **Os 90 artigos**, cada um na consulta de `keyword-map.csv`. Para eles o Search Console (Desempenho, por página) é a fonte principal; a varredura serve de linha de base.
5. **Respostas de IA do Google** ("Visão geral criada por IA"): a empresa ser citada no quadro. Medida por `scripts/ai-overview.py`; ver o `REPORT.md`. A posição orgânica 1ª não garante a citação.

## Medidas e seus limites

- **Sem personalização** (`google-serp.py --mode default`, leitura `neutral`): conta do Chrome dedicado seguida do link oficial "Testar sem personalização" (`peek_pws=0`). O rodapé confirma "Os resultados não são personalizados" e não aparece captcha. É a **medida principal**.
- **Conta logada** (leitura `signed`): personalizada. O Google favorece sites que a conta visita, então **infla** a posição. Só referência.
- **Janela limpa** (`--mode clean`): contexto isolado, sem cookies. Quase sempre recebe captcha; registrar `bloqueado`, nunca contornar. Opcional.
- **Search Console, Desempenho** (`gsc.py queries`): posição média real e impressões, com atraso de cerca de dois dias.
- **Inspeção de URL** (`gsc.py inspect`): estado de indexação, último rastreamento e canônica escolhida pelo Google.

## Pré-condições

1. `curl -s http://127.0.0.1:9223/json/version` responde (Chrome dedicado aberto, perfil `%USERPROFILE%\.cache\monitorar-seo-chrome`). Senão, abrir o Chrome com os parâmetros de `scripts/gsc.py`.
2. A inspeção de URL funciona (sessão do Search Console ativa). Se pedir login, registrar "login necessário" no log e encerrar o ciclo, sem perguntar nada ao proprietário.

## Meta desde 20/10, 17:30 UTC: top 3 nas 4 frases

Pedido do proprietário: "só quero que tudo esteja no mínimo top 3 em tudo, fique em loop até conseguir". Ele avisou que **não fará nenhuma ação manual** (Maps, avaliações, pedidos de link, diretórios com senha). O loop segue só com o que está sob nosso controle: o site, os sinais de indexação e os cadastros gratuitos que não pedem senha nova nem código.

- A meta vale para "emissões fugitivas", "consultoria ambiental", "consultoria ambiental RJ" e "empresa de engenharia ambiental".
- A mutação passa a valer para qualquer frase **fora do top 3**, e não só fora da página 1.
- Para as duas frases de consultoria, o top 3 de 20/10 é a lista do oHub e Homes de empresas locais, com 103 a 728 palavras. O que as separa de nós está fora da página (Perfil da Empresa no Google, histórico, links). O relato ao proprietário diz isso sem prometer posição nem prazo.

## Foco desde 20/10, 13:40 UTC: "emissões fugitivas" e "consultoria ambiental" na página 1

Pedido do proprietário: "tem que estar na primeira página em emissões fugitivas e consultoria ambiental", com o loop sempre rodando. Plano: `~/.claude/plans/foda-se-irm-o-continua-delegated-liskov.md`.

**Por que a regra de leitura mudou:** às 12:03 UTC de 20/10, uma leitura mostrou `/consultoria-ambiental-rj` em 2º em "consultoria ambiental". Às 13:30 o proprietário procurou e não achou. Às 13:3x, duas leituras (sem personalização e com conta) mostravam a Monitorar fora da página 1. Uma página nova oscila em minutos. **Posição só se afirma assim: "Xº em N de M leituras das últimas 24 h". Uma posição só é dada como certa depois de 2 leituras seguidas iguais.** Sempre com "sem personalização, IP do RJ".

Histórico anterior (ícone, sem www, varredura de 187 frases): ver `LOOP-LOG.md` e `REPORT.md`. A varredura lenta (`rank-sweep.py`) fica **pausada** enquanto o foco for este: as 8 consultas a cada 3 horas vão para as 4 frases do pedido.

## Um ciclo (a cada 3 horas, minuto 7)

1. **Trava.**
   - `curl -s http://127.0.0.1:9223/json/version` responde.
   - Nenhum captcha nas últimas 6 h (ver `LOOP-LOG.md`).
   - No máximo 8 consultas ao Google nas últimas 3 h, contando as do log.
   - Se a trava falhar, registrar o motivo no log e encerrar o ciclo.
2. **Google e gap: o motor.** `.venv-seo/Scripts/python -I scripts/serp_loop_engine.py run`.
   - Faz 4 leituras `peek`, com 90 s entre elas, e respeita sozinho a trava: para se houve captcha nas últimas 6 h e corta as frases que passariam de 8 consultas em 3 h.
   - Cada leitura entra em `evidence/engine/readings.jsonl`, de onde sai o "N de M leituras (24 h)".
   - Para cada frase, mede o nosso pilar contra o top 3: palavras, a frase por região, os termos do nicho, os bigramas, os links internos com âncora exata, os tipos de JSON-LD e o TTFB. Grava também as perguntas do "As pessoas também perguntam".
   - Relatório em `evidence/engine/<UTC>/report.md`. Código de saída 2 = captcha: registrar e pausar 6 h.
   - **Mutação:** se uma frase continua fora do top 3 e o relatório aponta gap concreto (termo do nicho que 2 dos 3 primeiros têm e nós não, região sem a frase ou bigrama comum do top 3), ajustar o pilar dessa frase. O ajuste segue as regras do plano `~/.claude/plans/foda-se-irm-o-continua-delegated-liskov.md` (Fase 3). Fluxo: teste falhando primeiro, build, suíte inteira e push.
   - **Limite:** **no máximo 1 deploy a cada 24 h** (ver a data do último commit `seo(loop)` no git).
   - **Sem gap concreto:** não mexer. A diferença está fora da página (histórico, links, Maps), e o relatório registra isso.
   - **Pergunta do "As pessoas também perguntam" sem resposta nossa** conta como gap: a resposta entra num FAQ visível (com `FAQPage`), só com fato que tenha fonte. Fila pronta na seção "Próxima mutação".
3. **Brave Search, 1×/dia.** `python scripts/brave-measure.py --headed --output docs/organic/brave-search-visibility/evidence/brave-<data>.json "emissões fugitivas" "consultoria ambiental"`. O proprietário também busca lá.
4. **Índice.**
   - `python scripts/gsc.py inspect` em `/emissoes-fugitivas`, `/` e `/consultoria-ambiental`, enquanto houver cota de inspeção.
   - Os pedidos de indexação saem na rodada diária das 07:20 UTC (fila abaixo).
5. **Sitemap, 1×/dia.** Na página Sitemaps do Search Console, conferir que o Google leu o índice `/sitemap.xml` e os 3 filhos (126 URLs).
   - O campo certo é "Insira o URL do sitemap". O campo "Inspecionar qualquer URL" é outro.
   - O botão é exatamente "Enviar".
6. **Desempenho, 1×/dia.** `python scripts/gsc.py queries --output docs/organic/google-first-page/evidence/queries-<data>.json`. Anotar impressões e posição média das 2 frases.
7. **oHub.** Perfil grátis criado em 20/10 (`https://www.ohub.com.br/empresa/monitorar-consultoria-rio-de-janeiro-rj-741022`, descrição salva). 1×/dia, abrir sem login `https://www.ohub.com.br/empresas/consultoria-ambiental/rj/rio-de-janeiro` e anotar se a Monitorar aparece na lista (20/10: 41 perfis, Monitorar fora). Nunca comprar créditos nem plano.
8. **Log.** Uma linha em `LOOP-LOG.md` com:
   - UTC;
   - cada frase como "Xº em N de M leituras (24 h)" ou "ausente em M de M", com a URL nossa;
   - o estado de índice do guia, da Home e do guia de consultoria;
   - os pedidos feitos;
   - a contagem de consultas;
   - a observação do ciclo.
9. **Relatar ao proprietário só quando algo mudar.** Conta como mudança: uma frase entrar ou sair da página 1 ou do top 3 em 2 leituras seguidas, uma URL entrar no índice ou um pedido de indexação ser aceito. O relato leva a captura de tela.
10. **Regras.**
    - Guias sem edição por 3 a 4 semanas depois de indexados.
    - Nenhuma página por variação de frase.
    - Nada sobre a situação do escritório.
    - Escopo de qualquer estado.
    - Canibalização de "emissões fugitivas" resolvida em 20/10 (artigo fundido no guia com 308); outra fusão só com aprovação.
11. **Commit diário** só de documentos (`LOOP-LOG.md`, `evidence/`) em `main`.

## Próxima mutação (pronta; sai no 1º ciclo depois de 21/10, 14:26 UTC, se as frases seguirem fora do top 3)

Perguntas do "As pessoas também perguntam" lidas em 20/10 que o site ainda não responde com a mesma pergunta:

1. **"Qual o valor de uma consultoria ambiental?"** Aparece em "consultoria ambiental" e em "consultoria ambiental RJ". Vai no FAQ de `/consultoria-ambiental-rj` e no FAQ da Home. Resposta sem preço inventado: não há tabela; o valor depende do escopo (licença ou estudo, pontos e campanhas de monitoramento, análises de laboratório, deslocamento, prazo), e a proposta comercial detalha atividades, entregas, prazos e exclusões.
2. **"O que faz uma empresa de Engenharia Ambiental?"** Aparece em "empresa de engenharia ambiental". Hoje a Home pergunta "O que faz uma empresa de engenharia e consultoria ambiental?". Acrescentar a pergunta exata ao FAQ da Home, com a parte de engenharia (projetos, monitoramentos, ART exigida em serviços de engenharia pela Lei nº 6.496/1977, art. 1º, fato já com fonte no guia de consultoria).
3. **"Quem pode dar consultoria ambiental?"** Aparece em "consultoria ambiental". Resposta pelo fato já com fonte no guia: a Lei nº 6.938/1981, art. 17, inciso I, exige o Cadastro Técnico Federal do Ibama para a consultoria técnica sobre problemas ecológicos e ambientais. Vai no FAQ da Home.
4. **"Como fazer uma denúncia no INEA RJ?"** Aparece em "consultoria ambiental RJ". Vai no FAQ de `/consultoria-ambiental-rj`. Fonte: https://www.inea.rj.gov.br/ouvidoria/ (lida em 20/10). A página diz que o Fala.BR recebe denúncias, aceita fotos e vídeos e gera um protocolo; o Núcleo de Atendimento ao Público também recebe denúncias. Para denúncia anônima de crime ambiental, o Linha Verde do Disque Denúncia (https://www.disquedenuncia.org.br/post/green-line). **Sem telefone**: as páginas do INEA trazem números diferentes. Reler a fonte no dia da mutação.

Fluxo da Fase 3: teste falhando primeiro (`tests/discovery.test.mjs`: perguntas no HTML do `dist/` e no `FAQPage`), build, suíte, commit `seo(loop): …`, push, `check-live`, `npm run indexnow`, e a Home e a página RJ no topo da fila de pedidos do dia seguinte.

## Rodada diária de pedidos (07:20 UTC, depois da renovação da cota)

Seguir a fila da seção seguinte com `python scripts/gsc.py request <URL> ... --output docs/organic/google-first-page/evidence/requests-<data>.json`. O script para sozinho em "Cota excedida". Antes de cada pedido, a inspeção de URL diz se a URL já está no índice. Riscar da fila o que entrou e registrar no log.

## Fila de pedidos de indexação (cota de cerca de 10 por dia, **por conta**, não por propriedade)

Ordem revista em 20/10, 13:10 UTC, depois da publicação da engenharia reversa (`docs/organic/reverse-engineering/`). A cota de **inspeção** da propriedade já estava esgotada nesse horário (`gsc.py request` parou no 1º pedido), então nada foi pedido em 20/10. Pedir só o que continuar fora do índice ou que mudou:

1. `https://www.monitorarconsultoria.com.br/emissoes-fugitivas` (guia; "Detectada, mas não indexada"; recebeu a fusão do artigo 019 em 20/10). **Primeiro de todos.**
2. `https://www.monitorarconsultoria.com.br/` (Home: title "Engenharia e consultoria ambiental", H1 "Empresa de engenharia e consultoria ambiental em todo o Brasil" e LocalBusiness, publicados em 20/10).
3. `https://www.monitorarconsultoria.com.br/consultoria-ambiental` (guia; "Detectada, mas não indexada"; title novo "O que é consultoria ambiental e como escolher").
4. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-rj` (já indexada; ganhou o Service no JSON-LD; title e H1 não mudaram porque ela está em 2º em "consultoria ambiental").
5. `https://www.monitorarconsultoria.com.br/servicos/ruido-extramuros` (serviço; "Detectada, mas não indexada")
6. `python scripts/gsc.py request --property apex https://monitorarconsultoria.com.br/`: o registro do sem www ainda é de 10/10, do tempo do redirecionamento 307. O pedido faz o Google ver o 308 e descartar a entrada antiga.
7. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-por-estado` ("O Google não reconhece o URL")
8. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-sp`
9. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-am`
10. `https://www.monitorarconsultoria.com.br/blog/planejamento-de-campanha-de-emissoes-fugitivas`
11. `https://www.monitorarconsultoria.com.br/blog/componentes-sem-acesso-em-programas-ldar`

Home www, `/servicos/emissoes-fugitivas`, `/conteudos/emissoes-fugitivas` e `/consultoria-ambiental-rj` **já estão indexadas** (rastreio em 19/10). `/blog/o-que-sao-emissoes-fugitivas` também estava, mas desde 20/10 responde 308 para o guia: não pedir indexação dela; o Google troca a entrada no próximo rastreio.

**Sitemap:** desde 20/10, `/sitemap.xml` é um índice com `page-sitemap.xml`, `post-sitemap.xml` e `category-sitemap.xml` (126 URLs). Reenviado no Search Console em 20/10, 13:09 UTC ("Sitemap enviado"). No próximo ciclo, conferir em Sitemaps que o Google leu o índice e os 3 filhos.

**Medida das 4 frases do pedido** ("emissões fugitivas", "consultoria ambiental", "consultoria ambiental RJ", "empresa de engenharia ambiental"): uma vez por semana, com `python scripts/google-serp.py "<frase>" --mode peek --output docs/organic/reverse-engineering/serp/<slug>-<data>.json` (1 consulta cada, dentro do limite de 8 a cada 3 h). Linha de base de 20/10: 2º e 5º com `/consultoria-ambiental-rj` nas duas de consultoria; ausente nas outras duas.

**Inspeção completa.** A cota de inspeção é **por propriedade**, renova diariamente e acabou depois de cerca de 40 URLs. Em cada ciclo, enquanto ela durar, inspecionar as URLs do sitemap que ainda não estão em `evidence/inspection-2026-10-20.json` (87 em 20/10). `gsc.py inspect` para sozinho com `quotaExceeded`. Acrescentar os resultados ao mesmo arquivo. As não indexadas entram no fim desta fila.

Registrar no log o que foi pedido e riscar daqui o que entrou no índice. A propriedade de domínio (TXT no DNS) deixou de ser necessária; se o TXT aparecer, `gsc.py verify-domain --press-verify` continua valendo.

## Agendamentos (só existem com a sessão do Claude Code aberta e o PC ligado; expiram em 7 dias)

| ID | Cron (hora local) | O quê |
|---|---|---|
| `9174657d` | `7 */3 * * *` | Ciclo de 3 h, criado em 20/10, 17:30 UTC. Prompt no bloco abaixo. |
| `e788eb03` | `20 4 * * *` | Rodada diária de pedidos. Prompt: "Rodada diária de pedidos de indexação (D:\site-monitorar--main): seguir a fila de docs/organic/google-first-page/LOOP.md, seção "Fila de pedidos de indexação", com python scripts/gsc.py request <URLs na ordem> --output docs/organic/google-first-page/evidence/requests-<data>.json (o script para em "Cota excedida"). Primeiro /emissoes-fugitivas, depois a Home www e /consultoria-ambiental. Registrar no LOOP-LOG.md e riscar da fila o que já está no índice." |
| `62da9d89` | `13 10 26 10 *` (uma vez) | Renova os dois acima e se reagenda 6 dias à frente. |

Prompt do ciclo de 3 h:

```text
Ciclo do loop de SEO em D:\site-monitorar--main (docs/organic/google-first-page/LOOP.md, seções "Meta desde 20/10" e "Um ciclo"). Meta: top 3 em "emissões fugitivas", "consultoria ambiental", "consultoria ambiental RJ" e "empresa de engenharia ambiental"; o dono não fará nenhuma ação manual. 1) Trava: Chrome 9223 responde. 2) .venv-seo/Scripts/python -I scripts/serp_loop_engine.py run (4 leituras peek, trava de captcha e de 8 consultas/3 h embutida; saída 2 = captcha: registrar e pausar 6 h; saída 3 = trava: registrar e encerrar). 3) Ler o report.md gerado. Se uma frase segue fora do top 3 e há gap concreto (termo do nicho que 2 de 3 do top 3 têm e nós não, região sem a frase, bigrama comum, ou pergunta do "As pessoas também perguntam" sem resposta nossa — fila pronta em LOOP.md, seção "Próxima mutação"), mutar conforme a Fase 3 do plano ~/.claude/plans/foda-se-irm-o-continua-delegated-liskov.md: reler a fonte de cada fato, teste falhando primeiro, build, suíte (node --test --test-concurrency=1 tests/*.test.mjs), commit "seo(loop): …" e git push origin HEAD:main — no máximo 1 deploy a cada 24 h (git log --grep="seo(loop)" -1 --format=%cI); sem dado não verificado, sem editar texto aprovado de artigo, sem limitar a Home ao RJ, nada sobre o escritório, nunca pagar nada. Depois do deploy: node scripts/check-live.mjs, npm run indexnow, e pôr as páginas mexidas no topo da fila de pedidos. Riscar da fila "Próxima mutação" o que foi publicado. 4) Passos diários de LOOP.md se ainda não feitos hoje (Brave, sitemap, desempenho, lista do oHub RJ). 5) Linha no LOOP-LOG.md com "Xº em N de M leituras (24 h)"; nunca afirmar posição de uma leitura só. 6) Relatar ao dono (em português, curto) só se algo mudou — frase entrou/saiu da página 1 ou do top 3 em 2 leituras seguidas, URL entrou no índice, deploy feito — com a captura salva pelo motor. Commit diário só de documentos em main.
```

Se a sessão fechar, os agendamentos somem: na próxima sessão, recriar os três a partir desta seção.

## Captcha

O Google respondeu com captcha depois de 40 consultas em 14 minutos (19/10). Regra: **captcha em qualquer leitura = nenhuma consulta ao Google pelas 6 horas seguintes**, registrado no log. Nunca contornar. O limite de uso normal é de poucas consultas por ciclo; um bloqueio por excesso também pode atingir as buscas do proprietário.

## Proibido

Contornar captcha; mais de uma consulta por leitura por ciclo; remoções, mudança de endereço, desautorização de links, usuários, **propriedades** ou configurações no Search Console (adicionar a propriedade do endereço sem www depende de autorização expressa do proprietário); criar ou reivindicar o Perfil da Empresa sem confirmação do proprietário; prometer posição ou prazo.

## Escalonamento registrado, sem perguntar

Se a canônica escolhida pelo Google para a Home continuar sendo a versão sem `www` depois de 7 dias, registrar no `REPORT.md` a decisão pendente: manter `www`, como escolhido pelo proprietário, ou adotar a versão sem `www`, que o Google já prefere e para a qual apontam os links externos antigos.

## Fim

O job do `CronCreate` expira em 7 dias e só roda com o Claude Code aberto e o PC ligado. Ao expirar, escrever o `REPORT.md` com o estado final e as alavancas restantes.
