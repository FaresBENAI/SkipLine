'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, X, QrCode, Zap, Users, Clock, Smartphone, ArrowRight, CheckCircle, Building, User, Camera, Bell, Shield, Sparkles } from 'lucide-react'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: QrCode,
      title: "QR Code intelligent",
      description: "Chaque entreprise reçoit un QR code unique. Les clients le scannent pour accéder instantanément aux files d'attente disponibles."
    },
    {
      icon: Users,
      title: "Gestion des files",
      description: "Créez plusieurs files, gérez les capacités, pausez/reprenez selon vos besoins. Contrôle total depuis votre dashboard."
    },
    {
      icon: Bell,
      title: "Notifications temps réel",
      description: "Vos clients sont prévenus par SMS ou email quand leur tour approche. Plus d'attente passive !"
    },
    {
      icon: Camera,
      title: "Scanner intégré",
      description: "Interface caméra intégrée pour scanner les QR codes clients ou ajouter rapidement des personnes en file."
    }
  ]

  const howItWorks = [
    {
      step: 1,
      title: "L'entreprise s'inscrit",
      description: "Création du compte entreprise et génération automatique du QR code unique",
      icon: Building,
      color: "violet" as const
    },
    {
      step: 2,
      title: "Le client scanne",
      description: "Le client scanne le QR code de l'entreprise avec son téléphone",
      icon: QrCode,
      color: "cyan" as const
    },
    {
      step: 3,
      title: "Choix de la file",
      description: "Sélection de la file d'attente et saisie des informations de contact",
      icon: Users,
      color: "emerald" as const
    },
    {
      step: 4,
      title: "Suivi en temps réel",
      description: "Position mise à jour automatiquement + notifications d'avancement",
      icon: Smartphone,
      color: "violet" as const
    }
  ]

  const clientTypes = [
    {
      icon: User,
      title: "Clients enregistrés",
      description: "Profil complet avec QR code personnel",
      features: ["QR code personnel", "Historique des visites", "Notifications préférées", "Ajout rapide par scan"]
    },
    {
      icon: Smartphone,
      title: "Clients occasionnels", 
      description: "Accès simple sans inscription",
      features: ["Scan QR entreprise", "Saisie nom + contact", "Notifications SMS/email", "Ajout manuel possible"]
    }
  ]

  return (
    <div className="bg-gradient-to-br from-violet-50 via-cyan-50 to-emerald-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-violet-600 to-cyan-600 p-2 rounded-xl">
                <QrCode className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">
                QueueSaaS
              </span>
            </Link>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                Fonctionnalités
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                Comment ça marche
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-violet-600 transition-colors font-medium">
                Tarifs
              </Link>
            </nav>

            {/* Actions Desktop */}
            <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
              <Link href="/auth/login">
                <button className="text-violet-600 hover:text-violet-800 px-4 py-2 border-2 border-violet-200 rounded-xl hover:bg-violet-50 transition-all font-medium text-sm">
                  Connexion
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Commencer
                </button>
              </Link>
            </div>

            {/* Menu Mobile */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-violet-50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Menu Mobile Dropdown */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-white/90 backdrop-blur-sm border-b border-gray-200/50 shadow-lg">
              <div className="px-3 py-4 space-y-3">
                <Link href="#features" className="block px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                  Fonctionnalités
                </Link>
                <Link href="#how-it-works" className="block px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                  Comment ça marche
                </Link>
                <Link href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all">
                  Tarifs
                </Link>
                <div className="pt-3 border-t border-gray-200/50 space-y-2">
                  <Link href="/auth/login" className="block">
                    <button className="text-violet-600 hover:text-violet-800 px-4 py-2 border-2 border-violet-200 rounded-xl hover:bg-violet-50 transition-all font-medium text-sm w-full">
                      Connexion
                    </button>
                  </Link>
                  <Link href="/auth/register" className="block">
                    <button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm w-full flex items-center justify-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Commencer
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-20 sm:pt-32 pb-16 sm:pb-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              
              {/* Left Column - Text Content */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6">
                  <span className="gradient-text">Digitalisez</span>
                  <br />
                  vos files d'attente
                </h1>
                
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl">
                  Transformez l'expérience d'attente de vos clients avec notre solution moderne par QR code. 
                  <span className="font-semibold text-gray-700"> Simple, efficace et sans contact.</span>
                </p>

                {/* Value Props */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Configuration en 2 minutes</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Notifications temps réel pour vos clients</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-gray-700">Scanner intégré pour une gestion facile</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12">
                  <Link href="/auth/register">
                    <button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-base w-full sm:w-auto flex items-center justify-center">
                      <QrCode className="h-5 w-5 mr-2" />
                      Commencer gratuitement
                    </button>
                  </Link>
                  
                  <Link href="#demo">
                    <button className="text-violet-600 hover:text-violet-800 px-6 py-3 border-2 border-violet-200 rounded-xl hover:bg-violet-50 transition-all font-semibold text-base w-full sm:w-auto flex items-center justify-center">
                      Voir la démo
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 sm:gap-8">
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">2min</div>
                    <div className="text-xs sm:text-sm text-gray-600">Configuration</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">0€</div>
                    <div className="text-xs sm:text-sm text-gray-600">Pour commencer</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text">100%</div>
                    <div className="text-xs sm:text-sm text-gray-600">Sans contact</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Demo */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Main Phone Mockup */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all w-64 sm:w-80 p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                      {/* QR Code Visual */}
                      <div className="flex justify-center">
                        <div className="bg-gradient-to-r from-violet-100 to-cyan-100 p-4 sm:p-6 rounded-2xl">
                          <QrCode className="h-16 w-16 sm:h-20 sm:w-20 text-violet-600" />
                        </div>
                      </div>
                      
                      {/* Queue Info */}
                      <div className="text-center space-y-2 sm:space-y-3">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base">Boulangerie Martin</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Service client</p>
                        
                        {/* Position in Queue */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-xl border border-emerald-200/50">
                          <div className="text-lg sm:text-xl font-bold text-emerald-700">Position #3</div>
                          <div className="text-xs sm:text-sm text-emerald-600">~8 minutes d'attente</div>
                        </div>
                      </div>
                      
                      {/* Features Icons */}
                      <div className="flex justify-around pt-2 sm:pt-4">
                        <div className="text-center">
                          <div className="bg-violet-100 p-2 rounded-lg mb-1 sm:mb-2">
                            <Users className="h-4 w-4 text-violet-600" />
                          </div>
                          <div className="text-xs text-gray-600">Queue</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-cyan-100 p-2 rounded-lg mb-1 sm:mb-2">
                            <Clock className="h-4 w-4 text-cyan-600" />
                          </div>
                          <div className="text-xs text-gray-600">Temps</div>
                        </div>
                        <div className="text-center">
                          <div className="bg-emerald-100 p-2 rounded-lg mb-1 sm:mb-2">
                            <Smartphone className="h-4 w-4 text-emerald-600" />
                          </div>
                          <div className="text-xs text-gray-600">Mobile</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-emerald-100 text-emerald-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium animate-pulse">
                    En temps réel
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-violet-100 text-violet-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    Sans contact
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="how-it-works" className="py-16 sm:py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Un processus simple en 4 étapes pour révolutionner vos files d'attente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon
                
                // Définition stricte des couleurs avec types
                const getColorClasses = (color: "violet" | "cyan" | "emerald") => {
                  switch(color) {
                    case "violet":
                      return {
                        iconBg: "bg-violet-100",
                        iconText: "text-violet-600",
                        gradientFrom: "from-violet-500",
                        gradientTo: "to-violet-600"
                      }
                    case "cyan":
                      return {
                        iconBg: "bg-cyan-100",
                        iconText: "text-cyan-600",
                        gradientFrom: "from-cyan-500",
                        gradientTo: "to-cyan-600"
                      }
                    case "emerald":
                      return {
                        iconBg: "bg-emerald-100",
                        iconText: "text-emerald-600",
                        gradientFrom: "from-emerald-500",
                        gradientTo: "to-emerald-600"
                      }
                  }
                }
                
                const colors = getColorClasses(step.color)
                
                return (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.iconBg} ${colors.iconText} mb-4`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${colors.gradientFrom} ${colors.gradientTo} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center`}>
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {step.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Types de clients */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
                Pour tous vos clients
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Que vos clients soient habitués ou occasionnels, notre solution s'adapte
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {clientTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-to-r from-violet-100 to-cyan-100 p-3 rounded-xl mr-4">
                        <IconComponent className="h-8 w-8 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {type.title}
                        </h3>
                        <p className="text-gray-600">
                          {type.description}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-3">
                      {type.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Fonctionnalités principales */}
        <section id="features" className="py-16 sm:py-24 bg-white/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
                Fonctionnalités puissantes
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
                Tout ce dont vous avez besoin pour gérer vos files d'attente efficacement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all p-6 sm:p-8">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-r from-violet-100 to-cyan-100 p-3 rounded-xl flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto text-center px-3 sm:px-6 lg:px-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all p-8 sm:p-12">
              <Sparkles className="h-12 w-12 text-violet-600 mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-4">
                Prêt à révolutionner vos files d'attente ?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Rejoignez les entreprises qui ont déjà adopté la solution moderne de gestion des files d'attente
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-lg w-full sm:w-auto flex items-center justify-center">
                    <QrCode className="h-6 w-6 mr-2" />
                    Commencer maintenant
                  </button>
                </Link>
                
                <Link href="#contact">
                  <button className="text-violet-600 hover:text-violet-800 px-8 py-4 border-2 border-violet-200 rounded-xl hover:bg-violet-50 transition-all font-semibold text-lg w-full sm:w-auto">
                    Nous contacter
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
