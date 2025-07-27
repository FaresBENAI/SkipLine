'use client'

import { QrCode, User, LogOut } from 'lucide-react'
import { Button, Card } from '@/components/ui'

export default function ClientDashboard() {
  const handleClick = () => {
    alert('Bouton cliqué - pas de refresh!')
  }

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Client - Test</h1>
              <p className="text-gray-600">Page de test sans useEffect</p>
            </div>
          </div>
          
          <Button onClick={handleSignOut} variant="secondary">
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Test Message */}
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <h3 className="font-semibold text-yellow-900 mb-2">🧪 Page de test</h3>
          <p className="text-yellow-700 text-sm">
            Cette page n'a aucun useEffect, aucune logique de session. 
            Si elle se refresh encore, le problème vient d'ailleurs (middleware, layout, etc.)
          </p>
        </div>

        {/* Test Card */}
        <Card className="mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Test d'interactions</h2>
            <div className="space-y-4">
              <Button onClick={handleClick} variant="primary" className="w-full">
                Cliquez-moi (Test Alert)
              </Button>
              
              <Button 
                onClick={() => console.log('Test console:', new Date().toLocaleTimeString())} 
                variant="secondary" 
                className="w-full"
              >
                Test Console Log
              </Button>
              
              <Button 
                onClick={() => {
                  const div = document.createElement('div')
                  div.innerHTML = 'Test DOM - ' + new Date().toLocaleTimeString()
                  div.className = 'p-2 bg-green-100 border border-green-300 rounded mt-2'
                  document.body.appendChild(div)
                  setTimeout(() => document.body.removeChild(div), 3000)
                }}
                variant="success" 
                className="w-full"
              >
                Test Manipulation DOM
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informations</h2>
            <div className="space-y-2 text-sm">
              <p><strong>URL actuelle:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
              <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
              <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'N/A'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
