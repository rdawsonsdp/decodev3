'use client'

import Link from 'next/link'
import Pricing from '@/components/Pricing'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6">
        <Link href="/">
          <button className="mb-4 underline">Back to Home</button>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Pricing Plans</h1>
          <p className="text-gray-600">Choose the perfect plan for your family's journey</p>
        </div>
        
        <Pricing />
      </div>
    </div>
  )
}
