import { useEffect, useState } from 'react'
import { loadGames, newId, rankedPlayers, saveGames, totalsFor, type Game } from './data/storage'
import { detectLocale, locales, ui, type Locale } from './i18n'

type View = 'home' | 'setup' | 'play'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split('-')
  if (locale === 'en') return `${month}/${day}/${year}`
  return `${day}/${month}/${year}`
}

// pt, de and fr all use day/month/year — only en swaps the order above.

const medals = ['🥇', '🥈', '🥉']

function shareToWhatsApp(game: Game, locale: Locale) {
  // wa.me's redirect mangles emoji outside the Basic Multilingual Plane
  // (dice, medals, etc.), so the shared message sticks to plain text.
  const t = ui[locale]
  const ranked = rankedPlayers(game)
  const lines = [
    t.waResults(game.name, formatDate(game.date, locale)),
    ...ranked.map(({ player, total, rank }) => t.waLine(rank, player.name, total)),
  ]
  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => detectLocale())
  const [games, setGames] = useState<Game[]>(() => loadGames())
  const [view, setView] = useState<View>('home')
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [showStandings, setShowStandings] = useState(false)

  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [playerInput, setPlayerInput] = useState('')

  const [roundInputs, setRoundInputs] = useState<Record<string, string>>({})

  const t = ui[locale]

  useEffect(() => { saveGames(games) }, [games])

  useEffect(() => {
    window.localStorage.setItem('gamenight-locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }, [locale])

  const activeGame = games.find(g => g.id === activeGameId) ?? null

  function goHome() {
    setView('home')
    setActiveGameId(null)
    setShowStandings(false)
  }

  function startSetup() {
    setName('')
    setDate(today())
    setPlayerNames([])
    setPlayerInput('')
    setView('setup')
  }

  function addPlayerName() {
    const trimmed = playerInput.trim()
    if (!trimmed || playerNames.includes(trimmed)) return
    setPlayerNames(prev => [...prev, trimmed])
    setPlayerInput('')
  }

  function removePlayerName(index: number) {
    setPlayerNames(prev => prev.filter((_, i) => i !== index))
  }

  function createGame() {
    if (!name.trim() || playerNames.length < 1) return
    const game: Game = {
      id: newId(),
      name: name.trim(),
      date,
      players: playerNames.map(playerName => ({ id: newId(), name: playerName })),
      rounds: [],
      finished: false,
    }
    setGames(prev => [game, ...prev])
    setActiveGameId(game.id)
    setRoundInputs({})
    setShowStandings(false)
    setView('play')
  }

  function updateGame(id: string, updater: (game: Game) => Game) {
    setGames(prev => prev.map(g => (g.id === id ? updater(g) : g)))
  }

  function addRound() {
    if (!activeGame) return
    const scores: Record<string, number> = {}
    for (const player of activeGame.players) {
      const raw = roundInputs[player.id]
      scores[player.id] = raw ? Number(raw) || 0 : 0
    }
    updateGame(activeGame.id, g => ({ ...g, rounds: [...g.rounds, { id: newId(), scores }] }))
    setRoundInputs({})
  }

  function undoLastRound() {
    if (!activeGame || activeGame.rounds.length === 0) return
    updateGame(activeGame.id, g => ({ ...g, rounds: g.rounds.slice(0, -1) }))
  }

  function toggleFinished() {
    if (!activeGame) return
    updateGame(activeGame.id, g => ({ ...g, finished: !g.finished }))
    if (!activeGame.finished) setShowStandings(true)
  }

  function deleteGame(id: string) {
    if (!window.confirm(t.confirmDelete)) return
    setGames(prev => prev.filter(g => g.id !== id))
    if (activeGameId === id) goHome()
  }

  function openGame(id: string) {
    setActiveGameId(id)
    setRoundInputs({})
    setShowStandings(false)
    setView('play')
  }

  return <div className="app-shell">
    <header>
      <button className="brand" onClick={goHome} aria-label={t.home}>
        <span className="brand-mark">GN</span>
        <div><strong>GameNight</strong><small>{t.tagline}</small></div>
      </button>
      <div className="header-right">
        {view !== 'home' && <button className="ghost" onClick={goHome}>{t.backToGames}</button>}
        <div className="locale-switch" role="group" aria-label="Language">
          {locales.map(item => (
            <button key={item.id} className={locale === item.id ? 'active' : ''} onClick={() => setLocale(item.id)}>{item.label}</button>
          ))}
        </div>
      </div>
    </header>

    <main>
      {view === 'home' && <>
        <p className="intro">{t.intro}</p>
        <button className="primary" onClick={startSetup}>{t.newGame}</button>

        {games.length === 0
          ? <div className="empty-state"><span>🎲</span><h2>{t.emptyTitle}</h2><p>{t.emptyBody}</p></div>
          : <div className="game-list">
            {games.map(game => {
              const ranked = rankedPlayers(game)
              const leader = ranked[0]
              return <button key={game.id} className="game-card" onClick={() => openGame(game.id)}>
                <div className="game-card-head">
                  <h3>{game.name}</h3>
                  {game.finished && <span className="badge">{t.finished}</span>}
                </div>
                <p>{formatDate(game.date, locale)} · {t.gameSummary(game.players.length, game.rounds.length)}</p>
                {leader && game.rounds.length > 0 && <p className="leader">{t.leaderLine(leader.player.name, leader.total)}</p>}
                <span className="delete-link" onClick={event => { event.stopPropagation(); deleteGame(game.id) }}>{t.delete}</span>
              </button>
            })}
          </div>}
      </>}

      {view === 'setup' && <section className="setup">
        <h2>{t.setupTitle}</h2>
        <label className="field">
          <span>{t.gameNameLabel}</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder={t.gameNamePlaceholder} />
        </label>
        <label className="field">
          <span>{t.dateLabel}</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span>{t.playersLabel}</span>
          <div className="player-input-row">
            <input
              value={playerInput}
              onChange={e => setPlayerInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPlayerName() } }}
              placeholder={t.playerPlaceholder}
            />
            <button type="button" className="ghost" onClick={addPlayerName}>{t.addPlayer}</button>
          </div>
        </label>
        {playerNames.length > 0 && <ul className="player-chips">
          {playerNames.map((playerName, index) => (
            <li key={playerName}>{playerName}<button type="button" onClick={() => removePlayerName(index)} aria-label={t.removePlayer(playerName)}>✕</button></li>
          ))}
        </ul>}
        <button className="primary" disabled={!name.trim() || playerNames.length < 1} onClick={createGame}>{t.startGame}</button>
      </section>}

      {view === 'play' && activeGame && <section className="play">
        <div className="play-head">
          <div>
            <h2>{activeGame.name}</h2>
            <p>{formatDate(activeGame.date, locale)} · {t.roundsLabel(activeGame.rounds.length)}</p>
          </div>
          <div className="play-actions">
            <button className="ghost" onClick={() => setShowStandings(s => !s)}>{showStandings ? t.viewTable : t.viewStandings}</button>
            <button className="ghost" onClick={toggleFinished}>{activeGame.finished ? t.reopenGame : t.finishGame}</button>
          </div>
        </div>

        {showStandings
          ? <div className="standings">
            {rankedPlayers(activeGame).map(({ player, total, rank }) => (
              <div key={player.id} className={`standing-row rank-${rank}`}>
                <span className="rank">{medals[rank - 1] ?? `#${rank}`}</span>
                <span className="standing-name">{player.name}</span>
                <span className="standing-total">{total}</span>
              </div>
            ))}
            <button className="primary whatsapp-share" onClick={() => shareToWhatsApp(activeGame, locale)}>{t.shareWhatsapp}</button>
          </div>
          : <div className="score-table-scroll">
            <table className="score-table">
              <thead>
                <tr>
                  <th>{t.roundColumn}</th>
                  {activeGame.players.map(player => <th key={player.id}>{player.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {activeGame.rounds.map((round, index) => (
                  <tr key={round.id}>
                    <td className="round-label">{index + 1}</td>
                    {activeGame.players.map(player => <td key={player.id}>{round.scores[player.id] ?? 0}</td>)}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>{t.totalColumn}</td>
                  {activeGame.players.map(player => <td key={player.id}>{totalsFor(activeGame)[player.id]}</td>)}
                </tr>
              </tfoot>
            </table>
          </div>}

        {!showStandings && !activeGame.finished && <div className="new-round">
          <h3>{t.roundHeading(activeGame.rounds.length + 1)}</h3>
          <div className="stepper-list">
            {activeGame.players.map(player => {
              const raw = roundInputs[player.id] ?? ''
              const value = raw === '' ? 0 : Number(raw) || 0
              return <div key={player.id} className="stepper-row">
                <span className="stepper-name">{player.name}</span>
                <div className="stepper-controls">
                  <button type="button" className="stepper-btn" onClick={() => setRoundInputs(prev => ({ ...prev, [player.id]: String(value - 1) }))} aria-label={t.decreasePoints(player.name)}>−</button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={raw}
                    onChange={e => setRoundInputs(prev => ({ ...prev, [player.id]: e.target.value }))}
                    placeholder="0"
                  />
                  <button type="button" className="stepper-btn" onClick={() => setRoundInputs(prev => ({ ...prev, [player.id]: String(value + 1) }))} aria-label={t.increasePoints(player.name)}>+</button>
                </div>
              </div>
            })}
          </div>
          <div className="round-actions">
            <button className="primary" onClick={addRound}>{t.addRound}</button>
            <button className="ghost" disabled={activeGame.rounds.length === 0} onClick={undoLastRound}>{t.undoRound}</button>
          </div>
        </div>}
      </section>}
    </main>

    <footer>
      <span>{t.footerTagline}</span>
      <a href="https://vibe-portfolio-one.vercel.app/" target="_blank" rel="noreferrer">Created by Bruno Rendeiro</a>
      <span className="powered-badge">⚡ Powered by AI</span>
    </footer>
  </div>
}
