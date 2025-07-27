'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { QrCode, Eye, EyeOff, UserPlus, ArrowLeft, Building, User } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import { isValidEmail, validatePassword, generateQRCode } from '@/lib/utils'
import type { AuthFormData, UserType } from '@/types'

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>('company')
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    // Entreprise
    companyName: '',
    phone: '',
    address: '',
    // Client
    firstName: '',
    lastName: ''
  })
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Effacer l'erreur si elle existe
    if (errors[name as keyof AuthFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {}

    // Validation commune
    if (!formData.email) {
      newErrors.email = 'L\'email est requis'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else {
      const passwordValidation = validatePassword(formData.password)
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    // Validation spécifique selon le type
    if (userType === 'company') {
      if (!formData.companyName) {
        newErrors.companyName = 'Le nom de l\'entreprise est requis'
      }
    } else {
      if (!formData.firstName) {
        newErrors.firstName = 'Le prénom est requis'
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Le nom est requis'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      // 1. Créer le compte utilisateur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })

      if (authError) {
        setErrors({ email: authError.message })
        return
      }

      if (!authData.user) {
        setErrors({ email: 'Erreur lors de la création du compte' })
        return
      }

      // 2. Insérer dans la table appropriée
      const qrCode = generateQRCode(userType === 'company' ? 'COMP' : 'USER')

      if (userType === 'company') {
        const { error: companyError } = await supabase
          .from('companies')
          .insert([{
            id: authData.user.id,
            name: formData.companyName!,
            email: formData.email,
            phone: formData.phone || null,
            address: formData.address || null,
            qr_code: qrCode,
            avatar_type: 'default'
          }])

        if (companyError) {
          console.error('Erreur insertion entreprise:', companyError)
          setErrors({ companyName: 'Erreur lors de la création de l\'entreprise' })
          return
        }
      } else {
        const { error: userError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            first_name: formData.firstName!,
            last_name: formData.lastName!,
            email: formData.email,
            phone: formData.phone || null,
            qr_code: qrCode,
            avatar_type: 'default'
          }])

        if (userError) {
          console.error('Erreur insertion utilisateur:', userError)
          setErrors({ firstName: 'Erreur lors de la création du profil' })
          return
        }
      }

      // 3. Redirection
      router.push('/dashboard')
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      setErrors({ email: 'Une erreur est survenue' })
    } finally {
      setLoading(false)
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
            Créer un compte
          </h1>
          <p className="text-gray-600">
            Rejoignez SkipLine dès maintenant
          </p>
        </div>

        <Card>
          <Card.Content>
            {/* Sélecteur de type d'utilisateur */}
            <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setUserType('company')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                  userType === 'company'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Building className="h-4 w-4" />
                <span>Entreprise</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all ${
                  userType === 'client'
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Client</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Champs spécifiques selon le type */}
              {userType === 'company' ? (
                <>
                  <Input
                    label="Nom de l'entreprise"
                    type="text"
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleInputChange}
                    error={errors.companyName}
                    placeholder="Mon Entreprise"
                  />
                  <Input
                    label="Téléphone (optionnel)"
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="+33 1 23 45 67 89"
                  />
                  <Input
                    label="Adresse (optionnel)"
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    error={errors.address}
                    placeholder="123 Rue de la République, 75001 Paris"
                  />
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Prénom"
                      type="text"
                      name="firstName"
                      value={formData.firstName || ''}
                      onChange={handleInputChange}
                      error={errors.firstName}
                      placeholder="Jean"
                    />
                    <Input
                      label="Nom"
                      type="text"
                      name="lastName"
                      value={formData.lastName || ''}
                      onChange={handleInputChange}
                      error={errors.lastName}
                      placeholder="Dupont"
                    />
                  </div>
                  <Input
                    label="Téléphone (optionnel)"
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    error={errors.phone}
                    placeholder="+33 6 12 34 56 78"
                  />
                </>
              )}

              {/* Champs communs */}
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
                  autoComplete="new-password"
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

              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword || ''}
                  onChange={handleInputChange}
                  error={errors.confirmPassword}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" className="text-violet-600 hover:text-violet-800">
                  conditions d'utilisation
                </Link>{' '}
                et notre{' '}
                <Link href="/privacy" className="text-violet-600 hover:text-violet-800">
                  politique de confidentialité
                </Link>
                .
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
                size="lg"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Créer mon compte
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Lien vers connexion */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/auth/login" className="text-violet-600 hover:text-violet-800 font-semibold">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
