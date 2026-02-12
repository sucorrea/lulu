# 🏗️ Documentação Técnica - Arquitetura e Implementação

## Índice

- [Arquitetura Geral](#arquitetura-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões de Código](#padrões-de-código)
- [Service Worker e PWA](#service-worker-e-pwa)
- [Firebase Integration](#firebase-integration)
- [React Query Strategy](#react-query-strategy)
- [Tema e Estilização](#tema-e-estilização)

---

## Arquitetura Geral

O projeto segue uma arquitetura em camadas com separação clara de responsabilidades:

### Camadas

```
┌─────────────────────────────────────┐
│     Presentation Layer (UI)         │  ← Components, Pages
├─────────────────────────────────────┤
│     Business Logic Layer            │  ← Hooks, Providers
├─────────────────────────────────────┤
│     Data Access Layer               │  ← Services, Queries
├─────────────────────────────────────┤
│     External Services               │  ← Firebase, APIs
└─────────────────────────────────────┘
```

### Princípios Aplicados

- **Clean Architecture**: Separação entre UI, lógica e dados
- **SOLID**: Single Responsibility, Open/Closed, Dependency Inversion
- **DRY**: Componentes e hooks reutilizáveis
- **Composition over Inheritance**: Hooks customizados e HOCs

---

## Estrutura de Pastas

```
lulu/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Rotas agrupadas
│   │   ├── dashboard/
│   │   ├── galeria/
│   │   ├── historico/
│   │   ├── auditoria/
│   │   └── participantes/
│   ├── api/                      # API Routes (se necessário)
│   ├── offline/                  # PWA offline page
│   ├── sw.ts                     # Service Worker (Serwist)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── icon.png                  # App icon (metadata)
│   └── globals.css               # Global styles
│
├── components/                   # Componentes reutilizáveis
│   ├── ui/                       # Primitivos Radix UI estilizados
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ... (20+ componentes)
│   │
│   ├── galeria/                  # Feature: Galeria
│   │   ├── galeria-fotos.tsx
│   │   ├── photo-card.tsx
│   │   ├── comment-section.tsx
│   │   ├── like-button.tsx
│   │   └── upload-form.tsx
│   │
│   ├── lulus/                    # Feature: Participantes
│   │   ├── person-form.tsx
│   │   ├── person-list.tsx
│   │   └── types.ts
│   │
│   ├── vaquinha-history/         # Feature: Histórico
│   ├── audit/                    # Feature: Auditoria
│   ├── data-table/               # Tabela genérica (TanStack)
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── pwa-update-manager.tsx
│   └── modules/                  # Módulos específicos
│
├── services/                     # Business Logic + Firebase
│   ├── firebase.ts               # Firebase config & exports
│   ├── galeriaComments.ts        # CRUD Comentários
│   ├── galeriaLikes.ts           # CRUD Likes
│   ├── vaquinhaHistory.ts        # CRUD Histórico
│   ├── participants-server.ts    # Server-side participants
│   │
│   ├── queries/                  # React Query hooks
│   │   ├── fetchParticipants.ts
│   │   ├── updateParticipant.ts
│   │   ├── useGalleryQueries.ts
│   │   └── useHistoryQueries.ts
│   │
│   └── audit/                    # Auditoria services
│
├── hooks/                        # Custom React Hooks
│   ├── use-disclosure.ts         # Modal state management
│   ├── user-verify.ts            # Auth verification
│   ├── useUploadPhoto.ts         # Photo upload logic
│   └── usePwaUpdate.ts           # PWA update notifications
│
├── providers/                    # Context Providers
│   ├── react-query-provider.tsx  # TanStack Query config
│   ├── theme-provider.tsx        # next-themes wrapper
│   └── device-provider.tsx       # React device detect
│
├── lib/                          # Utilities & Helpers
│   ├── utils.ts                  # cn(), formatters
│   ├── crypto.ts                 # Encryption helpers
│   └── i18n/                     # Internacionalização
│
└── public/                       # Static assets
    ├── manifest.webmanifest      # PWA manifest
    ├── sw.js                     # Compiled service worker
    ├── icons/                    # PWA icons (192, 512, maskable)
    ├── animation/                # Lottie animations
    └── fotos/                    # User uploaded photos
```

---

## Padrões de Código

### 1. Componentes React

#### Client Components

Marcados com `'use client'` quando usam:

- Hooks (`useState`, `useEffect`, custom hooks)
- Event handlers
- Browser APIs
- Context consumers que não são server-safe

```typescript
'use client';

import { useState } from 'react';
import { useUserVerification } from '@/hooks/user-verify';

export const GaleriaFotos = () => {
  const [filter, setFilter] = useState('');
  const { user, isLoading } = useUserVerification();

  // Component logic...
};
```

#### Server Components (Default)

Usados para:

- Data fetching inicial
- SEO metadata
- Componentes estáticos sem interatividade

```typescript
// No 'use client' - é Server Component por padrão
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard de métricas',
};

export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return <DashboardClient data={data} />;
}
```

### 2. Formulários (React Hook Form + Zod)

Padrão consistente em todo o projeto:

```typescript
// 1. Schema de validação
const participantSchema = z.object({
  fullName: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  pixKey: z.string().optional(),
});

type ParticipantForm = z.infer<typeof participantSchema>;

// 2. Hook form com resolver
const form = useForm<ParticipantForm>({
  resolver: zodResolver(participantSchema),
  defaultValues: initialData,
});

// 3. Mutation com React Query
const updateMutation = useUpdateParticipantData();

const onSubmit = (data: ParticipantForm) => {
  updateMutation.mutate(data, {
    onSuccess: () => {
      toast.success('Atualizado com sucesso!');
      form.reset();
    },
    onError: (error) => {
      toast.error('Erro ao atualizar');
    },
  });
};

// 4. Form component com UI components
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nome Completo</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### 3. Estilo de Código

```typescript
// ✅ Bom: Arrow functions, const, tipos explícitos
export const MyComponent = ({ name }: { name: string }) => {
  const handleClick = () => {
    console.log(name);
  };

  return <button onClick={handleClick}>{name}</button>;
};

// ❌ Evitar: function declarations
export function MyComponent({ name }: { name: string }) {
  function handleClick() {
    console.log(name);
  }
  return <button onClick={handleClick}>{name}</button>;
}
```

---

## Service Worker e PWA

### Implementação com Serwist

#### app/sw.ts - Service Worker

```typescript
/// <reference lib="webworker" />
import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

const swSelf = globalThis as unknown as WorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: swSelf.__SW_MANIFEST,
  skipWaiting: true, // Ativa nova versão imediatamente
  clientsClaim: true, // Assume controle dos clients existentes
  navigationPreload: true, // Preload durante navigation requests
  runtimeCaching: defaultCache, // Estratégias de cache padrão
  fallbacks: {
    entries: [
      {
        url: '/offline',
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});

serwist.addEventListeners();
```

#### next.config.ts - Integração Serwist

```typescript
import withSerwistInit from '@serwist/next';

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV !== 'production',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  additionalPrecacheEntries: [{ url: '/offline', revision }],
  exclude: [/.map$/, /^manifest.*\.js$/],
  globPublicPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}'],
});

export default withSerwist(nextConfig);
```

### Estratégias de Cache

1. **Precache**: Assets críticos (JS, CSS, fonts)
2. **Network First**: Dados Firebase (sempre tenta rede primeiro)
3. **Cache First**: Imagens e assets estáticos
4. **Stale While Revalidate**: Navegação de página

### PWA Update Manager

Notifica usuários sobre atualizações disponíveis:

```typescript
export const PwaUpdateManager = () => {
  const { hasUpdate, updateServiceWorker } = usePwaUpdate();

  if (!hasUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={updateServiceWorker}>
        Nova versão disponível! Atualizar
      </Button>
    </div>
  );
};
```

---

## Firebase Integration

### Configuração

```typescript
// services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Real-time Listeners Pattern

```typescript
// services/galeriaLikes.ts
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToLikes = (
  photoId: string,
  callback: (users: string[]) => void
) => {
  const docRef = doc(db, 'galeria-likes', photoId);

  return onSnapshot(docRef, (snapshot) => {
    const data = snapshot.data();
    callback(data?.users || []);
  });
};

export const likePhoto = async (photoId: string, userId: string) => {
  const docRef = doc(db, 'galeria-likes', photoId);
  await updateDoc(docRef, {
    users: arrayUnion(userId),
  });
};

export const unlikePhoto = async (photoId: string, userId: string) => {
  const docRef = doc(db, 'galeria-likes', photoId);
  await updateDoc(docRef, {
    users: arrayRemove(userId),
  });
};
```

### Upload de Fotos

```typescript
// hooks/useUploadPhoto.ts
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/services/firebase';

export const useUploadPhoto = () => {
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string | null>(null);

  const upload = (file: File) => {
    const storageRef = ref(storage, `galeria/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => console.error(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUrl(downloadURL);
      }
    );
  };

  return { upload, progress, url };
};
```

---

## React Query Strategy

### Configuração Global

```typescript
// providers/react-query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

