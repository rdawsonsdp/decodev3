'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { getCardImage } from '@/utils/getCardImage'

interface BirthCardModalProps card: string
  isOpen: boolean
  onClose: () => void
}

export default function BirthCardModal({ card, isOpen, onClose }: BirthCardModalProps) const cardImage = getCardImage(card)

  const getCardMeaning = (cardName: string) => // This would normally come from a database or API
    return (keywords: ['Leadership', 'Independence', 'Creativity', 'Innovation'],
      strengths: [
        'Natural born leader with strong initiative',
        'Creative problem-solving abilities',
        'Independent and self-reliant nature',
        'Excellent communication skills'
      ],
      challenges: [
        'May struggle with patience and waiting',
        'Can be impulsive in decision making',
        'Might have difficulty accepting help from others',
        'May need to work on collaborative skills'
      ],
      parenting_tips: [
        'Provide opportunities for leadership roles',
        'Encourage creative expression and artistic pursuits',
        'Set clear boundaries while allowing independence',
        'Teach patience through structured activities'
      ]
    }
  }

  const meanin

  const cardImageSrc = getCardImage(card)

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-[260px] h-[360px] sm:w-[320px] sm:h-[440px] perspective" onClick={handleCardClick}>
        <div className={\`transition-transform duration-700 transform-style-preserve-3d w-full h-full relative \${isFlipped ? 'rotate-y-180' : ''}\`}>
          {/* Front Side */}
          <div className="absolute w-full h-full backface-hidden rounded-lg shadow-lg overflow-hidden">
            <img src={cardImageSrc} alt="Card" className="w-full h-full object-contain" />
          </div>

          {/* Back Side */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg shadow-lg bg-white text-black overflow-y-auto p-4 text-sm max-h-full">
            <div style={{ overflowY: 'auto', maxHeight: '90%', paddingRight: '8px' }}>
              <h2 className="font-semibold text-lg mb-2">{profile?.title}</h2>
              <p>{cardText}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-red-400">
        <X size={28} />
      </button>
    </div>
  )

