# Especificação V4.1

React/Vite/SSR e GSAP existentes preservados. Sem biblioteca de animação adicional.

## Navegação
Header mantém links existentes. Painéis ocupam a largura do cabeçalho, com apresentação e três colunas. Links principais separados do summary nativo. Hover só com pointer:fine; clique sempre disponível; Tab/foco não fecha o painel; Escape devolve foco; clique externo e resize fecham. Mobile usa details aninhados. Áreas de seta 44 px. GSAP move painel 12 px / 240 ms, desabilitado por prefers-reduced-motion.

## Editorial e dados
ContentLink ganha topic_cluster e cover. EditorialPage ganha cover e capas nos relacionados. EditorialMedia contém src/srcSet, width/height, alt/caption, sourceId, focalPoint e status. O manifesto de mídia é server-only, e os dados são enriquecidos somente após selecionar documentos autorizados para público/prévia. Não alterar conteúdo, autoria ou aprovações dos 90 JSONs. Vazio público continua vazio, com mensagens existentes.

Dois primeiros artigos da página recebem destaque, os seguintes grade; não duplicar entradas nem truncar resumos. ArticleTools usa details aberto em SSR, adaptado no cliente para mobile; copiar link informa quando é prévia local. Capas existentes têm status existing-collection. Capas próprias só recebem generated-reviewed após geração e inspeção.

## Mídia
SwinIR oficial classical SR x2 em imagens pequenas; fotos maiores aproveitam o denoise V4 existente, com proteção e nitidez final. As regiões de identidade protegidas usam o original; não afirmar contribuição neural integral. Candidatos externos ao repositório, exportação revisada separada, WebP 480/800/1200/1600/1920 conforme tamanho disponível. Original intacto verificado por SHA256.

96 prompts/posições são planejados, não imagens produzidas. Gerador nativo indisponível é dependência real. Nenhum serviço externo contratado como substituição.
