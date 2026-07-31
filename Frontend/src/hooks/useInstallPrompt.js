import { useEffect, useState } from 'react'

const DISMISSED_KEY = 'dera_install_prompt_dismissed'

function isStandaloneDisplay() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function isIosDevice() {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1)
}

function isSafariBrowser() {
  const ua = window.navigator.userAgent
  return /safari/i.test(ua) && !/crios|fxios|edgios|chrome|android/i.test(ua)
}

/**
 * Drives the "Install App" experience across platforms:
 * - Chrome/Edge/Android: captures the native `beforeinstallprompt` event so
 *   we can show our own button and trigger the real prompt on demand.
 * - iOS Safari: has no install event at all, so we surface manual
 *   "Add to Home Screen" instructions instead.
 * A dismissal is remembered in localStorage so the banner doesn't nag.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === 'true')

  const isIos = isIosDevice() && isSafariBrowser()

  useEffect(() => {
    setIsStandalone(isStandaloneDisplay())

    function handleBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    function handleAppInstalled() {
      setDeferredPrompt(null)
      setIsStandalone(true)
      localStorage.removeItem(DISMISSED_KEY)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const canPromptInstall = !!deferredPrompt
  const showIosInstructions = isIos && !isStandalone

  const shouldShow = !isStandalone && !dismissed && (canPromptInstall || showIosInstructions)

  async function promptInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true')
    setDismissed(true)
  }

  return {
    shouldShow,
    canPromptInstall,
    showIosInstructions,
    promptInstall,
    dismiss,
  }
}
