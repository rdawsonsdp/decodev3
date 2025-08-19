'use client'

import React from 'react'

interface CorrectedBirthCardSpreadProps {
  childData: { name: string; birthdate: string }
  onBack?: () => void
}

export default function CorrectedBirthCardSpread({ childData, onBack }: CorrectedBirthCardSpreadProps) {
  return (
    <div className="p-4">
      {onBack && (
        <button onClick={onBack} className="mb-4 underline">
          Back
        </button>
      )}
      <p className="mb-2 font-semibold">{childData.name}</p>
      <p>{childData.birthdate}</p>
    </div>
  )
}
