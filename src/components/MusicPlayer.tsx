import { useState } from 'react'

export function MusicPlayer() {
  const [open, setOpen] = useState(false)
  return (
    <aside className={`music ${open ? 'open' : ''}`}>
      <button className="music-title" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>♪ 17TH BIRTHDAY OST</span><span>[ {open ? 'CLOSE' : 'OPEN PLAYER'} ]</span>
      </button>
      {open && (
        <div className="spotify-frame">
          <iframe
            title="17TH BIRTHDAY OST on Spotify"
            src="https://open.spotify.com/embed/playlist/5cCFDR3Il6pA7HYzDGZIAW?utm_source=generator&theme=0"
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      )}
    </aside>
  )
}
