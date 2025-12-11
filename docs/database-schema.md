# Estrutura do Banco de Dados

## Visão Geral

O projeto utiliza **LiveStore** com **SQLite** como banco de dados local. A arquitetura segue o padrão **Event Sourcing** onde eventos geram mudanças de estado materializadas em tabelas SQLite.

## Tabelas

### 1. `accounts` - Contas de Usuário

Armazena informações de autenticação e configuração de contas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único da conta (UUID) |
| `email` | TEXT | NOT NULL, UNIQUE | Email do usuário |
| `hash` | TEXT | NOT NULL | Hash da senha |
| `owner` | TEXT | NOT NULL | ID do usuário proprietário |
| `type` | TEXT | DEFAULT 'personal' | Tipo da conta (personal, professional) |
| `systemRole` | TEXT | DEFAULT 'user' | Papel no sistema (admin, user) |
| `isActive` | BOOLEAN | DEFAULT true | Conta está ativa |
| `isBanned` | BOOLEAN | DEFAULT false | Conta está banida |
| `createdAt` | DATETIME | NOT NULL | Data de criação |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `deletedAt` | DATETIME | NULLABLE | Data de exclusão (soft delete) |

**Índices:**
- `email_hash_index` - UNIQUE (email, hash)
- `email_index` - UNIQUE (email)
- `id_index` - UNIQUE (id)
- `owner_index` - UNIQUE (owner)

**Eventos relacionados:**
- `v1.account.created` - Conta criada
- `v1.account.recovered` - Senha recuperada
- `v1.account.deleted` - Conta deletada (soft delete)
- `v1.account.banned` - Conta banida
- `v1.account.unblocked` - Conta desbloqueada

---

### 2. `users` - Usuários

Informações pessoais dos usuários.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único do usuário (UUID) |
| `name` | TEXT | NOT NULL | Nome completo do usuário |
| `birthDate` | DATETIME | NOT NULL | Data de nascimento |
| `createdAt` | DATETIME | NOT NULL | Data de criação do perfil |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `deletedAt` | DATETIME | NULLABLE | Data de exclusão (soft delete) |

**Índices:**
- `id_index` - UNIQUE (id)
- `name_index` - (name)

**Eventos relacionados:**
- `v1.user.created` - Usuário criado
- `v1.user.updated` - Perfil atualizado
- `v1.user.deleted` - Usuário deletado (soft delete)

---

### 3. `lists` - Listas de Compras

Listas criadas pelos usuários.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único da lista (UUID) |
| `name` | TEXT | NOT NULL | Nome da lista |
| `description` | TEXT | NOT NULL | Descrição da lista |
| `usedTimes` | INTEGER | DEFAULT 0 | Contador de reutilizações |
| `isActive` | BOOLEAN | DEFAULT true | Lista está ativa |
| `isPublic` | BOOLEAN | DEFAULT false | Lista é pública |
| `canBeShared` | BOOLEAN | DEFAULT false | Pode ser compartilhada |
| `createdBy` | TEXT | NOT NULL | ID da conta que criou (FK para accounts) |
| `createdAt` | DATETIME | NOT NULL | Data de criação |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `deletedAt` | DATETIME | NULLABLE | Data de exclusão (soft delete) |

**Índices:**
- `id_index` - UNIQUE (id)
- `owner_index` - (createdBy)
- `name_index` - (name)

**Eventos relacionados:**
- `v1.list.created` - Lista criada
- `v1.list.updated` - Lista atualizada
- `v1.list.deleted` - Lista deletada (soft delete)
- `v1.list.used` - Lista reutilizada (incrementa usedTimes)

---

### 4. `products` - Catálogo de Produtos

Catálogo global de produtos independentes das listas.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único do produto (UUID) |
| `name` | TEXT | NOT NULL | Nome do produto |
| `unit` | TEXT | DEFAULT 'un' | Unidade de medida (kg, g, l, ml, un, pct, cx) |
| `createdAt` | DATETIME | NOT NULL | Data de criação |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `deletedAt` | DATETIME | NULLABLE | Data de exclusão (soft delete) |

