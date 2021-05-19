// 切割字符串
exports.strToArr = (value, split = ' ') => value.split(split)

// 格式化字符串
exports.formatDisplay = (arr, spr = '\r\n') => {
  return arr.map(v => v.map(m => m.padEnd(20, ' ')).join('')).join(spr)
}
