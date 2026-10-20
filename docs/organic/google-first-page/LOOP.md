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
2. **Google, 4 consultas `peek`, com 90 s entre elas.**
   - O comando, para cada frase: `python scripts/google-serp.py "<frase>" --mode peek --output docs/organic/google-first-page/evidence/cycles/serp-<slug>-<UTC>.json --shots docs/organic/google-first-page/evidence/icons`.
   - As frases: "emissões fugitivas", "consultoria ambiental", "consultoria ambiental RJ" e "empresa de engenharia ambiental".
   - Captcha (código 2): parar, registrar e pausar 6 h.
3. **Brave Search, 1×/dia.** `python scripts/brave-measure.py --headed --output docs/organic/brave-search-visibility/evidence/brave-<data>.json "emissões fugitivas" "consultoria ambiental"`. O proprietário também busca lá.
4. **Índice.**
   - `python scripts/gsc.py inspect` em `/emissoes-fugitivas`, `/` e `/consultoria-ambiental`, enquanto houver cota de inspeção.
   - Os pedidos de indexação saem na rodada diária das 07:20 UTC (fila abaixo).
5. **Sitemap, 1×/dia.** Na página Sitemaps do Search Console, conferir que o Google leu o índice `/sitemap.xml` e os 3 filhos (126 URLs).
   - O campo certo é "Insira o URL do sitemap". O campo "Inspecionar qualquer URL" é outro.
   - O botão é exatamente "Enviar".
6. **Desempenho, 1×/dia.** `python scripts/gsc.py queries --output docs/organic/google-first-page/evidence/queries-<data>.json`. Anotar impressões e posição média das 2 frases.
7. **oHub.** Enquanto o cadastro estiver pendente ou recente, abrir sem login `https://www.ohub.com.br/empresas/consultoria-ambiental/rj/rio-de-janeiro` e anotar se a Monitorar aparece na lista.
8. **Log.** Uma linha em `LOOP-LOG.md` com:
   - UTC;
   - cada frase como "Xº em N de M leituras (24 h)" ou "ausente em M de M", com a URL nossa;
   - o estado de índice do guia, da Home e do guia de consultoria;
   - os pedidos feitos;
   - a contagem de consultas;
   - a observação do ciclo.
9. **Relatar ao proprietário só quando algo mudar.** Conta como mudança: uma frase entrar ou sair da página 1 em 2 leituras seguidas, uma URL entrar no índice ou um pedido de indexação ser aceito. O relato leva a captura de tela.
10. **Regras.**
    - Guias sem edição por 3 a 4 semanas depois de indexados.
    - Nenhuma página por variação de frase.
    - Nada sobre a situação do escritório.
    - Escopo de qualquer estado.
    - Canibalização de "emissões fugitivas" resolvida em 20/10 (artigo fundido no guia com 308); outra fusão só com aprovação.
11. **Commit diário** só de documentos (`LOOP-LOG.md`, `evidence/`) em `main`.

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

## Captcha

O Google respondeu com captcha depois de 40 consultas em 14 minutos (19/10). Regra: **captcha em qualquer leitura = nenhuma consulta ao Google pelas 6 horas seguintes**, registrado no log. Nunca contornar. O limite de uso normal é de poucas consultas por ciclo; um bloqueio por excesso também pode atingir as buscas do proprietário.

## Proibido

Contornar captcha; mais de uma consulta por leitura por ciclo; remoções, mudança de endereço, desautorização de links, usuários, **propriedades** ou configurações no Search Console (adicionar a propriedade do endereço sem www depende de autorização expressa do proprietário); criar ou reivindicar o Perfil da Empresa sem confirmação do proprietário; prometer posição ou prazo.

## Escalonamento registrado, sem perguntar

Se a canônica escolhida pelo Google para a Home continuar sendo a versão sem `www` depois de 7 dias, registrar no `REPORT.md` a decisão pendente: manter `www`, como escolhido pelo proprietário, ou adotar a versão sem `www`, que o Google já prefere e para a qual apontam os links externos antigos.

## Fim

O job do `CronCreate` expira em 7 dias e só roda com o Claude Code aberto e o PC ligado. Ao expirar, escrever o `REPORT.md` com o estado final e as alavancas restantes.
