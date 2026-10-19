# Ciclo de acompanhamento: "emissões fugitivas RJ" no Google

Meta: o domínio aparecer entre os 10 primeiros resultados orgânicos do Google para **emissões fugitivas RJ**. Nenhuma posição é garantida; o ciclo mede, corrige o que está sob nosso controle e registra.

## Medidas e seus limites

- **Janela limpa** (`google-serp.py --mode clean`): contexto isolado, sem login. É a medida mais próxima do que um desconhecido vê. O Google pode responder com captcha: registrar `bloqueado`, nunca contornar.
- **Conta logada** (`--mode signed`): personalizada. O Google favorece sites que a conta visita, então **infla** a posição. Serve só como referência.
- **Search Console, Desempenho** (`gsc.py queries`): posição média real e impressões, com atraso de cerca de dois dias.
- **Inspeção de URL** (`gsc.py inspect`): estado de indexação, último rastreamento e canônica escolhida pelo Google.

## Pré-condições

1. `curl -s http://127.0.0.1:9223/json/version` responde (Chrome dedicado aberto, perfil `%USERPROFILE%\.cache\monitorar-seo-chrome`). Senão, abrir o Chrome com os parâmetros de `scripts/gsc.py`.
2. A inspeção de URL funciona (sessão do Search Console ativa). Se pedir login, registrar "login necessário" no log e encerrar o ciclo, sem perguntar nada ao proprietário.

## Um ciclo

1. `python scripts/gsc.py inspect https://www.monitorarconsultoria.com.br/servicos/emissoes-fugitivas https://www.monitorarconsultoria.com.br/ https://www.monitorarconsultoria.com.br/conteudos/emissoes-fugitivas`
2. `python scripts/google-serp.py "emissões fugitivas RJ" --mode both --output docs/organic/google-first-page/evidence/cycles/<UTC>.json`. Uma consulta por contexto por ciclo, nada além disso.
3. `python scripts/google-favicon.py`: indicador do ícone no Google. `updated: true` quando o armazém de favicons devolve o tamanho 16 em 16x16 (o ícone antigo, não quadrado, sai em 16x14 e os resultados mostram o globo). Registrar no log. Não há ação possível além de esperar o rastreador do Google; se passarem 7 dias sem mudança, registrar no relatório.
4. Uma vez por dia (primeiro ciclo depois das 06:00 locais): `python scripts/gsc.py queries --output docs/organic/google-first-page/evidence/queries-<data>.json`.
5. Acrescentar uma linha a `LOOP-LOG.md`: UTC, serviço (indexada, último rastreamento), início (situação e canônica do Google), ícone (`updated`), posição logada, posição na janela limpa ou `bloqueado`, observação.
6. Decidir:
   - **Sucesso:** posição na janela limpa entre 1 e 10 em **dois ciclos seguidos**. Se a janela limpa estiver bloqueada em dois ciclos seguidos, vale também posição média no Search Console até 10 com pelo menos 10 impressões para a consulta. Então: `CronDelete`, `REPORT.md` final, encerrar o Chrome dedicado e apagar o perfil.
   - Página-chave "não indexada" ou com conteúdo antigo no índice e ainda há cota hoje (limite de 10 pedidos por dia; contar no log): `python scripts/gsc.py request <url>`.
   - O dado indicar uma alavanca de código, na ordem: rastreio e indexação; relevância na página (título, introdução, links internos); autoridade (relatório de links); conteúdo com fontes, que exige aprovação editorial registrada. Sempre com teste primeiro, publicação e verificação em produção.
7. Uma vez por dia, commit só de documentos (`LOOP-LOG.md` e `evidence/`) em `main`.

## Proibido

Contornar captcha; mais de uma consulta por contexto por ciclo; remoções, mudança de endereço, desautorização de links, usuários ou configurações no Search Console; criar ou reivindicar o Perfil da Empresa sem confirmação do proprietário; prometer posição ou prazo.

## Escalonamento registrado, sem perguntar

Se a canônica escolhida pelo Google para a Home continuar sendo a versão sem `www` depois de 7 dias, registrar no `REPORT.md` a decisão pendente: manter `www`, como escolhido pelo proprietário, ou adotar a versão sem `www`, que o Google já prefere e para a qual apontam os links externos antigos.

## Fim

O job do `CronCreate` expira em 7 dias e só roda com o Claude Code aberto e o PC ligado. Ao expirar, escrever o `REPORT.md` com o estado final e as alavancas restantes.
