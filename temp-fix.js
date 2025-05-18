/**
 * Temporary script to fix the Prisma repository issue
 */

const fs = require('fs');
const path = require('path');

console.log('Starting fix...');

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

try {
  // Fix the TypeScript file
  if (fs.existsSync(srcPath)) {
    console.log(`Found source file: ${srcPath}`);
    let content = fs.readFileSync(srcPath, 'utf-8');

    // Check if already has id: id format
    if (content.includes('id: id')) {
      console.log('Source file already has the correct format (id: id)');

      // Try regenerating the compiled file
      console.log('Will try recompiling the file...');
    } else {
      // Fix the format
      content = content.replace(/where: {\s*id\s*},/g, 'where: { id: id },');
      content = content.replace(/where: {\s*id\s*}/g, 'where: { id: id }');

      fs.writeFileSync(srcPath, content, 'utf-8');
      console.log('✅ Source file updated with correct format');
    }
  } else {
    console.log(`Source file not found: ${srcPath}`);
  }

  // Fix the compiled JavaScript file
  if (fs.existsSync(distPath)) {
    console.log(`Found compiled file: ${distPath}`);
    let content = fs.readFileSync(distPath, 'utf-8');

    // Check if already has id: id format
    if (content.includes('id: id')) {
      console.log('Compiled file already has the correct format (id: id)');
    } else {
      // Fix the format
      content = content.replace(/where: {\s*id\s*},/g, 'where: { id: id },');
      content = content.replace(/where: {\s*id\s*}/g, 'where: { id: id }');

      fs.writeFileSync(distPath, content, 'utf-8');
      console.log('✅ Compiled file updated with correct format');
    }
  } else {
    console.log(`Compiled file not found: ${distPath}`);
  }

  console.log('Fix completed!');
} catch (error) {
  console.error('❌ Error during fix:', error);
}
