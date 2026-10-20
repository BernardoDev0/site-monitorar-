# Ciclo de acompanhamento: "emissões fugitivas RJ" no Google

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

## Foco desde 19/10 à noite: só "emissões fugitivas" e o ícone

Pedido do proprietário: "foque só em emissões fugitivas", 1º ou 2º no orgânico, e o ícone da empresa nos resultados. A varredura das outras frases e a checagem de IA das outras frases ficam **pausadas**.

**Atualização (20/10, 00:10 UTC):** o proprietário pediu "primeira página em TUDO". A varredura lenta de todas as frases do mapa (`keyword-map.csv`, `extra-queries.csv` e as prioritárias, cerca de 187) **volta**, dentro do limite: no máximo 6 frases por ciclo (passo 2b), além das 2 leituras focadas. São no máximo 8 consultas a cada 3 horas, e uma passada completa leva cerca de 4 dias. A checagem de IA continua só em "emissões fugitivas".

**Linha de base (19/10, sem personalização):** "emissões fugitivas" oscila entre o 8º lugar (artigo `/blog/o-que-sao-emissoes-fugitivas`) e fora da 1ª página em leituras com 20 minutos de intervalo. "emissões fugitivas RJ": 1º (serviço) e 5º (artigo Petrobras). Ícone: **globo** (`iconKind: svg`, hash `4f5681529f82`) nos dois resultados. O logo aparece como `iconKind: img`.

## Um ciclo (a cada 3 horas)

1. **Ícone e Home.**
   - `python scripts/gsc.py inspect --property apex https://monitorarconsultoria.com.br/` (último rastreamento; em 19/10 era 10/10, quando o site antigo ainda declarava o sem www como canônico).
   - `python scripts/gsc.py inspect https://www.monitorarconsultoria.com.br/` (a Home www entrou no índice? canônica?).
   - `python scripts/google-favicon.py` (armazém de ícones).
2. **Posição.** `python scripts/google-serp.py "emissões fugitivas" --mode neutral --output docs/organic/google-first-page/evidence/cycles/serp-emissoes-fugitivas-<UTC>.json --shots docs/organic/google-first-page/evidence/icons`. Se a leitura não deu captcha, também `"emissões fugitivas RJ"` (mesmo formato), que dá o ícone mesmo quando o termo principal não está na 1ª página. Máximo de 2 consultas por ciclo.
2b. **Varredura lenta (todas as frases).** Só se o passo 2 não deu captcha: `python scripts/rank-sweep.py --output docs/organic/google-first-page/rankings/sweep-2026-10-20.csv --limit 6 --pause 30`. O CSV é retomado de onde parou. Quando cobrir todas as frases, comparar com a passada anterior (`python scripts/rank-report.py docs/organic/google-first-page/rankings/baseline-2026-10-19.csv docs/organic/google-first-page/rankings/sweep-2026-10-20.csv`), registrar no REPORT o que entrou e saiu da 1ª página e começar um CSV novo com a data do dia.
3. **Respostas de IA:** 1×/dia, só "emissões fugitivas": `python scripts/ai-overview.py --output docs/organic/google-first-page/ai-overview/ai-overview-<data>.csv "emissões fugitivas"`.
4. **Fila de pedidos** (seção seguinte), enquanto houver cota.
5. **Desempenho:** 1×/dia, `python scripts/gsc.py queries --output docs/organic/google-first-page/evidence/queries-<data>.json`. Anotar impressões e posição de "emissões fugitivas" quando aparecerem.
6. **Log:** uma linha em `LOOP-LOG.md` com UTC, Home www (indexada?), apex (último rastreamento), ícone (`iconKind`/hash, armazém), posição de "emissões fugitivas" e qual URL nossa, posição de "emissões fugitivas RJ", pedidos feitos e observação.
7. **Decidir:**
   - **Ícone resolvido:** `iconKind: img` no nosso resultado em dois ciclos seguidos. Registrar com o recorte de imagem.
   - **Endereço resolvido em 19/10:** a Home www entrou no índice com a canônica em www, então a mudança para o sem www **não é mais necessária**. Só voltar ao assunto se a Home www sair do índice de novo. (Regra anterior: se a Home www continuasse fora do índice 72 h depois do pedido do sem www, mudar o site para o sem www.) O proprietário autorizou ("com e sem www, tanto faz, só quero que funcione"). Passos no `REPORT.md`; o redirecionamento de domínio na Vercel é trocado no painel pelo proprietário (o MCP não altera) ou por mim depois de `! npx vercel login`.
   - **Canibalização:** resolvida em 20/10. O dono aprovou fundir o artigo `/blog/o-que-sao-emissoes-fugitivas` no guia `/emissoes-fugitivas`; o artigo responde 308 para o guia (`content/retired.json`, `vercel.json`). Qualquer outra fusão precisa de nova aprovação.
   - **Sem novas edições no guia por 3 a 4 semanas** depois de indexado (skill seo-audit, *rankings-push*), salvo erro de fato. Mudanças empilhadas impedem saber o que funcionou. O que ainda pesa é autoridade (kit do proprietário).
8. Uma vez por dia, commit só de documentos (`LOOP-LOG.md`, `evidence/`) em `main`.

## Fila de pedidos de indexação (cota de cerca de 10 por dia, **por conta**, não por propriedade)

Ordem definida pela inspeção de 20/10 (`evidence/inspection-2026-10-20.json`). Pedir só o que continuar fora do índice:

1. `https://www.monitorarconsultoria.com.br/emissoes-fugitivas` (guia; "Detectada, mas não indexada"). **Primeiro de todos.**
2. `https://www.monitorarconsultoria.com.br/consultoria-ambiental` (guia; "Detectada, mas não indexada")
3. `https://www.monitorarconsultoria.com.br/servicos/ruido-extramuros` (serviço; "Detectada, mas não indexada")
4. `python scripts/gsc.py request --property apex https://monitorarconsultoria.com.br/`: o registro do sem www ainda é de 10/10, do tempo do redirecionamento 307. O pedido faz o Google ver o 308 e descartar a entrada antiga.
5. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-por-estado` ("O Google não reconhece o URL")
6. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-sp`
7. `https://www.monitorarconsultoria.com.br/consultoria-ambiental-am`
8. `https://www.monitorarconsultoria.com.br/blog/planejamento-de-campanha-de-emissoes-fugitivas`
9. `https://www.monitorarconsultoria.com.br/blog/componentes-sem-acesso-em-programas-ldar`
10. `https://www.monitorarconsultoria.com.br/politica-privacidade`, só se sobrar cota.

Home www, `/servicos/emissoes-fugitivas`, `/conteudos/emissoes-fugitivas`, `/blog/o-que-sao-emissoes-fugitivas` e `/consultoria-ambiental-rj` **já estão indexadas** (rastreio em 19/10).

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
