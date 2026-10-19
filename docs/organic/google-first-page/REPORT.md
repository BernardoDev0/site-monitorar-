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
