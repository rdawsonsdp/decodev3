'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/firebase/AuthContext'
import AuthGuard from '@/components/auth/AuthGuard'
import Navigation from '@/components/Navigation'
import NameAndBirthdateForm from '@/components/NameAndBirthdateForm'
import CorrectedBirthCardSpread from '@/components/CorrectedBirthCardSpread'
import OnboardingCarousel from '@/components/OnboardingCarousel'
import ShareButtons from '@/components/ShareButtons'
import Footer from '@/components/Footer'

export default function Home() {
  const { user } = useAuth()
  const [childData, setChildData] = useState<{ name: string; birthdate: string } | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  const handleFormSubmit = (data: { name: string; birthdate: string }) => {
    setChildData(data)
    setShowOnboarding(false)
  }

  const handleBackToForm = () => {
    setChildData(null)
    setShowOnboarding(true)
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="container mx-auto px-4 py-8">
          {showOnboarding && !childData ? (
            <OnboardingCarousel onComplete={() => setShowOnboarding(false)} />
          ) : !childData ? (
            <NameAndBirthdateForm onSubmit={handleFormSubmit} />
          ) : (
            <CorrectedBirthCardSpread childData={childData} onBack={handleBackToForm} />
          )}
          
          {/* Share Buttons - Add at bottom of page */}
          {childData && (
            <ShareButtons 
              title="Decode Your Kid - Birth Card Reading"
              description={`Discover ${childData.name}'s unique personality and potential through their birth card reading`}
              cardData={{
                name: childData.name,
                birthdate: childData.birthdate
              }}
            />
          )}
        </main>
        
        {/* Footer with Copyright */}
        <Footer />
      </div>
    </AuthGuard>
  )
}