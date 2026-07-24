import type { VercelRequest, VercelResponse } from '@vercel/node'
import { bodyObject, fail, method } from '../server/http.js'
import { QUESTIONS } from '../server/quiz.js'
import { sessionGuestId } from '../server/session.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'POST')) return
  if (!sessionGuestId(req)) return fail(res, 401, 'AUTHENTICATION_REQUIRED')
  const body = bodyObject(req)
  const question = body?.question
  const answer = body?.answer
  if (!Number.isInteger(question) || !Number.isInteger(answer) || (question as number) < 0 || (question as number) >= QUESTIONS.length || (answer as number) < 0 || (answer as number) > 3) {
    return fail(res, 400, 'INVALID_ANSWER')
  }
  return res.json({ correct: QUESTIONS[question as number].correct === answer })
}
