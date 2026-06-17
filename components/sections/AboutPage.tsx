'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Target, Rocket, Users, Layers } from "lucide-react"
import { Linkedin, Instagram } from "@/components/ui/SocialIcons"
import { cn } from '@/lib/utils'
import { defaultTeam } from '@/lib/data'

interface TeamMember {
  id: string
  name: string
  role: string
  designation: string
  photo_url: string | null
  linkedin_url: string | null
  instagram_url?: string | null
  order_index: number
}



const values = [
  { icon: Target, title: 'Precision', desc: 'Every line of code, every design decision — crafted with exactness.' },
  { icon: Rocket, title: 'Innovation', desc: 'We push boundaries and embrace emerging technologies fearlessly.' },
  { icon: Users, title: 'Collaboration', desc: 'Deep client partnerships built on trust, transparency, and communication.' },
  { icon: Layers, title: 'Excellence', desc: 'We don\'t ship good work. We ship exceptional work, every single time.' },
]

interface Position {
  top: string
  left: string
  size: string
  rotate: number
}

const SIZE_VARIANTS = [
  'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  'w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30',
  'w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26',
  'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
  'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
  'w-22 h-22 sm:w-26 sm:h-26 md:w-30 md:h-30',
  'w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32',
  'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
  'w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26',
]

/** Fixed positions — must be identical on server and client to avoid hydration mismatch */
const DEFAULT_TEAM_LAYOUT: Position[] = [
  { top: '8%', left: '10%', size: SIZE_VARIANTS[0], rotate: -8 },
  { top: '15%', left: '55%', size: SIZE_VARIANTS[1], rotate: 5 },
  { top: '35%', left: '25%', size: SIZE_VARIANTS[2], rotate: -3 },
  { top: '42%', left: '60%', size: SIZE_VARIANTS[3], rotate: 10 },
  { top: '55%', left: '8%', size: SIZE_VARIANTS[4], rotate: -6 },
  { top: '60%', left: '42%', size: SIZE_VARIANTS[5], rotate: 4 },
  { top: '68%', left: '68%', size: SIZE_VARIANTS[6], rotate: -10 },
  { top: '22%', left: '78%', size: SIZE_VARIANTS[7], rotate: 7 },
  { top: '72%', left: '22%', size: SIZE_VARIANTS[8], rotate: -4 },
  { top: '48%', left: '82%', size: SIZE_VARIANTS[9], rotate: 6 },
]

const LAYOUT_VARIANTS: Position[][] = [
  DEFAULT_TEAM_LAYOUT,
  [
    { top: '12%', left: '45%', size: SIZE_VARIANTS[1], rotate: 4 },
    { top: '28%', left: '12%', size: SIZE_VARIANTS[0], rotate: -7 },
    { top: '8%', left: '72%', size: SIZE_VARIANTS[2], rotate: 8 },
    { top: '50%', left: '58%', size: SIZE_VARIANTS[3], rotate: -5 },
    { top: '65%', left: '15%', size: SIZE_VARIANTS[4], rotate: 6 },
    { top: '38%', left: '35%', size: SIZE_VARIANTS[5], rotate: -3 },
    { top: '70%', left: '55%', size: SIZE_VARIANTS[6], rotate: -9 },
    { top: '18%', left: '22%', size: SIZE_VARIANTS[7], rotate: 5 },
    { top: '58%', left: '78%', size: SIZE_VARIANTS[8], rotate: -4 },
    { top: '42%', left: '5%', size: SIZE_VARIANTS[9], rotate: 10 },
  ],
  [
    { top: '20%', left: '65%', size: SIZE_VARIANTS[2], rotate: -6 },
    { top: '5%', left: '30%', size: SIZE_VARIANTS[0], rotate: 7 },
    { top: '45%', left: '15%', size: SIZE_VARIANTS[1], rotate: -4 },
    { top: '62%', left: '48%', size: SIZE_VARIANTS[4], rotate: 5 },
    { top: '32%', left: '72%', size: SIZE_VARIANTS[3], rotate: -8 },
    { top: '75%', left: '8%', size: SIZE_VARIANTS[5], rotate: 3 },
    { top: '55%', left: '68%', size: SIZE_VARIANTS[6], rotate: -7 },
    { top: '10%', left: '8%', size: SIZE_VARIANTS[7], rotate: 9 },
    { top: '68%', left: '32%', size: SIZE_VARIANTS[8], rotate: -5 },
    { top: '38%', left: '42%', size: SIZE_VARIANTS[9], rotate: 4 },
  ],
]

