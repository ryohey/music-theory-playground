import React, { Component } from 'react'
import './App.css'
import Guitar from "./Guitar"
import Piano from "./Piano"
import Synth from "./Synth"
import { SCALES, createScale, DEGREES, createChord, chordDegrees, chordName } from "./music"
import { NOTE_NAMES, nameToNote } from "./noteName"

var synth = new Synth("http://www.g200kg.com/webmidilink/gmplayer/")

function playNotes(notes) {
  notes.forEach(note => {
    const n = note + 48
    synth.noteOn(n, 100)
    setTimeout(() => {
      synth.noteOff(n)
    }, 500)
  })
}

// transpose: 4 = 6th string starts from E
function createTunings(transpose = 4, drop = false) {
  let t = [0, 5, 10, 15, 19, 24]
  if (drop) {
    t = [-2, 5, 10, 15, 19, 24]
  }
  return t.map(n => n + transpose)
}

const TUNINGS = {
  "Standard": 4,
  "-1": 3,
  "-2": 2,
  "-3": 1,
  "-4": 0
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleName: "major",
      transpose: 4,
      drop: false,
      key: 0,
      selectedDegree: 0
    }
  }

  render() {
    const scale = createScale(this.state.scaleName, this.state.key)
    const tunings = createTunings(this.state.transpose, this.state.drop)

    const onChangeKey = e => {
      this.setState({
        key: parseInt(e.target.value)
      })
    }

    const onChangeScale = e => {
      this.setState({
        scaleName: e.target.value
      })
    }

    const onChangeTranspose = e => {
      this.setState({
        transpose: parseInt(e.target.value)
      })
    }

    const onChangeDrop = e => {
      this.setState({
        drop: e.target.checked
      })
    }

    const chordNotes = createChord(scale, chordDegrees(this.state.selectedDegree))

    const onClickDegree = (i, notes) => {
      this.setState({
        selectedDegree: i
      })

      playNotes(notes)
    }

    return (
      <div className="App">
        <Guitar
          tunings={tunings}
          scale={scale}
          chordNotes={chordNotes}
          playNotes={playNotes} />
        <Piano
          scale={scale}
          chordNotes={chordNotes}
          playNotes={playNotes} />
        <div className="settings">
          <div className="section">
            <label>Key</label>
            <select value={this.state.key} onChange={onChangeKey}>
              {NOTE_NAMES.map(s => <option value={nameToNote(s)}>{s}</option>)}
            </select>
          </div>
          <div className="section">
            <label>Scale</label>
            <select value={this.state.scaleName} onChange={onChangeScale}>
              {Object.keys(SCALES).map(s => <option>{s}</option>)}
            </select>
          </div>
          <div className="section">
            <label>Tuning</label>
            <select value={this.state.transpose} onChange={onChangeTranspose}>
              {Object.entries(TUNINGS).map(e => <option value={e[1]}>{e[0]}</option>)}
            </select>
          </div>
          <div className="section">
            <label>Drop Tuning</label>
            <input type="checkbox" checked={this.state.drop} onChange={onChangeDrop} />
          </div>
        </div>
        <div className="chords">
          <label>Chords</label>
          <div className="chord-list">
            {DEGREES.map((degree, i) => {
              const degrees = chordDegrees(i)
              const notes = createChord(scale, degrees)
              const name = chordName(notes)
              const selected = i === this.state.selectedDegree
              return <div className={`chord ${selected ? "selected" : ""}`} onClick={() => onClickDegree(i, notes)}>
                <div className="title">{degree.title}</div>
                <div className="degree-name">{degree.name}</div>
                <div className="name">{name}</div>
                <div className="degrees">{degrees.join(",")}</div>
              </div>
            })}
            </div>
        </div>
      </div>
    )
  }
}

export default App
