'use client'

import { useRef, useEffect } from 'react'
import { usePerformanceMode } from './usePerformanceMode'
import { rafThrottle } from '@/lib/raf'

export function use3DTilt(maxTilt = 10, scale = 1.02) {
  const ref = useRef<HTMLDivElement>(null)
  const { liteMode } = usePerformanceMode()

  useEffect(() => {
    if (liteMode) return

    const el = ref.current
    if (!el) return

    el.style.transition = 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.25s ease'
    el.style.transformStyle = 'preserve-3d'

    const handleMouseMove = rafThrottle((e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      const rotateY = (x / (rect.width / 2)) * maxTilt
      const rotateX = -(y / (rect.height / 2)) * maxTilt
      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    })

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    }

    el.addEventListener('mousemove', handleMouseMove, { passive: true })
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [maxTilt, scale, liteMode])

  return ref
}
