import type { ReactNode } from 'react'

export function GameFrame({ children, sound, onToggleSound }: { children: ReactNode; sound: boolean; onToggleSound: () => void }) {
  return (
    <main className="game-frame">
      <div className="noise" aria-hidden="true" />
      <div className="corner top-left">BUILD 17.0.0</div>
      <div className="corner top-right"><span className="online-dot" /> ONLINE</div>
      <div className="corner bottom-left">LOBBY: ACTIVE</div>
      <button className="sound-toggle corner bottom-right" onClick={onToggleSound} aria-label={`${sound ? 'Mute' : 'Enable'} interface sounds`}>
        SOUND: {sound ? 'ON' : 'OFF'}
      </button>
      <div className="screen">{children}</div>
    </main>
  )
}
