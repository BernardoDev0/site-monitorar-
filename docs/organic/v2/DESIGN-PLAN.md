> **Escopo visual substituído em 17/10/2026.** A correção do proprietário determina recuperação seletiva e lapidação conservadora, preservando textos, seções, identidade e funcionalidades. O redesign integral abaixo é histórico, não autorização vigente. A rodada atual termina na amostra isolada da home e aguarda aprovação visual. Consulte `docs/organic/recovery/README.md`. A frente editorial permanece separada.

# Redesign integral — Campo e precisão

## Contexto e decisão confirmada

Responsáveis ambientais, engenharia, SMS e compras usam computador de trabalho ou celular para entender escopo, avaliar credibilidade e decidir um contato. A direção confirmada pelo proprietário é Campo e precisão: presença institucional e clareza técnica equilibradas. Este documento propõe a evolução; não altera PRODUCT.md ou DESIGN.md.

| Direção considerada | Composição / tipo / imagem / movimento | Decisão |
|---|---|---|
| Campo e precisão | Home assimétrica, azul institucional, verde orientador, DM Sans, fotografia técnica autorizada; guias claros; movimento 140–220 ms | Escolhida pelo proprietário |
| Caderno técnico | Mais densidade, diagramas e índices, foto discreta, tipografia da marca | Boa consulta recorrente, menor presença comercial; não escolhida |
| Institucional panorâmico | Fotografia ampla, equipe e trajetória, maior presença do verde | Depende mais de acervo e provas; menor economia de leitura; não escolhida |

Âncoras reais: logotipos public/moni3.png e moni2.png; fotografias existentes na página Careers e acervo técnico, ainda sujeitas a confirmação de uso; matrizes e diagramas próprios a produzir. Não importar imagens da Ambiens. Não usar uma referência concorrencial como prova institucional.

## Papéis das skills e preflight

Impeccable: contexto, marca, fluxos, shape, superfícies, acessibilidade, adaptação e revisão. Taste: leitura crítica do site existente, composição, densidade, direção de arte e diferenciação dos templates. Uma única decisão por conflito: verdade/permissão → funcionalidade/acessibilidade/SEO → identidade/direção confirmada → preferência da skill.

Na auditoria, o loader local de Impeccable confirmou PRODUCT/DESIGN na raiz e migrated:false. SKILL.md, brand.md e shape.md foram lidos; Taste local principal/redesign e upstream foram lidos. Nenhum binário novo, script Taste v2 ou instalador foi executado. Não há mockup gerado. Probes por geração de imagem foram dispensados nesta etapa documental: há três direções descritas, acervo real auditado e escolha explícita; isso não dispensa revisão renderizada da futura construção.

IMPECCABLE_PREFLIGHT documental: context=pass product=pass command_reference=pass shape=pass image_gate=skipped:planejamento documental com direção confirmada, sem geração ou implementação mutation=open:apenas documentos V2.

Antes da implementação, aplicar as etapas de construção/revisão pertinentes às cópias efetivas e verificar os requisitos de ferramentas sem instalação silenciosa. Não declarar craft completo por ter lido a skill.

## Tokens e regras de composição

| Token | Decisão |
|---|---|
| Cores | Azul base#24304c, verde #3f9905 e acento #4fc106 preservados; neutros claros azulados; verificar pares de contraste |
| Ação principal | Azul com texto claro; verde claro não recebe texto branco pequeno sem aprovação de contraste |
| Fonte | DM Sans; pesos400/500/600/700; nenhuma nova família |
| Conteúdo | Máximo 1200 px; gutters 20 px celular e 32 px demais |
| Artigo |68ch, corpo 18 px, entrelinha1.7–1.75 |
| Títulos | Home clamp 36–60 px; artigo clamp 32–46 px; não truncar |
| Superfícies | Planas, separação por espaço/borda; raios 8 px controles e 12 px grupos/imagens quando úteis |
| Interação | Alvos 44×44 px; foco visível com contraste 3:1; texto normal4.5:1 |
| Movimento |140–220ms quando útil; sem loop, scroll hijack ou conteúdo inicialmente oculto |
| Breakpoints de aceite |390/768/1440px; zoom 200%; forced colors; reduced motion |

WCAG: texto grande corresponde a 18 pt normal ou 14 pt negrito, não aos valores em px incorretamente simplificados em uma tabela da skill. O objetivo é WCAG2.2AA, sem alegar certificação por teste automatizado.

## Home e shell

Hero comercial com texto em7/12 e fotografia em5/12 no desktop; empilhamento móvel. Se não houver uso confirmado, composição tipográfica e diagrama próprio. Ordem: proposta clara → escolha por necessidade → fugitivas/LDAR → preparação de escopo → provas autorizadas → blog → contato. Não repetir três catálogos equivalentes.

Header em uma faixa, logo legível, menu Início/Empresa/Serviços/Blog/Contato. Destinos institucionais continuam acessíveis. Menu mobile nativo details/summary com links HTML; JS só aprimora Escape/retorno de foco. Sem dependência de hover. Faixa de preview não encobre logo ou foco.

Footer agrupa empresa, serviços, editorial, canais e política. Links de blog/diretório respeitam existência e estado; não listar documentos rascunhos no público. CTAs usam links para navegação e botões para ações. WhatsApp tem nome acessível e não encobre formulário/ações.

## Contratos dos templates

