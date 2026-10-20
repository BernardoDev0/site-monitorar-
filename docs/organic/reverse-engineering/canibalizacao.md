# Canibalização: páginas que disputam a mesma busca — 20/10/2026

Etapa 5 do pedido. Os dados brutos estão em `canibalizacao-dados.md`, gerado por `scripts/cannibalization_audit.py` a partir do `dist/` (127 URLs do sitemap).

## Como foi medido

- **Peso da frase:** forte quando está no title, no H1 ou no slug; médio quando está só nos H2 ou na meta.
- **Conflito:** duas ou mais páginas com a frase forte e a mesma intenção (comercial, informacional, geográfica ou listagem).
- **Visão do Google, cruzada com o script:**
  - as leituras sem personalização de 19/10 (`rankings/baseline-2026-10-19.csv`) e de 20/10 (`serp/`);
  - o Search Console: 3 impressões no total, todas para "consultoria em segurança do trabalho rj". Ainda não há dado de busca para os termos-alvo.
- **O que o script marca e não é conflito:** artigos com a frase forte, mas com outra pergunta. Ex.: "Cadastro de componentes para LDAR" e "Reparo e reverificação em LDAR" cobrem etapas diferentes, não "o que é LDAR". Esses foram descartados um a um na leitura abaixo.

## Conflitos conferidos

| | Busca | Páginas em disputa | O que o Google mostra | Decisão |
|---|---|---|---|---|
| (a) | **emissões fugitivas** | `/emissoes-fugitivas` (guia) × `/blog/o-que-sao-emissoes-fugitivas` (artigo 019) × `/conteudos/emissoes-fugitivas` (hub, title "Conhecimento sobre emissões fugitivas") | 19/10: o **artigo 019** em 8º e, 20 min depois, fora da página 1. 20/10: nenhuma página nossa. O guia está "Detectada, mas não indexada" | Fundir o artigo 019 no guia com 308 (**Task 7**, aprovado pelo dono em 20/10). O hub vira o arquivo "Artigos sobre emissões fugitivas e LDAR" (**Task 8**) |
| (b) | **consultoria ambiental** | `/` (Home) × `/consultoria-ambiental` (guia) × `/consultoria-ambiental-rj` (+ SP, AM, por estado) × `/servicos` | 20/10: **RJ em 2º** no termo sem cidade (IP do RJ) e 5º em "…RJ". Home e guia não aparecem | Separar por intenção (**Task 9**): Home = comercial sem lugar ("consultoria ambiental", "empresa de engenharia ambiental"); RJ/SP/AM = a mesma busca com lugar; guia = "o que é / como escolher". O title e o H1 da página RJ não mudam, porque ela ranqueia. `/servicos` é o catálogo e fica |
| (c) | **monitoramento de emissões fugitivas / contratação** | `/servicos/emissoes-fugitivas` × "Como contratar monitoramento de emissões fugitivas" × "Dados para orçamento…" × "Inventário de GEE e monitoramento de fugitivas" | 19/10: o **serviço em 1º** em "monitoramento de emissões fugitivas" | Fica como está, porque o serviço ganha. Os artigos já ligam para o serviço em "Serviços relacionados" |
| (d) | **LDAR** | `/blog/o-que-e-ldar` × `/servicos/emissoes-fugitivas` × o guia (title "…fontes e LDAR") | 19/10: **"o que é LDAR" em 1º** em "programa LDAR" e 2º em "empresa de LDAR" | Fica como está. Os outros 9 artigos de LDAR tratam de etapas diferentes |
| (e) | **licenciamento ambiental** | 10 artigos citam licenciamento; só "Documentos para iniciar licenciamento ambiental" e o hub `/conteudos/licenciamento-ambiental` trazem a frase forte | 19/10: ausente em "consultoria para licenciamento ambiental", "licenciamento ambiental RJ" e "licenciamento INEA" | Não há disputa interna, e sim **falta de pilar**: o serviço é só uma âncora (`/servicos#licenciamento`). Recomendação: uma página `/servicos/licenciamento-ambiental`, que **depende de aprovação do dono** e não entra nesta rodada |

## O que não muda

- **O texto dos 90 artigos:** aprovado com hash e intocado. As mudanças vêm do template (Task 8), de `content/seo-overrides.json` e dos guias.
- **Fusões:** só o artigo 019. Qualquer outra precisa de nova aprovação do dono.
- **URLs:** nenhuma muda além do 308 do artigo 019.
