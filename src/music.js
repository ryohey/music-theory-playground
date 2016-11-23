import { noteToName } from "./noteName"

Object.map = function(o, f, ctx) {
  ctx = ctx || this;
  var result = {};
  Object.keys(o).forEach(function(k) {
      result[k] = f.call(ctx, o[k], k, o);
  });
  return result;
}

export const SCALES = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
  harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  melodicMinor: [2, 1, 2, 2, 2, 2, 1],
  majorPentatonic: [2, 2, 3, 2, 3],
  minorPentatonic: [3, 2, 2, 3, 2],
}

export function createScale(name, key = 0) {
  const steps = SCALES[name]
  let lastNote = key
  return steps.map(step => {
    const note = lastNote % 12
    lastNote += step
    return note
  })
}

export function chordDegrees(degree) {
  return [0, 2, 4, 6].map(n => n + degree)
}

export function createChord(scale, degrees) {
  if (scale.length !== 7) {
    return {}
  }

  return degrees.map(d => {
    const oct = Math.floor(d / scale.length)
    return scale[d % scale.length] + oct * 12
  })
}

export function checkChord(note, scale) {
  const n = note % 12
  for (let key = 0; key < scale.length; key++) {
    if (scale[key] === n) {
      return key + 1
    }
  }
  return undefined
}

export const DEGREES = [
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

export function chordName(notes) {
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
