'use client'

import { useEffect } from 'react'
import {
  detectLanguageForUser,
  getStoredLanguagePreference,
  setStoredLanguagePreference,
  SUPPORTED_LANGUAGE_OPTIONS,
  type SupportedLanguage,
  type LanguageMode,
} from '../lib/language-preference'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: {
      translate?: {
        TranslateElement?: new (
          options: { pageLanguage: string; autoDisplay?: boolean; includedLanguages?: string },
          elementId: string
        ) => unknown
      }
    }
  }
}

type LanguageChangeDetail = {
  language?: SupportedLanguage
  mode?: LanguageMode
}

const setGoogleTranslateCookie = (langCode: string) => {
  const value = `/auto/${langCode}`
  const maxAge = 60 * 60 * 24 * 365
  document.cookie = `googtrans=${value};path=/;max-age=${maxAge}`
  document.cookie = `googtrans=${value};path=/;domain=${window.location.hostname};max-age=${maxAge}`
}

const applyDocumentLanguage = (langCode: string) => {
  const root = document.documentElement
  root.lang = langCode
  root.dir = langCode === 'ar' ? 'rtl' : 'ltr'
}

const applyGoogleTranslateLanguage = (langCode: string) => {
  setGoogleTranslateCookie(langCode)

  if (langCode === 'en') {
    return
  }

  const trySelectLanguage = () => {
    const select = document.querySelector<HTMLSelectElement>('select.goog-te-combo')
    if (!select) return false
    select.value = langCode
    select.dispatchEvent(new Event('change'))
    return true
  }

  if (trySelectLanguage()) return

  let attempts = 0
  const timer = window.setInterval(() => {
    attempts += 1
    if (trySelectLanguage() || attempts > 20) {
      window.clearInterval(timer)
    }
  }, 250)
}

const loadGoogleTranslate = () => {
  if (document.getElementById('google_translate_script')) return

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        autoDisplay: false,
        includedLanguages: SUPPORTED_LANGUAGE_OPTIONS.map((option) => option.code).filter((code) => code !== 'en').join(','),
      },
      'google_translate_element'
    )
  }

  const script = document.createElement('script')
  script.id = 'google_translate_script'
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
  script.async = true
  document.body.appendChild(script)
}

export default function SiteLanguage() {
  useEffect(() => {
    let isDisposed = false

    const applyLanguage = (langCode: SupportedLanguage) => {
      applyDocumentLanguage(langCode)
      applyGoogleTranslateLanguage(langCode)
      window.dispatchEvent(new CustomEvent('aig-language-applied', { detail: { language: langCode } }))
    }

    const applyAutoLanguage = async () => {
      const detected = await detectLanguageForUser()
      if (isDisposed) return
      setStoredLanguagePreference(detected, 'auto')
      applyLanguage(detected)
    }

    const initializeLanguage = async () => {
      const preference = getStoredLanguagePreference()
      if (preference.mode === 'manual') {
        applyLanguage(preference.language)
        return
      }

      await applyAutoLanguage()
    }

    loadGoogleTranslate()
    void initializeLanguage()

    const onLanguageChange = (event: Event) => {
      const detail = (event as CustomEvent<LanguageChangeDetail>).detail || {}
      const mode = detail.mode ?? 'manual'

      if (mode === 'auto') {
        void applyAutoLanguage()
        return
      }

      const requested = detail.language ?? 'en'
      setStoredLanguagePreference(requested, 'manual')
      applyLanguage(requested)
    }

    window.addEventListener('aig-language-changed', onLanguageChange as EventListener)
    return () => {
      isDisposed = true
      window.removeEventListener('aig-language-changed', onLanguageChange as EventListener)
    }
  }, [])

  return <div id="google_translate_element" style={{ display: 'none' }} />
}
