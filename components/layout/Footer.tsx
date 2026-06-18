'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Logo } from '@/components/ui/Logo'
import { ArrowUpRight, MapPin, Mail, MessageCircle } from 'lucide-react'
import { Linkedin, Instagram, Youtube } from '@/components/ui/SocialIcons'
import { Container } from '@/components/ui/Container'

interface FooterProps { settings?: Record<string, string> }

function cleanPhone(num: string) {
  return num.replace(/[^\d+]/g, '')
}

function whatsappLink(num: string) {
  const clean = cleanPhone(num)
  const digits = clean.startsWith('+') ? clean.slice(1) : clean
  return `https://wa.me/${digits}`
}

export function Footer({ settings }: FooterProps) {

  const instagram = settings?.instagram || 'https://instagram.com/precisionpros'
  const linkedin = settings?.linkedin || 'https://linkedin.com/company/precisionpros'
  const youtube = settings?.youtube || 'https://youtube.com/@precisionpros'
  const email = settings?.email || 'hello@precisionpros.in'
  const phone = settings?.phone || '+91 98765 43210'
  const whatsapp = settings?.whatsapp || phone
  const address = settings?.address || 'Chennai, Tamil Nadu, India'

  return (
    <footer className="relative border-t border-border/20 overflow-hidden" id="footer-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <Container className="relative pt-12 sm:pt-20 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16 mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 lg:col-span-6 flex flex-col gap-6"
          >
            <Logo size="md" />
            <p className="text-body text-sm leading-relaxed max-w-sm">
              {settings?.tagline || 'Building tomorrow\'s intelligence. AI solutions, software, and automation for forward-thinking businesses.'}
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Linkedin, href: linkedin, label: 'LinkedIn' },
                { icon: Instagram, href: instagram, label: 'Instagram' },
                { icon: Youtube, href: youtube, label: 'YouTube' },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl glass border border-border/30 text-body hover:text-primary hover:border-primary/40 hover:shadow-glow-sm transition-all duration-300 group"
                  aria-label={item.label}
                >
                  <item.icon size={17} className="group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 lg:col-span-3"
          >
            <h4 className="font-display font-bold text-sm tracking-[0.15em] text-heading uppercase mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Services', href: '#services' },
                { label: 'Projects', href: '#works' },
                { label: 'About', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map(item => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-body hover:text-primary transition-all duration-300 flex items-center gap-2 group font-medium"
                  >
                    <span className="w-0 h-px bg-primary group-hover:w-4 transition-all duration-300" />
                    {item.label}
                    <ArrowUpRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 lg:col-span-3"
          >
            <h4 className="font-display font-bold text-sm tracking-[0.15em] text-heading uppercase mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-body">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0 animate-pulse" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-sm text-body hover:text-primary transition-colors duration-300 group"
                >
                  <Mail size={16} className="text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-body hover:text-emerald-400 transition-colors duration-300 group"
                >
                  <MessageCircle size={16} className="text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span>{whatsapp}</span>
                </a>
              </li>
            </ul>
          </motion.div>

        </div>

        <div className="pt-8 border-t border-border/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-body text-center sm:text-left">
            © {new Date().getFullYear()} Precision Pro&apos;s. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono flex items-center gap-1.5">
            Engineered with <span className="text-primary">♦</span> Precision
          </p>
        </div>
      </Container>
    </footer>
  )
}
