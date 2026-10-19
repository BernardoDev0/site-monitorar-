# Google: "emissões fugitivas RJ" e a visibilidade da Monitorar

Data: 2026-10-19. Código: `ed2975d`, `d3de9a9`, `519b6c1`. Acompanhamento: `LOOP.md` e `LOOP-LOG.md`.

## Pedido e limite

O proprietário pediu que o domínio apareça na 1ª página do Google para **emissões fugitivas RJ** e exigiu certeza. Nenhuma pessoa nem ferramenta garante posição, porque o Google decide. O compromisso foi executar tudo o que é legítimo, medir com dados reais do Search Console e repetir em ciclos. O proprietário liberou o acesso ao Search Console; ele entrou uma vez num Chrome dedicado, e a senha nunca passou pelo chat.

## O que o Google mostra (Search Console, 2026-10-19)

Evidência: `evidence/inspect-home.json`, `evidence/inspect-key-pages.json`, `evidence/queries-*.json`.

| URL | Estado no Google |
|---|---|
| `/servicos/emissoes-fugitivas` | indexada, canônica correta, breadcrumbs válidos; rastreada em 18/10 21:07 e de novo em 19/10 10:44 |
| `/` (Home) | **não indexada: "Cópia, o Google e o usuário selecionaram uma página canônica diferente"**. Canônica declarada: `https://www.monitorarconsultoria.com.br/`. **Canônica escolhida pelo Google: `https://monitorarconsultoria.com.br/` (sem www)** |
| `/sobre`, `/blog`, `/blog/o-que-e-ldar`, `/blog/o-que-sao-emissoes-fugitivas`, `/blog/emissoes-fugitivas-petrobras`, `/blog/como-contratar-monitoramento-de-emissoes-fugitivas` | indexadas, rastreadas em 18/10 |
| `/servicos`, `/contato` | indexadas, mas com o conteúdo antigo (rastreadas em 2/10 e 7/10) |
| `/conteudos/emissoes-fugitivas` | "detectada, mas não indexada no momento" |
| `/clientes` | "rastreada, mas não indexada" (leitura de 1/6, conteúdo antigo) |

Sitemap `/sitemap.xml`: processado, 121 páginas encontradas. Ações manuais e problemas de segurança: nenhum. Estatísticas de rastreamento, relatório de links e relatório de indexação das páginas: "dados em processamento" (propriedade nova). Desempenho em 3 meses: 3 impressões e 0 cliques, todas em 17/10, na consulta "consultoria em segurança do trabalho rj", posição média 72.

## Causa encontrada para a Home e a marca

O site antigo declarava como canônica a versão **sem www** (`<link rel="canonical" href="https://monitorarconsultoria.com.br" />` no `index.html` de março) e os links externos antigos apontam para ela (a inspeção lista `https://monitorarconsultoria.com.br/` e uma ficha de diretório como páginas de referência). O Googlebot rastreou a Home em 18/10 às 18:20, antes de o redirecionamento sem-www para www virar permanente (308), e escolheu a versão sem www. Enquanto isso não for reavaliado, a Home com www não é servida. Hoje a cadeia está correta (http para https, apex para www em 308, canônica, `og:url` e sitemap em www). A reavaliação depende de o Google voltar ao endereço sem www, o que não é possível forçar: a propriedade do Search Console cobre só o www.

## Posição para "emissões fugitivas RJ"

Evidência: `evidence/serp-baseline-emissoes-fugitivas-rj.json`, `evidence/serp-matrix-signed.json`, `evidence/serp-matrix-clean.json`, `evidence/serp-clean-context.json`.

