import React, { Component } from 'react'
import './App.css'

class Synth {
  constructor(url) {
    this.sy = window.open(url, "sy1", "width=900,height=670,scrollbars=yes,resizable=yes")
  }

  noteOn(note, velocity) {
    this.sendMessage(this.sy, "midi,90," + note.toString(16) + "," + velocity.toString(16))
  }

  noteOff(note) {
    this.sendMessage(this.sy, "midi,80," + note.toString(16) + ",0")
  }

  allSoundOff() {
    this.switchendMessage(this.sy, "midi,b0,78,0")
  }

  sendMessage(sy, s) {
    if (this.sy) {
      this.sy.postMessage(s, "*")
    }
  }
}

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

function createScales(key = 0) {
  function buildScale(steps, offset = 0) {
    const scale = []
    let lastNote = offset + key
    for (let step of steps) {
      scale.push(lastNote % 12)
      lastNote += step
    }
    return scale
  }

  return {
    major: buildScale([2, 2, 1, 2, 2, 2, 1]),
    minor: buildScale([2, 1, 2, 2, 1, 2, 2], 9), // relative minor
    harmonicMinor: buildScale([2, 1, 2, 2, 1, 3, 1], 9),
    melodicMinor: buildScale([2, 1, 2, 2, 2, 2, 1], 9),
    majorPentatonic: buildScale([2, 2, 3, 2, 3]),
    minorPentatonic: buildScale([3, 2, 2, 3, 2], 9), // relative
    ioninan: buildScale([2, 2, 1, 2, 2, 2, 1]),
    dorian: buildScale([2, 1, 2, 2, 2, 1, 2], 2),
    phrygian: buildScale([1, 2, 2, 2, 1, 2, 2], 4),
    lydian: buildScale([2, 2, 2, 1, 2, 2, 1], 5),
    mixolydian: buildScale([2, 2, 1, 2, 2, 1, 2], 7),
    aeolian: buildScale([2, 1, 2, 2, 1, 2, 2], 9),
    locrian: buildScale([1, 2, 2, 2, 1, 2, 2], 11)
  }
}

Object.map = function(o, f, ctx) {
  ctx = ctx || this;
  var result = {};
  Object.keys(o).forEach(function(k) {
      result[k] = f.call(ctx, o[k], k, o);
  });
  return result;
}

function checkChord(note, scale) {
  const n = note % 12
  for (let key = 0; key < scale.length; key++) {
    if (scale[key] === n) {
      return key + 1
    }
  }
  return undefined
}

// transpose: 4 = 6th string starts from E
function createTunings(transpose = 4, drop = false) {
  let t = [0, 5, 10, 15, 19, 24]
  if (drop) {
    t = [-2, 5, 10, 15, 19, 24]
  }
  return (t).map(n => n + transpose)
}

function Mark(props) {
  const { degree, isChordTone } = props
  return <div className={`mark note-${degree}`}>
    <div className="inner">
      <div className={`background ${isChordTone ? "chord" : ""}`}></div>
      <div className="label">{degree}</div>
    </div>
  </div>
}

function Fret(props) {
  const { degree, isChordTone, note } = props
  return <div
    className="Fret"
    onClick={() => playNotes([note])}>
    {degree && <Mark degree={degree} isChordTone={isChordTone} />}
  </div>
}

function Guitar(props) {
  const { tunings, scale, chordNotes } = props

  const strings = []
  for (let s = 0; s < tunings.length; s++) {
    const frets = []
    for (let f = 0; f <= 24; f++) {
      const note = tunings[tunings.length - 1 - s] + f
      const degree = checkChord(note, scale)
      const isChordTone = chordNotes.map(c => c % 12).includes(note % 12)
      frets.push(<Fret degree={degree} note={note}  isChordTone={isChordTone} />)
    }
    strings.push(<div className="string">{ frets }</div>)
  }

  return <div className="Guitar">{ strings }</div>
}

function isNoteBlack(note) {
  return [1, 3, 6, 8, 10].includes(note % 12)
}

function isKeyBordered(note) {
  return [4, 11].includes(note % 12)
}

function Key(props) {
  const { degree, note, isChordTone } = props

  return <div
    className={`Key ${isNoteBlack(note) ? "black" : "white"} ${isKeyBordered(note) ? "bordered" : ""}`}
    onClick={() => playNotes([note])}>
    <Mark degree={degree} isChordTone={isChordTone} />
  </div>
}

