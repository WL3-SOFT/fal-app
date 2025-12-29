# Lists View Models

View models implementados para as telas de listas seguindo o padrão MVVM.

## View Models Disponíveis

### useListsViewModel
**Arquivo:** `Lists.viewModel.ts`
**Responsabilidade:** Gerenciar listagem e criação de listas do usuário

**Estado:**
- `lists` - Array de listas com contagem de produtos
- `loading` - Indicador de carregamento
- `error` - Mensagem de erro (se houver)
- `creating` - Indicador de criação em andamento
- `deleting` - ID da lista sendo deletada
- `hasContent` - Booleano indicando se há listas
- `quantityText` - Texto formatado com quantidade de listas

**Ações:**
- `loadLists(userId?)` - Carrega listas do usuário
- `createList(data)` - Cria nova lista
- `deleteList(listId)` - Deleta lista (soft delete)
- `navigateToCreate()` - Navega para tela de criação
- `navigateToDetails(listId)` - Navega para detalhes da lista
- `clearError()` - Limpa mensagem de erro

**Exemplo:**
```typescript
import { useListsViewModel } from "@/ui/screens/Lists";

function ListsScreen() {
  const {
    lists,
    loading,
    error,
    hasContent,
    quantityText,
    navigateToCreate,
    navigateToDetails,
    deleteList,
  } = useListsViewModel();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <View>
      <Text>{quantityText}</Text>
      {lists.map(list => (
        <ListCard
          key={list.id}
          list={list}
          onPress={() => navigateToDetails(list.id)}
          onDelete={() => deleteList(list.id)}
        />
      ))}
      <Button onPress={navigateToCreate}>Nova Lista</Button>
    </View>
  );
}
```

---

### useCreateListViewModel
**Arquivo:** `Create/CreateList.viewModel.ts`
**Responsabilidade:** Gerenciar formulário de criação de lista

**Estado:**
- `formData` - Dados do formulário (name, description, isPublic, canBeShared)
- `creating` - Indicador de criação em andamento
- `error` - Mensagem de erro geral
- `fieldErrors` - Erros específicos por campo
- `canSubmit` - Booleano indicando se pode submeter

**Ações:**
- `setName(name)` - Atualiza nome da lista
- `setDescription(description)` - Atualiza descrição
- `setIsPublic(isPublic)` - Toggle de visibilidade pública
- `setCanBeShared(canBeShared)` - Toggle de compartilhamento
- `createList()` - Submete formulário e cria lista
- `resetForm()` - Reseta formulário para estado inicial
- `clearError()` - Limpa erro geral

**Validações:**
- Nome: obrigatório, 3-100 caracteres
- Descrição: obrigatória, 3-500 caracteres

**Exemplo:**
```typescript
import { useCreateListViewModel } from "@/ui/screens/Lists";

function CreateListScreen() {
  const {
    formData,
    creating,
    error,
    fieldErrors,
    canSubmit,
    setName,
    setDescription,
    setIsPublic,
    setCanBeShared,
    createList,
  } = useCreateListViewModel();

  const handleSubmit = async () => {
    const success = await createList();
    if (success) {
      // Navega de volta automaticamente
    }
  };

  return (
    <Form>
      <TextInput
        value={formData.name}
        onChangeText={setName}
        error={fieldErrors.name}
        placeholder="Nome da lista"
      />
      <TextInput
        value={formData.description}
        onChangeText={setDescription}
        error={fieldErrors.description}
        placeholder="Descrição"
        multiline
      />
      <Switch value={formData.isPublic} onValueChange={setIsPublic} />
      <Switch value={formData.canBeShared} onValueChange={setCanBeShared} />
      <Button
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={creating}
      >
        Criar Lista
      </Button>
      {error && <ErrorMessage message={error} />}
    </Form>
  );
}
```

---

### useListDetailsViewModel
**Arquivo:** `Detail/ListDetails.viewModel.ts`
**Responsabilidade:** Gerenciar detalhes e edição de uma lista específica

**Parâmetros:**
- `listId` - ID da lista a ser carregada

**Estado:**
- `list` - Dados da lista
- `loading` - Indicador de carregamento
- `error` - Mensagem de erro
- `updating` - Indicador de atualização em andamento
- `deleting` - Indicador de deleção em andamento

**Ações:**
- `loadList()` - Recarrega dados da lista
- `updateList(data)` - Atualiza nome, descrição ou status
- `deleteList()` - Deleta lista e volta para tela anterior
- `incrementUsage()` - Incrementa contador de usos
- `toggleActive()` - Ativa/desativa lista
- `clearError()` - Limpa erro

**Exemplo:**
```typescript
import { useListDetailsViewModel } from "@/ui/screens/Lists";

function ListDetailsScreen({ route }) {
  const { listId } = route.params;
  const {
    list,
    loading,
    updating,
    updateList,
    deleteList,
    toggleActive,
  } = useListDetailsViewModel(listId);

  if (loading) return <LoadingSpinner />;
  if (!list) return <NotFound />;

  return (
    <View>
      <Text>{list.name}</Text>
      <Text>{list.description}</Text>
      <Switch value={list.isActive} onValueChange={toggleActive} />
      <Button
        onPress={() => updateList({ name: "Novo nome" })}
        loading={updating}
      >
        Atualizar
      </Button>
      <Button onPress={deleteList} variant="danger">
        Deletar Lista
      </Button>
    </View>
  );
}
```

