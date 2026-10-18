> **Escopo visual substituído em 17/10/2026.** A correção do proprietário determina recuperação seletiva e lapidação conservadora, preservando textos, seções, identidade e funcionalidades. O redesign integral abaixo é histórico, não autorização vigente. A rodada atual termina na amostra isolada da home e aguarda aprovação visual. Consulte `docs/organic/recovery/README.md`. A frente editorial permanece separada.

# Plano V2 — Monitorar: Campo e precisão

Data da auditoria: 17/10/2026. Estado desta entrega: planejamento materializado; redesign não implementado.

## Alvo e autorização

- Empresa: Monitorar Consultoria.
- Repositório: D:/site-monitorar--main; remoto https://github.com/BernardoDev0/site-monitorar-.
- Branch auditada: codex/organic-monitorar; HEAD b253b47.
- Domínio-alvo: https://www.monitorarconsultoria.com.br/.
- Missão: [prompt V2](../../../PROMPT_2_CODEX_MONITORAR_SEO_IMPECCABLE_TASTE.md).
- Direção confirmada pelo proprietário: **Campo e precisão — presença institucional e clareza técnica equilibradas**.
- A execução deste pacote cumpre a próxima ação do plano apresentado: materializar documentos V2 e parar antes do redesign. Não altera código, corpus, manifesto, PRODUCT.md ou DESIGN.md. Implementação local do lote B e publicação têm decisões próprias.

## Diagnóstico

O trabalho anterior criou uma base estática útil, operação editorial local e dez rascunhos. Não criou um blog integrado. /blog retorna 404 nos builds locais; /conteudos existe na prévia e mistura os dez documentos. Header e home não oferecem entrada editorial. Serviço, artigo e hub ainda têm apresentação semelhante.

Há 17 rotas legadas (incluindo aliases), dez canônicas no sitemap público local e zero novos documentos no manifesto publicado. O catálogo reúne 90 propostas, não 90 páginas prontas: 12 serviços, seis hubs e 72 artigos. Dez JSONs estão em technical_review, sem nova aprovação humana.

Os relatórios de 16/10 foram confrontados com arquivos, builds e navegador em 17/10. Foram confirmadas falhas adicionais de integridade editorial e uma regressão de redução de movimento em Clientes. Detalhes e limites: [AUDIT-DELTA.md](AUDIT-DELTA.md). Alterações preexistentes foram preservadas; o baseline registra hashes, não conteúdo sensível.

## O que muda

1. O escopo visual passa da evolução incremental ao site inteiro, sem migrar React/Vite nem apagar URLs.
2. Blog, diretório, hubs, busca e paginação passam a ter contratos próprios.
3. Serviço, artigo e hub ganham estrutura adequada à tarefa do visitante.
4. Cada proposta editorial recebe pergunta, fronteira, artefato próprio e pesquisa específica.
5. Impeccable e Taste trabalham sobre uma única direção, com origem e execução registradas.
6. Release de design/funcionalidade é separado da liberação de conteúdo. Não é necessário esperar 90 conteúdos para corrigir o site, nem liberar rascunhos junto com o design.

## Direção e experiência

Preservar logo, azul/verde e DM Sans. Home com composição assimétrica, conteúdo comercial claro e imagem autorizada; fallback tipográfico com diagrama próprio. Artigos com leitura em 68ch, sem hero publicitário gigante. Movimento curto e útil, nunca condição para enxergar conteúdo.

Navegação: Início, Empresa, Serviços, Blog, Contato; destinos institucionais preservados nos agrupamentos e rodapé. /blog lista artigos, /conteudos orienta por hubs, /busca oferece busca local de conteúdo elegível. Ver [DESIGN-PLAN.md](DESIGN-PLAN.md) e [cobertura integral](design-coverage.csv).

## Pesquisa e meta editorial

A pesquisa Ambiens identificou 785 endereços: 413 acessos (374 respostas 200 e 39 respostas 404), 313 ativos excluídos e 59 caminhos proibidos por robots, não solicitados. Entre os 374 resultados 200, 24 corpos foram lidos, 18 listagens/variantes verificadas tecnicamente e 332 examinados somente por metadados. Não representa auditoria semântica integral.