- **Conta do proprietário (logada):** `/blog/emissoes-fugitivas-petrobras` em 1º; "monitorar consultoria emissoes" traz 4 páginas do site (1º, 2º, 3º e 5º); "monitorar consultoria" traz a Home em 1º. **Personalizada**: o Google favorece sites que a conta visita e o parâmetro `pws=0` não desliga isso. A medida infla o resultado.
- **Janela limpa (sem login):** nenhuma página do site entre os ~9 a 10 resultados orgânicos de "emissoes fugitivas RJ", "emissões fugitivas rj", "monitoramento de emissões fugitivas RJ", "monitorar consultoria emissoes" e "monitorar consultoria". A consulta exata "emissões fugitivas RJ" recebeu captcha nessa condição e não foi lida; captcha nunca é contornado.

Na captura do proprietário o site aparece em 4º lugar na 1ª página; na sessão logada do Chrome dedicado, em 1º. Posições diferentes entre as duas telas confirmam a personalização.

- **Sem personalização (link oficial "Testar sem personalização", `peek_pws=0`):** o rodapé confirma "Os resultados não são personalizados" e não há captcha. Em 19/10 às 15:00 UTC, para "emissões fugitivas RJ", **`/blog/emissoes-fugitivas-petrobras` aparece em 1º lugar orgânico** (`evidence/cycles/2026-10-19T1500Z-neutral.json`). É a medida principal do loop (`scripts/google-serp.py --mode default`).

Leitura dos fatos: o conteúdo está indexado e já aparece para a conta do proprietário, mas para um desconhecido ainda não está entre os 10 primeiros. O resultado do primeiro lugar logado tem 15 horas de idade, e páginas novas costumam oscilar nos primeiros dias.

## Alterações publicadas

- Redirecionamentos permanentes das URLs do site de 2013 a 2016 (Wayback), todas 404 antes, incluindo `/monitoramento-de-emissoes-fugitivas` para `/servicos/emissoes-fugitivas`. A forma `.html` passa antes pelo redirecionamento de URLs limpas da Vercel (2 saltos); regras `.html` próprias nunca disparam e foram removidas. `docs/organic/redirect-map.csv`.
- Título "Monitoramento de emissões fugitivas no RJ | Monitorar Consultoria" e descrição com Rio de Janeiro e LDAR para a página de serviço, em `content/seo-overrides.json`, sem alterar o documento aprovado, seu H1 ou seu hash.
- Âncora "Monitoramento de emissões fugitivas no RJ" nos links internos de artigos para essa página.
- Bloco "Atendimento a partir do Rio de Janeiro" nas páginas de serviço, com endereço, telefone e e-mail de `content/business.json`.
- `areaServed` (Rio de Janeiro e Brasil, conforme o escopo confirmado) no dado estruturado do serviço.
- Pedidos de indexação no Search Console (ver abaixo) e IndexNow.

## Pedidos de indexação (Search Console, 19/10)

Evidência: `evidence/request-indexing-2026-10-19.json` (estado antes do pedido), `evidence/inspect-after-requests.json` (estado depois).

Foram pedidos 8 URLs: serviço de emissões fugitivas, Home, hub de emissões fugitivas, `/servicos`, artigo "Emissões fugitivas Petrobras", artigo "O que são emissões fugitivas", `/contato` e `/clientes`. O diálogo do Search Console confirmou "Indexação solicitada" ("o URL foi adicionado a uma fila de rastreamento prioritário"). O primeiro script marcou esses pedidos como erro porque esperava outro texto de confirmação; a prova correta é a inspeção posterior. Resultado: **o Google rastreou as 8 páginas em 19/10 entre 10:51 e 11:16**, e duas saíram de "fora do índice" para "no Google": `/conteudos/emissoes-fugitivas` (era "detectada, mas não indexada") e `/clientes` (era "rastreada, mas não indexada"). `/servicos` e `/contato`, que estavam no índice com o conteúdo antigo, foram atualizadas. A Home continua "não indexada: Cópia, o Google e o usuário selecionaram uma página canônica diferente", mesmo depois do novo rastreamento.

## Ícone nos resultados do Google

A captura de tela do proprietário (Google, busca "emissoes fugitivas rj") mostra o site em **4º lugar** na 1ª página, com o resultado "Monitorar Consultoria › Blog › Emissões fugitivas Petrobras" e o **globo genérico no lugar do ícone**.

