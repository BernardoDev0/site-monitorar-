# Por que "emissões fugitivas RJ" está na página 1 — 20/10/2026

Fase 1 do pedido "engenharia de busca autônoma em loop". A pergunta era: o que fez essa frase entrar na página 1, para repetir nas outras 4?

## A premissa não confere

**Não entrou "na hora", depois do push de 20/10.** O `LOOP-LOG.md` registra a Monitorar em **1º** em "emissões fugitivas RJ" nos ciclos de:

| Data | Horários (UTC) |
|---|---|
| 19/10 | 13:27, 14:30, 15:00, 16:55, 18:55, 18:58 e 21:43 |
| 20/10 | 00:42 |

Ou seja, antes do push de 20/10, às 13:05 UTC. Na primeira leitura, a de 13:27 com a conta, o 1º lugar era o artigo Petrobras. Nas seguintes, era o serviço `/servicos/emissoes-fugitivas`.

## A página que ranqueia

**URL e índice:** `https://www.monitorarconsultoria.com.br/servicos/emissoes-fugitivas`. Estava indexada antes desta rodada, com rastreios em 18/10, às 21:07, e em 19/10, às 10:51.

| Onde | O que tem |
|---|---|
| `<title>` | "Monitoramento de emissões fugitivas no RJ \| Monitorar Consultoria": a frase e o lugar |
| `<h1>` | "Monitoramento de emissões fugitivas" |
| meta description | "Monitoramento de emissões fugitivas e LDAR com sede no Rio de Janeiro: …" |
| Primeiras palavras do texto principal | "O monitoramento de emissões fugitivas ajuda a organizar…" (a frase está na 1ª frase) |
| Texto principal (trafilatura) | 731 palavras; "emissões fugitivas" 5 vezes; "RJ"/"Rio de Janeiro" 6 vezes |
| HTML bruto, sem JavaScript | 130 KB, 1.071 palavras visíveis (user-agent do Googlebot) |
| JSON-LD | Organization + LocalBusiness, WebSite, WebPage, BreadcrumbList, Service |

## O que explica, e o que não explica

**O que explica:**
- A página já estava **indexada**.
- Ela tem **a frase e o lugar** no título e no começo do texto.
- A frase com "RJ" tem **pouca concorrência**: poucos sites falam de emissões fugitivas com foco no Rio de Janeiro.

**O que não explica:** não há "primeira onda" nem fórmula de ranqueamento instantâneo.

**Comparação com as 4 frases-alvo:** elas disputam com sites de 10 a 20 anos de conteúdo contínuo. Para "emissões fugitivas", são Thermo Fisher, Alutal, Wikipedia e WIKA. Para os termos de consultoria, são as Homes da Rio Ambiental, Ambiental Consult, Ética e Masterplan, além do diretório oHub. O nosso domínio teve uma página de ~2 KB de 2013 a 2022 e "Site em Construção" de 2024 a 2025 (archive.org).

## O padrão que o loop aplica nas páginas-alvo

O loop repete nas páginas-alvo o que essa página tem:
- **URL indexada:** é o primeiro item da fila de pedidos (guia, Home, guia de consultoria).
- **Frase exata no título, no H1 e no começo do texto.**
- **Termos do nicho e links internos com a âncora exata.**

O efeito não é o mesmo, porque a concorrência das 4 frases é outra. Cada mudança é medida pelo `scripts/serp_loop_engine.py`.
