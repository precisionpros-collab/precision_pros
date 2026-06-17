'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

import { Confetti, ConfettiRef } from '@/components/ui/Confetti'
import { CreativeButton } from '@/components/ui/CreativeButton'
import { Container } from '@/components/ui/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'

interface HeroSectionProps { settings?: Record<string, string> }

export function HeroSection({ settings }: HeroSectionProps) {
  const confettiRef = useRef<ConfettiRef>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  const { liteMode } = usePerformanceMode()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 80])

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault()
    confettiRef.current?.trigger()
    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 400)
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-20"
      id="home-section"
    >
      <Confetti ref={confettiRef} />



      <motion.div style={{ opacity, y }} className="relative w-full">
        <Container className="flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12 } } }}
            className="max-w-5xl flex flex-col items-center"
          >
            {/* Premium Welcome Header */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="mb-8"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
                <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_8px_rgba(227,200,168,0.2)]">
                  Welcome to Precision Pro&apos;s
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
              </div>
            </motion.div>

            {/* Premium Tagline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-primary/25 bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 backdrop-blur-xl shadow-[0_8px_32px_rgba(227,200,168,0.1)]">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="font-mono text-[10px] text-primary/90 tracking-[0.25em] uppercase font-bold">
                  {settings?.tagline || 'Turning Vision Into Reality Through Limitless Innovation'}
                </span>
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Main Heading - Premium Styling */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}
              className="leading-[1.15] mb-16 text-[clamp(2.4rem,7vw,5.2rem)] tracking-[-0.02em] max-w-5xl font-black"
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                textShadow: '0 0 30px rgba(227,200,168,0.25), 0 20px 40px rgba(0,0,0,0.6)',
                background: 'linear-gradient(115deg, #f8fafc 0%, #e0f2fe 30%, #f1f5f9 60%, #cbd5e1 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                wordSpacing: '0.1em',
              }}
            >
              Building Tomorrow&apos;s
              <br />
              <span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #ffd700 0%, #e3c8a8 25%, #f5d5a8 50%, #ffd700 75%, #e3c8a8 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 25px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 50px rgba(227, 200, 168, 0.35))',
                  fontStyle: 'italic',
                  fontWeight: '700',
                  letterSpacing: '0.05em',
                  textShadow: '0 0 40px rgba(255, 215, 0, 0.3)',
                  marginTop: '0.3em',
                  marginBottom: '0.3em',
                  display: 'inline-block',
                }}
              >
                Intelligence
              </span>
              <br />
              <span 
                className="block"
                style={{
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 40%, #f1f5f9 70%, #cbd5e1 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 20px rgba(30, 144, 255, 0.2)',
                  letterSpacing: '0.01em',
                }}
              >
                For Today&apos;s World
              </span>
            </motion.h1>



            {/* Premium CTA Buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } } }}
              className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
            >
              <CreativeButton onClick={handleGetStarted} size="lg" className="group">
                <span className="flex items-center gap-2">
                  Work With Us
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </span>
              </CreativeButton>
              <CreativeButton href="#works" variant="outline" size="lg" className="group">
                <span className="flex items-center gap-2">
                  Explore Portfolio
                  <motion.div
                    initial={{ opacity: 0, x: -4 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowRight size={16} />
                  </motion.div>
                </span>
              </CreativeButton>
            </motion.div>

           
          </motion.div>
        </Container>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-primary/60" />
        </motion.div>
      </motion.div>

      {/* Background-related floating elements — desktop only */}
      {!liteMode && (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {/* Floating Hex 1 - Gold */}
        <motion.div
          className="absolute top-[20%] left-[8%] opacity-35 filter drop-shadow-[0_0_15px_rgba(227,200,168,0.3)] hidden lg:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-16 h-16 md:w-20 md:h-20 text-[#e3c8a8]">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </motion.div>

        {/* Floating Hex 2 - Cyan */}
        <motion.div
          className="absolute top-[45%] right-[10%] opacity-25 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] hidden lg:block"
          animate={{
            y: [0, 20, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24 text-cyan-400">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </motion.div>

        {/* Floating Hex 3 - Small Amber */}
        <motion.div
          className="absolute bottom-[25%] left-[12%] opacity-30 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.25)] hidden lg:block"
          animate={{
            y: [0, 12, 0],
            x: [0, 8, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 100 100" className="w-12 h-12 text-amber-500">
            <polygon points="50,1 95,25 95,75 50,99 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </motion.div>

        {/* Glowing node lines to simulate AI network in top right */}
        <div className="absolute top-[18%] right-[22%] opacity-15 hidden xl:block">
          <svg width="200" height="150" viewBox="0 0 200 150" fill="none" stroke="#e3c8a8" strokeWidth="1" className="stroke-dasharray-[4,4] animate-[dash_10s_linear_infinite]">
            <path d="M10,60 L70,15 L150,15 L190,60 L150,110 L70,110 Z" />
            <circle cx="10" cy="60" r="3" fill="#e3c8a8" />
            <circle cx="70" cy="15" r="3" fill="#e3c8a8" />
            <circle cx="150" cy="15" r="3" fill="#e3c8a8" />
            <circle cx="190" cy="60" r="3" fill="#e3c8a8" />
            <circle cx="150" cy="110" r="3" fill="#e3c8a8" />
            <circle cx="70" cy="110" r="3" fill="#e3c8a8" />
          </svg>
        </div>
      </div>
      )}
    </section>
  )
}
