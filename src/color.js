import Color from "color"

/**
  単音なら無色
　無音は黒
  半音階などの近い音程を近い色として扱わない（音として調和しないものは色として調和させない）
  周波数比が単純なものが調和する
  全ての音階を含むとき白になる
  というようなルールを満たす色のマッピングを行いたい

  調和する順と周波数比 (音程)
  1:1 (0) 1度
  1:2 (12) 完全8度
  2:3 (7) 5度
  3:4 (5) 4度
  3:5 (9) 長6度
  4:5 (4) 長3度
  5:6 (3) 短3度
  5:8 (8) 短6度
  8:9 (2) 長2度
  8:15 (11) 長7度
  9:16 (10) 短7度
  15:16 (1) 短2度
  32:45 (6) 短5度

  この順番で C ~ B まで色を付ける
*/

const HARMONY = [0, 7, 5, 9, 4, 3, 8, 2, 11, 10, 1, 6]

// hue: 0 -> 360
export function notesToColor(notes) {
  let result
  notes.forEach(note => {
    const hue = HARMONY.indexOf(note % 12) / 12 * 360
    const color = Color({h: hue, s: 100, l: 50})
    if (!result) {
      result = color
    } else {
      result = result.mix(color)
    }
  })
  return result.rgbString()
}
