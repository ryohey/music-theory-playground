import React, { Component } from 'react'
import './App.css'
import Guitar from "./Guitar"
import Piano from "./Piano"
import Synth from "./Synth"
import { SCALES, createScale, DEGREES, createChord, chordDegrees, chordName, offsetNotes, normalizeNotes } from "./music"
import { NOTE_NAMES, nameToNote } from "./noteName"

var synth = new Synth("http://www.g200kg.com/webmidilink/gmplayer/")

function playNotes(notes, duration = 500, delay = 0, channel = 0, callback = () => {}) {
  let canceled = false
  let noteOffId
  const id = setTimeout(() => {
    if (canceled) {
      return
    }
    callback()
    if (notes.length === 0) {
      return
    }
    notes.forEach(note => {
      const n = note + 48
      synth.noteOn(n, 100, channel)
      noteOffId = setTimeout(() => {
        if (canceled) {
          return
        }
        synth.noteOff(n, channel)
      }, duration)
    })
  }, delay)

  return () => {
    clearTimeout(id)
    if (noteOffId) {
      clearTimeout(id)
    }
  }
}

// transpose: 4 = 6th string starts from E
function createTunings(drop = false) {
  if (drop) {
    return [-2, 5, 10, 15, 19, 24]
  } else {
    return [0, 5, 10, 15, 19, 24]
  }
}

const TUNINGS = {
  "Standard": 4,
  "-1": 3,
  "-2": 2,
  "-3": 1,
  "-4": 0
}

class Sequencer {
  constructor() {
    this.cancel = () => {}
  }

  // [{notes: Array, time: Number, duration: Number}]
  play(seq) {
    const cancels = seq.map(s => playNotes(s.notes, s.duration, s.time, s.channel, s.callback))
    this.cancel = () => cancels.map(c => c())
  }
}

const sequencer = new Sequencer()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleName: "major",
      transpose: 4,
      drop: false,
      key: 0,
      selectedDegree: 0,
      pattern: [1, 2, 3, 4, 5, 6, 7]
    }
  }

  render() {
    const scale = createScale(this.state.scaleName)
    const keyedScale = normalizeNotes(offsetNotes(scale, this.state.key))
    const tunings = offsetNotes(createTunings(this.state.drop), this.state.transpose)
    const chords = DEGREES.map((_, i) => offsetNotes(createChord(scale, chordDegrees(i)), this.state.key))
    const chordNotes = chords[this.state.selectedDegree]

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

    const onClickDegree = (i, notes) => {
      this.setState({
        selectedDegree: i
      })

      playNotes(notes)
    }

    const onClickPlay = () => {
      sequencer.cancel()

      const { pattern } = this.state

      function loop(arr) {
        const result = []
        for (let s of arr) {
          for (let i = 0; i < 4; i++) {
            result.push(s)
          }
        }
        return result
      }

      function repeat(arr, i) {
        let result = []
        for (let n = 0; n < i; n++) {
          result = result.concat(arr)
        }
        return result
      }

      const beat = 500 // milliseconds per beat

      const seq = loop(pattern)
        .map((degree, i) => ({
          notes: chords[degree - 1],
          time: beat * i,
          duration: beat - 10,
          channel: 0
        }))

      const drumSeq = repeat([[0, 6], [6], [2, 6], [6], [0, 6], [0, 6], [2, 6], [6]], seq.length / 4)
        .map((notes, i) => ({
          notes: notes.map(n => n - 12),
          time: beat / 2 * i,
          duration: beat / 2 - 1,
          channel: 9
        }))

      const callbacks = pattern.map((degree, i) => ({
        notes: [],
        time: beat * i * 4,
        callback: () => {
          this.setState({
            selectedDegree: degree - 1
          })
        }
      }))

      sequencer.play([]
        .concat(seq)
        .concat(drumSeq)
        .concat(callbacks)
      )
    }

    const onClickStop = () => {
      sequencer.cancel()
    }

    const onChangePattern = e => {
      this.setState({
        pattern: e.target.value.split(",")
      })
    }

    return (
      <div className="App">
        <Guitar
          tunings={tunings}
          scale={keyedScale}
          chordNotes={chordNotes}
          playNotes={playNotes} />
        <Piano
          scale={keyedScale}
          chordNotes={chordNotes}
          playNotes={playNotes} />
        <div className="settings">
          <h2>Settings</h2>
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
          <h2>Chords</h2>
          <div className="chord-list">
            {DEGREES.map((degree, i) => {
              const degrees = chordDegrees(i)
              const notes = chords[i]
              const name = chordName(notes)
              const selected = i === this.state.selectedDegree
              return <div className={`chord ${selected ? "selected" : ""}`} onClick={() => onClickDegree(i, notes)}>
                <div className="title">{degree.title}</div>
                <div className="degree-name">{degree.name}</div>
                <div className="name">{name}</div>
                <div className="degrees">{degrees.map(d => (d % scale.length) + 1).join(",")}</div>
              </div>
            })}
            </div>
        </div>
        <div className="player">
          <h2>Player</h2>
          <input type="text" value={this.state.pattern.join(",")} onChange={onChangePattern} />
          <button onClick={onClickPlay}>play</button>
          <button onClick={onClickStop}>stop</button>
        </div>
      </div>
    )
  }
}

export default App
