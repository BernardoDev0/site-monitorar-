# Validação, medição e release

## Evidências existentes e novas

A auditoria17/10 reexecutou build público/preview,16 testes,typecheck,lint e diffcheck. Ver AUDIT-DELTA.md. A materialização dos documentos faz validações de CSV/IDs/links/requisitos/preservação; não requer repetir build de código intocado. Evidências de16/10 ficam no histórico e não são renomeadas como novas.

15 screenshots atuais em evidence/screenshots; inventário e hashes registram conteúdo real. Não há screenshot do redesign, Lighthouse V2, NVDA, dados de campo ou teste pós-deploy nesta entrega.

## Matriz de aceite da implementação

| Área | Cenários | Evidência |
|---|---|---|
| Preservação |17 rotas, aliases, PDF, alterações preexistentes | Baseline, hash/diff, inventário HTTP |
| Manifesto | chave≠slug; ID/slug/corpo duplicado; rota reservada; substituição legada não explícita | Testes de rejeição em todas as entradas |
| Operação | pausa ilegível/malformada; aprovação de hash antigo; candidato sem publicação; rollback | Fixtures e logs locais |
| Pessoas | authorized:false e dados internos | HTML/índice público sem nome/campo indevido |
| Independência | rascunho inválido e versão publicada válida | Build público preservado; prévia acusa rascunho |
| Blog |0,1,12,13,25 artigos; serviço não aparece; destaque inválido | HTML, paginação,canonical,status |
| Paginação |página 1 →308; inválida/fora→404; página 2sócom≥13 | HTTP local e pós-deploy autorizado |
| Diretório |zero/um/seis hubs; síntese; parentsem ciclo | HTML e vínculos |
| Busca |acentos/caixa; termos; títuloexato; filtro; zero; erro; limpar; mostrarmais | Testes e capturas de estados |
| Templates |serviço/artigo/hub distintos; tabela/figura; bodyantigo | Render comparativo e HTML sem JS |
| Contato |inválido; preparado; editado; cópiafalha/sucesso; campospreservados | Dados sintéticos e saídas interceptadas |
| Acessibilidade |390/768/1440; teclado; foco; contraste; zoom 200%; forcedcolors; reducedmotion | Matriz manual e capturas; NVDAse disponível |
| Clientes |14elementosvisíveis semanimação; nenhumaltundefined | Estilos computados e inspeção |
| SEO |title,description,lang,H1,canonical,OG,JSONLD; 404; robots; sitemap | Contratos e HTML |
| Rascunhos |fora do público,sitemap,busca,links e schema | Busca por IDs/destinos/campos |
| Conteúdo |pergunta,fronteira,artefatopróprio,fontecontextualizada | Checklist por versão e revisão humana |

Erros de teste bloqueiam a parte correspondente; não marcar como passou quando ferramenta/manual não está disponível. Score automatizado não certifica WCAG ou utilidade editorial.

## Orçamentos e protocolo

| Experiência | JS inicial gzip | CSS inicial gzip | Fontes | Transferência móvel inicial |
|---|---:|---:|---:|---:|
| Home, serviço, empresa, contato |170 kB |20 kB |100 kB |650 kB |
| Blog, artigo, hub |110 kB |20 kB |100 kB |400 kB |

Contar dependências compartilhadas uma vez por navegação com cache vazio; incluir mídia/fontes na transferência. Imagem LCP até 120 kB móvel/180 kB desktop como alvo. Vídeo sem carga inicial; imagens abaixo da dobra lazy com dimensões; fontes locais somente após licença confirmada. Não remover conteúdo para atingir nota.

Laboratório futuro: três execuções, cache limpo, mesma versão de navegador/Lighthouse, viewport 390, CPU 4×, rede1600 kbps/RTT150 ms. Registrar configuração, mediana e variação; metas LCP≤2,5s,CLS≤0,1,TBT≤200ms. Localhost113ms anterior não representa rede móvel. INP/p75 e Core Web Vitals de produção não medidos.

## Fluxo editorial e liberação

1. Descoberta e fonte com estado de leitura.
2. Brief específico e rascunho assistido.
3. Revisão editorial/técnica e evidências institucionais pertinentes.
4. Pessoa real registra decisão vinculada ao hash da versão; cadastro local não autentica identidade por si só.
5. Prévia e testes; qualquer mudança material invalida aprovação anterior.
6. Preparar manifesto candidato separado de publicado e artefato anterior.
7. Publicar apenas com autorização explícita de alvo, candidato e rollback.
8. Verificar HTTP/HTML/CDN após publicação e acompanhar mudanças reais.

O release técnico pode manter zero novos editoriais. A meta90 não é bloqueio para design aprovado. Conteúdo não revisado não acompanha release visual. Pausa inválida deve bloquear preparação; falha parcial não promove artefato.

## Reversão

Antes da implementação, snapshot do estado sujo, conteúdo e ativos tocados. Reverter somente alterações da tarefa, preservando alterações concorrentes; não usar reset/clean/stash destrutivo. Antes de release, registrar digest do candidato e artefato anterior, URLs, aprovações e instrução de reversão. Preparação não atualiza manifesto atual nem dispara CI/deploy. Retorno de produção depende de autorização pertinente.

## Medição após acesso e publicação autorizados

GSC: cobertura, problemas técnicos, consultas e páginas por marca/serviço/cluster. Analytics/CRM: cliques de canal separados de mensagens recebidas e oportunidades qualificadas. Eventos apenas channel/path; não incluir formulário, query, fragmento, telefone ou mensagem. Um evento local não prova integração externa.

Baseline: não medido até acesso real. Checagens técnicas24/72 h após release; leitura de tendências2/4/8 semanas, com data, mudanças concomitantes e limites. Não atribuir causalidade a uma métrica nem prometer ranking, prazo de indexação ou leads. Permissão de busca e treinamento de crawlers são decisões diferentes; robots/schema/llms não garantem citações.

## Permissões

Sem commit,push,PR,deploy,DNS,contratação,cron,instalação ou envio nesta entrega. Só publicar o candidato autorizado depois de revisão e testes. Credencial histórica exige rotação pelo titular; não imprimir ou exportar valor.

## Resultado da materialização documental

40/40 verificações gerais aprovadas: artefatos, campos obrigatórios, IDs, caminhos, lotes, relações, fontes mapeadas, cobertura de rotas, 28 requisitos, 27 tarefas, links locais, capturas, ativos e preservação de 321 arquivos anteriores. A verificação editorial independente aprovou 23 contratos. O inventário Ambiens foi corrigido para os 19 campos mínimos e 13 complementares; os 785 registros foram preservados.

Reprodução: python -X utf8 docs/organic/v2/evidence/validate-materialization.py, a partir da raiz. O script escreve somente o relatório e os manifestos na V2. Não executa código de produção ou publica. Os testes futuros do redesign permanecem não executados.
