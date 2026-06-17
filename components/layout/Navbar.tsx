'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/Logo'
import { rafThrottle } from '@/lib/raf'


const sectionLabels: Record<string, string> = {
  home: 'Home',
  services: 'Services',
  works: 'Works',
  about: 'About',
  testimonials: 'Testimonials',
  contact: 'Contact',
}

interface NavbarProps {
  settings: Record<string, string>
  sectionOrder: string[]
}

export function Navbar({ settings, sectionOrder }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showTopButton, setShowTopButton] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  const visibleSections = sectionOrder.filter(id => {
    if (id === 'testimonials') return settings.show_testimonials !== 'false'
    if (id === 'services') return settings.show_services !== 'false'
    if (id === 'works') return settings.show_works !== 'false'
    if (id === 'about') return settings.show_team !== 'false'
    if (id === 'contact') return settings.show_contact !== 'false'
    return id === 'home'
  })

  useEffect(() => {
    const handleScroll = rafThrottle(() => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 40)
      setShowTopButton(scrollY > 400)

      if (pathname !== '/') return

      const scrollPosition = scrollY + 140
      for (let i = visibleSections.length - 1; i >= 0; i--) {
        const el = document.getElementById(visibleSections[i])
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(visibleSections[i])
          break
        }
      }
    })

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname, visibleSections])

  const [prevPathname, setPrevPathname] = useState(pathname)
  if (pathname !== prevPathname) {
    setPrevPathname(pathname)
    setMenuOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const getHref = (href: string) => (isHome ? href : `/${href}`)

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'py-3' : 'py-5'
        )}
      >


        <div className={cn(
          'mx-auto transition-all duration-500',
          scrolled ? 'max-w-5xl px-4' : 'max-w-7xl px-5 sm:px-6 lg:px-8'
        )}>
          <nav
            className={cn(
              'flex items-center justify-between rounded-2xl transition-all duration-500',
              scrolled
                ? 'glass-nav px-5 py-3'
                : 'px-0 py-0 bg-transparent'
            )}
          >
            {/* Logo */}
            <Link href="/" className="relative z-10 shrink-0 group">
              <Logo size="sm" />
            </Link>

            {/* Desktop navigation — floating pill */}
            <div className={cn(
              'hidden md:flex items-center',
              scrolled
                ? 'gap-0.5'
                : 'gap-1 px-2 py-1.5 rounded-2xl bg-card/55 backdrop-blur-[20px] saturate-[1.4]'
            )}>
              {visibleSections.map(sectionId => {
                const href = `#${sectionId}`
                const isActive = isHome
                  ? activeSection === sectionId
                  : pathname === `/${sectionId}` || (sectionId === 'about' && pathname === '/team')

                return (
                  <Link
                    key={sectionId}
                    href={getHref(href)}
                    className={cn(
                      'relative px-4 py-2 font-body text-[13px] font-medium tracking-wide transition-all duration-300 rounded-xl nav-link-underline',
                      isActive
                        ? 'text-primary active'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <span className="relative z-10">{sectionLabels[sectionId] || sectionId}</span>
                  </Link>
                )
              })}
            </div>

            {/* Mobile Toggle Trigger */}
            <div className="flex items-center">

              {/* Mobile custom Hamburger menu toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex md:hidden items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-[#e3c8a8] hover:bg-primary/20 transition-all cursor-pointer relative z-50"
                aria-label="Toggle menu"
              >
                <div className="w-5 h-4 flex flex-col justify-between items-center relative">
                  <span className={cn(
                    "w-5 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center",
                    menuOpen ? "rotate-45 translate-y-[7px]" : ""
                  )} />
                  <span className={cn(
                    "w-5 h-[2px] bg-current rounded-full transition-all duration-300 origin-center",
                    menuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                  )} />
                  <span className={cn(
                    "w-5 h-[2px] bg-current rounded-full transition-all duration-300 transform origin-center",
                    menuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  )} />
                </div>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 z-45 w-[min(320px,85vw)] glass-nav md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 pt-24 flex flex-col gap-2 flex-1">
                {visibleSections.map((sectionId, i) => {
                  const href = `#${sectionId}`
                  const isActive = isHome
                    ? activeSection === sectionId
                    : pathname === `/${sectionId}` || (sectionId === 'about' && pathname === '/team')

                  return (
                    <motion.div
                      key={sectionId}
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                    >
                      <Link
                        href={getHref(href)}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'flex items-center justify-between px-5 py-4 rounded-2xl font-body text-base font-medium transition-all duration-300',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                        )}
                      >
                        {sectionLabels[sectionId] || sectionId}
                        <ArrowUpRight size={16} className={cn('opacity-40', isActive && 'opacity-100 text-primary')} />
                      </Link>
                    </motion.div>
                  )
                })}
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Back to Top floating button */}
      <AnimatePresence>
        {showTopButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-12 h-12 rounded-2xl bg-[#0a0b12]/70 backdrop-blur-md text-[#e3c8a8] hover:text-[#f4f7f5] hover:shadow-[0_0_20px_rgba(227,200,168,0.25)] transition-all cursor-pointer group"
            aria-label="Back to top"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-y-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
