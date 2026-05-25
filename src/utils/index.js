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
    return /^1[34578]\d{9}$/.test(num)
  }
}

export function str2date(str, format) {
  return dayjs(str, format)
}

export function pathMatcher(matcherArr, path) {
  return matcherArr.some((item) => {
    if (item.includes('**')) {
      const prefix = item.slice(0, item.indexOf('**'))
      return path.startsWith(prefix)
    }
    return item === path
  })
}
