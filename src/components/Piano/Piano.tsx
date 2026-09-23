import { NOTE_LETTER_ES } from '../../music/notes'
import { NOTE_LETTERS } from '../../music/types'
import type { NoteLetter } from '../../music/types'
import './Piano.css'

// A black key sits between these white-key indices and the next one (none after E or B).
const BLACK_KEY_AFTER_INDEX = [0, 1, 3, 4, 5]

export interface PianoFeedback {
  letter: NoteLetter
  correct: boolean
}

interface PianoProps {
  onKeyPress: (letter: NoteLetter) => void
  feedback: PianoFeedback | null
}

/** One playable octave of natural-note keys, for practicing where each note sits on a real piano. */
export function Piano({ onKeyPress, feedback }: PianoProps) {
  return (
    <div className="piano" role="group" aria-label="Teclado de piano">
      {NOTE_LETTERS.map((letter) => {
        const isFeedbackTarget = feedback?.letter === letter
        return (
          <button
            key={letter}
            type="button"
            className="piano__key piano__key--white"
            data-feedback={isFeedbackTarget ? (feedback.correct ? 'correct' : 'incorrect') : undefined}
            aria-label={NOTE_LETTER_ES[letter]}
            onClick={() => onKeyPress(letter)}
          />
        )
      })}
      {BLACK_KEY_AFTER_INDEX.map((index) => (
        <span
          key={index}
          className="piano__key piano__key--black"
          style={{ left: `${((index + 1) * 100) / NOTE_LETTERS.length}%` }}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}
