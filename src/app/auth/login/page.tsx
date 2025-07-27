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
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`])
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    addDebug(`Tentative de connexion pour: ${formData.email}`)
    
    if (!validateForm()) {
      addDebug('Validation du formulaire échouée')
      return
    }

    setLoading(true)
    setMessage(null)
    
    try {
      addDebug('Appel à signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      addDebug(`Résultat connexion: ${error ? 'ERREUR' : 'SUCCÈS'}`)

      if (error) {
        addDebug(`Erreur: ${error.message}`)
        if (error.message.includes('Email not confirmed')) {
          setMessage({
            type: 'error',
            text: 'Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.'
          })
        } else if (error.message.includes('Invalid login credentials')) {
          setErrors({ email: 'Email ou mot de passe incorrect' })
        } else {
          setErrors({ email: error.message })
        }
        return
      }

      if (data.user) {
        addDebug(`Utilisateur connecté: ${data.user.email}`)
        addDebug(`User ID: ${data.user.id}`)
        
        // Vérifier le type d'utilisateur
        addDebug('Vérification du type d\'utilisateur...')
        
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .select('id, name')
          .eq('id', data.user.id)
          .single()

        addDebug(`Recherche entreprise: ${companyError ? 'NON TROUVÉE' : 'TROUVÉE'}`)
        
        if (company && !companyError) {
          addDebug(`Entreprise trouvée: ${company.name}`)
          addDebug('Redirection vers /dashboard/company')
          
          // Test de redirection forcée
          setTimeout(() => {
            addDebug('Exécution de la redirection...')
            window.location.href = '/dashboard/company'
          }, 1000)
          
          setMessage({
            type: 'info',
            text: 'Connexion réussie ! Redirection vers le dashboard entreprise...'
          })
        } else {
          // Vérifier si c'est un client
          addDebug('Vérification client...')
          
          const { data: client, error: clientError } = await supabase
            .from('users')
            .select('id, first_name, last_name')
            .eq('id', data.user.id)
            .single()

          addDebug(`Recherche client: ${clientError ? 'NON TROUVÉ' : 'TROUVÉ'}`)
          
          if (client && !clientError) {
            addDebug(`Client trouvé: ${client.first_name} ${client.last_name}`)
            addDebug('Redirection vers /dashboard/client')
            
            // Test de redirection forcée
            setTimeout(() => {
              addDebug('Exécution de la redirection...')
              window.location.href = '/dashboard/client'
            }, 1000)
            
            setMessage({
              type: 'info',
              text: 'Connexion réussie ! Redirection vers le dashboard client...'
            })
          } else {
            addDebug('ERREUR: Aucun profil trouvé dans les tables')
            setMessage({
              type: 'error',
              text: 'Erreur: Aucun profil trouvé. Contactez le support.'
            })
          }
        }
      } else {
        addDebug('ERREUR: Aucun utilisateur dans la réponse')
        setErrors({ email: 'Erreur de connexion' })
      }
    } catch (error) {
      addDebug(`Exception: ${error}`)
      console.error('Erreur de connexion:', error)
      setErrors({ email: 'Une erreur est survenue' })
    } finally {
      setLoading(false)
    }
  }

  // Vérifier les paramètres URL
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search)
    const messageParam = urlParams.get('message')
    
    if (messageParam === 'confirmed' && !message) {
      setMessage({
        type: 'success',
        text: 'Email confirmé avec succès ! Vous pouvez maintenant vous connecter.'
      })
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
          
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Connexion
          </h1>
          <p className="text-gray-600">
            Accédez à votre espace SkipLine
          </p>
        </div>

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="mb-6 p-4 bg-gray-100 rounded-xl max-h-40 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-2">Debug:</h3>
            {debugInfo.map((info, index) => (
              <p key={index} className="text-xs text-gray-600">{info}</p>
            ))}
          </div>
        )}

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

        {/* Test de redirection manuelle */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-700 mb-2">Test de redirection manuelle :</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.href = '/dashboard/client'}
              className="w-full text-left text-sm text-blue-600 underline"
            >
              → Aller au dashboard client
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard/company'}
              className="w-full text-left text-sm text-blue-600 underline"
            >
              → Aller au dashboard entreprise
            </button>
          </div>
        </div>

        <Card>
          <Card.Content>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-violet-600 mr-2" />
                  Se souvenir de moi
                </label>
                <Link href="/auth/forgot-password" className="text-violet-600 hover:text-violet-800">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Se connecter
              </Button>
            </form>
          </Card.Content>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Pas encore de compte ?{' '}
            <Link href="/auth/register" className="text-violet-600 hover:text-violet-800 font-semibold">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
