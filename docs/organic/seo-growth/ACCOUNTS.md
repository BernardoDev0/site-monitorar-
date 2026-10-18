# Contas e medição: etapa do proprietário

Nenhuma conta foi criada ou verificada nesta execução. O proprietário informou não ter acesso às ferramentas. Não fornecer senhas ao agente.

## Google Search Console

1. Entrar em https://search.google.com/search-console com a conta da empresa.
2. Adicionar a propriedade **Prefixo do URL**: `https://www.monitorarconsultoria.com.br/`. Esse método não exige alteração de DNS.
3. Escolher **Tag HTML** e obter somente o valor de `content` da tag google-site-verification. Configurar esse valor como `GOOGLE_SITE_VERIFICATION` no ambiente de build da Vercel. Rebuild/deploy e então clicar em Verificar na conta. Não usar um token de outra propriedade.
4. Enviar `https://www.monitorarconsultoria.com.br/sitemap.xml` em Sitemaps.
5. Inspecionar home, /servicos/emissoes-fugitivas, /blog/o-que-sao-emissoes-fugitivas, /blog/o-que-e-ldar, /servicos/ruido-extramuros e /servicos/drager. Registrar canonical escolhida, cobertura e última visita. Solicitar indexação individual quando pertinente; não usar a Indexing API para esses artigos/serviços.
6. Em Configurações, conferir o controle de inclusão em recursos de IA generativa e eventual herança de propriedade superior. Não presumir que o estado da conta é conhecido. A documentação atual informa inclusão como padrão.
7. Registrar consultas, páginas, país, dispositivo, impressões, cliques e relatórios de IA disponíveis. Sem dados, marcar não medido; não registrar zero.

## Bing Webmaster Tools

Entrar em https://www.bing.com/webmasters/ com conta da empresa. Importar a propriedade do Search Console após verificação ou usar a metatag com valor real em `BING_SITE_VERIFICATION`. Enviar o mesmo sitemap, verificar indexação e consultar AI Performance quando disponível para a propriedade. Não é preciso contratar ferramenta nem ativar envio automático de artigos.

## Perfil da Empresa no Google

Pesquisar nome/endereço da Monitorar no Maps antes de criar cadastro. Se o perfil já existe, solicitar a propriedade/recuperar acesso, sem duplicar a empresa. O titular realiza a comprovação solicitada pelo Google. Conferir nome comercial real, categoria correspondente à atuação, endereço, telefone, site e horário já declarado (segunda a sexta, 8h–17h). Área de atendimento não significa filial: não inventar endereços em outras cidades. A seleção final da categoria deve usar as opções reais oferecidas pelo Google. Não enviar solicitação de avaliação ou mensagens a clientes automaticamente.

## Baseline e acompanhamento

Exportar dados disponíveis no início e após 7, 28 e 90 dias. Separar consultas de marca das demais. Observar os grupos RJ/engenharia/consultoria, fugitivas/LDAR, ar/PTS, ruído, licenciamento e equipamentos. Referências de IA só podem ser registradas com URL/data/contexto observados ou relatório da plataforma. O evento monitorar:contact_click existente continua local; não há coletor de analytics instalado. A implantação de um destino real de conversões fica registrada como pendência, não como medição concluída.
