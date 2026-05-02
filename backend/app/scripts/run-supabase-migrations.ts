/**
 * Applies `_common/migrations/*.sql` via node-postgres (no `psql` binary).
 *
 * Kept as a standalone Node script rather than a Nest injectable so DDL stays out of the HTTP
 * runtime. Use `NestFactory.createApplicationContext` later only if you need ConfigModule parity.
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  connectMigrationClient,
  formatMigrationFailureHint,
  isConnectionRetryable,
} from './supabase-migration-connection';

function resolveRepositoryRoot(): string {
  return path.join(__dirname, '../../..');
}

function resolveMigrateDatabaseUrl(): string {
  const primaryUrl = process.env.SUPABASE_MIGRATE_DB_URL?.trim();
  const fallbackUrl = process.env.SUPABASE_DB_URL?.trim();
  const resolvedUrl = primaryUrl || fallbackUrl;

  if (!resolvedUrl) {
    console.error('Set SUPABASE_DB_URL or SUPABASE_MIGRATE_DB_URL in _common/.env');
    process.exit(1);
  }

  return resolvedUrl;
}

async function runMigrations(): Promise<void> {
  const repositoryRoot = resolveRepositoryRoot();
  const environmentPath = path.join(repositoryRoot, '_common', '.env');

  if (!fs.existsSync(environmentPath)) {
    console.error(`Missing ${environmentPath}`);
    process.exit(1);
  }

  dotenv.config({ path: environmentPath, quiet: true });

  const migrateDatabaseUrl = resolveMigrateDatabaseUrl();
  const migrationsDirectory = path.join(repositoryRoot, '_common', 'migrations');

  if (!fs.existsSync(migrationsDirectory)) {
    console.error(`Missing migrations directory ${migrationsDirectory}`);
    process.exit(1);
  }

  const migrationFileNames = fs
    .readdirSync(migrationsDirectory)
    .filter((fileName) => fileName.endsWith('.sql'))
    .sort();

  if (migrationFileNames.length === 0) {
    console.log(`No SQL files in ${migrationsDirectory}/`);

    return;
  }

  const client = await connectMigrationClient(migrateDatabaseUrl);

  try {
    for (const fileName of migrationFileNames) {
      const fullPath = path.join(migrationsDirectory, fileName);
      const sqlText = fs.readFileSync(fullPath, 'utf8');

      console.log(`Applying ${fullPath} ...`);
      await client.query(sqlText);
    }

    console.log('Supabase migrations applied.');
  } finally {
    await client.end();
  }
}

void runMigrations().catch((error: unknown) => {
  console.error(error);

  if (isConnectionRetryable(error)) {
    const migrateDatabaseUrl =
      process.env.SUPABASE_MIGRATE_DB_URL?.trim() || process.env.SUPABASE_DB_URL?.trim();

    if (migrateDatabaseUrl) {
      console.error(formatMigrationFailureHint(migrateDatabaseUrl));
    }
  }

  process.exit(1);
});