- O arquivo novo é quadrado e válido, está no ar e é acessível aos robôs do Google (Googlebot, Googlebot-Image e "Google Favicon" recebem 200 em `/`, `/favicon.ico` e `/favicon-192.png`; `robots.txt` libera tudo).
- O armazém de favicons do Google (`t3.gstatic.com/faviconV2`, `scripts/google-favicon.py`) devolvia o ícone antigo, não quadrado (16x14 e 32x28), para o `www` e continua assim para o endereço **sem www**. Depois do novo rastreamento da Home, o `www` passou a devolver **404 (nenhum ícone registrado)**: o ícone antigo foi descartado e o novo ainda não foi registrado.
- **Divisão por endereço, vista na própria busca** (`monitorar consultoria emissoes`, captura em `scratchpad`): os resultados de artigo, em `https://www.monitorarconsultoria.com.br › Blog`, mostram o **globo**; o resultado da página principal é `https://monitorarconsultoria.com.br` (**sem www**), com o título antigo, e mostra o **logo verde**. O Google guarda o ícone por endereço, e o `www`, onde estão todos os artigos, nunca recebeu ícone no resultado de busca.
- A Home com www continua sendo "cópia" da versão sem www para o Google. A causa provável é que ele ainda não refez o rastreamento do endereço sem www depois que o redirecionamento virou permanente (o último rastreamento observado, em 18/10 às 18:20, ainda encontrou um redirecionamento temporário, 307). Enquanto o www não for a página principal do site para o Google, o ícone não é atribuído a ele. O armazém de favicons devolve hoje o ícone antigo para os dois endereços.
- A conta do proprietário tem **uma única propriedade** no Search Console (`www`). Para pedir o novo rastreamento do endereço sem www seria preciso adicionar essa propriedade e verificá-la. **Essa ação foi bloqueada pelo controle de permissões** (mudança de conta, fora do escopo aprovado) e não foi executada. Depende de autorização expressa do proprietário; não é certo que a verificação funcione, porque o endereço sem www redireciona.
- Alterado: o ICO passou a ser declarado como `48x48` (o Google desaconselha 16x16), o PNG 192x192 foi mantido e foi acrescentado `apple-touch-icon.png` 180x180 (antes dava 404). O teste `site icons are square, multiples of 48 and declared the way Google documents` protege isso.
- Indicador para o loop: `python scripts/google-favicon.py` retorna `updated: true` quando o tamanho 16 voltar quadrado (16x16).

Não há ação que acelere o rastreador de favicons do Google. Nenhum prazo é prometido.


## Limitações

O Google define o ranking; a indexação e a reavaliação da canônica levam dias a semanas; a posição oscila. O relatório de links, o de rastreamento e o de indexação ainda não têm dados. A janela limpa está sujeita a captcha. O acesso ao Search Console depende do Chrome dedicado aberto e do PC ligado, e o ciclo expira em 7 dias.

## Decisão pendente

1. **Autorizar a propriedade do endereço sem www no Search Console** (reversível, sem efeito no ranking): permitiria inspecionar esse endereço e pedir o novo rastreamento, que é o caminho mais rápido para o Google adotar o www como oficial e atribuir o ícone aos artigos. Sem autorização, resta esperar o rastreamento natural do Google.
2. Se a Home continuar com a canônica sem www depois de cerca de 7 dias: manter www, como escolhido pelo proprietário (as páginas novas já estão indexadas em www e a posição 1 está nelas), ou adotar a versão sem www. Trocar de host reinicia a consolidação e fazer isso agora arriscaria a posição atual; não será feito sem decisão do proprietário. Além disso, o acompanhamento do Search Console hoje só existe para o www.

## Cobertura ampliada: termos genéricos, por estado e os 90 artigos (19/10, tarde)

Pedido do proprietário: 1º lugar orgânico em cada um dos 90 artigos, ou 2º se não for possível, com prioridade para "consultoria ambiental RJ" e "consultoria engenharia ambiental RJ", e também para termos genéricos ("emissões fugitivas") e para outros estados.

