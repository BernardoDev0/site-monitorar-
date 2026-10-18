# Monitorar V4.2 — execução local

Prévia: http://127.0.0.1:8081/. Busca: http://127.0.0.1:8081/busca. Artefato público local: http://127.0.0.1:4173/ (não é produção).

## Alterações implementadas

- GSAP com entradas de 10–12px/450–550ms e desaceleração suave. Sem pin da Expertise ou deslocamento duplicado nos títulos dentro dos cartões. Conteúdo continua renderizado e acessível sem depender da animação.
- Navegação com abertura/fechamento de 260/170ms, reversão a partir do estado corrente, fechamento dos irmãos animado e controles centralizados de hover, clique, Escape, resize e clique externo. Painéis em fechamento ficam inertes. Cleanup remove timers, tweens, estilos transitórios e estados. O painel encosta na região de hover, eliminando a lacuna. Um único breakpoint de container em 1240px seleciona desktop/mobile.
- Vídeo da refinaria em 60fps constantes, H.264, 1280x720/768x432, 1194 quadros e 19,9s. Interpolação compensada de movimento a partir do arquivo de 24fps; reprodução normal e reversa concatenadas, sem repetir quadros dos extremos. Nenhum controle de pausa ou reprodução, nem oculto, conforme escolha expressa do usuário. Original preservado. Poster se autoplay falhar; suspende fora da tela/aba oculta; movimento reduzido mostra poster.
- Logos voltaram à faixa contínua para a esquerda: 13 marcas, ciclo de 40s, ajustes por marca e grupos idênticos. Corrigido speed=0 na home. Sem setas ou botão de pausa, sem parar ao hover. Fora de tela/aba oculta suspende; movimento reduzido e ausência de JavaScript oferecem rolagem manual de uma lista única.
- Busca carrega automaticamente, inclui as páginas institucionais e os textos existentes das ofertas da home, além dos documentos permitidos. Mantém filtro por assunto, normalização de acentos, prioridade de título exato, Enter, retry e histórico. O grupo Site institucional é identificado. Conteúdo novo não foi escrito para melhorar resultados; os trechos das ofertas são extraídos do código existente. Rascunhos continuam fora do índice público.
- Após a captura do proprietário, Expertise foi reformulada em componente próprio: cabeçalho superior, duas imagens de destaque e quatro entradas menores com miniaturas. Textos, ordem dos seis temas, imagens e destinos mantidos. Altura desktop de 4308px para 1092px, redução aproximada de 75%. Não há coluna lateral vazia nem lista vertical de seis imagens enormes.

## Validação

