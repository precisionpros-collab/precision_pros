'use client'

import { useEffect, useState } from 'react'

export function ElegantMeshBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return <div className="fixed inset-0 bg-[#040605] z-[0]" />

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#040605] bg-gradient-to-br from-[#040605] via-[#060907] to-[#040605] z-[0] pointer-events-none">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(227, 200, 168, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(227, 200, 168, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />

      <style jsx global>{`
        @keyframes floatMesh1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -50px) scale(1.08); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes floatMesh2 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-50px, 30px) scale(1.1); }
        }
        @keyframes floatMesh3 {
          0%, 100% { transform: translate(0px, 0px) scale(0.9); }
          50% { transform: translate(60px, 40px) scale(1.05); }
        }
        .animate-mesh-float-1 {
          animation: floatMesh1 25s ease-in-out infinite;
        }
        .animate-mesh-float-2 {
          animation: floatMesh2 30s ease-in-out infinite;
        }
        .animate-mesh-float-3 {
          animation: floatMesh3 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