**Linha de base parcial** (`rankings/baseline-2026-10-19.csv`, 40 consultas, sem personalização, só a 1ª página): 1º em "monitoramento de emissões fugitivas", "programa LDAR", "Qualidade do ar, PTS e Fumaça Preta" e "Avaliação de ruído extramuros" (em artigos do blog); 2º em "Monitoramento de emissões fugitivas e LDAR" e "empresa de LDAR"; 4º em "ruído extramuros"; **8º em "emissões fugitivas"** (artigo "O que são emissões fugitivas"). **Ausente** em todas as consultas de consultoria e engenharia ambiental com RJ, em "monitoramento da qualidade do ar", "partículas totais em suspensão", "avaliação de ruído ambiental" e afins. O Google respondeu com captcha depois de 40 consultas em 14 minutos e a varredura foi interrompida; o restante (cerca de 160 frases) é medido aos poucos, no máximo 10 por ciclo de 3 horas. Nunca se contorna o captcha.

**Publicado:**
- `/consultoria-ambiental-rj`: página dedicada a "consultoria ambiental" e "engenharia ambiental" no Rio de Janeiro, com os serviços ligados às páginas de serviço e aos guias, os números que o site já publicava, as regiões do estado e quatro perguntas respondidas com o conteúdo existente. Ligada do cabeçalho, do rodapé, de `/servicos` e dos 90 artigos (três textos de âncora diferentes).
- `/consultoria-ambiental-por-estado`: uma página de referência com os 27 estados, o órgão ambiental oficial de cada um e o endereço do portal (`content/regions.json`; MT e RN ficam sem link porque nenhum portal pôde ser verificado). Só afirma atendimento conforme o escopo. (Primeira versão, só com os estados da lista inicial; ampliada à noite, veja a seção seguinte.) Se o Search Console mostrar impressões para algum estado, esse estado ganha página própria; páginas por cidade copiadas não serão criadas porque o Google as trata como páginas de entrada.
- Descrições dos 90 artigos ajustadas ao tamanho do resultado (antes, 78 passavam de 160 caracteres); os textos aprovados não mudaram.
- Um teste impede que qualquer página pública mencione a situação do escritório, por instrução do proprietário.

**Perfil da Empresa no Google (Maps):** existe "Monitorar Consultoria Em Gestão Ambiental LTDA", categoria Engenharia ambiental, sem dono e sem site cadastrado; o endereço no Maps diz "loja 125" e o do site "Loja 205". O proprietário autorizou a reivindicação. O fluxo foi iniciado e parou na verificação, que só aceita **vídeo** (mostrar o local e o comprovante de administração) e é feita pelo proprietário em `business.google.com`. Enquanto isso, o perfil não está ligado ao site, o que pesa nas buscas com cidade.

**O que esperar:** "emissões fugitivas" e "LDAR" estão em disputa real e já aparecem na 1ª página, e o ganho de posição vem de reforço do conjunto de conteúdo e de links. "Consultoria ambiental RJ" é muito disputada (domínios de empresas consolidadas e diretórios); sem links externos e sem o perfil verificado no Maps, entrar na 1ª página leva semanas ou meses. Nenhum prazo nem posição é garantido.

## Escopo corrigido: qualquer estado, atuação principal no RJ, em SP e no Amazonas (19/10, noite)

Instrução do proprietário: a empresa **atende qualquer estado**; a atuação principal é no **RJ, em São Paulo e no Amazonas**; nada no site, **nem a Home**, pode limitar a empresa ao RJ. Isso substitui a lista de regiões da rodada anterior (RJ, Sudeste, Sul, Nordeste).

