# Lists Use Cases

Use cases implementados para operações com listas seguindo Clean Architecture.

## Use Cases Disponíveis

### Operações de Lista

#### CreateListUseCase
Cria uma nova lista com validações de negócio.

**Validações:**
- Nome: obrigatório, 3-100 caracteres
- Descrição: obrigatória, 3-500 caracteres
- CreatedBy: obrigatório

**Exemplo:**
```typescript
import { CreateListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new CreateListUseCase(listsRepository);

const list = await useCase.execute({
  name: "Lista de Compras",
  description: "Compras do mês",
  createdBy: "24",
  isPublic: false,
  canBeShared: true,
});
```

#### GetUserListsUseCase
Busca todas as listas ativas de um usuário com contagem de produtos.

**Exemplo:**
```typescript
import { GetUserListsUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new GetUserListsUseCase(listsRepository);
const lists = await useCase.execute("24");
```

#### GetListByIdUseCase
Busca uma lista específica por ID.

**Exemplo:**
```typescript
import { GetListByIdUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new GetListByIdUseCase(listsRepository);

try {
  const list = await useCase.execute("list-id-123");
} catch (error) {
  if (error instanceof ListNotFoundError) {
    console.log("Lista não encontrada");
  }
}
```

#### UpdateListUseCase
Atualiza nome, descrição ou status de ativação de uma lista.

**Exemplo:**
```typescript
import { UpdateListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new UpdateListUseCase(listsRepository);

await useCase.execute("list-id-123", {
  name: "Novo Nome",
  description: "Nova descrição",
  isActive: true,
});
```

#### DeleteListUseCase
Deleta uma lista (soft delete).

**Exemplo:**
```typescript
import { DeleteListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new DeleteListUseCase(listsRepository);
await useCase.execute("list-id-123");
```

#### IncrementListUsageUseCase
Incrementa o contador de reutilizações de uma lista.

**Exemplo:**
```typescript
import { IncrementListUsageUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new IncrementListUsageUseCase(listsRepository);
await useCase.execute("list-id-123");
```

### Operações de Produtos na Lista

#### AddProductToListUseCase
Adiciona um produto à lista.

**Validações:**
- Quantidade: deve ser inteiro positivo

**Exemplo:**
```typescript
import { AddProductToListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new AddProductToListUseCase(listsRepository);
await useCase.execute("list-id-123", "product-id-456", 5);
```

#### RemoveProductFromListUseCase
Remove um produto da lista (soft delete).

**Exemplo:**
```typescript
import { RemoveProductFromListUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new RemoveProductFromListUseCase(listsRepository);
await useCase.execute("list-id-123", "product-id-456");
```

#### UpdateProductQuantityUseCase
Atualiza a quantidade de um produto na lista.

**Validações:**
- Quantidade: deve ser inteiro positivo

**Exemplo:**
```typescript
import { UpdateProductQuantityUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new UpdateProductQuantityUseCase(listsRepository);
await useCase.execute("list-id-123", "product-id-456", 10);
```

#### MarkProductAsPurchasedUseCase
Marca um produto como comprado.

**Exemplo:**
```typescript
import { MarkProductAsPurchasedUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new MarkProductAsPurchasedUseCase(listsRepository);
await useCase.execute("list-id-123", "product-id-456");
```

#### GetListProductsUseCase
Busca todos os produtos de uma lista.

**Exemplo:**
```typescript
import { GetListProductsUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new GetListProductsUseCase(listsRepository);
const products = await useCase.execute("list-id-123");
```

#### GetPendingProductsUseCase
Busca apenas produtos não comprados de uma lista.

**Exemplo:**
```typescript
import { GetPendingProductsUseCase } from "@/core/useCases";
import { listsRepository } from "@/data/repositories";

const useCase = new GetPendingProductsUseCase(listsRepository);
const pendingProducts = await useCase.execute("list-id-123");
```

## Tratamento de Erros

Todos os use cases podem lançar erros de validação específicos:

```typescript
import {
  CreateListUseCase,
  CreateListValidationError,
} from "@/core/useCases";

try {
  await createListUseCase.execute({ ... });
} catch (error) {
  if (error instanceof CreateListValidationError) {
    console.error("Erro de validação:", error.message);
  }
}
```

## Uso em View Models

**Exemplo completo em um View Model:**

```typescript
import { useState } from "react";
import {
  CreateListUseCase,
  GetUserListsUseCase,
  AddProductToListUseCase,
} from "@/core/useCases";
import { listsRepository } from "@/data/repositories";
import type { ListWithProductCount } from "@/core/interfaces/repositories";

export function useListsViewModel() {
  const [lists, setLists] = useState<ListWithProductCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createListUseCase = new CreateListUseCase(listsRepository);
  const getUserListsUseCase = new GetUserListsUseCase(listsRepository);
  const addProductUseCase = new AddProductToListUseCase(listsRepository);

  const loadUserLists = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getUserListsUseCase.execute(userId);
      setLists(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const createList = async (name: string, description: string) => {
    try {
      setLoading(true);
      setError(null);
      await createListUseCase.execute({
        name,
        description,
        createdBy: "24",
        isPublic: false,
        canBeShared: false,
      });
      await loadUserLists("24");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (
    listId: string,
    productId: string,
    quantity: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      await addProductUseCase.execute(listId, productId, quantity);
      await loadUserLists("24");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  return {
    lists,
    loading,
    error,
    loadUserLists,
    createList,
    addProduct,
  };
}
```

## Testes

**Exemplo de teste unitário com mock:**

```typescript
import { describe, it, expect, vi } from "vitest";
import { CreateListUseCase, CreateListValidationError } from "./CreateList";
import type { ListsRepository } from "@/core/interfaces/repositories";

describe("CreateListUseCase", () => {
  it("should create a list with valid data", async () => {
    const mockRepository: ListsRepository = {
      create: vi.fn().mockResolvedValue({
        id: "list-123",
        name: "Test List",
        description: "Test Description",
        createdBy: "24",
      }),
    } as any;

    const useCase = new CreateListUseCase(mockRepository);
    const result = await useCase.execute({
      name: "Test List",
      description: "Test Description",
      createdBy: "24",
    });

    expect(result.name).toBe("Test List");
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it("should throw error for invalid name", async () => {
    const mockRepository = {} as ListsRepository;
    const useCase = new CreateListUseCase(mockRepository);

    await expect(
      useCase.execute({
        name: "ab",
        description: "Valid description",
        createdBy: "24",
      })
    ).rejects.toThrow(CreateListValidationError);
  });
});
```
