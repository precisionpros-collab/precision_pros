'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/actions'

export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (lastTracked.current === pathname) return

    const doNotTrack =
      navigator.doNotTrack === '1' ||
      (window as unknown as { doNotTrack?: string }).doNotTrack === '1' ||
      navigator.doNotTrack === 'yes'
    if (doNotTrack) return

    const timer = window.setTimeout(() => {
      lastTracked.current = pathname
      trackPageView(pathname, document.referrer || undefined, navigator.userAgent)
    }, 1200)

    return () => window.clearTimeout(timer)
  }, [pathname])

  return null
}
