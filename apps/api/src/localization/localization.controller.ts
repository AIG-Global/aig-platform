import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { LanguageService } from './language.service.js'
import { GeolocationService } from './geolocation.service.js'

@Controller('localization')
export class LocalizationController {
  constructor(
    private language: LanguageService,
    private geolocation: GeolocationService
  ) {}

  /**
   * GET /api/localization/languages
   * Get all supported languages with metadata
   * Public endpoint - no auth required
   */
  @Get('languages')
  getSupportedLanguages() {
    return this.geolocation.getSupportedLanguages()
  }

  /**
   * GET /api/localization/detect
   * Detect user's language based on IP address
   * Public endpoint - no auth required
   * Returns suggested language for the user's location
   */
  @Get('detect')
  async detectLanguage(@Query('ip') ip?: string) {
    const geoData = await this.geolocation.getLocationByIp(ip)

    if (!geoData) {
      return {
        detected: false,
        suggestedLanguage: 'ENGLISH',
        reason: 'Could not detect location'
      }
    }

    return {
      detected: true,
      suggestedLanguage: geoData.language,
      countryCode: geoData.country_code,
      countryName: geoData.country_name,
      city: geoData.city,
      timezone: geoData.timezone,
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      reason: `Detected from IP location: ${geoData.country_name}`
    }
  }

  /**
   * GET /api/localization/user/:userId
   * Get user's current language preference
   * Requires authentication
   */
  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserLanguage(@Param('userId') userId: string) {
    const language = await this.language.getUserLanguage(userId)

    const metadata = this.geolocation.getSupportedLanguages()
    const languageData = metadata.languages.find(l => l.code === language)

    return {
      userId,
      language,
      languageName: languageData?.name || language,
      nativeName: languageData?.nativeName || language,
      region: languageData?.region || 'Unknown'
    }
  }

  /**
   * POST /api/localization/user/:userId
   * Update user's language preference
   * Requires authentication
   * Body: { language: string }
   */
  @Post('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  async updateUserLanguage(
    @Param('userId') userId: string,
    @Body() body: { language: string }
  ) {
    const updatedUser = await this.language.updateUserLanguage(userId, body.language)

    const metadata = this.geolocation.getSupportedLanguages()
    const languageData = metadata.languages.find(l => l.code === updatedUser.language)

    return {
      success: true,
      user: {
        ...updatedUser,
        languageName: languageData?.name || updatedUser.language,
        nativeName: languageData?.nativeName || updatedUser.language,
        region: languageData?.region || 'Unknown'
      },
      message: `Language preference updated to ${languageData?.name || updatedUser.language}`
    }
  }

  /**
   * POST /api/localization/init
   * Initialize user language - used on first login or signup
   * Sets language based on IP detection if not already set
   * Requires authentication
   * Body: { suggestedLanguage?: string }
   */
  @Post('init')
  @UseGuards(AuthGuard('jwt'))
  async initializeUserLanguage(
    @Param('userId') userId: string,
    @Body() body: { userId: string; suggestedLanguage?: string }
  ) {
    const currentLanguage = await this.language.getUserLanguage(body.userId)

    // If user already has a language preference, return it
    if (currentLanguage && currentLanguage !== 'ENGLISH') {
      return {
        success: false,
        userId: body.userId,
        language: currentLanguage,
        reason: 'User already has a language preference'
      }
    }

    // If suggested language is provided, use it
    if (body.suggestedLanguage) {
      if (this.language.isLanguageSupported(body.suggestedLanguage)) {
        await this.language.updateUserLanguage(body.userId, body.suggestedLanguage)
        return {
          success: true,
          userId: body.userId,
          language: body.suggestedLanguage,
          reason: 'Language initialized with suggested language'
        }
      }
    }

    // Detect language from IP
    const geoData = await this.geolocation.getLocationByIp()
    if (geoData && geoData.language !== 'ENGLISH') {
      await this.language.updateUserLanguage(body.userId, geoData.language)
      return {
        success: true,
        userId: body.userId,
        language: geoData.language,
        countryCode: geoData.country_code,
        reason: 'Language initialized from IP location'
      }
    }

    return {
      success: true,
      userId: body.userId,
      language: 'ENGLISH',
      reason: 'Language initialized to default (English)'
    }
  }

  /**
   * GET /api/localization/metadata
   * Get detailed metadata about all supported languages
   * Public endpoint - useful for frontend language selector UI
   */
  @Get('metadata')
  getLanguageMetadata() {
    return this.geolocation.getSupportedLanguages()
  }

  /**
   * GET /api/localization/language/:code
   * Get detailed info about a specific language
   */
  @Get('language/:code')
  getLanguageInfo(@Param('code') code: string) {
    const metadata = this.geolocation.getSupportedLanguages()
    const language = metadata.languages.find(l => l.code === code)

    if (!language) {
      return {
        error: 'Language not found',
        code: code
      }
    }

    return language
  }
}
