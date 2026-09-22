import { LevelCard } from '../../components/LevelCard/LevelCard'
import { levels } from '../../data/levels'
import './LevelsPage.css'

export function LevelsPage() {
  return (
    <main className="levels-page">
      <h1>Aprender Piano</h1>
      <p className="levels-page__subtitle">Elige un nivel para comenzar</p>
      <div className="levels-page__grid">
        {levels.map((level) => (
          <LevelCard key={level.id} level={level} />
        ))}
      </div>
    </main>
  )
}
