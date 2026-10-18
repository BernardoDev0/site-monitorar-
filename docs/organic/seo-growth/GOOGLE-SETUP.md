# Integrações Google — estado de 2026-10-18

O proprietário forneceu a metatag do Search Console. Registrada em content/site-integrations.json e inserida no head do HTML público pelo build. A prévia editorial não recebe essa tag. Variáveis de ambiente não vazias podem sobrescrever os identificadores públicos.

Método escolhido: Tag HTML, suficiente para verificar a propriedade de prefixo https://www.monitorarconsultoria.com.br/. Arquivo baixado google65367880138e04f6.html conferido, mas não instalado: não é necessário combinar métodos. DNS, Google Tag Manager e Google Analytics não são necessários para essa verificação. Nenhuma alteração DNS realizada.

Após publicar e confirmar a tag via HTTP, o proprietário deve clicar VERIFICAR dentro de Tag HTML na conta autenticada e enviar sitemap.xml em Sitemaps. A sessão autenticada mostrada nas capturas não está nas abas acessíveis da ferramenta do agente; verificação da conta e envio do sitemap não foram executados pelo agente.

Analytics ainda NÃO está instalado nem coletando dados. Campo GA4_MEASUREMENT_ID reservado vazio; falta o ID G- da propriedade/fluxo da empresa. Pergunta enviada ao proprietário. Não confundir token de propriedade, ID de fluxo numérico, GTM- ou código G-. Não inventar ID nem declarar coleta sem confirmação.

Quando recebido: instalar GA4 de forma restrita à produção, conectar eventos de contato existentes sem conteúdo de formulários, atualizar descrição de privacidade conforme implementação, testar consentimento/coleta e conferir Tempo real na conta. Documentação: https://support.google.com/analytics/answer/9539598 e https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic

Validação desta rodada: build e typecheck aprovados, lint sem erros (8 avisos existentes), regressão Chrome de vídeo/carrossel/scroll e presença exata da metatag no HTML público.

## Atualização: ID fornecido e instalação GA4

O proprietário forneceu G-VD3JR25R7P e autorizou instalação/publicação. Configuração em content/site-integrations.json. scripts/analytics.mjs injeta um carregador por página pública; prévias editoriais não recebem carregador. public/analytics.js também exige origem exata https://www.monitorarconsultoria.com.br para evitar coleta em localhost e domínios de preview.

Implementação de consentimento básico: nenhuma requisição do Analytics antes de permitir; recusar continua sem carregar; escolha persistida no navegador e alteração disponível no rodapé. Revogação desativa coleta, remove cookies _ga do domínio e recarrega. Google Signals e personalização de anúncios desativados. Sem Google Ads, GTM, compra de serviços ou custos contratados.

Medição: page_view pela configuração GA4, contact_click por listener delegado dos links WhatsApp/telefone/email. Não ouvir novamente o CustomEvent local para não duplicar. Evento inclui canal e caminho, sem URL de WhatsApp contendo mensagem, sem valores dos formulários. page_location e referrer fornecidos sem query/hash. A configuração de medição otimizada na propriedade Google não foi alterada pelo agente. Contact_click é intenção de contato, não lead qualificado nem conversão de venda. Nenhum evento foi marcado como evento principal na conta.

Testes: python scripts/check-analytics.py mapeia o domínio público aos arquivos locais e intercepta Google para evitar tráfego de teste. Verifica ausência de coleta antes do aceite/na recusa, tag única no aceite, evento único de WhatsApp, remoção de query/hash e revogação. Resultado em analytics-browser.json. Build, TypeScript e 39 testes Node aprovados; avisos preexistentes de lint.

O painel autenticado do proprietário permanece inacessível nesta sessão. Confirmar recebimento HTTP de coleta no teste de produção não comprova que relatórios da conta já processaram os eventos. ID recebido não é senha nem API secret.
