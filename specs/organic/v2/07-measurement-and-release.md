# Medição, liberação e retorno à versão anterior

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

Não há dados verificados de GSC, GA ou conversão. Clique local não comprova contato recebido; build local não verifica CDN ou indexação.

## Objetivo

Preparar medição proporcional e liberação verificável, com autorização e reversão.

## Fora de escopo

Ativar analytics, cron ou deploy automaticamente; prometer leads/ranking; coletar PII ou comprar tráfego/links.

## Componentes e arquivos afetados

src/lib/contact.ts; src/pages/Contact.tsx; src/components/WhatsAppButton.tsx; scripts/build.mjs; manifesto/artefatos de candidato; hospedagem somente com autorização.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S07-R01 | Eventos de contato contêm apenas channel/path, sem formulário, telefone, email, query, fragmento ou mensagem. Separar clique, cópia, recebimento e oportunidade. Preservar a tarefa do visitante. | Interceptar saídas; verificar payload mínimo; nenhuma afirmação de envio ou integração inexistente. |
| S07-R02 | Separar release de interface e lotes de conteúdo. Preparar candidato com digest, rotas, aprovações, testes e artefato anterior. Publicar somente com autorização específica; verificar HTTP/HTML/CDN depois. | Candidato não dispara CI, push ou deploy; não contém drafts; rollback ensaiado localmente. |
| S07-R03 | GSC, GA e Perfil da Empresa permanecem não medidos até acesso autorizado. Baseline com origem/data; marca versus serviço/cluster; checagens 24/72 h e avaliações 2/4/8 semanas após release. Separar permissões de busca e treinamento. | Relatório distingue zero de falta de acesso, laboratório de campo e clique de lead; nenhuma promessa de controlar robôs ou citações. |

## Decisões

O primeiro release técnico pode conter zero novos editoriais. A meta 90 não é pré-condição. Nenhum domínio paralelo. Métricas observacionais não provam causalidade.

## Estados vazios, erros e falhas

Sem acesso: não medido. Erro de integração: não concluído. Candidato reprovado, publicação não autorizada ou falha após release com retorno.

## Dependências

Acesso e titular para GSC/GA; autorização para ação externa; E01 e aprovações pertinentes.

## Critérios de aceite

Plano de instrumentação mínimo, release revisável e reversão definida; nenhuma publicação ou medição fictícia.

## Testes e evidências

Payload sem PII; inspeção de candidato; hashes; rollback local; HTTP após release apenas se autorizado.

## Riscos

Confundir clique com lead, disparar deploy pelo build, atribuir causalidade indevida. Mitigar com limites e autorização por ação.

## Reversão

Retornar artefato anterior aprovado; desabilitar somente integração autorizada que falhou; conservar registros sem PII.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
