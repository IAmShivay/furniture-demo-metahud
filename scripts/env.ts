import { config } from 'dotenv';

/**
 * Loads environment variables for the CLI scripts.
 * `.env.local` (git-ignored, holds real credentials) takes precedence over
 * `.env` (optional fallback).
 */
config({ path: '.env.local' });
config({ path: '.env' });
