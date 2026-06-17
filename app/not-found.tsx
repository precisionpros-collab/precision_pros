'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.05),transparent)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-center px-6 max-w-lg"
      >
        <div className="font-display text-[12rem] font-light leading-none text-primary/10 select-none mb-0">
          404
        </div>
        <h1 className="font-display text-3xl font-light -mt-8 mb-4">
          Lost in the <span className="italic text-premium-shimmer">Precision</span> Space
        </h1>
        <p className="font-body text-muted-foreground mb-10">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-primary text-primary-foreground font-body font-medium rounded-xl hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
