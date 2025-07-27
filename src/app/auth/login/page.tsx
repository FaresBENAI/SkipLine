'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, Eye, EyeOff, LogIn, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { isValidEmail } from '@/lib/utils'
import type { AuthFormData } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      console.log('🔍 Vérification session existante...')
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        console.log('✅ Session trouvée:', session.user.email)
        await redirectToCorrectDashboard(session.user.id)
      } else {
        console.log('❌ Aucune session existante')
      }
    }

    checkSession()

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const messageParam = urlParams.get('message')
      const errorParam = urlParams.get('error')
      
      if (messageParam === 'confirmed') {
        setMessage({
          type: 'success',
          text: 'Email confirmé avec succès ! Vous pouvez maintenant vous connecter.'
        })
      } else if (errorParam === 'callback') {
        setMessage({
          type: 'error',
          text: 'Erreur lors de la confirmation. Veuillez réessayer.'
        })
      } else if (errorParam === 'no-profile') {
        setMessage({
          type: 'error',
          text: 'Aucun profil trouvé. Veuillez créer un nouveau compte.'
        })
      }
    }
  }, [])

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

  const redirectToCorrectDashboard = async (userId: string) => {
    try {
      console.log('🔍 Recherche du profil pour:', userId)
      
      // Vérifier si c'est une entreprise
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, name, email')
        .eq('id', userId)
        .single()

      console.log('Recherche entreprise:', { company, companyError })

      if (company && !companyError) {
        console.log('✅ Entreprise trouvée, redirection vers /dashboard/company')
        router.replace('/dashboard/company')
        return
      }

      // Vérifier si c'est un client
      const { data: client, error: clientError } = await supabase
        .from('users')
        .select('id, first_name, last_name, email')
        .eq('id', userId)
        .single()

      console.log('Recherche client:', { client, clientError })

      if (client && !clientError) {
        console.log('✅ Client trouvé, redirection vers /dashboard/client')
        router.replace('/dashboard/client')
        return
      }

      // Si aucun profil trouvé
      console.log('❌ Aucun profil trouvé')
      await supabase.auth.signOut()
      setMessage({
        type: 'error',
        text: 'Aucun profil trouvé. Veuillez créer un nouveau compte.'
      })
      
    } catch (error) {
      console.error('❌ Erreur lors de la détermination du type d\'utilisateur:', error)
      await supabase.auth.signOut()
      setMessage({
        type: 'error',
        text: 'Erreur lors de la connexion. Veuillez réessayer.'
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('🚀 Tentative de connexion pour:', formData.email)
    
    if (!validateForm()) return

    setLoading(true)
    setMessage(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      console.log('Résultat connexion:', { data: data?.user?.email, error })

      if (error) {
        console.error('❌ Erreur connexion:', error)
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
        console.log('✅ Connexion réussie pour:', data.user.email)
        await redirectToCorrectDashboard(data.user.id)
      } else {
        console.error('❌ Aucun utilisateur dans la réponse')
        setErrors({ email: 'Erreur de connexion' })
      }
    } catch (error) {
      console.error('❌ Erreur de connexion:', error)
      setErrors({ email: 'Une erreur est survenue' })
    } finally {
      setLoading(false)
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

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-700' 
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
