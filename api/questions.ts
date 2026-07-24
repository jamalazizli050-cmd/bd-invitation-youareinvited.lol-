import type { VercelRequest, VercelResponse } from '@vercel/node'
import { method } from '../server/http.js'
import { sessionGuestId } from '../server/session.js'
import { publicQuestions } from '../server/quiz.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'GET')) return
  if (!sessionGuestId(req)) return res.status(401).json({ error: 'AUTHENTICATION_REQUIRED' })
  res.setHeader('Cache-Control', 'private, no-store')
  return res.json({ questions: publicQuestions })
}
