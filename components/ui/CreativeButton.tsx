'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CreativeButtonProps {
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
  href?: string
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
}

const variants = {
  primary: 'bg-gradient-to-r from-[#e3c8a8] via-[#5dc1a4] to-[#ab57ff] text-[#05020c] shadow-lg shadow-primary/10 hover:shadow-primary/30 border border-[#e3c8a8]/40',
  outline: 'bg-transparent border border-[#ab57ff]/40 text-[#f4f7f5] hover:border-[#e3c8a8] hover:bg-[#ab57ff]/5 hover:shadow-[0_0_18px_rgba(93,193,164,0.15)]',
  ghost: 'bg-[#f4f7f5]/5 border border-border/30 text-[#f4f7f5] hover:bg-[#e3c8a8]/10 hover:text-[#e3c8a8]',
}

const sizes = {
  sm: 'px-5 py-2 text-xs',
  md: 'px-7 py-3 text-sm',
  lg: 'px-9 py-4 text-base',
}

export function CreativeButton({
  children, onClick, href, variant = 'primary', size = 'md', className, type = 'button', disabled,
}: CreativeButtonProps) {
  const classes = cn(
    'relative inline-flex items-center justify-center gap-2 font-body font-semibold rounded-2xl transition-all duration-500 overflow-hidden group tracking-wide',
    variants[variant], sizes[size], disabled && 'opacity-50 pointer-events-none', className
  )

  const inner = (
    <>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </>
  )

  if (href) {
    return (
      <motion.a href={href} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className={classes}>
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} className={classes}>
      {inner}
    </motion.button>
  )
}
