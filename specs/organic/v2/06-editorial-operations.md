# Operação editorial, aprovação e automação

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

As validações diferem entre simulação e preparação. Uma pausa inválida pode ser ignorada e nomes podem ser projetados sem autorização. Cadastro local não autentica o aprovador.

## Objetivo

Reaproveitar JSON/Zod/registry/hash com validação consistente, candidato separado e aprovação humana real.

## Fora de escopo

CMS, banco, fila, API paga, cron, escritor/publicador autônomo e aprovação simulada.

## Componentes e arquivos afetados

scripts/editorial.mjs; scripts/editorial-cli.mjs; scripts/build.mjs; content/documents e registros/manifestos existentes; tests/editorial.test.mjs; futuro candidato separado do publicado.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S06-R01 | Usar validador compartilhado em simulação, preparação e build: chave = slug, IDs/slugs/corpos únicos, rotas reservadas, sem colisão silenciosa, fontes/versionamento/relações coerentes. Projeção pública mínima inclui somente pessoas com authorized. | Rejeitar as mesmas fixtures inválidas em todas as entradas; HTML e índices sem campos privados. |
| S06-R02 | Separar escrita, revisão técnica/editorial, evidência institucional e aprovação. Aprovação vinculada ao hash exige pessoa real autorizada e ato registrado; cadastro pela CLI não autentica sozinho. Mudança material invalida aprovação. | Hash antigo deixa de ser elegível; revisão, data e autor não são inventados; limitação de autenticação explícita. |
| S06-R03 | Pausa ilegível ou malformada bloqueia a operação. Preparação gera candidato com digest sem alterar publicado. Build público usa snapshots aprovados independentes de drafts. Validar saída temporária antes de promover e manter rollback. | Rascunho inválido não derruba versão publicada válida; falha parcial não promove; idempotência e preparação sem deploy. |

## Decisões

O fluxo local não é CMS nem publicador ativo. Hash normalizado detecta repetição exata; similaridade semântica exige revisão. Hash de HTML com shell comum não prova duplicidade. Mudanças de conteúdo/data precisam de justificativa real.

## Estados vazios, erros e falhas

Pausa ativa/inválida; fonte pendente/indisponível; rascunho inválido; revisão insuficiente; hash divergente; colisão de rota; candidato validado/publicado anterior; falha de build.

## Dependências

Revisores e evidências para elegibilidade; B01 não exige aprovar artigos; publicação autorizada separadamente.

## Critérios de aceite

Todas as entradas aplicam os mesmos invariantes; nenhum nome não autorizado; preparação não publica; rollback preserva versões anteriores.

## Testes e evidências

Fixtures de chave/slug, ID, corpo, rotas, pausa, authorized, hash antigo, candidato separado, draft inválido, rollback e idempotência.

## Riscos

Falsa autenticação, corpos duplicados sob slugs diferentes, pausa ignorada, build dependente de drafts e rollback que apaga trabalho. Mitigar com contratos únicos e snapshots.

## Reversão

Retomar manifesto/artefato anterior sem apagar revisões; descartar candidato sem reescrever o histórico de aprovação.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
