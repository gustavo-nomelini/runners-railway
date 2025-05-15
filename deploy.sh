#!/bin/bash

# Nome do script: deploy.sh
# Função: Automatiza o deploy de um projeto NestJS no Railway

# 🚀 Etapa 0: Validações
echo "📦 Iniciando deploy do NestJS para Railway..."

# 1. Verifica se o railway CLI está instalado
if ! command -v railway &>/dev/null; then
  echo "❌ Railway CLI não está instalado. Instale com: npm install -g railway"
  exit 1
fi

# 2. Remove configs antigas
echo "🧹 Limpando configurações antigas da Railway..."
rm -rf .railway

# 3. Linka ao projeto existente
echo "🔗 Linkando projeto local ao Railway..."
railway link

# 4. Faz build do projeto local (garante dist/)
echo "🛠️ Fazendo build local..."
npm install
npm run build

# 5. Faz primeiro deploy para criar o serviço
echo "🚀 Enviando projeto para a Railway..."
railway up

# 6. Define variáveis padrão se necessário
echo "🔐 Definindo variáveis (edite conforme necessário)..."
railway variables set JWT_SECRET="sua_jwt_secret_aqui"
railway variables set DATABASE_URL="postgresql://usuario:senha@host:porta/banco"

# 7. Finalizado
echo "✅ Deploy concluído com sucesso! Acesse com:"
railway open
