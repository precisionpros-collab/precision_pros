import type { ReactNode } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { ServicesPage } from '@/components/sections/ServicesPage'
import { WorksPage } from '@/components/sections/WorksPage'
import { AboutPage } from '@/components/sections/AboutPage'
import { ContactPage } from '@/components/sections/ContactPage'
import {
  getServices, getWorks, getTeamMembers, getSiteSettings,
  getSectionOrder, getCustomOptions, getTestimonials,
} from '@/lib/actions'

export const revalidate = 120

const VISIBILITY: Record<string, string> = {
  home: 'show_home', services: 'show_services',
  works: 'show_works', about: 'show_team', contact: 'show_contact',
  testimonials: 'show_testimonials',
}

export default async function HomePage() {
  let services: Awaited<ReturnType<typeof getServices>> = []
  let works: Awaited<ReturnType<typeof getWorks>> = []
  let team: Awaited<ReturnType<typeof getTeamMembers>> = []
  let settings: Awaited<ReturnType<typeof getSiteSettings>> = {}
  let sectionOrder: Awaited<ReturnType<typeof getSectionOrder>> = ['home', 'services', 'works', 'about', 'testimonials', 'contact']
  let types: string[] = []
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = []

  try {
    const [s, w, t, st, so, serviceTypes, test] = await Promise.all([
      getServices(), getWorks(), getTeamMembers(), getSiteSettings(),
      getSectionOrder(), getCustomOptions('contact_service_type'),
      getTestimonials(),
    ])
    services = s; works = w; team = t; settings = st
    sectionOrder = so; types = serviceTypes.map(s => s.label); testimonials = test
  } catch (e) {
    console.error('Failed to load homepage data:', e)
  }

  const visible = (id: string) => settings[VISIBILITY[id]] !== 'false'

  const sections: Record<string, ReactNode> = {
    home: visible('home') && (
      <>
        <HeroSection settings={settings} />
      </>
    ),
    // stats section removed
    services: visible('services') && <ServicesPage services={services} />,
    works: visible('works') && <WorksPage works={works} />,
    about: visible('about') && <AboutPage team={team} />,
    testimonials: visible('testimonials') && <TestimonialsSection testimonials={testimonials} showStats={false} />,
    contact: visible('contact') && <ContactPage settings={settings} serviceTypes={types} />,
  }

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {sections.home && (
        <div id="home" className="relative">
          {sections.home}
        </div>
      )}

      {sectionOrder
        .filter(id => id !== 'home')
        .map(id => sections[id] ? <div key={id} id={id}>{sections[id]}</div> : null)}
    </div>
  )
}
