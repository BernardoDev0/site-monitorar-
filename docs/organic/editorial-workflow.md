# Operação editorial
1. Revisar mapa e brief; consultar fontes primárias específicas.
2. Editar documento JSON em content/documents, validado por Zod. Registrar revisão humana verdadeira, sem usar identidades de fixtures.
3. Registrar pessoas autorizadas, evidências com escopo e fontes no registry. Identidades não autorizadas não são projetadas no site.
4. npm run editorial -- check-sources verifica disponibilidade/hash com allowlist, até50fontes e2tentativas. Redirecionamento/erro não é aprovação; alterações abrem propostas locais.
5. Responsável atualiza author_id, reviewer_id, reviewed_at, review_due_at, claim_status e evidências após revisão real.
6. npm run editorial -- approve ID --by PESSOA aprova hash apenas se todos os bloqueios estiverem resolvidos.
7. npm run editorial -- simulate ID prepara simulação; repetir não duplica. pause/resume/rollback operam somente estado local .organic.
8. prepare-release materializa manifesto candidato local. npm run build produz dist; não faz deploy. Nenhum comando envia mensagem ou publica externamente.

A aprovação registra approved_sources (hash por URL) dentro da versão material. Alteração de fonte exige nova leitura e aprovação, mesmo sem editar o corpo do artigo. A verificação HTTP/hash é conservadora: mudanças de HTML semântico ou cosmético podem bloquear a versão; nunca são aprovadas automaticamente. O cadastro de pessoas exige nome não vazio e autorização.

Sem simulação anterior, simulate parte de content/published.json. prepare-release respeita pausa e recusa remover páginas do manifesto anterior. Rollback restaura apenas snapshots locais; remoção de conteúdo publicado requer decisão separada. Os briefs existentes são preservados ao executar catalog.mjs; mapas derivados devem ser revisados no diff.

Preview: npm run build:preview e npm run preview:editorial, apenas127.0.0.1:4174. Rascunhos nunca passam a dist por estarem na prévia. Conteúdo técnico requer revisor apropriado; fontes verificadas porHTTP não representam revisão técnica. A simulação automatizada usa somente fixtures identificadas como teste. Publicação real continua proibida até autorização.

Limite de custo externo: zero. Sem LLM/API externa, fila, cron, contas ou banco. Jobs manuais, logs sem dados pessoais. Preserve snapshots de versões publicadas; uma edição de rascunho não substitui o manifesto anterior.
