'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Star,
  Brain,
} from 'lucide-react'

interface OnboardingCarouselProps {
  onComplete: () => void
}

const slides = [
  {
    title: 'Decode Your Kid',
    body: 'A gentle, emotionally-attuned guide powered by Cardology.',
    icon: Sparkles,
  },
  {
    title: 'Understand Their Blueprint',
    body: 'Birth card, yearly outlook, and planetary periods—translated into plain parenting language.',
    icon: Heart,
  },
  {
    title: 'Real-World Support',
    body: 'Practical suggestions for soothing, celebrating, and guiding your child day-to-day.',
    icon: Brain,
  },
  {
    title: 'Let’s Start',
    body: 'Tell us your child’s name and birthdate to reveal their reading.',
    icon: Star,
  },
]

export default function OnboardingCarousel({
  onComplete,
}: OnboardingCarouselProps) {
  const [current, setCurrent] = useState(0)
  const Icon = slides[current].icon

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0 bg-white/90" style={{ zIndex: 1 }}>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {slides[current].title}
              </h2>
            </div>
            <p className="text-gray-700 mb-8">{slides[current].body}</p>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>

              <div className="flex items-center gap-3">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={
                      'inline-block h-2 w-2 rounded-full transition-all ' +
                      (i === current ? 'bg-purple-600 w-6' : 'bg-gray-300')
                    }
                  />
                ))}
              </div>

              <Button
                onClick={() => {
                  if (current === slides.length - 1) {
                    onComplete()
                  } else {
                    setCurrent((c) => c + 1)
                  }
                }}
                className="flex items-center gap-1"
              >
                {current === slides.length - 1 ? 'Get Started' : 'Next'}{' '}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skip button under the carousel, per spec */}
        <div className="text-center mt-4">
          <button
            onClick={onComplete}
            className="text-sm text-gray-600 underline hover:text-gray-900"
            aria-label="Skip"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
