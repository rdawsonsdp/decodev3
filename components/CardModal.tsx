'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getCardImage } from '@/utils/getCardImage'

interface CardModalProps {
  card: string
  type: 'birth' | 'forecast' | 'planetary'
  isOpen: boolean
  onClose: () => void
}

export default function CardModal({ card, type, isOpen, onClose }: CardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [cardText, setCardText] = useState('')

  const cardImageSrc = getCardImage(card)

  useEffect(() => {
    if (isOpen && card) {
      setIsFlipped(false)
      ;(async () => {
        try {
          const profileRes = await fetch('/card-data/profiles.json')
          const activityRes = await fetch('/card-data/activities.json')
          const profileData = await profileRes.json()
          const activityData = await activityRes.json()
          const cleanCard = card.trim()

          if (type === 'birth' && profileData[cleanCard]) {
            const p = profileData[cleanCard]
            setProfile(p)
            setCardText(
              [p.description, p.genius, p.encourage, p.soothe]
                .filter(Boolean)
                .join('\n\n')
            )
          } else if (
            (type === 'planetary' || type === 'forecast') &&
            activityData[cleanCard]
          ) {
            setProfile({ title: cleanCard })
            setCardText(activityData[cleanCard])
          } else {
            setCardText('No description found for this card.')
          }
        } catch (err) {
          console.error('Failed to load card data', err)
          setCardText('Error loading description.')
        }
      })()
    }
  }, [card, type, isOpen])

  const handleFlip = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
    const audio = new Audio('/flip-sound.mp3')
    audio.play().catch(() => {}) // ignore autoplay errors
    setIsFlipped(!isFlipped)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[260px] h-[360px] sm:w-[320px] sm:h-[440px] card-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}
          onClick={handleFlip}
        >
          {/* Front Side */}
          <div className="card-face card-face-front">
            <img
              src={cardImageSrc}
              alt="Card"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Back Side */}
          <div className="card-face card-face-back p-4 bg-white rounded-lg shadow-lg">
            <div
              style={{
                overflowY: 'auto',
                maxHeight: '90%',
                paddingRight: '8px',
              }}
            >
              <h2 className="font-semibold text-lg mb-2">{profile?.title}</h2>
              <p className="text-sm whitespace-pre-line">{cardText}</p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-400"
        aria-label="Close"
      >
        <X size={28} />
      </button>
    </div>
  )
}
