export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { getTeamMembers } from '@/lib/actions'
import { TeamOverflowPage } from '@/components/sections/TeamOverflowPage'

export default async function TeamPage() {
  const team = await getTeamMembers()
  const overflow = team.slice(10)

  if (overflow.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-32">
        <p className="text-muted-foreground mb-6">All team members are shown on the homepage.</p>
        <Link href="/#about" className="text-primary hover:underline font-medium">← Back to About</Link>
      </div>
    )
  }

  return <TeamOverflowPage members={overflow} />
}
