'use client'

import { useState } from 'react'
import NameAndBirthdateForm from '@/components/NameAndBirthdateForm'
import CorrectedBirthCardSpread from '@/components/CorrectedBirthCardSpread'
import OnboardingCarousel from '@/components/OnboardingCarousel'
import ShareButtons from '@/components/ShareButtons'

export default function Home() {
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
    <main>
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
  )

}