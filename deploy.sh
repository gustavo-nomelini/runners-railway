#!/bin/bash

# Nome do script: deploy.sh
# Função: Automatiza o deploy de um projeto NestJS no Railway

set -e  # Exit on error

# Função para exibir erros
error_exit() {
    echo "❌ ${1:-"Unknown Error"}" 1>&2
    exit 1
}

# 🚀 Etapa 0: Validações
echo "📦 Iniciando deploy do NestJS para Railway..."

# 1. Verifica se o railway CLI está instalado
if ! command -v railway &>/dev/null; then
    error_exit "Railway CLI não está instalado. Instale com: npm install -g @railway/cli"
fi

# 2. Remove configs antigas e arquivos de build
echo "🧹 Limpando ambiente..."
rm -rf dist node_modules package-lock.json .railway

# 3. Instala todas as dependências (incluindo dev para build)
echo "📦 Instalando dependências..."
npm install || error_exit "Falha ao instalar dependências"

# 4. Gera cliente Prisma
echo "🔄 Gerando cliente Prisma..."
npx prisma generate || error_exit "Falha ao gerar cliente Prisma"

# 5. Build do projeto
echo "🛠️ Fazendo build..."
npm run build || error_exit "Falha no build do projeto"

# 6. Verifica se o build foi bem sucedido
if [ ! -f "dist/src/main.js" ]; then
    error_exit "Build falhou: main.js não encontrado"
fi

# 7. Linka ao projeto Railway
echo "🔗 Linkando ao Railway..."
railway link || error_exit "Falha ao linkar projeto"

# 8. Define variáveis de ambiente
echo "🔐 Configurando variáveis de ambiente..."
railway variables set NODE_ENV="production"

# 9. Deploy
echo "🚀 Iniciando deploy..."
railway up || error_exit "Falha no deploy"

# 10. Finalizado
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Abrindo aplicação..."
railway open
