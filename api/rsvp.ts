import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { db } from '../server/db.js'
import { bodyObject, fail, method } from '../server/http.js'
import { createSession } from '../server/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'POST')) return
  const body = bodyObject(req)
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const code = typeof body?.code === 'string' ? body.code : ''
  if (!name || name.length > 80 || !code || code.length > 128) return fail(res, 400, 'INVALID_CREDENTIALS')
  try {
    const rows = await db()`SELECT id, display_name, code_hash, is_ready FROM guests WHERE lower(display_name) = lower(${name}) LIMIT 1`
    const guest = rows[0]
    if (!guest || !(await bcrypt.compare(code, guest.code_hash))) return fail(res, 401, 'INVALID_CREDENTIALS')
    if (!guest.is_ready) {
      await db()`
        UPDATE guests
        SET is_ready = TRUE, confirmed_at = NOW()
        WHERE id = ${guest.id} AND is_ready = FALSE`
    }
    const guestId = Number(guest.id)
    if (!Number.isSafeInteger(guestId)) throw new Error('Invalid guest id returned by database')
    createSession(res, guestId)
    return res.json({ guest: { displayName: guest.display_name, ready: true } })
  } catch (error) {
    console.error('rsvp', error)
    return fail(res, 503, 'DATABASE_UNAVAILABLE')
  }
}
