export const dynamic = "force-dynamic"
import { getTeamMembers } from '@/lib/actions'
import { TeamClient } from '@/components/admin/TeamClient'

export default async function TeamPage() {
  const team = await getTeamMembers(true)
  return <TeamClient team={team} />
}
