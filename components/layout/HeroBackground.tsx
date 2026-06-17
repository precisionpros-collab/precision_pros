'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { rafThrottle } from '@/lib/raf'

const STATIC_TWINKLES = Array.from({ length: 20 }, (_, i) => {
  const seedX = Math.sin(i + 1) * 10000
  const seedY = Math.cos(i + 2) * 10000
  const x = Math.abs(seedX - Math.floor(seedX))
  const y = Math.abs(seedY - Math.floor(seedY))
  const size = Number((1.5 + x * 2.5).toFixed(4))
  const delay = Number((y * 5).toFixed(4))
  const duration = Number((2 + ((x + y) / 2) * 3).toFixed(4))

  let color = 'rgba(255,255,255,'
  if (x > 0.6) color = 'rgba(255,180,60,'
  else if (y > 0.3) color = 'rgba(120,200,255,'

  return {
    left: `${(x * 100).toFixed(4)}%`,
    top: `${(y * 100).toFixed(4)}%`,
    size,
    delay,
    duration,
    color,
  }
})

export function HeroBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const { liteMode } = usePerformanceMode()

  useEffect(() => {
    if (liteMode) return

    const el = parallaxRef.current
    if (!el) return

    const handleMouseMove = rafThrottle((e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      el.style.transform = `
        rotateX(${y * -1.5}deg)
        rotateY(${x * 1.5}deg)
        translateX(${x * -10}px)
        translateY(${y * -6}px)
        scale(1.06)
      `
    })

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [liteMode])

  return (
    <div
      className="absolute inset-0 z-[0] pointer-events-none overflow-hidden"
      style={{ perspective: liteMode ? undefined : '1200px' }}
    >
      <div
        ref={parallaxRef}
        className={`absolute inset-[-40px] ${liteMode ? '' : 'transition-transform duration-[600ms] ease-out'}`}
        style={{ transform: 'scale(1.05)', transformStyle: 'preserve-3d' }}
      >
        <div className={liteMode ? 'absolute inset-0' : 'absolute inset-0 animate-hero-breathe'}>
          <Image
            src="/images/3d-abstract-glowing-background.jpg"
            alt=""
            fill
            priority
            quality={liteMode ? 60 : 75}
            sizes="100vw"
            className="object-cover object-center"
            style={{ opacity: loaded ? 1 : 0 }}
            onLoad={() => setLoaded(true)}
          />
        </div>
      </div>

      {!liteMode && STATIC_TWINKLES.map((t, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: t.left,
            top: t.top,
            width: `${t.size}px`,
            height: `${t.size}px`,
            background: `radial-gradient(circle, ${t.color}0.8) 0%, ${t.color}0) 100%)`,
            animationDelay: `${t.delay}s`,
            animationDuration: `${t.duration}s`,
          }}
        />
      ))}

      {!liteMode && (
        <>
          <div className="absolute bottom-[15%] left-[45%] w-[400px] h-[400px] animate-orb-1 rounded-full bg-[radial-gradient(circle,rgba(255,120,30,0.1)_0%,transparent_70%)] blur-xl" />
          <div className="absolute top-[10%] right-[15%] w-[320px] h-[320px] animate-orb-2 rounded-full bg-[radial-gradient(circle,rgba(80,160,255,0.08)_0%,transparent_70%)] blur-xl" />
        </>
      )}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,10,12,0.15)_20%,rgba(8,10,12,0.82)_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080a0c] to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#080a0c]/50 to-transparent" />

      <style jsx global>{`
        @keyframes heroBreathe {
          0%, 100% { opacity: 0.45; filter: brightness(1); }
          50% { opacity: 0.52; filter: brightness(1.1); }
        }
        .animate-hero-breathe {
          animation: heroBreathe 8s ease-in-out infinite;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0.6); }
          50% { opacity: 0.8; transform: scale(1); }
        }
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(20px, -15px); opacity: 0.9; }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0, 0); opacity: 0.5; }
          50% { transform: translate(-25px, 20px); opacity: 0.8; }
        }
        .animate-orb-1 { animation: orb1 10s ease-in-out infinite; }
        .animate-orb-2 { animation: orb2 12s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-hero-breathe, .animate-twinkle, .animate-orb-1, .animate-orb-2 {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
