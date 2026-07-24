import { useState, type FormEvent } from 'react'
import { api } from '../lib/api'
import type { Guest } from '../types'

export function Rsvp({ success, back, play }: { success: (guest: Guest) => void; back: () => void; play: (s: 'confirm' | 'error' | 'granted') => void }) {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'denied'>('idle')
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (status === 'loading') return
    play('confirm'); setStatus('loading')
    try {
      const data = await api.post<{ guest: Guest }>('/api/rsvp', { name, code })
      play('granted'); success(data.guest)
    } catch (error) {
      play('error'); setStatus('denied')
    }
  }
  return (
    <section className="panel terminal screen-enter">
      <button className="back" onClick={back}>← MISSION BRIEFING</button>
      <p className="eyebrow">SECURITY CHECKPOINT</p><h2>IDENTIFICATION REQUIRED</h2><p>WHO ARE YOU?</p>
      <form onSubmit={submit}>
        <label>PLAYER NAME<input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} autoComplete="username" required /></label>
        <label>SECRET CODE<input value={code} onChange={(e) => setCode(e.target.value)} maxLength={128} type="password" autoComplete="current-password" required /></label>
        <button className="button primary" disabled={status === 'loading'}>{status === 'loading' ? 'VERIFYING PLAYER...' : '[ VERIFY ]'}</button>
      </form>
      {status === 'denied' && <div className="message error" role="alert"><strong>ACCESS DENIED</strong><span>INVALID PLAYER CREDENTIALS.<br />NICE TRY.</span></div>}
    </section>
  )
}
