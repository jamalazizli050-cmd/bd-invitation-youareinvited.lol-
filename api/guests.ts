import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../server/db.js'
import { fail, method } from '../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'GET')) return
  try {
    const rows = await db()`SELECT display_name, is_ready FROM guests ORDER BY id`
    res.setHeader('Cache-Control', 'no-store')
    return res.json({
      ready: rows.filter((row) => row.is_ready).length,
      total: rows.length,
      guests: rows.map((row) => ({ displayName: row.display_name, ready: row.is_ready })),
    })
  } catch (error) {
    console.error('guests', error)
    return fail(res, 503, 'DATABASE_UNAVAILABLE')
  }
}
