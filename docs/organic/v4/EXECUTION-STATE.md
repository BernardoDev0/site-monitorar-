# Monitorar V4 — estado de entrega local

Data: 18/10/2026. Repositório: `D:/site-monitorar--main`. Empresa: Monitorar Consultoria. Domínio de referência: `https://www.monitorarconsultoria.com.br/`.

Prévia em execução: **http://127.0.0.1:8081/**. Blog: **http://127.0.0.1:8081/blog**. Busca: **http://127.0.0.1:8081/busca**. `npm run dev` reinicia essa mesma prévia com SSR, páginas institucionais e rascunhos. A porta 8080 pertence a outro aplicativo, que não foi encerrado.

## Implementação

- Shell compartilhado institucional/editorial, cabeçalho arredondado, menu móvel e submenus, rodapé, foco e navegação nativa sem JavaScript.
- V4 aplicada à home e famílias internas: empresa, serviços ambientais e segurança, Dräger, clientes, depoimentos, carreiras, contato, privacidade, 404, blog, busca e conteúdo editorial. Mesma identidade, DM Sans e acervo; composições variam por função da página.
- GSAP/ScrollTrigger carregados dinamicamente, entradas de títulos/seções/mídia, abertura de menus e fixação da coluna de expertise em desktop alto. Preferência por movimento reduzido reage durante a sessão, com limpeza dos efeitos. Corrigida seleção concorrente do H1 como CTA, identificada nas amostras de frames.
- Vídeo original preservado, derivados mobile/desktop e player real com controles. Servidor responde corretamente a Range, HEAD e erro 416.
- Fotografias: 27 conjuntos responsivos locais, 26 com restauração neural conservadora e uma origem retida integralmente por fidelidade. Máscaras preservam regiões sensíveis antes da codificação. Nenhum arquivo original sobrescrito.
- Contato prepara sete campos no navegador, permite editar o texto e gera URL WhatsApp com a mensagem efetivamente revisada. Nenhuma mensagem foi enviada nos testes. Busca recupera estado do fragmento/histórico e trata falha/retry, vazio e mais resultados.
- 90 artigos com corpo, oito páginas de listagem; 14 antigos preservados e 76 novos. Conteúdo continua em revisão, separado da publicação.

## Evidência de preservação

Backup anterior verificado: `D:/monitorar-recovery/v4-20261018-032828`, ZIP com 631 arquivos, manifesto SHA256, bundle Git e patches. Referências anteriores foram examinadas seletivamente; nenhum reset/clean/restauração em massa.

`evidence/preservation.json`: os 14 JSONs de artigos anteriores permanecem byte a byte iguais; as oito descrições completas de serviços aparecem exatamente na referência preservada; todos os hashes de originais fotográficos conferem. `evidence/change-inventory.json` distingue alterações desta V4 do conjunto anterior de mudanças Git. Nenhum arquivo do backup desapareceu. Isso não equivale a certificar todas as alegações institucionais: números, depoimentos e afirmações já existentes foram mantidos, sem nova validação comercial.

## Testes concluídos

`evidence/checks/results.json` e logs: typecheck, lint, build público, build editorial e **24/24 testes aprovados**. Lint mantém oito warnings anteriores, sem erros. O build em Windows inicialmente encontrou bloqueio de diretório; servidores locais antigos do projeto foram encerrados, o watcher passou a ignorar artefatos e a promoção usa tentativas limitadas com rollback.

`evidence/browser/routes-320-390-768-1440-1920.json`: **90 combinações** de 18 rotas e cinco larguras, com status esperado, um H1, sem imagens quebradas ou overflow horizontal. As imagens lazy foram carregadas antes das capturas. Os testes de artefatos percorrem links e imagens públicos e os 94 documentos da prévia.

`interactions.json`: transforms amostrados durante a animação e posição final natural; avanço temporal do vídeo; pausa/retomada; reduced-motion ao alternar; WhatsApp com texto exato; falha de clipboard; busca por hash/back, vazio/limpar e erro/retry; menu móvel/Escape; paginação sem JS, incluindo seis artigos na página 8. Há gravações WebM na pasta `video/`.

`secondary-interactions.json`: três diálogos, retenção de foco, fechamento por Escape, carrossel de logos e destino mailto de carreiras. `accessibility.json`: zero violações automáticas nos critérios axe WCAG A/AA selecionados em sete rotas, foco no skip link e reflow do contato com CSS zoom 200%.

Na repetição final, o teste de links encontrou falha transitória de conexão após muitas respostas GET sem consumo do corpo. As verificações que precisam apenas do status passaram a usar HEAD, mantendo as verificações de conteúdo por GET. O teste de busca passou a aguardar a hidratação antes de focar o campo. As âncoras dos artigos de serviços receberam margem para o cabeçalho fixo; o teste de interação verifica essa folga em cinco links profundos. As falhas foram tratadas, não removidas do critério de aceite.

## Distinções de publicação

`dist` contém o site institucional e os estados editoriais públicos vazios, sem rascunhos. `dist-preview` contém 94 documentos editoriais (90 artigos, três serviços e um hub), noindex e robots bloqueado. O manifesto público continua vazio; não houve mudança de autoria, revisores ou autorização para contornar os validadores.

A prévia já possuía um rascunho de serviço em `/servicos/hazop`, que toma esse endereço somente no modo editorial. No artefato público, a rota institucional e sua âncora HAZOP permanecem preservadas. Não interpretar a tela de rascunho como publicação efetiva.

Nenhum commit, push, deploy, alteração de DNS, contratação, Search Console ou publicação automática foi realizado nesta V4. O site local não prova presença ou posição no Google.

## Pendências reais e limites

1. Revisão técnica por profissionais autorizados e aprovação editorial dos 90 artigos. As fontes ainda têm lacunas específicas documentadas em `EDITORIAL-REVIEW.md`; não é correto publicar o lote como tecnicamente aprovado.
2. Confirmação empresarial das alegações institucionais preexistentes e direitos do acervo, se necessária ao processo de publicação; nada foi inventado como autorização.
3. Não foram feitos testes em aparelhos físicos, Safari/iOS, NVDA ou auditoria WCAG completa. Autoplay pode ser bloqueado pelo navegador e dispõe de controle manual. CSS zoom é uma verificação de layout, não certificação de todos os mecanismos de zoom.
4. CSS inicial de 20,59 kB gzip, ligeiramente acima da referência de 20 kB. Não foi obtido escore Lighthouse/CrUX nem medida de campo. O banco Browserslist informa desatualização; dependências não foram atualizadas indiscriminadamente.
5. As fotos receberam redução moderada de ruído, sem super-resolução ou geração de detalhes. Uma origem foi mantida sem intervenção neural. Não declarar que 27 fotos foram transformadas por IA.

## Continuidade

Não executar geradores históricos sem revisar seu destino: `scripts/catalog.mjs` pode regenerar mapas antigos com estados desatualizados. O mapa desta entrega é `article-map.csv`. `scripts/materialize-v4-articles.mjs` cria apenas documentos ausentes e preserva os existentes.

Para repetir o conjunto técnico: `node scripts/verify-v4.mjs`. Para o navegador: iniciar `npm run dev`, executar `python scripts/v4-browser.py 320 390 768 1440 1920`, `python scripts/v4-interactions.py` e `python scripts/v4-accessibility.py`. A última usa axe 4.10.3 em `D:/monitorar-tools/v4`; scripts de imagem usam modelo local externo. Resultados e limitações estão nas pastas de evidências.

Antes de qualquer liberação pública, tratar as pendências pertinentes e obter autorização de publicação. A aprovação de implementação local não é autorização para push/deploy.
