import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../server/db.js'
import { fail, method } from '../server/http.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'GET')) return
  try {
    const rows = await db()`
      SELECT g.display_name, best.score, best.completed_at
      FROM guests g
      JOIN LATERAL (
        SELECT score, completed_at FROM quiz_results
        WHERE guest_id = g.id ORDER BY score DESC, completed_at ASC LIMIT 1
      ) best ON TRUE
      ORDER BY best.score DESC, best.completed_at ASC`
    res.setHeader('Cache-Control', 'no-store')
    return res.json({ entries: rows.map((row, index) => ({ position: index + 1, displayName: row.display_name, score: row.score })) })
  } catch (error) {
    console.error('leaderboard', error)
    return fail(res, 503, 'DATABASE_UNAVAILABLE')
  }
}
