export type Screen = 'menu' | 'intro' | 'party' | 'rsvp' | 'lobby' | 'load' | 'quiz' | 'results' | 'leaderboard'
export type Guest = { displayName: string; ready: boolean }
export type LobbyData = { ready: number; total: number; guests: Guest[] }
export type Question = { text: string; choices: string[] }
export type Result = { score: number; total: number; rank: string }
export type Leader = { position: number; displayName: string; score: number }