**Publicado** (commits `caa89bc` e seguintes):
- Home e hero: "em todo o Brasil… atuação principal no RJ, em São Paulo e no Amazonas".
- `/consultoria-ambiental-rj` reescrita como "no Rio de Janeiro e em outros estados"; novas `/consultoria-ambiental-sp` e `/consultoria-ambiental-am` (órgão ambiental, CETESB e IPAAM, com o portal oficial; serviços; guias; perguntas); `/consultoria-ambiental-por-estado` com os 27 estados.
- Dados estruturados: `areaServed` = Rio de Janeiro, São Paulo, Amazonas e Brasil (`content/business.json`).
- Os artigos ligam as três páginas de estado. Instrução mantida: nenhuma página fala da situação do escritório (teste automatizado).

## Respostas de IA do Google ("Visão geral criada por IA")

**Medido em 19/10** (`scripts/ai-overview.py`, sem personalização, `ai-overview/ai-overview-2026-10-19.csv`):

| Consulta | Quadro de IA | Monitorar citada | Posição orgânica | Fontes citadas |
|---|---|---|---|---|
| emissões fugitivas RJ | sim | **não** | 1ª | blog.alutal.com.br, rio.rj.gov.br |
| emissões fugitivas | sim | **não** | não apareceu nesta leitura (8ª na linha de base da tarde) | alutal, ecycle, mineral.eng.br, UFMG, Wikipedia, YouTube |

Ser o 1º resultado orgânico **não** coloca a empresa no quadro de IA: o Google escolhe, para a resposta, páginas que definem o assunto e o respondem de forma direta, de fontes que ele já trata como referência (órgão público, universidade, enciclopédia, vídeo). Nenhuma ferramenta nem texto força a citação, e o Google não publica as regras.

**Publicado para ser citável:** `/emissoes-fugitivas-perguntas-e-respostas`, um guia com nove perguntas respondidas na primeira frase de cada resposta, com a definição de emissão fugitiva citada literalmente da Resolução CONAMA 382/2006 (art. 3º) e com as fontes primárias: guia LDAR e Método 21 da EPA e a Resolução CONEMA 97/2022 (NOP-INEA-52, INEA). Dados estruturados FAQPage gerados do mesmo arquivo (`content/faq-emissoes-fugitivas.json`) que o texto visível. Ligado do serviço de emissões fugitivas, dos artigos "O que são emissões fugitivas" e "O que é LDAR", dos artigos do assunto e de `/servicos`. Só afirma o que as fontes dizem; o que depende de cada instalação está dito como tal.

**Pendente:** pedido de indexação das quatro páginas novas (a cota diária do Search Console estava esgotada; repetir no primeiro ciclo de 20/10): `/emissoes-fugitivas-perguntas-e-respostas`, `/consultoria-ambiental-por-estado`, `/consultoria-ambiental-sp`, `/consultoria-ambiental-am`. Depois, repetir `ai-overview.py` no máximo uma vez por dia e comparar.

**Fora do código (depende do proprietário):** o Google cita o YouTube nas respostas de IA para o assunto; um vídeo curto e verdadeiro no canal da empresa, explicando LDAR, e a presença em diretórios e na imprensa técnica reforçam o sinal. O Perfil da Empresa verificado também conta nas buscas locais. Nenhum prazo nem citação é garantido.

## Palavras-chave por página: guias de emissões fugitivas e de consultoria ambiental (19/10, noite)

Pedido do dono: "emissões fugitivas" e "consultoria ambiental" na IA e em 1º no orgânico; "empresa de engenharia ambiental" e afins; "o domínio tem 16 anos".

