'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugAuth() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [detailedErrors, setDetailedErrors] = useState<any>({})

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      let profileData = null
      const queryDetails: any = {}

      if (session?.user) {
        console.log('🔍 User ID recherché:', session.user.id)
        
        // Vérifier entreprise avec logs détaillés
        console.log('📋 Recherche dans table companies...')
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', session.user.id)
          .single()
        
        console.log('🏢 Résultat companies:', { company, companyError })
        queryDetails.company = { data: company, error: companyError }
        
        if (company && !companyError) {
          profileData = { type: 'company', data: company }
        } else {
          // Vérifier client avec logs détaillés
          console.log('📋 Recherche dans table users...')
          const { data: client, error: clientError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          console.log('👤 Résultat users:', { client, clientError })
          queryDetails.client = { data: client, error: clientError }
          
          if (client && !clientError) {
            profileData = { type: 'client', data: client }
          }
        }
      }

      setAuthState({
        session,
        error: sessionError,
        profile: profileData,
        user: session?.user || null
      })

      setDetailedErrors(queryDetails)
    } catch (err) {
      console.error('❌ Erreur globale:', err)
      setAuthState({ error: err })
    } finally {
      setLoading(false)
    }
  }

  const testCompanyQuery = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Pas de session')
        return
      }

      console.log('🔍 Test requête directe companies avec ID:', session.user.id)
      
      // Test 1: Sans .single()
      const { data: allCompanies, error: error1 } = await supabase
        .from('companies')
        .select('*')
        .eq('id', session.user.id)

      console.log('📊 Résultat sans .single():', { allCompanies, error1 })

      // Test 2: Avec .single()
      const { data: singleCompany, error: error2 } = await supabase
        .from('companies')
        .select('*')
        .eq('id', session.user.id)
        .single()

      console.log('📊 Résultat avec .single():', { singleCompany, error2 })

      alert('Vérifiez la console pour les résultats des tests')
    } catch (error) {
      console.error('Erreur test:', error)
    }
  }

  const forceLogout = async () => {
    await supabase.auth.signOut()
    setAuthState(null)
    alert('Déconnexion forcée')
    window.location.href = '/'
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
            onClick={testCompanyQuery}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            🧪 Test Requête Companies
          </button>
          
          <button 
            onClick={forceLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            🚪 Forcer Déconnexion
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded">
            <h2 className="font-bold mb-2">État d'authentification :</h2>
            <pre className="text-xs overflow-auto bg-white p-3 rounded max-h-64">
              {JSON.stringify(authState, null, 2)}
            </pre>
          </div>

          <div className="bg-red-50 p-4 rounded">
            <h2 className="font-bold mb-2">Détails des requêtes :</h2>
            <pre className="text-xs overflow-auto bg-white p-3 rounded max-h-64">
              {JSON.stringify(detailedErrors, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
