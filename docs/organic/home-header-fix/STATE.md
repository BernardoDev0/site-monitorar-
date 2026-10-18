# Ajuste da home e do cabeçalho — 2026-10-18

- Instagram e LinkedIn movidos do título para o cabeçalho, ao lado da busca, conforme escolha do usuário. Alvos de toque de 44 px, rótulos acessíveis e foco visível.
- CTA da home usa ArrowUpRight SVG em vez de caractere Unicode dependente da fonte/emoji do aparelho.
- Poster extraído diretamente de public/refinaria2.mp4. Mantidos vídeos derivados em 60 fps com reprodução de ida e volta. Original preservado.
- Vídeo reforça muted e tenta retomar em canplay/pageshow. Mantidas pausas por movimento reduzido, economia de dados, aba oculta e saída da área visível.
- Diagnóstico: Chromium de automação sem suporte ao codec apresentou DEMUXER_ERROR_NO_SUPPORTED_STREAMS; Chrome instalado reproduziu o vídeo anterior tanto localmente quanto em produção. Portanto não foi demonstrada uma falha universal de reprodução no desktop. Restrições de autoplay/configurações do dispositivo ainda podem manter um quadro estático.
- Impeccable: contexto e orientações usados para refinamento conservador, espaçamento e alvos acessíveis; nenhuma imagem gerada por IA. Poster é frame do material original.

## Validação

Build público e typecheck passaram. 37 testes passaram. Lint sem erros, com 8 avisos preexistentes. Chrome real automatizado: 320, 390, 768, 1280 e 1440 px, vídeo com tempo avançando e readyState 4, sem overflow horizontal, redes fora do hero e CTA SVG. Movimento reduzido mantém vídeo pausado. Evidência numérica em browser.json; capturas locais home-*.png (ignoradas pelo Git).

Conteúdo editorial, URLs, SEO e publicações anteriores preservados. Publicação autorizada pelo usuário nesta conversa.
