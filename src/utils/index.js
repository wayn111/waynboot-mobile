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

export function pathMatcher(matcherArr, path) {
  let flag = false
  matcherArr.forEach(item => {
    if (item.indexOf(path) > -1) {
      flag = true
      return
    }
    if (item.indexOf('**') > -1) {
      const newLocal = item.indexOf('**')
      const matcher = item.substr(0, newLocal)
      const target = path.substr(0, newLocal)
      if (matcher === target) {
        flag = true
        return
      }
    }
  })
  return flag
}