**O que a pesquisa mostrou** (leitura; Google BR sem personalização, RDAP do registro.br e leitura das páginas):
- A idade do domínio não decide. À frente da Monitorar (2009): rioambiental.com.br (registrado em 2015; 1º em "consultoria ambiental RJ", "empresa de engenharia ambiental RJ" e "empresa de consultoria ambiental"), aires.com.br (2019; 1º em "Monitoramento de emissões fugitivas e LDAR") e ldar.com.br (2022; página de cerca de 40 palavras; 1º em "empresa de LDAR").
- A concorrência comercial do RJ é fraca em conteúdo: Rio Ambiental com ~800–900 palavras, sem FAQ; Ambiental Consult com ~300–400 palavras e ISO. O OHub (diretório) aparece em 3º. Ganham por histórico, presença externa e Maps.
- Presença externa da Monitorar quase nula: buscar pelo nome ou pelo domínio não acha nenhuma página fora do site. "Monitorar" é também um verbo comum.
- Cobertura no site antes desta rodada: "empresa de engenharia ambiental" e "empresa de consultoria ambiental" em zero páginas; quatro páginas do tema emissões fugitivas disputavam entre si.
- Search Console em 19/10: Home não indexada (canônica do Google = sem www); `/consultoria-ambiental-rj` indexada (versão antiga); 3 impressões; relatório de Links "em processamento".

**Mapa palavra-chave → página principal**

| Termo | Página | Situação |
|---|---|---|
| emissões fugitivas, emissão fugitiva, o que são, legislação | `/emissoes-fugitivas` (guia novo) | 2.700 palavras, fontes primárias, seção do RJ, FAQ, 26 artigos ligados; substitui o guia de perguntas e respostas (redirecionamento 308) |
| monitoramento de emissões fugitivas, empresa de LDAR, programa LDAR | `/servicos/emissoes-fugitivas` | 1º/2º; bloco "Empresa de LDAR" e link ao guia |
| consultoria ambiental, empresa de consultoria ambiental, empresa de engenharia ambiental | `/consultoria-ambiental` (guia novo) + Home | guia com Lei 6.938/1981 e CONAMA 237/1997; Home ganhou a seção "Empresa de engenharia e consultoria ambiental" |
| consultoria ambiental RJ, engenharia ambiental RJ | `/consultoria-ambiental-rj` | frase "empresa de consultoria e engenharia ambiental", H2 com "Empresa de engenharia ambiental", logos de clientes, 4 perguntas novas |
| SP, AM, outros estados | `-sp`, `-am`, `-por-estado` | links ao guia |

Todos os fatos dos guias foram conferidos no texto das fontes (CONAMA 382/2006, guia LDAR e Método 21 da EPA, IPCC 2006 vol. 2 cap. 4, NOP-INEA-52, Lei 6.938/1981, CONAMA 237/1997, Lei 6.496/1977). Na conferência saiu um erro meu do guia anterior (a EPA lista cinco benefícios, não três), já corrigido. Nenhuma credencial da empresa é afirmada (o dono respondeu "não sei agora"), e os guias não têm nome de pessoa (decisão do dono). A lista de "como escolher" cita o Cadastro Técnico Federal e a ART como critérios gerais; convém o dono confirmar os registros da própria empresa para poder exibi-los.

**Pendente:** pedidos de indexação (cota; fila em `LOOP.md`), propriedade de domínio sem www no Search Console (autorizada; falta o TXT no DNS, que só o dono coloca), kit do dono em `docs/organic/owner-actions.md`.


## "emissões fugitivas" e o ícone (19/10, noite)

Pedido do proprietário: foco só em "emissões fugitivas" (1º ou 2º) e o ícone da empresa nos resultados, que não aparece em nenhum.

**Medição sem personalização:** "emissões fugitivas" oscila entre o **8º lugar** (artigo "O que são emissões fugitivas") e **fora da 1ª página** em leituras com 20 minutos de intervalo, o que explica o proprietário ver a 2ª página. A 1ª página:

| Pos. | Resultado | O que tem |
|---|---|---|
| 1 | thermofisher.com | página **em inglês**, ~650 palavras, de 03/2024, sem imagem, sem índice, sem FAQ |
| 2 | blog.alutal.com.br | ~950 palavras, estatísticas sem fonte |
| 3 | pt.wikipedia.org | **~70 palavras** |
| 4–8 | persefoni.com (inglês), wika.com (produto), UFMG (monografia), start5g.com.br, gov.br/anp | |

