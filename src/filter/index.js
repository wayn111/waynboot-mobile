import dayjs from 'dayjs'
import { isNumber } from 'lodash'

export const dateFormat = (value, format = 'YYYY-MM-DD') =>
  value ? dayjs(value * 1000).format(format) : ''

export const yuan = (value) => {
  return isNumber(value) ? `${value.toFixed(2)}` : value
}

export default function setupFilters(app) {
  app.config.globalProperties.yuan = yuan
  app.config.globalProperties.dateFormat = dateFormat
}
