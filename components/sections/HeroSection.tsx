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
                <p className="font-mono text-sm md:text-base text-primary tracking-[0.3em] uppercase font-bold drop-shadow-[0_0_8px_rgba(227,200,168,0.2)]">
                  Welcome to Precision Pro&apos;s
                </p>
                <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
              </div>
            </motion.div>

            
            {/* Main Heading - Premium Styling */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}
              className="hero-3d-heading leading-[1.05] mb-16 text-[clamp(2.6rem,7vw,5.8rem)] tracking-[-0.02em] max-w-5xl font-black"
              style={{
                fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                transformStyle: 'preserve-3d',
                perspective: '1200px',
                textShadow: '0 2px 10px rgba(0,0,0,0.18), 0 12px 30px rgba(0,0,0,0.25)',
                wordSpacing: '0.12em',
              }}
            >
              <span
                className="hero-3d-text hero-3d-silver block"
              >
                Building Tomorrow&apos;s
              </span>
              <br />
              <span
                className="hero-3d-text hero-3d-gold inline-block"
              >
                Intelligence
              </span>
              <br />
              <span
                className="hero-3d-text hero-3d-ruby block"
              >
                For Today&apos;s World
              </span>
            </motion.h1>

            {/* Premium Tagline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 px-6 py-3.5 rounded-full border border-primary/25 bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 backdrop-blur-xl shadow-[0_8px_32px_rgba(227,200,168,0.1)]">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="font-mono text-[11px] md:text-[13px] text-primary/90 tracking-[0.25em] uppercase font-bold">
                  {settings?.tagline || 'Turning Vision Into Reality Through Limitless Innovation'}
                </span>
                <Sparkles size={16} className="text-primary animate-pulse" />
              </div>
            </motion.div>


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

      <style jsx global>{`
        @keyframes heroTextFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          50% { transform: translateY(-5px) rotateX(1deg); }
        }
        .hero-3d-heading {
          animation: heroTextFloat 10s ease-in-out infinite;
          transform-style: preserve-3d;
          perspective: 1200px;
        }
        .hero-3d-text {
          display: inline-block;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          text-shadow:
            0 0 10px rgba(255,255,255,0.35),
            0 8px 24px rgba(0,0,0,0.24),
            0 18px 48px rgba(0,0,0,0.18);
          transition: transform 0.3s ease;
        }
        .hero-3d-text:hover {
          transform: translateZ(4px) scale(1.02);
        }
        .hero-3d-silver {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 30%, #94a3b8 70%, #cbd5e1 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.18));
        }
        .hero-3d-gold {
          background: linear-gradient(135deg, #fff5cc 0%, #fdd65f 30%, #f59e0b 65%, #b45309 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(255,196,92,0.32));
        }
        .hero-3d-ruby {
          background: linear-gradient(135deg, #f7c7dd 0%, #ec4899 30%, #be185d 65%, #7c0b3f 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 24px rgba(236,73,122,0.28));
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-3d-heading,
          .hero-3d-text {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  )
}
