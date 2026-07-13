'use client'

import { useEffect } from 'react'

function isProtectedTarget(target: EventTarget | null) {
  if (!(target instanceof Node)) return true

  const element = target instanceof Element ? target : target.parentElement
  if (!element) return true

  return !element.closest(
    'input, textarea, select, option, button, [contenteditable="true"], [data-allow-copy="true"]'
  )
}

export default function SiteProtection() {
  useEffect(() => {
    const suppressCopyAction = (event: Event) => {
      if (isProtectedTarget(event.target)) {
        event.preventDefault()
      }
    }

    const suppressKeyboardCopy = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      const hasModifier = event.ctrlKey || event.metaKey

      if (!hasModifier || event.altKey) return
      if (!['c', 'x', 'u', 's', 'p'].includes(key)) return

      if (isProtectedTarget(event.target)) {
        event.preventDefault()
      }
    }

    document.addEventListener('copy', suppressCopyAction, true)
    document.addEventListener('cut', suppressCopyAction, true)
    document.addEventListener('paste', suppressCopyAction, true)
    document.addEventListener('contextmenu', suppressCopyAction, true)
    document.addEventListener('selectstart', suppressCopyAction, true)
    document.addEventListener('dragstart', suppressCopyAction, true)
    document.addEventListener('keydown', suppressKeyboardCopy, true)

    return () => {
      document.removeEventListener('copy', suppressCopyAction, true)
      document.removeEventListener('cut', suppressCopyAction, true)
      document.removeEventListener('paste', suppressCopyAction, true)
      document.removeEventListener('contextmenu', suppressCopyAction, true)
      document.removeEventListener('selectstart', suppressCopyAction, true)
      document.removeEventListener('dragstart', suppressCopyAction, true)
      document.removeEventListener('keydown', suppressKeyboardCopy, true)
    }
  }, [])

  return null
}