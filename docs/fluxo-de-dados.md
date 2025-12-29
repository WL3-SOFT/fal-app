# Fluxo de Dados na Aplicação

## 📊 Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────────┐
│                    👤 USUÁRIO INTERAGE                          │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  📱 CAMADA DE APRESENTAÇÃO (src/ui/)                            │
│                                                                  │
│  View (*.view.tsx)  ←──────→  ViewModel (*.viewModel.ts)       │
│  - JSX/Componentes              - useState                      │
│  - Eventos de UI                - useCallback                   │
│  - Renderização                 - Lógica de apresentação        │
│                                 - Trabalha com DTOs             │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓ DTOs
┌──────────────────────────────────────────────────────────────────┐
│  🎯 CAMADA DE APLICAÇÃO (src/core/useCases/)                    │
│                                                                  │
│  Use Cases                                                       │
│  - Validação de regras de negócio                              │
│  - Orquestração de operações                                   │
│  - Converte Entity → DTO (Mapper)                              │
│  - Recebe DTOs, retorna DTOs                                   │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓ Entities
┌──────────────────────────────────────────────────────────────────┐
│  💾 CAMADA DE DADOS (src/data/repositories/)                    │
│                                                                  │
│  Repository Implementations                                      │
│  - Implementa interfaces do core                               │
│  - Acessa banco via Drizzle ORM                                │
│  - Converte Plain Object → Entity                              │
│  - Trabalha com Entities                                       │
└──────────────────────────┬──────────────────────────────────────┘
                           ↓ Plain Objects
┌──────────────────────────────────────────────────────────────────┐
│  🗄️ CAMADA DE INFRAESTRUTURA (src/db/)                         │
│                                                                  │
│  Database (SQLite + Drizzle)                                    │
│  - Schemas (definição de tabelas)                              │
│  - Migrations (evolução do banco)                              │
│  - Client (conexão)                                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Exemplo 1: Buscar Listas do Usuário (READ)

### Fluxo: Database → UI

#### 1️⃣ View (src/ui/screens/Lists/Lists.view.tsx)

```typescript
export const ListsView = () => {
  const { lists, navigateToDetails } = useListsViewModel();

  return (
    <FlatList
      data={lists}  // ← DTOs vindos do ViewModel
      renderItem={({ item }) => (
        <ListCard
          title={item.name}
          itemsQuantity={item.productCount}
          onPress={() => navigateToDetails(item.id)}
        />
      )}
    />
  );
};
```

**Tipo de dado:** `ListWithProductCountDto[]`

---

#### 2️⃣ ViewModel (src/ui/screens/Lists/Lists.viewModel.ts)

```typescript
export const useListsViewModel = () => {
  const [state, setState] = useState<{
    lists: ListWithProductCountDto[];  // ← DTO
    // ...
  }>({ lists: [], /* ... */ });

  const getUserListsUseCase = useMemo(
    () => new GetUserListsUseCase(listsRepository),
    []
  );

  const loadLists = useCallback(async (userId: string) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Use Case retorna DTOs
      const lists = await getUserListsUseCase.execute(userId);
      setState((prev) => ({ ...prev, lists, loading: false }));
    } catch (error) {
      // error handling...
    }
  }, [getUserListsUseCase]);

  useEffect(() => {
    loadLists(DEFAULT_USER_ID);
  }, [loadLists]);

  return { lists: state.lists, /* ... */ };
};
```

**Tipo de dado:** `ListWithProductCountDto[]`

---

#### 3️⃣ Use Case (src/core/useCases/lists/GetUserLists.ts)

```typescript
export class GetUserListsUseCase {
  constructor(
    private readonly listsRepository: ListsRepositoryInterface
  ) {}

  async execute(userId: string): Promise<ListWithProductCountDto[]> {
    // Validação de regras de negócio
    if (!userId || userId.trim().length === 0) {
      throw new GetUserListsValidationError("ID do usuário é obrigatório");
    }

    // Repository retorna Entities
    const listEntities = await this.listsRepository.findByUser(userId);

    // Mapper converte Entity → DTO
    return listEntities.map(listWithProductCountToDto);
    //                       ↑ Função do Mapper
  }
}
```

**Entrada:** `string` (userId)
**Saída:** `ListWithProductCountDto[]` (DTOs)
**Recebe do Repository:** `ListWithProductCount[]` (Entities)

---

#### 4️⃣ Mapper (src/core/mappers/list.mapper.ts)

```typescript
export function listWithProductCountToDto(
  entity: ListWithProductCount  // ← Entity (classe com métodos)
): ListWithProductCountDto {   // → DTO (plain object)
  return {
    ...listEntityToDto(entity),
    productCount: entity.productCount,
  };
}

export function listEntityToDto(entity: List): ListDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description ?? null,
    usedTimes: entity.usedTimes,
    // ... todos os campos como plain object
  };
}
```

**Conversão:** `List Entity` (classe com `use()`, `changeName()`, etc.) → `ListDto` (objeto simples)

---

#### 5️⃣ Repository (src/data/repositories/ListsRepository.ts)

```typescript
export class ListsRepository implements ListsRepositoryInterface {
  async findByUser(userId: string): Promise<ListWithProductCount[]> {
    // Drizzle retorna plain objects
    const result = await db
      .select({
        id: listsTable.id,
        name: listsTable.name,
        // ...
        productCount: count(listProductsTable.id),
      })
      .from(listsTable)
      .where(eq(listsTable.createdBy, userId))
      .groupBy(listsTable.id);

    // Converte Plain Object → Entity (instancia classe)
    return result.map((row) => {
      const listEntity = new List(row);  // ← Instancia Entity
      return Object.assign(listEntity, {
        productCount: row.productCount
      });
    });
  }
}
```

