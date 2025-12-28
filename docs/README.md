# 📚 Documentação do Faça a Lista

Bem-vindo à documentação do projeto **Faça a Lista**! Este diretório contém toda a documentação técnica do sistema.

## 📑 Índice

### Arquitetura e Design

- **[arquitetura.md](./arquitetura.md)** - Visão geral da Clean Architecture + MVVM
- **[database-schema.md](./database-schema.md)** - Estrutura completa do banco de dados

### Implementação de Features

- **[gerenciamento-listas.md](./gerenciamento-listas.md)** ⭐ **PRINCIPAL** - Guia completo de implementação
  - Schemas com Drizzle ORM
  - Repositories
  - Gerenciamento de Estado (Zustand)
  - ViewModels
  - Exemplos práticos

- **[zustand-integration.md](./zustand-integration.md)** - Detalhes do gerenciamento de estado
  - Por que Zustand?
  - Como usar stores
  - Patterns e boas práticas
  - DevTools
  - Testes

## 🚀 Começando

### 1. Entenda a Arquitetura

```
📖 Leia primeiro: arquitetura.md
```

Você vai aprender:
- Clean Architecture com 4 camadas
- Padrão MVVM na UI
- Inversão de Dependência
- Separação de responsabilidades

### 2. Conheça o Banco de Dados

```
📖 Leia: database-schema.md
```

Você vai entender:
- Estrutura das tabelas
- Relacionamentos (1:N, N:M)
- Soft Delete pattern
- Event Sourcing
- Queries comuns

### 3. Implemente Features

```
📖 Guia principal: gerenciamento-listas.md
```

Siga este passo-a-passo:

#### Passo 1: Schemas (Drizzle ORM)

```typescript
// src/db/schemas/list.schema.ts
export const listsTable = sqliteTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  // ... campos
});
```

#### Passo 2: Repository

```typescript
// src/db/repositories/lists.repository.ts
export class ListsRepository {
  async findByUser(userId: string) {
    return await db.select()
      .from(listsTable)
      .where(eq(listsTable.createdBy, userId));
  }
}
```

#### Passo 3: Zustand Store

```typescript
// src/stores/lists.store.ts
export const useListsStore = create<ListsStore>()(
  immer((set) => ({
    lists: [],
    loadLists: async (userId) => {
      const lists = await listsRepository.findByUser(userId);
      set({ lists });
    },
  }))
);
```

#### Passo 4: ViewModel

```typescript
// src/ui/screens/Lists/Lists.viewModel.ts
export const useListsViewModel = (userId: string) => {
  const lists = useLists();
  const { loadLists } = useListsActions();

  useEffect(() => {
    loadLists(userId);
  }, [userId]);

  return { lists };
};
```

#### Passo 5: View

```tsx
// src/ui/screens/Lists/Lists.view.tsx
export const ListsView = () => {
  const { userId } = useAuth();
  const { lists } = useListsViewModel(userId);

  return (
    <FlatList data={lists} />
  );
};
```

## 📊 Arquitetura em Resumo

```
┌─────────────────────────────────────────┐
│            PRESENTATION                 │
│                                         │
│  View.tsx → ViewModel → Zustand Store   │
│                                         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│          DATA ACCESS LAYER              │
│                                         │
│  Repository → Drizzle ORM               │
│                                         │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│             DATABASE                    │
│                                         │
│  SQLite (Expo)                          │
│                                         │
└─────────────────────────────────────────┘
```

## 🛠️ Stack Tecnológica

### Core
- **React Native** 0.81.4
- **Expo SDK** 54.0.9
- **TypeScript** 5.9.2

### Database
- **Drizzle ORM** 0.45.1 (Type-safe queries)
- **Drizzle Kit** 0.31.8 (Migrations)
- **Expo SQLite** (Local database)

### State Management
- **Zustand** 5.0.9 (Global state)
- **Immer** 11.1.0 (Immutable updates)

### Router
- **Expo Router** ~6.0.10 (File-based routing)

## 🎯 Features Implementadas

### ✅ Schemas do Banco

- `accounts` - Contas de usuário
- `lists` - Listas de compras
- `products` - Catálogo de produtos
- `list_products` - Junction table N:M
- `prices` - Histórico de preços

### ✅ Repository Completo

