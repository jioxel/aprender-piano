import { Link, useParams } from 'react-router-dom'
import { GameCard } from '../../components/GameCard/GameCard'
import { getGamesForLevel } from '../../data/games'
import { levels } from '../../data/levels'
import './GamesPage.css'

export function GamesPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const level = levels.find((item) => item.id === levelId)
  const games = levelId ? getGamesForLevel(levelId) : []

  if (!level) {
    return (
      <main className="games-page">
        <p>Nivel no encontrado.</p>
        <Link to="/">Volver a niveles</Link>
      </main>
    )
  }

  return (
    <main className="games-page">
      <Link to="/" className="games-page__back">
        &larr; Niveles
      </Link>
      <h1>{level.name}</h1>
      <p className="games-page__subtitle">Elige un juego</p>
      <div className="games-page__grid">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  )
}
