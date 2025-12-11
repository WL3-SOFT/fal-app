# Arquitetura do Projeto Faça a Lista

Este documento descreve a arquitetura do aplicativo **Faça a Lista**, uma aplicação React Native construída com Expo SDK 54.

## Visão Geral

O projeto segue os princípios da **Clean Architecture** combinados com o padrão **MVVM (Model-View-ViewModel)** e **Inversão de Dependência**. O objetivo é manter o código desacoplado, testável e fácil de manter.

```
┌─────────────────────────────────────────────────────────────────┐
│                         APLICAÇÃO                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     UI LAYER                             │   │
│  │  (screens, components, hooks, providers, theme)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   DOMAIN LAYER                           │   │
│  │  (entities, use cases, repository interfaces)            │   │
│  │              [A ser implementado]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER                            │   │
│  │  (repositories, DTOs, mappers)                           │   │
│  │              [A ser implementado]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   INFRA LAYER                            │   │
│  │  (implementações concretas: HTTP, Storage)               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   CORE LAYER                             │   │
│  │  (interfaces/contratos, constraints)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura de Pastas

```
src/
├── app/                    # Expo Router - Rotas da aplicação
│   ├── (access)/           # Grupo de autenticação
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── recover.tsx
│   ├── (tabs)/             # Navegação por abas
│   │   ├── _layout.tsx     # Configuração das tabs
│   │   ├── index.tsx       # Tab Home
│   │   └── lists/          # Stack de Listas
│   │       ├── _layout.tsx
│   │       ├── index.tsx
│   │       ├── create.tsx
│   │       └── [id].tsx    # Rota dinâmica
│   ├── _layout.tsx         # Layout raiz
│   └── +not-found.tsx      # Página 404
│
├── core/                   # Contratos e definições centrais
│   ├── constraints/        # Constantes de negócio
│   │   └── index.ts        # Ex: menuOptions
│   └── interfaces/         # Interfaces/contratos
│       └── modules/
│           ├── http.ts     # HttpClient interface
│           ├── storage.ts  # Storage interface
│           ├── analytics.ts
│           └── uuid.ts
│
├── infra/                  # Implementações concretas
│   └── modules/
│       ├── http/
│       │   └── NativeHttpClient.ts    # fetch API wrapper
│       └── storage/
│           ├── SecureStoreClient.ts   # expo-secure-store
│           └── SqliteStorageClient.ts # expo-sqlite/kv-store
│
├── types/                  # Tipos TypeScript compartilhados
│   ├── icon.ts
│   └── themes.ts           # Interface Theme
│
└── ui/                     # Camada de apresentação (MVVM)
    ├── assets/
    │   ├── fonts/Inter/
    │   ├── icons/          # Componentes SVG
    │   └── images/
    │
    ├── components/         # Componentes reutilizáveis
    │   ├── Avatar/
    │   ├── Cards/
    │   ├── Headers/
    │   ├── Logo/
    │   └── SafeAreaView/
    │
    ├── hooks/
    │   └── useTheme.ts     # Hook para acessar ThemeContext
    │
    ├── providers/
    │   ├── AppProviders.tsx    # Composição de providers
    │   └── ThemeProvider.tsx   # Context de tema
    │
    ├── screens/            # Telas (View + ViewModel)
    │   ├── Home/
    │   │   ├── Home.view.tsx
    │   │   ├── Home.viewModel.ts
    │   │   ├── Home.styles.ts
    │   │   └── components/
    │   ├── Lists/
    │   │   ├── Lists.view.tsx
    │   │   ├── Create/
    │   │   └── Detail/
    │   └── NotFound/
    │
    ├── theme/              # Sistema de temas
    │   ├── dark.ts
    │   ├── light.ts
    │   └── tokens/
    │       ├── colors.ts
    │       ├── spacing.ts
    │       └── typography.ts
    │
    └── utils/
        └── getCurrentTheme.ts
