import { readFileSync } from 'node:fs'
import { parse } from 'dotenv'

// Standalone tsx scripts do not inherit Vite/Vercel's automatic env loading.
// Preserve meaningful shell variables; treat an empty inherited variable as unset.
try {
  const local = parse(readFileSync('.env.local'))
  for (const [name, value] of Object.entries(local)) {
    if (!process.env[name]) process.env[name] = value
  }
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
}

export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      'DATABASE_URL is required. Pull an environment containing the connected Neon resource into .env.local.',
    )
  }
  return url
}
