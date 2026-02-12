# 🧪 Testes e Qualidade de Código

Guia completo de testes, cobertura e práticas de qualidade no projeto Lulu.

## Índice

- [Visão Geral](#visão-geral)
- [Stack de Testes](#stack-de-testes)
- [Estrutura de Testes](#estrutura-de-testes)
- [Executando Testes](#executando-testes)
- [Escrevendo Testes](#escrevendo-testes)
- [Mocking](#mocking)
- [Cobertura](#cobertura)
- [SonarCloud Integration](#sonarcloud-integration)
- [CI/CD Pipeline](#cicd-pipeline)

---

## Visão Geral

O projeto mantém **85%+ de cobertura de testes** em áreas críticas:

- ✅ Components
- ✅ Hooks
- ✅ Services
- ✅ Utilities (lib/)
- ✅ Providers

### Métricas Atuais

| Métrica                     | Valor     |
| --------------------------- | --------- |
| **Test Coverage**           | 85%+      |
| **Total Tests**             | 150+      |
| **Test Suites**             | 45+       |
| **SonarCloud Quality Gate** | ✅ Passed |
| **Code Smells**             | < 10      |
| **Bugs**                    | 0         |
| **Vulnerabilities**         | 0         |

---

## Stack de Testes

### Ferramentas

```typescript
vitest              v2.0.5    // Test runner (Jest alternative)
@testing-library/react v16    // Component testing
@testing-library/user-event   // User interactions
@vitest/coverage-v8           // Code coverage
vitest-sonar-reporter         // SonarCloud integration
happy-dom                     // DOM environment (faster than jsdom)
```

### Por que Vitest?

- ⚡ **Extremamente rápido** (Vite-powered)
- 🔧 **Configuração mínima**
- 🎯 **Compatible com Jest** (mesma API)
- 📊 **Built-in coverage**
- 🔁 **Watch mode inteligente**

---

## Estrutura de Testes

### Convenção de Nomes

```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── button.spec.tsx        ← Teste do componente
│   ├── galeria/
│   │   ├── photo-card.tsx
│   │   └── photo-card.spec.tsx
│
├── hooks/
│   ├── use-disclosure.ts
│   └── use-disclosure.spec.ts    ← Teste do hook
│
├── services/
│   ├── galeriaLikes.ts
│   └── galeriaLikes.spec.ts      ← Teste do service
│
└── lib/
    ├── utils.ts
    └── utils.spec.ts             ← Teste de utilities
```

### Padrão: `.spec.tsx` ou `.spec.ts`

✅ **Correto:**

- `button.spec.tsx`
- `use-disclosure.spec.ts`
- `utils.spec.ts`

❌ **Evitar:**

- `button.test.tsx`
- `button.test.js`

---

## Executando Testes

### Comandos Básicos

```bash
# Executar todos os testes
yarn test

# Watch mode (re-executa ao salvar)
yarn test --watch

# Executar testes específicos
yarn test button.spec

# Ver cobertura
yarn test:coverage

# Lint + TypeCheck + Tests
yarn check
```

### Opções Úteis

```bash
# Verbose output
yarn test --reporter=verbose

# UI mode (interface visual)
yarn test --ui

# Rodar apenas testes modificados
yarn test --changed

# Parallel execution (padrão)
yarn test --threads=4
```

---

## Escrevendo Testes

### 1. Teste de Componente Básico

```typescript
// components/ui/button.spec.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renderiza com texto correto', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('chama onClick quando clicado', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByText('Click me'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('está desabilitado quando disabled=true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('aplica variantes corretamente', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>);
    expect(container.firstChild).toHaveClass('bg-destructive');
  });
});
```

### 2. Teste de Hook Customizado

```typescript
// hooks/use-disclosure.spec.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from './use-disclosure';

describe('useDisclosure', () => {
  it('inicia fechado por padrão', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('abre corretamente', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.onOpen();
    });

    expect(result.current.isOpen).toBe(true);
  });

  it('fecha corretamente', () => {
    const { result } = renderHook(() => useDisclosure({ defaultIsOpen: true }));

    act(() => {
      result.current.onClose();
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('alterna estado com toggle', () => {
    const { result } = renderHook(() => useDisclosure());

    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
```

### 3. Teste de Service com Firebase Mock

```typescript
// services/galeriaLikes.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { likePhoto, unlikePhoto, subscribeToLikes } from './galeriaLikes';

// Mock Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ id: 'mock-doc' })),
  updateDoc: vi.fn(),
  arrayUnion: vi.fn((userId) => ['mock-array', userId]),
  arrayRemove: vi.fn((userId) => ['mock-array', userId]),
  onSnapshot: vi.fn((docRef, callback) => {
    callback({ data: () => ({ users: ['user1', 'user2'] }) });
    return vi.fn(); // unsubscribe function
  }),
}));

describe('galeriaLikes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adiciona like corretamente', async () => {
    await likePhoto('photo123', 'user456');

    const { updateDoc } = await import('firebase/firestore');
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it('remove like corretamente', async () => {
    await unlikePhoto('photo123', 'user456');

    const { updateDoc } = await import('firebase/firestore');
    expect(updateDoc).toHaveBeenCalledTimes(1);
  });

  it('subscribe retorna lista de usuários', () => {
    const callback = vi.fn();
    const unsubscribe = subscribeToLikes('photo123', callback);

    expect(callback).toHaveBeenCalledWith(['user1', 'user2']);

    unsubscribe();
  });
});
```

### 4. Teste de Utility Function

```typescript
// lib/utils.spec.ts
import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, formatPhone } from './utils';

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('combina classes corretamente', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('remove classes duplicadas', () => {
      expect(cn('px-4', 'px-2')).toBe('px-2');
    });

    it('aceita condicionais', () => {
      expect(cn('base', true && 'active', false && 'inactive')).toBe(
        'base active'
      );
    });
  });

  describe('formatCurrency', () => {
    it('formata números como BRL', () => {
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
    });

    it('trata valores negativos', () => {
      expect(formatCurrency(-100)).toBe('-R$ 100,00');
    });
  });

  describe('formatPhone', () => {
    it('formata celular', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('formata telefone fixo', () => {
      expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
    });
  });
});
```

---

## Mocking

### Setup Global (vitest.setup.ts)

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Auto cleanup após cada teste
afterEach(() => {
  cleanup();
});

// Mock global do Firebase
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
}));

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));
```

### Mock de Hook Customizado

```typescript
// Em qualquer teste
vi.mock('@/hooks/user-verify', () => ({
  useUserVerification: vi.fn(() => ({
    user: { uid: 'test-user' },
    isLoading: false,
    isAuthenticated: true,
  })),
}));
```

### Mock de React Query

```typescript
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: mockData,
    isLoading: false,
    isError: false,
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    isLoading: false,
  })),
}));
```

---

## Cobertura

### Configuração (vitest.config.ts)

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html', 'lcov'],
      include: [
        'app/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
        'hooks/**/*.{ts,tsx}',
        'lib/**/*.{ts,tsx}',
        'providers/**/*.{ts,tsx}',
        'services/**/*.{ts,tsx}',
      ],
      exclude: [
        '**/*.spec.{ts,tsx}',
        '**/*.config.{ts,js}',
        '**/types.ts',
        '**/.next/**',
        '**/node_modules/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

### Ver Relatório

```bash
# Gerar cobertura
yarn test:coverage

