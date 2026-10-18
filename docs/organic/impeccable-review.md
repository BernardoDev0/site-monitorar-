# Revisão incremental com Impeccable

Registro brand; contexto PRODUCT.md/DESIGN.md extraído do projeto e das escolhas do proprietário. Loader executado na implementação anterior desta mesma sessão. Referências teach/brand/audit/polish/document consultadas; harden aplicado nesta continuação. Não foi invocado um craft completo ou declarado redesign integral.

Preflight registrado: context=pass product=pass command_reference=pass shape=not_required image_gate=skipped:evolução de identidade e ativos existentes mutation=open.

## Avaliação limitada ao shell, templates e contato

| Dimensão | Avaliação /4 | Evidência e limite |
|---|---:|---|
| Acessibilidade | 3 | amostras serviço/contato 100 no Lighthouse após correções; teclado e movimento testados; leitor de tela pendente |
| Desempenho | 3 | HTML estático, orçamento de JS atendido, vídeo opt-in; fontes remotas e imagens legadas grandes permanecem |
| Responsividade | 3 | 390/768/1440 sem overflow nas amostras; menu 44px; zoom e todo o legado pendentes |
| Theming | 2 | tokens OKLCH no editorial; cores fixas no legado, sem modo escuro proposto |
| Antipadrões | 2 | editorial legível e sem grade genérica; legado preserva vidro, gradientes e blocos de métricas pendentes de prova |
| Total | 13/20 | avaliação editorial da amostra, não certificação de todo o site |

## Achados e correções

- P1, ServiceCard/ServiceCardWithIcon: overlays sem contrato de foco. Migrados para Radix Dialog; Enter/Tab/Escape e retorno de foco verificados.
- P1, Header: SVGs sociais clicáveis e elementos invisíveis focáveis. Links semânticos e display:none; idioma sem tradução real convertido em indicação estática.
- P1, Contact: contraste, combobox sem associação e feedback que podia atrapalhar ação. Verde escuro, id/label, H2 e status inline. Rechecagem automatizada passou.
- P2, Footer: H4 após H2. Corrigido para H2.
- P2, editorial: espaço para header fixo e scroll-margin; conferidos no navegador.
- P2 pendente, legado: excesso de efeitos, cores fixas e imagens pesadas. Não reconstruir nem remover evidências históricas sem análise.
- P2 pendente, legado: componentes de toast fora do contato ainda dependem de revisão completa; a rodada não os certifica.

A evolução preserva logo, azul/verde e DM Sans escolhidos pelo usuário. Capturas reais e limites estão em validation.md.

