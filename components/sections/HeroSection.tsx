'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

import { Confetti, ConfettiRef } from '@/components/ui/Confetti'
import { CreativeButton } from '@/components/ui/CreativeButton'
import { Container } from '@/components/ui/Container'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { use3DTilt } from '@/hooks/use3DTilt'
import { HeroCanvas } from './HeroCanvas'

interface HeroSectionProps { settings?: Record<string, string> }

export function HeroSection({ settings }: HeroSectionProps) {
  const confettiRef = useRef<ConfettiRef>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  
  // Apply 3D parallax mouse-tilt effect to the entire hero content card
  const tiltRef = use3DTilt(10, 1.01) // 10 degree maximum tilt, 1.01 scaling factor

  // Scroll parallax logic for content fading/movement on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.45], [0, 120])
  const canvasScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15])
  const canvasOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.35])

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault()
    confettiRef.current?.trigger()
    setTimeout(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 450)
  }

  // Animation variants for premium staggered reveals
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 15 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1] as const, // EaseOutExpo
      }
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-32 pb-24"
      id="home-section"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(4, 9, 7, 0.6) 0%, rgba(3, 5, 4, 0.98) 100%)',
      }}
    >
      <Confetti ref={confettiRef} />

      {/* 3D WebGL AI & Data Canvas Background - Confined Strictly to Hero Section */}
      <motion.div 
        style={{ scale: canvasScale, opacity: canvasOpacity }} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      >
        <HeroCanvas />
        
        {/* Cinematic light beam overlays to blend the 3D canvas */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#030504]/50 to-[#030504] pointer-events-none z-[2]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#030504] to-transparent pointer-events-none z-[2]" />
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#030504] to-transparent pointer-events-none z-[2]" />
      </motion.div>

      {/* Hero Interactive Elements Card (Fades & drifts on scroll) */}
      <motion.div 
        style={{ opacity: contentOpacity, y: contentY }} 
        className="relative w-full z-10"
      >
        <Container className="flex flex-col items-center justify-center text-center">
          
          {/* Mouse Parallax 3D Card wrapper */}
          <div 
            ref={tiltRef}
            className="w-full max-w-5xl flex flex-col items-center px-4 py-8 rounded-3xl border border-primary/5 bg-gradient-to-b from-white/2 to-transparent backdrop-blur-md shadow-[0_24px_80px_rgba(3,5,4,0.3)] select-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="flex flex-col items-center"
            >
              {/* Premium Welcome Badge with Gold/Emerald Pulsing Borders */}
              <motion.div
                variants={itemVariants}
                className="mb-8"
                style={{ transform: 'translateZ(30px)' }}
              >
                <div className="relative inline-flex items-center gap-3 px-5 py-2 rounded-full border border-primary/20 bg-[#030504]/80 backdrop-blur-xl shadow-[0_0_15px_rgba(227,200,168,0.08)] group overflow-hidden">
                  <div className="absolute -left-1/2 top-0 w-full h-full bg-gradient-to-r from-transparent via-[#5dc1a4]/10 to-transparent skew-x-12 translate-x-0 group-hover:animate-shimmer" />
                  
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/60 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  
                  <p className="font-mono text-xs md:text-sm text-primary tracking-[0.32em] uppercase font-bold">
                    Welcome to Precision Pro&apos;s
                  </p>
                </div>
              </motion.div>

              {/* Main Heading - Ultra Premium 3D Metallic Extruded Text */}
              <motion.h1
                variants={itemVariants}
                className="hero-3d-title leading-[1.02] mb-12 font-black text-[clamp(2.6rem,6.8vw,5.5rem)] tracking-tight text-center"
                style={{
                  fontFamily: 'var(--font-playfair), "Playfair Display", serif',
                  transform: 'translateZ(55px)',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span className="hero-3d-word block text-platinum">
                  Building Tomorrow&apos;s
                </span>
                <span className="hero-3d-word block text-gold my-2">
                  Intelligence
                </span>
                <span className="hero-3d-word block text-emerald">
                  For Today&apos;s World
                </span>
              </motion.h1>

              {/* Sub-tagline Pill with Glowing Sparkles */}
              <motion.div
                variants={itemVariants}
                className="mb-12 max-w-3xl"
                style={{ transform: 'translateZ(40px)' }}
              >
                <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-[#5dc1a4]/20 bg-gradient-to-r from-[#030504]/90 via-[#030504]/70 to-[#030504]/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(93,193,164,0.06)] hover:border-primary/30 transition-colors duration-500">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                  <span className="font-mono text-xs md:text-[13px] text-foreground/90 tracking-[0.18em] uppercase font-medium leading-relaxed">
                    {settings?.tagline || 'Turning Vision Into Reality Through Limitless Innovation'}
                  </span>
                  <Sparkles size={16} className="text-primary animate-pulse" />
                </div>
              </motion.div>

              {/* Interactive Premium CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-md sm:max-w-none"
                style={{ transform: 'translateZ(30px)' }}
              >
                <CreativeButton 
                  onClick={handleGetStarted} 
                  size="lg" 
                  className="relative group overflow-hidden shadow-[0_0_20px_rgba(227,200,168,0.18)] hover:shadow-[0_0_35px_rgba(227,200,168,0.35)] transition-all duration-300 border border-[#e3c8a8]/30"
                >
                  <span className="flex items-center justify-center gap-3 font-semibold tracking-wider">
                    Work With Us
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </span>
                </CreativeButton>
                
                <CreativeButton 
                  href="#works" 
                  variant="outline" 
                  size="lg" 
                  className="relative group shadow-[0_0_15px_rgba(93,193,164,0.05)] hover:shadow-[0_0_30px_rgba(93,193,164,0.22)] transition-all duration-300 border border-[#5dc1a4]/30 hover:bg-[#5dc1a4]/5 text-foreground hover:text-white"
                >
                  <span className="flex items-center justify-center gap-3 font-semibold tracking-wider">
                    Explore Portfolio
                    <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </CreativeButton>
              </motion.div>

            </motion.div>
          </div>

        </Container>
      </motion.div>

      {/* Down Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 cursor-pointer pointer-events-auto"
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="font-mono text-[9px] text-muted-foreground tracking-[0.25em] uppercase opacity-70 hover:opacity-100 transition-opacity">Scroll</span>
        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} className="text-[#5dc1a4]/70 hover:text-[#5dc1a4] transition-colors" />
        </motion.div>
      </motion.div>

      <style jsx global>{`
        /* 3D Extruded Font Styling with Realistic Shadows */
        .text-platinum {
          color: #f8fafc;
          text-shadow: 
            0 1px 0 #cbd5e1,
            0 2px 0 #94a3b8,
            0 3px 0 #64748b,
            0 4px 0 #475569,
            0 5px 6px rgba(0, 0, 0, 0.45),
            0 10px 10px rgba(0, 0, 0, 0.25),
            0 20px 25px rgba(0, 0, 0, 0.2);
        }
        
        .text-gold {
          color: #fdd65f;
          text-shadow: 
            0 1px 0 #e3c8a8,
            0 2px 0 #bfa280,
            0 3px 0 #9c805c,
            0 4px 0 #7a603c,
            0 5px 6px rgba(0, 0, 0, 0.45),
            0 10px 10px rgba(0, 0, 0, 0.25),
            0 20px 25px rgba(0, 0, 0, 0.2);
        }
        
        .text-emerald {
          color: #5dc1a4;
          text-shadow: 
            0 1px 0 #4ba68d,
            0 2px 0 #3a8c75,
            0 3px 0 #2b705d,
            0 4px 0 #1c5444,
            0 5px 6px rgba(0, 0, 0, 0.45),
            0 10px 10px rgba(0, 0, 0, 0.25),
            0 20px 25px rgba(0, 0, 0, 0.2);
        }

        .hero-3d-word {
          display: block;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          letter-spacing: -0.015em;
        }

        .hero-3d-word:hover {
          transform: translateZ(25px) scale(1.03);
        }

        @keyframes shimmer-effect {
          0% { transform: translate(-100%, 0) skewX(-12deg); }
          100% { transform: translate(200%, 0) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer-effect 2.5s infinite linear;
        }

        @media (prefers-reduced-motion: reduce) {
          .text-platinum, .text-gold, .text-emerald {
            text-shadow: none !important;
          }
          .hero-3d-word {
            transform: none !important;
            animation: none !important;
            transition: none !important;
          }
          .hero-3d-word:hover {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  )
}
