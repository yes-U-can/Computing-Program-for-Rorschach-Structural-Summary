#!/usr/bin/env node

const path = require('path');
const { config } = require('dotenv');
const { Client } = require('pg');

config({ path: path.resolve(process.cwd(), '.env.local') });
config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const statements = [
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT',
  'UPDATE "User" SET "role" = \'user\' WHERE "role" IS NULL',
  'ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT \'user\'',
  'ALTER TABLE "User" ALTER COLUMN "role" SET NOT NULL',
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletionRequestedAt" TIMESTAMP(3)',
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletionScheduledAt" TIMESTAMP(3)',
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "activityPoints" INTEGER',
  'UPDATE "User" SET "activityPoints" = 0 WHERE "activityPoints" IS NULL',
  'ALTER TABLE "User" ALTER COLUMN "activityPoints" SET DEFAULT 0',
  'ALTER TABLE "User" ALTER COLUMN "activityPoints" SET NOT NULL',
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tierCode" TEXT',
  'UPDATE "User" SET "tierCode" = \'bronze\' WHERE "tierCode" IS NULL',
  'ALTER TABLE "User" ALTER COLUMN "tierCode" SET DEFAULT \'bronze\'',
  'ALTER TABLE "User" ALTER COLUMN "tierCode" SET NOT NULL',
  'ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "creditBalance" INTEGER',
  'UPDATE "User" SET "creditBalance" = 0 WHERE "creditBalance" IS NULL',
  'ALTER TABLE "User" ALTER COLUMN "creditBalance" SET DEFAULT 0',
  'ALTER TABLE "User" ALTER COLUMN "creditBalance" SET NOT NULL',
];

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    await client.query('BEGIN');
    for (const statement of statements) {
      await client.query(statement);
    }
    await client.query('COMMIT');
    console.log('Auth schema safety patch applied successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error('Failed to apply auth schema safety patch.');
  console.error(error);
  process.exit(1);
});