As conclusões orientam perguntas, escopo, evidências e formatos; não copiam textos nem ampliam a oferta Monitorar por analogia. [Pesquisa e limites](AMBIENS-RESEARCH.md).

A meta permanece 90 conteúdos distintos. Diretório, busca, paginação, aliases e políticas não a inflam. IDs estáveis; propostas 040 e 060 substituídas com destino da intenção registrado; treinamento 011/085/086 reclassificado. [Arquitetura](CONTENT-ARCHITECTURE.md), [mapa](url-map-v2.csv), [briefs](briefs/).

## Fases e passagem

| Fase | Resultado | Passagem |
|---|---|---|
| A — esta entrega | Auditoria, direção, pesquisa, mapas, specs, tarefas e checkpoint | Integridade documental e decisão do proprietário |
| B — primeira implementação | Home → blog → 021 → 002 → contato; busca e templates | Prévia verificável, testes, preservação e autorização de implementação |
| C — cobertura integral | About/aliases, Services/Dräger, Clients, Testimonials, Careers, Privacy, 404 e componentes | Todas as linhas da cobertura com evidência |
| D — conteúdo | Aprofundar os oito pilotos restantes; nove lotes editoriais reconciliados | Fontes lidas, utilidade demonstrada e revisão por versão |
| E — regressão | Rotas, SEO, acessibilidade, mídia, performance e reversão | Falhas resolvidas ou limitação explicitamente aceita |
| F — release | Candidato validado e artefato anterior disponível | Publicação somente com autorização específica |
| Continuação | Medição e atualização por mudança real | Acesso autorizado; métricas com origem e limites |

## Primeiro lote

[B01–B08 em TASKS.md](TASKS.md) constituem uma fatia visível, não outra rodada indefinida de planejamento:
- B01: integridade de manifesto, pausa, projeção de pessoas e preservação.
- B02: tokens, shell, home, entrada Blog e correção de Clientes com reduced motion.
- B03: blog, diretório e paginação estática.
- B04: templates e blocos semânticos.
- B05: busca local real.
- B06: contato com canais claros e mensagem local editável.
- B07: matrizes próprias dos IDs 002 e 021, ainda rascunhos.
- B08: jornada, regressão e evidências.

Esforço indicativo somado: 42–72 horas de trabalho técnico, sem prazo prometido e sem incluir disponibilidade de revisão humana. Direitos de fotos e aprovação técnica bloqueiam seus usos, não navegação, layout ou testes independentes.

## Critérios de conclusão

- Jornada principal e alternativa home → serviço → artigo funcionam por links HTML.
- Nada do corpus em rascunho chega ao público, busca ou sitemap.
- 17 rotas legadas, PDFs e alterações anteriores preservados.
- UI verificada em 390/768/1440, teclado, foco, zoom 200%, movimento reduzido e cores forçadas.
- Conteúdo responde à pergunta específica com artefato próprio; tamanho não é critério substituto.
- Sem métricas, autores, datas, clientes, serviços ou aprovação fictícios.
- Evidências de laboratório não são apresentadas como Core Web Vitals de produção.
- Publicação não é disparada pela preparação de candidato ou pelo aceite da documentação.

## Navegação do pacote

- [Auditoria delta](AUDIT-DELTA.md), [pesquisa](AMBIENS-RESEARCH.md), [inventário Ambiens](ambiens-inventory.csv).
- [Design](DESIGN-PLAN.md), [cobertura](design-coverage.csv), [arquitetura](CONTENT-ARCHITECTURE.md), [mapa editorial](url-map-v2.csv).
- [Tarefas](TASKS.md), [validação/release](VALIDATION-AND-RELEASE.md), [decisões e bloqueios](DECISIONS-AND-BLOCKERS.md).
- [Fontes/skills](SOURCES-AND-SKILLS.md), [estado de execução](EXECUTION-STATE.md).
- [Especificações V2](../../../specs/organic/v2/01-scope-and-preservation.md).
