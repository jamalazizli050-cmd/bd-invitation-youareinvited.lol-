import { readFile } from 'node:fs/promises'
import { neon } from '@neondatabase/serverless'
import { requireDatabaseUrl } from './env.js'

const sql = neon(requireDatabaseUrl())
await sql`SELECT 1`
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')

function splitSql(source: string) {
  const statements: string[] = []
  let current = ''
  let singleQuoted = false
  let dollarQuoted = false

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index]
    const next = source[index + 1]
    if (!singleQuoted && char === '$' && next === '$') {
      dollarQuoted = !dollarQuoted
      current += '$$'
      index += 1
      continue
    }
    if (!dollarQuoted && char === "'" && source[index - 1] !== '\\') {
      singleQuoted = !singleQuoted
    }
    if (char === ';' && !singleQuoted && !dollarQuoted) {
      if (current.trim()) statements.push(current.trim())
      current = ''
      continue
    }
    current += char
  }
  if (current.trim()) statements.push(current.trim())
  return statements
}

for (const statement of splitSql(schema)) {
  await sql.query(statement)
}
console.log('Database migration complete and connection verified.')
