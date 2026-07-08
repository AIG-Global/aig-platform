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
      'NL': 'ENGLISH',
      'BE': 'FRENCH',
      'AT': 'GERMAN',
      'CH': 'GERMAN',

      // Southern Europe & Russia
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
      'LA': 'ENGLISH',
      'MM': 'ENGLISH',
      'KH': 'ENGLISH',

      // India & South Asia
      'IN': 'HINDI',
      'BD': 'BENGALI',
      'LK': 'ENGLISH',
      'NP': 'ENGLISH',
      'PK': 'ENGLISH',

      // Africa
      'NG': 'YORUBA',
      'KE': 'SWAHILI',
      'TZ': 'SWAHILI',
      'UG': 'SWAHILI',
      'ET': 'AMHARIC',
      'MA': 'FRENCH',
      'EG': 'ENGLISH',
      'ZA': 'ENGLISH',
      'GH': 'ENGLISH',

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
        { code: 'GERMAN', name: 'German', nativeName: 'Deutsch', region: 'Western Europe' },
        { code: 'FRENCH', name: 'French', nativeName: 'Français', region: 'Western Europe' },
        { code: 'SPANISH', name: 'Spanish (Spain)', nativeName: 'Español', region: 'Western Europe' },

        // Southern Europe & Russia
        { code: 'RUSSIAN', name: 'Russian', nativeName: 'Русский', region: 'Eastern Europe & Russia' },
        { code: 'UKRAINIAN', name: 'Ukrainian', nativeName: 'Українська', region: 'Eastern Europe & Russia' },
        { code: 'POLISH', name: 'Polish', nativeName: 'Polski', region: 'Eastern Europe & Russia' },
        { code: 'CZECH', name: 'Czech', nativeName: 'Čeština', region: 'Eastern Europe & Russia' },
        { code: 'ROMANIAN', name: 'Romanian', nativeName: 'Română', region: 'Eastern Europe & Russia' },

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

        // India & South Asia
        { code: 'HINDI', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
        { code: 'TAMIL', name: 'Tamil', nativeName: 'தமிழ்', region: 'India' },
        { code: 'TELUGU', name: 'Telugu', nativeName: 'తెలుగు', region: 'India' },
        { code: 'KANNADA', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'India' },
        { code: 'MARATHI', name: 'Marathi', nativeName: 'मराठी', region: 'India' },
        { code: 'BENGALI', name: 'Bengali', nativeName: 'বাংলা', region: 'India' },

        // Africa
        { code: 'SWAHILI', name: 'Swahili', nativeName: 'Kiswahili', region: 'Africa' },
        { code: 'AMHARIC', name: 'Amharic', nativeName: 'አማርኛ', region: 'Africa' },
        { code: 'YORUBA', name: 'Yoruba', nativeName: 'Yorùbá', region: 'Africa' },
        { code: 'IGBO', name: 'Igbo', nativeName: 'Igbo', region: 'Africa' },

        // South America
        { code: 'PORTUGUESE_BRAZILIAN', name: 'Portuguese (Brazilian)', nativeName: 'Português (Brasil)', region: 'South America' },
        { code: 'SPANISH_LATIN_AMERICAN', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)', region: 'South America' }
      ]
    }
  }
}
