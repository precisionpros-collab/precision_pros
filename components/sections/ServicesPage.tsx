'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Brain, Cpu, Globe, Smartphone, Zap, Cloud, Package, Shield, Headphones, FileCheck, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'

const iconMap: Record<string, React.ElementType> = { Brain, Cpu, Globe, Smartphone, Zap, Cloud }

interface Service {
  id: string; title: string; description: string; icon: string
  category: string; features: string[]
}

function ServiceCard({ service, index, inView }: { service: Service; index: number; inView: boolean }) {
  const Icon = iconMap[service.icon] || Brain
  const glowClass = 'hover:border-primary/50'

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.6 }}
    >
      <GlassCard className={cn("group relative p-7 md:p-8 transition-all duration-500", glowClass)}>
        {/* Premium glow sweep */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] bg-[radial-gradient(circle_at_50%_0%,rgba(227,200,168,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl border border-[#ab57ff]/20 bg-[#ab57ff]/5 flex items-center justify-center relative group-hover:border-[#ab57ff]/40 group-hover:rotate-6 transition-all duration-500 shadow-inner">
            <div className="absolute inset-1 rounded-[10px] border border-dashed border-[#5dc1a4]/30 group-hover:border-[#5dc1a4]/30 transition-all duration-500" />
            <Icon size={22} className="text-primary group-hover:scale-110 transition-transform duration-300 relative z-10" />
          </div>
        </div>
        
        <h3 className="font-display font-semibold text-2xl mb-4 text-[#f5efe6] group-hover:text-primary group-hover:translate-x-1 transition-all duration-300 relative z-10">{service.title}</h3>
        <p className="font-body text-sm text-[#a09888] leading-relaxed mb-8 relative z-10">{service.description}</p>
        
        <div className="space-y-3 pt-6 border-t border-[#ab57ff]/10 relative z-10">
          <p className="font-mono text-[10px] text-primary tracking-widest uppercase mb-3 font-bold">Deliverables Include</p>
          {service.features.map(f => (
            <div key={f} className="flex items-start gap-2.5">
              <span className="text-primary font-mono text-[11px] leading-none mt-0.5 select-none">✓</span>
              <span className="font-body text-xs text-[#a09888]/95 font-medium leading-relaxed">{f}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

const PROVIDE_PIPELINE = [
  { icon: Package, title: 'Deliverables', desc: 'Production-ready code, docs & assets you own' },
  { icon: Shield, title: 'Security', desc: 'Encrypted data, secure APIs & compliance-ready builds' },
  { icon: Headphones, title: 'Support', desc: 'Dedicated post-launch support & maintenance plans' },
  { icon: FileCheck, title: 'Documentation', desc: 'Full technical docs, handover guides & training' },
  { icon: Rocket, title: 'Deployment', desc: 'Cloud hosting, CI/CD pipelines & go-live assistance' },
]

export function ServicesPage({ services }: { services: Service[] }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const filtered = services

  return (
    <div className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(var(--primary)/0.04),transparent_50%)]" />

      <Container className="mb-14">
        <SectionHeader
          label="What We Provide"
          title={<>Services Built for <br /><span className="italic text-premium-shimmer font-bold">The Future</span></>}
          description="Everything you receive from us — not just what we build, but what you walk away with. Tangible deliverables, ongoing support, and complete ownership."
        />
      </Container>


      <div ref={ref} className="mb-24">
        <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} inView={inView} />
          ))}
        </div>
        </Container>
      </div>

      <Container>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">Your Package</span>
            <div className="w-8 h-px bg-primary" />
          </div>
          <h3 className="font-display font-semibold text-4xl md:text-5xl text-heading">
            Every Engagement <span className="italic text-premium-shimmer">Includes</span>
          </h3>
        </motion.div>

        <div className="relative pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
            {PROVIDE_PIPELINE.map((step, i) => (
              <motion.div key={step.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                className={cn(
                  "h-full",
                  i === 4 ? "col-span-2 md:col-span-1" : ""
                )}
              >
                <GlassCard className="p-4 sm:p-6 md:p-8 text-center h-full flex flex-col items-center justify-start min-h-[170px] sm:min-h-[200px]">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-5 rounded-2xl bg-gradient-to-br from-[#ab57ff]/20 to-[#5dc1a4]/5 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <step.icon className="text-primary w-5 h-5 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="font-display font-bold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-heading group-hover:text-primary transition-colors duration-300">{step.title}</h4>
                  <p className="font-body text-xs sm:text-sm text-body leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}
