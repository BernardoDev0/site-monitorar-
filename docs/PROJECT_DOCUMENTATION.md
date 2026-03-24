# Documentação do Projeto: Site Monitorar

## Sumário
1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Componentes Principais](#componentes-principais)
5. [Rotas e Navegação](#rotas-e-navegação)
6. [Estilos e Design](#estilos-e-design)
7. [Funcionalidades Específicas](#funcionalidades-específicas)
8. [Diretrizes para Modificações](#diretrizes-para-modificações)

## Visão Geral

O projeto "site-monitorar" é um site institucional para a empresa Monitorar Consultoria, especializada em soluções de segurança do trabalho, saúde e meio ambiente. O site foi desenvolvido com React, TypeScript, Tailwind CSS e Vite, utilizando componentes da biblioteca shadcn/ui e a biblioteca Lucide React para ícones.

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática
- **Vite**: Ferramenta de build rápida para projetos web
- **Tailwind CSS**: Framework CSS utilitário para estilização
- **shadcn/ui**: Biblioteca de componentes acessíveis e customizáveis
- **Lucide React**: Conjunto de ícones consistente e bonito
- **React Router DOM**: Biblioteca para gerenciamento de rotas
- **TanStack Query (React Query)**: Gerenciamento de estado e cache de dados assíncronos
- **Tailwind CSS Animate**: Extensão para animações em Tailwind CSS

## Estrutura de Diretórios

```
site-monitorar/
├── node_modules/              # Dependências do projeto
├── public/                   # Arquivos estáticos públicos
│   ├── clientes/             # Logos dos clientes
│   ├── favicon.ico
│   ├── moni3.png            # Logo da empresa
│   ├── paisagem.png         # Imagem de fundo
│   └── refinarytest.mp4     # Vídeo de background
├── src/                      # Código-fonte do projeto
│   ├── assets/              # Recursos estáticos (imagens, vídeos)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes da UI (shadcn)
│   │   ├── AnimatedText.tsx # Texto animado
│   │   ├── CountUp.tsx      # Contador animado
│   │   ├── Footer.tsx       # Rodapé
│   │   ├── Header.tsx       # Cabeçalho
│   │   ├── InstagramFeed.tsx # Feed do Instagram
│   │   ├── Logo.tsx         # Componente de logo
│   │   ├── LogosCarousel.tsx # Carrossel de logos
│   │   ├── OfferingsSection.tsx # Seção de ofertas
│   │   ├── ParallaxHero.tsx # Hero com efeito parallax
│   │   ├── Reveal.tsx       # Animação de revelação
│   │   ├── ServiceCard.tsx  # Card de serviço
│   │   ├── ServiceCardWithIcon.tsx # Card de serviço com ícone
│   │   └── WhatsAppButton.tsx # Botão do WhatsApp
│   ├── hooks/               # Hooks personalizados
│   │   └── use-prefers-reduced-motion.ts # Hook para acessibilidade
│   ├── lib/                 # Funções utilitárias
│   │   └── utils.ts         # Funções auxiliares
│   ├── pages/               # Páginas do site
│   │   ├── About.tsx        # Página "Sobre"
│   │   ├── Careers.tsx      # Página "Trabalhe Conosco"
│   │   ├── Clients.tsx      # Página "Clientes"
│   │   ├── Contact.tsx      # Página "Contato"
│   │   ├── Home.tsx         # Página inicial
│   │   ├── NotFound.tsx     # Página 404
│   │   ├── Privacy.tsx      # Política de privacidade
│   │   ├── Services.tsx     # Página "Serviços"
│   │   └── Testimonials.tsx # Página "Depoimentos"
│   ├── App.css             # Estilos globais
│   ├── App.tsx             # Componente principal da aplicação
│   ├── index.css           # Estilos iniciais
│   ├── main.tsx            # Ponto de entrada da aplicação
│   └── vite-env.d.ts       # Tipagem para variáveis de ambiente Vite
├── .gitignore              # Arquivos ignorados pelo Git
├── bun.lockb              # Lock file para Bun (gerenciador de pacotes)
├── components.json        # Configuração para shadcn/ui
├── eslint.config.js       # Configuração do ESLint
├── HEADER_DESIGN_ANALYSIS.md # Análise de design do cabeçalho
├── index.html             # Página inicial HTML
├── package-lock.json      # Lock file para npm (gerenciador de pacotes)
├── package.json           # Configurações e dependências do projeto
├── postcss.config.js      # Configuração do PostCSS
├── README.md              # Documentação inicial do projeto
├── tailwind.config.ts     # Configuração do Tailwind CSS
├── tsconfig.app.json      # Configuração TypeScript para aplicação
├── tsconfig.json          # Configuração principal do TypeScript
├── tsconfig.node.json     # Configuração TypeScript para ambiente Node
├── vercel.json            # Configuração para deploy no Vercel
└── vite.config.ts         # Configuração do Vite
```

## Componentes Principais

### Componentes de UI (shadcn/ui)
- **Button**: Botões com diferentes variantes e tamanhos
- **Card**: Componentes para exibir conteúdo em formato de cartão
- **Badge**: Elementos para destacar informações
- **Sheet**: Componente para modais deslizantes (mobile menu)
- **Dropdown Menu**: Menus dropdown acessíveis
- **Tooltip**: Textos explicativos em hover
- **Toaster/Sonner**: Notificações toast
- **Accordion**: Componente expansível para conteúdo

### Componentes Personalizados
- **Header**: Cabeçalho responsivo com navegação, informações de contato e redes sociais
- **Footer**: Rodapé com informações de contato e links importantes
- **ParallaxHero**: Seção hero com efeito parallax e suporte a vídeo de fundo
- **WhatsAppButton**: Botão flutuante para contato via WhatsApp
- **LogosCarousel**: Carrossel de logos de clientes com animação
- **Reveal**: Animação de revelação de elementos ao scroll
- **CountUp**: Animação de contagem regressiva/crescente
- **AnimatedText**: Texto com animação de digitação

### Páginas
- **Home**: Página inicial com seções de hero, estatísticas, serviços e clientes
- **About**: Página sobre a empresa com histórico, missão e equipe
- **Services**: Página de serviços com detalhes sobre as áreas de atuação
- **Contact**: Formulário de contato e informações de contato
- **Clients**: Página exibindo clientes e parceiros
- **Testimonials**: Depoimentos de clientes
- **Careers**: Oportunidades de trabalho
- **Privacy**: Política de privacidade
- **NotFound**: Página de erro 404

## Rotas e Navegação

O site utiliza o React Router DOM para gerenciamento de rotas, com as seguintes rotas definidas:

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/sobre" element={<About />} />
  <Route path="/sobre/historia" element={<About />} />
  <Route path="/sobre/missao" element={<About />} />
  <Route path="/sobre/equipe" element={<About />} />
  <Route path="/servicos" element={<Services />} />
  <Route path="/servicos/seguranca" element={<Services />} />
  <Route path="/servicos/hazop" element={<Services />} />
  <Route path="/servicos/auditorias" element={<Services />} />
  <Route path="/servicos/treinamentos" element={<Services />} />
  <Route path="/servicos/meio-ambiente" element={<Services />} />
  <Route path="/clientes" element={<Clients />} />
  <Route path="/depoimentos" element={<Testimonials />} />
  <Route path="/trabalhe-conosco" element={<Careers />} />
  <Route path="/contato" element={<Contact />} />
  <Route path="/politica-privacidade" element={<Privacy />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

## Estilos e Design

- **Cores da marca**:
  - Verde sucesso: #4fc106 (usado para destaques e botões)
  - Azul marinho: #0a2540 (usado para fundos e textos)
  - Brand blue: Cores da paleta de marca

- **Tipografia**: Fonte DM Sans, importada via Tailwind CSS

- **Animações**: Implementadas com Tailwind CSS Animate e animações personalizadas
  - Efeito parallax no hero
  - Animações de revelação ao scroll
  - Contadores animados
  - Efeito de digitação nos textos

## Funcionalidades Específicas

### Botão do WhatsApp
- Presente em todas as páginas
- Redireciona para a conversa do WhatsApp da empresa com mensagem pré-definida
- Implementado com o número de telefone da Monitorar Consultoria

### Menu de navegação responsivo
- Menu desktop com dropdowns para seções com subitens
- Menu mobile com design em sheet
- Efeito de transição no scroll (muda de transparente para branco)

### Parallax Hero
- Efeito parallax no scroll para elementos de fundo
- Suporte a vídeo de background com fallback para imagem
- Opção de overlay gradiente personalizado

### Carrossel de clientes
- Animação contínua de logos dos clientes
- Velocidade configurável
- Responsivo e otimizado para diferentes tamanhos de tela

## Diretrizes para Modificações

### Antes de fazer alterações
1. **Leia esta documentação** para entender a estrutura do projeto
2. **Evite alterar estilos de componentes existentes** sem compreender o impacto global
3. **Siga as convenções de nomenclatura**: camelCase para variáveis e funções, PascalCase para componentes
4. **Mantenha a consistência de design** com as cores e estilos existentes

### Diretrizes de código
1. **Componentes reutilizáveis**: Crie componentes genéricos em `/src/components` para reutilização
2. **Tipagem TypeScript**: Adicione tipos adequados para todas as props e funções
3. **Acessibilidade**: Use semantic HTML e garantir suporte a teclado e leitores de tela
4. **Performance**: Utilize hooks como `React.memo` e `useCallback` quando apropriado

### Diretrizes de design
1. **Manter a identidade visual**: Não altere as cores principais da marca sem autorização
2. **Responsividade**: Teste todas as alterações em diferentes tamanhos de tela
3. **Animações**: Use animações moderadamente, respeitando a preferência de usuário por movimento reduzido
4. **Conteúdo**: Mantenha o foco nos serviços de segurança do trabalho, saúde e meio ambiente

### Melhores práticas ao modificar páginas
1. **Preserve a estrutura existente**: Evite reescrever páginas inteiras, a menos que seja absolutamente necessário
2. **Teste funcionalidades críticas**: Verifique que o botão de WhatsApp, formulários de contato e navegação continuam funcionando
3. **Verifique seções importantes**: As seções Hero, Serviços e Clientes são cruciais para a identidade da empresa
4. **Use componentes existentes**: Reutilize componentes como Card, Button e outros da UI para manter consistência

### Arquivos críticos para não alterar
- `/src/App.tsx` - Estrutura geral da navegação
- `/src/components/Header.tsx` - Navegação principal
- `/src/components/Footer.tsx` - Informações de contato
- `/src/components/WhatsAppButton.tsx` - Função de contato principal
- Arquivos de configuração (vite.config.ts, tailwind.config.ts, etc.)