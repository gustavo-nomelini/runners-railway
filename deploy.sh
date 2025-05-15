#!/bin/bash

# Nome do script: deploy.sh
# Função: Automatiza o deploy de um projeto NestJS no Railway

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

# 2. Remove configs antigas
echo "🧹 Limpando ambiente..."
rm -rf dist node_modules package-lock.json .railway

# 3. Instala dependências
echo "📦 Instalando dependências..."
npm install --omit=dev || error_exit "Falha ao instalar dependências"

# 4. Gera cliente Prisma
echo "🔄 Gerando cliente Prisma..."
npx prisma generate || error_exit "Falha ao gerar cliente Prisma"

# 5. Build do projeto
echo "🛠️ Fazendo build..."
npm run build || error_exit "Falha no build do projeto"

# 6. Linka ao projeto Railway
echo "🔗 Linkando ao Railway..."
railway link || error_exit "Falha ao linkar projeto"

# 7. Define variáveis de ambiente
echo "🔐 Configurando variáveis de ambiente..."
railway variables set NODE_ENV="production"
railway variables set PORT="3000"

# 8. Deploy
echo "🚀 Iniciando deploy..."
railway up || error_exit "Falha no deploy"

# 9. Finalizado
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Abrindo aplicação..."
railway open
