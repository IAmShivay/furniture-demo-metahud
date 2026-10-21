






import './env';

import { migrate } from 'drizzle-orm/neon-http/migrator';
import { sql } from 'drizzle-orm';

import { db } from '../src/db';

const migrationsFolder = './drizzle';

async function reset() {
  console.log('⚠️  Resetting database (dropping tables)…');
  await db.execute(sql`DROP SCHEMA IF EXISTS drizzle CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS products CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS newsletter_subscribers CASCADE;`);
}

async function main() {
  const shouldReset = process.argv.includes('--reset');

  if (shouldReset) {
    await reset();
  }

  console.log('📦 Applying migrations…');
  await migrate(db, { migrationsFolder });
  console.log('✅ Migrations applied successfully.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
