# Monitorar Consultoria
Site React18 + Vite + TypeScript. Evolução orgânica local em docs/organic.

Entrega local atual: [V4.2 — movimento, busca e Expertise compacta](docs/organic/v4.2/EXECUTION-STATE.md).
`npm run dev` abre o servidor em http://127.0.0.1:8081/ com site e 90 artigos em prévia editorial. Nenhum artigo desse lote foi publicado.

- npm run build: gera site estático publicável em dist, sem deploy.
- npm run build:preview: gera prévia local com rascunhos em dist-preview.
- npm run preview: serve dist em127.0.0.1:4173.
- npm run preview:editorial: serve dist-preview em127.0.0.1:4174.
- npm run typecheck; npm run lint; npm test (testes de artefatos exigem build e build:preview).
- npm run editorial -- status: bloqueios por documento.
- node scripts/catalog.mjs: regenera mapas derivados do catálogo e cria briefs ausentes. Preserva briefs já existentes; revisar o diff dos mapas antes de aceitar.

Não publicar ou ativar automação sem autorização. Estado e pendências em docs/organic/execution-state.md. Não incluir credenciais no cliente nem tratar abertura do WhatsApp como envio confirmado.
