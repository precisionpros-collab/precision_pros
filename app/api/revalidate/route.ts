import { NextRequest, NextResponse } from 'next/server'
import { revalidatePublicSite, revalidateAdminPaths } from '@/lib/revalidate'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const secret = authHeader?.replace('Bearer ', '') || req.nextUrl.searchParams.get('secret')

    if (!secret || secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await revalidatePublicSite()
    await revalidateAdminPaths()

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    const error = err as { message?: string }
    return NextResponse.json({ message: error?.message || 'Internal Server Error' }, { status: 500 })
  }
}
