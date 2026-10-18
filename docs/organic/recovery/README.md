# Monitorar — recuperação seletiva e lapidação

Estado: **amostra local da home entregue; aguardando aprovação visual**. Esta instrução substitui o redesign integral. Nenhuma página do aplicativo principal foi restaurada ou alterada nesta rodada.

## Abrir e continuar

- Comparação lado a lado: http://127.0.0.1:4180/
- Referência recuperada: http://127.0.0.1:4181/
- Home lapidada: http://127.0.0.1:4182/
- Os links para outras páginas levam ao build atual, sem recuperação dessas páginas. Somente a home é a amostra.

Na raiz do repositório, se necessário:

```powershell
node docs/organic/recovery/preview/build.mjs D:\monitorar-recovery\20261017-192451
node docs/organic/recovery/preview/serve.mjs D:\monitorar-recovery\20261017-192451
```

O segundo comando mantém o servidor aberto. Nesta execução foi iniciado em processo oculto. As portas 4180–4182 escutam apenas em 127.0.0.1, com noindex. Não há deploy nem publicação automática. O build público preexistente é usado somente como fallback para os destinos internos.

## Referência e cópias recuperáveis

Referência: `monitorar-pre-redesign-20261017.zip`, originalmente no diretório temporário do usuário, agora também preservado em `D:\monitorar-recovery\20261017-192451`. O ZIP contém 458 entradas. Os 321 hashes de preservação correspondem ao ZIP; as 15 capturas anteriores correspondem ao manifesto. O Git HEAD sozinho perderia correções técnicas feitas antes do redesign.

Antes das edições desta rodada foram preservados 538 arquivos atuais em `current-workspace.zip`, incluindo alterações locais e arquivos novos. O diretório contém manifesto SHA-256, resultado da verificação do ZIP, teste de extração de três arquivos, histórico em `history.bundle`, patches staged/unstaged, branch e HEAD. Apenas dependências e artefatos reproduzíveis foram excluídos. Não houve reset, clean ou restauração em massa.

## O que foi recuperado

As cópias de Home, Header e Footer em `preview/src` são byte a byte iguais às do ZIP. Elas utilizam os componentes técnicos atuais, sem importar o CSS do redesign. As duas variantes usam o mesmo HTML e componentes; somente a variante lapidada recebe os ajustes de CSS. O SSR e a hidratação são próprios da amostra e não substituem as entradas do projeto.

Conteúdo: hero com refinaria e título original; estatísticas 16/800%/33ª/100+; três áreas; seis cartões de sustentabilidade; seis segmentos; CTA com paisagem; três ofertas com descrições completas em diálogos; Instagram seguro; carrossel; cabeçalho e rodapé originais.

**Precisão sobre os logos:** a Home do ZIP contém 13 clientes únicos, duplicados para o loop. A página Clientes do redesign contém 14. Esta amostra preserva os 13 da Home, sem acrescentar nem retirar clientes. Em movimento reduzido, somente as repetições do loop são ocultadas e os 13 originais ficam disponíveis em linhas estáticas.

## Acabamento aplicado

- Compensação do cabeçalho fixo: 108/116/132 px conforme a largura; preservadas suas três faixas e navegação flutuante.
- Cartões de áreas com preenchimento único de 24 px no celular e 28 px nas demais larguras, removendo a soma de padding de Card e CardContent.
- Entrelinha de parágrafos 1,65 e listas 1,6; textos pequenos da home com 15 px no celular; texto pequeno do rodapé com 14 px.
- Seções móveis com 48/56 px e separação de título de 32 px, sem excluir ou reordenar seções.
- Botões com altura mínima de 44 px; quebras naturais, ações alinhadas e foco preservado.
- Texto azul institucional sobre verde vivo; tons já presentes nos estados hover dos botões verdes, esmeralda e ciano usados para contraste, mantendo as famílias de cores. Contraste do selo ambiental também ajustado.
- Sombras mais discretas e retirada da elevação exagerada no hover dos cartões; todas as imagens e os formatos dos cartões mantidos.
- Ponte de hover entre item e submenu; navegação por foco e Escape preservada.
- Área de toque e legibilidade do rodapé; carrossel pausa no hover e respeita movimento reduzido sem ocultar clientes únicos.

## Verificações

- Build isolado cliente + SSR e typecheck da amostra.
- Oito combinações: referência e proposta em 320, 390, 768 e 1440 px; todas com HTTP 200, um H1, nove seções, sem overflow horizontal, sem imagem quebrada e sem solicitação automática do MP4.
- Contrato de títulos, parágrafos, listas, links, botões, imagens e backgrounds igual nas quatro larguras.
- Três diálogos por variante: texto e destinos iguais, Escape e retorno de foco.
- Vídeo original acionado deliberadamente e interrompido; menu móvel com sete destinos; dropdown desktop por teclado e mouse; quinze destinos internos respondendo 200.
- HTML sem JS, navegação alternativa, movimento reduzido e reflow equivalente a zoom de 200%.
- Os 22 testes existentes passaram. Não constituem aprovação visual da amostra.
- Axe-core 4.10.3, tags WCAG A/AA até 2.2: zero violações detectadas na execução desktop. Resultados e limites estão em `evidence/axe.json`; não equivalem a certificação completa.
- Capturas após carregar fontes e mídias. Para comparações reproduzíveis, os contadores terminam e o carrossel é parado no início apenas durante a captura. A navegação real mantém o carrossel.

Limites: Chromium emulado, sem aparelho físico ou leitor de tela. Não foi medida indexação no Google. Existem dependências externas já presentes na referência (Google Fonts e imagens Unsplash), mantidas sem substituição. O build sinaliza base Browserslist antiga; nenhuma dependência foi atualizada nesta rodada.

## Skills realmente utilizadas

- Impeccable (`C:/Users/Bernardo/.codex/skills/impeccable/SKILL.md`, referências polish e brand): alinhamento, espaçamento, contraste, foco, responsividade e verificação visual. Contexto PRODUCT/DESIGN lido; correção atual do usuário prevalece sobre o conceito anterior. Shape e geração de imagens não se aplicam a esta preservação.
- Taste (`C:/Users/Bernardo/.agents/skills/taste-skill/SKILL.md`): hierarquia, legibilidade, reflow e contenção dos efeitos. Não aplicadas suas sugestões incompatíveis de novo hero, assimetria, troca de fontes, novos grids, imagens ou movimento contínuo.
- A referência da skill Playwright foi consultada; os testes efetivos seguiram o Python Playwright já usado pelo repositório, não o wrapper CLI. Não houve instalação de nova dependência no projeto. Axe foi baixado apenas para o diretório externo de recuperação.

## Pendências e parada

**Aguardar aprovação visual desta home antes de aplicar o acabamento às outras páginas.** A recuperação do aplicativo principal também permanece pendente dessa avaliação. Nada foi feito em produção, DNS, push ou conteúdo editorial.

Números, alegações comerciais, copyright de 2025 e termos como “Saúde ocupacional” permanecem conforme a referência e exigem análise de conteúdo separada, se autorizada. A exclusão anterior de higiene ocupacional como oferta não foi desfeita. Não se presumiu que todos os usos da palavra saúde fossem equivalentes a essa oferta.

O blog, seus 18 rascunhos, o manifesto de publicação e o planejamento de 90 URLs foram preservados. Nenhuma pesquisa da Ambiens ou artigo novo foi produzido nesta rodada.
