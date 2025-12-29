# Mocks de Banco de Dados para Testes

## Visão Geral

Este guia explica como testar componentes React Native e ViewModels que dependem do banco de dados SQLite sem precisar de uma conexão real.

## Problema

O Expo SQLite (`expo-sqlite`) não pode rodar no ambiente Jest/Node.js porque ele requer APIs nativas mobile:

```
TypeError: _ExpoSQLite.default.NativeDatabase is not a constructor
```

## Solução: Mocks Globais

### 1. Mock do expo-sqlite no test-setup.ts

Localizado em `config/test-setup.ts`:

```typescript
jest.mock("expo-sqlite", () => {
  const mockDatabase = {
    // Métodos que podem ser chamados pelo Drizzle/Expo SQLite
    execAsync: jest.fn().mockResolvedValue({ rows: [] }),
    runAsync: jest.fn().mockResolvedValue({ changes: 1, lastInsertRowId: 1 }),
    getFirstAsync: jest.fn().mockResolvedValue(null),
    getAllAsync: jest.fn().mockResolvedValue([]),
    withTransactionAsync: jest.fn((callback: any) => callback()),
    closeAsync: jest.fn().mockResolvedValue(undefined),
    deleteAsync: jest.fn().mockResolvedValue(undefined),
  };

  return {
    openDatabaseSync: jest.fn(() => mockDatabase),
    openDatabaseAsync: jest.fn().mockResolvedValue(mockDatabase),
  };
});
```

### 2. Mock do drizzle-orm no test-setup.ts

```typescript
jest.mock("drizzle-orm/expo-sqlite", () => {
  const mockDb = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([]),
    execute: jest.fn().mockResolvedValue([]),
    query: {},
  };

  return {
    drizzle: jest.fn(() => mockDb),
  };
});
```

## Testando Repositories

### Opção A: Mockar o Repository (Recomendado)

Ao invés de testar integração com banco de dados, mocke a implementação do repository:

```typescript
// src/ui/screens/Lists/__tests__/Lists.spec.tsx
import { ListsRepository } from "@/data/repositories/ListsRepository";

jest.mock("@/data/repositories/ListsRepository");

describe("Lists View", () => {
  beforeEach(() => {
    const repository = ListsRepository as jest.Mock;
    repository.mockClear();

    // Mocka métodos do repository
    repository.prototype.getUserLists = jest.fn().mockResolvedValue([
      { id: "1", name: "Test List", productCount: 5 }
    ]);
  });

  it("should render the list collection", () => {
    const ui = render(<ListsView />);
    expect(ui.getByTestId("list-collection")).toBeTruthy();
  });
});
```

### Opção B: Usar o Repository Real com Banco Mockado

Se você quiser testar a implementação do repository:

```typescript
import { ListsRepository } from "@/data/repositories/ListsRepository";

describe("ListsRepository Integration", () => {
  let repository: ListsRepository;

  beforeEach(() => {
    // Banco já está mockado globalmente no test-setup.ts
    repository = new ListsRepository();
  });

  it("should create a list", async () => {
    // Isso vai usar o banco mockado
    const result = await repository.create({
      name: "Test List",
      createdBy: "user-123"
    });

    // Verifica o resultado
    expect(result).toBeDefined();
  });
});
```

## Armadilhas Comuns

### 1. Loop Infinito no useEffect

**Problema:**
```typescript
// ❌ RUIM: Cria nova instância a cada render
const useCase = new GetListsUseCase(repository);

const loadLists = useCallback(
  async () => { /* ... */ },
  [useCase] // ← Muda a cada render!
);

useEffect(() => {
  loadLists();
}, [loadLists]); // ← Loop infinito!
```

**Solução:**
```typescript
// ✅ BOM: Memoiza instâncias de use cases
const useCase = useMemo(
  () => new GetListsUseCase(repository),
  []
);

const loadLists = useCallback(
  async () => { /* ... */ },
  [useCase] // ← Referência estável
);

useEffect(() => {
  loadLists();
}, [loadLists]); // ← Executa apenas uma vez
```

### 2. Avisos de act()

**Problema:**
```
Warning: An update to Component inside a test was not wrapped in act(...)
```

**Solução:**
Use `waitFor` da Testing Library:

```typescript
import { render, waitFor } from "@testing-library/react-native";

it("should load lists", async () => {
  const ui = render(<ListsView />);

  await waitFor(() => {
    expect(ui.getByText("Test List")).toBeTruthy();
  });
});
```

## Estratégia de Testes por Camada

### Camada UI (Componentes/Views)
- Mockar ViewModels ou repositories
- Focar em renderização e interações do usuário
- Usar `@testing-library/react-native`

### Camada de Domínio (Use Cases)
- Mockar interfaces de repositories
- Testar lógica de negócio isoladamente
- Não precisa de mocks de banco de dados

### Camada de Dados (Repositories)
- Usar mocks globais de banco (já configurados)
- Testar implementações de repositories
- Ou usar testes de integração com banco real

## Exemplo: Teste Completo

```typescript
// src/ui/screens/Lists/__tests__/Lists.integration.spec.tsx
import { render, waitFor, fireEvent } from "#test-utils";
import { ListsRepository } from "@/data/repositories/ListsRepository";
import { ListsView } from "../Lists.view";

// Repository usa banco mockado do test-setup.ts
jest.mock("@/data/repositories/ListsRepository");

describe("Lists View Integration", () => {
  beforeEach(() => {
    const repository = ListsRepository as jest.Mock;
    repository.mockClear();

    repository.prototype.getUserLists = jest.fn().mockResolvedValue([
      { id: "1", name: "Grocery List", productCount: 5 },
      { id: "2", name: "Todo List", productCount: 3 }
    ]);
  });

  it("should render lists after loading", async () => {
    const ui = render(<ListsView />);

    // Aguarda carregamento assíncrono
    await waitFor(() => {
      expect(ui.getByText("Grocery List")).toBeTruthy();
      expect(ui.getByText("Todo List")).toBeTruthy();
    });
  });

  it("should navigate to list details on press", async () => {
    const ui = render(<ListsView />);

    await waitFor(() => {
      const listItem = ui.getByText("Grocery List");
      fireEvent.press(listItem);
    });

    // Verifica que a navegação ocorreu
    expect(mockRouter.push).toHaveBeenCalledWith("/lists/1");
  });
});
```

## Executando os Testes

```bash
# Rodar todos os testes
bun run test

# Rodar arquivo de teste específico
bunx jest src/ui/screens/Lists/__tests__/Lists.spec.tsx

# Rodar com coverage
bunx jest --coverage

# Rodar em modo watch
bunx jest --watch
```

## Arquivos Relacionados

- **Mocks Globais**: `config/test-setup.ts`
- **Utilitários de Teste**: `config/test-utils.tsx`
- **Configuração Jest**: `jest.config.js`
- **Cliente do Banco**: `src/db/client.ts`
- **Guia Repository Pattern**: `docs/repository-pattern.md`

## Referências

- [Testing Library - React Native](https://callstack.github.io/react-native-testing-library/)
- [Jest - Manual Mocks](https://jestjs.io/docs/manual-mocks)
- [React - Test Recipes](https://react.dev/reference/react/act)
