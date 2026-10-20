# Mapa Hub & Spoke — 20/10/2026

Etapa 5 do pedido: qual página pilar defende cada busca e como os 90 artigos empurram força para ela com âncora exata. É o que a Task 8 implementa; os testes conferem cada linha.

## Pilares das 4 buscas

| Busca | Pilar | Intenção | Apoio |
|---|---|---|---|
| emissões fugitivas | `/emissoes-fugitivas` (guia) | informacional | `/servicos/emissoes-fugitivas` (comercial, 1º em "monitoramento de emissões fugitivas"); `/conteudos/emissoes-fugitivas` (arquivo de artigos) |
| consultoria ambiental | `/` (Home) | comercial sem lugar | `/consultoria-ambiental` ("o que é / como escolher") |
| consultoria ambiental RJ | `/consultoria-ambiental-rj` | comercial com lugar | `/consultoria-ambiental-sp`, `-am`, `-por-estado` |
| empresa de engenharia ambiental | `/` (Home) | comercial | `/consultoria-ambiental` |

## Clusters de artigos

O pilar do cluster é o 2º item do breadcrumb dos artigos (visível e no JSON-LD). Hoje esse item é o "Blog" para todos.

| Cluster (`content/topics.json`) | Pilar no breadcrumb | Item do breadcrumb | Serviço |
|---|---|---|---|
| fugitivas | `/emissoes-fugitivas` | Emissões fugitivas | `/servicos/emissoes-fugitivas` |
| ar | `/conteudos/qualidade-do-ar` | Qualidade do ar | `/servicos#qualidade-ar` |
| ruido | `/conteudos/ruido-ambiental` | Ruído ambiental | `/servicos/ruido-extramuros` |
| areas | `/conteudos/areas-impactadas` | Áreas impactadas | `/servicos#areas-impactadas` |
| licenciamento | `/conteudos/licenciamento-ambiental` | Licenciamento ambiental | `/servicos#licenciamento` (sem página própria; ver `canibalizacao.md` (e)) |
| sms | `/conteudos/seguranca-de-processos-e-gestao-sms` | Gestão de SMS | `/servicos/seguranca#sms` |
| hazop | `/conteudos/hazop` | HAZOP | `/servicos/hazop` |
| treinamentos | `/conteudos/treinamentos` | Treinamentos | `/servicos/seguranca#treinamentos` |
| equipamentos | `/conteudos/equipamentos` | Equipamentos | `/servicos/drager` |

Só o cluster de emissões fugitivas tem um guia como pilar. Nos outros, o pilar é o próprio hub do tema, que já existe e não muda.

## Links de cada artigo, com a âncora exata

**Topo dos artigos de emissões fugitivas, do hub e do serviço** (já existe; mantém):
- [Guia completo de emissões fugitivas: o que são, fontes, detecção, LDAR e normas] → `/emissoes-fugitivas`

**Bloco final dos 89 artigos** (as 3 âncoras alternadas por artigo dão lugar a âncoras exatas):
- [empresa de engenharia e consultoria ambiental] → `/`
- [consultoria ambiental no RJ] → `/consultoria-ambiental-rj`
- [em São Paulo] → `/consultoria-ambiental-sp` e [no Amazonas] → `/consultoria-ambiental-am` (como hoje)
- [o que é consultoria ambiental e como escolher] → `/consultoria-ambiental`

**Já existentes e mantidos:**
- "Serviços relacionados": o serviço do cluster;
- "Explorar todos os artigos": o hub do tema.

## Links entre os pilares

- **Guia `/consultoria-ambiental`:** ganha links para a Home, com a âncora [empresa de engenharia e consultoria ambiental], e para o RJ, com [consultoria ambiental no RJ].
- **Serviço `/servicos/emissoes-fugitivas`:** continua ligando para o guia e para o RJ (bloco "Empresa de LDAR e monitoramento de emissões fugitivas").
- **Hub `/conteudos/emissoes-fugitivas`:**
  - title "Artigos sobre emissões fugitivas e LDAR | Monitorar Consultoria" e description própria;
  - o H1 e o texto aprovados não mudam;
  - deixa de disputar o termo principal com o guia.
