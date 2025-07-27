'use client'

import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Clock, 
  QrCode, 
  TrendingUp, 
  Plus, 
  Play, 
  Pause, 
  UserPlus,
  BarChart3,
  Eye,
  Settings
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Button, Card } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import type { Queue, QueueEntry } from '@/types'

interface QueueWithStats extends Queue {
  waiting_count: number
  called_count: number
  total_today: number
}

export default function CompanyDashboard() {
  const { profile } = useAuth()
  const [queues, setQueues] = useState<QueueWithStats[]>([])
  const [stats, setStats] = useState({
    totalQueues: 0,
    totalWaiting: 0,
    totalServedToday: 0,
    averageWaitTime: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      loadDashboardData()
    }
  }, [profile])

  const loadDashboardData = async () => {
    try {
      // Charger les files avec leurs statistiques
      const { data: queuesData, error: queuesError } = await supabase
        .from('queues')
        .select(`
          *,
          queue_entries!inner (
            id,
            status,
            joined_at
          )
        `)
        .eq('company_id', profile?.id)

      if (queuesError) throw queuesError

      // Calculer les statistiques pour chaque file
      const queuesWithStats = await Promise.all(
        (queuesData || []).map(async (queue) => {
          const { data: entries } = await supabase
            .from('queue_entries')
            .select('id, status, joined_at')
            .eq('queue_id', queue.id)

          const waiting_count = entries?.filter(e => e.status === 'waiting').length || 0
          const called_count = entries?.filter(e => e.status === 'called').length || 0
          
          // Clients servis aujourd'hui
          const today = new Date().toISOString().split('T')[0]
          const total_today = entries?.filter(e => 
            e.status === 'served' && 
            e.joined_at?.startsWith(today)
          ).length || 0

          return {
            ...queue,
            waiting_count,
            called_count,
            total_today
          }
        })
      )

      setQueues(queuesWithStats)

      // Calculer les statistiques globales
      const totalQueues = queuesWithStats.length
      const totalWaiting = queuesWithStats.reduce((sum, q) => sum + q.waiting_count, 0)
      const totalServedToday = queuesWithStats.reduce((sum, q) => sum + q.total_today, 0)
      const averageWaitTime = queuesWithStats.length > 0 
        ? Math.round(queuesWithStats.reduce((sum, q) => sum + q.average_wait_time, 0) / queuesWithStats.length)
        : 0

      setStats({
        totalQueues,
        totalWaiting,
        totalServedToday,
        averageWaitTime
      })
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleQueueStatus = async (queueId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('queues')
        .update({ is_paused: !currentStatus })
        .eq('id', queueId)

      if (error) throw error

      // Recharger les données
      loadDashboardData()
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la file:', error)
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
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenue, {(profile as any)?.name}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard/company/queues/new">
              <Button variant="success" className="w-full sm:w-auto">
                <Plus className="h-5 w-5 mr-2" />
                Nouvelle file
              </Button>
            </Link>
            <Link href="/dashboard/company/scan">
              <Button variant="secondary" className="w-full sm:w-auto">
                <QrCode className="h-5 w-5 mr-2" />
                Scanner QR
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-violet-100 p-3 rounded-xl">
                <Users className="h-6 w-6 text-violet-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Files actives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalQueues}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-cyan-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalWaiting}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-emerald-100 p-3 rounded-xl">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Servis aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalServedToday}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center">
              <div className="bg-orange-100 p-3 rounded-xl">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Temps moyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageWaitTime}min</p>
              </div>
            </div>
          </Card>
        </div>

        {/* QR Code de l'entreprise */}
        <Card>
          <Card.Header>
            <h2 className="text-xl font-bold text-gray-900">Votre QR Code entreprise</h2>
            <p className="text-gray-600">Les clients scannent ce code pour accéder à vos files d'attente</p>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="bg-gradient-to-r from-violet-100 to-cyan-100 p-8 rounded-2xl">
                <QrCode className="h-32 w-32 text-violet-600" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Code QR</p>
                  <p className="font-mono text-lg">{(profile as any)?.qr_code}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="primary" className="flex-1">
                    <QrCode className="h-4 w-4 mr-2" />
                    Télécharger QR
                  </Button>
                  <Button variant="secondary" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Prévisualiser
                  </Button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Liste des files d'attente */}
        <Card>
          <Card.Header>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mes files d'attente</h2>
                <p className="text-gray-600">Gérez vos files d'attente en temps réel</p>
              </div>
              <Link href="/dashboard/company/queues">
                <Button variant="secondary" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
          </Card.Header>
          <Card.Content>
            {queues.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune file d'attente</h3>
                <p className="text-gray-600 mb-4">
                  Créez votre première file d'attente pour commencer
                </p>
                <Link href="/dashboard/company/queues/new">
                  <Button variant="primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une file
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {queues.slice(0, 3).map((queue) => (
                  <div
                    key={queue.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-xl gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{queue.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          queue.is_paused 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {queue.is_paused ? 'En pause' : 'Active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{queue.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>{queue.waiting_count} en attente</span>
                        <span>{queue.called_count} appelés</span>
                        <span>{queue.total_today} servis aujourd'hui</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={queue.is_paused ? "success" : "secondary"}
                        size="sm"
                        onClick={() => toggleQueueStatus(queue.id, queue.is_paused)}
                      >
                        {queue.is_paused ? (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Reprendre
                          </>
                        ) : (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Pause
                          </>
                        )}
                      </Button>
                      
                      <Link href={`/dashboard/company/queues/${queue.id}`}>
                        <Button variant="primary" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Gérer
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/dashboard/company/scan">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-violet-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Scanner un client</h3>
                <p className="text-sm text-gray-600">
                  Scannez le QR code d'un client pour l'ajouter rapidement à une file
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/company/queues/new">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-emerald-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <Plus className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Nouvelle file</h3>
                <p className="text-sm text-gray-600">
                  Créez une nouvelle file d'attente pour vos services
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/company/settings">
            <Card className="p-6 hover:shadow-xl transition-all cursor-pointer h-full">
              <div className="text-center">
                <div className="bg-cyan-100 p-4 rounded-xl w-fit mx-auto mb-4">
                  <Settings className="h-8 w-8 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Paramètres</h3>
                <p className="text-sm text-gray-600">
                  Configurez votre profil et les notifications
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
