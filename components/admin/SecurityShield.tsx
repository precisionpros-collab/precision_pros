'use client'

import { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'

export function SecurityShield() {
  const [devToolsDetected, setDevToolsDetected] = useState(false)

  useEffect(() => {
    // Only apply protections in production
    if (process.env.NODE_ENV !== 'production') return

    // --- 1. Suppress console output to prevent data leaks ---
    const noop = () => {}
    const originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      table: console.table,
      dir: console.dir,
      trace: console.trace,
    }

    console.log = noop
    console.warn = noop
    console.info = noop
    console.debug = noop
    console.table = noop
    console.dir = noop
    console.trace = noop
    // Keep console.error for critical errors only but sanitize
    console.error = (...args: unknown[]) => {
      // Only allow error objects through, strip string messages that might contain data
      const sanitized = args.map(arg => {
        if (arg instanceof Error) return `[Error]: ${arg.message}`
        return '[Redacted]'
      })
      originalConsole.error(...sanitized)
    }

    // --- 2. Disable right-click context menu ---
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // --- 3. Block DevTools keyboard shortcuts ---
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Element picker)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    // --- 4. DevTools detection via window size heuristic ---
    let devToolsOpen = false
    const threshold = 160

    const checkDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > threshold
      const heightDiff = window.outerHeight - window.innerHeight > threshold

      if (widthDiff || heightDiff) {
        if (!devToolsOpen) {
          devToolsOpen = true
          setDevToolsDetected(true)
        }
      } else {
        if (devToolsOpen) {
          devToolsOpen = false
          setDevToolsDetected(false)
        }
      }
    }

    const devToolsInterval = setInterval(checkDevTools, 1000)
    checkDevTools() // Initial check

    // --- 5. Prevent drag of images and links (anti-inspection) ---
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
    }

    // --- 6. Disable text selection on sensitive elements ---
    const style = document.createElement('style')
    style.textContent = `
      .admin-portal input[type="password"],
      .admin-portal [data-sensitive="true"] {
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
    `
    document.head.appendChild(style)

    // Attach event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('dragstart', handleDragStart)

    return () => {
      // Restore console on unmount
      Object.assign(console, originalConsole)

      // Remove event listeners
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('dragstart', handleDragStart)

      // Cleanup interval and style
      clearInterval(devToolsInterval)
      if (style.parentNode) style.parentNode.removeChild(style)
    }
  }, [])

  // DevTools warning overlay
  if (devToolsDetected && process.env.NODE_ENV === 'production') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
        <div className="text-center max-w-md mx-6 p-8 rounded-2xl bg-white shadow-2xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <ShieldAlert size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Security Alert
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Developer tools have been detected. For security purposes, 
            admin panel access is restricted while browser inspection tools are open.
          </p>
          <p className="text-xs text-slate-400">
            Please close Developer Tools to continue using the admin portal.
          </p>
        </div>
      </div>
    )
  }

  return null
}
