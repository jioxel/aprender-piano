import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowNav } from '../../components/ArrowNav/ArrowNav'
import { ExerciseSettings } from '../../components/ExerciseSettings/ExerciseSettings'
import { NoteNameReveal } from '../../components/NoteNameReveal/NoteNameReveal'
import { Piano } from '../../components/Piano/Piano'
import type { PianoFeedback } from '../../components/Piano/Piano'
import { Staff } from '../../components/staff/Staff'
import { Switch } from '../../components/Switch/Switch'
import { useNoteSequence } from '../../music/useNoteSequence'
import type { NoteLetter } from '../../music/types'
import './NoteReadingGamePage.css'

const PIANO_FEEDBACK_DELAY_MS = 400

export function NoteReadingGamePage() {
  const { current, goNext, goPrevious, canGoPrevious } = useNoteSequence()
  const [showNoteName, setShowNoteName] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showPiano, setShowPiano] = useState(false)
  const [feedback, setFeedback] = useState<PianoFeedback | null>(null)

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => {
      setFeedback(null)
      if (feedback.correct) goNext()
    }, PIANO_FEEDBACK_DELAY_MS)
    return () => clearTimeout(timer)
  }, [feedback, goNext])

  function handlePianoKeyPress(letter: NoteLetter) {
    if (feedback) return
    setFeedback({ letter, correct: letter === current.note.letter })
  }

  return (
    <main className="note-game">
      <Link to="/nivel/nivel-1" className="note-game__back">
        &larr; Juegos
      </Link>
      <h1>Lectura de notas</h1>

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

      {showPiano && (
        <div className="note-game__piano">
          <Piano onKeyPress={handlePianoKeyPress} feedback={feedback} />
        </div>
      )}

      <div className="note-game__toggle">
        <Switch
          id="reveal-note-name"
          checked={showNoteName}
          onChange={setShowNoteName}
          label="Mostrar nombre de la nota"
        />
      </div>

      <div className="note-game__toggle">
        <Switch
          id="toggle-piano"
          checked={showPiano}
          onChange={setShowPiano}
          label="Practicar con el piano"
        />
      </div>

      <div className="note-game__toggle">
        <Switch
          id="toggle-exercise-settings"
          checked={showSettings}
          onChange={setShowSettings}
          label="Configurar notas"
        />
      </div>

      {showSettings && <ExerciseSettings />}
    </main>
  )
}
