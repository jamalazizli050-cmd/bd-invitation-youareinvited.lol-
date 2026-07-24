import type { Leader, Result } from '../types'

export function Results({ result, leaders, current, retake, menu }: { result: Result; leaders: Leader[]; current: string; retake: () => void; menu: () => void }) {
  return (
    <section className="panel results screen-enter">
      <p className="eyebrow">SAVE FILE UPDATED</p><h2>MISSION COMPLETE</h2>
      <div className="score-block"><span>SCORE</span><strong>{result.score} <small>/ 15</small></strong></div>
      <div className="rank-block"><span>RANK</span><strong>{result.rank}</strong></div>
      {result.score === 15 && <div className="achievement"><span>ACHIEVEMENT UNLOCKED</span><strong>PARASOCIAL RELATIONSHIP</strong><p>15 / 15<br />You know information<br />you were never supposed to know.</p></div>}
      <h3>QUIZ LEADERBOARD</h3>
      <div className="highscores">{leaders.length ? leaders.map((entry) => <div className={entry.displayName === current ? 'you' : ''} key={entry.displayName}><span>{String(entry.position).padStart(2, '0')}. {entry.displayName}{entry.displayName === current && '  ◀ YOU'}</span><strong>{entry.score} / 15</strong></div>) : <p>NO HIGH SCORES FOUND.</p>}</div>
      <div className="actions"><button className="button primary" onClick={retake}>[ RETAKE ]</button><button className="button secondary" onClick={menu}>[ MAIN MENU ]</button></div>
    </section>
  )
}
