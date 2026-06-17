'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

export interface ConfettiRef {
  trigger: () => void
}

interface ConfettiParticle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
}

const CONFETTI_COLORS = [
  '#0ea5e9', // Sky Teal
  '#38bdf8', // Light Blue
  '#7dd3fc', // Bright Cyan
  '#ffffff', // White
  '#a5f3fc', // Pale Aqua
  '#22d3ee', // Teal Accent
]

export const Confetti = forwardRef<ConfettiRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<ConfettiParticle[]>([])
  const animationIdRef = useRef<number | null>(null)

  useImperativeHandle(ref, () => ({
    trigger() {
      const canvas = canvasRef.current
      if (!canvas) return

      const width = canvas.width
      const height = canvas.height

      // Add particles
      const count = 180
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: width / 2, // Emit from center
          y: height + 10, // Emit from bottom
          size: Math.random() * 8 + 5,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          speedX: Math.random() * 12 - 6, // Left / right spread
          speedY: -(Math.random() * 12 + 10), // Jump upwards
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5,
          opacity: 1,
        })
      }

      // Start animation loop if not already running
      if (!animationIdRef.current) {
        animate()
      }
    }
  }))

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const particles = particlesRef.current

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      // Apply physics
      p.x += p.speedX
      p.y += p.speedY
      p.speedY += 0.35 // Gravity
      p.speedX *= 0.98 // Air resistance
      p.rotation += p.rotationSpeed

      // Fade out near the bottom
      if (p.y > canvas.height * 0.7) {
        p.opacity -= 0.02
      }

      if (p.opacity <= 0 || p.y > canvas.height + 20) {
        particles.splice(i, 1)
        continue
      }

      // Draw particle
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.opacity

      // Draw small rectangles
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2)
      ctx.restore()
    }

    if (particles.length > 0) {
      animationIdRef.current = requestAnimationFrame(animate)
    } else {
      animationIdRef.current = null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleResize = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  )
})

Confetti.displayName = 'Confetti'
