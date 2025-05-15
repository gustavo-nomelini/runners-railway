import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    // Test the connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Successfully connected to the database');

    // Get PostgreSQL version
    const version = await prisma.$queryRaw`SELECT version()`;
    console.log('📊 Database version:', version);
  } catch (error) {
    console.error('❌ Database connection failed');
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().catch((e) => {
  console.error(e);
  process.exit(1);
});