**Índices:**
- `id_index` - UNIQUE (id)
- `name_index` - (name)

**Unidades de Medida:**
- `kg` - Quilograma
- `g` - Grama
- `l` - Litro
- `ml` - Mililitro
- `un` - Unidade
- `pct` - Pacote
- `cx` - Caixa

**Eventos relacionados:**
- `v1.product.created` - Produto criado no catálogo
- `v1.product.updated` - Produto atualizado
- `v1.product.deleted` - Produto deletado (soft delete)

---

### 5. `list_products` - Produtos nas Listas (N:M)

Tabela de junção entre listas e produtos. Implementa a relação **Muitos-para-Muitos**.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único da relação (UUID) |
| `listId` | TEXT | NOT NULL | ID da lista (FK para lists) |
| `productId` | TEXT | NOT NULL | ID do produto (FK para products) |
| `quantity` | REAL | NOT NULL | Quantidade do produto nesta lista |
| `isPurchased` | BOOLEAN | DEFAULT false | Produto foi comprado |
| `addedAt` | DATETIME | NOT NULL | Quando foi adicionado à lista |
| `purchasedAt` | DATETIME | NULLABLE | Quando foi marcado como comprado |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `removedAt` | DATETIME | NULLABLE | Quando foi removido (soft delete) |

**Índices:**
- `id_index` - UNIQUE (id)
- `list_product_unique_index` - UNIQUE (listId, productId) - Impede duplicatas
- `list_id_index` - (listId)
- `product_id_index` - (productId)

**Eventos relacionados:**
- `v1.list.product.added` - Produto adicionado à lista
- `v1.list.product.removed` - Produto removido da lista
- `v1.list.product.updated` - Quantidade atualizada
- `v1.list.product.marked.as.purchased` - Marcado como comprado

**Observações:**
- Um produto pode estar em múltiplas listas com quantidades diferentes
- Cada lista pode ter o mesmo produto apenas uma vez (constraint UNIQUE)
- O status `isPurchased` é específico da lista

---

### 6. `prices` - Histórico de Preços

Preços observados de produtos em diferentes estabelecimentos. Relação **1:N** com produtos.

| Coluna | Tipo | Constraints | Descrição |
|--------|------|-------------|-----------|
| `id` | TEXT | PRIMARY KEY | Identificador único do preço (UUID) |
| `productId` | TEXT | NOT NULL | ID do produto (FK para products) |
| `value` | REAL | NOT NULL | Valor do preço |
| `storeName` | TEXT | NOT NULL | Nome do estabelecimento |
| `storeLocation` | TEXT | NULLABLE | Localização do estabelecimento |
| `observedAt` | DATETIME | NOT NULL | Quando o preço foi observado |
| `createdAt` | DATETIME | NOT NULL | Data de criação do registro |
| `updatedAt` | DATETIME | NULLABLE | Data da última atualização |
| `deletedAt` | DATETIME | NULLABLE | Data de exclusão (soft delete) |

**Índices:**
- `id_index` - UNIQUE (id)
- `product_id_index` - (productId)
- `product_store_index` - (productId, storeName)
- `observed_at_index` - (observedAt)

**Eventos relacionados:**
- `v1.price.created` - Preço registrado
- `v1.price.updated` - Preço atualizado
- `v1.price.deleted` - Preço deletado (soft delete)

**Casos de Uso:**
- Comparação de preços entre estabelecimentos
- Histórico temporal de preços
- Identificação do melhor preço
- Análise de tendências de preço

---

## Diagrama de Relacionamentos

