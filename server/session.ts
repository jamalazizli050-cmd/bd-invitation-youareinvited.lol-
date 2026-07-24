import { createHmac, timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const COOKIE = 'birthday_session'
const MAX_AGE = 60 * 60 * 24 * 30

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value || value.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters')
  return value
}

function sign(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createSession(res: VercelResponse, guestId: number) {
  const payload = Buffer.from(JSON.stringify({ guestId, exp: Date.now() + MAX_AGE * 1000 })).toString('base64url')
  const token = `${payload}.${sign(payload)}`
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${secure}`)
}

export function sessionGuestId(req: VercelRequest): number | null {
  try {
    const cookieHeader = typeof req.headers.cookie === 'string' ? req.headers.cookie : ''
    const headerCookie = cookieHeader
      .split(';')
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE}=`))
      ?.slice(COOKIE.length + 1)
    const raw = req.cookies?.[COOKIE] ?? headerCookie
    if (!raw) return null
    const [payload, signature] = raw.split('.')
    if (!payload || !signature) return null
    const expected = Buffer.from(sign(payload))
    const actual = Buffer.from(signature)
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { guestId?: unknown; exp?: unknown }
    if (!Number.isInteger(data.guestId) || typeof data.exp !== 'number' || data.exp < Date.now()) return null
    return data.guestId as number
  } catch {
    return null
  }
}
