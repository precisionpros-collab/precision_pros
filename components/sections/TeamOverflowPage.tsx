'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Linkedin, Instagram } from '@/components/ui/SocialIcons'
import { use3DTilt } from '@/hooks/use3DTilt'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TeamMember } from '@/types'

function TeamMemberOverflowCard({ member, index }: { member: TeamMember; index: number }) {
  const tiltRef = use3DTilt(4, 1.015)

  return (
    <motion.div
      ref={tiltRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group p-6 rounded-2xl border border-border/50 bg-card/65 backdrop-blur-md hover:border-primary/40 hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.04)_0%,transparent_70%)]" />
      
      <div className="w-28 h-28 mx-auto rounded-2xl overflow-hidden mb-5 border border-border/50 bg-zinc-900 relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={member.photo_url || '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = '/images/cute-smiling-robot-avatar-icon-260nw-2636636685.jpg'
          }}
        />
      </div>
      <h3 className="font-body font-bold text-[#f5efe6] mb-1 relative z-10">{member.name}</h3>
      <p className="text-sm text-[#a09888] mb-4 relative z-10">{member.designation}</p>
      <div className="flex justify-center gap-2 mt-auto relative z-10">
        {member.linkedin_url && (
          <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-[#a09888] hover:text-primary transition-all">
            <Linkedin size={14} />
          </a>
        )}
        {member.instagram_url && (
          <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-muted hover:bg-primary/10 text-[#a09888] hover:text-primary transition-all">
            <Instagram size={14} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function TeamOverflowPage({ members }: { members: TeamMember[] }) {
  return (
    <div className="min-h-screen section-padding">
      <Container>
        <Link href="/#about" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-12 transition-colors text-sm font-medium group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to About
        </Link>
        <SectionHeader
          label="Our Team"
          title={<>More <span className="italic text-premium-shimmer font-bold">Team Members</span></>}
          description="Meet the rest of our talented crew driving innovation at Precision Pro's."
          className="mb-16"
        />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {members.map((member, i) => (
            <TeamMemberOverflowCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </Container>
    </div>
  )
}
