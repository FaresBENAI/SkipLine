'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Building, User, ArrowLeft } from 'lucide-react'
import { Button, Input, Card } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function CompleteProfile() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userType, setUserType] = useState<'company' | 'client' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    first_name: '',
    last_name: ''
  })
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.replace('/auth/login')
        return
      }
      
      setUser(session.user)
      setLoading(false)
    }
    
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userType || !user) return

    setIsSubmitting(true)

    try {
      if (userType === 'company') {
        const { error } = await supabase
          .from('companies')
          .insert({
            id: user.id,
            email: user.email,
            name: formData.name,
            phone: formData.phone || '',
            address: formData.address || '',
            qr_code: `COMP_${user.id.slice(0, 8)}`
          })

        if (error) throw error
        router.replace('/dashboard/company')
        
      } else {
        const { error } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone: formData.phone || '',
            qr_code: `USER_${user.id.slice(0, 8)}`
          })

        if (error) throw error
        router.replace('/dashboard/client')
      }
    } catch (error) {
      console.error('Erreur création profil:', error)
      alert('Erreur lors de la création du profil')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/auth/login" className="inline-flex items-center space-x-2 mb-6 text-violet-600 hover:text-violet-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-3 rounded-2xl">
              <QrCode className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">Complétez votre profil</h1>
          <p className="text-gray-600 mb-2">
            Nous avons besoin de quelques informations supplémentaires
          </p>
          <p className="text-sm text-gray-500">
            Connecté en tant que: {user?.email}
          </p>
        </div>

        <Card>
          <Card.Content>
            {!userType ? (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center mb-6">Vous êtes :</h2>
                
                <Button
                  onClick={() => setUserType('company')}
                  className="w-full h-16 text-left justify-start"
                  variant="outline"
                >
                  <Building className="h-6 w-6 mr-3" />
                  <div>
                    <div className="font-semibold">Une entreprise</div>
                    <div className="text-sm text-gray-500">
                      Gérer des files d'attente
                    </div>
                  </div>
                </Button>

                <Button
                  onClick={() => setUserType('client')}
                  className="w-full h-16 text-left justify-start"
                  variant="outline"
                >
                  <User className="h-6 w-6 mr-3" />
                  <div>
                    <div className="font-semibold">Un client</div>
                    <div className="text-sm text-gray-500">
                      Rejoindre des files d'attente
                    </div>
                  </div>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {userType === 'company' ? (
                  <>
                    <Input
                      label="Nom de l'entreprise"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Mon Entreprise"
                    />
                    
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="01 23 45 67 89"
                    />
                    
                    <Input
                      label="Adresse"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 rue de la Paix, Paris"
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Prénom"
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                      placeholder="Jean"
                    />
                    
                    <Input
                      label="Nom"
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Dupont"
                    />
                    
                    <Input
                      label="Téléphone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="01 23 45 67 89"
                    />
                  </>
                )}

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setUserType(null)}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    Continuer
                  </Button>
                </div>
              </form>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
