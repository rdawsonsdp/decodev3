'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getCardImage } from '@/utils/getCardImage'

interface CardModalProps {
  card: string
  type: 'birth' | 'forecast' | 'planetary'
  isOpen: boolean
  onClose: () => void
  personData?: any
}

export default function CardModal({ card, type, isOpen, onClose, personData }: CardModalProps) {
  const [profile, setProfile] = useState<any>(null)
  const [cardText, setCardText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const cardImageSrc = getCardImage(card)

  useEffect(() => {
    if (isOpen && card) {
      setIsLoading(true)
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
              [
                p.description,
                p.genius,
                p.encourage,
                p.soothe,
              ]
                .filter(Boolean)
                .join('\n\n')
            )
          } else if (
            (type === 'planetary' || type === 'forecast') &&
            activityData[cleanCard]
          ) {
            setProfile({ title: cleanCard })
            // Clean up the text by replacing literal \n with actual line breaks
            const rawText = activityData[cleanCard]
            const cleanedText = rawText.replace(/\\n/g, '\n')
            setCardText(cleanedText)
          } else {
            setCardText('No description found for this card.')
          }
        } catch (err) {
          console.error('Failed to load card data', err)
          setCardText('Error loading description.')
        } finally {
          setIsLoading(false)
        }
      })()
    }
  }, [card, type, isOpen])

  if (!isOpen) return null

  const getModalTitle = () => {
    switch (type) {
      case 'birth':
        return 'Birth Card'
      case 'forecast':
        return 'Forecast Card'
      case 'planetary':
        return 'Planetary Card'
      default:
        return 'Card Details'
    }
  }

  const getCardLabel = () => {
    return card.toUpperCase()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">{getModalTitle()}</h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-card-container">
            {/* Modal Card Front */}
            <div className="modal-card-front">
              <img
                src={cardImageSrc || '/placeholder.svg'}
                alt={card}
                className="modal-card-image"
              />
              <div className="modal-card-label">{getCardLabel()}</div>
            </div>

            {/* Modal Card Back */}
            <div className="modal-card-back">
              {isLoading ? (
                <div className="modal-description">
                  <div className="modal-description-line">Loading card details...</div>
                </div>
              ) : (
                <div className="modal-description">
                  {cardText.split('\n').map((line, index) => (
                    <div key={index} className="modal-description-line">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}