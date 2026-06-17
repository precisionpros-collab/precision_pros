'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface SectionHeaderProps {
  label: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  const isCenter = align === 'center'

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn('mb-14 md:mb-20', isCenter && 'text-center', className)}
    >
      <div className={cn('flex items-center gap-3 mb-5', isCenter && 'justify-center')}>
        <div className="w-10 h-px bg-gradient-to-r from-primary to-primary/30" />
        <span className="font-mono text-[11px] text-primary tracking-[0.2em] uppercase font-semibold">
          {label}
        </span>
        {isCenter && <div className="w-10 h-px bg-gradient-to-l from-primary to-primary/30" />}
      </div>

      <h2 className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl leading-[1.08] mb-5 text-heading tracking-tight">
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            'font-body text-base md:text-lg text-body leading-relaxed max-w-2xl',
            isCenter && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}
