'use client'

import { usePathname } from 'next/navigation'
import { ThreeDBackground } from './ThreeDBackground'

export function AppBackground() {
  const pathname = usePathname()

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

  // 2. All Public Pages — common 3D data streams background
  return <ThreeDBackground />
}
