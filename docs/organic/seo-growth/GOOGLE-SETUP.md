# Integrações Google — estado de 2026-10-18

O proprietário forneceu a metatag do Search Console. Registrada em content/site-integrations.json e inserida no head do HTML público pelo build. A prévia editorial não recebe essa tag. Variáveis de ambiente não vazias podem sobrescrever os identificadores públicos.

Método escolhido: Tag HTML, suficiente para verificar a propriedade de prefixo https://www.monitorarconsultoria.com.br/. Arquivo baixado google65367880138e04f6.html conferido, mas não instalado: não é necessário combinar métodos. DNS, Google Tag Manager e Google Analytics não são necessários para essa verificação. Nenhuma alteração DNS realizada.

Após publicar e confirmar a tag via HTTP, o proprietário deve clicar VERIFICAR dentro de Tag HTML na conta autenticada e enviar sitemap.xml em Sitemaps. A sessão autenticada mostrada nas capturas não está nas abas acessíveis da ferramenta do agente; verificação da conta e envio do sitemap não foram executados pelo agente.

Analytics ainda NÃO está instalado nem coletando dados. Campo GA4_MEASUREMENT_ID reservado vazio; falta o ID G- da propriedade/fluxo da empresa. Pergunta enviada ao proprietário. Não confundir token de propriedade, ID de fluxo numérico, GTM- ou código G-. Não inventar ID nem declarar coleta sem confirmação.

Quando recebido: instalar GA4 de forma restrita à produção, conectar eventos de contato existentes sem conteúdo de formulários, atualizar descrição de privacidade conforme implementação, testar consentimento/coleta e conferir Tempo real na conta. Documentação: https://support.google.com/analytics/answer/9539598 e https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic

Validação desta rodada: build e typecheck aprovados, lint sem erros (8 avisos existentes), regressão Chrome de vídeo/carrossel/scroll e presença exata da metatag no HTML público.
