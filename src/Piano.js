import React from "react"
import Mark from "./Mark"
import { getDegree } from "./music"

function isNoteBlack(note) {
  return [1, 3, 6, 8, 10].includes(note % 12)
}

function isKeyBordered(note) {
  return [4, 11].includes(note % 12)
}

function Key(props) {
  const { degree, note, isChordTone, playNotes } = props

  return <div
    className={`Key ${isNoteBlack(note) ? "black" : "white"} ${isKeyBordered(note) ? "bordered" : ""}`}
    onClick={() => playNotes([note])}>
    <Mark degree={degree} isChordTone={isChordTone} />
  </div>
}

export default function Piano(props) {
  const { scale, chordNotes, playNotes } = props
  const keys = []
  for (let i = 0; i < 24; i++) {
    const note = i
    const degree = getDegree(note, scale)
    const isChordTone = chordNotes.map(c => c % 12).includes(note % 12)
    keys.push(<Key
      degree={degree}
      note={note}
      isChordTone={isChordTone}
      playNotes={playNotes} />)
  }
  return <div className="Piano">
    {keys}
  </div>
}
