export type Player = { id: string; name: string }
export type Round = { id: string; scores: Record<string, number> }
export type Game = {
  id: string
  name: string
  date: string // ISO date, yyyy-mm-dd
  players: Player[]
  rounds: Round[]
  finished: boolean
}

const STORAGE_KEY = 'gamenight-games'

export function loadGames(): Game[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveGames(games: Game[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
  } catch {
    /* storage unavailable — game state just won't persist across reloads */
  }
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10)
}

export function totalsFor(game: Game): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const player of game.players) totals[player.id] = 0
  for (const round of game.rounds) {
    for (const player of game.players) {
      totals[player.id] += round.scores[player.id] ?? 0
    }
  }
  return totals
}

export function rankedPlayers(game: Game): { player: Player; total: number; rank: number }[] {
  const totals = totalsFor(game)
  const sorted = [...game.players].sort((a, b) => totals[b.id] - totals[a.id])
  return sorted.map((player, index) => ({ player, total: totals[player.id], rank: index + 1 }))
}
