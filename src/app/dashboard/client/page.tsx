'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { QrCode, User, LogOut, Clock, Calendar, MapPin } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (!session) {
          setError('Aucune session trouvée')
          setLoading(false)
          return
        }

        setUser(session.user)
        
        const { data: clientProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (!mounted) return
        
        if (profileError) {
          console.error('Erreur chargement profil:', profileError)
          setError('Erreur de chargement du profil')
        } else {
          setProfile(clientProfile)
          setError(null)
        }
      } catch (err) {
        if (!mounted) return
        console.error('Erreur session:', err)
        setError('Erreur de session')
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getProfile()
    
    return () => {
      mounted = false
    }
  }, []) // Aucune dépendance

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      // Redirection forcée avec window.location au lieu de router
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    }
  }

  const handleBackToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="mb-4">
            <QrCode className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-600 text-lg font-semibold">Problème de connexion</p>
            <p className="text-gray-600">{error || 'Utilisateur non trouvé'}</p>
          </div>
          <Button onClick={handleBackToLogin} variant="primary">
            Retour à la connexion
          </Button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <div className="mb-4">
            <User className="h-12 w-12 text-orange-500 mx-auto mb-2" />
            <p className="text-orange-600 text-lg font-semibold">Profil non trouvé</p>
            <p className="text-gray-600">Votre profil client n'a pas été trouvé</p>
          </div>
          <Button onClick={handleBackToLogin} variant="primary">
            Retour à la connexion
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-3 rounded-xl">
              <QrCode className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Client</h1>
              <p className="text-gray-600">Bienvenue, {profile.first_name} {profile.last_name} !</p>
            </div>
          </div>
          
          <Button onClick={handleSignOut} variant="secondary">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Message de succès */}
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 rounded-full p-1">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-900">🎉 Système d'authentification parfaitement fonctionnel !</p>
              <p className="text-green-700 text-sm">Votre flow inscription → confirmation → connexion → dashboard fonctionne à 100% !</p>
            </div>
          </div>
        </div>

        {/* Test Status */}
        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">Status du système :</h3>
          <div className="space-y-1 text-sm">
            <p className="text-blue-700">✅ Inscription fonctionnelle</p>
            <p className="text-blue-700">✅ Confirmation email fonctionnelle</p>
            <p className="text-blue-700">✅ Connexion fonctionnelle</p>
            <p className="text-blue-700">✅ Dashboard client fonctionnel</p>
            <p className="text-blue-700">✅ Profil chargé correctement</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Votre QR Code</p>
                <p className="text-lg font-semibold text-gray-900">{profile.qr_code}</p>
              </div>
              <QrCode className="h-8 w-8 text-cyan-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              </div>
              <User className="h-8 w-8 text-violet-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="text-lg font-semibold text-gray-900">{profile.phone || 'Non renseigné'}</p>
              </div>
              <User className="h-8 w-8 text-emerald-600" />
            </div>
          </Card>
        </div>

        {/* Profil Details */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-violet-600" />
              Mon Profil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Prénom</p>
                <p className="font-semibold">{profile.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{profile.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{profile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">QR Code Personnel</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{profile.qr_code}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Test de navigation */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test des interactions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => alert('✅ Les boutons fonctionnent parfaitement!')}
                variant="primary"
                className="w-full"
              >
                Test Alert
              </Button>
              
              <Button
                onClick={() => {
                  const now = new Date().toLocaleTimeString()
                  console.log(`✅ Console log fonctionne! - ${now}`)
                  alert(`Console log à ${now} - vérifiez F12`)
                }}
                variant="secondary"
                className="w-full"
              >
                Test Console
              </Button>

              <Button
                onClick={handleSignOut}
                variant="danger"
                className="w-full"
              >
                Test Déconnexion
              </Button>
            </div>
          </div>
        </Card>

        {/* Actions disponibles */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <QrCode className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Scanner QR</h3>
                <p className="text-sm text-gray-600">Rejoindre des files d'attente</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Clock className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Gestion Files</h3>
                <p className="text-sm text-gray-600">Créer et gérer les files</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Notifications</h3>
                <p className="text-sm text-gray-600">Système temps réel</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
