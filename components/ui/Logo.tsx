'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: { icon: 'w-14 h-14', text: 'text-lg', subText: 'text-[9px]' },
    md: { icon: 'w-20 h-20', text: 'text-xl', subText: 'text-[10px]' },
    lg: { icon: 'w-36 h-36', text: 'text-4xl', subText: 'text-[13px]' },
  }

  const currentSize = sizeClasses[size]

  return (
    <div
      data-admin-gate
      className={cn('flex items-center gap-3.5 select-none group cursor-pointer', className)}
    >
      <div
        className={cn(
          'relative flex-shrink-0 transition-all duration-500 group-hover:scale-105 overflow-hidden rounded-full border-2 border-slate-200 bg-white flex items-center justify-center p-1',
          currentSize.icon
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/img.jpeg"
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
