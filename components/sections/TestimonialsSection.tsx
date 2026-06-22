'use client'

import { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Code2, Users, Brain, Award, Quote, Star } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  company: string | null
  city: string | null
  rating: number
  content: string
  is_visible: boolean
}

interface TestimonialsSectionProps {
  settings?: Record<string, string>
  testimonials: Testimonial[]
  worksCount?: number
  teamCount?: number
  aiCount?: number
  showStats?: boolean
}

function StatCard({ stat, index }: { stat: { icon: ComponentType<{ size?: number | string; className?: string }>; value: string; label: string; desc: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative p-6 rounded-2xl border border-[#e3c8a8]/15 bg-[#0a0b12]/55 hover:border-[#e3c8a8]/35 transition-all duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(93,193,164,0.03)_0%,transparent_70%)]" />
      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="font-mono text-xs text-[#98a8a2]/60 tracking-wider font-semibold uppercase">{stat.label}</span>
        <stat.icon size={16} className="text-[#e3c8a8] group-hover:scale-110 transition-transform" />
      </div>
      <div className="font-display text-3xl font-bold text-[#f4f7f5] mb-1.5 relative z-10">{stat.value}</div>
      <p className="font-body text-[10px] text-[#98a8a2] leading-normal relative z-10">{stat.desc}</p>
    </motion.div>
  )
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      className="group relative p-8 rounded-3xl border border-[#e3c8a8]/15 bg-[#0a0b12]/55 hover:border-[#e3c8a8]/35 transition-all duration-500 flex flex-col justify-between hover:shadow-[0_15px_35px_rgba(227,200,168,0.04)] h-full"
    >
      {/* Background wisteria glow on hover */}
      <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-[#ab57ff]/5 blur-[35px] group-hover:bg-[#ab57ff]/10 transition-all duration-500 pointer-events-none" />
      
      <div>
        {/* Rating stars & Quote Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < testimonial.rating ? 'fill-[#e3c8a8] text-[#e3c8a8]' : 'text-muted-foreground/15'}
              />
            ))}
          </div>
          <Quote size={24} className="text-[#e3c8a8]/15 group-hover:text-[#e3c8a8]/30 transition-colors duration-300" />
        </div>

        {/* Content text */}
        <p className="font-display italic text-lg text-[#f4f7f5] leading-relaxed mb-8 select-none">
          &ldquo;{testimonial.content}&rdquo;
        </p>
      </div>

      {/* Client profile */}
      <div className="flex items-center gap-4 border-t border-[#e3c8a8]/10 pt-6 mt-auto">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e3c8a8]/15 to-[#ab57ff]/10 border border-[#e3c8a8]/20 flex items-center justify-center text-[#e3c8a8] font-display font-bold text-base shadow-inner">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-body text-sm font-bold text-[#f4f7f5] tracking-wide leading-tight flex items-center gap-1.5">
            {testimonial.name}
            <span className="w-3.5 h-3.5 rounded-full bg-[#5dc1a4]/10 border border-[#5dc1a4]/25 flex items-center justify-center" title="Verified Client">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5dc1a4]" />
            </span>
          </h4>
          <p className="font-mono text-[9px] text-[#98a8a2] tracking-widest uppercase mt-1">
            {[testimonial.company, testimonial.city].filter(Boolean).join(' · ')}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function TestimonialsSection({
  settings,
  testimonials = [],
  worksCount = 0,
  teamCount = 0,
  aiCount = 0,
  showStats = true,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null

  const projects = String(settings?.total_projects || `${worksCount || 20}+`)
  const clients = String(settings?.happy_clients || '15+')
  const team = String(settings?.team_size || `${teamCount || 13}`)
  const satisfaction = String(settings?.success_rate || '100%')

  const statsItems = [
    {
      icon: Code2,
      value: projects.includes('+') ? projects : `${projects}+`,
      label: settings?.stat_projects_label || 'Delivered',
      desc: settings?.stat_projects_desc || 'AI and custom SaaS apps shipped.',
    },
    {
      icon: Users,
      value: clients.includes('+') ? clients : `${clients}+`,
      label: settings?.stat_clients_label || 'Clients',
      desc: settings?.stat_clients_desc || 'Businesses trusting our execution.',
    },
    {
      icon: Brain,
      value: `${aiCount || 6}+`,
      label: settings?.stat_team_label || 'AI Team',
      desc: settings?.stat_team_desc || `${team} specialists in one core crew.`,
    },
    {
      icon: Award,
      value: satisfaction,
      label: settings?.stat_satisfaction_label || 'Success',
      desc: settings?.stat_satisfaction_desc || 'Quality-first engineering delivery.',
    },
  ]

  return (
    <section className="relative py-32 overflow-hidden" id="testimonials-section">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,2,12,0.15)_0%,transparent_75%)] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {showStats ? (
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Left Column: Stats & Impact */}
            <div className="lg:col-span-4 flex flex-col justify-center lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#e3c8a8]" />
                <span className="font-mono text-xs text-[#e3c8a8] tracking-widest uppercase font-semibold">Proven Impact</span>
              </div>
              <h2 className="font-display font-semibold text-4xl md:text-5xl leading-tight mb-6 text-[#f4f7f5]">
                Engineering<br />
                <span className="italic text-prismatic-shimmer font-bold">Real Value</span>
              </h2>
              <p className="font-body text-sm text-[#98a8a2] leading-relaxed mb-10 max-w-sm">
                We translate custom algorithms and high-quality web applications into concrete metrics of growth and performance.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {statsItems.map((stat, i) => (
                  <StatCard key={stat.label} stat={stat} index={i} />
                ))}
              </div>
            </div>

            {/* Right Column: Testimony Cards */}
            <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full">
            {/* Header centered */}
            <div className="flex flex-col items-center text-center mb-20">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-px bg-[#e3c8a8]" />
                <span className="font-mono text-xs text-[#e3c8a8] tracking-widest uppercase font-semibold">Reviews</span>
                <div className="w-8 h-px bg-[#e3c8a8]" />
              </div>
              <h2 className="font-display font-semibold text-5xl md:text-6xl leading-tight mb-6 text-[#f4f7f5]">
                What Our Clients <span className="italic text-prismatic-shimmer font-bold">Say</span>
              </h2>
              <p className="font-body text-base text-[#98a8a2] leading-relaxed max-w-xl">
                Read direct reviews from partners and clients who trust Precision Pros to deliver exceptional engineering value.
              </p>
            </div>

            {/* Grid of cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
