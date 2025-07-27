'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Company, User as AppUser } from '@/types'

interface AuthState {
  user: User | null
  profile: Company | AppUser | null
  userType: 'company' | 'client' | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    userType: null,
    loading: true
  })

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user)
        } else {
          setState({
            user: null,
            profile: null,
            userType: null,
            loading: false
          })
        }
      }
    )

    getSession()

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (user: User) => {
    try {
      // Essayer de récupérer le profil entreprise
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', user.id)
        .single()

      if (company && !companyError) {
        setState({
          user,
          profile: company,
          userType: 'company',
          loading: false
        })
        return
      }

      // Sinon essayer le profil client
      const { data: client, error: clientError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (client && !clientError) {
        setState({
          user,
          profile: client,
          userType: 'client',
          loading: false
        })
        return
      }

      // Aucun profil trouvé
      setState({
        user,
        profile: null,
        userType: null,
        loading: false
      })
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
      setState(prev => ({ ...prev, loading: false }))
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return {
    ...state,
    signOut
  }
}
