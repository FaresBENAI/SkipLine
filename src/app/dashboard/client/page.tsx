'use client'

import React, { useState, useEffect } from 'react'
import { 
  QrCode, 
  Clock, 
  MapPin, 
  Bell, 
  Eye, 
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  User
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button, Card } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { QueueEntry, Queue, Company } from '@/types'

interface QueueEntryWithDetails extends QueueEntry {
  queue: Queue & {
    company: Company
  }
}

interface ClientStats {
  currentQueues: number
  totalVisits: number
  averageWaitTime: number
  favoriteCompanies: number
}

export default function ClientDashboard() {
  const { profile } = useAuth()
  const [currentQueues, setCurrentQueues] = useState<QueueEntryWithDetails[]>([])
  const [recentHistory, setRecentHistory] = useState<QueueEntryWithDetails[]>([])
  const [stats, setStats] = useState<ClientStats>({
    currentQueues: 0,
    totalVisits: 0,
    averageWaitTime: 0,
    favoriteCompanies: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadClientData()
      
      // Écouter les changements en temps réel
      const subscription = supabase
        .channel('client-queue-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'queue_entries',
            filter: `user_id=eq.${profile.id}`
          },
          () => {
            loadClientData()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [profile])

  const loadClientData = async () => {
    try {
      // Charger les files d'attente actuelles
      const { data: currentData, error: currentError } = await supabase
        .from('queue_entries')
        .select(`
          *,
          queue:queues!inner (
            *,
            company:companies!inner (*)
          )
        `)
        .eq('user_id', profile?.id)
        .in('status', ['waiting', 'called'])
        .order('joined_at', { ascending: false })

      if (currentError) throw currentError

      setCurrentQueues(currentData as QueueEntryWithDetails[] || [])

      // Charger l'historique récent
      const { data: historyData, error: historyError } = await supabase
        .from('queue_entries')
        .select(`
          *,
          queue:queues!inner (
            *,
            company:companies!inner (*)
          )
        `)
        .eq('user_id', profile?.id)
        .in('status', ['served', 'cancelled'])
        .order('served_at', { ascending: false })
        .limit(5)

      if (historyError) throw historyError

      setRecentHistory(historyData as QueueEntryWithDetails[] || [])

      // Calculer les statistiques
      const { data: allEntries, error: statsError } = await supabase
        .from('queue_entries')
        .select('*')
        .eq('user_id', profile?.id)

      if (!statsError && allEntries) {
        const currentQueuesCount = (currentData || []).length
        const totalVisits = allEntries.length
        
        // Temps d'attente moyen (approximatif)
        const servedEntries = allEntries.filter(e => e.estimated_wait_time)
        const averageWaitTime = servedEntries.length > 0
          ? Math.round(servedEntries.reduce((sum, e) => sum + (e.estimated_wait_time || 0), 0) / servedEntries.length)
          : 0

        // Entreprises uniques visitées
        const uniqueCompanies = new Set(
          (historyData || []).map(e => e.queue.company.id)
        ).size

        setStats({
          currentQueues: currentQueuesCount,
          totalVisits,
          averageWaitTime,
          favoriteCompanies: uniqueCompanies
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données client:', error)
    } finally {
      setLoading(false)
    }
  }

  const leaveQueue = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('queue_entries')
        .update({ status: 'cancelled' })
        .eq('id', entryId)

      if (error) throw error

      // Recharger les données
      loadClientData()
    } catch (error) {
      console.error('Erreur lors de la sortie de la file:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-700'
      case 'called':
        return 'bg-green-100 text-green-700'
      case 'served':
        return 'bg-emerald-100 text-emerald-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'En attente'
      case 'called':
        return 'Appelé'
      case 'served':
        return 'Servi'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-200 border-t-violet-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Mon tableau de bord
            </h1>
            <p className="text-gray-600 mt-1">
              Bonjour, {(profile as any)?.first_name} {(profile as any)?.last_name}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/client/scan">
              <Button variant="primary" className="w-full sm:w-auto">
                <QrCode className="h-5 w-5 mr-2" />
                Scanner QR
              </Button>
            </Link>
            <Link href="/dashboard/client/notifications">
              <Button variant="secondary" className="w-full sm:w-auto">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques personnelles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-violet-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-violet-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Files actuelles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentQueues}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-cyan-100 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Visites totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVisits}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageWaitTime}min</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Entreprises</p>
                <p className="text-2xl font-bold text-gray-900">{stats.favoriteCompanies}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Mon QR Code personnel */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-gray-900">Mon QR Code personnel</h2>
            <p className="text-gray-600">Présentez ce code aux entreprises pour un ajout rapide en file</p>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="bg-gradient-to-r from-violet-100 to-cyan-100 p-8 rounded-2xl">
                <QrCode className="h-32 w-32 text-violet-600" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Code QR Personnel</p>
                  <p className="font-mono text-lg">{(profile as any)?.qr_code}</p>
                </div>
                
                <div className="bg-violet-50 p-4 rounded-xl border border-violet-200">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-violet-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-violet-900">Comment l'utiliser ?</p>
                      <p className="text-sm text-violet-700 mt-1">
                        Montrez ce QR code à l'entreprise ou utilisez leur scanner pour être ajouté rapidement à leur file d'attente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Files d'attente actuelles */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-gray-900">Mes files d'attente actuelles</h2>
            <p className="text-gray-600">Suivez votre position en temps réel</p>
          </Card.Header>
          <Card.Content>
            {currentQueues.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune file d'attente</h3>
                <p className="text-gray-600 mb-4">
                  Scannez le QR code d'une entreprise pour rejoindre une file
                </p>
                <Link href="/dashboard/client/scan">
                  <Button variant="primary">
                    <QrCode className="h-4 w-4 mr-2" />
                    Scanner QR
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {currentQueues.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 rounded-xl p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {entry.queue.company.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                            {getStatusText(entry.status)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{entry.queue.name}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Position</p>
                            <p className="font-semibold text-lg text-violet-600">#{entry.position}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Temps estimé</p>
                            <p className="font-semibold text-lg text-cyan-600">
                              {entry.estimated_wait_time || 0} min
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Arrivée</p>
                            <p className="font-semibold">
                              {new Date(entry.joined_at).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        {entry.status === 'called' && (
                          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <p className="font-medium text-green-900">C'est votre tour !</p>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              Présentez-vous au comptoir de {entry.queue.company.name}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => leaveQueue(entry.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Quitter
                        </Button>
                        
                        <Link href={`/queue/${entry.queue.id}`}>
                          <Button variant="secondary" size="sm" className="w-full">
                            <Eye className="h-4 w-4 mr-1" />
                            Détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Historique récent */}
        {recentHistory.length > 0 && (
          <Card>
            <Card.Header>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Historique récent</h2>
                  <p className="text-gray-600">Vos dernières visites</p>
                </div>
                <Link href="/dashboard/client/history">
                  <Button variant="secondary" size="sm">
                    Voir tout
                  </Button>
                </Link>
              </div>
            </Card.Header>
            <Card.Content>
              <div className="space-y-3">
                {recentHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{entry.queue.company.name}</p>
                      <p className="text-sm text-gray-600">{entry.queue.name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {getStatusText(entry.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.served_at ? 
                          new Date(entry.served_at).toLocaleDateString('fr-FR') :
                          new Date(entry.joined_at).toLocaleDateString('fr-FR')
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        )}

        {/* Actions rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/dashboard/client/scan">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-violet-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Scanner QR</h3>
                <p className="text-sm text-gray-600">
                  Scannez le QR code d'une entreprise pour rejoindre sa file d'attente
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/client/notifications">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-cyan-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <Bell className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">
                  Gérez vos préférences de notifications et alertes
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/client/settings">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <User className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Mon profil</h3>
                <p className="text-sm text-gray-600">
                  Modifiez vos informations personnelles et préférences
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
