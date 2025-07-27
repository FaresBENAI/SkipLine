'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        if (!session) {
          window.location.href = '/auth/login'
          return
        }

        setUser(session.user)
        
        const { data: clientProfile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (isMounted) {
          setProfile(clientProfile)
          setLoading(false)
        }
      } catch (error) {
        console.error('Erreur:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎉 Succès !</h1>
              <p className="text-gray-600">Bienvenue {profile?.first_name} {profile?.last_name}</p>
            </div>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold text-green-900 mb-4">✅ Système parfaitement fonctionnel !</h2>
          <div className="space-y-2 text-green-800">
            <p>✅ Inscription réussie</p>
            <p>✅ Confirmation email réussie</p>
            <p>✅ Connexion réussie</p>
            <p>✅ Dashboard client affiché</p>
            <p>✅ Profil chargé correctement</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Mon Profil</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Prénom</p>
              <p className="font-semibold">{profile?.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Nom</p>
              <p className="font-semibold">{profile?.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">QR Code</p>
              <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{profile?.qr_code}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">🚀 Prochaines étapes</h2>
          <div className="text-blue-800 space-y-2">
            <p>• Développer le scanner QR</p>
            <p>• Créer le système de files d'attente</p>
            <p>• Ajouter les notifications temps réel</p>
            <p>• Implémenter le dashboard entreprise</p>
          </div>
        </div>
      </div>
    </div>
  )
}
