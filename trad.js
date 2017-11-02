let tradList = ''

export function setLang (newLang) {
  const normalizedLang = (() => {
    switch (newLang) {
      case 'fr':
      case 'fr_FR':
      case 'fr-fr':
        return 'fr_FR'
      case 'en':
      case 'en_EN':
      case 'en_US':
        return 'en_EN'
    }
  })()
  tradList = require('./translate/' + normalizedLang + '.json')
}

export function __ (tradId) {
  return tradList[tradId]
}
