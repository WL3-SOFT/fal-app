# Gerenciamento de Listas - Guia de Implementação

Este documento explica a implementação completa do sistema de gerenciamento de listas do **Faça a Lista**, seguindo a Clean Architecture com MVVM e Drizzle ORM.

## 📚 Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Schemas do Banco de Dados](#schemas-do-banco-de-dados)
4. [Repositories](#repositories)
5. [Gerenciamento de Estado (Zustand)](#gerenciamento-de-estado-zustand) ⭐ NOVO
6. [ViewModels (Camada de Apresentação)](#viewmodels-camada-de-apresentação)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Exemplos de Uso](#exemplos-de-uso)
9. [Padrões e Boas Práticas](#padrões-e-boas-práticas)

---

## Visão Geral

O sistema de gerenciamento de listas implementa:

- ✅ **CRUD completo** de listas de compras
- ✅ **Relacionamento N:M** entre listas e produtos
- ✅ **Soft Delete** em todas as operações
- ✅ **Type Safety** com TypeScript strict mode
- ✅ **Queries otimizadas** com Drizzle ORM
- ✅ **Clean Architecture** com inversão de dependência
- ✅ **MVVM** na camada de apresentação

### Stack Tecnológica

- **ORM**: Drizzle ORM 0.45.1
- **Database**: Expo SQLite (local)
- **Migrations**: Drizzle Kit 0.31.8
- **State Management**: Zustand 5.0.9 + Immer 11.1.0 ⭐ NOVO
- **Type Safety**: TypeScript 5.9.2

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        PRESENTATION                         │
│                                                             │
│  src/ui/screens/Lists/                                      │
│  ├── Lists.view.tsx          (UI pura)                      │
│  └── Lists.viewModel.ts      (Estado + Lógica)              │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA ACCESS LAYER                       │
│                                                             │
│  src/db/repositories/                                       │
│  └── lists.repository.ts     (Drizzle queries)              │
│                                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                             │
│                                                             │
│  src/db/schemas/                                            │
│  ├── list.schema.ts          (Tabela lists)                 │
│  ├── product.schema.ts       (Tabela products)              │
│  ├── list-product.schema.ts  (Junction N:M)                 │
│  └── index.ts                (Relacionamentos)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dependências

```
View → ViewModel → Repository → Drizzle ORM → SQLite
 ↓         ↓           ↓            ↓           ↓
 UI      Lógica    Queries      Type Safe    Dados
```

**Regra de Ouro**: Nunca importe bibliotecas externas (Drizzle) diretamente na View ou ViewModel!

---

## Schemas do Banco de Dados

### Estrutura de Arquivos

```
src/db/schemas/
├── account.schema.ts        # Contas de usuário
├── list.schema.ts           # Listas de compras ⭐
├── product.schema.ts        # Catálogo de produtos
├── list-product.schema.ts   # Relação N:M (junction) ⭐
├── price.schema.ts          # Histórico de preços
└── index.ts                 # Exporta tudo + relacionamentos
```

### Schema: `lists`

```typescript
// src/db/schemas/list.schema.ts

export const listsTable = sqliteTable("lists", {
  // Primary Key - UUID gerado pela aplicação
  id: text("id").primaryKey(),

  // Informações da lista
  name: text("name").notNull(),
  description: text("description").notNull(),

  // Contadores e flags
  usedTimes: integer("usedTimes").notNull().default(0),
  isActive: integer("isActive", { mode: "boolean" }).notNull().default(true),
  isPublic: integer("isPublic", { mode: "boolean" }).notNull().default(false),
  canBeShared: integer("canBeShared", { mode: "boolean" }).notNull().default(false),

  // Foreign Keys
  createdBy: text("createdBy").notNull(), // FK para accounts.id

  // Timestamps (Soft Delete Pattern)
  createdAt: text("createdAt").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updatedAt"),
  deletedAt: text("deletedAt"), // NULL = ativo
});
```

### Schema: `list_products` (Junction Table N:M)

```typescript
// src/db/schemas/list-product.schema.ts

export const listProductsTable = sqliteTable("list_products", {
  id: text("id").primaryKey(),

  // Foreign Keys
  listId: text("listId").notNull(),       // FK → lists.id
  productId: text("productId").notNull(), // FK → products.id

  // Informações específicas da lista
  quantity: real("quantity").notNull(),
  isPurchased: integer("isPurchased", { mode: "boolean" }).notNull().default(false),

  // Timestamps
  addedAt: text("addedAt").notNull().default(sql`(CURRENT_TIMESTAMP)`),
  purchasedAt: text("purchasedAt"),
  updatedAt: text("updatedAt"),
  removedAt: text("removedAt"), // Soft delete
});
```

### Relacionamentos (Drizzle Relations)

```typescript
// src/db/schemas/index.ts

export const listsRelations = relations(listsTable, ({ one, many }) => ({
  creator: one(accountsTable, {
    fields: [listsTable.createdBy],
    references: [accountsTable.id],
  }),
  listProducts: many(listProductsTable),
}));

export const listProductsRelations = relations(listProductsTable, ({ one }) => ({
  list: one(listsTable, {
    fields: [listProductsTable.listId],
    references: [listsTable.id],
  }),
  product: one(productsTable, {
    fields: [listProductsTable.productId],
    references: [productsTable.id],
  }),
}));
```

---

## Repositories

O Repository encapsula toda a lógica de acesso ao banco de dados.

### Estrutura

```typescript
// src/db/repositories/lists.repository.ts

export class ListsRepository {
  // CRUD Básico
  async create(data): Promise<List>
  async findById(id): Promise<List | null>
  async findByUser(userId): Promise<ListWithProductCount[]>
  async update(id, data): Promise<void>
  async delete(id): Promise<void>  // Soft delete

  // Gerenciamento de Produtos
  async addProduct(listId, productId, quantity): Promise<void>
  async removeProduct(listId, productId): Promise<void>
  async updateProductQuantity(listId, productId, quantity): Promise<void>
  async markProductAsPurchased(listId, productId): Promise<void>

  // Queries Especiais
  async getListProducts(listId): Promise<ListProductWithDetails[]>
  async getPendingProducts(listId): Promise<ListProductWithDetails[]>
  async incrementUsage(listId): Promise<void>
}
```

### Exemplo: Buscar Listas do Usuário

```typescript
async findByUser(userId: string): Promise<ListWithProductCount[]> {
  const result = await db
    .select({
      id: listsTable.id,
      name: listsTable.name,
      description: listsTable.description,
      usedTimes: listsTable.usedTimes,
      productCount: count(listProductsTable.id), // Agregação
    })
    .from(listsTable)
    .leftJoin(
      listProductsTable,
      and(
        eq(listsTable.id, listProductsTable.listId),
        isNull(listProductsTable.removedAt) // Soft delete
      )
    )
    .where(
      and(
        eq(listsTable.createdBy, userId),
        eq(listsTable.isActive, true),
        isNull(listsTable.deletedAt) // Soft delete
      )
    )
    .groupBy(listsTable.id)
    .orderBy(desc(listsTable.createdAt));

  return result;
}
```

**Padrão Soft Delete**: Todas as queries filtram `deletedAt IS NULL`.

### Exemplo: Adicionar Produto à Lista

```typescript
async addProduct(
  listId: string,
  productId: string,
  quantity: number
): Promise<void> {
  await db.insert(listProductsTable).values({
    id: generateUUID(),
    listId,
    productId,
    quantity,
    isPurchased: false,
  });
}
```

### Helpers Úteis

```typescript
// src/db/utils/uuid.ts
export function generateUUID(): string {
  return randomUUID();
}

// src/db/utils/soft-delete.ts
export const markAsDeleted = () => new Date().toISOString();
export const markAsUpdated = () => new Date().toISOString();
export const onlyActive = (field) => isNull(field);
```

---

## Gerenciamento de Estado (Zustand)

O Zustand foi escolhido para gerenciar o estado global da aplicação.

### Por que Zustand?

- ✅ **Minimalista**: Apenas 1KB gzipped
- ✅ **Performático**: Re-renders otimizados com selectors
- ✅ **Type-safe**: TypeScript nativo
- ✅ **Immer**: Updates imutáveis automáticos
- ✅ **DevTools**: Integração com Redux DevTools

### Estrutura do Store

```typescript
// src/stores/lists.store.ts

export const useListsStore = create<ListsStore>()(
  immer((set, get) => ({
    // Estado
    lists: [],
    currentList: null,
    currentProducts: [],
    loadingState: 'idle',
    error: null,

    // Ações
    loadLists: async (userId) => {
      set({ loadingState: 'loading' });
      const lists = await listsRepository.findByUser(userId);
      set({ lists, loadingState: 'idle' });
    },

    createList: async (data) => {
      const newList = await listsRepository.create(data);
      set((state) => {
        state.lists.unshift(newList); // Immer!
      });
      return newList;
    },

    deleteList: async (id) => {
      // Optimistic update
      const prev = get().lists;
      set((state) => {
        state.lists = state.lists.filter(l => l.id !== id);
      });
      try {
        await listsRepository.delete(id);
      } catch (error) {
        set({ lists: prev }); // Reverte
      }
    },
  }))
);
```

### Selectors Otimizados

```typescript
// Hooks específicos (evitam re-renders)
export const useLists = () =>
  useListsStore((state) => state.lists);

export const useActiveLists = () =>
  useListsStore((state) => state.activeLists());

export const useListsActions = () =>
  useListsStore((state) => ({
    loadLists: state.loadLists,
    createList: state.createList,
    deleteList: state.deleteList,
  }));
```

### Vantagens

1. **Estado Global Persistente**: Navegar entre telas não perde estado
2. **Optimistic Updates**: Implementados uma vez, funcionam em toda a app
3. **Performance**: Apenas componentes que usam dados alterados re-renderizam
4. **Testável**: Store pode ser testado isoladamente

📖 **Documentação Completa**: Ver [zustand-integration.md](./zustand-integration.md)

---

## ViewModels (Camada de Apresentação)

O ViewModel é um **React Hook** que gerencia estado e lógica de negócio.

### Estrutura do Hook

```typescript
// src/ui/screens/Lists/Lists.viewModel.ts

export function useListsViewModel(userId: string) {
  // Estado
  const [lists, setLists] = useState([]);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Carrega listas ao montar
  useEffect(() => {
    loadLists();
  }, [userId]);

  // Ações
  const loadLists = async () => {
    setState('loading');
    const result = await listsRepository.findByUser(userId);
    setLists(result);
    setState('idle');
  };

  const deleteList = async (id: string) => {
    // Optimistic update
    setLists(prev => prev.filter(l => l.id !== id));
    await listsRepository.delete(id);
  };

  return { lists, state, error, loadLists, deleteList };
}
```

### Padrões do ViewModel

1. **Optimistic Updates**: Remove da UI antes de confirmar no DB
2. **Estados de Loading**: `idle`, `loading`, `refreshing`, `error`
3. **Error Handling**: Captura todos os erros e exibe mensagens amigáveis
4. **useCallback**: Memoiza funções para evitar re-renders

---

## Fluxo de Dados

### 1. Criar Lista

```
User → View → ViewModel → Repository → Drizzle → SQLite
                                                     ↓
                                           INSERT INTO lists
                                                     ↓
                                              Retorna UUID
                                                     ↓
                                          Atualiza UI (setState)
```

```typescript
// View
<Button onPress={() => viewModel.createList('Mercado', 'Compras da semana')} />

// ViewModel
const createList = async (name, description) => {
  const newList = await listsRepository.create({ name, description, createdBy: userId });
  setLists(prev => [newList, ...prev]);
};

// Repository
async create(data) {
  const newList = { id: generateUUID(), ...data };
  await db.insert(listsTable).values(newList);
  return newList;
}
```

### 2. Adicionar Produto à Lista

```
User → View → ViewModel → Repository → Drizzle → SQLite
                                                     ↓
                                     INSERT INTO list_products
                                                     ↓
                                             Atualiza contagem
```

```typescript
// View
<AddProductButton onPress={() => viewModel.addProduct(productId, 2)} />

// ViewModel
const addProduct = async (productId, quantity) => {
  await listsRepository.addProduct(listId, productId, quantity);
  await refresh(); // Recarrega produtos
};

// Repository
async addProduct(listId, productId, quantity) {
  await db.insert(listProductsTable).values({
    id: generateUUID(),
    listId,
    productId,
    quantity,
  });
}
```

### 3. Marcar como Comprado

```
User → Checkbox → ViewModel → Repository → Drizzle → SQLite
                                                        ↓
                                UPDATE list_products SET isPurchased = true
```

---

## Exemplos de Uso

### Exemplo Completo: Tela de Listas

```tsx
// src/ui/screens/Lists/Lists.view.tsx

export const ListsView = () => {
  const { userId } = useAuth();
  const { theme } = useTheme();
  const { lists, state, error, refresh, deleteList } = useListsViewModel(userId);

  const styles = useMemo(() => createStyles(theme), [theme]);

  if (state === 'loading') {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListCard
            list={item}
            onPress={() => router.push(`/lists/${item.id}`)}
            onDelete={() => deleteList(item.id)}
          />
        )}
        ListEmptyComponent={<EmptyState />}
        refreshControl={
          <RefreshControl
            refreshing={state === 'refreshing'}
            onRefresh={refresh}
          />
        }
      />

      <FAB onPress={() => router.push('/lists/create')} />
    </SafeAreaView>
  );
};
```

### Exemplo: Card de Lista

```tsx
// src/ui/screens/Lists/components/ListCard.tsx

interface ListCardProps {
  list: {
    id: string;
    name: string;
    description: string;
    productCount: number;
    usedTimes: number;
  };
  onPress: () => void;
  onDelete: () => void;
}

export const ListCard = ({ list, onPress, onDelete }: ListCardProps) => {
  const { theme } = useTheme();

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{list.name}</Text>
        <IconButton icon="trash" onPress={onDelete} />
      </View>

      <Text style={styles.description}>{list.description}</Text>

      <View style={styles.footer}>
        <Badge icon="cart" count={list.productCount} />
        <Badge icon="repeat" count={list.usedTimes} />
      </View>
    </Pressable>
  );
};
```

### Exemplo: Detalhes da Lista com Produtos

```tsx
// src/ui/screens/Lists/Detail/ListDetail.view.tsx

export const ListDetailView = ({ listId }: { listId: string }) => {
  const { products, markAsPurchased } = useListDetailViewModel(listId);

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductItem
          product={item.product}
          quantity={item.quantity}
          isPurchased={item.isPurchased}
          onToggle={() => markAsPurchased(item.product.id)}
        />
      )}
    />
  );
};
```

---

## Padrões e Boas Práticas

### 1. Soft Delete Pattern

**SEMPRE** use soft delete em operações de exclusão:

```typescript
// ❌ ERRADO
await db.delete(listsTable).where(eq(listsTable.id, id));

// ✅ CORRETO
await db.update(listsTable)
  .set({ deletedAt: markAsDeleted() })
  .where(eq(listsTable.id, id));
```

**SEMPRE** filtre registros deletados nas queries:

```typescript
// ❌ ERRADO
const lists = await db.select().from(listsTable);

// ✅ CORRETO
const lists = await db.select()
  .from(listsTable)
  .where(isNull(listsTable.deletedAt));
```

### 2. Type Safety

Use tipos inferidos do Drizzle:

```typescript
// Inferir tipo de INSERT
type NewList = typeof listsTable.$inferInsert;

// Inferir tipo de SELECT
type List = typeof listsTable.$inferSelect;

// Nunca usar 'any'
const createList = async (data: NewList): Promise<List> => {
  // ...
};
```

### 3. Optimistic Updates

Atualize a UI imediatamente, reverta em caso de erro:

```typescript
const deleteList = async (id: string) => {
  const previous = lists;
  setLists(prev => prev.filter(l => l.id !== id));

  try {
    await listsRepository.delete(id);
  } catch (error) {
    setLists(previous); // Reverte
    showError('Erro ao deletar');
  }
};
```

### 4. Separação de Responsabilidades

```typescript
// ❌ ERRADO - Lógica na View
export const BadView = () => {
  const [lists, setLists] = useState([]);

  useEffect(() => {
    db.select().from(listsTable).then(setLists); // DB na View!
  }, []);

  return <FlatList data={lists} />;
};

// ✅ CORRETO - Lógica no ViewModel
export const GoodView = () => {
  const { lists } = useListsViewModel(userId);
  return <FlatList data={lists} />;
};
```

### 5. UUIDs vs Auto-Increment

Sempre use UUIDs como Primary Keys:

```typescript
// ❌ ERRADO
id: int().primaryKey({ autoIncrement: true })

// ✅ CORRETO
id: text("id").primaryKey() // UUID gerado pela aplicação
```

**Por quê?**
- UUIDs são globalmente únicos
- Compatíveis com sincronização distribuída
- Não revelam informações sobre quantidade de registros

### 6. Índices (TODO - Futuro)

Para performance, criar índices nas foreign keys:

```sql
CREATE INDEX idx_lists_createdBy ON lists(createdBy);
CREATE INDEX idx_list_products_listId ON list_products(listId);
CREATE INDEX idx_list_products_productId ON list_products(productId);
CREATE UNIQUE INDEX idx_list_products_unique ON list_products(listId, productId);
```

---

## Migrations

### Gerar Migration

```bash
# Gera migrations a partir dos schemas
bun drizzle-kit generate
```

### Aplicar Migration

```bash
# Aplica migrations no banco
bun drizzle-kit migrate
```

### Estrutura de Migrations

```
drizzle/
├── 0000_initial_schema.sql
├── 0001_add_lists_table.sql
└── meta/
    └── _journal.json
```

---

## Próximos Passos

### Implementação Pendente

- [ ] Criar `src/ui/screens/Lists/Lists.viewModel.ts` (baseado no exemplo)
- [ ] Criar `src/ui/screens/Lists/Lists.view.tsx`
- [ ] Criar componentes: `ListCard`, `ProductItem`, `EmptyState`
- [ ] Implementar tela de criação de lista (`Create/`)
- [ ] Implementar tela de detalhes da lista (`Detail/`)
- [ ] Adicionar testes unitários para o Repository
- [ ] Adicionar testes do ViewModel com `@testing-library/react-hooks`

### Melhorias Futuras

- [ ] **Cache Layer**: TanStack Query para cache automático
- [ ] **Offline-First**: Sincronização quando voltar online
- [ ] **Busca**: Implementar busca de listas por nome
- [ ] **Filtros**: Filtrar por públicas, compartilhadas, etc
- [ ] **Ordenação**: Ordenar por nome, data, mais usadas
- [ ] **Duplicar Lista**: Criar cópia de uma lista existente

---

## Referências

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Expo SQLite Docs](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [MVVM Pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel)
- [Database Schema](./database-schema.md)
- [Arquitetura do Projeto](./arquitetura.md)