As três primeiras ganham com páginas fracas porque o **domínio** delas tem autoridade (links e menções). Portanto não é o conteúdo que falta. Faltam três coisas: o guia indexado (o Google ainda não conhece `/emissoes-fugitivas`), o endereço resolvido e autoridade externa. Já em "emissões fugitivas RJ" somos 1º: quase ninguém disputa o termo com RJ, e a página tem RJ no título e trata do INEA.

**Causa do ícone:**
- Na Vercel, o endereço sem www redirecionou para o www com **307 (temporário)**, o padrão, até 18/10; agora é 308.
- Hoje a propriedade `https://monitorarconsultoria.com.br/` foi criada no Search Console e **verificada automaticamente pela tag HTML** (mesmo token da conta). A inspeção mostra o sem www **indexado, com último rastreamento em 10/10/2026**. Naquela data o site antigo ainda declarava o próprio sem www como canônico. O Google ainda não releu o endereço depois da troca para 308.
- Resultado: a Home www continua "cópia" e o endereço www fica sem Home no índice. O Google mostra o ícone por endereço, a partir da Home oficial dele, então todos os resultados www saem com o **globo**.
- Prova: o recorte `evidence/icons/20261019T1852-neutral-1.png` (fica só na máquina, porque o repositório ignora PNG em `docs/organic`; o hash está no JSON do ciclo) mostra o globo SVG do Google (`iconKind: svg`, hash `4f5681529f82`), o mesmo de um site sem ícone (Start5G). O logo aparecerá como `iconKind: img`.
- O pedido de reindexação do sem www não entrou: a cota diária é **por conta**, e a de 19/10 já tinha acabado. É o **primeiro pedido de 20/10**.
- **Ponto de decisão:** 72 h depois desse pedido, se a Home www continuar fora do índice, o site passa para o endereço sem www, com autorização do proprietário ("com e sem www, tanto faz, só quero que funcione"). A ordem dos passos:
  1. Vercel: o sem www vira o domínio principal e o www redireciona 308 para ele. É feito no painel, porque o MCP não altera redirect de domínio.
  2. Código: origem única (`scripts/editorial.mjs`, `content/business.json`, `public/robots.txt`, `vercel.json`, testes e scripts).
  3. Pedidos de indexação na propriedade do sem www.

**Feito no guia** (seguindo as skills ai-seo e seo-audit, instaladas no commit fixo):
- título `Emissões fugitivas: o que são, fontes e LDAR | Monitorar`, na intenção que domina a 1ª página;
- "Em resumo" com 6 pontos, cada um levando à sua seção;
- estatística do metano com fonte e data (EPA, GWP de 27 a 30 em 100 anos);
- glossário com definições tiradas das fontes (CONAMA 382, Método 21, NOP-INEA-52, EPA);
- linha "Publicado em / Atualizado em", sem nome de pessoa;
- foto do acervo (técnico com detector portátil), também como `image` no Article;
- **link para o guia no topo** do artigo que está em 8º, do hub e do serviço, em vez de só no pé.

**Regras daqui em diante:**
- Sem novas edições no guia por 3 a 4 semanas depois de indexado, salvo erro de fato (*rankings-push*).
- Canibalização: se o Google alternar entre guia e artigo por 2 semanas sem subir, propor canonical do artigo para o guia (só com autorização, por ser um dos 90 artigos).
- O que decide contra Thermo Fisher e Wikipedia é autoridade: o kit do proprietário (`docs/organic/owner-actions.md`, seção "Foco: emissões fugitivas").


## Ícone e concorrentes (19/10, 23:50 UTC)

Pedido do proprietário: o ícone sumiu de páginas do blog depois de ter aparecido, e "ver como a Ambiens faz para sempre aparecer na IA e na 1ª página, e copiar".

