export type Locale = 'pt' | 'en' | 'de' | 'fr'

export const locales: { id: Locale; label: string }[] = [
  { id: 'pt', label: 'PT' },
  { id: 'en', label: 'EN' },
  { id: 'de', label: 'DE' },
  { id: 'fr', label: 'FR' },
]

export function detectLocale(): Locale {
  const stored = window.localStorage.getItem('gamenight-locale')
  if (stored === 'pt' || stored === 'en' || stored === 'de' || stored === 'fr') return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (browser === 'de') return 'de'
  if (browser === 'pt') return 'pt'
  if (browser === 'fr') return 'fr'
  return 'en'
}

type UiStrings = {
  tagline: string
  home: string
  backToGames: string
  intro: string
  newGame: string
  emptyTitle: string
  emptyBody: string
  finished: string
  gameSummary: (players: number, rounds: number) => string
  leaderLine: (name: string, total: number) => string
  delete: string
  confirmDelete: string
  setupTitle: string
  gameNameLabel: string
  gameNamePlaceholder: string
  dateLabel: string
  playersLabel: string
  playerPlaceholder: string
  addPlayer: string
  removePlayer: (name: string) => string
  startGame: string
  roundsLabel: (rounds: number) => string
  viewStandings: string
  viewTable: string
  finishGame: string
  reopenGame: string
  roundColumn: string
  totalColumn: string
  roundHeading: (n: number) => string
  decreasePoints: (name: string) => string
  increasePoints: (name: string) => string
  addRound: string
  undoRound: string
  shareWhatsapp: string
  footerTagline: string
  waResults: (name: string, date: string) => string
  waLine: (rank: number, name: string, total: number) => string
}

