import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    'DATABASE_URL is missing. Copy .env.example to .env.local and add your PostgreSQL connection string.'
  );
}

/**
 * Neon serverless HTTP driver.
 *
 * The HTTP driver talks to Postgres over WebSockets-free HTTPS requests, which
 * works both on a local machine and on serverless platforms (Vercel, etc.)
 * without opening a persistent TCP connection.
 */
const sql = neon(connectionString);

export const db = drizzle(sql, { schema });

export { schema };
