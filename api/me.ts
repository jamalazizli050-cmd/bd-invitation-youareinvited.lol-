import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../server/db.js'
import { fail, method } from '../server/http.js'
import { sessionGuestId } from '../server/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'GET')) return
  const guestId = sessionGuestId(req)
  res.setHeader('Cache-Control', 'no-store')
  if (!guestId) return res.json({ authenticated: false })
  try {
    const rows = await db()`SELECT display_name, is_ready FROM guests WHERE id = ${guestId} LIMIT 1`
    const guest = rows[0]
    if (!guest) return res.json({ authenticated: false })
    return res.json({ authenticated: true, guest: { displayName: guest.display_name, ready: guest.is_ready } })
  } catch (error) {
    console.error('me', error)
    return fail(res, 503, 'DATABASE_UNAVAILABLE')
  }
}
