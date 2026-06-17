'use client'

import { useEffect, useRef } from 'react'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { rafThrottle } from '@/lib/raf'

interface DataStream {
  x: number
  y: number
  z: number
  speed: number
  chars: string[]
  length: number
  changeTicks: number
}

const STATIC_BG = (
  <div
    className="fixed inset-0 z-[0] pointer-events-none bg-[#030605] bg-[radial-gradient(at_0%_0%,rgba(5,2,12,1)_0px,transparent_60%),radial-gradient(at_100%_100%,rgba(3,7,6,1)_0px,transparent_60%),radial-gradient(at_50%_50%,rgba(12,9,27,0.15)_0px,transparent_70%)]"
    aria-hidden="true"
  />
)

export function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ tx: 0, ty: 0 })
  const { liteMode } = usePerformanceMode()

  useEffect(() => {
    if (liteMode) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId = 0
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let isTabActive = true
    let isInView = true
    let lastFrameTime = 0
    const TARGET_FPS = 30
    const FRAME_MS = 1000 / TARGET_FPS

    const FOV = 500
    const CAMERA_DISTANCE = 600
    const STREAM_COUNT = width < 1024 ? 18 : 28
    const CHAR_SET = '0123456789ABCDEF*#+='.split('')

    const streams: DataStream[] = []
    for (let i = 0; i < STREAM_COUNT; i++) {
      const length = Math.floor(Math.random() * 6) + 5
      const streamChars: string[] = []
      for (let j = 0; j < length; j++) {
        streamChars.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)])
      }

      streams.push({
        x: (Math.random() - 0.5) * 1600,
        y: (Math.random() - 0.5) * 1000,
        z: (Math.random() - 0.5) * 400,
        speed: 1.2 + Math.random() * 1.8,
        chars: streamChars,
        length,
        changeTicks: Math.floor(Math.random() * 30) + 20,
      })
    }

    let camRotX = 0
    let camRotY = 0

    const rotateX = (x: number, y: number, z: number, angle: number) => {
      const cos = Math.cos(angle), sin = Math.sin(angle)
      return { x, y: y * cos - z * sin, z: y * sin + z * cos }
    }
    const rotateY = (x: number, y: number, z: number, angle: number) => {
      const cos = Math.cos(angle), sin = Math.sin(angle)
      return { x: x * cos + z * sin, y, z: -x * sin + z * cos }
    }

    const handleMouseMove = rafThrottle((e: MouseEvent) => {
      mouseRef.current.tx = ((e.clientX - width / 2) / (width / 2)) * 0.15
      mouseRef.current.ty = ((e.clientY - height / 2) / (height / 2)) * 0.15
    })

    const handleResize = rafThrottle(() => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    })

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden
    }

    const observer = new IntersectionObserver(
      ([entry]) => { isInView = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(canvas)

    const draw = (now: number) => {
      animationFrameId = requestAnimationFrame(draw)

      if (!isTabActive || !isInView) return
      if (now - lastFrameTime < FRAME_MS) return
      lastFrameTime = now

      ctx.clearRect(0, 0, width, height)

      camRotX += (mouseRef.current.ty - camRotX) * 0.04
      camRotY += (mouseRef.current.tx - camRotY) * 0.04

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      streams.forEach(stream => {
        stream.y += stream.speed
        if (stream.y > 600) {
          stream.y = -600
          stream.x = (Math.random() - 0.5) * 1600
          stream.z = (Math.random() - 0.5) * 400
        }

        stream.changeTicks--
        if (stream.changeTicks <= 0) {
          const idx = Math.floor(Math.random() * stream.length)
          stream.chars[idx] = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
          stream.changeTicks = Math.floor(Math.random() * 40) + 25
        }

        for (let j = 0; j < stream.length; j++) {
          const charY = stream.y - j * 24
          let pt = rotateY(stream.x, charY, stream.z, camRotY)
          pt = rotateX(pt.x, pt.y, pt.z, camRotX)

          const scale = FOV / (pt.z + CAMERA_DISTANCE)
          const sx = pt.x * scale + width / 2
          const sy = pt.y * scale + height / 2

          if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue

          const isLead = j === 0
          const fontSize = Math.max(6, (isLead ? 12 : 10) * scale)
          const depthOpacity = Math.max(0.02, 0.4 * scale)
          const fadeOpacity = 1 - j / stream.length
          const opacity = depthOpacity * fadeOpacity

          ctx.font = `${isLead ? 'bold' : 'normal'} ${fontSize}px var(--font-mono, monospace)`
          ctx.fillStyle = isLead
            ? `rgba(227, 200, 168, ${opacity * 1.4})`
            : `rgba(152, 168, 162, ${opacity * 0.7})`
          ctx.fillText(stream.chars[j], sx, sy)
        }
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('visibilitychange', handleVisibilityChange)
    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      observer.disconnect()
    }
  }, [liteMode])

  if (liteMode) return STATIC_BG

  return (
    <div className="fixed inset-0 z-[0] pointer-events-none bg-[#030605] bg-[radial-gradient(at_0%_0%,rgba(5,2,12,1)_0px,transparent_60%),radial-gradient(at_100%_100%,rgba(3,7,6,1)_0px,transparent_60%),radial-gradient(at_50%_50%,rgba(12,9,27,0.15)_0px,transparent_70%)]">
      <canvas ref={canvasRef} className="w-full h-full bg-transparent" aria-hidden="true" />
    </div>
  )
}
