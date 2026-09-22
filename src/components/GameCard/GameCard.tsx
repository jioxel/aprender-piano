import { Link } from 'react-router-dom'
import type { Game } from '../../data/games'
import './GameCard.css'

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const content = (
    <>
      <h2>{game.name}</h2>
      <p>{game.description}</p>
      {!game.available && <span className="game-card__badge">Próximamente</span>}
    </>
  )

  if (!game.available) {
    return <div className="game-card game-card--disabled">{content}</div>
  }

  return (
    <Link to={game.path} className="game-card">
      {content}
    </Link>
  )
}
