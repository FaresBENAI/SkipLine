'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode } from 'lucide-react'

// Force la page à être dynamique pour éviter les problèmes de build
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Attendre que la page soit montée côté client
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Utiliser window.location directement pour éviter les problèmes de SSR
        const hash = window.location.hash
        const search = window.location.search
        
        // Supabase peut envoyer les tokens dans le hash ou les query params
        let accessToken = null
        let refreshToken = null
        
        if (hash) {
          const hashParams = new URLSearchParams(hash.substring(1))
          accessToken = hashParams.get('access_token')
          refreshToken = hashParams.get('refresh_token')
        }
        
        if (search) {
          const searchParams = new URLSearchParams(search)
          // Parfois Supabase envoie un code qu'il faut échanger
          const code = searchParams.get('code')
          
          if (code) {
            // Rediriger vers la page de connexion avec le message
            router.replace('/auth/login?message=confirmed')
            return
          }
        }
        
        if (accessToken) {
          // Si on a les tokens, rediriger vers le dashboard
          router.replace('/dashboard')
        } else {
          // Sinon rediriger vers la connexion
          router.replace('/auth/login?message=confirmed')
        }
      } catch (error) {
        console.error('Erreur callback:', error)
        router.replace('/auth/login?error=callback')
      }
    }

    if (typeof window !== 'undefined') {
      handleCallback()
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center">
        <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-3 rounded-xl w-fit mx-auto mb-4">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Confirmation en cours...</h1>
        <div className="animate-spin rounded-full h-6 w-6 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Vérification de votre email...</p>
      </div>
    </div>
  )
}
