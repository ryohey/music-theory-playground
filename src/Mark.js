import React from "react"
import { notesToColor } from "./color"

export default function Mark(props) {
  const { note, degree, isChordTone } = props
  return <div className={`mark note-${degree}`}>
    {degree &&
      <div className="inner">
        <div className={`background ${isChordTone ? "chord" : ""}`} style={{backgroundColor: notesToColor([note])}}></div>
        <div className="label">{degree}</div>
      </div>
    }
  </div>
}
