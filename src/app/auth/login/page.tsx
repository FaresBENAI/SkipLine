'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Eye, EyeOff, LogIn, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import type { AuthFormData } from '@/types'

export default function LoginPage() {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const addDebug = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => [...prev, `${timestamp}: ${msg}`])
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof AuthFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {}

    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    addDebug('🚀 DÉBUT DE LA CONNEXION')
    addDebug(`Email: ${formData.email}`)
    
    if (!validateForm()) {
      addDebug('❌ Validation échouée')
      return
    }

    setLoading(true)
    setMessage(null)
    addDebug('📡 Appel Supabase signInWithPassword...')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        addDebug(`❌ Erreur Supabase: ${error.message}`)
        if (error.message.includes('Email not confirmed')) {
          setMessage({
            type: 'error',
            text: 'Veuillez confirmer votre email avant de vous connecter.'
          })
        } else if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Email ou mot de passe incorrect' })
        } else {
          setErrors({ email: error.message })
        }
        return
      }

      if (data.user) {
        addDebug(`✅ Connexion réussie! User ID: ${data.user.id}`)
        
        // Recherche entreprise
        addDebug('🔍 Recherche dans table companies...')
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', data.user.id)
          .single()

        if (company && !companyError) {
          addDebug(`✅ ENTREPRISE TROUVÉE: ${company.name}`)
          addDebug('🔄 Redirection vers /dashboard/company dans 2 secondes...')
          
          setMessage({
            type: 'success',
            text: `Bienvenue ${company.name} ! Redirection en cours...`
          })
          
          setTimeout(() => {
            addDebug('🚀 REDIRECTION MAINTENANT!')
            window.location.href = '/dashboard/company'
          }, 2000)
          return
        }

        addDebug('❌ Pas d\'entreprise trouvée')
        
        // Recherche client
        addDebug('🔍 Recherche dans table users...')
        const { data: client, error: clientError } = await supabase
          .from('users')
          .select('id, first_name, last_name')
          .eq('id', data.user.id)
          .single()

        if (client && !clientError) {
          addDebug(`✅ CLIENT TROUVÉ: ${client.first_name} ${client.last_name}`)
          addDebug('�� Redirection vers /dashboard/client dans 2 secondes...')
          
          setMessage({
            type: 'success',
            text: `Bienvenue ${client.first_name} ! Redirection en cours...`
          })
          
          setTimeout(() => {
            addDebug('🚀 REDIRECTION MAINTENANT!')
            window.location.href = '/dashboard/client'
          }, 2000)
          return
        }

        addDebug('❌ ERREUR: Aucun profil trouvé!')
        setMessage({
          type: 'error',
          text: 'Erreur: Aucun profil trouvé dans la base de données.'
        })
      } else {
        addDebug('❌ ERREUR: Aucun utilisateur dans la réponse')
        setErrors({ email: 'Erreur de connexion' })
      }
    } catch (error) {
      addDebug(`💥 EXCEPTION: ${error}`)
      console.error('Erreur:', error)
      setErrors({ email: 'Une erreur est survenue' })
    } finally {
      setLoading(false)
      addDebug('🏁 FIN DU PROCESSUS DE CONNEXION')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
          
          <h1 className="text-2xl font-bold mb-2">Connexion - Mode Debug</h1>
          <p className="text-gray-600">Les logs restent visibles pendant la connexion</p>
        </div>

        {/* Debug persistant */}
        <div className="mb-6 p-4 bg-gray-900 text-green-400 rounded-xl max-h-60 overflow-y-auto font-mono text-xs">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-green-300 font-bold">🔍 DEBUG CONSOLE</h3>
            <button 
              onClick={() => setDebugInfo([])}
              className="text-red-400 hover:text-red-300"
            >
              Clear
            </button>
          </div>
          {debugInfo.length === 0 ? (
            <p className="text-gray-500">En attente de connexion...</p>
          ) : (
            debugInfo.map((info, index) => (
              <div key={index} className="mb-1">{info}</div>
            ))
          )}
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700'
              : message.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <Card>
          <Card.Content>
            {/* PAS de form - juste des inputs et un bouton */}
            <div className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                placeholder="votre@email.com"
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Bouton de connexion - PAS dans un form */}
              <Button
                onClick={handleLogin}
                loading={loading}
                className="w-full"
                size="lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Se connecter (Mode Debug)
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Test direct */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700 mb-2">Tests directs :</p>
          <div className="space-y-1">
            <button 
              onClick={() => {
                addDebug('🧪 Test redirection client...')
                window.location.href = '/dashboard/client'
              }}
              className="w-full text-left text-sm text-blue-600 underline"
            >
              → Test dashboard client
            </button>
            <button 
              onClick={() => {
                addDebug('🧪 Test redirection entreprise...')
                window.location.href = '/dashboard/company'
              }}
              className="w-full text-left text-sm text-blue-600 underline"
            >
              → Test dashboard entreprise
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
