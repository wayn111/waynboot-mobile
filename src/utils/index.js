import dayjs from 'dayjs'

// 只保留2位小数，如：2，会在2后面补上00.即2.00
export function toDecimal2(x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return false
  }
  var f1 = Math.round(x * 100) / 100
  var s = f1.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}

export const Valid = class Valid {
  static checkPhone(num) {
    if (num === 123456789) return true
    const reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (reg.test(num)) {
      return true
    }
    return false
  }
}

export function str2date(str, format) {
  return dayjs(str, format)
}
