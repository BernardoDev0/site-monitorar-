# Redesign integral e uso coordenado das skills

Estado: especificação V2; implementação não executada nesta entrega. Referência: [plano](../../../docs/organic/v2/PLAN.md).

## Problema comprovado

A home repete grades e heroes genéricos; serviço, artigo e hub são semelhantes. Clientes fica invisível com movimento reduzido. A revisão anterior não abrangeu um redesign integral.

## Objetivo

Aplicar Campo e precisão a todas as famílias reais, com identidade preservada, fluxo claro e acessibilidade verificável.

## Fora de escopo

Novas métricas/cases inventados, fontes novas, bibliotecas obrigatórias, efeitos permanentes e migração de stack.

## Componentes e arquivos afetados

src/index.css; tailwind.config.ts; src/components/Header.tsx, Footer.tsx, Logo.tsx, ParallaxHero.tsx, WhatsAppButton.tsx; src/pages/Home.tsx, About.tsx, Services.tsx, Clients.tsx, Testimonials.tsx, Careers.tsx, Contact.tsx, Privacy.tsx, NotFound.tsx; src/lib/contact.ts.

## Requisitos e aceite observável

| ID | Requisito | Aceite |
|---|---|---|
| S02-R01 | Usar Campo e precisão e os tokens do DESIGN-PLAN: DM Sans, azul/verde, máximo de 1200 px, gutters de 20/32 px e artigo com 68ch/18px. Fallback tipográfico se não houver fotografia com uso confirmado. | Comparação visual por família; identidade reconhecível e nenhuma prova inventada. |
| S02-R02 | Cobrir todas as linhas de design-coverage.csv. Compartilhar tokens, não impor o mesmo layout a serviço, artigo e hub. Preservar destinos institucionais e Dräger/PDF. | Cada linha tem evidência desktop/mobile e revisão Impeccable/Taste na implementação. |
| S02-R03 | Navegação e conteúdo essenciais visíveis sem JavaScript; alvos de 44 px, foco e contraste; larguras 390/768/1440; zoom de 200%, cores forçadas e movimento reduzido. Animações úteis de 140–220 ms. | Teclado, noJS, ausência de overflow e conteúdo não oculto; contraste por pares reais. |
| S02-R04 | Contato mostra canais cedo, prepara mensagem local editável, preserva campos e informa somente o efeito ocorrido. Não enviar formulário nem inserir dados pessoais em URL/evento. | Testes de inválido/preparado/edição/cópia falha e sucesso; saídas externas interceptadas. |
| S02-R05 | Corrigir os 14 itens de Clientes com opacity 0 em movimento reduzido e alt undefined já no B02. Derivar a alternativa de nome real; não inventar nomes. | Estilos computados e inspeção de imagem com redução ativa/inativa. |

## Decisões

Header com Início/Empresa/Serviços/Blog/Contato; menu móvel details/summary básico sem JavaScript. Home com texto em 7/12 e imagem em 5/12 no desktop. Artigos sem hero publicitário gigante. Direitos e alegações devem ser confirmados antes de novo destaque.

## Estados vazios, erros e falhas

Menu fechado/aberto/foco; formulário inválido/preparado/editado/copiado/erro; sem vagas; imagem sem autorização; depoimento sem evidência; público/preview.

## Dependências

B02 após direção confirmada; C após shell/templates. Direitos e revisão factual não bloqueiam geometria e navegação.

## Critérios de aceite

Jornada home→blog→021→002→contato e alternativa home→serviço→artigo; cobertura integral posterior; nenhum novo conteúdo depende de animação.

## Testes e evidências

Screenshots três larguras; teclado/foco; zoom 200%; cores forçadas; reduced motion; noJS; contato sintético; PDF.

## Riscos

Trocar verdade por decoração; padronização excessiva; perda de navegação antiga; fotos sem direito. Tratar por matriz de cobertura e inventário de provas.

## Reversão

Restaurar somente componentes/tokens tocados; preservar conteúdo e estado anteriores; manter matrizes e evidências de comparação.

Guardar evidências reais com data, ambiente e limites. Rastreabilidade em [TASKS.md](../../../docs/organic/v2/TASKS.md). Testes futuros não foram executados.