**Ícone: nada quebrou no site.**
- Todas as páginas têm as mesmas tags de ícone.
- `/favicon.ico`, `/favicon-192.png` e `/apple-touch-icon.png` respondem 200 a Googlebot, Googlebot-Image e Google Favicon.
- O robots.txt libera tudo.
- A leitura `site:monitorarconsultoria.com.br` sem personalização (`evidence/cycles/serp-site-20261019T2350.json`, recortes `evidence/icons/20261019T2350-neutral-*.png`) mostra:
  - 1º: a Home **sem www**, com o título antigo e o **logo** (`img`, hash 27542e3c75ae). É o registro antigo de 10/10.
  - 2º a 10º: blog, conteúdos, sobre, serviços e outras páginas **www**, todas com o **globo** (`svg` 4f5681529f82).
- O "ícone que apareceu antes" é esse resultado sem www.
- O Google guarda o ícone por endereço. Para o www, ele só pode processar o ícone a partir da Home www, que entrou no índice em 19/10 às 16:09 (horário local).
- A documentação do Google fala em "vários dias ou mais". Não há o que mudar no código. O loop mede o hash a cada ciclo.

**Ambiens (www.ambiens.com.br):**
- Origem: São Paulo, no Wayback desde 2001. O site é feito pela agência **Doutores da Web**: script `doutoresdaweb.com.br/js/cookies.js` e `Disallow: /doutor/` no robots.
- Modelo: 98 URLs, uma página para cada variação de palavra-chave, como "consultoria-licenciamento-ambiental", "empresas-licenciamento-ambiental" e "estudo-impacto-ambiental-preco".
- Cada página tem cerca de 400 palavras, título "Palavra-chave - Ambiens", meta keywords e geo e só BreadcrumbList.
- Leituras sem personalização de hoje: **fora da 1ª página** em "consultoria ambiental", "empresa de consultoria ambiental" e "consultoria ambiental são paulo".
- **Ausente do quadro de IA** em "emissões fugitivas" e em "consultoria ambiental São Paulo" (que nem gerou quadro).
- A premissa "sempre aparece" não se confirmou nessas buscas.

**Mineral (www.mineral.eng.br)** é da mesma agência e foi a descoberta útil.
- Está **citada no quadro de IA de "emissões fugitivas"** (`evidence/cycles/ai-20261019T2352.csv`), ao lado de Alutal, eCycle, UFMG, Wikipedia e YouTube, sem estar entre os 10 orgânicos.
- A página provável é `/emissoes-fugitivas-ldar`:
  - tem 427 palavras;
  - título, H1 e URL repetem "emissões fugitivas LDAR";
  - a 1ª frase é uma definição direta;
  - lista os componentes (castelo, conectores, final de linha, flange, selo de bomba, válvula, válvula de segurança);
  - cita o Método 21 e o Protocolo de 1995 da EPA e o limite de 10.000 ppm;
  - tem JSON-LD com Article, Person, LocalBusiness e ImageObject;
  - tem galeria de 4 imagens com alt igual à palavra-chave.
- Domínio no Wayback desde 2001, a página indexada há anos.
- O mesmo tipo de conteúdo direto (definição, componentes, Método 21, OGI, LDAR, NOP-INEA-52) já está no nosso guia `/emissoes-fugitivas`. O guia **ainda não está no índice do Google**, e o quadro de IA só cita páginas indexadas.

**O que não copiar:**
- Texto: é cópia de conteúdo protegido e vira conteúdo duplicado.
- Uma página por variação de palavra-chave: a política de spam do Google cita *doorway abuse* e *scaled content abuse*, e as nossas páginas passariam a competir entre si.
- Meta keywords e geo: o Google ignora.

**O que fazer:**
1. Indexar o guia: é o 1º pedido quando a cota da conta renovar.
2. oHub, com cadastro gratuito de fornecedor: o diretório é **2º em "consultoria ambiental" no RJ e 1º em "consultoria ambiental são paulo"**, e a Monitorar não está na lista do RJ.
3. O restante do kit de autoridade.

Foram 6 consultas ao Google entre 23:50 e 23:55 UTC, sem captcha. O próximo ciclo faz no máximo 2, para ficar dentro de 10 em 3 horas.
