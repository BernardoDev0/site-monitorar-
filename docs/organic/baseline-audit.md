# Auditoria basal — 16/10/2026

Git: main/b253b47, remoto https://github.com/BernardoDev0/site-monitorar-. Stack React18/Vite5/TS/Tailwind/Radix. Produção responde Server: Vercel. 25 URLs examinadas entre 16:14:48 e 16:15:31 UTC; 17 rotas explícitas em 8 famílias, não 17 conteúdos distintos.

| Prioridade | Evidência | Observação e impacto | Confiança | Confirmação após correção |
|---|---|---|---|---|
| P0 | InstagramFeed, bundle | credencial de API no cliente; valor omitido | alta | ausência em fontes e artefatos; rotação pelo responsável |
| P1 | HTML das 17 rotas | root vazio; sem H1/links no HTML inicial | alta | conteúdo disponível sem JS |
| P1 | index.html | lang=en; canonical global sem-www | alta | idioma e canonical por página no host final |
| P1 | /sitemap.xml | 200 text/html, shell SPA | alta | XML válido, apenas canônicas elegíveis |
| P1 | URL inexistente | 200 com shell SPA | alta | 404 HTTP e tela própria |
| P1 | ServiceCard | wa.mes em lugar de wa.me | alta | URL interceptada em teste |
| P1 | Contact | abre WhatsApp e apaga campos sem confirmação | alta | dados preservados, falhas tratadas, sem falsa confirmação |
| P1 | hook reduced motion | preferência ignorada | alta | emulação reduce e conteúdo visível |
| P2 | /refinaria2.mp4 | 39.809.814 bytes, autoplay/preload auto | alta | vídeo não solicitado no carregamento inicial |
| P2 | home navegador | dois botões sem nome acessível | alta | nomes e teclado verificados |

robots.txt existe, 200 text/plain, Allow:/; não bloqueia rastreamento. Sem-www HTTPS retorna307 para www; HTTP sem-www passa por308 e307. PDF Dräger existente200/application/pdf/12.397.733 bytes, preservar. JS público541.063 bytes descomprimidos; não é CWV.

Build basal PASS, JS540,40kB (162,46 gzip), CSS91,93kB (15,16 gzip). Lint FAIL10 erros/8 avisos; tsc app FAIL Services147; tsc node PASS. Home sem overflow horizontal em390/768/1440px. Screenshot falhou por timeout; isso não equivale a revisão visual completa. Search Console, Analytics, indexação, tráfego, links externos e dados de campo: não medidos. A SPA não é automaticamente inindexável; a evidência é ausência de conteúdo no HTML recebido.
