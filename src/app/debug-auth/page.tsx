'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugAuth() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      let profileData = null
      if (session?.user) {
        // Vérifier entreprise
        const { data: company } = await supabase
          .from('companies')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        if (company) {
          profileData = { type: 'company', data: company }
        } else {
          // Vérifier client
          const { data: client } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (client) {
            profileData = { type: 'client', data: client }
          }
        }
      }

      setAuthState({
        session,
        error,
        profile: profileData,
        user: session?.user || null
      })
    } catch (err) {
      setAuthState({ error: err })
    } finally {
      setLoading(false)
    }
  }

  const forceLogout = async () => {
    await supabase.auth.signOut()
    setAuthState(null)
    alert('Déconnexion forcée')
    window.location.href = '/'
  }

  const testLogin = async () => {
    try {
      const email = prompt('Email:')
      const password = prompt('Mot de passe:')
      
      if (email && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        console.log('Résultat login:', { data, error })
        alert(error ? `Erreur: ${error.message}` : 'Connexion réussie!')
        await checkAuth()
      }
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded">
        <h1 className="text-2xl font-bold mb-4">🔍 Debug Authentification</h1>
        
        <div className="space-y-4 mb-6">
          <button 
            onClick={checkAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            🔄 Recharger Info
          </button>
          
          <button 
            onClick={forceLogout}
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
          >
            🚪 Forcer Déconnexion
          </button>
          
          <button 
            onClick={testLogin}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            🔐 Test Login
          </button>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h2 className="font-bold mb-2">État d'authentification :</h2>
          <pre className="text-xs overflow-auto bg-white p-3 rounded">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>

        <div className="mt-4 space-x-2">
          <a href="/auth/login" className="bg-purple-500 text-white px-4 py-2 rounded inline-block">
            Aller vers Login
          </a>
          <a href="/dashboard" className="bg-orange-500 text-white px-4 py-2 rounded inline-block">
            Aller vers Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
