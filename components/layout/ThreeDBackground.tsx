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
  const dimCanvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ tx: 0, ty: 0 })
  const { liteMode, isMobile, isTouch } = usePerformanceMode()

  // Tunable visual parameters
  const DIM_BLUR_PX = 18
  const DIM_OPACITY = 0.9
  const GENTLE_EXTRA = isMobile ? 6 : 16
  const GENTLE_SPEED_MIN = 0.15
  const GENTLE_SPEED_MAX = 0.6

  useEffect(() => {
    const canvas = canvasRef.current
    const dimCanvas = dimCanvasRef.current
    if (!canvas || !dimCanvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    const dimCtx = dimCanvas.getContext('2d', { alpha: true })
    if (!ctx || !dimCtx) return

    let animationFrameId = 0
    let width = window.innerWidth
    let height = window.innerHeight
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

    // main canvas: size in device pixels, style in CSS pixels
    canvas.width = Math.floor(width * dpr)
    canvas.height = Math.floor(height * dpr)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // dim canvas: subtle low-frequency visuals
    dimCanvas.width = Math.floor(width * dpr)
    dimCanvas.height = Math.floor(height * dpr)
    dimCanvas.style.width = `${width}px`
    dimCanvas.style.height = `${height}px`
    dimCtx.setTransform(dpr, 0, 0, dpr, 0, 0)
    let isTabActive = true
    let isInView = true
    let lastFrameTime = 0
    // adapt performance based on device / preferences
    const TARGET_FPS = liteMode ? 18 : 30
    const FRAME_MS = 1000 / TARGET_FPS
    const DIM_TARGET_FPS = liteMode ? 6 : 12
    const DIM_FRAME_MS = 1000 / DIM_TARGET_FPS

    const FOV = 500
    const CAMERA_DISTANCE = 600
    const STREAM_COUNT = isMobile ? 8 : width < 1024 ? 18 : 28
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

    const gentleStreams: DataStream[] = []
    for (let i = 0; i < GENTLE_EXTRA; i++) {
      const length = Math.floor(Math.random() * 8) + 6
      const streamChars: string[] = []
      for (let j = 0; j < length; j++) {
        streamChars.push(CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)])
      }

      gentleStreams.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 1200,
        z: (Math.random() - 0.5) * 400,
        speed: GENTLE_SPEED_MIN + Math.random() * (GENTLE_SPEED_MAX - GENTLE_SPEED_MIN),
        chars: streamChars,
        length,
        changeTicks: Math.floor(Math.random() * 60) + 40,
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
      width = window.innerWidth
      height = window.innerHeight
      const newDpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))

      canvas.width = Math.floor(width * newDpr)
      canvas.height = Math.floor(height * newDpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(newDpr, 0, 0, newDpr, 0, 0)

      dimCanvas.width = Math.floor(width * newDpr)
      dimCanvas.height = Math.floor(height * newDpr)
      dimCanvas.style.width = `${width}px`
      dimCanvas.style.height = `${height}px`
      dimCtx.setTransform(newDpr, 0, 0, newDpr, 0, 0)
    })

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden
    }

    const observer = new IntersectionObserver(
      ([entry]) => { isInView = entry.isIntersecting },
      { threshold: 0 }
    )
    observer.observe(canvas)

    // dim layer state
    const dimCircles: { x: number; y: number; r: number; vx: number; vy: number; alpha: number }[] = []
    const DIM_COUNT = Math.max(3, Math.floor(STREAM_COUNT / 6))
    for (let i = 0; i < DIM_COUNT; i++) {
      dimCircles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 120 + Math.random() * 220,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        alpha: 0.04 + Math.random() * 0.06,
      })
    }

    let lastDimFrame = 0

    const draw = (now: number) => {
      animationFrameId = requestAnimationFrame(draw)

      if (!isTabActive || !isInView) return
      if (now - lastFrameTime < FRAME_MS) return
      lastFrameTime = now

      ctx.clearRect(0, 0, width, height)

      // dim layer updates at a lower frequency for performance
      if (now - lastDimFrame > DIM_FRAME_MS) {
        lastDimFrame = now
        dimCtx.clearRect(0, 0, width, height)
        dimCtx.globalCompositeOperation = 'source-over'
        dimCircles.forEach(c => {
          c.x += c.vx * (now % 1000)
          c.y += c.vy * (now % 1000)
          const grd = dimCtx.createRadialGradient(c.x, c.y, c.r * 0.1, c.x, c.y, c.r)
          grd.addColorStop(0, `rgba(20,18,30,${c.alpha})`)
          grd.addColorStop(1, 'rgba(20,18,30,0)')
          dimCtx.fillStyle = grd
          dimCtx.fillRect(0, 0, width, height)
        })
        dimCtx.globalCompositeOperation = 'lighter'
      }

      camRotX += (mouseRef.current.ty - camRotX) * 0.04
      camRotY += (mouseRef.current.tx - camRotY) * 0.04

      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      gentleStreams.forEach(stream => {
        stream.y += stream.speed
        if (stream.y > 900) {
          stream.y = -900
          stream.x = (Math.random() - 0.5) * 2000
          stream.z = (Math.random() - 0.5) * 400
        }

        stream.changeTicks--
        if (stream.changeTicks <= 0) {
          const idx = Math.floor(Math.random() * stream.length)
          stream.chars[idx] = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)]
          stream.changeTicks = Math.floor(Math.random() * 80) + 60
        }

        for (let j = 0; j < stream.length; j++) {
          const charY = stream.y - j * 28
          let pt = rotateY(stream.x, charY, stream.z, camRotY)
          pt = rotateX(pt.x, pt.y, pt.z, camRotX)

          const scale = FOV / (pt.z + CAMERA_DISTANCE)
          const sx = pt.x * scale + width / 2
          const sy = pt.y * scale + height / 2

          if (sx < -20 || sx > width + 20 || sy < -20 || sy > height + 20) continue

          const isLead = j === 0
          const fontSize = Math.max(8, (isLead ? 14 : 12) * scale)
          const depthOpacity = Math.max(0.01, 0.25 * scale)
          const fadeOpacity = 1 - j / stream.length
          const opacity = depthOpacity * fadeOpacity * 0.5

          ctx.font = `${isLead ? 'bold' : 'normal'} ${fontSize}px var(--font-mono, monospace)`
          ctx.fillStyle = isLead
            ? `rgba(200, 200, 200, ${opacity * 0.9})`
            : `rgba(140, 150, 150, ${opacity * 0.6})`
          ctx.fillText(stream.chars[j], sx, sy)
        }
      })

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

    if (!isTouch) window.addEventListener('mousemove', handleMouseMove, { passive: true })
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

  return (
    <div className="fixed inset-0 z-[0] pointer-events-none bg-[#030605] bg-[radial-gradient(at_0%_0%,rgba(5,2,12,1)_0px,transparent_60%),radial-gradient(at_100%_100%,rgba(3,7,6,1)_0px,transparent_60%),radial-gradient(at_50%_50%,rgba(12,9,27,0.15)_0px,transparent_70%)]">
      <canvas
        ref={dimCanvasRef}
        className="absolute inset-0 w-full h-full bg-transparent"
        aria-hidden="true"
        style={{ filter: `blur(${DIM_BLUR_PX}px)`, opacity: DIM_OPACITY }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full bg-transparent" aria-hidden="true" />
    </div>
  )
}
