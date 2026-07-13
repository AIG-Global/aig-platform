export type LanguageMode = 'auto' | 'manual'

export const SUPPORTED_LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Espanol', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Francais', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portugues', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Turkce', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainska', flag: '🇺🇦' },
  { code: 'ru', name: 'Russkiy', flag: '🇷🇺' },
  { code: 'zh', name: 'Zhongwen', flag: '🇨🇳' },
  { code: 'ja', name: 'Nihongo', flag: '🇯🇵' },
  { code: 'ko', name: 'Hangugo', flag: '🇰🇷' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'bn', name: 'Bangla', flag: '🇧🇩' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi', name: 'Tieng Viet', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'he', name: 'Ivrit', flag: '🇮🇱' },
  { code: 'fa', name: 'Farsi', flag: '🇮🇷' },
] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGE_OPTIONS)[number]['code']

const LEGACY_LANGUAGE_KEY = 'userLanguage'
const LANGUAGE_KEY_PREFIX = 'aig:user-language:'
const LANGUAGE_MODE_PREFIX = 'aig:user-language-mode:'

const COUNTRIES_BY_LANGUAGE: Partial<Record<SupportedLanguage, string[]>> = {
  es: ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'EC', 'UY', 'PY', 'BO', 'CR', 'PA', 'DO', 'GT', 'HN', 'SV', 'NI', 'VE'],
  de: ['DE', 'AT', 'CH'],
  fr: ['FR', 'BE', 'CH', 'LU', 'MC', 'SN', 'CI', 'CM', 'MA', 'DZ', 'TN'],
  it: ['IT', 'SM', 'VA'],
  pt: ['PT', 'BR', 'AO', 'MZ'],
  nl: ['NL', 'BE', 'SR'],
  tr: ['TR', 'CY'],
  pl: ['PL'],
  uk: ['UA'],
  ru: ['RU', 'BY', 'KZ'],
  zh: ['CN', 'TW', 'HK', 'MO', 'SG'],
  ja: ['JP'],
  ko: ['KR'],
  hi: ['IN'],
  bn: ['BD'],
  ur: ['PK'],
  id: ['ID'],
  vi: ['VN'],
  th: ['TH'],
  ar: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'JO', 'EG', 'MA', 'DZ', 'TN', 'IQ', 'SY', 'LB', 'YE'],
  he: ['IL'],
  fa: ['IR', 'AF', 'TJ'],
}

const isSupportedLanguage = (value: string): value is SupportedLanguage => {
  return SUPPORTED_LANGUAGE_OPTIONS.some((option) => option.code === value)
}

export const normalizeLanguageCode = (raw?: string | null): SupportedLanguage => {
  if (!raw) return 'en'
  const normalized = raw.trim().toLowerCase().replace('_', '-')
  const base = normalized.split('-')[0]
  return isSupportedLanguage(base) ? base : 'en'
}

const getUserLanguageScope = () => {
  if (typeof window === 'undefined') return 'guest'

  const email = localStorage.getItem('userEmail')?.trim().toLowerCase()
  if (email) return `email:${email}`

  const username = localStorage.getItem('userName')?.trim().toLowerCase()
  if (username) return `user:${username}`

  return 'guest'
}

const getLanguageStorageKey = () => `${LANGUAGE_KEY_PREFIX}${getUserLanguageScope()}`
const getLanguageModeStorageKey = () => `${LANGUAGE_MODE_PREFIX}${getUserLanguageScope()}`

export const getStoredLanguagePreference = (): { language: SupportedLanguage; mode: LanguageMode } => {
  if (typeof window === 'undefined') return { language: 'en', mode: 'auto' }

  const storedLanguage = localStorage.getItem(getLanguageStorageKey())
  const storedMode = localStorage.getItem(getLanguageModeStorageKey())

  if (storedLanguage) {
    return {
      language: normalizeLanguageCode(storedLanguage),
      mode: storedMode === 'manual' ? 'manual' : 'auto',
    }
  }

  const legacyLanguage = localStorage.getItem(LEGACY_LANGUAGE_KEY)
  if (legacyLanguage) {
    const normalized = normalizeLanguageCode(legacyLanguage)
    localStorage.setItem(getLanguageStorageKey(), normalized)
    localStorage.setItem(getLanguageModeStorageKey(), 'manual')
    return { language: normalized, mode: 'manual' }
  }

  return { language: 'en', mode: 'auto' }
}

export const setStoredLanguagePreference = (language: SupportedLanguage, mode: LanguageMode) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getLanguageStorageKey(), language)
  localStorage.setItem(getLanguageModeStorageKey(), mode)
  localStorage.setItem(LEGACY_LANGUAGE_KEY, language)
}

const detectByCountryCode = (countryCode?: string | null): SupportedLanguage | null => {
  if (!countryCode) return null
  const normalizedCountry = countryCode.trim().toUpperCase()

  for (const [language, countries] of Object.entries(COUNTRIES_BY_LANGUAGE)) {
    if (countries?.includes(normalizedCountry)) {
      return language as SupportedLanguage
    }
  }

  return null
}

const detectFromNavigator = (): SupportedLanguage => {
  if (typeof navigator === 'undefined') return 'en'
  return normalizeLanguageCode(navigator.language)
}

export const detectLanguageForUser = async (): Promise<SupportedLanguage> => {
  if (typeof window === 'undefined') return 'en'

  try {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 2500)
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      cache: 'no-store',
    })
    window.clearTimeout(timeout)

    if (!response.ok) {
      return detectFromNavigator()
    }

    const payload = (await response.json()) as {
      country_code?: string
      languages?: string
    }

    const firstLanguageFromIp = payload.languages?.split(',')[0]
    if (firstLanguageFromIp) {
      const normalized = normalizeLanguageCode(firstLanguageFromIp)
      if (normalized !== 'en' || firstLanguageFromIp.toLowerCase().startsWith('en')) {
        return normalized
      }
    }

    const fromCountry = detectByCountryCode(payload.country_code)
    if (fromCountry) return fromCountry

    return detectFromNavigator()
  } catch {
    return detectFromNavigator()
  }
}