function ValueCard({ v, index, inView }: { v: typeof values[0]; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="group p-8 rounded-2xl border border-border/40 bg-card/65 backdrop-blur-md hover:border-primary/45 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.04)_0%,transparent_70%)]" />
      <div className="mb-5 p-3 w-fit rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors relative z-10">
        <v.icon size={22} className="text-primary group-hover:scale-110 transition-transform duration-300" />
      </div>
      <h4 className="font-display font-bold text-lg mb-2 text-[#f5efe6] relative z-10">{v.title}</h4>
      <p className="font-body text-sm text-[#a09888] leading-relaxed relative z-10">{v.desc}</p>
    </motion.div>
  )
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function TeamCollage({ team }: { team: TeamMember[] }) {
  const collageRef = useRef<HTMLDivElement>(null)
  const collageInView = useInView(collageRef, { margin: '-80px', amount: 0.15 })
  const reducedMotion = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentLayout, setCurrentLayout] = useState<Position[]>(DEFAULT_TEAM_LAYOUT)

  // 1. Build the list of members (only from DB if any exist, otherwise fallback to defaultTeam)
  const sortedTeam = [...team].sort((a, b) => a.order_index - b.order_index)
  let finalPool = sortedTeam.slice(0, 10)

  if (finalPool.length === 0) {
    finalPool = defaultTeam.slice(0, 10).map(defMember => ({
      id: `default-${defMember.order_index}`,
      name: defMember.name,
      role: defMember.role,
      designation: defMember.designation,
      photo_url: null,
      linkedin_url: null,
      instagram_url: null,
      order_index: defMember.order_index,
    }))
  }

  // 2. State for visible members
  const [visibleMembers, setVisibleMembers] = useState<TeamMember[]>(finalPool)

  const [prevTeam, setPrevTeam] = useState(team)
  if (team !== prevTeam) {
    setPrevTeam(team)
    setVisibleMembers(finalPool)
  }

  // 3. Periodic layout rotation — paused when off-screen or hovered
  useEffect(() => {
    if (hoveredIndex !== null || !collageInView || reducedMotion) return

    let variantIndex = 0
    const interval = setInterval(() => {
      variantIndex = (variantIndex + 1) % LAYOUT_VARIANTS.length
      setCurrentLayout(LAYOUT_VARIANTS[variantIndex])
      setVisibleMembers(prevVisible => {
        if (prevVisible.length < 2) return prevVisible
        return shuffleArray(prevVisible)
      })
    }, 18000)

    return () => clearInterval(interval)
  }, [hoveredIndex, team, collageInView, reducedMotion])

  const animateFrames = collageInView && !reducedMotion && hoveredIndex === null

  return (
    <div ref={collageRef} className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] lg:h-[600px] rounded-3xl overflow-visible">
      {/* Decorative radial background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(171,87,255,0.06)_0%,transparent_60%)] pointer-events-none rounded-3xl" />
      
      {visibleMembers.map((member, i) => {
        const placement = currentLayout[i % currentLayout.length]
        const isHovered = hoveredIndex === i
        const isDimmed = hoveredIndex !== null && hoveredIndex !== i
        const photoSrc = member.photo_url || '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'

        return (
          <motion.div
            key={member.id}
            className={cn(
              "absolute rounded-2xl border transition-all duration-300 overflow-visible cursor-pointer bg-[#0c0717]/90 will-change-transform",
              placement.size,
              isDimmed ? "opacity-35 scale-[0.96]" : "opacity-100 scale-100"
            )}
            style={{
              top: placement.top,
              left: placement.left,
              transition: 'top 0.8s cubic-bezier(0.16, 1, 0.3, 1), left 0.8s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s, opacity 0.3s, transform 0.3s',
              borderColor: isHovered ? 'rgba(227, 200, 168, 0.5)' : 'rgba(227, 200, 168, 0.15)',
              boxShadow: isHovered ? '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(171, 87, 255, 0.35)' : 'none',
              zIndex: isHovered ? 50 : 10 + i
            }}
            animate={animateFrames ? {
              y: isHovered ? 0 : [0, -10, 0],
              rotate: isHovered ? 0 : [placement.rotate, placement.rotate + 2, placement.rotate],
            } : {
              y: 0,
              rotate: placement.rotate,
            }}
            transition={{
              y: {
                duration: 4.2 + (i % 3),
                repeat: animateFrames ? Infinity : 0,
                ease: "easeInOut",
                delay: i * 0.15
              },
              rotate: {
                duration: 5.2 + (i % 2),
                repeat: animateFrames ? Infinity : 0,
                ease: "easeInOut",
                delay: i * 0.1
              }
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-full h-full rounded-2xl overflow-hidden relative border border-white/5 bg-zinc-900 shadow-inner flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.img
                  key={member.id}
                  src={photoSrc}
                  alt={member.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover select-none pointer-events-none absolute inset-0"
                  onError={(e) => {
                    e.currentTarget.src = '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'
                  }}
                />
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 15 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 z-50 w-56 p-4 rounded-2xl border border-sky-500/30 bg-[#0a0a0a]/98 backdrop-blur-lg text-left shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.15)] pointer-events-auto"
                >
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-3.5 h-3.5 rotate-45 border-r border-b border-primary/30 bg-[#0a0a0a]" />
                  <div className="font-display font-bold text-base text-[#f5efe6] leading-tight mb-0.5">{member.name}</div>
                  <div className="font-mono text-[9px] tracking-widest text-primary uppercase font-semibold mb-1.5">{member.role || 'Pro'}</div>
                  <div className="font-body text-xs text-[#a09888] leading-relaxed mb-3">{member.designation}</div>
                  
                  <div className="flex gap-2">
                    {member.linkedin_url && (
                      <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/35 text-[#a09888] hover:text-primary transition-all">
                        <Linkedin size={11} />
                      </a>
                    )}
                    {member.instagram_url && (
                      <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/35 text-[#a09888] hover:text-primary transition-all">
                        <Instagram size={11} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

export function AboutPage({ team }: { team: TeamMember[] }) {
  const heroRef = useRef(null)
  const valuesRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: '-100px' })
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' })

  return (
    <div className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(var(--primary)/0.04),transparent_50%)]" />

      <section ref={heroRef} className="pb-20 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary" />
              <span className="font-mono text-xs text-primary tracking-widest uppercase">Who We Are</span>
            </div>
            <h2 className="font-display font-semibold text-5xl md:text-6xl leading-tight mb-8 text-[#f5efe6]">
              A Team of Builders,<br />
              <span className="italic text-premium-shimmer font-bold">Thinkers & Makers</span>
            </h2>
            <p className="font-body text-xl text-[#a09888] leading-relaxed mb-6">
              Precision Pro&apos;s is a collective of engineers, designers, and strategists united by a single mission — to build technology that genuinely moves businesses forward.
            </p>
            <p className="font-body text-base text-[#a09888]/80 leading-relaxed">
              We&apos;re a tech agency delivering AI solutions, custom software, and automation systems to clients. Our journey toward becoming a full-fledged product company has already begun — one extraordinary project at a time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full relative"
          >
            <TeamCollage team={team} />
          </motion.div>
        </div>
      </section>

      <section ref={valuesRef} className="py-20 max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="font-mono text-xs text-primary tracking-widest uppercase">Our Values</span>
          </div>
          <h3 className="font-display font-semibold text-4xl md:text-5xl text-[#f5efe6]">
            What Drives <span className="italic text-premium-shimmer">Everything</span>
          </h3>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <ValueCard key={v.title} v={v} index={i} inView={valuesInView} />
          ))}
        </div>
      </section>
    </div>
  )
}
