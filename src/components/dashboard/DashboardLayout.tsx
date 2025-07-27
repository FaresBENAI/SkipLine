'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  QrCode, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  Home,
  Building,
  Users,
  BarChart3,
  Camera,
  Bell
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, userType, signOut, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-violet-200 border-t-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    router.push('/auth/login')
    return null
  }

  // Navigation selon le type d'utilisateur
  const navigation = userType === 'company' ? [
    { name: 'Tableau de bord', href: '/dashboard/company', icon: Home },
    { name: 'Mes files', href: '/dashboard/company/queues', icon: Users },
    { name: 'Scanner QR', href: '/dashboard/company/scan', icon: Camera },
    { name: 'Statistiques', href: '/dashboard/company/stats', icon: BarChart3 },
    { name: 'Paramètres', href: '/dashboard/company/settings', icon: Settings },
  ] : [
    { name: 'Tableau de bord', href: '/dashboard/client', icon: Home },
    { name: 'Mes files', href: '/dashboard/client/queues', icon: Users },
    { name: 'Scanner QR', href: '/dashboard/client/scan', icon: Camera },
    { name: 'Notifications', href: '/dashboard/client/notifications', icon: Bell },
    { name: 'Paramètres', href: '/dashboard/client/settings', icon: Settings },
  ]

  const displayName = userType === 'company' 
    ? (profile as any).name 
    : `${(profile as any).first_name} ${(profile as any).last_name}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-white/90 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-xl">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">SkipLine</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            
            <nav className="mt-8 px-4 space-y-2">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-200/50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-lg">
                    {userType === 'company' ? (
                      <Building className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm truncate">{displayName}</p>
                    <p className="text-xs text-gray-500">{userType === 'company' ? 'Entreprise' : 'Client'}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="h-full bg-white/90 backdrop-blur-sm shadow-xl border-r border-gray-200/50">
          <div className="flex items-center h-16 px-6 border-b border-gray-200/50">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-xl">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">SkipLine</span>
            </Link>
          </div>
          
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-all"
                >
                  <IconComponent className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-6 left-4 right-4">
            <div className="bg-gradient-to-r from-violet-50 to-cyan-50 rounded-xl p-4 border border-violet-200/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-lg">
                  {userType === 'company' ? (
                    <Building className="h-5 w-5 text-white" />
                  ) : (
                    <User className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 truncate">{displayName}</p>
                  <p className="text-sm text-gray-500">{userType === 'company' ? 'Entreprise' : 'Client'}</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-1.5 rounded-lg">
              <QrCode className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">SkipLine</span>
          </Link>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
