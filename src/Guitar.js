import React from "react"
import Mark from "./Mark"
import { getDegree } from "./music"

function Fret(props) {
  const { degree, isChordTone, note, playNotes } = props
  return <div
    className="Fret"
    onClick={() => playNotes([note - 12])}>
    {degree &&
      <Mark degree={degree} isChordTone={isChordTone} note={note} />}
  </div>
}

export default function Guitar(props) {
  const { tunings, scale, chordNotes, playNotes } = props

  const strings = []
  for (let s = 0; s < tunings.length; s++) {
    const frets = []
    for (let f = 0; f <= 24; f++) {
      const note = tunings[tunings.length - 1 - s] + f
      const degree = getDegree(note, scale)
      const isChordTone = chordNotes.map(c => c % 12).includes(note % 12)
      frets.push(<Fret
        degree={degree}
        note={note}
        isChordTone={isChordTone}
        playNotes={playNotes} />)
    }
    strings.push(<div className="string">{ frets }</div>)
  }

  return <div className="Guitar">{ strings }</div>
}
