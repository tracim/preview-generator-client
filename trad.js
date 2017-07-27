let tradList = ''

export function setLang (newLang) {
  tradList = require('./translate/' + newLang + '.json')
}

export function __ (tradId) {
  return tradList[tradId]
}
