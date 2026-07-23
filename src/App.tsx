import { useEffect, useState } from 'react'
import { loadGames, newId, rankedPlayers, saveGames, totalsFor, type Game } from './data/storage'

type View = 'home' | 'setup' | 'play'

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

const medals = ['🥇', '🥈', '🥉']

function shareToWhatsApp(game: Game) {
  // wa.me's redirect mangles emoji outside the Basic Multilingual Plane
  // (dice, medals, etc.), so the shared message sticks to plain text.
  const ranked = rankedPlayers(game)
  const lines = [
    `Resultados de ${game.name} (${formatDate(game.date)}):`,
    ...ranked.map(({ player, total, rank }) => `${rank}º ${player.name} - ${total} pontos`),
  ]
  const text = encodeURIComponent(lines.join('\n'))
  window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
}

export default function App() {
  const [games, setGames] = useState<Game[]>(() => loadGames())
  const [view, setView] = useState<View>('home')
  const [activeGameId, setActiveGameId] = useState<string | null>(null)
  const [showStandings, setShowStandings] = useState(false)

  const [name, setName] = useState('')
  const [date, setDate] = useState(today)
  const [playerNames, setPlayerNames] = useState<string[]>([])
  const [playerInput, setPlayerInput] = useState('')

  const [roundInputs, setRoundInputs] = useState<Record<string, string>>({})

  useEffect(() => { saveGames(games) }, [games])

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
    if (!window.confirm('Apagar este jogo? Não há como desfazer.')) return
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
      <button className="brand" onClick={goHome} aria-label="Início">
        <span className="brand-mark">GN</span>
        <div><strong>GameNight</strong><small>Marcador de pontos</small></div>
      </button>
      {view !== 'home' && <button className="ghost" onClick={goHome}>← Todos os jogos</button>}
    </header>

    <main>
      {view === 'home' && <>
        <p className="intro">Cria um jogo, junta os jogadores e vai registando os pontos ronda a ronda. Tudo fica guardado neste browser.</p>
        <button className="primary" onClick={startSetup}>+ Novo jogo</button>

        {games.length === 0
          ? <div className="empty-state"><span>🎲</span><h2>Ainda não há jogos guardados.</h2><p>Cria o primeiro para começar a marcar pontos.</p></div>
          : <div className="game-list">
            {games.map(game => {
              const ranked = rankedPlayers(game)
              const leader = ranked[0]
              return <button key={game.id} className="game-card" onClick={() => openGame(game.id)}>
                <div className="game-card-head">
                  <h3>{game.name}</h3>
                  {game.finished && <span className="badge">Terminado</span>}
                </div>
                <p>{formatDate(game.date)} · {game.players.length} jogadores · {game.rounds.length} rondas</p>
                {leader && game.rounds.length > 0 && <p className="leader">🏆 {leader.player.name} lidera com {leader.total}</p>}
                <span className="delete-link" onClick={event => { event.stopPropagation(); deleteGame(game.id) }}>Apagar</span>
              </button>
            })}
          </div>}
      </>}

      {view === 'setup' && <section className="setup">
        <h2>Novo jogo</h2>
        <label className="field">
          <span>Nome do jogo</span>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="ex. Catan, Risk, Uno…" />
        </label>
        <label className="field">
          <span>Data</span>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label className="field">
          <span>Jogadores</span>
          <div className="player-input-row">
            <input
              value={playerInput}
              onChange={e => setPlayerInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addPlayerName() } }}
              placeholder="Nome do jogador"
            />
            <button type="button" className="ghost" onClick={addPlayerName}>Adicionar</button>
          </div>
        </label>
        {playerNames.length > 0 && <ul className="player-chips">
          {playerNames.map((playerName, index) => (
            <li key={playerName}>{playerName}<button type="button" onClick={() => removePlayerName(index)} aria-label={`Remover ${playerName}`}>✕</button></li>
          ))}
        </ul>}
        <button className="primary" disabled={!name.trim() || playerNames.length < 1} onClick={createGame}>Começar jogo</button>
      </section>}

      {view === 'play' && activeGame && <section className="play">
        <div className="play-head">
          <div>
            <h2>{activeGame.name}</h2>
            <p>{formatDate(activeGame.date)} · {activeGame.rounds.length} rondas</p>
          </div>
          <div className="play-actions">
            <button className="ghost" onClick={() => setShowStandings(s => !s)}>{showStandings ? 'Ver tabela' : 'Ver classificação'}</button>
            <button className="ghost" onClick={toggleFinished}>{activeGame.finished ? 'Reabrir jogo' : 'Terminar jogo'}</button>
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
            <button className="primary whatsapp-share" onClick={() => shareToWhatsApp(activeGame)}>💬 Partilhar no WhatsApp</button>
          </div>
          : <div className="score-table-scroll">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Ronda</th>
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
                  <td>Total</td>
                  {activeGame.players.map(player => <td key={player.id}>{totalsFor(activeGame)[player.id]}</td>)}
                </tr>
              </tfoot>
            </table>
          </div>}

        {!showStandings && !activeGame.finished && <div className="new-round">
          <h3>Ronda {activeGame.rounds.length + 1}</h3>
          <div className="stepper-list">
            {activeGame.players.map(player => {
              const raw = roundInputs[player.id] ?? ''
              const value = raw === '' ? 0 : Number(raw) || 0
              return <div key={player.id} className="stepper-row">
                <span className="stepper-name">{player.name}</span>
                <div className="stepper-controls">
                  <button type="button" className="stepper-btn" onClick={() => setRoundInputs(prev => ({ ...prev, [player.id]: String(value - 1) }))} aria-label={`Diminuir pontos de ${player.name}`}>−</button>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={raw}
                    onChange={e => setRoundInputs(prev => ({ ...prev, [player.id]: e.target.value }))}
                    placeholder="0"
                  />
                  <button type="button" className="stepper-btn" onClick={() => setRoundInputs(prev => ({ ...prev, [player.id]: String(value + 1) }))} aria-label={`Aumentar pontos de ${player.name}`}>+</button>
                </div>
              </div>
            })}
          </div>
          <div className="round-actions">
            <button className="primary" onClick={addRound}>Adicionar ronda</button>
            <button className="ghost" disabled={activeGame.rounds.length === 0} onClick={undoLastRound}>Desfazer última ronda</button>
          </div>
        </div>}
      </section>}
    </main>

    <footer>
      <span>Tudo guardado neste browser (localStorage) — sem contas, sem servidor.</span>
      <a href="https://vibe-portfolio-one.vercel.app/" target="_blank" rel="noreferrer">Created by Bruno Rendeiro</a>
      <span className="powered-badge">⚡ Powered by AI</span>
    </footer>
  </div>
}
