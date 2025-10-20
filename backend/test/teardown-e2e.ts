import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function globalTeardown() {
  console.log('\n🧹 Tearing down E2E tests...');

  try {
    await prisma.$disconnect();
    console.log('✅ E2E tests teardown complete\n');
  } catch (error) {
    console.error('⚠️ E2E teardown warning:', error);
  }
}