---

### useListProductsViewModel
**Arquivo:** `Detail/ListProducts.viewModel.ts`
**Responsabilidade:** Gerenciar produtos em uma lista

**Parâmetros:**
- `listId` - ID da lista

**Estado:**
- `products` - Array de produtos na lista
- `loading` - Indicador de carregamento
- `error` - Mensagem de erro
- `adding` - Indicador de adição em andamento
- `removing` - ID do produto sendo removido
- `updating` - ID do produto sendo atualizado
- `marking` - ID do produto sendo marcado como comprado
- `filter` - Filtro atual ('all' | 'pending' | 'purchased')
- `totalProducts` - Total de produtos
- `purchasedProducts` - Quantidade de produtos comprados
- `pendingProducts` - Quantidade de produtos pendentes
- `progressPercentage` - Progresso em percentual (0-100)

**Ações:**
- `loadProducts()` - Recarrega produtos
- `addProduct(productId, quantity)` - Adiciona produto à lista
- `removeProduct(productId)` - Remove produto (soft delete)
- `updateQuantity(productId, quantity)` - Atualiza quantidade
- `markAsPurchased(productId)` - Marca como comprado
- `setFilter(filter)` - Altera filtro de visualização
- `clearError()` - Limpa erro

**Validações:**
- Quantidade deve ser inteiro positivo

**Exemplo:**
```typescript
import { useListProductsViewModel } from "@/ui/screens/Lists";

function ListProductsScreen({ route }) {
  const { listId } = route.params;
  const {
    products,
    loading,
    filter,
    totalProducts,
    progressPercentage,
    addProduct,
    removeProduct,
    updateQuantity,
    markAsPurchased,
    setFilter,
  } = useListProductsViewModel(listId);

  const handleAddProduct = async (productId: string) => {
    const success = await addProduct(productId, 1);
    if (success) {
      console.log("Produto adicionado!");
    }
  };

  return (
    <View>
      <ProgressBar progress={progressPercentage} />
      <Text>{totalProducts} produtos</Text>

      <FilterTabs>
        <Tab onPress={() => setFilter("all")} active={filter === "all"}>
          Todos
        </Tab>
        <Tab onPress={() => setFilter("pending")} active={filter === "pending"}>
          Pendentes
        </Tab>
        <Tab onPress={() => setFilter("purchased")} active={filter === "purchased"}>
          Comprados
        </Tab>
      </FilterTabs>

      {products.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onUpdateQuantity={(qty) => updateQuantity(product.product.id, qty)}
          onMarkPurchased={() => markAsPurchased(product.product.id)}
          onRemove={() => removeProduct(product.product.id)}
        />
      ))}

      <AddProductButton onPress={handleAddProduct} />
    </View>
  );
}
```

---

## Padrões Implementados

### Dependency Injection
Todos os view models criam instâncias dos use cases injetando o repository:

```typescript
const getUserListsUseCase = new GetUserListsUseCase(listsRepository);
```

### Estado Consolidado
Estado gerenciado com `useState` único para evitar múltiplos re-renders:

```typescript
const [state, setState] = useState({
  data: [],
  loading: false,
  error: null,
});
```

### Callbacks Memoizados
Todas as ações usam `useCallback` para evitar re-criação:

```typescript
const loadData = useCallback(async () => {
  // ...
}, [dependencies]);
```

### Tratamento de Erros
Erros são capturados e expostos no estado:

```typescript
try {
  await useCase.execute(data);
} catch (error) {
  const errorMessage = error instanceof Error
    ? error.message
    : "Erro desconhecido";
  setState(prev => ({ ...prev, error: errorMessage }));
}
```

### Loading States
Estados de loading granulares para melhor UX:
- `loading` - Loading geral
- `creating` - Criando recurso
- `updating` - Atualizando recurso
- `deleting` - Deletando recurso

### Valores Computados
Valores derivados calculados no próprio hook:

```typescript
const hasContent = state.lists.length > 0;
const progressPercentage = (purchasedProducts / totalProducts) * 100;
```

## User ID Padrão

Todos os view models usam `"24"` como userId padrão até que autenticação seja implementada:

```typescript
const DEFAULT_USER_ID = "24";
```

## Integração Futura

### Autenticação
Quando autenticação for implementada, substituir `DEFAULT_USER_ID` por:

```typescript
import { useAuth } from "@/hooks/useAuth";

const { userId } = useAuth();
```

### State Management Global (Opcional)
Para compartilhar estado entre telas, pode-se migrar para:
- **Zustand** - Store global leve
- **React Context** - Context API nativo
- **Redux Toolkit** - Para apps mais complexos

### Otimistic Updates
Adicionar updates otimistas para melhor UX:

```typescript
const deleteList = async (listId: string) => {
  // Remove da UI imediatamente
  setState(prev => ({
    ...prev,
    lists: prev.lists.filter(l => l.id !== listId)
  }));

  try {
    await deleteListUseCase.execute(listId);
  } catch (error) {
    // Reverte em caso de erro
    await loadLists();
  }
};
```

### Cache e Invalidação
Implementar estratégias de cache:
- React Query / TanStack Query
- SWR
- Custom cache com TTL