### Query Hooks Pattern

```typescript
// services/queries/fetchParticipants.ts
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export const useGetAllParticipants = () => {
  return useQuery({
    queryKey: ['participants'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, 'participants'));
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },
  });
};
```

### Mutation Hooks Pattern

```typescript
// services/queries/updateParticipant.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const useUpdateParticipantData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Person> }) => {
      const docRef = doc(db, 'participants', id);
      await updateDoc(docRef, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['participants'] });
    },
  });
};
```

---

## Tema e Estilização

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--secondary))',
        accent: 'hsl(var(--accent))',
        // ... custom colors
      },
      boxShadow: {
        'lulu-sm': '0 2px 8px rgba(255, 105, 180, 0.3)',
        'lulu-md': '0 4px 16px rgba(255, 105, 180, 0.4)',
        'lulu-lg': '0 8px 32px rgba(255, 105, 180, 0.5)',
      },
      keyframes: {
        'lulu-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
};
```

### CSS Variables (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --primary: 0 72.2% 50.6%;
    --primary-foreground: 0 0% 98%;
    /* ... */
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    /* ... */
  }
}
```

### Theme Provider Usage

```typescript
import { ThemeProvider } from 'next-themes';

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

---

## Performance Otimizations

1. **Code Splitting**: Automático via Next.js App Router
2. **Memoization**: `React.memo()` em componentes pequenos
3. **React Query Cache**: Evita refetchs desnecessários
4. **Dynamic Imports**: Para componentes pesados
5. **Image Optimization**: Next.js `<Image>` component
6. **Turbopack**: Build mais rápido em desenvolvimento

---

## Acessibilidade

### Práticas Implementadas

- ✅ Semantic HTML (`<nav>`, `<main>`, `<aside>`)
- ✅ ARIA labels onde necessário
- ✅ Foco visível customizado
- ✅ Navegação por teclado completa
- ✅ Skip to content link
- ✅ Color contrast (WCAG AA)
- ✅ Screen reader text (`sr-only`)
- ✅ Form labels explícitas

### Exemplo

```typescript
<button
  aria-label="Curtir foto"
  aria-pressed={isLiked}
  onClick={handleLike}
  className="focus:outline-none focus:ring-2 focus:ring-primary"
>
  <Heart className={isLiked ? 'fill-red-500' : ''} />
</button>
```

---

[← Voltar ao README](../README.md)
