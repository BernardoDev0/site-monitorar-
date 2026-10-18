# Uso efetivo de skills e mídia

Impeccable: loader e contexto PRODUCT/DESIGN conhecidos da preparação V4; referências brand, animate e craft utilizadas. A direção aprovada pelo pedido “Implement the plan” orientou a implementação. Continuidade do preflight: context=pass, product=pass, command_reference=pass, shape=pass, image_gate=skipped: ferramenta nativa image_gen indisponível, mutation=open.

Taste/GPT Taste: consultados para composição, hierarquia, diversidade de seções e movimento GSAP. Sugestões de fonte aleatória, imagens genéricas e reordenação indiscriminada não foram aplicadas, pois contrariam o contrato de identidade e conteúdo. Não foi simulada geração de imagens nem pesquisa inexistente.

Accessibility: orientação aplicada a foco, redução de movimento, semântica, contraste e controles. Webapp-testing: scripts Python Playwright em navegador Chrome local. Playwright CLI foi consultada, mas a execução seguiu a skill webapp-testing e o padrão Python já existente no projeto; nenhum resultado de CLI foi inventado.

## Restauração das fotografias

27 origens existentes processadas com SwinIR oficial, checkpoint de denoising noise15, FP32, tiles 128 e sobreposição 32. Código/modelo/proveniência e hashes estão em `evidence/photos/manifest.json`. Modelo e dependências ficam fora do repositório em `D:/monitorar-tools/v4`, sem serviço pago ou API externa de imagem.

Revisão visual pelo assistente: comparações da imagem completa e recortes centrais ampliados a 200%, além de apresentação no navegador. Não é aprovação humana de identidade. A revisão não percorreu manualmente cada pixel a 100%; regiões sensíveis receberam proteção adicional com pixels originais antes da codificação web.

26 origens receberam derivados com mistura conservadora de 35% do resultado neural e 65% do original, com máscaras nas regiões de pessoas, inscrições e instrumentos pertinentes. A origem 09 (`equipe5.png`) foi mantida integralmente no raster original porque pessoas e inscrições ocupam praticamente toda a composição. Portanto, há 27 conjuntos responsivos, mas não se declara melhoria neural aplicada às 27.

Não houve substituição de cena, invenção de detalhes, remoção de pessoas, troca de marcas ou geração de fotografias novas. Também não foi aplicada super-resolução para inventar detalhes em imagens pequenas. A melhora é moderada, principalmente de ruído, e a compactação WebP é uma etapa separada. Codificação e redimensionamento web não prometem igualdade pixel a pixel com o arquivo original.

Todos os originais mantêm seus hashes. O JPEG legado `equipe1.JPG` tem um byte terminal ausente: o decodificador recuperou seu raster para um derivado separado; o original não foi reparado ou sobrescrito. O registro está no manifesto de aceite.

`accepted.json` registra decisões, máscaras e arquivos; `src/lib/photos.json` conecta os derivados às mesmas origens. Há variantes até a resolução original, limitadas a 1920 px, sem ampliação artificial. As quatro imagens Unsplash usam os mesmos IDs anteriores, agora com cópia local derivada; disponibilidade não substitui a verificação jurídica do acervo pela empresa.

## Vídeo

O clipe `refinaria2.mp4` foi preservado. Derivados H.264 mantêm o mesmo conteúdo: 618.980 bytes no celular e 2.029.121 bytes no desktop. O player trata redução de movimento, economia de dados, rejeição de autoplay e pausa manual/fora da tela. O comportamento de aba oculta e economia de dados foi implementado, mas não foi certificado em todos os navegadores/dispositivos.

O teste em Chrome registrou avanço do tempo, pausa/retomada e fonte efetivamente carregada. O teste HTTP compara bytes de respostas Range e verifica HEAD, MIME e 416. O site não depende de autoplay para apresentar texto ou navegação.
