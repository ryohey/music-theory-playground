export default class Synth {
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
