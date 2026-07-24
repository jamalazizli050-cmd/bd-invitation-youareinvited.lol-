import { neon } from '@neondatabase/serverless'
import { requireDatabaseUrl } from './env.js'

const sql = neon(requireDatabaseUrl())
const connection = await sql`SELECT 1 AS ok`
const tables = await sql`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name IN ('guests', 'quiz_results')
  ORDER BY table_name`
const names = new Set(tables.map((row) => row.table_name))

if (connection[0]?.ok !== 1 || !names.has('guests') || !names.has('quiz_results')) {
  throw new Error('Database check failed: required tables are missing')
}

console.log('Database connection OK. Required tables: guests, quiz_results.')
