import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Question, Result } from '../types'

export function Quiz({ done, back, play }: { done: (r: Result) => void; back: () => void; play: (s: 'correct' | 'wrong' | 'confirm' | 'error') => void }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [feedback, setFeedback] = useState<{ correct: boolean; line: string } | null>(null)
  const [status, setStatus] = useState<'loading' | 'playing' | 'saving' | 'save-error' | 'error'>('loading')
  useEffect(() => {
    api.get<{ questions: Question[] }>('/api/questions').then((data) => { setQuestions(data.questions); setStatus('playing') }).catch(() => setStatus('error'))
  }, [])
  const answer = async (choice: number) => {
    if (feedback || status !== 'playing') return
    const next = [...answers, choice]
    setAnswers(next)
    try {
      const data = await api.post<{ correct: boolean }>('/api/answer', { question: index, answer: choice })
      play(data.correct ? 'correct' : 'wrong')
      const correctLines = ['LORE VERIFIED.', 'ACCEPTABLE.', 'BRO ACTUALLY KNOWS.']
      const wrongLines = ['bro do you even know me', 'LORE CHECK FAILED.', 'embarrassing.']
      setFeedback({ correct: data.correct, line: (data.correct ? correctLines : wrongLines)[index % 3] })
      window.setTimeout(() => {
        setFeedback(null)
        if (index + 1 < questions.length) setIndex((n) => n + 1)
        else save(next)
      }, 900)
    } catch { play('error'); setStatus('error') }
  }
  const save = async (finalAnswers = answers) => {
    setStatus('saving')
    try { done(await api.post<Result>('/api/quiz', { answers: finalAnswers })) }
    catch { setStatus('save-error') }
  }
  if (status === 'loading') return <section className="panel centered"><p className="loading">LOADING SAVE FILE...</p></section>
  if (status === 'error') return <section className="panel centered"><div className="message error"><strong>CONNECTION LOST</strong><span>QUESTION DATA UNAVAILABLE.</span><button onClick={back}>[ RETURN ]</button></div></section>
  if (status === 'saving' || status === 'save-error') return <section className="panel centered">{status === 'saving' ? <p className="loading">UPLOADING SCORE...</p> : <div className="message error"><strong>SAVE DATA FAILED</strong><span>YOUR SCORE HAS NOT BEEN LOST.</span><button onClick={() => save()}>[ RETRY ]</button></div>}</section>
  const question = questions[index]
  return (
    <section className="panel quiz screen-enter">
      <div className="quiz-head"><span>QUESTION {String(index + 1).padStart(2, '0')} / 15</span><span>{Math.round((index / 15) * 100)}%</span></div>
      <div className="progress"><i style={{ width: `${(index / 15) * 100}%` }} /></div>
      <h2>{question.text}</h2>
      <div className="answers">{question.choices.map((choice, i) => <button key={choice} disabled={!!feedback} onClick={() => answer(i)}><b>[{String.fromCharCode(65 + i)}]</b><span>{choice}</span></button>)}</div>
      {feedback && <div className={`feedback ${feedback.correct ? 'correct' : 'wrong'}`}><strong>{feedback.correct ? 'CORRECT  +1 XP' : 'WRONG'}</strong><span>{feedback.line}</span></div>}
    </section>
  )
}
