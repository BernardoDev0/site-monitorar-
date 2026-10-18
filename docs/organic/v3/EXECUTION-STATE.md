# Checkpoint V3 — home implementada, aguardando aprovação visual

## Abrir

- Home nova: http://127.0.0.1:4191/
- Comparação desktop/celular: http://127.0.0.1:4190/
- Referência anterior: http://127.0.0.1:4192/

Somente a home recebeu a direção ERM. Os links para outras páginas continuam servindo o build atual, ainda sem V3. O servidor é local, loopback e noindex; não é publicação. A abertura automática via CUA falhou (Chrome indisponível, Brave sem token); Start-Process URL foi rejeitado pela política do ambiente. Os links funcionam no navegador acessado manualmente.

## Implementado

- Header branco compacto com navegação completa, dropdowns nativos, menu mobile, busca e blog. Contato/idioma preservados no footer.
- Hero estático com foto original em WebP responsivo, título e texto originais, CTA. Player e requisição de vídeo removidos.
- Áreas de atuação como três faixas abertas; fornecimentos como três blocos alternados de foto/texto, com diálogos completos.
- Expertise em duas colunas sem caixas; seis fotos originais agora carregadas como imagens lazy. Segmentos em linhas abertas.
- GSAP 3.15.0 lazy, entradas finitas, cleanup e movimento reduzido. Animação final usa deslocamento, sem reduzir contraste por opacidade.
- Carrossel manual com os 13 logos originais; rolagem nativa, teclado e botões anterior/próximo.
- Nova apresentação isolada: nenhum arquivo de src/ ou content/ alterado nesta rodada.
- Plano, especificação, tarefas, mapa de 17 rotas + 8 superfícies/variantes, prompts/direção de seis imagens e proveniência das skills registrados.

## Validação realizada

- Typecheck da aplicação e da prévia: passou.
- Builds público, editorial e SSR/client da home isolada: passaram.
- 22 testes existentes passaram após reconstruir os builds.
- Lint: zero erros, oito warnings existentes no código da aplicação.
- Chromium: 320, 390, 768, 1440 e 1920 px na proposta; 390/1440 na referência. Sem overflow, um H1, imagens carregadas, nenhuma requisição MP4, sem erro JavaScript detectado.
- Igualdade de títulos, parágrafos/listas, números e logos; todos os links originais do conteúdo presentes. Social URLs com/sem www e barra final normalizadas para comparar o mesmo perfil.
- Três diálogos: texto integral igual ao da referência; abertura, Escape e retorno de foco verificados.
- Menu desktop pelo teclado; menu mobile com/sem JS; movimento reduzido; carrossel manual; 17 destinos internos responderam 200.
- Axe 4.10.3, WCAG A/AA até 2.2: zero violações detectadas em 390 e 1440 px. Incompletos e resultados brutos no JSON; não é certificação nem teste com leitor de tela real.
- Fotos principais: hero WebP 640/1280/1920 (22,6/70,9/145 kB); paisagem CTA 287 kB, original 2.057 kB. Não medida indexação Google nem Core Web Vitals de produção.

## Crítica visual e correções

1. Inspeção da primeira dobra mostrou espaço superior duplicado: padding herdado do body mais compensação do header. Corrigido só no body da variante ERM.
2. Auditoria encontrou contraste reduzido nos blocos antes da entrada GSAP. Retirada animação de opacidade, preservando deslocamento e leitura integral.
3. Teste sem JS revelou a navegação noscript antiga sobrepondo o header novo. Removida apenas essa duplicata na nova entrada; disclosures nativos funcionam sem JS.
4. O carrossel antigo exigia movimento infinito para exibir todos os clientes. Substituído localmente por rolagem manual acessível com os mesmos logos.
5. Rótulo do último indicador mobile recebeu largura de leitura que evita colisão com o botão flutuante.
6. Fotos abaixo da dobra foram carregadas antes das capturas completas; as primeiras capturas de inspeção não eram prova de ausência de conteúdo.

## Preservação

Backup verificado: D:/monitorar-recovery/erm-20261017-202322 (workspace.zip, manifest.json, history.bundle, staged/unstaged patches e status). Das 576 entradas anteriores, 571 permanecem byte a byte iguais. Cinco alteradas intencionalmente: .gitignore, PRODUCT.md, DESIGN.md, package.json e package-lock.json. Nenhum arquivo anterior removido. Única mudança de versão/adição no lock: gsap. V2 e recuperação anterior intactos.

## Pendências e limites

- Aprovação visual da home antes de promover o design a todas as páginas: checkpoint solicitado pelo proprietário e mantido no plano aprovado.
- Seis imagens originais ainda não geradas; sem ferramenta nativa ou plugin conectado. Fotos atuais são o fallback previsto, não geração por IA.
- Demais rotas, templates editoriais e revisão integral V3 ainda não implementados. Mapa/tarefas indicam explicitamente esses estados.
- Os 18 rascunhos e as 90 propostas foram preservados; published.json continua vazio. Não há 90 páginas publicadas ou 90 artigos completos.
- npm install informou 34 vulnerabilidades na árvore de dependências (5 moderadas, 29 altas). Não executado audit fix; mudança de versões limitada ao acréscimo de GSAP. Triagem de dependências continua separada do lote visual.
- Testes visuais em Chromium emulado, sem aparelho físico ou leitor de tela; não realizada medição em produção.

## Retomar

```powershell
node docs/organic/v3/preview/build.mjs D:/monitorar-recovery/erm-20261017-202322
node docs/organic/v3/preview/serve.mjs D:/monitorar-recovery/erm-20261017-202322
```

O servidor usa as portas 4190–4192. Se já estiver ativo, reutilizá-lo. Os arquivos da referência ficam no snapshot anterior D:/monitorar-recovery/20261017-192451/preview; podem ser reconstruídos pelo build da recuperação. Não reexecutar prepare-preview.py: é bootstrap inicial e agora recusa sobrescrever a implementação revisada.

Próxima ação: obter avaliação visual da home em 4191 e do comparativo em 4190. Se aprovada, iniciar V3-08 promovendo o shell e adaptando Sobre/Serviços sem mudar rotas, conteúdo ou gates editoriais. Sem aprovação, ajustar apenas a variante local.

Sem commit, push, deploy, DNS, compra, envio de mensagens ou publicação automática nesta rodada.
