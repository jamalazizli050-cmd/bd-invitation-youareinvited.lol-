import type { VercelRequest, VercelResponse } from '@vercel/node'
import { db } from '../server/db.js'
import { bodyObject, fail, method } from '../server/http.js'
import { QUESTIONS, rank } from '../server/quiz.js'
import { sessionGuestId } from '../server/session.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!method(req, res, 'POST')) return
  const guestId = sessionGuestId(req)
  if (!guestId) return fail(res, 401, 'AUTHENTICATION_REQUIRED')
  const body = bodyObject(req)
  const answers = body?.answers
  if (!Array.isArray(answers) || answers.length !== QUESTIONS.length || !answers.every((x) => Number.isInteger(x) && x >= 0 && x <= 3)) {
    return fail(res, 400, 'INVALID_ANSWERS')
  }
  const score = QUESTIONS.reduce((total, question, index) => total + (answers[index] === question.correct ? 1 : 0), 0)
  try {
    await db()`INSERT INTO quiz_results (guest_id, score, rank) VALUES (${guestId}, ${score}, ${rank(score)})`
    return res.json({ score, total: QUESTIONS.length, rank: rank(score) })
  } catch (error) {
    console.error('quiz', error)
    return fail(res, 503, 'SAVE_FAILED')
  }
}