- 13 métodos implementados
- CRUD de listas
- Gerenciamento de produtos
- Queries otimizadas
- Soft delete em tudo

### ✅ Zustand Store

- Estado global persistente
- Optimistic updates
- Selectors otimizados
- Actions assíncronas
- DevTools integration

### ✅ ViewModel Pattern

- Separação View/ViewModel
- Hooks reutilizáveis
- Estado local mínimo
- Type-safe

## 📝 Padrões e Convenções

### Soft Delete

```typescript
// ❌ NUNCA faça hard delete
await db.delete(listsTable).where(eq(id, listId));

// ✅ SEMPRE use soft delete
await db.update(listsTable)
  .set({ deletedAt: new Date().toISOString() })
  .where(eq(id, listId));
```

### Type Safety

```typescript
// ❌ NUNCA use 'any'
const list: any = await repository.findById(id);

// ✅ SEMPRE use tipos inferidos
const list: List | null = await repository.findById(id);
```

### Inversão de Dependência

```typescript
// ❌ NUNCA importe bibliotecas diretamente
import * as SecureStore from 'expo-secure-store';

// ✅ SEMPRE use interfaces/adapters
import { vault } from '@/infra/modules';
```

## 🧪 Testes

### Repository Tests

```typescript
describe('ListsRepository', () => {
  it('should find lists by user', async () => {
    const lists = await listsRepository.findByUser('user-123');
    expect(lists).toHaveLength(3);
  });
});
```

### Store Tests

```typescript
describe('ListsStore', () => {
  it('should delete list optimistically', async () => {
    const { result } = renderHook(() => useListsStore());
    await act(() => result.current.deleteList('list-1'));
    expect(result.current.lists).not.toContain('list-1');
  });
});
```

## 📖 Documentos por Tópico

### Para entender a arquitetura
- [arquitetura.md](./arquitetura.md)

### Para trabalhar com banco de dados
- [database-schema.md](./database-schema.md)
- [gerenciamento-listas.md](./gerenciamento-listas.md#schemas-do-banco-de-dados)

### Para implementar features
- [gerenciamento-listas.md](./gerenciamento-listas.md) (guia completo)
- [zustand-integration.md](./zustand-integration.md)

### Para criar telas
- [gerenciamento-listas.md](./gerenciamento-listas.md#viewmodels-camada-de-apresentação)
- [gerenciamento-listas.md](./gerenciamento-listas.md#exemplos-de-uso)

## 🔗 Links Úteis

- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Expo Router Docs](https://docs.expo.dev/router/introduction/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🚀 Próximos Passos

### Implementação Pendente

- [ ] Implementar autenticação (obter userId)
- [ ] Conectar ViewModel ao Zustand store (descomentar código)
- [ ] Criar telas de Create e Detail
- [ ] Adicionar loading states nas Views
- [ ] Implementar error handling
- [ ] Adicionar testes unitários
- [ ] Implementar pull-to-refresh

### Features Futuras

- [ ] **Cache Layer**: TanStack Query para cache automático
- [ ] **Offline-First**: Sincronização quando voltar online
- [ ] **Busca**: Buscar listas por nome
- [ ] **Filtros**: Filtrar por públicas, compartilhadas
- [ ] **Compartilhamento**: Compartilhar listas entre usuários
- [ ] **Duplicar**: Copiar listas existentes

---

## 💡 Dicas Importantes

1. **Sempre leia o schema antes de criar queries**
   - Entenda os relacionamentos
   - Saiba quais campos são nullable
   - Verifique índices existentes

2. **Use soft delete SEMPRE**
   - Preserva histórico
   - Permite auditoria
   - Possibilita recuperação

3. **Otimize re-renders com selectors**
   - Use hooks específicos do Zustand
   - Evite subscrever ao store inteiro
   - Memoize valores computados

4. **Mantenha ViewModels simples**
   - Lógica complexa vai no Store
   - ViewModel apenas conecta View ↔ Store
   - Use hooks customizados

5. **Teste isoladamente**
   - Repository sem UI
   - Store sem componentes
   - ViewModel com hooks testing library

---

**Desenvolvido com ❤️ por Wellington Braga**

Para dúvidas ou sugestões, consulte a documentação específica de cada tópico acima.
