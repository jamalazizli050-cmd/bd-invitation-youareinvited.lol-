import type { VercelRequest, VercelResponse } from '@vercel/node'

export function method(req: VercelRequest, res: VercelResponse, allowed: string) {
  if (req.method !== allowed) {
    res.setHeader('Allow', allowed)
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
    return false
  }
  return true
}

export function fail(res: VercelResponse, status = 500, code = 'SERVER_ERROR') {
  return res.status(status).json({ error: code })
}

export function bodyObject(req: VercelRequest): Record<string, unknown> | null {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return null
  return req.body as Record<string, unknown>
}
