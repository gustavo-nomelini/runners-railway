/**
 * Script para corrigir problemas comuns no repositório de usuário
 * Este script deve ser executado após npm install para garantir
 * que as correções sejam aplicadas.
 */

const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const srcPath = path.join(
  __dirname,
  'src',
  'modules',
  'usuarios',
  'usuario.repository.ts',
);
const distPath = path.join(
  __dirname,
  'dist',
  'modules',
  'usuarios',
  'usuario.repository.js',
);

console.log('Iniciando correções nos arquivos do repositório de usuário...');

// Função para corrigir o arquivo TypeScript
function fixTypeScriptFile() {
  if (!fs.existsSync(srcPath)) {
    console.log(`Arquivo não encontrado: ${srcPath}`);
    return false;
  }

  let content = fs.readFileSync(srcPath, 'utf-8');
  let originalContent = content;
  let modified = false;

  // Correção para findById - usar equals para filtros avançados
  if (content.includes('where: {\n      id: id,')) {
    content = content.replace(
      /where: {\s*id: id,\s*},/g,
      'where: {\n        id: {\n          equals: id\n        },\n      },',
    );
    modified = true;
  }

  // Correção para outros métodos - usar Number(id) para garantir tipo correto
  if (content.includes('where: {\n        id: id,')) {
    content = content.replace(
      /where: {\s*id: id,\s*},/g,
      'where: {\n        id: Number(id),\n      },',
    );
    modified = true;
  }

  // Verificar se houve mudanças
  if (modified) {
    fs.writeFileSync(srcPath, content, 'utf-8');
    console.log('✅ Arquivo TypeScript corrigido com sucesso!');
    return true;
  }

  console.log(
    '✅ Arquivo TypeScript já está correto ou usa formato alternativo.',
  );
  return false;
}

// Função para corrigir o arquivo JavaScript compilado, se existir
function fixJavaScriptFile() {
  if (!fs.existsSync(distPath)) {
    console.log(`Arquivo compilado não encontrado: ${distPath}`);
    return false;
  }

  let content = fs.readFileSync(distPath, 'utf-8');
  let originalContent = content;
  let modified = false;

  // Correção para findById - usar equals para filtros avançados
  if (content.includes('where: {\n                id: id,')) {
    content = content.replace(
      /where: {\s*id: id,\s*},/g,
      'where: {\n                id: {\n                    equals: id\n                },\n            },',
    );
    modified = true;
  }

  // Correção para outros métodos - usar Number(id) para garantir tipo correto
  if (content.includes('where: {\n                id: id,')) {
    content = content.replace(
      /where: {\s*id: id,\s*},/g,
      'where: {\n                id: Number(id),\n            },',
    );
    modified = true;
  }

  // Verificar se houve mudanças
  if (modified) {
    fs.writeFileSync(distPath, content, 'utf-8');
    console.log('✅ Arquivo JavaScript compilado corrigido com sucesso!');
    return true;
  }

  console.log(
    '✅ Arquivo JavaScript compilado já está correto ou usa formato alternativo.',
  );
  return false;
}

// Executar as correções
try {
  const tsFixed = fixTypeScriptFile();
  const jsFixed = fixJavaScriptFile();

  if (!tsFixed && !jsFixed) {
    console.log('✨ Nenhuma correção foi necessária. Tudo está em ordem!');
  } else {
    console.log('🚀 Correções aplicadas com sucesso!');
  }
} catch (error) {
  console.error('❌ Erro ao aplicar correções:', error);
  process.exit(1);
}
