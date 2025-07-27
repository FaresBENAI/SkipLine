'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'

export default function ConfirmationPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)

  useEffect(() => {
    // Récupérer l'email depuis l'URL côté client
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const emailParam = urlParams.get('email')
      if (emailParam) {
        setEmail(emailParam)
      }
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Rediriger vers le bon dashboard
          await redirectToCorrectDashboard(session.user.id)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const redirectToCorrectDashboard = async (userId: string) => {
    try {
      // Vérifier si c'est une entreprise
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('id', userId)
        .single()

      if (company && !companyError) {
        router.replace('/dashboard/company')
        return
      }

      // Vérifier si c'est un client
      const { data: client, error: clientError } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single()

      if (client && !clientError) {
        router.replace('/dashboard/client')
        return
      }

      // Si aucun profil trouvé, rediriger vers l'accueil
      router.replace('/')
    } catch (error) {
      console.error('Erreur lors de la redirection:', error)
      router.replace('/')
    }
  }

  const resendEmail = async () => {
    if (email && timeLeft === 0) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email
        })
        
        if (error) {
          console.error('Erreur lors du renvoi:', error)
        } else {
          setTimeLeft(60)
        }
      } catch (err) {
        console.error('Erreur:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6 text-violet-600 hover:text-violet-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-3 rounded-2xl">
              <QrCode className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Vérifiez votre email
          </h1>
          <p className="text-gray-600">
            Un lien de confirmation a été envoyé
          </p>
        </div>

        <Card>
          <Card.Content className="text-center">
            <div className="bg-violet-100 p-4 rounded-xl w-fit mx-auto mb-6">
              <Mail className="h-12 w-12 text-violet-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Confirmez votre adresse email
            </h2>
            
            <p className="text-gray-600 mb-6">
              Nous avons envoyé un lien de confirmation à{' '}
              <span className="font-semibold text-gray-900">{email || 'votre adresse email'}</span>
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Presque terminé !</p>
              </div>
              <p className="text-sm text-green-600 mt-1">
                Cliquez sur le lien dans l'email pour activer votre compte et accéder à votre dashboard.
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Vous n'avez pas reçu l'email ?</p>
              <p>Vérifiez vos spams ou {' '}
                {timeLeft > 0 ? (
                  <span>renvoyez dans {timeLeft}s</span>
                ) : (
                  <button 
                    onClick={resendEmail}
                    className="text-violet-600 hover:text-violet-800 font-medium"
                  >
                    renvoyer maintenant
                  </button>
                )}
              </p>
            </div>
          </Card.Content>
        </Card>

        <div className="text-center mt-6">
          <Link href="/auth/login" className="text-violet-600 hover:text-violet-800 font-semibold">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  )
}
