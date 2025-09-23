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
  const [childData, setChildData] = useState<{ name: string; birthdate: string } | null>(null)

  const handleFormSubmit = (data: { name: string; birthdate: string }) => {
    setChildData(data)
  }

  const handleBackToForm = () => {
    setChildData(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {!childData ? (
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
  )
}