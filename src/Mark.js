import React from "react"

export default function Mark(props) {
  const { degree, isChordTone } = props
  return <div className={`mark note-${degree}`}>
    <div className="inner">
      <div className={`background ${isChordTone ? "chord" : ""}`}></div>
      <div className="label">{degree}</div>
    </div>
  </div>
}
