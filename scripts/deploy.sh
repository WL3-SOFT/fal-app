#!/bin/bash

set -e

echo "🚀 Iniciando processo de deploy..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se está na branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${YELLOW}⚠️  Você não está na branch main. Branch atual: $CURRENT_BRANCH${NC}"
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploy cancelado."
        exit 1
    fi
fi

# Verifica se há alterações não commitadas
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Há alterações não commitadas${NC}"
    git status -s
    read -p "Deseja continuar mesmo assim? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deploy cancelado. Faça commit das alterações primeiro."
        exit 1
    fi
fi

# Pega a última tag/versão
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
echo -e "${BLUE}📌 Última versão: $LAST_TAG${NC}"

# Determina a nova versão baseado nos commits
echo -e "${BLUE}🔍 Analisando commits para determinar a nova versão...${NC}"
NEW_VERSION=$(npx git-conventional-commits version --commit="$LAST_TAG")

if [ -z "$NEW_VERSION" ]; then
    echo -e "${YELLOW}⚠️  Nenhuma mudança detectada desde $LAST_TAG${NC}"
    echo "Não há commits que justifiquem uma nova versão."
    exit 0
fi

echo -e "${GREEN}✨ Nova versão sugerida: v$NEW_VERSION${NC}"

# Pergunta se deseja continuar
read -p "Deseja criar a versão v$NEW_VERSION? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "Deploy cancelado."
    exit 0
fi

# Atualiza o package.json com a nova versão
echo -e "${BLUE}📝 Atualizando package.json...${NC}"
bun version "$NEW_VERSION" --no-git-tag-version

# Gera o changelog
echo -e "${BLUE}📋 Gerando changelog...${NC}"
npx git-conventional-commits changelog --release="v$NEW_VERSION" --file="CHANGELOG.md"

# Adiciona as alterações ao git
git add package.json CHANGELOG.md

# Cria commit de versão
echo -e "${BLUE}💾 Criando commit de versão...${NC}"
git commit -m "chore(release): v$NEW_VERSION"

# Cria a tag
echo -e "${BLUE}🏷️  Criando tag v$NEW_VERSION...${NC}"
git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"

echo -e "${GREEN}✅ Deploy preparado com sucesso!${NC}"
echo -e "${BLUE}📦 Versão: v$NEW_VERSION${NC}"
echo ""
echo "Para publicar, execute:"
echo -e "${YELLOW}  git push && git push --tags${NC}"
echo ""
echo "Ou execute o comando de publicação:"
echo -e "${YELLOW}  bun run deploy:publish${NC}"
