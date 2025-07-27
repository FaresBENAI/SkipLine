'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardRedirect() {
  const { userType, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && userType) {
      if (userType === 'company') {
        router.replace('/dashboard/company')
      } else {
        router.replace('/dashboard/client')
      }
    }
  }, [userType, loading, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre dashboard...</p>
      </div>
    </div>
  )
}
