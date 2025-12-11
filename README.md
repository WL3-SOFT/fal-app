# 🛒 Faça a Lista

![React Native](https://img.shields.io/badge/React_Native-0.81.4-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-54.0.9-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-1.2.22-FBF0DF?style=for-the-badge&logo=bun&logoColor=white)
![License](https://img.shields.io/badge/License-GNU%20Lesser%20General%20Public%20License-green?style=for-the-badge)

<div align="center">
  <img src="./src/ui/assets/images/logo-faca-lista.png" alt="Faça a Lista Logo" width="200"/>

### **Por um Brasil onde ninguém precise escolher entre comer hoje ou amanhã**

[Website](https://facaalista.com.br) · [Blog](https://blog.facaalista.com.br) · [Manifesto](./MANIFESTO.md) · [Documentação](./docs)

</div>

---

## 📋 Sobre o Projeto

**Faça a Lista** é uma plataforma tecnológica de impacto social que combate a insegurança alimentar no Brasil através da democratização da informação de preços. Queremos criar o maior ecossistema de dados alimentares do país, conectando **42 milhões de famílias vulneráveis**, **238 mil pequenos supermercados** e **grandes marcas** em uma rede colaborativa de economia e transparência.

### 🎯 Nossa Missão

> _"Transformar dados em ferramenta de combate à fome, garantindo que cada brasileiro saiba onde está o pão mais barato."_

### 📊 O Problema que Resolvemos

- **36%** dos brasileiros em insegurança alimentar (2021)
- **52%** do salário mínimo gasto com cesta básica
- **81,4%** dos gastos das famílias de baixa renda vão para alimentação
- **125 milhões** de pessoas vulneráveis sem acesso a informação de preços

## ✨ Como Funciona

### 🔄 Ecossistema de Três Pilares

### 📱 Para Consumidores

- **✅ Crie sua lista** no app
- **🔍 Compare preços** em tempo real
- **💰 Economize até 30%** nas compras
- **📍 Encontre** o melhor custo-benefício perto de você
- **🎯 Receba alertas** de promoções personalizadas

### 🏪 Para Supermercados

- **💻 ERP Gratuito** completo e integrado
- **📊 Gestão simplificada** de estoque e preços
- **👥 Novos clientes** através da plataforma
- **📈 Competitividade** com grandes redes
- **🚀 Digitalização** sem custo inicial

### 🏭 Para Marcas

- **📊 Dados únicos** das classes C, D, E
- **🎯 Campanhas hiperlocalizadas**
- **💡 Insights** de consumo em tempo real
- **📈 ROI mensurável** de campanhas
- **🤝 Conexão direta** com 125 milhões de consumidores

## 🚀 Início Rápido

### Pré-requisitos

- Node.js >= 20.19.4
- Bun >= 1.2.22
- Expo CLI
- Android Studio

### Instalação

```bash
# Clone o repositório
git clone https://github.com/facaalista

# Entre no diretório
cd facaalista

# Instale as dependências com Bun
bun install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Edite o arquivo .env.local com suas configurações
# FIREBASE_API_KEY=sua_chave_aqui
# SENTRY_DSN=seu_dsn_aqui

# Gere arquivos nativos
bun prebuild

# Inicie o projeto
bun expo start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
bun expo start          # Inicia o servidor Expo
bun ios                 # iOS Simulator
bun android             # Android Emulator
bun web                 # Web browser

# Qualidade de Código
bun lint                # Verifica padrões de código
bun lint:fix            # Corrige problemas automaticamente
bun format              # Formata com Prettier
bun test                # Executa testes
bun test:coverage       # Testes com cobertura

# Build & Deploy
bun prebuild            # Gera arquivos nativos
bun build:ios           # Build para iOS
bun build:android       # Build para Android
eas build --platform all --profile production
```

## 🏗️ Arquitetura

O projeto implementa **Clean Architecture** com **MVVM** e **Inversão de Dependência**, garantindo:

```
✅ Testabilidade: 90%+ de cobertura
✅ Manutenibilidade: Separação clara de responsabilidades
✅ Escalabilidade: Pronto para milhões de usuários
✅ Flexibilidade: Troca fácil de tecnologias
```

### Estrutura de Camadas

```
src/
├── app/                    # 🗺️ Expo Router - Navegação
│   ├── (access)/          # Autenticação
│   ├── (tabs)/            # Navegação principal
│   └── _layout.tsx        # Layout raiz
│
├── core/                   # 🔧 Contratos e Infraestrutura
│   ├── contracts/         # Interfaces (HttpClient, Storage, etc)
│   └── infra/            # Implementações (Axios, SQLite, etc)
│
├── data/                   # 💾 Camada de Dados
│   ├── dtos/             # Estruturas da API
│   ├── mappers/          # Conversões DTO ↔ Entity
│   └── repositories/     # Implementação dos repos
│
├── domain/                 # 💼 Regras de Negócio (Pura)
│   ├── entities/         # Modelos de negócio
│   ├── repositories/     # Contratos de repos
│   └── useCases/        # Casos de uso
│
└── ui/           # 🎨 Interface do Usuário
    ├── components/       # Componentes reutilizáveis
    ├── screens/         # Telas (View + ViewModel)
    └── themes/          # Sistema de temas
```

## 🛠️ Stack Tecnológica

### Mobile

- **React Native** 0.81.4 com New Architecture
- **Expo SDK** 54.0.9 (Managed Workflow)
- **TypeScript** 5.9.2
- **Expo Router** v6 (File-based routing)

### Backend Services

- **Firebase** Suite completa (Auth, Firestore, Analytics, Crashlytics)
- **Sentry** Error tracking e performance
- **API REST** Custom com cache inteligente

### Armazenamento

- **expo-secure-store** Tokens e dados sensíveis
- **expo-sqlite** Banco local para offline-first
- **AsyncStorage** Cache e preferências

### Qualidade

- **ESLint** + **Prettier** Padronização de código
- **Husky** + **lint-staged** Git hooks
- **Jest** + **Testing Library** Testes automatizados

## 🎨 Design System

O projeto utiliza um design system acessível e otimizado para dispositivos básicos:

- **Cores**: Verde esperança (#4CAF50) + Amarelo Brasil (#FFC107)
- **Tipografia**: Inter (otimizada para legibilidade)
- **Componentes**: Biblioteca própria com foco em acessibilidade
- **Dark Mode**: Suporte completo para economia de bateria

## 📊 Impacto Social

### Objetivos de Desenvolvimento Sustentável (ODS)

O Faça a Lista contribui diretamente para 3 ODS da ONU:

- 🎯 **ODS 2**: Erradicar a fome e alcançar segurança alimentar
- 🎯 **ODS 10**: Reduzir as desigualdades
- 🎯 **ODS 12**: Garantir padrões de consumo sustentáveis

### Métricas de Impacto

- 📱 **1 milhão** de famílias cadastradas
- 💰 **R$ 150 milhões** economizados pelas famílias
- 🏪 **10.000** supermercados digitalizados
- 📊 **50 milhões** de transações influenciadas

## 🧪 Testes

```bash
# Testes unitários
bun test:unit           # ViewModels, UseCases, Mappers

# Testes de integração
bun test:integration    # Repositories, Services

# Testes de componentes
bun test:components     # Views com Testing Library

# Testes E2E
bun test:e2e           # Fluxos críticos com Detox

# Cobertura completa
bun test:coverage      # Meta: >90%
```

## 🔐 Segurança

- ✅ Conformidade total com **LGPD**
- ✅ Criptografia de dados sensíveis
- ✅ Autenticação multi-fator
- ✅ Token rotation automático
- ✅ Rate limiting e proteção DDoS
- ✅ Code obfuscation em produção

### Convenções

```typescript
// Nomenclatura de arquivos
NomeTela.view.tsx       // View (UI)
NomeTela.viewModel.ts   // ViewModel (lógica)
NomeTela.styles.ts      // Estilos

// Commits semânticos
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: testes
chore: tarefas
```

## 📄 Licença

Este projeto está sob licença GNU LESSER GENERAL PUBLIC LICENSE - veja [LICENSE](LICENSE) para detalhes.

## 🙏 Apoie a Causa

### Como você pode ajudar:

- **⭐ Dê uma estrela** neste repositório
- **🔄 Compartilhe** com amigos e família
- **📢 Divulgue** nas redes sociais
- **🤝 Conecte** supermercados locais

---

<div align="center">

### 💚 **FAÇA A LISTA. FAÇA A DIFERENÇA. FAÇA ACONTECER.** 💚

**#FaçaALista #BrasilSemFome #TecnologiaPopular #RevoluçãoNoCarrinho**

_"Porque quando o povo tem informação, o povo tem poder._
_E quando o povo tem poder, o Brasil não tem fome."_

**Desenvolvido com ❤️ por Wellington Braga**

</div>