- TypeScript, lint, build público, build editorial e 28 testes aprovados. Oito avisos preexistentes de fast refresh no lint, nenhum erro.
- Matriz de 18 rotas x seis larguras (320/390/768/1280/1440/1920): status esperado, um H1, zero imagens quebradas, overflow ou erros JS. Executada antes do ajuste de Expertise; depois dele, testes específicos em cinco larguras verificaram texto, links, ordem, imagens e ausência de overflow.
- Header também verificado em 1290px, imediatamente acima do limiar de desktop, e em zoom200%. Sem colisão de logo/navegação/busca.
- Interações: 21 cenários de menu, teclado, toque, Escape, paginação, sumário e no-JS. Teste adicional com movimento ativo: travessia lenta, troca rápida, reversão e Escape; mobile com Escape aninhado.
- Vídeo desktop: ciclo completo observado, 1290 quadros apresentados em 21,5s, 1291 contabilizados e zero descartados. Mobile em viewport emulado: 1261 quadros contabilizados em 21s, zero descartados, fonte mobile e loop confirmados. Mediana rAF de aproximadamente 6,9ms no Chrome local; monitor/ambiente com taxa superior a 60Hz. Não é garantia de desempenho em outros aparelhos.
- Arquivo decodificado: 1194 quadros; pares ida/reversa correspondentes com diferença média inferior a 1,1/255 por canal na amostra reduzida. Três frames revisados visualmente. Métrica não substitui avaliação humana da interpolação em toda a gravação.
- Carrossel observado por mais de 40s: uma volta, 13 logos, grupos de 3120px, movimento durante hover e continuidade de ciclo. Erro máximo de deslocamento amostrado de 0,55px em relação à velocidade esperada.
- Busca testada no build público local e na prévia: Dräger/DRAGER, segurança do trabalho, contato, emissões fugitivas. Todos encontram destinos reais; rascunhos não vazam no build público. Formulário de contato, fallback de clipboard, busca com falha e retorno, links internos e vídeo funcional verificados sem enviar mensagens externas.
- Expertise: texto normalizado exatamente igual ao anterior, seis títulos na mesma ordem, seis links com textos/destinos iguais, seis imagens. Medições/capturas em 320/390/768/1440/1920. Capturas da seção isolada ocultam temporariamente header/skip-link na sessão de captura para evitar sobreposição na imagem longa; não é CSS do site.
- Axe em sete rotas após o ajuste da Expertise: zero violações nos critérios automatizados selecionados; skip-link e zoom200% no contato verificados. Não equivale a avaliação completa de acessibilidade.
- Conteúdo editorial preservado: 94 documentos, incluindo os 90 artigos, byte a byte contra o backup anterior à V4.2. 62 arquivos institucionais originais verificados sem mudanças. Nenhum arquivo do backup removido.

## Evidências e reprodução

- Backup anterior à rodada: D:/monitorar-recovery/motion-20261018-145607 (before.zip e manifest). Backup completo anterior: D:/monitorar-recovery/v4.1-20261018-135135.
- PLAN.md: escopo aprovado e complemento solicitado pelo usuário.
- video.json e evidence/video-frames.json: derivação, origem e métricas; evidence/video-sample-*.png: frames de revisão.
- evidence/browser/motion.json, search-mobile.json, interactions.json, functional.json e routes-*.json: validações e capturas.
- evidence/expertise-before.json, expertise-after.json e expertise-*.png: preservação e nova composição.
- evidence/checks/: logs completos e resultados. evidence/preservation.json: inventário relativo ao backup.
- Reproduzir: node scripts/verify-v42.mjs; python scripts/v42-motion.py; python scripts/v42-search-mobile.py; python scripts/v42-interactions.py; python scripts/v42-functional.py; python scripts/v42-expertise.py; python scripts/v42-preservation.py. Builds são sequenciais.
- Vídeo: scripts/prepare-pingpong.py reutiliza a intermediária interpolada em D:/monitorar-tools/motion/forward-60.mp4. Para mudar a fonte, preparar outra intermediária; não reutilizar o cache antigo inadvertidamente.
- npm run dev serve 8081. Reiniciar ao modificar scripts de servidor; HMR cobre componentes e CSS.

## Pendências e limites

- Zero imagens inéditas geradas. As 90 capas e seis imagens setoriais continuam em docs/organic/v4.1/IMAGE-QUEUE.json; a ferramenta nativa image_gen não está disponível. Skills não fornecem essa ferramenta por si mesmas. Não houve uso de API paga nem geração substituta. Imagens da Expertise permanecem do acervo tratado, não são apresentadas como geração nova.
- Revisão técnica humana dos artigos, aprovação visual do proprietário e avaliação em dispositivos físicos/Safari continuam pendentes. Os artigos estão em prévia, sem aprovação automática.
- Sem controles de pausa por decisão expressa do usuário; respeitar movimento reduzido não constitui declaração de conformidade WCAG completa.
- Nenhum push, commit, deploy, DNS, contratação ou publicação automática realizado. Nenhuma promessa de indexação no Google.

Skills: Impeccable aplicado ao refinamento de movimento e composição preservando a identidade. Referências animate/brand e contexto do projeto consultados; shape adicional não necessário para os ajustes explicitamente solicitados. Nenhuma execução de geração nativa de imagens foi alegada.
