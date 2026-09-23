import {
  AVAILABLE_OCTAVES_BY_HAND,
  buildOctave,
  setEnabledClefs,
  setSelectedNotesForHand,
} from '../../music/exerciseSettings'
import { CLEF_LABEL, HAND_LABEL, NOTE_LETTER_ES } from '../../music/notes'
import { NOTE_LETTERS } from '../../music/types'
import type { Clef, Hand, Note } from '../../music/types'
import { useEnabledClefs, useSelectedNotesByHand } from '../../music/useExerciseSettings'
import './ExerciseSettings.css'

const HANDS: Hand[] = ['right', 'left']
const CLEFS: Clef[] = ['treble', 'bass']

function noteKey(note: Note): string {
  return `${note.letter}${note.octave}`
}

export function ExerciseSettings() {
  const enabledClefs = useEnabledClefs()
  const selectedByHand = useSelectedNotesByHand()

  function toggleClef(clef: Clef, checked: boolean) {
    const next = checked ? [...enabledClefs, clef] : enabledClefs.filter((c) => c !== clef)
    setEnabledClefs(next)
  }

  function isSelected(hand: Hand, note: Note): boolean {
    return selectedByHand[hand].some((selected) => noteKey(selected) === noteKey(note))
  }

  function toggleNote(hand: Hand, note: Note, checked: boolean) {
    const current = selectedByHand[hand]
    const next = checked
      ? [...current, note]
      : current.filter((selected) => noteKey(selected) !== noteKey(note))
    setSelectedNotesForHand(hand, next)
  }

  function toggleOctave(hand: Hand, octave: number, checked: boolean) {
    const octaveNotes = buildOctave(octave)
    const current = selectedByHand[hand]
    const next = checked
      ? [...current, ...octaveNotes.filter((note) => !isSelected(hand, note))]
      : current.filter((selected) => selected.octave !== octave)
    setSelectedNotesForHand(hand, next)
  }

  function isOctaveFullySelected(hand: Hand, octave: number): boolean {
    return buildOctave(octave).every((note) => isSelected(hand, note))
  }

  return (
    <div className="exercise-settings">
      <fieldset className="exercise-settings__group">
        <legend>Claves a practicar</legend>
        <div className="exercise-settings__clefs">
          {CLEFS.map((clef) => (
            <label key={clef} className="exercise-settings__option">
              <input
                type="checkbox"
                checked={enabledClefs.includes(clef)}
                disabled={enabledClefs.includes(clef) && enabledClefs.length === 1}
                onChange={(event) => toggleClef(clef, event.target.checked)}
              />
              {CLEF_LABEL[clef]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="exercise-settings__hands">
        {HANDS.map((hand) => (
          <fieldset key={hand} className="exercise-settings__group">
            <legend>{HAND_LABEL[hand]}</legend>
            <table className="exercise-settings__table">
              <thead>
                <tr>
                  <th scope="col">Octava</th>
                  {NOTE_LETTERS.map((letter) => (
                    <th key={letter} scope="col">
                      {NOTE_LETTER_ES[letter]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AVAILABLE_OCTAVES_BY_HAND[hand].map((octave) => (
                  <tr key={octave}>
                    <th scope="row">
                      <label className="exercise-settings__octave-label">
                        <input
                          type="checkbox"
                          aria-label={`${HAND_LABEL[hand]}: toda la octava ${octave}`}
                          checked={isOctaveFullySelected(hand, octave)}
                          onChange={(event) => toggleOctave(hand, octave, event.target.checked)}
                        />
                        {octave}
                      </label>
                    </th>
                    {NOTE_LETTERS.map((letter) => {
                      const note: Note = { letter, octave }
                      return (
                        <td key={letter}>
                          <input
                            type="checkbox"
                            aria-label={`${HAND_LABEL[hand]}: ${NOTE_LETTER_ES[letter]}${octave}`}
                            checked={isSelected(hand, note)}
                            onChange={(event) => toggleNote(hand, note, event.target.checked)}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        ))}
      </div>
    </div>
  )
}
