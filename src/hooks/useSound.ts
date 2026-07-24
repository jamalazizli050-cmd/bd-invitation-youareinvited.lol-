import { useCallback, useRef, useState } from 'react'

type Sound = 'move' | 'confirm' | 'error' | 'granted' | 'correct' | 'wrong'

const notes: Record<Sound, [number, number, OscillatorType][]> = {
  move: [[380, 0.035, 'square']],
  confirm: [[520, 0.05, 'square'], [760, 0.07, 'square']],
  error: [[170, 0.08, 'sawtooth'], [120, 0.1, 'sawtooth']],
  granted: [[330, 0.06, 'square'], [520, 0.06, 'square'], [880, 0.14, 'sine']],
  correct: [[540, 0.06, 'square'], [810, 0.12, 'square']],
  wrong: [[210, 0.1, 'sawtooth'], [150, 0.14, 'sawtooth']],
}

export function useSound() {
  const [enabled, setEnabled] = useState(true)
  const context = useRef<AudioContext | null>(null)
  const play = useCallback((name: Sound) => {
    if (!enabled) return
    const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = context.current ?? new Audio()
    context.current = ctx
    const start = ctx.currentTime
    let offset = 0
    for (const [frequency, duration, type] of notes[name]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.value = frequency
      gain.gain.setValueAtTime(0.035, start + offset)
      gain.gain.exponentialRampToValueAtTime(0.001, start + offset + duration)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start + offset)
      osc.stop(start + offset + duration)
      offset += duration
    }
  }, [enabled])
  return { enabled, setEnabled, play }
}
