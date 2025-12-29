# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Faça a Lista** is a React Native mobile application built with Expo SDK 54, React Native 0.81, and React 19.1. The project uses Expo Router for file-based routing and follows Clean Architecture principles with MVVM pattern.

## Technology Stack

- **Package Manager**: Bun 1.2.22
- **Framework**: Expo SDK 54 (~54.0.9) with React Native 0.81.4
- **React Version**: 19.1.0 (critical - do not downgrade)
- **TypeScript**: 5.9.2
- **Routing**: Expo Router ~6.0.10 (file-based routing with typed routes)
- **Firebase**: Multiple Firebase services integrated (@react-native-firebase/*)
- **Monitoring**: Sentry 7.1.0 for error tracking
- **Code Quality**: Biome 2.2.6 (formatter + linter), Lefthook for git hooks

## Essential Commands

```bash
# Development
bun start              # Start Expo development server
bun android            # Run on Android
bun ios                # Run on iOS
bun web                # Run on web

# Building
bun prebuild           # Prebuild native folders (clean)
bun compile            # Build Android release (gradlew bundleRelease)

# Code Quality
bun check              # Lint and format with Biome (--write)

# Package Management (uses expo install/remove)
bun ad [package]       # Add dependency
bun rm [package]       # Remove dependency
```

## Architecture

This project follows **Clean Architecture** with **MVVM** pattern and **Dependency Inversion** principle.

### Layer Structure

```
src/
├── app/              # Expo Router - File-based routing
├── core/             # Domain Layer - Business rules and contracts
│   ├── entities/     # Domain entities (business objects)
│   ├── useCases/     # Application business logic
│   ├── constraints/  # Business constraints/constants
│   └── interfaces/   # Contracts for external dependencies
│       ├── modules/      # Infrastructure interfaces (HttpClient, StorageClient)
│       └── repositories/ # Data access interfaces (IListsRepository)
├── data/             # Data Layer - Repository implementations
│   └── repositories/ # Concrete repository implementations (ListsRepository)
├── db/               # Database Infrastructure
│   ├── schemas/      # Drizzle ORM table schemas
│   ├── migrations/   # Database migrations
│   ├── client.ts     # Database connection client
│   └── utils/        # Database utilities (uuid, soft-delete)
├── infra/            # Infrastructure Layer - External adapters
│   └── modules/      # Concrete implementations (http, storage, auth)
├── types/            # Shared TypeScript type definitions
└── ui/               # Presentation Layer (MVVM)
    ├── assets/       # Images, fonts, icons
    ├── components/   # Reusable UI components
    ├── hooks/        # Custom React hooks
    ├── providers/    # Context providers (Theme, App)
    ├── screens/      # Screen components (View + ViewModel)
    ├── theme/        # Theme configuration (light, dark, tokens)
    └── utils/        # UI utilities
```

### Key Architectural Principles

1. **Business logic isolation**: Domain layer has NO external dependencies
2. **MVVM in UI**: Each screen has a View + ViewModel pattern
3. **Dependency Inversion**: Never import libraries directly in business logic - use adapters in `infra/` that implement interfaces from `core/interfaces/`
4. **Repository Pattern**: Data access is abstracted through interfaces in `core/interfaces/repositories/`, implemented in `data/repositories/`

### Repository Pattern

**What is a Repository?**

A Repository abstracts data access with two parts:
- **Interface** (`core/interfaces/repositories/`) - Defines WHAT operations exist (create, find, update, delete)
- **Implementation** (`data/repositories/`) - Defines HOW operations work (using Drizzle, Prisma, REST API, etc.)

**Example:**
```typescript
// 1. Interface (core/interfaces/repositories/IListsRepository.ts)
export interface IListsRepository {
  create(data: CreateListDTO): Promise<List>;
  findById(id: string): Promise<List | null>;
}

// 2. Implementation (data/repositories/ListsRepository.ts)
export class ListsRepository implements IListsRepository {
  async create(data: CreateListDTO): Promise<List> {
    // Drizzle ORM implementation
    return db.insert(listsTable).values(data);
  }
}

// 3. Use Case (core/useCases/CreateList.ts)
export class CreateListUseCase {
  constructor(private repository: IListsRepository) {} // ← Interface, not class!

  async execute(data: CreateListDTO) {
    return this.repository.create(data);
  }
}

// 4. Dependency Injection (ui/screens/Lists/Lists.viewModel.ts)
const repository = new ListsRepository(); // Concrete implementation
const useCase = new CreateListUseCase(repository); // Inject
```

**Benefits:**
- Swap database (SQLite → PostgreSQL) without changing business logic
- Easy testing (mock the interface)
- Clear separation of concerns

### Screen Structure Pattern

```
src/ui/screens/FeatureName/
├── index.ts                      # Export
├── FeatureName.view.tsx          # UI only
├── FeatureName.viewModel.ts      # State and logic (hook)
├── FeatureName.styles.ts         # Styled components
└── components/                   # Screen-specific components
```

### Adding New Dependencies

**CRITICAL**: Never use external libraries directly in domain/business logic!

**For Infrastructure (HTTP, Storage, Analytics, etc.):**
1. Define interface in `src/core/interfaces/modules/`
2. Create adapter in `src/infra/modules/` that implements the interface
3. Inject the interface (not implementation) into use cases

**For Data Access (Repositories):**
1. Define interface in `src/core/interfaces/repositories/`
2. Create implementation in `src/data/repositories/` that implements the interface
3. Inject the interface (not implementation) into use cases
4. Keep database-specific code (schemas, migrations) in `src/db/`

## TypeScript Configuration

### Path Aliases (configured in tsconfig.json)

```typescript
@/*           -> ./src/*
@app/*        -> ./src/app/*
@components/* -> ./src/ui/components/*
@hooks/*      -> ./src/ui/hooks/*
@screens/*    -> ./src/ui/screens/*
@themes/*     -> ./src/ui/themes/*
```

### TypeScript Strict Mode

This project uses **strict TypeScript** with additional flags:
- `noUnusedLocals`, `noUnusedParameters`
- `noImplicitAny`, `noImplicitThis`, `noImplicitReturns`
- `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`

## Expo Router (File-based Routing)

Routes are defined by file structure in `src/app/`:

```
src/app/
├── (access)/          # Auth group (login, register, recover)
├── (tabs)/            # Tab navigation group
│   ├── _layout.tsx    # Tab layout configuration
│   ├── index.tsx      # Home tab
│   └── lists/         # Lists feature (Stack)
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── create.tsx
│       └── [id].tsx   # Dynamic route
├── _layout.tsx        # Root layout
└── +not-found.tsx     # 404 page
```

- **Typed routes enabled**: `experiments.typedRoutes: true` in app.config.ts
- **React Compiler enabled**: `experiments.reactCompiler: true`

## Firebase Integration

The app integrates multiple Firebase services:
- Authentication, Analytics, Crashlytics
- Messaging (Push notifications), App Check
- App Distribution, Remote Config

**Note**: `google-services.json` is gitignored - developers need their own Firebase config.

## Important Notes

### React 19 Compatibility

- This project uses React 19.1.0 which is officially supported by Expo SDK 54
- Do NOT install `@types/react-native` - React Native 0.81 provides its own types
- Avoid `verbatimModuleSyntax: true` in tsconfig - it causes JSX conflicts

### Code Quality Tools

- **Biome 2.2.6** is used for both linting and formatting (replaces ESLint + Prettier)
- **Lefthook** manages git hooks (pre-commit runs biome check, commit-msg enforces conventional commits)
- Key Biome rules:
  - Tab indentation, LF line endings
  - `noMagicNumbers`, `noImplicitBoolean`
  - `noImportCycles`, `noSecrets`
  - `useReactFunctionComponents` (no class components)
  - `useMaxParams: 5`
  - `useNamingConvention` enforced

### Conventional Commits

Git hooks enforce conventional commit format via `git-conventional-commits`:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `style:` formatting
- `refactor:` code refactoring
- `test:` tests
- `chore:` maintenance

## Project Status

This project is in **early development stage**:

- Project structure and architecture defined (Clean Architecture + MVVM)
- Expo Router configured with typed routes
- Firebase integration setup
- Code quality tools configured (Biome + Lefthook)
- Theme system foundation
- Database layer (Drizzle ORM + SQLite) configured
- Data layer: Lists repository implemented (interface + Drizzle implementation)
- Domain layer: List entity implemented
- Use cases: 12 list use cases implemented with validation
  - List operations: Create, GetById, GetUserLists, Update, Delete, IncrementUsage
  - Product operations: Add, Remove, UpdateQuantity, MarkAsPurchased, GetListProducts, GetPendingProducts
- View Models (MVVM): 4 view models implemented
  - useListsViewModel - Listagem e gerenciamento de listas
  - useCreateListViewModel - Formulário de criação com validação
  - useListDetailsViewModel - Detalhes e edição de lista
  - useListProductsViewModel - Gerenciamento de produtos com filtros e progresso
- Screen implementations - minimal (views precisam integração com view models)

## Additional Documentation

- Database schema: `docs/database-schema.md`
- Repository pattern guide: `docs/repository-pattern.md`
- Lists use cases: `src/core/useCases/lists/README.md`
- Lists view models: `src/ui/screens/Lists/viewModels/README.md`
- Social impact manifesto: `MANIFESTO.md`