```

## Camadas da Arquitetura

### 1. Core Layer (`src/core/`)

Contém as **interfaces (contratos)** e **constantes de negócio**. Esta camada define O QUE o sistema faz, não COMO.

#### Interfaces (`core/interfaces/modules/`)

```typescript
// HttpClient - Contrato para requisições HTTP
export interface HttpClient {
  get<T>(params: HttpParams): Promise<HttpResponse<T>>;
  post<T>(params: HttpParams): Promise<HttpResponse<T>>;
  put<T>(params: HttpParams): Promise<HttpResponse<T>>;
  delete<T>(params: HttpParams): Promise<HttpResponse<T>>;
}

// Storage - Contrato para persistência de dados
export interface Storage {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<boolean>;
  exists(key: string): Promise<boolean>;
}
```

#### Constraints (`core/constraints/`)

Constantes e configurações de negócio que não mudam frequentemente.

### 2. Infra Layer (`src/infra/`)

Implementações concretas das interfaces definidas no Core. Esta camada conhece as bibliotecas externas.

```typescript
// NativeHttpClient - Implementa HttpClient usando fetch
export class NativeHttpClient implements HttpClient {
  async get<T>(params: HttpParams): Promise<HttpResponse<T>> {
    const response = await fetch(params.url, { method: "GET", ... });
    // ...
  }
}

// SecureStoreClient - Implementa Storage usando expo-secure-store
export class SecureStoreClient implements Storage {
  async get<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  }
}

// SqliteStorageClient - Implementa Storage usando expo-sqlite
export class SqliteStorageClient implements StorageContract {
  async get<T>(key: string): Promise<T | null> {
    const rawValue = await Storage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  }
}
```

**Instâncias exportadas:**
```typescript
// src/infra/modules/index.ts
export const httpClient: HttpClient = new NativeHttpClient();
export const vault: Storage = new SecureStoreClient();    // Dados sensíveis
export const storage: Storage = new SqliteStorageClient(); // Dados gerais
```

### 3. UI Layer (`src/ui/`)

Camada de apresentação seguindo o padrão **MVVM**.

#### Padrão de Telas (MVVM)

Cada tela é organizada em:

```
screens/FeatureName/
├── index.ts                    # Re-export
├── FeatureName.view.tsx        # View - apenas UI
├── FeatureName.viewModel.ts    # ViewModel - lógica e estado (hook)
├── FeatureName.styles.ts       # Estilos (StyleSheet ou styled)
└── components/                 # Componentes específicos da tela
```

**Exemplo - HomeView:**
```typescript
// Home.view.tsx - Apenas renderização
export const HomeView = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createHomeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <GreetingMessage />
      <Panels />
    </View>
  );
};
```

#### Sistema de Temas

O tema é gerenciado via React Context:

```typescript
// ThemeProvider.tsx
interface ThemeContextData {
  theme: Theme;
  themeMode: 'light' | 'dark' | 'auto';
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

// useTheme.ts - Hook para consumir
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return context;
}
```

**Estrutura do Theme:**
```typescript
interface Theme {
  colors: Colors;      // Paleta de cores
  spacing: Spacing;    // Espaçamentos (xs, sm, md, lg, xl)
  typography: Typography; // Fontes e tamanhos
  borderRadius: BorderRadius;
  shadows: Shadows;
}
```

#### Providers

Composição de providers no `AppProviders`:

```typescript
export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
```

### 4. App Layer (`src/app/`)

Roteamento da aplicação usando **Expo Router** (file-based routing).

#### Layout Raiz

```typescript
// _layout.tsx
Sentry.init({ ... }); // Monitoramento de erros

const Application = () => (
  <AppProviders>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  </AppProviders>
);

export default Sentry.wrap(RootLayout);
```

#### Navegação por Tabs

```typescript
// (tabs)/_layout.tsx
export default function TabLayout() {
  const { theme } = useTheme();
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.colors.tab.active.icon,
      header: (props) => <Header {...props} />,
    }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="lists" options={{ title: "Listas" }} />
    </Tabs>
  );
}
```

## Fluxo de Dados

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    View     │ ──► │  ViewModel  │ ──► │   UseCase   │
│  (.view)    │     │ (hook/state)│     │  [futuro]   │
└─────────────┘     └─────────────┘     └─────────────┘
      ▲                                       │
      │                                       ▼
      │              ┌─────────────┐     ┌─────────────┐
      └───────────── │    State    │ ◄── │ Repository  │
                     │  (Context)  │     │  [futuro]   │
                     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                                        ┌─────────────┐
                                        │    Infra    │
                                        │ (HTTP, DB)  │
                                        └─────────────┘
```

