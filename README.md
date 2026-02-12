[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=sucorrea_lulu)](https://sonarcloud.io/summary/new_code?id=sucorrea_lulu)
![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?logo=pwa)
![Test Coverage](https://img.shields.io/badge/Coverage-85%25-success)

<div align="center">

#  Lulu

### Progressive Web App Mobile-First com Real-Time Features

*Aplicação moderna e instalável para gerenciamento colaborativo com galeria social, dashboard interativo e auditoria completa*

[ Docs Técnicas](./docs/TECHNICAL.md)  [ Setup](./docs/SETUP.md)  [ Testes](./docs/TESTING.md)

</div>

---

##  Skills Demonstradas

<table>
<tr>
<td width="33%" align="center">

###  Frontend Moderno
Next.js 15 App Router<br>
React 19 Server/Client<br>
TypeScript Strict Mode<br>
Tailwind CSS + Radix UI

</td>
<td width="33%" align="center">

###  PWA & Performance
Service Worker (Serwist)<br>
Offline-First Strategy<br>
Cache Inteligente<br>
Instalável Mobile/Desktop

</td>
<td width="33%" align="center">

###  Backend & Real-Time
Firebase Auth + Firestore<br>
Real-time Listeners<br>
Storage para uploads<br>
TanStack React Query

</td>
</tr>
<tr>
<td width="33%" align="center">

###  Acessibilidade
WCAG AA Compliance<br>
Navegação por Teclado<br>
ARIA Labels<br>
Screen Reader Support

</td>
<td width="33%" align="center">

###  Qualidade de Código
85%+ Test Coverage<br>
Vitest + RTL<br>
SonarCloud Integration<br>
ESLint + Prettier + Husky

</td>
<td width="33%" align="center">

###  DevOps & CI/CD
GitHub Actions<br>
Automated Testing<br>
Quality Gates<br>
Continuous Deployment

</td>
</tr>
</table>

---

##  Funcionalidades Principais

###  **Galeria Social Interativa**
-  Sistema de likes em tempo real com Firebase listeners
-  Comentários com edição e exclusão
-  Upload de fotos com preview
-  Atualizações instantâneas para todos os usuários
-  Layout responsivo com grid adaptável

###  **Gestão de Participantes**
-  CRUD completo com validação Zod
-  Busca, filtros e ordenação
-  Tabela interativa com TanStack Table
-  Integração com PIX e dados brasileiros
-  Formatação automática de telefone/CPF

###  **Dashboard Analítico**
-  Gráficos interativos com Recharts
-  Métricas em tempo real
-  Cards informativos
-  Design adaptável mobile-first

###  **Histórico de Vaquinhas**
-  Timeline por ano
-  Formulário validado (Zod)
-  Filtros dinâmicos
-  Persistência no Firestore

###  **Sistema de Auditoria**
-  Trilha completa de alterações
-  Diff de dados (antes/depois)
-  Rastreamento de usuários
-  Timestamps precisos

###  **PWA Completo**
-  **Funciona offline** com fallback customizado
-  **Instalável** em iOS, Android e Desktop
-  **Cache inteligente** de assets e rotas
-  **Auto-update** do service worker
-  **App-like** com splash screen e ícones maskable

###  **Experiência do Usuário**
-  **Tema claro/escuro** persistente
-  **Mobile-first** com navegação adaptativa
-  **100% acessível** (ARIA, teclado, screen readers)
-  **Animações Lottie** para feedback visual
-  **Autenticação Firebase** com proteção de rotas

---

##  Stack Tecnológica

### Frontend Core
```
Next.js 15.1.3 (App Router + Turbopack)  |  React 19 (Server/Client Components)
TypeScript 5 (Strict Mode)  |  Tailwind CSS 3.4  |  Radix UI
```

### Estado & Dados
```
TanStack React Query 5  |  React Hook Form + Zod  |  TanStack Table 8
```

### Backend & Real-Time
```
Firebase 11 (Auth + Firestore + Storage)  |  Real-time Listeners (onSnapshot)
```

### PWA & Performance
```
@serwist/next (Service Worker)  |  Precaching  |  Runtime Caching  |  Offline Support
```

### Qualidade & Testes
```
Vitest 2.0.5  |  React Testing Library  |  SonarCloud  |  ESLint + Prettier  |  Husky
```

### UI/UX
```
next-themes  |  Lottie Animations  |  Recharts  |  QR Code PIX  |  brazilian-values
```

 **[Ver arquitetura completa ](./docs/TECHNICAL.md)**

---

##  Quick Start

```bash
# Clone e instale
git clone https://github.com/seu-usuario/lulu.git
cd lulu
yarn install

# Configure Firebase
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute
yarn dev              # Desenvolvimento (porta 3001)
yarn build            # Build de produção + PWA
yarn start            # Servidor de produção
```

 **[Instruções detalhadas de setup ](./docs/SETUP.md)**

---

##  Testes & Qualidade

```bash
yarn test              # Testes rápidos
yarn test:coverage     # Com cobertura (85%+)
yarn check             # Lint + TypeCheck + Tests
```

-  **85%+ de cobertura** em components, hooks e services
-  **SonarCloud** para análise contínua de qualidade
-  **GitHub Actions** com CI/CD automatizado
-  **Quality Gate** aprovado

 **[Ver estratégia de testes ](./docs/TESTING.md)**

---

##  Progressive Web App

A aplicação é um **PWA completo** que pode ser instalado como app nativo:

| Feature | Implementação |
|---------|---------------|
|  **Instalável** | Manifest.json + Meta tags Apple |
|  **Offline** | Service Worker com fallback page |
|  **Cache** | Precache de assets + Runtime caching |
|  **Updates** | Auto-update com notificação |
|  **Icons** | PNG maskable (192x192, 512x512) |
|  **iOS/Android** | Suporte completo para instalação |

**Testado em:** Chrome, Safari, Edge, Firefox | iOS 14+, Android 8+

---

##  Design & Acessibilidade

### Mobile-First Approach
-  Interface otimizada para touch
-  Menu hamburger adaptativo
-  Espaçamentos pensados para mobile
-  Touch targets adequados (min 44x44px)

### Acessibilidade (WCAG AA)
-  Navegação completa por teclado
-  Screen reader friendly
-  Contraste de cores adequado
-  ARIA labels e roles semânticos
-  Link "Pular para conteúdo"

### Tema Customizado
-  Dark/Light mode persistente
-  Paleta de cores Lulu (primary, accent, etc.)
-  Sombras customizadas (lulu-sm/md/lg)
-  Animações suaves e feedback visual

---

##  Métricas do Projeto

| Métrica | Valor |
|---------|-------|
| **Test Coverage** | 85%+ |
| **TypeScript Strict** |  100% |
| **Lighthouse PWA** | 100/100 |
| **Acessibilidade** | WCAG AA |
| **SonarCloud Quality Gate** |  Passed |
| **Bundle Size** | Otimizado |

---

##  Arquitetura

```
 Estrutura Limpa por Camadas
  app/           Next.js routes (Server/Client Components)
  components/    UI reutilizáveis (Radix + Custom)
  services/      Firebase + Business Logic
  hooks/         Custom React Hooks
  providers/     Context Providers
  lib/           Utils e Helpers
  public/        Assets + PWA (icons, manifest, SW)
```

**Padrões aplicados:**
-  Clean Architecture
-  Separation of Concerns
-  SOLID Principles
-  DRY & KISS

 **[Ver arquitetura detalhada ](./docs/TECHNICAL.md)**

---

##  Deploy

### Produção
```bash
yarn build    # Build otimizado + Service Worker
yarn start    # Preview de produção local
```

### Plataformas Suportadas
-  **Vercel** (recomendado - suporte PWA nativo)
-  **Firebase Hosting** (headers configurados)
-  **Netlify** (com _headers para SW)

**Nota:** Service Worker compila apenas em produção para melhor DX.

---

##  Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit com [Conventional Commits](https://www.conventionalcommits.org/)
4. Abra um Pull Request

**Diretrizes:**
-  Mantenha cobertura de testes >80%
-  Siga ESLint + Prettier
-  Documente mudanças significativas
-  Teste em mobile e desktop

---

##  Licença

Projeto privado. Entre em contato para mais informações.

---

##  Tecnologias Utilizadas

Construído com tecnologias open-source de ponta:

[Next.js](https://nextjs.org/)  [React](https://react.dev/)  [TypeScript](https://www.typescriptlang.org/)  [Firebase](https://firebase.google.com/)  [Tailwind CSS](https://tailwindcss.com/)  [Radix UI](https://www.radix-ui.com/)  [Serwist](https://serwist.pages.dev/)  [TanStack Query](https://tanstack.com/query)  [Vitest](https://vitest.dev/)

---

<div align="center">

###  Desenvolvido por Su

*"Transformando ideias em experiências digitais acessíveis e performáticas"*

</div>
