# Repository Pattern - Faça a Lista

Este documento explica como o **Repository Pattern** está implementado no projeto seguindo **Clean Architecture**.

## O que é um Repository?

Um **Repository** é um padrão de design que abstrai o acesso a dados. Ele funciona como uma camada intermediária entre a lógica de negócio (use cases) e a fonte de dados (banco de dados, APIs, etc.).

### Por que usar Repository Pattern?

1. **Separação de responsabilidades**: Lógica de negócio não sabe COMO os dados são armazenados
2. **Testabilidade**: Fácil criar mocks/stubs para testes unitários
3. **Flexibilidade**: Trocar banco de dados sem alterar lógica de negócio
4. **Dependency Inversion**: Use cases dependem de abstrações, não de implementações concretas

## Estrutura no Projeto

```
src/
├── core/                                    # Domain Layer
│   └── interfaces/
│       └── repositories/
│           └── IListsRepository.ts          # ← Interface (contrato)
│
├── data/                                    # Data Layer
│   └── repositories/
│       └── ListsRepository.ts               # ← Implementation (Drizzle)
│
└── db/                                      # Database Infrastructure
    ├── schemas/                             # Drizzle table schemas
    ├── client.ts                            # Database connection
    └── utils/                               # DB utilities
```

### Camadas e Responsabilidades

