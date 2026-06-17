import { cn } from '@/lib/utils'
import { ReactNode, forwardRef } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard({ children, className, hover = true, glow = false }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative rounded-3xl border border-[#ab57ff]/20 bg-[#0c0717]/80 backdrop-blur-md',
          'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]',
          hover && 'transition-all duration-500 hover:border-[#e3c8a8]/40 hover:shadow-[0_0_30px_rgba(93,193,164,0.08)]',
          glow && 'shadow-[0_0_30px_rgba(93,193,164,0.08)]',
          className
        )}
      >
        {hover && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl bg-[radial-gradient(circle_at_50%_0%,rgba(227,200,168,0.05)_0%,transparent_70%)] pointer-events-none" />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)
