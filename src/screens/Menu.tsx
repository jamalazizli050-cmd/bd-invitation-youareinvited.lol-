import { useEffect, useState } from 'react'
import type { Screen } from '../types'
import { MusicPlayer } from '../components/MusicPlayer'

const items: { label: string; screen: Screen }[] = [
  { label: 'NEW GAME', screen: 'intro' },
  { label: 'JOIN THE PARTY', screen: 'party' },
  { label: 'LOAD GAME', screen: 'load' },
  { label: 'MULTIPLAYER', screen: 'lobby' },
]

export function Menu({ ready, total, go, move, confirm }: { ready: number; total: number; go: (s: Screen) => void; move: () => void; confirm: () => void }) {
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        setSelected((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length)
        move()
      } else if (event.key === 'Enter') {
        confirm()
        go(items[selected].screen)
      }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [selected, go, move, confirm])
  return (
    <section className="menu-screen screen-enter">
      <header className="title-lockup"><p>THE SYSTEM PRESENTS</p><h1>17TH<br />BIRTHDAY</h1><span>GAME MODE SELECT</span></header>
      <nav className="menu-list" aria-label="Main menu">
        {items.map((item, index) => (
          <button key={item.label} className={selected === index ? 'selected' : ''} onFocus={() => setSelected(index)} onMouseEnter={() => { if (selected !== index) move(); setSelected(index) }} onClick={() => { confirm(); go(item.screen) }}>
            <span className="pointer">{selected === index ? '>' : '\u00A0'}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="ready-summary"><strong>{ready} / {total || 7}</strong> PLAYERS READY</div>
      <MusicPlayer />
    </section>
  )
}
