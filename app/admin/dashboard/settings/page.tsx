export const dynamic = "force-dynamic"
import { getSiteSettings } from '@/lib/actions'
import { SettingsClient } from '@/components/admin/SettingsClient'

export default async function SettingsPage() {
  const settings = await getSiteSettings()
  return <SettingsClient settings={settings} />
}
