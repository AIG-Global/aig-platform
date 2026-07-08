const path = require('path')

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',
      'de',
      'fr',
      'es',
      'ru',
      'uk',
      'pl',
      'cs',
      'ro',
      'zh-CN',
      'zh-TW',
      'ja',
      'ko',
      'th',
      'vi',
      'id',
      'tl',
      'hi',
      'ta',
      'te',
      'kn',
      'mr',
      'bn',
      'sw',
      'am',
      'yo',
      'ig',
      'pt-BR',
      'es-MX',
      'ar',
      'ar-EG',
      'ar-SA',
      'ar-SY',
      'ar-MA'
    ]
  },
  localePath: path.resolve('./public/locales'),
  ns: ['common', 'auth', 'dashboard', 'compliance', 'errors'],
  defaultNS: 'common',
  fallbackLng: 'en',
  fallbackNS: 'common',
  interpolation: {
    escapeValue: false // React already does escaping
  },
  load: 'languageOnly', // Use language codes instead of region codes
  react: {
    useSuspense: false // Needed for SSG
  }
}
