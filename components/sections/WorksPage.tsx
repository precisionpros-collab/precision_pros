'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Eye } from 'lucide-react'

import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'

interface Work {
  id: string; title: string; description: string; tags: string[]
  category: string; is_featured: boolean; client_name?: string | null
  project_url?: string | null; image_url?: string | null
}

const gradients = [
  'from-[#e3c8a8]/15 via-[#ab57ff]/5 to-transparent',
  'from-[#5dc1a4]/15 via-[#e3c8a8]/5 to-transparent',
  'from-[#ab57ff]/15 via-[#5dc1a4]/5 to-transparent',
  'from-[#f4f7f5]/10 via-[#e3c8a8]/5 to-transparent',
]

function WorkCard({ work, index }: { work: Work; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden transition-all duration-300 flex flex-col"
    >
      <GlassCard hover className="h-full flex flex-col overflow-hidden !p-0 !rounded-3xl">
      <div className="relative h-56 overflow-hidden bg-zinc-950">
        {work.image_url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={work.image_url} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0717] via-transparent to-transparent opacity-80" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center`}>
            <div className="text-8xl font-display font-bold text-primary/10 select-none">{work.title.charAt(0)}</div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0717] via-transparent to-transparent opacity-80" />
          </div>
        )}
        {work.is_featured && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#e3c8a8] to-[#5dc1a4] text-[#05020c] text-[9px] font-mono font-bold shadow-md tracking-wider uppercase">
            <Star size={9} fill="currentColor" /> Featured
          </div>
        )}
      </div>
      
      <div className="p-8 md:p-9 flex flex-col flex-grow relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest border uppercase bg-white/5 text-primary border-[#ab57ff]/20`}>{work.category}</span>
          {work.client_name && <span className="text-[11px] font-mono text-[#a09888] tracking-wider uppercase">{work.client_name}</span>}
        </div>
        
        <h3 className="font-display font-semibold text-2xl mb-3 text-[#f5efe6] group-hover:text-primary transition-colors duration-300">{work.title}</h3>
        <p className="font-body text-sm text-[#a09888] leading-relaxed mb-6 line-clamp-3 flex-grow">{work.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-8">
          {work.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[#a09888]/85 text-[10px] font-mono">{tag}</span>
          ))}
        </div>
        
        {work.project_url && (
          <a href={work.project_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#e3c8a8] via-[#5dc1a4] to-[#ab57ff] text-[#05020c] text-sm font-bold hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all mt-auto tracking-wide group-hover:scale-[1.01] duration-300">
            <ExternalLink size={14} /> Live Link
          </a>
        )}
      </div>
      </GlassCard>
    </motion.div>
  )
}

export function WorksPage({ works }: { works: Work[] }) {
  console.log("Works in WorksPage component:", works)
  const ref = useRef(null)
  const [active, setActive] = useState('All')
  const [expanded, setExpanded] = useState(false)

  const categories = ['All', ...Array.from(new Set(works.map(w => w.category)))]
  const filtered = active === 'All' ? works : works.filter(w => w.category === active)
  const visibleWorks = expanded ? filtered : filtered.slice(0, 3)

  return (
    <div className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent pointer-events-none" />

      <Container className="mb-14">
        <SectionHeader
          label="Portfolio"
          title={<>Work That Speaks<br /><span className="italic text-premium-shimmer font-bold">For Itself</span></>}
          description="A curated selection of projects where precision meets ambition."
        />
      </Container>

      <Container className="mb-14">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActive(cat); setExpanded(false) }}
              className={`px-5 py-2.5 rounded-full font-body text-sm font-semibold transition-all border ${
                active === cat
                  ? 'bg-gradient-to-r from-[#e3c8a8] via-[#5dc1a4] to-[#ab57ff] text-slate-900 border-[#e3c8a8] shadow-lg shadow-primary/20'
                  : 'bg-card text-body border-border/50 hover:border-primary/40'
              }`}>{cat}</button>
          ))}
        </div>
      </Container>

      <div ref={ref}>
        <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {visibleWorks.map((work, i) => (
            <WorkCard key={work.id} work={work} index={i} />
          ))}
        </div>

        {!expanded && filtered.length > 3 && (
          <div className="flex justify-center mt-16">
            <button onClick={() => setExpanded(true)}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#e3c8a8] via-[#5dc1a4] to-[#ab57ff] text-[#05020c] font-bold rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-all text-sm">
              <Eye size={16} /> View All Projects
            </button>
          </div>
        )}
        </Container>
      </div>
    </div>
  )
}