| Tipo | Estrutura obrigatória | Diferença observável |
|---|---|---|
| Serviço | Oferta/resumo; aplicação; entradas; escopo/responsabilidades; entregas/exclusões; conteúdo útil; CTA | Leitor define contratação; matriz e limites precedem marketing genérico |
| Artigo | Pergunta e resposta inicial; sumário; corpo; exemplos/tabelas/figuras; limitações; fontes contextualizadas; autoria/revisão verdadeiras; serviço relacionado | Coluna legível, sem hero publicitário gigante |
| Hub | Síntese própria; mapa conceitual; percursos por tarefa; seleção contextual | Orienta caminhos, não agrega automaticamente todo o catálogo |
| Blog | Apresentação curta; destaques curados; temas; lista de artigos; paginação | Descobre acervo; não mistura serviços |
| Empresa | História/equipe/atuação vinculadas a evidências | Alegações e eventos verificáveis; sem números decorativos |
| Caso | Desafio, contexto, atuação, resultado com autorização | Não criar caso ou rota sem prova |
| Contato | Canais; instruções; mensagem local editável; feedback de cópia | Sem falsa confirmação de envio |
| Utilitárias | Texto claro, âncoras e retorno à navegação | Privacidade fiel ao fluxo e404 com status real |

O modelo mantém body legado e acrescenta tabela/figura semânticas, caption, cabeçalhos e alternativa textual; referências ganham nome/contexto e vínculo, não só URL crua. Projeção inclui cluster e relações de serviço. Compatibilidade exige renderizar documentos antigos sem preencher campos fictícios.

## Blog, diretório e busca

- /blog emitido sempre, somente artigos elegíveis.12 por página; /blog/pagina/1 →308 /blog; fora do intervalo 404; canonical próprio em cada página válida.
- Ordenação: revisão real decrescente, ID como desempate. Prévia sem revisão usa ID, sem inventar data. Até 3 destaques por seleção explícita com justificativa; fallback sem destaque.
- Zero aprovados: mensagem de acervo em preparação,200 noindex, follow e fora do sitemap.
- /conteudos organiza hubs elegíveis; os IDs 013–018 têm esse diretório como pai. Sem hubs aprovados, estado vazio honesto e fora do sitemap.
- Prévia atual: artigos019/021/022/023/053/082, hub 013 e serviços002/006/009. Aviso global de rascunho e noindex; nenhuma página 2 vazia.
- Artigo↔hub↔serviço com IDs/URLs explícitos e links HTML. Se destino dedicado não é público, apontar catálogo/blog elegível ou omitir relação, nunca vazar draft.
- /busca: índice title/summary/cluster/slug/reviewdate de conteúdo elegível, carregado na primeira interação. Normalização de caixa/acentos; todos os termos devem aparecer no título/resumo; título exato primeiro, revisão/ID como desempate. Filtro único de tema, estado em fragmento.
- Resultados da busca em grupos de 12 com botão Mostrar mais e contagem anunciada; mudança de consulta/filtro reinicia o grupo. Sem indexação, sitemap, PII ou corpo integral no índice.
- Estados: inicial, carregando, resultados, sem resultados, erro recuperável, limpar filtro. Sem JS: explicação curta e links por temas; blog/hubs/paginação continuam utilizáveis.

## Cobertura e estados

[design-coverage.csv](design-coverage.csv) relaciona todas as 17 rotas legadas, famílias novas e componentes compartilhados a objetivo, problema, solução, skills, dependência e teste. Cobre About ealiases; Services ambiental/segurança/HAZOP/auditorias/treinamentos/Dräger; Clients; Testimonials; Careers; Contact; Privacy; 404; editoriais e shell.

Clients recebe correção de opacity/reduced motion já no B02; o redesign completo fica no C03. Vagas precisam estado sem vagas e validade confirmada. Privacy deve refletir o fluxo real; não inventar tratamentos. Diálogos mantêm teclado, foco, Escape e retorno ao acionador.

## Plano de ativos

| Ativo existente | Origem/licença | Finalidade proposta | Regra |
|---|---|---|---|
| public/moni2.png; moni3.png | Marca existente; autorização de nova alteração não inferida | Logo | Preservar |
| Foto de equipe/Careers e fotos técnicas do acervo | Proveniência/direitos a confirmar | Contexto institucional quando autorizado | Legenda factual; fallback sem foto |
| public/refinaria2.mp4 | Existente; direitos a confirmar | Vídeo sob ação explícita | Sem carga inicial; original preservado |
| public/drager-catalogo.pdf | PDF existente; vínculo comercial não comprovado por arquivo | Download útil | Preservar URL e conteúdo |
| Diagramas/matrizes a criar | Autoria própria, exemplos hipotéticos marcados | Explicação técnica | Revisão antes de público; HTML acessível |
| Logos de clientes | Existência não prova contrato divulgável | Referências autorizadas | Nome/alt correto, contexto e autorização |

Inventário completo de caminhos/tamanhos/hashes: evidence/assets-inventory.csv. Para uso futuro, registrar titular, licença, data, legenda, finalidade e autorização. Não remover originais para economizar build; produzir derivados quando permitido.

## Revisão futura

Construir composição estática primeiro; testar tarefa; depois aprimorar interação. Revisar com Impeccable e Taste cada família, não apenas três capturas. Guardar antes/depois, decisão e limitações. Não usar scores, mockups ou imagens não produzidos como evidência.