## Princípios de Design

### 1. Inversão de Dependência

**NUNCA** importe bibliotecas externas diretamente no código de negócio.

```typescript
// ❌ ERRADO - Acoplamento direto
import * as SecureStore from 'expo-secure-store';
const value = await SecureStore.getItemAsync(key);

// ✅ CORRETO - Via interface
import { vault } from '@/infra/modules';
const value = await vault.get(key);
```

### 2. Separação View/ViewModel

```typescript
// View - Apenas UI, sem lógica
export const MyView = () => {
  const { data, loading, handleAction } = useMyViewModel();
  return loading ? <Loading /> : <Content data={data} onAction={handleAction} />;
};

// ViewModel - Toda lógica e estado
export const useMyViewModel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAction = () => { /* lógica */ };

  return { data, loading, handleAction };
};
```

### 3. Componentes Reutilizáveis

Componentes em `ui/components/` devem ser:
- **Puros**: Sem efeitos colaterais
- **Configuráveis**: Recebem dados via props
- **Independentes**: Não conhecem o contexto de negócio

## Integrações Externas

### Firebase

Serviços integrados (via plugins no `app.config.ts`):
- **Authentication** - Autenticação de usuários
- **Analytics** - Métricas de uso
- **Crashlytics** - Relatórios de crash
- **Messaging** - Push notifications
- **App Check** - Proteção contra abusos
- **Remote Config** - Configurações remotas

### Sentry

Monitoramento de erros e performance:
- Mobile Replay (gravação de sessões)
- Feedback Integration
- React Navigation Integration
- Performance Tracing

## Camadas Futuras (A Implementar)

### Domain Layer (`src/domain/`)

```
domain/
├── entities/       # Modelos de negócio puros
├── repositories/   # Interfaces de repositórios
└── useCases/       # Casos de uso da aplicação
```

### Data Layer (`src/data/`)

```
data/
├── dtos/           # Data Transfer Objects (API)
├── mappers/        # Conversores DTO ↔ Entity
└── repositories/   # Implementação dos repositórios
```

## Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Componente | PascalCase | `Avatar.component.tsx` |
| Hook | camelCase com `use` | `useTheme.ts` |
| Interface | PascalCase com `I` opcional | `HttpClient`, `IStorage` |
| Constante | SCREAMING_SNAKE_CASE ou camelCase | `menuOptions` |
| Estilo | camelCase com `create` | `createHomeStyles` |
| View | PascalCase com `.view` | `Home.view.tsx` |
| ViewModel | camelCase com `.viewModel` | `Home.viewModel.ts` |

## Aliases de Importação

Configurados no `tsconfig.json`:

```typescript
@/*           → src/*
@app/*        → src/app/*
@components/* → src/ui/components/*
@hooks/*      → src/ui/hooks/*
@screens/*    → src/ui/screens/*
@themes/*     → src/ui/themes/*
```

## Diagrama de Dependências

```
                    ┌─────────────────┐
                    │      App        │
                    │   (Expo Router) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │       UI        │
                    │ (screens, etc)  │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐
       │  Domain   │  │   Types   │  │   Core    │
       │ [futuro]  │  │           │  │interfaces │
       └─────┬─────┘  └───────────┘  └─────┬─────┘
             │                             │
             ▼                             ▼
       ┌───────────┐               ┌───────────┐
       │   Data    │ ───────────►  │   Infra   │
       │ [futuro]  │               │ (modules) │
       └───────────┘               └───────────┘
```

**Regras de dependência:**
- `UI` → pode depender de `Core`, `Types`, `Infra`
- `Domain` → NÃO pode depender de nada externo
- `Data` → pode depender de `Domain`, `Core`, `Infra`
- `Infra` → implementa interfaces de `Core`
