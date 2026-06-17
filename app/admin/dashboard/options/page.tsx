export const dynamic = 'force-dynamic'
import { getCustomOptions } from '@/lib/actions'
import { OptionsClient } from '@/components/admin/OptionsClient'

export default async function OptionsPage() {
  const [projectCategories, serviceIcons, contactTypes] = await Promise.all([
    getCustomOptions('project_category'),
    getCustomOptions('service_icon'),
    getCustomOptions('contact_service_type'),
  ])
  return (
    <OptionsClient
      groups={[
        { type: 'project_category', label: 'Project Categories', items: projectCategories },
        { type: 'service_icon', label: 'Service Icons', items: serviceIcons },
        { type: 'contact_service_type', label: 'Contact Form Service Types', items: contactTypes },
      ]}
    />
  )
}
