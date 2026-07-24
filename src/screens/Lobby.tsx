import type { LobbyData } from '../types'

export function Lobby({ data, loading, error, retry, back }: { data: LobbyData; loading: boolean; error: boolean; retry: () => void; back: () => void }) {
  const percent = data.total ? (data.ready / data.total) * 100 : 0
  return (
    <section className="panel lobby screen-enter">
      <button className="back" onClick={back}>← MAIN MENU</button>
      <p className="eyebrow">NETWORK SESSION 017</p><h2>MULTIPLAYER LOBBY</h2>
      {loading && !data.guests.length ? <p className="loading">CONNECTING TO LOBBY...</p> : error ? <div className="message error"><strong>CONNECTION LOST</strong><span>SERVER DID NOT RESPOND.</span><button onClick={retry}>[ RETRY ]</button></div> : <>
        <div className="lobby-count"><strong>{data.ready} / {data.total || 7}</strong> PLAYERS READY</div>
        <div className="progress"><i style={{ width: `${percent}%` }} /></div>
        <div className="player-list">{data.guests.map((guest, i) => <div key={guest.displayName}><span><b>{String(i + 1).padStart(2, '0')}</b> {guest.displayName}</span><strong className={guest.ready ? 'ready' : 'waiting'}>{guest.ready ? '● READY' : '○ WAITING'}</strong></div>)}</div>
        {data.total === 7 && data.ready === 7 && <div className="full-lobby"><strong>FULL LOBBY</strong><span>ALL PLAYERS READY.<br />LET THE CHAOS BEGIN.</span></div>}
        <p className="refresh">AUTO-REFRESH: 10 SEC</p>
      </>}
    </section>
  )
}
