import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings, getSectionOrder } from '@/lib/actions'
import { ThemeProvider } from 'next-themes'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let settings: Record<string, string> = {}
  let sectionOrder: string[] = ['home', 'services', 'works', 'about', 'testimonials', 'contact']

  try {
    const [s, so] = await Promise.all([getSiteSettings(), getSectionOrder()])
    settings = s
    sectionOrder = so
  } catch (e) {
    console.error('Failed to load layout data:', e)
  }

  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
      <Navbar settings={settings} sectionOrder={sectionOrder} />
      <main className="relative z-10">{children}</main>
      <Footer settings={settings} />
    </ThemeProvider>
  )
}
