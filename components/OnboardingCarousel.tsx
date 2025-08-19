'use client'

import React from 'react'

interface OnboardingCarouselProps {
  onComplete: () => void
}

export default function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  return (
    <div className="p-4 text-center space-y-4">
      <p>Welcome to the app. Click below to begin.</p>
      <button onClick={onComplete} className="px-4 py-2 border">
        Get Started
      </button>
    </div>
  )
}
