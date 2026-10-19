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

## Um ciclo (a cada 3 horas)

1. `python scripts/gsc.py inspect https://www.monitorarconsultoria.com.br/servicos/emissoes-fugitivas https://www.monitorarconsultoria.com.br/ https://www.monitorarconsultoria.com.br/conteudos/emissoes-fugitivas`
2. `python scripts/google-serp.py "emissões fugitivas RJ" --mode default --output docs/organic/google-first-page/evidence/cycles/<UTC>.json`. Uma consulta por leitura por ciclo, nada além disso.
3. **Varredura gradual**, somente se nenhuma leitura deste ciclo deu captcha: `python scripts/rank-sweep.py --output docs/organic/google-first-page/rankings/baseline-2026-10-19.csv --kind <tipo> --limit 10 --pause 60`, na ordem `priority`, `head`, `geo`, `commercial`, `article`. Depois de medidas todas as frases, repetir a varredura completa uma vez por semana em `rankings/sweep-<data>.csv` e comparar com `python scripts/rank-report.py <base> <nova>`.
3b. **Respostas de IA**, no máximo **uma vez por dia** e só se nenhuma leitura deste ciclo deu captcha: `python scripts/ai-overview.py --output docs/organic/google-first-page/ai-overview/ai-overview-<data>.csv --limit 4`. Registrar no log se "Monitorar citada" mudou. Em captcha o script para e abre a janela do captcha na tela do proprietário (`scripts/captcha_window.py`); ele resolve sozinho, o script nunca resolve nem contorna.
4. `python scripts/google-favicon.py`: indicador do ícone no Google. `updated: true` quando o armazém de favicons devolve o tamanho 16 em 16x16 (o ícone antigo, não quadrado, sai em 16x14 e os resultados mostram o globo). Registrar no log. Não há ação possível além de esperar o rastreador do Google; se passarem 7 dias sem mudança, registrar no relatório.
5. Uma vez por dia (primeiro ciclo depois das 06:00 locais): `python scripts/gsc.py queries --output docs/organic/google-first-page/evidence/queries-<data>.json`.
6. Acrescentar uma linha a `LOOP-LOG.md`: UTC, serviço (indexada, último rastreamento), início (situação e canônica do Google), ícone (`updated`), posição logada, posição na janela limpa ou `bloqueado`, observação.
7. Decidir:
   - **Consulta atendida:** posição `neutral` entre 1 e 10 em **dois ciclos seguidos**. Registrar no `REPORT.md` e continuar acompanhando a estabilidade e o ícone.
   - **Sucesso total:** consulta atendida **e** ícone (`google-favicon.py` com `updated: true`, e resultados dos artigos com o logo no lugar do globo) **e** Home indexada com a canônica em www, em dois ciclos seguidos. Então: `CronDelete`, `REPORT.md` final, encerrar o Chrome dedicado e apagar o perfil.
   - Página-chave "não indexada" ou com conteúdo antigo no índice e ainda há cota hoje (limite de 10 pedidos por dia; contar no log): `python scripts/gsc.py request <url>`.
   - O dado indicar uma alavanca de código, na ordem: rastreio e indexação; relevância na página (título, introdução, links internos); autoridade (relatório de links); conteúdo com fontes, que exige aprovação editorial registrada. Sempre com teste primeiro, publicação e verificação em produção.
8. Uma vez por dia, commit só de documentos (`LOOP-LOG.md` e `evidence/`) em `main`.

## Captcha

O Google respondeu com captcha depois de 40 consultas em 14 minutos (19/10). Regra: **captcha em qualquer leitura = nenhuma consulta ao Google pelas 6 horas seguintes**, registrado no log. Nunca contornar. O limite de uso normal é de poucas consultas por ciclo; um bloqueio por excesso também pode atingir as buscas do proprietário.

## Proibido

Contornar captcha; mais de uma consulta por leitura por ciclo; remoções, mudança de endereço, desautorização de links, usuários, **propriedades** ou configurações no Search Console (adicionar a propriedade do endereço sem www depende de autorização expressa do proprietário); criar ou reivindicar o Perfil da Empresa sem confirmação do proprietário; prometer posição ou prazo.

## Escalonamento registrado, sem perguntar

Se a canônica escolhida pelo Google para a Home continuar sendo a versão sem `www` depois de 7 dias, registrar no `REPORT.md` a decisão pendente: manter `www`, como escolhido pelo proprietário, ou adotar a versão sem `www`, que o Google já prefere e para a qual apontam os links externos antigos.

## Fim

O job do `CronCreate` expira em 7 dias e só roda com o Claude Code aberto e o PC ligado. Ao expirar, escrever o `REPORT.md` com o estado final e as alavancas restantes.
