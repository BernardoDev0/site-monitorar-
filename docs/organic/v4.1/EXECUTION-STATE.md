# Monitorar V4.1 — entrega local em 18/10/2026

Prévia: http://127.0.0.1:8081/ e http://127.0.0.1:8081/blog. Repositório D:/site-monitorar--main, branch codex/organic-monitorar. Domínio institucional: https://www.monitorarconsultoria.com.br/.

## Implementado

- Cabeçalho de 72 px (68 px móvel), logo proporcional e setas com área de 44 px. Megamenus largos em Sobre, Serviços e Blog: hover, clique, teclado, Escape, saída do ponteiro, clique externo e toque. Painéis nativos funcionam sem JavaScript. Tópicos do Blog respeitam a seleção editorial permitida.
- Contatos do rodapé separados em linhas clicáveis, mantendo destinos e textos.
- Escala moderada de hero, títulos, seções e imagens; DM Sans, azul/verde e cantos arredondados mantidos. GSAP preservado, com entradas por rolagem e transição curta nos menus. Movimento reduzido continua respeitado.
- Blog com dois destaques, grade responsiva 3/2/1, 12 entradas por página e seis na oitava. Artigos com hero dividido, imagem, sumário à direita no desktop, sumário recolhível no celular, cópia de link e relacionados ilustrados. Os 90 documentos originais desta rodada não foram reescritos.
- Fotos existentes adicionadas às áreas institucionais de serviços, história, missão, equipe, contato, oportunidades e Instagram; marcas correspondentes nos depoimentos. Nenhum feed externo fictício.
- 37 fontes de imagem revisadas em comparativos; 151 WebPs responsivos exportados para public/media/photos-v41. Trinta fontes usam restauração SwinIR com proteção de regiões e nitidez final. Sete fontes integralmente protegidas usam reamostragem/nitidez determinística, sem contribuição neural no resultado. Originais intactos. Logotipos, vídeo e material anteriormente removido não foram alterados/reintroduzidos. Arquivos antes inativos podem ter derivação preparada sem serem reinseridos nas páginas.

## Validação executada

- Typecheck, lint, build público, build de prévia e 27 testes: aprovados. Lint mantém oito avisos preexistentes, sem erros.
- Chromium/Chrome: 18 rotas em 320, 390, 768, 1440 e 1920 px (90 combinações), sem overflow, imagens quebradas ou erros JavaScript; status esperado e um H1 por rota.
- Todos os 90 artigos respondem 200 na prévia, com título, capa e noindex. O build público continua excluindo os rascunhos; não confundir a prévia com publicação.
- 21 verificações de interação: menus, hover, foco, Escape, mobile, paginação, zoom e operação sem JavaScript.
- Vídeo: tempo avança, pausa/retoma; GSAP: transformações observadas e posição final correta; movimento reduzido: pausa e desativação respeitadas.
- Contato: preparação e revisão local da mensagem, codificação exata do link, falha de clipboard. Nenhuma mensagem enviada. Busca: filtro, estado vazio, voltar, limpar e recuperação de falha.
- Axe em sete rotas: zero violações nos critérios automatizados selecionados; skip link e zoom do contato verificados. Isso não equivale a certificação WCAG completa nem teste em Safari ou dispositivos físicos.
- Preservação: 90 artigos idênticos byte a byte; 62 arquivos originais institucionais preservados; nenhum arquivo do backup removido. Diff institucional guardado para revisão. Comparação é contra o backup V4.1, não contra HEAD, que inclui trabalho anterior.
- Capturas finais de home, blog e artigo em desktop/celular incluem carregamento e decodificação das imagens; a matriz inicial pode conter imagens fora da tela ainda não pintadas em capturas longas. Verificação em viewport confirmou renderização.

## Ainda não realizado

1. Gerar 90 capas inéditas e seis imagens setoriais. IMAGE-QUEUE.json contém 96 briefs e zero imagens geradas. A ferramenta nativa de geração não está exposta nesta sessão. Não foi usada API paga nem gerador alternativo para essas novas imagens. As capas atuais reutilizam o acervo existente e têm esse estado explícito.
2. Revisão técnica humana e aprovação editorial dos artigos. Os 90 artigos permanecem na prévia; esta rodada não alterou suas autorizações de publicação.
3. Aprovação visual do proprietário e avaliação em dispositivos físicos/Safari.
4. Publicação, push, DNS e indexação real: não executados. Não há promessa de indexação ou posição no Google.

## Evidências e continuidade

- PLAN.md, TASKS.md e ../../../../specs/organic/v4.1/implementation.md descrevem o escopo.
- IMAGE-MAP.csv: fonte, tratamento, derivadas e revisão; evidence/photos/manifest.json: hashes originais e métodos; comparativos e recortes na mesma pasta.
- evidence/checks/results.json e logs: comandos de validação.
- evidence/browser/: matriz de rotas, artigos, interações, acessibilidade, funcionalidades, vídeo e capturas.
- evidence/preservation.json e institutional.diff: comparação com a referência recuperável.
- Backup verificado: D:/monitorar-recovery/v4.1-20261018-135135 (workspace.zip, 992 arquivos, manifest SHA256, history.bundle e patches). Não usar restauração em massa.
- Reiniciar com npm run dev. Se modificar scripts/page-data.mjs ou outros módulos de servidor, reiniciar o processo; alterações apenas em manifests são lidas por requisição.
- Validar mudanças futuras com node scripts/verify-v41.mjs; os dois builds são sequenciais. Scripts v41-interactions.py, v41-functional.py, v41-accessibility.py, v41-browser.py, v41-articles.py e v41-preservation.py preservam evidências próprias.
- Quando image_gen estiver disponível, gerar/revisar por brief e integrar cada capa como generated-reviewed em content/editorial-media.json. Não marcar acervo existente como geração nova. Revalidar seleção editorial, assets, builds e navegação após a integração.

Skills consultadas nesta execução: Impeccable (contexto, brand e shape), Design Taste, imagegen e OpenAI Docs. Uso de imagegen foi orientação e diagnóstico de disponibilidade; não houve chamada de geração nativa. As preferências explícitas do proprietário prevaleceram sobre recomendações genéricas.

Nada foi commitado, enviado ou publicado nesta rodada.