| Camada | O que contém | Exemplo |
|--------|--------------|---------|
| **core/interfaces/repositories/** | Contratos (interfaces) | `IListsRepository` - define métodos |
| **data/repositories/** | Implementações concretas | `ListsRepository` - usa Drizzle ORM |
| **db/** | Infraestrutura do banco | Schemas, migrations, client |

## Exemplo Prático: Lists Repository

### 1. Interface (Contrato)

```typescript
// src/core/interfaces/repositories/IListsRepository.ts
export interface IListsRepository {
  create(data: CreateListDTO): Promise<List>;
  findById(listId: string): Promise<List | null>;
  findByUser(userId: string): Promise<ListWithProductCount[]>;
  update(listId: string, data: UpdateListDTO): Promise<void>;
  delete(listId: string): Promise<void>;
  // ... outros métodos
}
```

**O que define:**
- QUAIS operações existem
- QUAIS parâmetros aceitam
- QUAIS tipos retornam

**O que NÃO define:**
- COMO são implementadas (Drizzle? Prisma? REST API?)
- ONDE os dados são armazenados (SQLite? PostgreSQL? MongoDB?)

### 2. Implementação (Drizzle ORM)

```typescript
// src/data/repositories/ListsRepository.ts
import type { IListsRepository } from "@/core/interfaces/repositories";

export class ListsRepository implements IListsRepository {
  async create(data: CreateListDTO): Promise<List> {
    const newList = {
      id: generateUuid(),
      ...data,
      usedTimes: 0,
      isActive: true,
    };

    await db.insert(listsTable).values(newList);
    return newList as List;
  }

  async findById(listId: string): Promise<List | null> {
    const result = await db.query.listsTable.findFirst({
      where: and(
        eq(listsTable.id, listId),
        isNull(listsTable.deletedAt)
      ),
    });

    return result ?? null;
  }

  // ... outras implementações
}
```

**O que faz:**
- COMO criar uma lista (usando Drizzle ORM)
- COMO buscar do banco (queries específicas)
- COMO lidar com soft delete
- COMO gerar UUIDs

### 3. Use Case (Lógica de Negócio)

```typescript
// src/core/useCases/CreateList.ts
import type { IListsRepository } from "@/core/interfaces/repositories";

export class CreateListUseCase {
  constructor(
    private listsRepository: IListsRepository  // ← Interface, não implementação!
  ) {}

  async execute(data: CreateListDTO): Promise<List> {
    // Validações de negócio
    if (!data.name || data.name.length < 3) {
      throw new Error("Nome deve ter ao menos 3 caracteres");
    }

    // Delega persistência ao repository
    return this.listsRepository.create(data);
  }
}
```

**Dependency Inversion:**
- Use case depende da **interface** `IListsRepository`
- Não conhece `ListsRepository` (implementação concreta)
- Não importa Drizzle, SQLite ou qualquer lib externa

### 4. View Model (UI)

```typescript
// src/ui/screens/Lists/Lists.viewModel.ts
import { ListsRepository } from "@/data/repositories";
import { CreateListUseCase } from "@/core/useCases";

export function useLists() {
  // Dependency Injection manual
  const repository = new ListsRepository();
  const createListUseCase = new CreateListUseCase(repository);

  const createList = async (data: CreateListDTO) => {
    try {
      const list = await createListUseCase.execute(data);
      // Atualizar UI...
    } catch (error) {
      // Tratar erro...
    }
  };

  return { createList };
}
```

## Fluxo de Dados Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                         UI Layer                                │
│  Lists.view.tsx  →  Lists.viewModel.ts                         │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Chama use case
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Domain Layer                               │
│  CreateListUseCase (depende de IListsRepository interface)     │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Interface call
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                │
│  ListsRepository (implementa IListsRepository)                 │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Uses Drizzle ORM
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Infrastructure Layer                          │
│  db/client.ts  →  db/schemas/  →  SQLite Database              │
└─────────────────────────────────────────────────────────────────┘
```

## Benefícios Práticos

### 1. Trocar Banco de Dados

**Sem Repository Pattern:**
```typescript
// Use case acoplado ao Drizzle
async execute(data: CreateListDTO) {
  await db.insert(listsTable).values(data); // ❌ Acoplamento direto
}
```

**Com Repository Pattern:**
```typescript
// Use case depende da interface
async execute(data: CreateListDTO) {
  return this.repository.create(data); // ✅ Desacoplado
}

// Criar nova implementação para PostgreSQL
export class PostgresListsRepository implements IListsRepository {
  async create(data: CreateListDTO) {
    // Usar Prisma ao invés de Drizzle
    return prisma.list.create({ data });
  }
}
```

### 2. Testes Unitários

```typescript
// Mock do repository para testes
class MockListsRepository implements IListsRepository {
  async create(data: CreateListDTO): Promise<List> {
    return { id: "mock-id", ...data };
  }

  async findById(id: string): Promise<List | null> {
    return { id, name: "Mock List" };
  }
}

// Teste do use case SEM banco de dados
describe("CreateListUseCase", () => {
  it("should create a list", async () => {
    const mockRepo = new MockListsRepository();
    const useCase = new CreateListUseCase(mockRepo);

    const result = await useCase.execute({
      name: "Test List",
      createdBy: "user-123",
    });

    expect(result.id).toBe("mock-id");
  });
});
```

### 3. Cache Layer

```typescript
// Repository com cache (Redis + SQLite)
export class CachedListsRepository implements IListsRepository {
  constructor(
    private drizzleRepo: ListsRepository,
    private cache: RedisClient
  ) {}

  async findById(listId: string): Promise<List | null> {
    // Tenta cache primeiro
    const cached = await this.cache.get(`list:${listId}`);
    if (cached) return JSON.parse(cached);

    // Se não tem cache, busca do banco
    const list = await this.drizzleRepo.findById(listId);

    // Salva no cache
    if (list) {
      await this.cache.set(`list:${listId}`, JSON.stringify(list));
    }

    return list;
  }
}
```

## Regras de Ouro

1. **Use cases NUNCA importam implementações concretas** (`ListsRepository`)
   - Sempre dependem da interface (`IListsRepository`)

2. **Repositories NÃO contêm lógica de negócio**
   - Apenas CRUD e queries otimizadas
   - Validações de negócio ficam nos use cases

3. **db/ contém APENAS infraestrutura**
   - Schemas (estrutura das tabelas)
   - Migrations (versionamento do schema)
   - Database client (conexão)
   - Utilities específicas do DB

4. **data/ contém implementações de repositórios**
   - Conversão entre domínio e infraestrutura
   - Queries específicas da tecnologia (Drizzle, Prisma, etc.)

## Como Adicionar um Novo Repository

### 1. Criar Interface

```bash
# Criar arquivo
touch src/core/interfaces/repositories/IProductsRepository.ts
```

```typescript
// src/core/interfaces/repositories/IProductsRepository.ts
export interface IProductsRepository {
  create(data: CreateProductDTO): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  // ... outros métodos
}
```

### 2. Exportar Interface

```typescript
// src/core/interfaces/repositories/index.ts
export * from "./IListsRepository";
export * from "./IProductsRepository"; // ← adicionar
```

### 3. Criar Implementação

```bash
# Criar arquivo
touch src/data/repositories/ProductsRepository.ts
```

```typescript
// src/data/repositories/ProductsRepository.ts
import type { IProductsRepository } from "@/core/interfaces/repositories";

export class ProductsRepository implements IProductsRepository {
  async create(data: CreateProductDTO): Promise<Product> {
    // Implementação com Drizzle
  }

  async findById(id: string): Promise<Product | null> {
    // Implementação com Drizzle
  }
}

export const productsRepository = new ProductsRepository();
```

### 4. Exportar Implementação

```typescript
// src/data/repositories/index.ts
export * from "./ListsRepository";
export * from "./ProductsRepository"; // ← adicionar
```

### 5. Usar em Use Cases

```typescript
// src/core/useCases/CreateProduct.ts
import type { IProductsRepository } from "@/core/interfaces/repositories";

export class CreateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: CreateProductDTO) {
    return this.productsRepository.create(data);
  }
}
```

## Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern - Martin Fowler](https://martinfowler.com/eaaCatalog/repository.html)
- [Dependency Inversion Principle (SOLID)](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
