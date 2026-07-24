import bcrypt from 'bcryptjs'
import { neon } from '@neondatabase/serverless'
import { readFile } from 'node:fs/promises'
import { requireDatabaseUrl } from './env.js'

const url = requireDatabaseUrl()
let raw = process.env.GUEST_SEED_DATA
if (!raw) {
  try {
    raw = await readFile(new URL('../guest-seed.private.json', import.meta.url), 'utf8')
  } catch {
    throw new Error(
      'Guest seed data is required. Create ignored guest-seed.private.json from guest-seed.example.json or set GUEST_SEED_DATA.',
    )
  }
}
const data = JSON.parse(raw) as unknown
if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('GUEST_SEED_DATA must be a JSON object')
const entries = Object.entries(data as Record<string, unknown>)
if (entries.length !== 7 || entries.some(([name, code]) => !name || typeof code !== 'string' || !code)) {
  throw new Error('GUEST_SEED_DATA must contain exactly seven non-empty name/code pairs')
}
const validEntries = entries as [string, string][]
const sql = neon(url)
for (const [name, code] of validEntries) {
  const hash = await bcrypt.hash(code, 12)
  await sql`
    INSERT INTO guests (display_name, code_hash)
    VALUES (${name}, ${hash})
    ON CONFLICT (display_name) DO UPDATE SET code_hash = EXCLUDED.code_hash`
}
console.log(`Seeded ${validEntries.length} guests with bcrypt hashes.`)
