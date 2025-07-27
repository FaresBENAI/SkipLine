'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QrCode } from 'lucide-react'

// Force la page à être dynamique
export const dynamic = 'force-dynamic'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Récupérer les paramètres depuis l'URL côté client
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (code) {
          // Échanger le code contre une session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Erreur lors de l\'échange du code:', error)
            setError('Erreur lors de la confirmation de votre email')
            return
          }

          if (data.user) {
            // Déterminer le type d'utilisateur et rediriger
            await redirectToCorrectDashboard(data.user.id)
          }
        } else {
          setError('Code de confirmation manquant')
        }
      } catch (err) {
        console.error('Erreur callback:', err)
        setError('Une erreur est survenue')
      } finally {
        setLoading(false)
      }
    }

    const redirectToCorrectDashboard = async (userId: string) => {
      try {
        // Vérifier si c'est une entreprise
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id')
          .eq('id', userId)
          .single()

        if (company && !companyError) {
          router.replace('/dashboard/company')
          return
        }

        // Vérifier si c'est un client
        const { data: client, error: clientError } = await supabase
          .from('users')
          .select('id')
          .eq('id', userId)
          .single()

        if (client && !clientError) {
          router.replace('/dashboard/client')
          return
        }

        // Si aucun profil trouvé, rediriger vers l'accueil
        router.replace('/')
      } catch (error) {
        console.error('Erreur lors de la redirection:', error)
        router.replace('/')
      }
    }

    // Attendre que la page soit montée côté client
    if (typeof window !== 'undefined') {
      handleAuthCallback()
    }
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center max-w-md">
          <div className="bg-red-100 p-3 rounded-xl w-fit mx-auto mb-4">
            <QrCode className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Erreur de confirmation</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a 
            href="/auth/login"
            className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all font-semibold inline-block"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center">
        <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-3 rounded-xl w-fit mx-auto mb-4">
          <QrCode className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Confirmation en cours...</h1>
        <div className="animate-spin rounded-full h-6 w-6 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre dashboard...</p>
      </div>
    </div>
  )
}
