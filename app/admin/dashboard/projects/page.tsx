export const dynamic = "force-dynamic"
import { getWorks, getCustomOptions } from '@/lib/actions'
import { ProjectsClient } from '@/components/admin/ProjectsClient'

export default async function ProjectsPage() {
  let works = []
  let categories: string[] = ['AI', 'Software', 'Automation', 'Mobile']

  try {
    const [worksData, categoriesData] = await Promise.all([
      getWorks(true),
      getCustomOptions('project_category'),
    ])
    works = worksData
    categories = categoriesData.map(c => c.value)
  } catch (e) {
    console.error('Failed to load projects data:', e)
  }

  return (
    <ProjectsClient
      works={works}
      categories={categories}
    />
  )
}
