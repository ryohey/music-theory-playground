export const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export function noteToName(note) {
  return NOTE_NAMES[note % 12]
}

export function nameToNote(name) {
  return NOTE_NAMES.indexOf(name)
}
