'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTokenExpiry, logoutAndRedirect } from '@/lib/auth'

/**
 * Ends a browser session at the JWT's expiry time, including while the user
 * is idle and no API request is made to receive the backend's 401 response.
 */
export default function SessionExpiryHandler() {
  const pathname = usePathname()

  useEffect(() => {
    const expireIfNeeded = () => {
      const expiresAt = getTokenExpiry()
      if (!expiresAt || expiresAt > Date.now()) return false

      logoutAndRedirect()
      return true
    }

    if (expireIfNeeded()) return

    const scheduleExpiryCheck = () => {
      const expiresAt = getTokenExpiry()
      if (!expiresAt) return null

      const remainingMs = expiresAt - Date.now()
      return window.setTimeout(
        () => {
          if (!expireIfNeeded()) timeoutId = scheduleExpiryCheck()
        },
        Math.min(remainingMs, 2_147_483_647),
      )
    }

    let timeoutId = scheduleExpiryCheck()
    window.addEventListener('focus', expireIfNeeded)
    document.addEventListener('visibilitychange', expireIfNeeded)

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      window.removeEventListener('focus', expireIfNeeded)
      document.removeEventListener('visibilitychange', expireIfNeeded)
    }
  }, [pathname])

  return null
}
