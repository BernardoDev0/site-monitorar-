# Confronto do redesign com a referência

Base: ZIP pré-redesign de 17/10/2026 e seus manifestos, não o commit mais antigo. A comparação encontrou 41 arquivos do baseline alterados, além de arquivos novos. Lista em audit-files.json. O estado inteiro foi preservado antes de iniciar a amostra.

| Área | Descaracterização identificada | Tratamento nesta rodada |
|---|---|---|
| Home | Hero, textos, estatísticas, cartões e seções substituídos pela composição Campo e precisão | Recuperação completa da apresentação apenas na amostra |
| Sobre | História, resultados, equipe e imagens condensados/retirados da apresentação | Não alterada; recuperar seletivamente após aprovação |
| Serviços | Abas e catálogo substituídos, descrições reescritas, links editoriais adicionados | Não alterada; preservar seleção técnica por alias ao recuperar |
| Carreiras | Cultura, carrossel, benefícios, crescimento e processo seletivo retirados da apresentação | Não alterada |
| Contato | Colunas invertidas, campos reorganizados, horário/localização retirados | Não alterada; fluxo de revisão/cópia local seguro permanece |
| Clientes/Depoimentos | Conteúdo/composição reimplementados com apresentação comum do redesign | Não alteradas; recuperar composição própria sem apagar correções de visibilidade |
| Privacidade/404 | Introduções e apresentação substituídas | Não alteradas; preservar contrato técnico 404 e informações existentes |
| Header/Footer | Navegação, rótulos, links apresentados e colunas substituídos | Cópias originais apenas na amostra |
| main/App/site.css | Estilos globais e integração misturados com renderização técnica | Não restaurados; amostra tem documento, CSS, SSR e hidratação independentes |
| scripts/editorial/configuração | Controles de publicação, staging, validação, redirects | Integralmente preservados |

Nenhum ativo de public ou src/assets havia sido apagado/alterado desde o ZIP. As áreas vazias de algumas capturas antigas incluíam imagens lazy ainda não carregadas; não representam autorização para remover essas mídias.

O ZIP já incorporava Instagram sem credencial, movimento reduzido real, conteúdo visível no SSR, vídeo voluntário, links WhatsApp válidos, diálogos acessíveis e formulário sem falso envio. Restaurar do Git indiscriminadamente reintroduziria problemas. A amostra reutiliza esses componentes atuais e seguros.

A referência foi identificada com evidência suficiente, portanto não houve uma nova pergunta para escolher commit. A aprovação pendente é da lapidação apresentada, conforme solicitado pelo proprietário.
