import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../prisma.service.js'

/**
 * Language / Localization Service
 * Manages user language preferences and provides language configuration
 */
@Injectable()
export class LanguageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Supported languages (should match Prisma Language enum)
   */
  private readonly supportedLanguages = [
    'ENGLISH',
    'GERMAN',
    'FRENCH',
    'SPANISH',
    'RUSSIAN',
    'UKRAINIAN',
    'POLISH',
    'CZECH',
    'ROMANIAN',
    'CHINESE_SIMPLIFIED',
    'CHINESE_TRADITIONAL',
    'JAPANESE',
    'KOREAN',
    'THAI',
    'VIETNAMESE',
    'INDONESIAN',
    'TAGALOG',
    'HINDI',
    'TAMIL',
    'TELUGU',
    'KANNADA',
    'MARATHI',
    'BENGALI',
    'SWAHILI',
    'AMHARIC',
    'YORUBA',
    'IGBO',
    'PORTUGUESE_BRAZILIAN',
    'SPANISH_LATIN_AMERICAN'
  ]

  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return this.supportedLanguages
  }

  /**
   * Validate if a language is supported
   */
  isLanguageSupported(language: string): boolean {
    return this.supportedLanguages.includes(language)
  }

  /**
   * Update user language preference
   * Called when user changes their language setting
   */
  async updateUserLanguage(userId: string, language: string): Promise<any> {
    if (!this.isLanguageSupported(language)) {
      throw new BadRequestException(
        `Language '${language}' is not supported. Supported languages: ${this.supportedLanguages.join(', ')}`
      )
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        language: language as any
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        language: true,
        updated_at: true
      }
    })

    return updatedUser
  }

  /**
   * Get user language preference
   */
  async getUserLanguage(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { language: true }
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    return user.language
  }

  /**
   * Get language metadata (names, regions, etc.)
   */
  getLanguageMetadata() {
    return {
      default: 'ENGLISH',
      languages: [
        // Default & Western
        { code: 'ENGLISH', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Default' },
        { code: 'GERMAN', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Western Europe' },
        { code: 'FRENCH', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'Western Europe' },
        { code: 'SPANISH', name: 'Spanish (Spain)', nativeName: 'Español', flag: '🇪🇸', region: 'Western Europe' },

        // Southern Europe & Russia
        { code: 'RUSSIAN', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eastern Europe & Russia' },
        { code: 'UKRAINIAN', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', region: 'Eastern Europe & Russia' },
        { code: 'POLISH', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', region: 'Eastern Europe & Russia' },
        { code: 'CZECH', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿', region: 'Eastern Europe & Russia' },
        { code: 'ROMANIAN', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴', region: 'Eastern Europe & Russia' },

        // Asia - East
        { code: 'CHINESE_SIMPLIFIED', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'Asia' },
        { code: 'CHINESE_TRADITIONAL', name: 'Chinese (Traditional)', nativeName: '繁體中文', flag: '🇭🇰', region: 'Asia' },
        { code: 'JAPANESE', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia' },
        { code: 'KOREAN', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', region: 'Asia' },

        // Asia - Southeast
        { code: 'THAI', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', region: 'Asia' },
        { code: 'VIETNAMESE', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', region: 'Asia' },
        { code: 'INDONESIAN', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asia' },
        { code: 'TAGALOG', name: 'Tagalog', nativeName: 'Tagalog', flag: '🇵🇭', region: 'Asia' },

        // India & South Asia
        { code: 'HINDI', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'India' },
        { code: 'TAMIL', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', region: 'India' },
        { code: 'TELUGU', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', region: 'India' },
        { code: 'KANNADA', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', region: 'India' },
        { code: 'MARATHI', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', region: 'India' },
        { code: 'BENGALI', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', region: 'India' },

        // Africa
        { code: 'SWAHILI', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', region: 'Africa' },
        { code: 'AMHARIC', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹', region: 'Africa' },
        { code: 'YORUBA', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', region: 'Africa' },
        { code: 'IGBO', name: 'Igbo', nativeName: 'Igbo', flag: '🇳🇬', region: 'Africa' },

        // South America
        { code: 'PORTUGUESE_BRAZILIAN', name: 'Portuguese (Brazilian)', nativeName: 'Português (Brasil)', flag: '🇧🇷', region: 'South America' },
        { code: 'SPANISH_LATIN_AMERICAN', name: 'Spanish (Latin America)', nativeName: 'Español (Latinoamérica)', flag: '🇲🇽', region: 'South America' }
      ]
    }
  }

  /**
   * Get language name by code
   */
  getLanguageName(code: string): string {
    const metadata = this.getLanguageMetadata()
    const language = metadata.languages.find(l => l.code === code)
    return language ? language.name : 'Unknown'
  }

  /**
   * Get native language name by code
   */
  getLanguageNativeName(code: string): string {
    const metadata = this.getLanguageMetadata()
    const language = metadata.languages.find(l => l.code === code)
    return language ? language.nativeName : 'Unknown'
  }

  /**
   * Get language region by code
   */
  getLanguageRegion(code: string): string {
    const metadata = this.getLanguageMetadata()
    const language = metadata.languages.find(l => l.code === code)
    return language ? language.region : 'Unknown'
  }
}
