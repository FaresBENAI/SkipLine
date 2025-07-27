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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.replace('/auth/login')
          return
        }

        setUser(session.user)
        
        const { data: clientProfile, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (error) {
          console.error('Erreur chargement profil:', error)
        } else {
          setProfile(clientProfile)
        }
      } catch (error) {
        console.error('Erreur session:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, []) // Suppression de la dépendance [router] qui causait la boucle

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/')
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

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
        <div className="text-center">
          <p className="text-red-600">Erreur de chargement du profil</p>
          <Button onClick={() => router.replace('/auth/login')} className="mt-4">
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
              <p className="text-gray-600">Bienvenue, {profile?.first_name} {profile?.last_name} !</p>
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
              <p className="font-semibold text-green-900">Connexion réussie !</p>
              <p className="text-green-700 text-sm">Votre profil client a été créé et configuré correctement.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Votre QR Code</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.qr_code}</p>
              </div>
              <QrCode className="h-8 w-8 text-cyan-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
              </div>
              <User className="h-8 w-8 text-violet-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Téléphone</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'Non renseigné'}</p>
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
                <p className="font-semibold">{profile?.first_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nom</p>
                <p className="font-semibold">{profile?.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">QR Code Personnel</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{profile?.qr_code}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Test de navigation */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Test</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => alert('Bouton déconnexion cliqué!')}
                variant="secondary"
                className="w-full"
              >
                Test bouton (Alert)
              </Button>
              
              <Button
                onClick={() => console.log('Test console log')}
                variant="primary"
                className="w-full"
              >
                Test console log
              </Button>
            </div>
          </div>
        </Card>

        {/* Actions disponibles */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Fonctionnalités à venir</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <QrCode className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Scanner QR</h3>
                <p className="text-sm text-gray-600">Rejoindre des files d'attente</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Clock className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Mes Files</h3>
                <p className="text-sm text-gray-600">Suivre mes positions</p>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg text-center">
                <Calendar className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Historique</h3>
                <p className="text-sm text-gray-600">Mes visites passées</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