function Piano(props) {
  const { scale, chordNotes } = props
  const keys = []
  for (let i = 0; i < 24; i++) {
    const note = i
    const degree = checkChord(note, scale)
    const isChordTone = chordNotes.map(c => c % 12).includes(note % 12)
    keys.push(<Key degree={degree} note={note} isChordTone={isChordTone} />)
  }
  return <div className="Piano">
    {keys}
  </div>
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

function noteToName(note) {
  return NOTE_NAMES[note]
}

function nameToNote(name) {
  return NOTE_NAMES.indexOf(name)
}

const TUNINGS = {
  "Standard": 4,
  "-1": 3,
  "-2": 2,
  "-3": 1,
  "-4": 0
}

const DEGREES = [
  {
    title: "I",
    name: "tonic"
  },
  {
    title: "II",
    name: "supertonic"
  },
  {
    title: "III",
    name: "mediant"
  },
  {
    title: "IV",
    name: "subdominant"
  },
  {
    title: "V",
    name: "dominant"
  },
  {
    title: "VI",
    name: "submediant"
  },
  {
    title: "VII°",
    name: "leading tone"
  }
]

function createChord(scale, degree) {
  if (scale.length !== 7) {
    return {}
  }

  const degrees = [0, 2, 4, 6].map(n => n + degree)
  const notes = degrees.map(d => {
    const oct = Math.floor(d / scale.length)
    return scale[d % scale.length] + oct * 12
  })

  console.log(notes)

  const deg = DEGREES[degree % DEGREES.length]
  const name = chordName(notes)

  return {
    title: deg.title,
    degreeName: deg.name,
    name,
    degrees: degrees.map(d => (d % scale.length) + 1),
    notes
  }
}

function chordName(notes) {
  const root = notes[0]
  function has(note) {
    return notes.includes((root + note) % 12)
  }
  const add2 = has(2) // same as add9
  const minor = has(3)
  const major = has(4)
  const sus4 = !has(4) && has(5)
  const add4 = has(4) && has(5) // same as add11
  const flat5 = !has(7) && has(6)
  const aug = !has(7) && has(8)
  const sixth = has(9)
  const seventh = has(10)
  const majSeventh = has(11)
  return noteToName(root)
    + (major ? "" : "")
    + (minor ? "m" : "")
    + (sixth ? "6" : "")
    + (seventh ? "7" : "")
    + (majSeventh ? "M7" : "")
    + (sus4 ? "sus4" : "")
    + (add2 ? "add2" : "")
    + (add4 ? "add4" : "")
    + (flat5 ? "♭5" : "")
    + (aug ? "aug" : "")
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scaleType: "major",
      transpose: 4,
      drop: false,
      key: 0,
      selectedDegree: 0
    }
  }

  render() {
    const scales = createScales(this.state.key)
    const scale = scales[this.state.scaleType]
    const tunings = createTunings(this.state.transpose, this.state.drop)

    const onChangeKey = e => {
      this.setState({
        key: parseInt(e.target.value)
      })
    }

    const onChangeScale = e => {
      this.setState({
        scaleType: e.target.value
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

    const chords = scale.map((_, i) => createChord(scale, i))
    const chord = chords[this.state.selectedDegree]

    const onClickDegree = i => {
      this.setState({
        selectedDegree: i
      })

      playNotes(chords[i].notes)
    }

    return (
      <div className="App">
        <Guitar tunings={tunings} scale={scale} chordNotes={chord.notes} />
        <Piano scale={scale} chordNotes={chord.notes} />
        <div className="settings">
          <div className="section">
            <label>Key</label>
            <select value={this.state.key} onChange={onChangeKey}>
              {NOTE_NAMES.map(s => <option value={nameToNote(s)}>{s}</option>)}
            </select>
          </div>
          <div className="section">
            <label>Scale</label>
            <select value={this.state.scaleType} onChange={onChangeScale}>
              {Object.keys(scales).map(s => <option>{s}</option>)}
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
            {chords.map((chord, i) => {
              const selected = i === this.state.selectedDegree
              return <div className={`chord ${selected ? "selected" : ""}`} onClick={() => onClickDegree(i)}>
                <div className="title">{chord.title}</div>
                <div className="degree-name">{chord.degreeName}</div>
                <div className="name">{chord.name}</div>
                <div className="degrees">{chord.degrees.join(",")}</div>
              </div>
            })}
            </div>
        </div>
      </div>
    )
  }
}

export default App
