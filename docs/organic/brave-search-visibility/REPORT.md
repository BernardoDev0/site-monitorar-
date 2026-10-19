# Brave Search — visibilidade para "monitorar consultoria emissoes"

Data: 2026-10-19. Código anterior: `cdcc680`. Alteração desta rodada: `48a4c28`.

## Mecanismo da busca relatada

Brave Search (`search.brave.com`), não Google. Evidência: histórico local do navegador Brave do proprietário registra `q=monitora+consultoria+emissoes` (11:33:40Z) e `q=monitorar+consultoria+emissoes&source=web` (11:34:15Z) em 2026-10-19. O buscador padrão do navegador é o Brave. Nas preferências desse navegador não há opção de ativação do Web Discovery Project gravada (o padrão é desligado); só consta o aviso para ativá-lo, exibido 5 vezes e não aceito.

## Baseline medido antes das alterações (2026-10-19 12:02Z)

Arquivos: `evidence/brave-before-*.json`.

| Medida no Brave Search | Resultado |
|---|---|
| `monitorar consultoria emissoes` | 0 resultados da Monitorar nos 25 links lidos. Primeiros: ENGEAR, Eco-Lógica, Preserve, AirTech, Ceimic, Bioengen. Brave trata a consulta como consultoria em monitoramento de emissões, tema genérico. |
| `site:monitorarconsultoria.com.br` | 1 URL indexada: a Home. Título e descrição são do site antigo ("Monitorar Consultoria - Engenharia Ambiental e Segurança do Trabalho" / "Serviços especializados em Segurança do trabalho… 16 anos de experiência"). Segunda página vazia. Nenhum artigo, serviço ou hub. |
| `monitorar consultoria` (marca) | Home em 3º lugar entre resultados web, atrás de LinkedIn e Portaliso. |
| Favicon exibido | 32×29, não quadrado. |

## Causa comprovada

1. O índice do Brave contém uma única URL do domínio, uma captura da Home de antes da publicação estática de 2026-10-18. O título e a descrição guardados correspondem exatamente ao `<title>` e ao `og:description` do `index.html` de março (commit `b253b47`), cujo corpo era apenas `<div id="root"></div>`.
2. As 120 URLs restantes, entre elas `/servicos/emissoes-fugitivas` e os 90 artigos, não estão no índice do Brave. A busca exata pelo título de um artigo também não retorna o domínio.
3. A única página indexada não contém a palavra "emissões". Sem página com o assunto no índice, o site não pode competir pela consulta, qualquer que seja o conteúdo atual.
4. O Brave não oferece console nem envio de sitemap. Descoberta é por rastreador e por usuários opt-in do Web Discovery Project. O caminho oficial para pedir nova leitura é `https://search.brave.com/submit-url`.
5. As auditorias anteriores mediram HTTP, HTML bruto e o sitemap. Nenhuma mediu o índice do Brave, e foi isso que escapou.

Não comprovado: quando o rastreador do Brave voltará ao domínio. O Brave não publica esse prazo.

## Descartado com evidência

- `robots.txt` permite tudo, inclusive Googlebot. O Brave segue as regras do Googlebot, conforme sua página oficial do rastreador.
- Nenhum `noindex` nem `X-Robots-Tag` nas páginas públicas. Canonical em `www` e HTML completo sem JavaScript.
- Projeto Vercel sem configuração de firewall. Domínios `*.vercel.app` do projeto exigem SSO e enviam `X-Robots-Tag: noindex`.
- Redirecionamentos corretos: apex para `www` 308, barra final 308, `/index.html` 308, 404 real.

## Alterações (`48a4c28`)

- Home e cinco páginas institucionais terminam o título com `| Monitorar Consultoria`.
- Títulos editoriais usam a marca completa quando o resultado fica com até 65 caracteres; nos demais, mantêm `| Monitorar`. Resultado nas 121 URLs do sitemap: 95 com a marca completa no sufixo, 1 (`/sobre`) com a marca no próprio título e 25 com sufixo curto. O maior título com marca completa tem 65 caracteres.
- Exemplos: `Monitoramento de emissões fugitivas | Monitorar Consultoria`; `Conhecimento sobre emissões fugitivas | Monitorar Consultoria`.
- `og:site_name` ("Monitorar Consultoria") e `og:locale` (`pt_BR`) em todas as páginas.
- Chave IndexNow publicada em `/<chave>.txt` apenas no build público; `scripts/indexnow.mjs` (comando `npm run indexnow`) envia o sitemap sob demanda, nunca durante o build.
- `scripts/brave-refetch.py` repete os pedidos de nova leitura ao Brave.
- Teste novo `tests/discovery.test.mjs` (4 testes), escrito antes da implementação e visto falhar.

Não foram alterados: conteúdo e registros editoriais, URLs, layout, vídeo, GSAP, carrossel, Analytics e consentimento.

## Verificações

- Local: typecheck sem erros; 44 testes aprovados; lint com 0 erros e os 8 avisos já existentes; auditoria de indexabilidade com 121 URLs, 90 artigos e 0 falhas (`evidence/local-audit.json`).
- Produção, após o deploy `dpl_HWUgVqDKDWTgcruZ2aj1gJPmmxwp` (READY, `48a4c28`): auditoria com 121 URLs, 90 artigos e 0 falhas (`evidence/production-audit.json`); `scripts/check-live.mjs` aprovado (`evidence/check-live.json`); títulos novos e `og:site_name` servidos; chave IndexNow com HTTP 200 `text/plain`; favicon HTTP 200 `image/vnd.microsoft.icon` com ICO de 16 a 256 px; robots e sitemap inalterados.

