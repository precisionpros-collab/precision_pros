export const dynamic = "force-dynamic"
import { getDashboardStats } from '@/lib/actions'
import { DashboardClient } from '@/components/admin/DashboardClient'

export default async function Dashboard() {
  const stats = await getDashboardStats()
  return <DashboardClient stats={stats} />
}
