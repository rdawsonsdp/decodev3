/**
 * Copyright © 2025 The Cardology Advantage. All rights reserved.
 * 
 * This component provides an interactive flippable card interface for displaying
 * birth card information with front and back views.
 */

'use client'

import { useState } from 'react'
import { getCardImage } from '@/utils/getCardImage'
import CardModal from './CardModal'

interface FlippableCardProps {
  card: string
  type: 'birth' | 'forecast' | 'planetary'
  label?: string
  className?: string
  personData?: any
  size?: 'normal' | 'small'
  title?: string
}

export default function FlippableCard({ 
  card, 
  type, 
  label, 
  className = '', 
  personData,
  size = 'normal',
  title
}: FlippableCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    setIsModalOpen(true)
    // Haptic feedback for mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const getCardDescription = () => {
    // This will be handled by the CardModal component
    return ''
  }

  const cardImageSrc = getCardImage(card)

  const cardSizeClass = size === 'small' ? 'w-20 h-28' : 'w-full h-full'
  const textSizeClass = size === 'small' ? 'text-xs' : 'text-lg'
  const textPaddingClass = size === 'small' ? 'inset-y-1 inset-x-[8px]' : 'inset-y-2 inset-x-[15px]'

  return (
    <>
      <div 
        className={`card-container mx-auto mb-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl card-shimmer card-glow mobile-feedback fade-in ${className}`}
        onClick={handleCardClick}
      >
        <div className="card-inner">
          {/* Card Back */}
          <div className="card-face card-face-back">
            <div className={`${cardSizeClass} rounded-lg shadow-md bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative overflow-hidden`}>
              <div className={`absolute ${textPaddingClass} flex flex-col justify-center text-white text-left`}>
                <h5 className={`${textSizeClass} font-bold mb-1`}>{label || type}</h5>
                {size === 'normal' && (
                  <>
                    <p className="text-[17px] leading-tight mb-1">Click to view details</p>
                    <p className="text-[17px] italic opacity-90">Tap to explore this card's meaning</p>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Card Front */}
          <div className="card-face card-face-front">
            <img
              src={cardImageSrc || '/placeholder.svg'}
              alt={card}
              className={`${cardSizeClass} object-contain rounded-lg`}
            />
          </div>
        </div>
      </div>

      <CardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        card={card}
        type={type}
        personData={personData}
        title={title}
      />
    </>
  )
}
