export const dynamic = "force-dynamic"
import { getServices, getCustomOptions } from '@/lib/actions'
import { ServicesClient } from '@/components/admin/ServicesClient'

export default async function ServicesAdminPage() {
  const [services, icons] = await Promise.all([
    getServices(true),
    getCustomOptions('service_icon'),
  ])
  return (
    <ServicesClient
      services={services}
      icons={icons.map(c => c.value)}
    />
  )
}