export const ui: Record<Locale, UiStrings> = {
  pt: {
    tagline: 'Marcador de pontos',
    home: 'Início',
    backToGames: '← Todos os jogos',
    intro: 'Cria um jogo, junta os jogadores e vai registando os pontos ronda a ronda. Tudo fica guardado neste browser.',
    newGame: '+ Novo jogo',
    emptyTitle: 'Ainda não há jogos guardados.',
    emptyBody: 'Cria o primeiro para começar a marcar pontos.',
    finished: 'Terminado',
    gameSummary: (players, rounds) => `${players} jogadores · ${rounds} rondas`,
    leaderLine: (name, total) => `🏆 ${name} lidera com ${total}`,
    delete: 'Apagar',
    confirmDelete: 'Apagar este jogo? Não há como desfazer.',
    setupTitle: 'Novo jogo',
    gameNameLabel: 'Nome do jogo',
    gameNamePlaceholder: 'ex. Catan, Risk, Uno…',
    dateLabel: 'Data',
    playersLabel: 'Jogadores',
    playerPlaceholder: 'Nome do jogador',
    addPlayer: 'Adicionar',
    removePlayer: name => `Remover ${name}`,
    startGame: 'Começar jogo',
    roundsLabel: rounds => `${rounds} rondas`,
    viewStandings: 'Ver classificação',
    viewTable: 'Ver tabela',
    finishGame: 'Terminar jogo',
    reopenGame: 'Reabrir jogo',
    roundColumn: 'Ronda',
    totalColumn: 'Total',
    roundHeading: n => `Ronda ${n}`,
    decreasePoints: name => `Diminuir pontos de ${name}`,
    increasePoints: name => `Aumentar pontos de ${name}`,
    addRound: 'Adicionar ronda',
    undoRound: 'Desfazer última ronda',
    shareWhatsapp: '💬 Partilhar no WhatsApp',
    footerTagline: 'Tudo guardado neste browser (localStorage) — sem contas, sem servidor.',
    waResults: (name, date) => `Resultados de ${name} (${date}):`,
    waLine: (rank, name, total) => `${rank}º ${name} - ${total} pontos`,
  },
  en: {
    tagline: 'Score tracker',
    home: 'Home',
    backToGames: '← All games',
    intro: 'Create a game, add the players, and log the points round by round. Everything stays saved in this browser.',
    newGame: '+ New game',
    emptyTitle: 'No games saved yet.',
    emptyBody: 'Create the first one to start tracking points.',
    finished: 'Finished',
    gameSummary: (players, rounds) => `${players} players · ${rounds} rounds`,
    leaderLine: (name, total) => `🏆 ${name} leads with ${total}`,
    delete: 'Delete',
    confirmDelete: 'Delete this game? This cannot be undone.',
    setupTitle: 'New game',
    gameNameLabel: 'Game name',
    gameNamePlaceholder: 'e.g. Catan, Risk, Uno…',
    dateLabel: 'Date',
    playersLabel: 'Players',
    playerPlaceholder: 'Player name',
    addPlayer: 'Add',
    removePlayer: name => `Remove ${name}`,
    startGame: 'Start game',
    roundsLabel: rounds => `${rounds} rounds`,
    viewStandings: 'View standings',
    viewTable: 'View table',
    finishGame: 'Finish game',
    reopenGame: 'Reopen game',
    roundColumn: 'Round',
    totalColumn: 'Total',
    roundHeading: n => `Round ${n}`,
    decreasePoints: name => `Decrease ${name}'s points`,
    increasePoints: name => `Increase ${name}'s points`,
    addRound: 'Add round',
    undoRound: 'Undo last round',
    shareWhatsapp: '💬 Share on WhatsApp',
    footerTagline: 'Everything saved in this browser (localStorage) — no accounts, no server.',
    waResults: (name, date) => `Results for ${name} (${date}):`,
    waLine: (rank, name, total) => `${rank}. ${name} - ${total} points`,
  },
  de: {
    tagline: 'Punktezähler',
    home: 'Start',
    backToGames: '← Alle Spiele',
    intro: 'Erstelle ein Spiel, füge die Spieler hinzu und trage die Punkte Runde für Runde ein. Alles bleibt in diesem Browser gespeichert.',
    newGame: '+ Neues Spiel',
    emptyTitle: 'Noch keine Spiele gespeichert.',
    emptyBody: 'Erstelle das erste, um Punkte zu erfassen.',
    finished: 'Beendet',
    gameSummary: (players, rounds) => `${players} Spieler · ${rounds} Runden`,
    leaderLine: (name, total) => `🏆 ${name} führt mit ${total}`,
    delete: 'Löschen',
    confirmDelete: 'Dieses Spiel löschen? Das kann nicht rückgängig gemacht werden.',
    setupTitle: 'Neues Spiel',
    gameNameLabel: 'Spielname',
    gameNamePlaceholder: 'z. B. Catan, Risiko, Uno…',
    dateLabel: 'Datum',
    playersLabel: 'Spieler',
    playerPlaceholder: 'Spielername',
    addPlayer: 'Hinzufügen',
    removePlayer: name => `${name} entfernen`,
    startGame: 'Spiel starten',
    roundsLabel: rounds => `${rounds} Runden`,
    viewStandings: 'Rangliste anzeigen',
    viewTable: 'Tabelle anzeigen',
    finishGame: 'Spiel beenden',
    reopenGame: 'Spiel wieder öffnen',
    roundColumn: 'Runde',
    totalColumn: 'Gesamt',
    roundHeading: n => `Runde ${n}`,
    decreasePoints: name => `Punkte von ${name} verringern`,
    increasePoints: name => `Punkte von ${name} erhöhen`,
    addRound: 'Runde hinzufügen',
    undoRound: 'Letzte Runde rückgängig machen',
    shareWhatsapp: '💬 Auf WhatsApp teilen',
    footerTagline: 'Alles wird in diesem Browser gespeichert (localStorage) — keine Konten, kein Server.',
    waResults: (name, date) => `Ergebnisse von ${name} (${date}):`,
    waLine: (rank, name, total) => `${rank}. ${name} - ${total} Punkte`,
  },
  fr: {
    tagline: 'Compteur de points',
    home: 'Accueil',
    backToGames: '← Tous les jeux',
    intro: 'Crée une partie, ajoute les joueurs et note les points manche après manche. Tout reste enregistré dans ce navigateur.',
    newGame: '+ Nouvelle partie',
    emptyTitle: 'Aucune partie enregistrée pour l’instant.',
    emptyBody: 'Crée la première pour commencer à noter les points.',
    finished: 'Terminée',
    gameSummary: (players, rounds) => `${players} joueurs · ${rounds} manches`,
    leaderLine: (name, total) => `🏆 ${name} mène avec ${total}`,
    delete: 'Supprimer',
    confirmDelete: 'Supprimer cette partie ? Action irréversible.',
    setupTitle: 'Nouvelle partie',
    gameNameLabel: 'Nom de la partie',
    gameNamePlaceholder: 'ex. Catane, Risk, Uno…',
    dateLabel: 'Date',
    playersLabel: 'Joueurs',
    playerPlaceholder: 'Nom du joueur',
    addPlayer: 'Ajouter',
    removePlayer: name => `Retirer ${name}`,
    startGame: 'Commencer la partie',
    roundsLabel: rounds => `${rounds} manches`,
    viewStandings: 'Voir le classement',
    viewTable: 'Voir le tableau',
    finishGame: 'Terminer la partie',
    reopenGame: 'Rouvrir la partie',
    roundColumn: 'Manche',
    totalColumn: 'Total',
    roundHeading: n => `Manche ${n}`,
    decreasePoints: name => `Diminuer les points de ${name}`,
    increasePoints: name => `Augmenter les points de ${name}`,
    addRound: 'Ajouter une manche',
    undoRound: 'Annuler la dernière manche',
    shareWhatsapp: '💬 Partager sur WhatsApp',
    footerTagline: 'Tout est enregistré dans ce navigateur (localStorage) — sans compte, sans serveur.',
    waResults: (name, date) => `Résultats de ${name} (${date}) :`,
    waLine: (rank, name, total) => `${rank}. ${name} - ${total} points`,
  },
}
