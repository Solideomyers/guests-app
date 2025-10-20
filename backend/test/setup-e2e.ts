import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

export default async function globalSetup() {
  console.log('\n🔧 Setting up E2E tests...');

  // Load test environment variables FIRST and override
  const envPath = path.resolve(__dirname, '../.env.test');
  dotenv.config({ path: envPath, override: true });

  console.log('📦 Using PostgreSQL test database (Neon)');
  console.log(
    '🔍 DATABASE_URL loaded:',
    process.env.DATABASE_URL?.substring(0, 50) + '...',
  );

  const prisma = new PrismaClient();

  try {
    // Connect to database
    await prisma.$connect();
    console.log('✅ Connected to test database (PostgreSQL)');

    // Push schema to ensure tables exist
    console.log('📋 Ensuring schema is up to date...');
    console.log(
      '🔗 Using URL:',
      process.env.DATABASE_URL?.substring(0, 60) + '...',
    );

    execSync('npx prisma db push --skip-generate --accept-data-loss', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: 'test',
      },
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });

    // Clean database before tests
    console.log('🧹 Cleaning test database...');
    await prisma.guestHistory.deleteMany();
    await prisma.guest.deleteMany();

    console.log('✅ E2E tests setup complete\n');
  } catch (error) {
    console.error('❌ E2E setup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
