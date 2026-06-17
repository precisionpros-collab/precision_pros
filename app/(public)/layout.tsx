import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { getSiteSettings, getSectionOrder } from '@/lib/actions'
import { ThemeProvider } from 'next-themes'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, sectionOrder] = await Promise.all([getSiteSettings(), getSectionOrder()])

  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
      <Navbar settings={settings} sectionOrder={sectionOrder} />
      <main className="relative z-10">{children}</main>
      <Footer settings={settings} />
    </ThemeProvider>
  )
}
