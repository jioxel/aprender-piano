import './ArrowNav.css'

interface ArrowNavProps {
  onPrevious: () => void
  onNext: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  previousLabel?: string
  nextLabel?: string
}

export function ArrowNav({
  onPrevious,
  onNext,
  canGoPrevious = true,
  canGoNext = true,
  previousLabel = 'Anterior',
  nextLabel = 'Siguiente',
}: ArrowNavProps) {
  return (
    <div className="arrow-nav">
      <button
        type="button"
        className="arrow-nav__button"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label={previousLabel}
      >
        <span aria-hidden="true">&larr;</span>
      </button>
      <button
        type="button"
        className="arrow-nav__button"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label={nextLabel}
      >
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  )
}
