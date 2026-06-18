'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ElegantMeshBackground } from './ElegantMeshBackground'
import { ThreeDBackground } from './ThreeDBackground'

export function AppBackground() {
  const pathname = usePathname()
  const [isAtHero, setIsAtHero] = useState(pathname === '/')

  // Sync state when pathname changes during rendering (prevents setState inside useEffect error)
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setIsAtHero(pathname === '/')
  }

  useEffect(() => {
    if (pathname !== '/') {
      return
    }

    const handleScroll = () => {
      // Transition past 70% of the viewport height (leaving the Hero section)
      const threshold = window.innerHeight * 0.7
      setIsAtHero(window.scrollY < threshold)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // 1. Admin Portal (Light theme, no animations or canvas elements)
  if (pathname?.startsWith('/admin')) {
    return (
      <div 
        className="fixed inset-0 pointer-events-none z-[0] bg-slate-50"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 0.75px, transparent 0.75px)',
          backgroundSize: '24px 24px',
          opacity: 0.4
        }}
        aria-hidden="true"
      />
    )
  }

  // 2. Public Pages: Cross-fade backgrounds based on viewport scroll location
  return (
    <>
      <div 
        className="transition-opacity duration-700 ease-in-out"
        style={{ 
          opacity: isAtHero ? 1 : 0, 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0, 
          pointerEvents: 'none' 
        }}
      >
        <ElegantMeshBackground />
      </div>

      <div 
        className="transition-opacity duration-700 ease-in-out"
        style={{ 
          opacity: isAtHero ? 0 : 1, 
          position: 'fixed', 
          inset: 0, 
          zIndex: 0, 
          pointerEvents: 'none' 
        }}
      >
        <ThreeDBackground />
      </div>
    </>
  )
}
