import { useCallback, useEffect, useState } from 'react'
import { GameFrame } from './components/GameFrame'
import { api } from './lib/api'
import { useSound } from './hooks/useSound'
import { Intro } from './screens/Intro'
import { Lobby } from './screens/Lobby'
import { Menu } from './screens/Menu'
import { Party } from './screens/Party'
import { Quiz } from './screens/Quiz'
import { Results } from './screens/Results'
import { Rsvp } from './screens/Rsvp'
import type { Guest, Leader, LobbyData, Result, Screen } from './types'

const emptyLobby: LobbyData = { ready: 0, total: 7, guests: [] }

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => localStorage.getItem('birthday_intro_complete') ? 'menu' : 'intro')
  const [guest, setGuest] = useState<Guest | null>(null)
  const [lobby, setLobby] = useState<LobbyData>(emptyLobby)
  const [lobbyLoading, setLobbyLoading] = useState(true)
  const [lobbyError, setLobbyError] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [leaders, setLeaders] = useState<Leader[]>([])
  const sound = useSound()

  const refreshLobby = useCallback(async () => {
    setLobbyLoading(true)
    try { setLobby(await api.get<LobbyData>('/api/guests')); setLobbyError(false) }
    catch { setLobbyError(true) }
    finally { setLobbyLoading(false) }
  }, [])
  const refreshLeaders = useCallback(async () => {
    try { setLeaders((await api.get<{ entries: Leader[] }>('/api/leaderboard')).entries) } catch { setLeaders([]) }
  }, [])
  useEffect(() => {
    refreshLobby()
    api.get<{ authenticated: boolean; guest?: Guest }>('/api/me').then((data) => data.authenticated && data.guest && setGuest(data.guest)).catch(() => {})
  }, [refreshLobby])
  useEffect(() => {
    if (screen !== 'lobby') return
    refreshLobby()
    const timer = window.setInterval(refreshLobby, 10_000)
    return () => window.clearInterval(timer)
  }, [screen, refreshLobby])
  useEffect(() => {
    const offline = () => setNotice('NETWORK CONNECTION LOST')
    const online = () => { setNotice('NETWORK RESTORED'); window.setTimeout(() => setNotice(null), 1800) }
    window.addEventListener('offline', offline); window.addEventListener('online', online)
    return () => { window.removeEventListener('offline', offline); window.removeEventListener('online', online) }
  }, [])
  const go = useCallback((next: Screen) => {
    if (next === 'load' && !guest?.ready) { setScreen('load'); return }
    setScreen(next)
  }, [guest])
  const introDone = useCallback(() => {
    localStorage.setItem('birthday_intro_complete', '1'); sound.play('confirm'); setScreen('menu')
  }, [sound])
  const rsvpSuccess = (verified: Guest) => {
    setGuest(verified); refreshLobby(); setNotice('NEW CONTENT UNLOCKED — LOAD GAME'); setScreen('menu')
    window.setTimeout(() => setNotice(null), 3500)
  }
  const quizDone = async (value: Result) => {
    setResult(value); await refreshLeaders(); setScreen('results')
  }
  return (
    <GameFrame sound={sound.enabled} onToggleSound={() => sound.setEnabled(!sound.enabled)}>
      {notice && <div className="toast" role="status">{notice}</div>}
      {screen === 'intro' && <Intro onDone={introDone} />}
      {screen === 'menu' && <Menu ready={lobby.ready} total={lobby.total} go={go} move={() => sound.play('move')} confirm={() => sound.play('confirm')} />}
      {screen === 'party' && <Party back={() => setScreen('menu')} onRsvp={() => setScreen('rsvp')} />}
      {screen === 'rsvp' && <Rsvp back={() => setScreen('party')} success={rsvpSuccess} play={sound.play} />}
      {screen === 'lobby' && <Lobby data={lobby} loading={lobbyLoading} error={lobbyError} retry={refreshLobby} back={() => setScreen('menu')} />}
      {screen === 'load' && (!guest?.ready ? <section className="panel centered locked screen-enter"><h2>SAVE FILE LOCKED</h2><p>JOIN THE PARTY FIRST.</p><button className="button primary" onClick={() => setScreen('party')}>[ GO TO JOIN THE PARTY ]</button><button className="back-inline" onClick={() => setScreen('menu')}>← MAIN MENU</button></section> : <section className="panel centered save-file screen-enter"><button className="back" onClick={() => setScreen('menu')}>← MAIN MENU</button><p className="eyebrow">LOAD GAME</p><h2>SAVE FILE FOUND</h2><div className="save-slot"><strong>BIRTHDAY QUIZ</strong><span>QUESTIONS: 15</span><span>PROGRESS: 0%</span><small>PLAYER: {guest.displayName}</small></div><button className="button primary major" onClick={() => setScreen('quiz')}>[ LOAD ]</button></section>)}
      {screen === 'quiz' && <Quiz done={quizDone} back={() => setScreen('menu')} play={sound.play} />}
      {screen === 'results' && result && <Results result={result} leaders={leaders} current={guest?.displayName ?? ''} retake={() => setScreen('load')} menu={() => setScreen('menu')} />}
    </GameFrame>
  )
}
