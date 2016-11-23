export default class Synth {
  constructor(url) {
    this.sy = window.open(url, "sy1", "width=900,height=670,scrollbars=yes,resizable=yes")
  }

  noteOn(note, velocity = 100, channel = 0) {
    this.sendMessage(this.sy, `midi,9${channel.toString(16)},${note.toString(16)},${velocity.toString(16)}`)
  }

  noteOff(note, channel = 0) {
    this.sendMessage(this.sy, `midi,8${channel.toString(16)},${note.toString(16)},0`)
  }

  allSoundOff() {
    this.sendMessage(this.sy, "midi,b0,78,0")
  }

  sendMessage(sy, s) {
    if (this.sy) {
      this.sy.postMessage(s, "*")
    }
  }
}
