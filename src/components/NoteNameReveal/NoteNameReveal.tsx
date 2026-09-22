import { noteName, noteNameEs } from '../../music/notes'
import type { Note } from '../../music/types'
import './NoteNameReveal.css'

interface NoteNameRevealProps {
  note: Note
}

export function NoteNameReveal({ note }: NoteNameRevealProps) {
  return (
    <p className="note-name-reveal" aria-live="polite">
      <span>
        Español: <strong>{noteNameEs(note)}</strong>
      </span>
      <span>
        Inglés: <strong>{noteName(note)}</strong>
      </span>
    </p>
  )
}
