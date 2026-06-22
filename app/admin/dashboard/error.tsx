'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
        <AlertTriangle size={28} className="text-red-500" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-500 max-w-md">
          An error occurred while loading this page. This is usually temporary — try refreshing.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-400 mt-2 font-mono">Digest: {error.digest}</p>
        )}
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 text-white text-sm font-medium rounded-xl hover:bg-sky-600 transition-colors"
      >
        <RotateCcw size={14} /> Try Again
      </button>
    </div>
  )
}