# Abrir relatório HTML
open coverage/index.html
```

### Relatórios Gerados

```
coverage/
├── index.html          # Relatório visual navegável
├── lcov.info           # Para SonarCloud
├── coverage-summary.json
└── lcov-report/        # Detalhes por arquivo
```

---

## SonarCloud Integration

### Configuração

```properties
# sonar-project.properties
sonar.projectKey=sucorrea_lulu
sonar.organization=seu-org
sonar.sources=app,components,hooks,lib,providers,services
sonar.tests=app,components,hooks,lib,providers,services
sonar.test.inclusions=**/*.spec.ts,**/*.spec.tsx
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.testExecutionReportPaths=coverage/sonar-report.xml
```

### Métricas Analisadas

- 📊 **Coverage** - Cobertura de código
- 🐛 **Bugs** - Bugs potenciais
- 🔒 **Vulnerabilities** - Vulnerabilidades de segurança
- 💩 **Code Smells** - Anti-patterns e má práticas
- 🔄 **Duplications** - Código duplicado
- 📝 **Technical Debt** - Débito técnico estimado

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run linter
        run: yarn lint

      - name: Type check
        run: yarn typecheck

      - name: Run tests
        run: yarn test:coverage

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Quality Gate

O pipeline falha se:

- ❌ Cobertura < 80%
- ❌ ESLint errors
- ❌ TypeScript errors
- ❌ Testes falhando
- ❌ SonarCloud Quality Gate failed

---

## Best Practices

### ✅ Do

- ✅ Teste comportamento, não implementação
- ✅ Use `screen.getByRole` quando possível
- ✅ Mock apenas o necessário
- ✅ Escreva testes legíveis (AAA pattern)
- ✅ Use `userEvent` para simular interações
- ✅ Teste casos de erro e edge cases
- ✅ Mantenha testes independentes

### ❌ Don't

- ❌ Teste detalhes de implementação
- ❌ Use `querySelector` (prefira queries da RTL)
- ❌ Escreva testes frágeis (que quebram com refactor)
- ❌ Ignore testes falhando
- ❌ Mock tudo (teste integração quando possível)
- ❌ Commit código sem testes

---

## Debugging Tests

### VSCode Launch Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "runtimeExecutable": "yarn",
      "runtimeArgs": ["test", "--run", "--inspector-brk"],
      "smartStep": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### Debug no Terminal

```bash
# Abrir DevTools
yarn test --inspect-brk

# Ou com UI
yarn test --ui
```

---

## Recursos

- 📖 [Vitest Docs](https://vitest.dev/)
- 🧪 [Testing Library Best Practices](https://testing-library.com/docs/queries/about#priority)
- 🎯 [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- 📊 [SonarCloud Docs](https://docs.sonarcloud.io/)

---

[← Voltar ao README](../README.md)
