/**
 * Integration Tests Setup
 *
 * This file runs before all integration tests.
 * It prepares the test database and ensures clean state.
 *
 * IMPORTANT: Using PostgreSQL (Neon) for tests
 * Same database engine as development and production
 */

import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { join } from 'path';

// Load test environment variables FIRST and override any .env
config({ path: join(__dirname, '..', '.env.test'), override: true });

// Log the DATABASE_URL being used (for debugging)
console.log(
  '🔍 DATABASE_URL loaded:',
  process.env.DATABASE_URL?.substring(0, 50) + '...',
);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function setupIntegrationTests() {
  console.log('🔧 Setting up integration tests...');
  console.log('📦 Using PostgreSQL test database (Neon)');

  try {
    // Push schema to test database (creates tables if they don't exist)
    // Now using standard schema.prisma with PostgreSQL
    console.log('📦 Pushing Prisma schema to test database...');
    console.log(
      '🔗 Using URL:',
      process.env.DATABASE_URL?.substring(0, 60) + '...',
    );

    // Execute prisma db push with explicit DATABASE_URL
    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: 'test',
      },
      stdio: 'inherit', // Show output for debugging
      cwd: join(__dirname, '..'),
    });

    // Clean database (delete all data but keep schema)
    console.log('🧹 Cleaning test database...');
    await cleanDatabase();

    console.log('✅ Integration tests setup complete');
  } catch (error) {
    console.error('❌ Error during integration tests setup:', error);
    throw error;
  }
}

async function cleanDatabase() {
  // Delete in order to respect foreign keys
  await prisma.guestHistory.deleteMany({});
  await prisma.guest.deleteMany({});
}

// Run setup before all tests
beforeAll(async () => {
  await setupIntegrationTests();
});

// Clean database before each test for isolation
beforeEach(async () => {
  await cleanDatabase();
});

// Disconnect Prisma after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Export prisma instance for tests
export { prisma };
