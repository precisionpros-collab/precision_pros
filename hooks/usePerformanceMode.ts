'use client'

import { useMediaQuery } from './useMediaQuery'
import { useReducedMotion } from './useReducedMotion'

/** Shared flags for reducing animation / GPU load without changing layout. */
export function usePerformanceMode() {
  const reducedMotion = useReducedMotion()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTouch = useMediaQuery('(hover: none) and (pointer: coarse)')
  const saveData = useMediaQuery('(prefers-reduced-data: reduce)')

  const liteMode = reducedMotion || isMobile || isTouch || saveData

  return {
    reducedMotion,
    isMobile,
    isTouch,
    saveData,
    liteMode,
  }
}