```
┌──────────────┐         ┌──────────────┐
│   accounts   │─────────│    users     │
│              │ 1     1 │              │
│ id (PK)      │         │ id (PK)      │
└──────────────┘         └──────────────┘
       │ 1
       │
       │ N
┌──────────────┐
│    lists     │
│              │
│ id (PK)      │
│ createdBy(FK)│
└──────────────┘
       │ 1
       │
       │ N
┌──────────────────┐         ┌──────────────┐
│  list_products   │         │   products   │
│                  │ N     1 │              │
│ id (PK)          │─────────│ id (PK)      │
│ listId (FK)      │         │              │
│ productId (FK)   │         └──────────────┘
└──────────────────┘                │ 1
                                    │
                                    │ N
                            ┌──────────────┐
                            │    prices    │
                            │              │
                            │ id (PK)      │
                            │ productId(FK)│
                            └──────────────┘
```

## Padrões de Design

### Soft Delete

Todas as tabelas implementam **soft delete** usando a coluna `deletedAt`:
- `NULL` = registro ativo
- `DATE` = registro deletado logicamente

**Vantagens:**
- Histórico preservado
- Possibilidade de recuperação
- Auditoria completa

### Event Sourcing

Cada mudança é capturada por um evento que materializa o estado:
- **Eventos** = O que aconteceu (imutável)
- **Tabelas** = Estado atual (derivado dos eventos)
- **Materializers** = Transformam eventos em estado

### Timestamps

Padrão de timestamps em todas as tabelas:
- `createdAt` - REQUIRED - Quando foi criado
- `updatedAt` - NULLABLE - Última atualização
- `deletedAt` - NULLABLE - Soft delete

### UUIDs

Todos os IDs são **UUIDs v4** gerados pela aplicação:
- Globalmente únicos
- Não sequenciais
- Compatíveis com sincronização distribuída

## Queries Comuns

### Listar produtos de uma lista (não comprados)

```sql
SELECT
  p.id,
  p.name,
  p.unit,
  lp.quantity,
  lp.isPurchased
FROM list_products lp
INNER JOIN products p ON lp.productId = p.id
WHERE lp.listId = ?
  AND lp.isPurchased = false
  AND lp.removedAt IS NULL
  AND p.deletedAt IS NULL
ORDER BY lp.addedAt DESC;
```

### Comparar preços de um produto

```sql
SELECT
  storeName,
  storeLocation,
  value,
  observedAt
FROM prices
WHERE productId = ?
  AND deletedAt IS NULL
ORDER BY value ASC;
```

### Listas ativas de um usuário

```sql
SELECT
  l.id,
  l.name,
  l.description,
  l.usedTimes,
  COUNT(lp.id) as productCount
FROM lists l
LEFT JOIN list_products lp ON l.id = lp.listId AND lp.removedAt IS NULL
WHERE l.createdBy = ?
  AND l.isActive = true
  AND l.deletedAt IS NULL
GROUP BY l.id
ORDER BY l.createdAt DESC;
```

### Produtos mais usados

```sql
SELECT
  p.id,
  p.name,
  COUNT(lp.id) as usage_count
FROM products p
INNER JOIN list_products lp ON p.id = lp.productId
WHERE p.deletedAt IS NULL
  AND lp.removedAt IS NULL
GROUP BY p.id
ORDER BY usage_count DESC
LIMIT 10;
```

## Considerações de Performance

### Índices Criados

Todos os índices foram criados considerando:
1. **Primary Keys** - Acesso direto por ID
2. **Foreign Keys** - Joins eficientes
3. **Queries comuns** - Filtros frequentes (name, email, etc)
4. **Unique constraints** - Integridade de dados

### Otimizações

- Soft delete preserva dados sem impactar performance
- Índices compostos para queries específicas
- Campos nullable para evitar valores default desnecessários

## Migração e Versionamento

O LiveStore gerencia automaticamente:
- Criação de tabelas
- Aplicação de eventos
- Materialização de estado
- Sincronização entre dispositivos

**Importante:** Mudanças no schema devem:
1. Criar novos eventos versionados (v2.*)
2. Manter compatibilidade retroativa
3. Migrar dados existentes via eventos
