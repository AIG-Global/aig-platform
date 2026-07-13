import { Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import type { Request } from 'express'
import axios from 'axios'

export interface GeoLocationData {
  country_code: string
  country_name: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  language: string
}

/**
 * Geolocation Service
 * Detects user's country and suggested language based on IP address
 * Uses a free geolocation API to map IP to country
 */
@Injectable()
export class GeolocationService {
  constructor(@Inject(REQUEST) private request: Request) {}

  /**
   * Get user's IP address from request
   */
  private getClientIp(): string {
    const ip =
      (this.request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      (this.request.headers['x-real-ip'] as string) ||
      this.request.socket?.remoteAddress ||
      'unknown'

    return ip
  }

  /**
   * Get geolocation data for an IP address
   * Falls back to hardcoded country-to-language mapping if API is unavailable
   */
  async getLocationByIp(ip?: string): Promise<GeoLocationData | null> {
    const ipAddress = ip || this.getClientIp()

    // Skip localhost
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress === 'unknown') {
      return null
    }

    try {
      // Using IP-API.com free tier (100 requests/minute)
      const response = await axios.get(`https://ip-api.com/json/${ipAddress}?fields=status,country,countryCode,city,lat,lon,timezone,continent`, {
        timeout: 5000
      })

      if (response.data.status === 'success') {
        return {
          country_code: response.data.countryCode,
          country_name: response.data.country,
          city: response.data.city,
          latitude: response.data.lat,
          longitude: response.data.lon,
          timezone: response.data.timezone,
          language: this.mapCountryToLanguage(response.data.countryCode)
        }
      }
    } catch (error) {
      // Fall back to country-code mapping
      console.warn('Geolocation API failed, using fallback')
    }

    return null
  }

  /**
   * Map country code to default language
   * This helps serve content in user's native language by default
   */
  private mapCountryToLanguage(countryCode: string): string {
    const countryToLanguage: Record<string, string> = {
      // Default for unknown
      'DEFAULT': 'ENGLISH',

      // Western Europe
      'DE': 'GERMAN',
      'FR': 'FRENCH',
      'ES': 'SPANISH',
      'GB': 'ENGLISH',
      'IE': 'ENGLISH',
      'NL': 'DUTCH',
      'BE': 'DUTCH',
      'AT': 'GERMAN',
      'CH': 'GERMAN',
      'IT': 'ITALIAN',
      'GR': 'GREEK',
      'PT': 'PORTUGUESE',

      // Northern Europe
      'SE': 'SWEDISH',
      'NO': 'NORWEGIAN',
      'DK': 'DANISH',
      'FI': 'SWEDISH',

      // Eastern Europe & Russia
      'RU': 'RUSSIAN',
      'UA': 'UKRAINIAN',
      'BY': 'RUSSIAN',
      'KZ': 'RUSSIAN',
      'PL': 'POLISH',
      'CZ': 'CZECH',
      'SK': 'CZECH',
      'RO': 'ROMANIAN',
      'MD': 'ROMANIAN',
      'RS': 'ENGLISH',
      'HR': 'ENGLISH',
      'SI': 'ENGLISH',

      // Middle East & Turkey
      'TR': 'TURKISH',
      'IL': 'HEBREW',
      'IR': 'PERSIAN',
      'AF': 'PERSIAN',

      // Asia - East
      'CN': 'CHINESE_SIMPLIFIED',
      'TW': 'CHINESE_TRADITIONAL',
      'HK': 'CHINESE_TRADITIONAL',
      'MO': 'CHINESE_TRADITIONAL',
      'JP': 'JAPANESE',
      'KR': 'KOREAN',

      // Asia - Southeast
      'TH': 'THAI',
      'VN': 'VIETNAMESE',
      'ID': 'INDONESIAN',
      'MY': 'INDONESIAN',
      'SG': 'ENGLISH',
      'PH': 'TAGALOG',
      'BN': 'INDONESIAN',
      'LA': 'LAO',
      'MM': 'BURMESE',
      'KH': 'KHMER',

      // South Asia
      'IN': 'HINDI',
      'PK': 'URDU',
      'BD': 'BENGALI',
      'LK': 'SINHALA',
      'NP': 'HINDI',

      // Africa - West
      'NG': 'YORUBA',
      'GH': 'ENGLISH',
      'SN': 'FRENCH',
      'CI': 'FRENCH',

      // Africa - Central & East
      'KE': 'SWAHILI',
      'TZ': 'SWAHILI',
      'UG': 'SWAHILI',
      'ET': 'AMHARIC',
      'SO': 'SOMALI',
      'DJ': 'ARABIC',

      // Africa - Southern
      'ZA': 'ZULU',
      'BW': 'ENGLISH',
      'ZW': 'ENGLISH',

      // Middle East & North Africa
      'SA': 'ARABIC_GULF',
      'AE': 'ARABIC_GULF',
      'KW': 'ARABIC_GULF',
      'QA': 'ARABIC_GULF',
      'BH': 'ARABIC_GULF',
      'OM': 'ARABIC_GULF',
      'YE': 'ARABIC',
      'EG': 'ARABIC_EGYPTIAN',
      'SY': 'ARABIC_LEVANTINE',
      'LB': 'ARABIC_LEVANTINE',
      'PS': 'ARABIC_LEVANTINE',
      'JO': 'ARABIC_LEVANTINE',
      'IQ': 'ARABIC',
      'MA': 'ARABIC_MOROCCAN',
      'DZ': 'ARABIC',
      'TN': 'ARABIC',
      'LY': 'ARABIC',

      // South America
      'BR': 'PORTUGUESE_BRAZILIAN',
      'AR': 'SPANISH_LATIN_AMERICAN',
      'MX': 'SPANISH_LATIN_AMERICAN',
      'CO': 'SPANISH_LATIN_AMERICAN',
      'PE': 'SPANISH_LATIN_AMERICAN',
      'CL': 'SPANISH_LATIN_AMERICAN',
      'VE': 'SPANISH_LATIN_AMERICAN',
      'EC': 'SPANISH_LATIN_AMERICAN',
      'BO': 'SPANISH_LATIN_AMERICAN',
      'PY': 'SPANISH_LATIN_AMERICAN',
      'UY': 'SPANISH_LATIN_AMERICAN'
    }

    return countryToLanguage[countryCode] || countryToLanguage['DEFAULT']
  }

  /**
   * Get all supported languages with metadata
   */
  getSupportedLanguages() {
    return {
      default: 'ENGLISH',
      languages: [
        // Default & Western
        { code: 'ENGLISH', name: 'English', nativeName: 'English', region: 'Default' },
        { code: 'GERMAN', name: 'German', nativeName: 'Deutsch', region: 'Europe' },
        { code: 'FRENCH', name: 'French', nativeName: 'Français', region: 'Europe' },
        { code: 'SPANISH', name: 'Spanish (Spain)', nativeName: 'Español', region: 'Europe' },
        { code: 'DUTCH', name: 'Dutch', nativeName: 'Nederlands', region: 'Europe' },
        { code: 'ITALIAN', name: 'Italian', nativeName: 'Italiano', region: 'Europe' },
        { code: 'GREEK', name: 'Greek', nativeName: 'Ελληνικά', region: 'Europe' },
        { code: 'PORTUGUESE', name: 'Portuguese (Portugal)', nativeName: 'Português', region: 'Europe' },
        { code: 'PORTUGUESE_BRAZILIAN', name: 'Portuguese (Brazilian)', nativeName: 'Português (Brasil)', region: 'South America' },

        // Northern Europe
        { code: 'SWEDISH', name: 'Swedish', nativeName: 'Svenska', region: 'Europe' },
        { code: 'NORWEGIAN', name: 'Norwegian', nativeName: 'Norsk', region: 'Europe' },
        { code: 'DANISH', name: 'Danish', nativeName: 'Dansk', region: 'Europe' },

        // Eastern Europe & Russia
        { code: 'RUSSIAN', name: 'Russian', nativeName: 'Русский', region: 'Europe' },
        { code: 'UKRAINIAN', name: 'Ukrainian', nativeName: 'Українська', region: 'Europe' },
        { code: 'POLISH', name: 'Polish', nativeName: 'Polski', region: 'Europe' },
        { code: 'CZECH', name: 'Czech', nativeName: 'Čeština', region: 'Europe' },
        { code: 'ROMANIAN', name: 'Romanian', nativeName: 'Română', region: 'Europe' },

        // Middle East
        { code: 'TURKISH', name: 'Turkish', nativeName: 'Türkçe', region: 'Middle East' },
        { code: 'HEBREW', name: 'Hebrew', nativeName: 'עברית', region: 'Middle East' },
        { code: 'PERSIAN', name: 'Persian (Farsi)', nativeName: 'فارسی', region: 'Middle East' },
        { code: 'ARABIC', name: 'Arabic (Standard)', nativeName: 'العربية', region: 'Middle East' },
        { code: 'ARABIC_EGYPTIAN', name: 'Arabic (Egyptian)', nativeName: 'العربية المصرية', region: 'Middle East' },
        { code: 'ARABIC_GULF', name: 'Arabic (Gulf)', nativeName: 'العربية الخليجية', region: 'Middle East' },
        { code: 'ARABIC_LEVANTINE', name: 'Arabic (Levantine)', nativeName: 'العربية الشامية', region: 'Middle East' },
        { code: 'ARABIC_MOROCCAN', name: 'Arabic (Moroccan)', nativeName: 'العربية المغربية', region: 'Africa' },

        // Asia - East
        { code: 'CHINESE_SIMPLIFIED', name: 'Chinese (Simplified)', nativeName: '简体中文', region: 'Asia' },
        { code: 'CHINESE_TRADITIONAL', name: 'Chinese (Traditional)', nativeName: '繁體中文', region: 'Asia' },
        { code: 'JAPANESE', name: 'Japanese', nativeName: '日本語', region: 'Asia' },
        { code: 'KOREAN', name: 'Korean', nativeName: '한국어', region: 'Asia' },

        // Asia - Southeast
        { code: 'THAI', name: 'Thai', nativeName: 'ไทย', region: 'Asia' },
        { code: 'VIETNAMESE', name: 'Vietnamese', nativeName: 'Tiếng Việt', region: 'Asia' },
        { code: 'INDONESIAN', name: 'Indonesian', nativeName: 'Bahasa Indonesia', region: 'Asia' },
        { code: 'TAGALOG', name: 'Tagalog', nativeName: 'Tagalog', region: 'Asia' },
        { code: 'BURMESE', name: 'Burmese', nativeName: 'ဗမာ', region: 'Asia' },
        { code: 'LAO', name: 'Lao', nativeName: 'ລາວ', region: 'Asia' },
        { code: 'KHMER', name: 'Khmer', nativeName: 'ខ្មែរ', region: 'Asia' },

        // South Asia
        { code: 'HINDI', name: 'Hindi', nativeName: 'हिन्दी', region: 'Asia' },
        { code: 'URDU', name: 'Urdu', nativeName: 'اردو', region: 'Asia' },
        { code: 'PUNJABI', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Asia' },
        { code: 'TAMIL', name: 'Tamil', nativeName: 'தமிழ்', region: 'Asia' },
        { code: 'TELUGU', name: 'Telugu', nativeName: 'తెలుగు', region: 'Asia' },
        { code: 'KANNADA', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Asia' },
        { code: 'MARATHI', name: 'Marathi', nativeName: 'मराठी', region: 'Asia' },
        { code: 'BENGALI', name: 'Bengali', nativeName: 'বাংলা', region: 'Asia' },
        { code: 'SINHALA', name: 'Sinhala', nativeName: 'සිංහල', region: 'Asia' },

        // Africa - East & Horn
        { code: 'SWAHILI', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
        { code: 'SOMALI', name: 'Somali', nativeName: 'Soomaali', region: 'Africa' },
        { code: 'AMHARIC', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa' },

        // Africa - West & Central
        { code: 'YORUBA', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa' },
        { code: 'IGBO', name: 'Igbo', nativeName: 'Igbo', region: 'Africa' },
        { code: 'HAUSA', name: 'Hausa', nativeName: 'Hausa', region: 'Africa' },

        // Africa - Southern
        { code: 'ZULU', name: 'Zulu', nativeName: 'isiZulu', region: 'Africa' },
        { code: 'XHOSA', name: 'Xhosa', nativeName: 'isiXhosa', region: 'Africa' },
        { code: 'AFRIKAANS', name: 'Afrikaans', nativeName: 'Afrikaans', region: 'Africa' },

        // South America
        { code: 'SPANISH_LATIN_AMERICAN', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)', region: 'South America' }
      ]
    }
  }
}