## Pedidos de nova leitura e notificações (2026-10-19)

- Brave: 22 URLs enviadas ao formulário oficial `search.brave.com/submit-url` (Home, serviço e hub de emissões fugitivas, artigos de emissões fugitivas e LDAR, páginas institucionais, serviços e os 9 hubs de assunto). Todas aceitas: HTTP 200 e "Success". A Home foi enviada duas vezes (uma na sessão do Chrome DevTools, outra pelo script). Evidência: `evidence/brave-submissions.json`. Os 90 artigos não foram enviados um a um: os hubs linkam todos.
- IndexNow: 121 URLs enviadas uma vez, resposta HTTP 202 (recebido; o buscador valida a chave depois, comportamento normal da primeira requisição). Alcança Bing, Yandex, Naver, Seznam e Yep. Brave e Google não participam do IndexNow. Evidência: `evidence/indexnow.json`.

## Medição depois das submissões (parcial)

- Consulta de marca no Brave: a Home continua com o título antigo, ou seja, a nova leitura ainda não ocorreu. Posição entre os resultados web: 4 (era 3 no baseline; oscilação de ordenação, sem relação com a alteração). Evidência: `evidence/brave-after-submission.json`.
- `site:` e consulta exata: o Brave respondeu com captcha às consultas automatizadas e não foram lidas. Nenhum captcha foi contornado. Repetir com `python scripts/brave-measure.py --headed --output <arquivo>` em 24 a 72 horas.

## Google

O proprietário informou que a Monitorar também não aparece no Google, e que esse é o buscador mais importante. O índice do Google não pode ser medido daqui: a página de resultados exige captcha para automação, o Startpage (resultados do Google) bloqueou o acesso automatizado, a API PageSpeed respondeu 429 sem chave e o Search Console só existe na sessão autenticada do proprietário. Nenhuma proteção foi contornada, e a sessão do proprietário não foi usada.

Verificado:

- Chrome com JavaScript e User-Agent do Googlebot smartphone, 4 páginas-chave: conteúdo completo após a renderização, título, canonical, robots e JSON-LD corretos, sem erros de console e sem requisições falhas. Palavras no `main` renderizado e no HTML bruto: 589/589, 682/706, 641/674 e 680/707 (a diferença vem de elementos ocultos e tabelas). Evidência: `evidence/rendered-dom-googlebot-ua.json`.
- DNS: servidores de nomes externos (Skymail), sem DNSSEC (não há DS nem DNSKEY que possa quebrar a resolução), apex com um único registro A, `www` por CNAME da Vercel, nenhum registro conflitante. A Vercel informa `misconfigured: false` nos dois domínios e a resolução pelo DNS do Google retorna status 0.
- O serviço de favicon do Google devolve o logo da Monitorar para o host `www`, e devolve 404 para um domínio inexistente. Indica que o Google já leu a Home em algum momento; não prova indexação das demais URLs.
- Search Console: propriedade de prefixo de URL `https://www.monitorarconsultoria.com.br/`, verificada por meta tag presente em todas as páginas; sitemap com 121 URLs processado, confirmação anterior do proprietário.
- Sem configuração de firewall na Vercel, `robots.txt` permitindo o Googlebot e nenhum `noindex` nem `X-Robots-Tag`.

Não medido: situação de cada URL no relatório "Indexação de páginas" (descoberta e não indexada, rastreada e não indexada, ou indexada), última visita do Googlebot e canonical escolhida. Os registros de requisições da Vercel também não estão acessíveis com a credencial atual (HTTP 403). Esses dados dependem da conta do proprietário no Search Console e não foram obtidos.

Leitura dos fatos: as 120 URLs estáticas estão no ar desde 18/10 por volta de 19h UTC, cerca de 17 horas antes das medições. O Google informa que o rastreamento de URLs novas leva de dias a semanas e não garante inclusão (https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Nada do que foi medido contradiz essa explicação, e nada a confirma. Nenhum prazo de indexação ou posição é prometido.

## Limitações e notas

- Sem acesso ao Search Console: Google e Bing sem medição de índice. A verificação do Bing por meta tag segue vazia (sem conta); o IndexNow cobre o aviso de novas URLs.
- Sem logs de rastreadores: o site é estático, no plano Hobby, e a API de logs da Vercel respondeu 403.
- Os projetos irmãos `monitorar-remaster` e `monitorar-empresarial-novo` (painéis internos) respondem publicamente em `*.vercel.app` e não têm `noindex`. Fora do escopo; apenas registrado.
- A MCP do Chrome DevTools travou durante a primeira submissão e seu Chrome de automação foi encerrado; as demais submissões usaram `scripts/brave-refetch.py` (Playwright).
- Ferramentas adicionadas: `scripts/brave-refetch.py` (pedidos de nova leitura ao Brave), `scripts/brave-measure.py` (fotografia do Brave para `site:`, consulta exata e marca) e `scripts/indexnow.mjs`.
