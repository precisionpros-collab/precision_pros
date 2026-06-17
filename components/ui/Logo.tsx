'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-9 h-9', text: 'text-lg', subText: 'text-[9px]' },
    md: { icon: 'w-13 h-13', text: 'text-xl', subText: 'text-[10px]' },
    lg: { icon: 'w-20 h-20', text: 'text-4xl', subText: 'text-[13px]' },
  }

  const currentSize = sizeClasses[size]

  return (
    <div
      data-admin-gate
      className={cn('flex items-center gap-3.5 select-none group cursor-pointer', className)}
    >
      <div
        className={cn(
          'relative flex-shrink-0 transition-all duration-500 group-hover:scale-105 overflow-hidden',
          currentSize.icon
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo.jpeg"
          alt="Precision Pro's Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {!iconOnly && (
        <div className="flex flex-col">
          <span className={cn('font-display font-semibold leading-none text-foreground tracking-tight', currentSize.text)}>
            Precision <span className="text-premium-shimmer italic">Pro&apos;s</span>
          </span>
          <span className={cn('font-mono text-muted-foreground tracking-[0.25em] uppercase mt-1', currentSize.subText)}>
            Tech Solutions Agency
          </span>
        </div>
      )}
    </div>
  )
}
