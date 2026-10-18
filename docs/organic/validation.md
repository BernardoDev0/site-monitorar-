# Validação local — 16/10/2026

Ambiente: Windows, Node/npm locais, React 18/Vite 5, branch codex/organic-monitorar. Base auditada b253b47. Verificações abaixo são locais; não demonstram indexação ou comportamento da CDN em produção.

## Resultado dos comandos

| Verificação | Resultado |
|---|---|
| npm run build | passou; 17 rotas legadas, 404, 10 URLs canônicas no sitemap, zero novas páginas editoriais |
| npm run build:preview | passou; dez rascunhos e índice derivado /conteudos, todos noindex |
| npm run typecheck | passou |
| npm run lint | zero erros; oito avisos preexistentes: sete Fast Refresh e um de dependência em LogosCarousel |
| npm test | 16 testes passando, incluindo HTTP, links, schema, exclusão de rascunhos, aprovação/hash, fontes, duplicatas, pausa, idempotência e rollback |
| npm run editorial -- check-sources | quatro referências atuais responderam 200; disponibilidade não equivale a validação técnica |
| git diff --check | espaços finais corrigidos; resultado final no registro de comandos |

O endereço candidato antigo do guia LDAR retornou 404 e foi substituído pelo PDF público da EPA. O histórico da falha permanece no registry. Não foi atribuída aprovação humana a nenhuma fonte ou documento.

## Navegador e acessibilidade

Chrome DevTools, servidor local 127.0.0.1:4174:
- Serviço de fugitivas em 390 × 844 e 1440 × 1000: um H1, sem transbordamento horizontal, conteúdo legível, links de contato e referências.
- Artigo detecção/quantificação em 768 × 1024: sem transbordamento, sumário e links contextuais.
- Índice /conteudos em 1440 × 1000: dez entradas derivadas do corpus de prévia, todas com destino existente.
- Menu mobile: botão 44 × 44 px, Enter abre, Escape fecha e restaura foco.
- Diálogo de serviço legado: Enter abre, Tab permanece no diálogo, Escape fecha e devolve foco a “Saiba mais”.
- Movimento reduzido: zero animações em execução na amostra editorial.
- Console da navegação final: nenhum erro ou warning.
- Conteúdo sem JavaScript: HTML carregado em iframe sandbox sem allow-scripts; título, oito parágrafos, CSS, navegação alternativa e CTA presentes. Captura real em evidence/service-no-js.jpg.
- Lighthouse mobile navigation do serviço: acessibilidade 98 antes da correção dos headings do rodapé, 100 depois. Best Practices 100. SEO 69 é esperado na prévia bloqueada por noindex.
- Lighthouse snapshot do contato: 82 durante investigação, 100 após corrigir contraste, combobox, hierarquia e substituir toasts por feedback inline. Snapshot não testa rastreabilidade; sua nota SEO não é evidência de indexação.

Relatórios reais: evidence/lighthouse-service.json e evidence/lighthouse-contact.json.
Capturas: service-desktop.jpg, service-mobile.jpg, article-tablet.jpg, hub-desktop.jpg e service-no-js.jpg. Algumas capturas documentam etapas intermediárias; hub-desktop mostra espaçamento superior anterior ao ajuste final.

## Contato controlado

Dados sintéticos: “Teste local”, telefone de zeros e teste@example.invalid. Links externos interceptados antes da navegação. Nenhuma mensagem enviada:
1. Preparar mensagem mantém os campos e produz texto editável.
2. Clipboard recusado apresenta instrução de cópia manual.
3. Clipboard substituído por stub de sucesso confirma texto copiado.
4. Clique no link WhatsApp emite apenas {channel: "whatsapp", path: "/contato"}.
5. URL do WhatsApp contém somente saudação genérica; os dados preenchidos não aparecem em URL/evento.
6. Nenhuma confirmação de entrega é emitida. Um clique não é lead ou venda.

O primeiro clique por coordenada não atingiu o link durante a notificação; o fluxo foi repetido com ativação DOM controlada e eventos comprovados. O problema de notificações foi removido do contato usando status inline.

## Desempenho

Orçamento inicial: JS até 170 kB gzip e CSS até 20 kB gzip. Build final: entrada 54,08 kB + shell 24,16 kB + legado 80,13 kB = aproximadamente 158,37 kB gzip; editorial acrescenta 1,30 kB em lugar do legado. CSS 14,77 kB + editorial 0,85 kB. Dentro do orçamento.

Hero: imagem existente de 176 kB; vídeo de aproximadamente 39,8 MB preservado, sem autoplay e iniciado só por ação explícita. Imagens legadas de 2–2,6 MB continuam presentes.

Trace local do serviço, 390 × 844, cache ignorado, CPU 1×, rede sem limitação, reduced motion: LCP 113 ms, CLS 0,00, TTFB 3 ms. Medição de laboratório em localhost, sem representatividade de rede móvel real. INP e percentil 75 de usuários reais não medidos. Há oportunidade de reduzir imagens/logos e dependência de fontes externas.

## Limites e não testado

- Não houve deploy, push, Search Console, Analytics, Perfil da Empresa ou verificação de indexação.
- Não testados: NVDA/VoiceOver, zoom 200%, modo de alto contraste, todos os componentes legados, Rich Results Test/Schema.org remoto e comportamento efetivo Vercel/CDN após deploy.
- Dados estruturados validados por contrato local e JSON; não há promessa de rich results. Artigo não recebe imagem/data de publicação inventada.
- O segredo foi removido do código cliente atual; histórico Git ainda contém a exposição. Rotação depende do titular. Não declarar “histórico livre de segredos”.
- Verificação dirigida: uma credencial identificada na versão base foi comparada em memória com src, dist e dist-preview; zero correspondências, sem imprimir seu valor. Isso não substitui uma auditoria de segurança integral.
- Fontes disponíveis por HTTP continuam sujeitas a leitura e revisão de aplicabilidade por especialista.
- Não há declaração de conformidade integral WCAG nem de desempenho real em produção.

