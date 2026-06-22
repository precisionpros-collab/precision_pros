'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Public page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-8">
      <div className="w-16 h-16 rounded-2xl bg-[#e3c8a8]/10 flex items-center justify-center">
        <AlertTriangle size={28} className="text-[#e3c8a8]" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold text-[#f4f7f5] mb-2">Something went wrong</h2>
        <p className="text-sm text-[#98a8a2] max-w-md">
          We encountered an error loading this page. Please try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#e3c8a8] to-[#5dc1a4] text-[#05020c] text-sm font-bold rounded-xl hover:shadow-lg transition-all"
      >
        <RotateCcw size={14} /> Try Again
      </button>
    </div>
  )
}
