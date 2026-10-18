# Estado — SEO Growth, 18/10/2026

Plano implementado no repositório, partindo de c5bba48. Objetivo confirmado: RJ prioritário, oferta real de engenharia ambiental e atendimento nacional conforme escopo. Contas de busca ainda dependem do proprietário.

## Entregue

- Mapa de 100 destinos/intencões, incluindo todos os 90 artigos, com 140 formas de consulta únicas; nenhuma métrica de volume ou posição fabricada. JSON/CSV neste diretório.
- Home: título de busca e H1 identificam engenharia/consultoria ambiental no Rio. Slogan, vídeo, redes sociais e seções preservados. Serviços com títulos específicos e links de aprofundamento.
- Todos os artigos com serviço contextual e tema. Menu aponta a fugitivas, ruído e páginas dos nove assuntos. Oito coleções novas, reaproveitando artigos existentes. Relacionados diversificados dentro de cada assunto.
- Organization com contatos/endereço/sameAs reais, Article com primeira publicação e capa, breadcrumbs alinhados. Datas e corpos dos 94 documentos aprovados não alterados.
- Recibos das versões publicadas e manutenção separada: fontes envelhecidas não derrubam builds; alteração material, aprovação inválida ou autorização revogada continuam bloqueadas. Fonte monitorada nunca renova aprovação automaticamente.
- Checador de fontes cobre hosts reais, valida redirects e registra falhas individuais. Comando `npm run editorial -- maintenance` e arquivo `.organic/maintenance.json` reportam pendências.
- Verificação Search Console/Bing preparada por tokens de propriedade opcionais; nenhum token inventado e nenhum analytics adicionado.

## Validação

Build público e preview aprovados. Typecheck aprovado. Lint sem erros, oito avisos preexistentes. 37 testes aprovados. Navegador Chromium: sete rotas em 1440, 390 e 320px, 21 combinações, um H1 por página, sem overflow horizontal ou erros de execução. Capturas locais ignoradas pelo Git; relatório de navegação versionado em evidence/browser.json.

Comparação real do sitemap em produção antes do push com o artefato: todas as 113 URLs anteriores preservadas; oito adicionadas, total 121. Validação e lista dos acréscimos em evidence/validation.json. `git diff` confirmou corpo/metadata dos documentos aprovados e manifesto publicado intactos.

## Pendências externas

O proprietário precisa autenticar nas contas e obter tokens legítimos. Seguir ACCOUNTS.md para Search Console, Bing e recuperação/verificação do Perfil da Empresa. Nenhuma propriedade foi criada, nenhum sitemap foi enviado pela conta e nenhum estado de indexação foi medido. Coleta real de conversões permanece pendente. Não atribuir ao evento local de clique a condição de analytics.

## Continuidade e retorno

Próximo passo desta execução: commit/push autorizado e conferência do deployment/URLs. Evidências de produção serão registradas separadamente. Para retornar a apresentação anterior, reverter o commit SEO Growth preservando os commits de publicação e redes sociais; não executar reset/clean. Para futuro conteúdo novo, preparar manifesto e recibos juntos com `editorial prepare-release`, validar antes de promover. Não ativar publicação recorrente.

Skills: Schema utilizada para correspondência entre JSON-LD e conteúdo real. Orientações de identidade do Impeccable já carregadas na sessão preservadas nos ajustes de navegação e texto; sem novo conceito visual, imagens ou fontes. Documentação externa consultada está em PLAN.md.
