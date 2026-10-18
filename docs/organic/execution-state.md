# Estado atual: implementação V2

A continuação de 17/10/2026 está registrada em [v2/EXECUTION-STATE.md](v2/EXECUTION-STATE.md). Há redesign local, 18 rascunhos e 72 propostas ainda sem corpo; a meta de 90 revisados não foi concluída. Sem push ou deploy. O registro abaixo é histórico da rodada de 16/10.

---

# Estado para continuação

Atualizado em 16/10/2026, rodada local encerrada após implementação e validação do primeiro lote.

## Alvo e autorização

D:/site-monitorar--main; remoto https://github.com/BernardoDev0/site-monitorar-; Monitorar Consultoria; https://www.monitorarconsultoria.com.br/.
Branch codex/organic-monitorar, base b253b47. Prompt originalmente não rastreado preservado. Sem commit/push/deploy nesta rodada. A autorização cobre implementação local; produção, DNS, contas, pagamentos e agendamento recorrente não estão autorizados.

## Entregue

- Auditoria somente leitura e linha de base; PRODUCT/DESIGN; seis especificações; plano, tarefas, fontes, mapa de URLs e briefs.
- 17 rotas legadas preservadas; HTML estático por rota; metadados e canonicals específicos; sitemap XML; robots; página 404 e contrato local de status.
- Dez rascunhos originais em JSON, templates serviço/artigo/hub, sumário, referências, relações e CTA. Índice automático somente quando há documentos elegíveis no artefato.
- Organization/WebSite/BreadcrumbList; Service/Article apenas na versão pública aprovada, coerentes com os campos disponíveis.
- Correção de links/contato, remoção da credencial no cliente, vídeo opt-in, conteúdo visível sem animação, reduced motion, navegação por links, diálogos Radix e foco.
- Validador editorial com autoria real autorizada, evidência, datas, hash do documento e hashes das fontes; falha de fonte, alteração material, duplicata, pausa ou remoção indevida bloqueiam liberação.
- Simulação local idempotente, snapshots e rollback; manifesto existente preservado. Nenhum cron ou publicador externo ativo.
- Testes e evidências em validation.md e evidence/.

## Contagem editorial

| Estado | Quantidade |
|---|---:|
| Propostas com brief | 90 |
| Textos integrais de primeiro lote | 10 |
| Aguardando revisão técnica humana | 10 |
| Revisados e aprovados por humano | 0 |
| Novas páginas publicadas em produção nesta rodada | 0 |
| Novas páginas elegíveis no manifesto público local | 0 |
| Indexadas | não medido |

As 90 propostas distribuem-se em 12 serviços, seis hubs e 72 artigos/guias. O índice automático não entra na meta. Os dez rascunhos têm 217–279 palavras de corpo; são material de revisão inicial, não profundidade técnica certificada. A expansão até 90 conteúdos úteis permanece pendente; não será preenchida com duplicações.

## Comandos de retomada

1. Ler este arquivo, validation.md, context-and-evidence.md, skills-lock.md e editorial-workflow.md.
2. git status --short; confirmar branch e preservar novas alterações do usuário.
3. npm run build:preview; npm run preview:editorial.
4. Abrir http://127.0.0.1:4174/conteudos. Servidor da rodada iniciado somente em localhost; se não estiver ativo, iniciar pelo comando acima.
5. Revisar IDs 002, 006, 009, 013, 019, 021, 022, 023, 053 e 082 com responsável técnico real.
6. Resolver evidência e registrar autor/revisor/escopo autorizado. Rechecar fontes antes de aprovar hash.
7. Simular versão aprovada, testar preservação/rollback e preparar manifesto local. Build não equivale a publicação.
8. Executar build, build:preview, typecheck, lint e test após mudanças pertinentes.

## Pendências humanas e de liberação

- Titular revogar/rotacionar credencial exposta anteriormente. Não recuperar nem registrar o valor antigo.
- Designar autores/revisores e obter autorização de identidade; confirmar oferta, metodologia e entregáveis.
- Comprovar história, contribuição em fugitivas, números e ranking; resolver datas conflitantes.
- Autorizar uso de marcas, logos, imagens, clientes e eventual case. Petrobras continua pauta independente de fontes públicas.
- Rever o texto de privacidade e os textos institucionais legados com responsável; legados foram preservados, não endossados.
- Dados e acessos de medição continuam ausentes.
- Casos e história não têm novo exemplar publicável sem evidência.
- Publicação continua dependente de autorização específica e checklist de release.

## Próxima tarefa concreta

Revisão técnica do par 002 (serviço de emissões fugitivas) e 021 (detecção versus quantificação), usando evidence-collection.md. Sem retorno do especialista, avançar em pesquisa primária por pauta e manutenção técnica; não atribuir aprovação fictícia. Após incorporar o retorno do primeiro lote, expandir em lotes de 8–12 conforme a prioridade e as fronteiras de intenção dos briefs.

Pendências técnicas registradas: testar tecnologias assistivas/zoom/contraste, completar revisão de todos os legados, validar provedor real apenas quando autorizado, detalhar imagens/data de publicação dos artigos quando houver material autêntico. Alertas de dependências não motivaram atualização automática.

