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
├── core/             # Contracts, interfaces, and constraints
│   ├── constraints/  # Business constraints/constants
│   └── interfaces/   # Interface definitions (HttpClient, StorageClient, etc.)
├── infra/            # Infrastructure implementations
│   └── modules/      # Concrete implementations (http, storage)
├── types/            # Shared TypeScript type definitions
└── ui/               # UI layer (MVVM)
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

1. Define interface in `src/core/interfaces/modules/`
2. Create adapter in `src/infra/modules/` that implements the interface
3. Inject the interface (not implementation) into use cases/repositories

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

- Project structure and architecture defined
- Expo Router configured with typed routes
- Firebase integration setup
- Code quality tools configured (Biome + Lefthook)
- Theme system foundation
- Domain and Data layers (entities, use cases, repositories) - not yet implemented
- Screen implementations - minimal

## Additional Documentation

- Database schema: `docs/database-schema.md`
- Social impact manifesto: `MANIFESTO.md`
