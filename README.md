[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=sucorrea_lulu)](https://sonarcloud.io/summary/new_code?id=sucorrea_lulu)

# 🎀 Lulu

> Aplicação web **mobile-first** para gerenciamento de dados e interação em grupo: participantes, galeria com likes/comentários em tempo real, histórico de vaquinhas, dashboard e auditoria. Desenvolvida com Next.js 15, React 19, TypeScript e Firebase, com foco em acessibilidade, performance e experiência em dispositivos móveis.

## 📦 Sobre o Projeto

O **Lulu** é uma aplicação frontend moderna construída com **Next.js 15** (App Router) e **React 19**, pensada desde o início para uso em **celulares e tablets** (abordagem **mobile-first**). Oferece uma interface acessível e responsiva para gerenciar participantes, galeria de fotos com interação social em tempo real, histórico de vaquinhas, métricas no dashboard e trilha de auditoria.

A stack combina **Firebase** (Authentication, Firestore, Storage) com listeners em tempo real (`onSnapshot`) para comentários e likes na galeria, além de **TanStack React Query** para estado de dados e **React Hook Form + Zod** para formulários validados.

## ✨ Stack Tecnológica

### Core

- **Next.js 15.1.3** com App Router e Turbopack
- **React 19** com Server e Client Components
- **TypeScript 5** com tipagem estrita
- **Firebase 11** (Authentication + Firestore + Storage)

### UI e Estilização

- **Tailwind CSS 3.4** com configuração customizada e tema claro/escuro
- **Radix UI** para componentes acessíveis (Dialog, Dropdown, Tooltip, Avatar, etc.)
- **next-themes** para alternância de tema (dark/light mode)
- **Lucide React** e **@iconify/react** para ícones
- **@lottiefiles/dotlottie-react** para animações Lottie
- **react-spinners** para indicadores de carregamento
- **class-variance-authority**, **clsx** e **tailwind-merge** para estilos condicionais

### Gerenciamento de Estado e Dados

- **TanStack React Query 5** (com `staleTime: Infinity` e `refetchOnWindowFocus: false`)
- **TanStack React Table 8** para tabelas interativas
- **React Hook Form** + **Zod** para validação robusta de formulários
- **@hookform/resolvers** para integração Zod

### Utilidades e Funcionalidades

- **brazilian-values** para formatação de CPF, CNPJ, telefone e valores monetários
- **qrcode-pix** e **qrcode.react** para geração de QR Code padrão e PIX
- **recharts** para visualização de dados e gráficos
- **react-device-detect** para adaptar a experiência por dispositivo
- **lodash** e **uuid** para utilitários gerais

### Qualidade e Testes

- **Vitest** como framework de testes
- **React Testing Library** para testes de componentes
- **@vitest/coverage-v8** para cobertura de código
- **vitest-sonar-reporter** para integração com SonarQube
- **ESLint** (eslint-config-next) + **Prettier** para padronização de código
- **Husky** para Git hooks

## 🎨 Design e Tema

O tema visual é fortemente customizado com variáveis CSS para cores, sombras e fontes. Inclui:

- **Tema claro/escuro** com `darkMode: ['class']` via next-themes
- **Paleta personalizada** com nomes semânticos: `primary`, `secondary`, `muted`, `destructive`, `success`, `warning`, `accent`
- **Sombras customizadas** com identidade Lulu: `lulu-sm`, `lulu-md`, `lulu-lg`
- **Animações exclusivas** com `@keyframes`: `lulu-bounce`, `accordion-up`, `accordion-down`
- **Fontes**: **Inter** (corpo de texto) e **Playfair Display** (títulos), com fallbacks system-ui
- **Classes utilitárias** com `@apply` para componentes visuais reutilizáveis (ex.: `.lulu-button`, `.lulu-card`, `.lulu-header`)

## 📱 Abordagem Mobile First

O produto foi desenhado **mobile-first**: o layout e a interação priorizam telas pequenas e depois se adaptam para desktop. Exemplos na implementação:

- **Navegação**: No mobile, a navbar exibe menu hamburger e drawer com links (Participantes, Dashboard, Auditoria, Histórico); em telas maiores (`md:`), os links ficam visíveis na barra superior. Uso de `react-device-detect` e breakpoints Tailwind (`md:`, `sm:`) para comportamentos distintos.
- **Espaçamentos**: Containers com `px-4`/`px-1.5` e `pb-20` no conteúdo para não sobrepor o footer/nav; uso consistente de `gap` e `space-y` em formulários e listas para toque confortável.
- **Imagens e mídia**: Galeria e assets com layout responsivo (grid adaptável, `max-w`, imagens que escalam sem quebrar em telas pequenas).
- **Formulários e toque**: Áreas de toque adequadas em botões e selects (Radix UI), labels e inputs com tamanho legível e acessível em celular.
- **Link “Pular para conteúdo principal”**: Foco em acessibilidade e navegação por teclado/screen reader, alinhado ao uso em dispositivos móveis com leitores de tela.

## 🏗️ Arquitetura e Estrutura

### Organização por Camadas

```
├── app/                          # Next.js App Router (páginas, layouts, rotas)
│   ├── audit/                    # Página de auditoria
│   ├── dashboard/                # Dashboard principal
│   ├── galeria/                  # Galeria de fotos com likes/comentários
│   ├── historico/                # Histórico de vaquinhas
│   ├── login/                    # Autenticação
│   └── participants/             # Gerenciamento de participantes
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Primitivos Radix UI (Button, Input, Dialog, Form)
│   ├── galeria/                  # Componentes da galeria (comments, likes)
│   ├── lulus/                    # Componentes de participantes
│   ├── vaquinha-history/         # Histórico de vaquinhas (timeline, formulário)
│   ├── data-table/               # Tabela com filtros e paginação
│   ├── layout/                   # Header, Footer, Navigation
│   └── modules/                  # Módulos específicos de features
├── services/                     # Integração Firebase e lógica de negócio
│   ├── firebase.ts               # Configuração Firebase (auth, db, storage)
│   ├── galeriaComments.ts        # CRUD de comentários com listeners
│   ├── galeriaLikes.ts           # CRUD de likes com real-time updates
│   ├── vaquinhaHistory.ts        # CRUD histórico de vaquinhas
│   └── queries/                  # React Query hooks (participants, vaquinhaHistory, etc.)
├── hooks/                        # Custom React hooks
│   ├── use-disclosure.ts         # Gerenciamento de modais
│   ├── user-verify.ts            # Verificação de usuário logado
│   └── useUploadPhoto.ts         # Upload de fotos para Firebase Storage
├── providers/                    # Context Providers
│   ├── react-query-provider.tsx  # Configuração React Query
│   ├── theme-provider.tsx        # next-themes wrapper
│   └── device-provider.tsx       # Detecção de dispositivo
├── lib/                          # Utilitários e helpers
│   ├── utils.ts                  # Funções auxiliares (cn, formatters)
│   └── crypto.ts                 # Criptografia e hash
└── public/                       # Assets estáticos (animações, fotos)
```

### Padrões de Código

#### Componentes

- **Client Components**: Marcados com `'use client'` (hooks, interatividade, browser APIs)
- **Server Components**: Por padrão no App Router (data fetching, SEO)
- **Memoização**: Componentes pequenos com `memo()` para otimização
- **Acessibilidade**: HTML semântico, ARIA labels, navegação por teclado

#### Formulários (React Hook Form + Zod)

```typescript
// 1. Definir schema de validação
const personSchema = z.object({
  fullName: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email().optional(),
});

// 2. Usar no componente
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(personSchema),
});

// 3. Submit com mutation
const mutation = useUpdateParticipantData();
const onSubmit = (data) => mutation.mutate(data);
```

#### Firebase Real-time Pattern

```typescript
// Services com onSnapshot para updates ao vivo
export const subscribeToLikes = (
  photoId: string,
  callback: (users: string[]) => void
) => {
  return onSnapshot(doc(db, 'galeria-likes', photoId), (snapshot) => {
    callback(snapshot.data()?.users || []);
  });
};
```

## 🚀 Scripts Disponíveis

**⚠️ IMPORTANTE**: Este projeto usa **Yarn** como gerenciador de pacotes.

```bash
yarn dev              # Desenvolvimento na porta 3001 com Turbopack
yarn build            # Build de produção
yarn start            # Servidor de produção
yarn lint             # Análise ESLint
yarn test             # Executa testes com Vitest (sem coverage)
yarn test:coverage    # Testes com relatório de cobertura
yarn typecheck        # Verificação de tipos TypeScript
yarn check            # Executa lint + typecheck + test
```

## 🔧 Funcionalidades Principais

### Galeria de Fotos com Interação Social

- Sistema de **likes em tempo real** com Firebase Firestore listeners
- **Comentários** com suporte a edição e exclusão
- Upload de fotos para Firebase Storage
- Visualização responsiva com suporte mobile/desktop

### Gerenciamento de Participantes

- CRUD completo de participantes com validação Zod
- Campos opcionais: email, telefone, Instagram, chave PIX
- Tabela interativa com filtros, ordenação e paginação
- Formatação automática de dados brasileiros (telefone, CPF)

### Sistema de Autenticação

- Firebase Authentication integrado
- Verificação de usuário com hook customizado (`useUserVerification`)
- Proteção de rotas sensíveis

### UI/UX Responsiva e Mobile First

- **Layout mobile-first**: navegação adaptativa (menu hamburger + drawer no mobile), espaçamentos e touch targets pensados para celular
- Detecção automática de dispositivo (mobile/desktop) via `react-device-detect`
- Tema claro/escuro persistente com `next-themes`
- Componentes acessíveis (ARIA, navegação por teclado, link “Pular para conteúdo principal”)
- Animações Lottie para estados de loading e feedback visual
- Geração de QR Code PIX para pagamentos

### Dashboard e Visualização

- Gráficos interativos com Recharts
- Cards informativos com métricas em tempo real
- Layout adaptável a diferentes tamanhos de tela

### Histórico de Vaquinhas e Auditoria

- **Histórico**: Timeline de vaquinhas por ano, CRUD com formulário validado (Zod), filtro por ano e participantes ordenados
- **Auditoria**: Trilha de alterações com diff de dados e integração Firestore

## 🧪 Testes

### Configuração

- **Framework**: Vitest 2.0.5
- **Testing Library**: React Testing Library 16
- **Coverage**: 85%+ nas principais áreas (components, hooks, services)
- **Mocking**: Firebase mockado em `vitest.setup.ts` para evitar chamadas reais

### Estrutura de Testes

```typescript
// Exemplo de teste de componente
vi.mock('@/services/queries/fetchParticipants');
vi.mock('@/hooks/user-verify');

const mockData = [{ id: '1', name: 'Test', photos: [] }];
mockUseGetGalleryImages.mockReturnValue({
  data: mockData,
  isLoading: false
});

render(<GaleriaFotos />);
expect(screen.getByText('Test')).toBeInTheDocument();
```

### Executar Testes

```bash
yarn test              # Execução rápida sem coverage
yarn test:coverage     # Com relatório de cobertura detalhado
yarn check             # Lint + Typecheck + Testes
```

### Cobertura

- Configurado para `app/`, `components/`, `hooks/`, `lib/`, `providers/`, `services/`
- Reportadores: `default`, `json-summary`, `vitest-sonar-reporter`
- Arquivos de coverage em `coverage/` (gitignored)

### Métricas com SonarCloud

- Projeto integrado ao **SonarCloud/SonarQube**, com *quality gate* exibido no topo deste README.
- Pipeline de testes gera relatórios em formato compatível (`vitest-sonar-reporter`), permitindo acompanhamento de **coverage**, **code smells**, **bugs** e **vulnerabilidades**.
- Essa configuração mostra domínio de práticas de **qualidade contínua** e **observabilidade de código** em ambiente de CI.

## ✅ Acessibilidade e Boas Práticas

### Acessibilidade (a11y)

- **Navegação por teclado** em todos os componentes interativos
- **ARIA labels** e roles semânticos
- **Foco visível** com outline customizado
- **Contraste de cores** adequado (WCAG AA)
- **Screen reader friendly** com textos sr-only quando necessário
- **Formulários** com labels explícitas e mensagens de erro claras

### Performance

- **React Query** com cache inteligente (`staleTime: Infinity`)
- **Memoização** de componentes com `React.memo()`
- **Code splitting** automático do Next.js
- **Turbopack** para builds mais rápidas
- **Lazy loading** para imagens e componentes pesados

### Qualidade de Código

- **TypeScript** em modo strict
- **ESLint** + **Prettier** configurados
- **Husky** para pre-commit hooks
- **SonarQube** para análise estática contínua
- **Conventional Commits** (recomendado)

## 📦 Requisitos e Setup

### Pré-requisitos

- **Node.js** 18+ ou 20+
- **Yarn** (gerenciador de pacotes oficial do projeto)
- **Firebase Project** configurado (Auth + Firestore + Storage)

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/lulu.git
cd lulu

# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Firebase

# Iniciar servidor de desenvolvimento
yarn dev
```

### Variáveis de Ambiente

Criar arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🚢 Deploy

### CI/CD e DevOps

- Pipeline de **CI/CD** configurado com **GitHub Actions**:
  - Executa **lint**, **typecheck** e **testes** a cada push/PR.
  - Publica relatórios para o **SonarCloud**, mantendo o quality gate atualizado.
  - Prepara o build de produção e automatiza o fluxo de deploy.
- Essa automação demonstra conhecimento prático em **DevOps** (integração contínua, qualidade contínua e entrega contínua).

### Build de Produção

```bash
yarn build      # Gera build otimizado em .next/
yarn start      # Inicia servidor de produção
```

### Plataformas Recomendadas

- **Vercel** (recomendado para Next.js)
- **Firebase Hosting**
- **Netlify**

## 📚 Documentação Técnica

### Modelos de Dados

**Person** (`components/lulus/types.ts`)

```typescript
interface Person {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  instagram?: string;
  pixKey?: string;
  createdAt: Date;
}
```

**GaleriaComment** (`services/galeriaComments.ts`)

```typescript
interface GaleriaComment {
  id: string;
  photoId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Timestamp;
}
```

### Convenções de Código

- **Componentes**: PascalCase (`GaleriaFotos.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useUserVerification.ts`)
- **Services**: camelCase (`galeriaComments.ts`)
- **Tipos**: PascalCase, preferencialmente em arquivos `types.ts`
- **Testes**: mesmo nome do arquivo com `.spec.tsx` ou `.spec.ts`

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Diretrizes

- Seguir os padrões ESLint e Prettier configurados
- Adicionar testes para novas funcionalidades
- Manter a cobertura de testes acima de 80%
- Documentar componentes e funções complexas
- Usar Conventional Commits

## 📄 Licença

Este projeto é privado no momento, mas poderá adotar uma licença de código aberto no futuro.

## 🙏 Agradecimentos

Este projeto foi construído com tecnologias open-source incríveis:

- [Next.js](https://nextjs.org/) pela framework excepcional
- [Radix UI](https://www.radix-ui.com/) pelos componentes acessíveis
- [Tailwind CSS](https://tailwindcss.com/) pelo sistema de design flexível
- [Firebase](https://firebase.google.com/) pela infraestrutura robusta

---

> Feito com carinho, cuidado e bastante café ☕ por Su. 💖
