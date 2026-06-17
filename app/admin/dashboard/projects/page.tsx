export const dynamic = "force-dynamic"
import { getWorks, getCustomOptions } from '@/lib/actions'
import { ProjectsClient } from '@/components/admin/ProjectsClient'

export default async function ProjectsPage() {
  const [works, categories] = await Promise.all([
    getWorks(true),
    getCustomOptions('project_category'),
  ])
  return (
    <ProjectsClient
      works={works}
      categories={categories.map(c => c.value)}
    />
  )
}
