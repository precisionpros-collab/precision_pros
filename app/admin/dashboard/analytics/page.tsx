export const dynamic = 'force-dynamic'
import { getAnalytics } from '@/lib/actions'
import { AnalyticsClient } from '@/components/admin/AnalyticsClient'

export default async function AnalyticsPage() {
  const data = await getAnalytics()
  return <AnalyticsClient data={data} />
}
