import { Link } from 'react-router-dom'
import type { Level } from '../../data/levels'
import './LevelCard.css'

interface LevelCardProps {
  level: Level
}

export function LevelCard({ level }: LevelCardProps) {
  const content = (
    <>
      <h2>{level.name}</h2>
      <p>{level.description}</p>
      {!level.available && <span className="level-card__badge">Próximamente</span>}
    </>
  )

  if (!level.available) {
    return <div className="level-card level-card--disabled">{content}</div>
  }

  return (
    <Link to={`/nivel/${level.id}`} className="level-card">
      {content}
    </Link>
  )
}