**Entrada:** `string` (userId)
**Saída:** `ListWithProductCount[]` (Entities - classe `List`)
**Recebe do Drizzle:** Plain objects

---

#### 6️⃣ Database (src/db/client.ts + schemas)

```typescript
// src/db/schemas/list.schema.ts
export const listsTable = sqliteTable("lists", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  usedTimes: integer("usedTimes").default(0).notNull(),
  // ...
});

// src/db/client.ts
export const db = drizzle(expoDb, { schema });
```

**Drizzle ORM executa SQL e retorna plain objects**

---

## 📝 Exemplo 2: Criar Nova Lista (WRITE)

### Fluxo: UI → Database

#### 1️⃣ View - Usuário clica em "Criar Lista"

```typescript
// User preenche formulário e clica em "Salvar"
<CreateListForm onSubmit={(data) => viewModel.createList(data)} />
```

---

#### 2️⃣ ViewModel - Chama Use Case

```typescript
const createList = useCallback(async (data: CreateListFormData) => {
  setState((prev) => ({ ...prev, creating: true }));

  try {
    // Use Case retorna DTO da lista criada
    const createdList = await createListUseCase.execute({
      name: data.name,
      description: data.description,
      createdBy: DEFAULT_USER_ID,
    });

    // Recarrega listas
    await loadLists(DEFAULT_USER_ID);

    setState((prev) => ({ ...prev, creating: false }));
    return true;
  } catch (error) {
    // error handling...
  }
}, [createListUseCase, loadLists]);
```

---

#### 3️⃣ Use Case - Valida e chama Repository

```typescript
export class CreateListUseCase {
  async execute(data: CreateListDto): Promise<ListDto> {
    // Validações de negócio
    if (!data.name || data.name.trim().length === 0) {
      throw new CreateListValidationError("Nome é obrigatório");
    }

    if (data.name.length < MINIMUM_LIST_NAME_LENGTH) {
      throw new CreateListValidationError(
        `Nome deve ter ao menos ${MINIMUM_LIST_NAME_LENGTH} caracteres`
      );
    }

    // Repository retorna Entity
    const listEntity = await this.listsRepository.create({
      name: data.name.trim(),
      description: data.description.trim(),
      createdBy: data.createdBy,
    });

    // Mapper converte Entity → DTO
    return listEntityToDto(listEntity);
  }
}
```

---

#### 4️⃣ Repository - Salva no banco e retorna Entity

```typescript
async create(data: CreateListDto): Promise<List> {
  const newList = {
    id: generateUuid(),
    name: data.name,
    description: data.description,
    createdBy: data.createdBy,
    usedTimes: 0,
    isActive: true,
  };

  // Drizzle insere no banco
  await db.insert(listsTable).values(newList);

  // Retorna Entity (instância da classe)
  return new List(newList);
}
```

---

#### 5️⃣ Database - Executa INSERT SQL

```sql
INSERT INTO lists (id, name, description, createdBy, usedTimes, isActive)
VALUES (?, ?, ?, ?, ?, ?);
```

---

## 🔑 Tipos de Dados em Cada Camada

| Camada | Tipo de Dado | Exemplo |
|--------|--------------|---------|
| **View** | DTOs (plain objects) | `ListWithProductCountDto` |
| **ViewModel** | DTOs (plain objects) | `ListWithProductCountDto` |
| **Use Case** | DTOs (entrada/saída) | `ListDto`, `CreateListDto` |
| **Use Case ↔ Repository** | Entities (classes) | `List` (classe com métodos) |
| **Repository** | Entities (classes) | `List` (instância de classe) |
| **Repository ↔ Database** | Plain Objects | `{ id, name, ... }` |
| **Database** | SQL Rows | Tabelas SQLite |

---

## 🎯 Conversões de Tipos

### Database → UI (READ)

```
SQLite Row (plain object)
  ↓
[Repository] new List(row)
  ↓
List Entity (classe com métodos)
  ↓
[Use Case] listEntityToDto(entity)
  ↓
ListDto (plain object)
  ↓
[ViewModel] setState({ lists })
  ↓
[View] <ListCard {...dto} />
```

### UI → Database (WRITE)

```
Form Data (plain object)
  ↓
[ViewModel] createUseCase.execute(formData)
  ↓
CreateListDto (plain object)
  ↓
[Use Case] repository.create(dto)
  ↓
[Repository] new List(data)
  ↓
List Entity (classe)
  ↓
[Repository] db.insert(entity.getData())
  ↓
SQLite INSERT
```

---

## 🚀 Benefícios desta Arquitetura

1. **Separation of Concerns**: Cada camada tem responsabilidade única
2. **Testabilidade**: Camadas podem ser testadas isoladamente
3. **Flexibilidade**: Trocar banco/UI sem afetar lógica de negócio
4. **Type Safety**: TypeScript garante tipos corretos em cada camada
5. **Entity com Comportamento**: Métodos de negócio ficam nas Entities
6. **DTOs para Apresentação**: UI não precisa de métodos, só dados
7. **Manutenibilidade**: Mudanças são localizadas e controladas

---

## 📋 Resumo do Fluxo

**LEITURA (Database → UI):**
```
DB → Plain Object → Repository → Entity → Use Case → DTO → ViewModel → DTO → View
```

**ESCRITA (UI → Database):**
```
View → Form Data → ViewModel → DTO → Use Case → Repository → Entity → DB
```

**Tipos em cada etapa:**
- **DB ↔ Repository**: Plain Objects ↔ Entities
- **Repository ↔ Use Case**: Entities
- **Use Case ↔ ViewModel**: DTOs
- **ViewModel ↔ View**: DTOs
