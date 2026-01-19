# Gerenciamento de Estado com Zustand

Este documento explica como usar o Zustand para gerenciar o estado das listas no **Faça a Lista**.

## 📚 Sumário

1. [Por que Zustand?](#por-que-zustand)
2. [Arquitetura](#arquitetura)
3. [Store de Listas](#store-de-listas)
4. [Usando no ViewModel](#usando-no-viewmodel)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Patterns e Boas Práticas](#patterns-e-boas-práticas)
7. [DevTools](#devtools)

---

## Por que Zustand?

### Comparação com Outras Soluções

| Feature | Zustand | Context API | Redux | TanStack Query |
|---------|---------|-------------|-------|----------------|
| Tamanho | ~1KB | Nativo | ~11KB | ~13KB |
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Curva de aprendizado | Fácil | Fácil | Difícil | Médio |
| Type Safety | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DevTools | ✅ | ❌ | ✅ | ✅ |
| Imutabilidade | Immer | Manual | Manual | Automático |

### Vantagens do Zustand

- ✅ **Minimalista**: Apenas 1KB gzipped
- ✅ **Performático**: Re-renders otimizados com selectors
- ✅ **Type-safe**: TypeScript nativo
- ✅ **Immer Integration**: Updates imutáveis automáticos
- ✅ **DevTools**: Integração com Redux DevTools
- ✅ **Simples**: API intuitiva, sem boilerplate

---

## Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                      VIEW LAYER                     │
│                                                     │
│  Lists.view.tsx                                     │
│  └─ useListsPage() ViewModel                        │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                   ZUSTAND STORE                     │
│                                                     │
│  src/stores/lists.store.ts                          │
│  ├─ State (lists, loading, error)                   │
│  ├─ Actions (loadLists, createList, etc)            │
│  └─ Selectors (useActiveLists, usePendingProducts)  │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                    REPOSITORY                       │
│                                                     │
│  src/db/repositories/lists.repository.ts            │
│  └─ Drizzle ORM Queries                             │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│                     DATABASE                        │
│                                                     │
│  Expo SQLite + Drizzle                              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Store de Listas

### Estrutura do Store

```typescript
// src/stores/lists.store.ts

interface ListsState {
  // Data
  lists: ListItem[];
  currentList: ListItem | null;
  currentProducts: ListProduct[];

  // UI State
  loadingState: 'idle' | 'loading' | 'refreshing' | 'error';
  error: string | null;

  // Computed
  activeLists: () => ListItem[];
  pendingProducts: () => ListProduct[];
}

interface ListsActions {
  // CRUD
  loadLists: (userId: string) => Promise<void>;
  createList: (data) => Promise<ListItem>;
  updateList: (id, data) => Promise<void>;
  deleteList: (id) => Promise<void>;

  // Products
  addProduct: (listId, productId, quantity) => Promise<void>;
  togglePurchased: (listId, productId) => Promise<void>;

  // UI
  refresh: (userId: string) => Promise<void>;
  clearError: () => void;
}
```

### Features do Store

#### 1. **Optimistic Updates**

```typescript
deleteList: async (id) => {
  // 1. Atualiza UI imediatamente
  const previousLists = get().lists;
  set((state) => {
    state.lists = state.lists.filter(l => l.id !== id);
  });

  try {
    // 2. Confirma no backend
    await listsRepository.delete(id);
  } catch (error) {
    // 3. Reverte em caso de erro
    set({ lists: previousLists });
  }
}
```

#### 2. **Immer Middleware**

Updates imutáveis automáticos:

```typescript
// Com Immer
set((state) => {
  state.lists.push(newList); // Modifica diretamente!
});

// Sem Immer (seria necessário)
set({
  lists: [...state.lists, newList]
});
```

#### 3. **Selectors Otimizados**

```typescript
// Hook que só re-renderiza quando lists mudam
export const useLists = () =>
  useListsStore((state) => state.lists);

// Hook computado
export const useActiveLists = () =>
  useListsStore((state) => state.activeLists());
```

---

## Usando no ViewModel

### Exemplo Completo

```typescript
// src/ui/screens/Lists/Lists.viewModel.ts

export function useLists(userId: string) {
  // Selectors (só re-renderiza se mudar)
  const lists = useActiveLists();
  const loadingState = useListsLoading();
  const actions = useListsActions();

  // Carrega ao montar
  useEffect(() => {
    actions.loadLists(userId);
  }, [userId]);

  // Computed values locais
  const isLoading = loadingState === 'loading';

  // Ações com userId pré-injetado
  const createList = (name, description) =>
    actions.createList({ name, description, createdBy: userId });

  return {
    lists,
    isLoading,
    createList,
    deleteList: actions.deleteList,
    refresh: () => actions.refresh(userId),
  };
}
```

### Na View

```tsx
// src/ui/screens/Lists/Lists.view.tsx

export const ListsView = () => {
  const { userId } = useAuth();
  const viewModel = useLists(userId);

  if (viewModel.isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={viewModel.lists}
      renderItem={({ item }) => (
        <ListCard
          list={item}
          onDelete={() => viewModel.deleteList(item.id)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={viewModel.isLoading}
          onRefresh={viewModel.refresh}
        />
      }
    />
  );
};
```

---

## Exemplos Práticos

### 1. Criar Lista

```tsx
const CreateListScreen = () => {
  const { createList } = useListsActions();
  const router = useRouter();

  const handleSubmit = async (name: string, description: string) => {
    try {
      const newList = await createList({
        name,
        description,
        createdBy: userId,
      });

      // Navega para a lista criada
      router.push(`/lists/${newList.id}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar a lista');
    }
  };

  return <CreateListForm onSubmit={handleSubmit} />;
};
```

### 2. Adicionar Produto à Lista

```tsx
const ListDetailScreen = ({ listId }: { listId: string }) => {
  const { currentProducts, addProduct } = useListsStore();
  const pendingProducts = usePendingProducts();

  const handleAddProduct = async (productId: string, quantity: number) => {
    try {
      await addProduct(listId, productId, quantity);
      Alert.alert('Sucesso', 'Produto adicionado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar o produto');
    }
  };

  return (
    <FlatList
      data={pendingProducts}
      renderItem={({ item }) => (
        <ProductItem product={item} />
      )}
    />
  );
};
```

### 3. Marcar como Comprado

```tsx
const ProductItem = ({ listId, product }: Props) => {
  const { togglePurchased } = useListsActions();

  const handleToggle = async () => {
    await togglePurchased(listId, product.id);
  };

  return (
    <Pressable onPress={handleToggle}>
      <Checkbox checked={product.isPurchased} />
      <Text>{product.name}</Text>
    </Pressable>
  );
};
```

### 4. Pull-to-Refresh

```tsx
const ListsView = () => {
  const { userId } = useAuth();
  const lists = useLists();
  const loadingState = useListsLoading();
  const { refresh } = useListsActions();

  return (
    <FlatList
      data={lists}
      refreshControl={
        <RefreshControl
          refreshing={loadingState === 'refreshing'}
          onRefresh={() => refresh(userId)}
        />
      }
    />
  );
};
```

### 5. Estados de Loading

```tsx
const ListsView = () => {
  const loadingState = useListsLoading();
  const error = useListsStore((state) => state.error);

  if (loadingState === 'loading') {
    return <Loading />;
  }

  if (loadingState === 'error' && error) {
    return <ErrorMessage message={error} />;
  }

  return <ListsContent />;
};
```

---

## Patterns e Boas Práticas

### 1. Usar Selectors Específicos

```typescript
// ❌ ERRADO - Re-renderiza sempre que qualquer coisa mudar
const store = useListsStore();

// ✅ CORRETO - Re-renderiza apenas quando lists mudar
const lists = useLists();
```

### 2. Criar Selectors Customizados

```typescript
// Hook para pegar apenas uma lista específica
export const useListById = (id: string) =>
  useListsStore((state) =>
    state.lists.find((list) => list.id === id)
  );

// Uso
const list = useListById(listId);
```

### 3. Combinar Múltiplos Selectors

```typescript
// ❌ ERRADO - Múltiplas subscrições
const lists = useLists();
const loading = useListsLoading();
const error = useListsStore((state) => state.error);

// ✅ CORRETO - Uma única subscrição
const { lists, loading, error } = useListsStore((state) => ({
  lists: state.lists,
  loading: state.loadingState,
  error: state.error,
}));
```

### 4. Evitar Lógica no Store

```typescript
// ❌ ERRADO - Lógica de UI no store
createList: async (data) => {
  const list = await listsRepository.create(data);
  router.push(`/lists/${list.id}`); // Navegação no store!
  return list;
}

// ✅ CORRETO - Lógica de UI no ViewModel/View
const handleCreate = async (name, description) => {
  const list = await createList({ name, description, createdBy: userId });
  router.push(`/lists/${list.id}`); // Navegação na View
};
```

### 5. Resetar Store no Logout

```typescript
const { reset } = useListsStore();

const handleLogout = () => {
  reset(); // Limpa todo o estado
  router.replace('/login');
};
```

---

## DevTools

### Configurar Redux DevTools

```typescript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useListsStore = create<ListsStore>()(
  devtools(
    immer((set, get) => ({
      // ... store implementation
    })),
    { name: 'ListsStore' } // Nome no DevTools
  )
);
```

### Usar DevTools

1. Instalar [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
2. Abrir DevTools no navegador
3. Ver todas as ações e estado em tempo real

### Time Travel Debugging

- Voltar no tempo para estados anteriores
- Ver diff de cada ação
- Replay de ações

---

## Performance

### Benchmark de Re-renders

```typescript
// Context API: Re-renderiza TODOS os consumidores
const { lists, loading, createList } = useListsContext();

// Zustand: Re-renderiza APENAS quando lists mudar
const lists = useLists();
const loading = useListsLoading();
const { createList } = useListsActions();
```

### Memoização Automática

Zustand já faz shallow equality check:

```typescript
// Não precisa de useMemo/useCallback!
const lists = useLists(); // Só atualiza se array mudar
```

---

## Testes

### Testar o Store

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useListsStore } from '@/stores/lists.store';

describe('ListsStore', () => {
  beforeEach(() => {
    useListsStore.getState().reset();
  });

  it('should load lists', async () => {
    const { result } = renderHook(() => useListsStore());

    await act(async () => {
      await result.current.loadLists('user-123');
    });

    expect(result.current.lists).toHaveLength(3);
  });

  it('should delete list optimistically', async () => {
    const { result } = renderHook(() => useListsStore());

    await act(async () => {
      await result.current.deleteList('list-1');
    });

    // Lista removida imediatamente
    expect(result.current.lists).not.toContainEqual(
      expect.objectContaining({ id: 'list-1' })
    );
  });
});
```

---

## Referências

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand + TypeScript](https://docs.pmnd.rs/zustand/guides/typescript)
- [Zustand + Immer](https://docs.pmnd.rs/zustand/integrations/immer-middleware)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
