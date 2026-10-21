import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// `.env.local` holds the real credentials, `.env` is an optional fallback.
config({ path: '.env.local' });
config({ path: '.env' });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
