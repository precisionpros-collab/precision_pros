'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const SECRET_SEQUENCE = ['p', 'r', 'e', 'c', 'i', 's', 'i', 'o', 'n']
const LOGO_CLICKS_REQUIRED = 5
const LOGO_CLICK_WINDOW_MS = 2500

export function HiddenAdminEntry() {
  const router = useRouter()
  const seqIndex = useRef(0)
  const logoClicks = useRef(0)
  const logoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = e.key.toLowerCase()
      if (key === SECRET_SEQUENCE[seqIndex.current]) {
        seqIndex.current++
        if (seqIndex.current === SECRET_SEQUENCE.length) {
          seqIndex.current = 0
          router.push('/admin/login')
        }
      } else {
        seqIndex.current = key === SECRET_SEQUENCE[0] ? 1 : 0
      }
    }

    const handleLogoClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-admin-gate]')) return

      logoClicks.current++
      if (logoTimer.current) clearTimeout(logoTimer.current)
      logoTimer.current = setTimeout(() => { logoClicks.current = 0 }, LOGO_CLICK_WINDOW_MS)

      if (logoClicks.current >= LOGO_CLICKS_REQUIRED) {
        logoClicks.current = 0
        router.push('/admin/login')
      }
    }

    window.addEventListener('keydown', handleKey)
    document.addEventListener('click', handleLogoClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('click', handleLogoClick)
      if (logoTimer.current) clearTimeout(logoTimer.current)
    }
  }, [router])

  return null
}
