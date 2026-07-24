export function Party({ onRsvp, back }: { onRsvp: () => void; back: () => void }) {
  return (
    <section className="panel briefing screen-enter">
      <button className="back" onClick={back}>← MAIN MENU</button>
      <p className="eyebrow">MISSION FILE 017</p>
      <h2>MISSION BRIEFING</h2>
      <div className="mission-grid">
        <div><span>EVENT</span><strong>17TH BIRTHDAY</strong></div>
        <div><span>DATE</span><strong>30 JULY 2026</strong></div>
        <div><span>START TIME</span><strong>15:00</strong></div>
        <div><span>LOCATION</span><strong>ELMLER CONCEPT ANTICAFE</strong></div>
      </div>
      <a className="button secondary" href="https://maps.app.goo.gl/Rzs2tGmmQosWRjY6A" target="_blank" rel="noreferrer">[ OPEN MAP ↗ ]</a>
      <div className="objective"><span>OBJECTIVE</span><p>SHOW UP.<br />HAVE FUN.<br />TRY NOT TO DIE.</p></div>
      <button className="button primary major" onClick={onRsvp}>HELL YEAH</button>
    </section>
  )
}
