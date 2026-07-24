import { useEffect, useState } from 'react'

const lines = [
  'INITIALIZING...',
  'DATE............. 30.07.2026',
  'TIME............. 15:00',
  'LOCATION......... CLASSIFIED',
  'PLAYERS.......... 0/7',
  '',
  'MISSION DATA LOADED.',
]

export function Intro({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (shown < lines.length) {
      const timer = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? 450 : 280)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setReady(true), 650)
    return () => window.clearTimeout(timer)
  }, [shown])
  useEffect(() => {
    if (!ready) return
    const handler = () => onDone()
    window.addEventListener('keydown', handler, { once: true })
    return () => window.removeEventListener('keydown', handler)
  }, [ready, onDone])
  return (
    <button className="intro-screen" onClick={() => ready && onDone()} disabled={!ready}>
      {!ready ? (
        <div className="boot-lines">{lines.slice(0, shown).map((line, i) => <p key={i}>{line || '\u00A0'}</p>)}</div>
      ) : (
        <div className="intro-final">
          <p>A NEW CHAPTER BEGINS.</p>
          <h1>17TH<br />BIRTHDAY</h1>
          <p className="blink">[ PRESS ANY KEY TO CONTINUE ]</p>
        </div>
      )}
    </button>
  )
}
