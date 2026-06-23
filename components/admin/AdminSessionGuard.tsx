'use client'

import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const SESSION_FLAG = 'pp_admin_active'

/**
 * AdminSessionGuard — auto-logout on leaving the admin portal.
 * 
 * Strategy:
 * - sessionStorage flag: naturally cleared when tab/browser closes
 * - beforeunload + pagehide: send logout beacon when user navigates away or closes tab
 * - pageshow (bfcache): redirect to login if session flag is missing
 * 
 * NOTE: We do NOT use visibilitychange for auto-logout because it fires
 * when users open file picker dialogs, switch tabs to find files, etc.
 * This would break image uploads and other workflows.
 */
export function AdminSessionGuard() {
  const router = useRouter()
  const hasLoggedOutRef = useRef(false)

  useEffect(() => {
    // Mark this tab session as having an active admin login
    const wasActive = sessionStorage.getItem(SESSION_FLAG)
    if (!wasActive) {
      sessionStorage.setItem(SESSION_FLAG, Date.now().toString())
    }

    // --- beforeunload: fires when tab closes or user navigates to a different URL ---
    const handleBeforeUnload = () => {
      if (hasLoggedOutRef.current) return
      hasLoggedOutRef.current = true

      sessionStorage.removeItem(SESSION_FLAG)

      // Send logout beacon (fire-and-forget, works even during tab close)
      try {
        const logoutUrl = `${window.location.origin}/api/auth/signout`
        navigator.sendBeacon(logoutUrl)
      } catch {
        // Beacon failed — session will expire via 30-min maxAge
      }
    }

    // --- pagehide: more reliable than beforeunload on mobile browsers ---
    const handlePageHide = (e: PageTransitionEvent) => {
      // Only logout if the page is actually being discarded (not just hidden in bfcache)
      if (!e.persisted) {
        handleBeforeUnload()
      }
    }

    // --- pageshow: handles back/forward cache restoration ---
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page restored from bfcache — check if session flag still exists
        const flag = sessionStorage.getItem(SESSION_FLAG)
        if (!flag) {
          // Session was destroyed while page was cached — force re-login
          signOut({ redirect: false }).then(() => {
            router.push('/admin/login')
          })
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [router])

  return null // Behavior-only component, no UI
}
