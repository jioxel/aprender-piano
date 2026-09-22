import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowNav } from '../../components/ArrowNav/ArrowNav'
import { NoteNameReveal } from '../../components/NoteNameReveal/NoteNameReveal'
import { Staff } from '../../components/staff/Staff'
import { Switch } from '../../components/Switch/Switch'
import { CLEF_LABEL, HAND_LABEL } from '../../music/notes'
import { useNoteSequence } from '../../music/useNoteSequence'
import './NoteReadingGamePage.css'

export function NoteReadingGamePage() {
  const { current, goNext, goPrevious, canGoPrevious } = useNoteSequence()
  const [showNoteName, setShowNoteName] = useState(false)

  return (
    <main className="note-game">
      <Link to="/nivel/nivel-1" className="note-game__back">
        &larr; Juegos
      </Link>
      <h1>Lectura de notas</h1>
      <p className="note-game__hint">
        {HAND_LABEL[current.hand]} &middot; {CLEF_LABEL[current.clef]}
      </p>

      <div className="note-game__staff">
        <Staff clef={current.clef} note={current.note} />
      </div>

      <div className="note-game__reveal">
        {showNoteName && <NoteNameReveal note={current.note} />}
      </div>

      <ArrowNav
        onPrevious={goPrevious}
        onNext={goNext}
        canGoPrevious={canGoPrevious}
        previousLabel="Nota anterior"
        nextLabel="Nota siguiente"
      />

      <div className="note-game__toggle">
        <Switch
          id="reveal-note-name"
          checked={showNoteName}
          onChange={setShowNoteName}
          label="Mostrar nombre de la nota"
        />
      </div>
    </main>
  )
}
